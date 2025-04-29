import React, { useState, useEffect } from "react";
import { supabase } from "./supabase"; // your supabase client
import Sidebar from "./SideBar";
import "./css/ClaimedItem.css";
import { useUser, useRole} from './userContext'; 

const ItemStorage = () => {
    const { userId } = useUser();
    const userRole = useRole();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // The item being claimed
  const [claimerInfo, setClaimerInfo] = useState('');
  const [timeClaimed, setTimeClaimed] = useState('');
  const [dateClaimed, setDateClaimed] = useState('');

  // Fetch data from Supabase
  useEffect(() => {
    fetchItems();
  }, []);

      const handleOpenModal = (item) => {
      setSelectedItem(item); // Set the selected item for the modal
      setClaimerInfo(''); // Reset claimer info
      setTimeClaimed(''); // Reset claim time
      setDateClaimed(''); // Reset claim date
      setShowModal(true); // Show the modal
    };
    const handleCloseModal = () => {
      setSelectedItem(null); // Clear selected item
      setClaimerInfo(''); // Reset claimer info
      setTimeClaimed(''); // Reset time
      setDateClaimed(''); // Reset date
      setShowModal(false); // Hide the modal
    };

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from("registered_items") // Make sure this name matches exactly
        .select("*")

      if (error) throw error;
      if (data) {
        setItems(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error.message);
      alert(error.message);
    }
  }

  // Handle marking the item as claimed
  // const markAsClaimed = (item) => {
  //   setSelectedItem(item); // Set the item being claimed
  //   setShowModal(true); // Show the modal
  // };

  // Handle form submission (updating claim data)
const handleSubmit = async (e) => {
  e.preventDefault();

  // Combine date and time fields into one datetime string
  const datetimeClaimed = `${dateClaimed} ${timeClaimed}`;

  try {
    const { error } = await supabase
      .from("claimed_items")
      .insert([
        {
          id:selectedItem.id,
          category: selectedItem.category,
          location_found: selectedItem.location_found,
          datetime_found: selectedItem.datetime_found,
          datetime_surrendered: selectedItem.datetime_surrendered,
          description: selectedItem.description,
          surrendered_by: selectedItem.surrendered_by,
          claim_status: "claimed",
          processed_by:selectedItem.processed_by,
          stored_in: selectedItem.stored_in,
          claimed_by: claimerInfo,
          claimed_dateTime: datetimeClaimed,
          claiming_processed_by: userId,
        },
      ]);

    if (error) throw error;

    await supabase
    .from("registered_items")
    .delete()
    .eq("id", selectedItem.id);
    // Close modal and reset state
    handleCloseModal();

    // Fetch updated items
    fetchItems();

  } catch (error) {
    console.error("Error marking item as claimed:", error.message);
    alert(error.message);
  }
};


  return (
    <div className="flex">
      <Sidebar />
      <div className="ClaimedItemContent">
        <h1>Stored Items</h1>
        {items.length === 0 ? (
          <p>No items registered yet.</p>
        ) : (
          <table className="item-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Location Found</th>
                <th>Date Found</th>
                <th>Date Surrendered</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.location_found}</td>
                  <td>{new Date(item.datetime_found).toLocaleString()}</td>
                  <td>{new Date(item.datetime_surrendered).toLocaleString()}</td>
                  <td>{item.description}</td>
                  <td>{item.claim_status}</td>
                  <td>
  <button onClick={() => handleOpenModal(item)}>Mark as Claimed</button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for claiming an item */}
      {
  showModal && (
    <div className="modal">
      <div className="modal-content">
        <h2>Mark Item as Claimed</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Claimer Info:</label>
            <input
              type="text"
              value={claimerInfo}
              onChange={(e) => setClaimerInfo(e.target.value)} // Updates the state
              placeholder="Enter claimer information"
            />
          </div>
          
          <div>
            <label>Claim Time:</label>
            <input
              type="time"
              value={timeClaimed}
              onChange={(e) => setTimeClaimed(e.target.value)} // Updates the state
            />
          </div>
          
          <div>
            <label>Claim Date:</label>
            <input
              type="date"
              value={dateClaimed}
              onChange={(e) => setDateClaimed(e.target.value)} // Updates the state
            />
          </div>

          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCloseModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}


      {/* Basic styling for modal */}
      <style>
        {`
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            width: 300px;
            text-align: center;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 100%;
          }

          button {
            padding: 10px;
            border: none;
            background-color: #007bff;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
          }

          button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </div>
  );
};

export default ItemStorage;
