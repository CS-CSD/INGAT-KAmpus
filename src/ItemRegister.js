import React, { useState } from "react";
import Sidebar from "./SideBar"; 
import "./css/ItemRegister.css"; // Ensure the CSS file is linked
import {supabase} from './supabase'; // Assuming you have your Supabase client set up

const RegisterItem = () => {
  const [formData, setFormData] = useState({
    category: "",
    locationFound: "",
    dateFound: "",
    timeFound: "",
    dateSurrendered: "",
    timeSurrendered: "",
    description: "",
    storedIn: "",  // Dropdown for storing location
    image: null,   // Optional image for the item
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = { ...formData };

    // Combine date and time for datetime fields
    const datetimeFound = `${newItem.dateFound} ${newItem.timeFound}`;
    const datetimeSurrendered = `${newItem.dateSurrendered} ${newItem.timeSurrendered}`;

    try {
      // Insert the item into the Supabase database
      const { data, error } = await supabase
        .from('registered_items')
        .insert([
          {
            category: newItem.category,
            location_found: newItem.locationFound,
            datetime_found: datetimeFound,
            datetime_surrendered: datetimeSurrendered,
            description: newItem.description,
            status: "Registered",  // Default status
            stored_in: newItem.storedIn,  // Storing location
            image_url: "", // If you want to handle the image separately, adjust here
          }
        ]);

      if (error) throw error;

      alert("Item successfully registered!");

      // Reset the form
      setFormData({
        category: "",
        locationFound: "",
        dateFound: "",
        timeFound: "",
        dateSurrendered: "",
        timeSurrendered: "",
        description: "",
        storedIn: "",
        image: null,
      });
    } catch (err) {
      console.error("Error registering item:", err.message);
      alert("Failed to register item!");
    }
  };

  // Dropdown options for storing location
  const storedLocations = ["Unknown", "MB", "JRF", "JRN", "CB", "South Lounge", "Student Center", "Sports Complex"];

  return (
    <div className="flex">
      <Sidebar />
      <div className="ItemRegisterContent">
        <h1>Item Register</h1>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="columns">
            <div className="column1">
              <label className="label">Insert Image (optional)</label>
              <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="column2">
              <label className="label">Item Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />

              <label className="label">Location Found</label>
              <input
                type="text"
                name="locationFound"
                placeholder="Location Found"
                value={formData.locationFound}
                onChange={handleChange}
                required
              />

              <label className="label">Date Found</label>
              <input
                type="date"
                name="dateFound"
                value={formData.dateFound}
                onChange={handleChange}
                required
              />

              <label className="label">Time Found</label>
              <input
                type="time"
                name="timeFound"
                value={formData.timeFound}
                onChange={handleChange}
                required
              />

              <label className="label">Date Surrendered</label>
              <input
                type="date"
                name="dateSurrendered"
                value={formData.dateSurrendered}
                onChange={handleChange}
                required
              />

              <label className="label">Time Surrendered</label>
              <input
                type="time"
                name="timeSurrendered"
                value={formData.timeSurrendered}
                onChange={handleChange}
                required
              />

              <label className="label">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <label className="label">Stored In</label>
              <select
                name="storedIn"
                value={formData.storedIn}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select storage location</option>
                {storedLocations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>

              <button type="submit">Register Item</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterItem;
