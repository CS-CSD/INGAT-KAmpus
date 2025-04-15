import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import {supabase} from "./supabase";
import "./css/ClaimedItem.css"; // Import the CSS file (note the filename)

const ClaimedItem = () => {
  const [items, setItems] = useState([]);

  // Fetch data from Supabase
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from("registered_items") // Make sure this name matches exactly
        .select("*")
        .eq("status", "claimed");
  
      console.log("Fetched data:", data);
      console.log("Fetch error:", error);
  
      if (error) throw error;
      if (data) {
        setItems(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error.message);
      alert(error.message);
    }
  }
  
  
  
console.log (items);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ClaimedItemContent">
        <h1>Claimed Items</h1>
        {items.length === 0 ? (
          <p>No claimed items yet.</p>
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
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{item.location_found}</td>
                  <td>{new Date(item.datetime_found).toLocaleString()}</td>
                  <td>{new Date(item.datetime_surrendered).toLocaleString()}</td>
                  <td>{item.description}</td>
                  <td>{item.status}</td>
                  <td>
                    {/* {item.image && (
                      <img src={item.image} alt="Item" width="50" height="50" />
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClaimedItem;