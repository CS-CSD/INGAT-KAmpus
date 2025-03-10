import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar"; 


const ClaimedItems = () => {
  const [claimedItems, setClaimedItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    const filteredItems = storedItems.filter(item => item.claimed); 
    setClaimedItems(filteredItems);
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="MainContent">
        <h1>Claimed Items</h1>
        {claimedItems.length === 0 ? (
          <p>No claimed items yet.</p>
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
              </tr>
            </thead>
            <tbody>
              {claimedItems.map((item, index) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClaimedItems;
