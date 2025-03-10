import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar"; 
import "./css/ItemStorage.css";

const ItemStorage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(storedItems);
  }, []);

  const markAsClaimed = (index) => {
    const updatedItems = [...items];
    updatedItems[index].claimed = true;
    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="StoredContent">
        <h1>Stored Items</h1>
        {items.length === 0 ? (
          <p>No items registered yet.</p>
        ) : (
          <table className="item-table">
            <thead>
              <tr>
                <th>UID</th>
                <th>Brand</th>
                <th>Type</th>
                <th>Color</th>
                <th>Location Found</th>
                <th>Date Found</th>
                <th>Date Surrendered</th>
                <th>Description</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) =>
                !item.claimed ? ( 
                  <tr key={index}>
                    <td>{item.uid}</td>
                    <td>{item.brand}</td>
                    <td>{item.type}</td>
                    <td>{item.color}</td>
                    <td>{item.locationFound}</td>
                    <td>{item.dateFound}</td>
                    <td>{item.dateSurrendered}</td>
                    <td>{item.description}</td>
                    <td>
                      {item.image && <img src={item.image} alt="Item" width="50" height="50" />}
                    </td>
                    <td>
                      <button onClick={() => markAsClaimed(index)}>Mark as Claimed</button>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ItemStorage;
