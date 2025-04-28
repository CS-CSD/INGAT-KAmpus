import React, { useState, useEffect } from "react";
import { supabase } from "./supabase"; // your supabase client
import Sidebar from "./SideBar";
import "./css/ClaimedItem.css";

const StudentView = () => {
  const [items, setItems] = useState([]);

  // Fetch data from Supabase
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from("registered_items") // Make sure this name matches exactly
        .select("*");

      if (error) throw error;
      if (data) {
        setItems(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error.message);
      alert(error.message);
    }
  }

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
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{item.claim_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentView;
