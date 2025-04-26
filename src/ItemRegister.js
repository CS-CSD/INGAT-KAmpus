import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./SideBar";
import "./css/ItemRegister.css";

const RegisterItem = () => {
  const [formData, setFormData] = useState({
    brand: "",
    type: "",
    color: "",
    locationFound: "",
    dateFound: "",
    timeFound: "",
    dateSurrendered: "",
    timeSurrendered: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      type: "",
      color: "",
      locationFound: "",
      dateFound: "",
      timeFound: "",
      dateSurrendered: "",
      timeSurrendered: "",
      description: "",
      image: null,
    });
  };

  const generateCustomUID = () => {
    const now = new Date();
    const year = now.getFullYear(); // e.g., 2025
    const month = String(now.getMonth() + 1).padStart(2, "0"); // e.g., 04

    const key = `counter_${year}${month}`; // unique key per month
    let counter = parseInt(localStorage.getItem(key)) || 1;

    const uid = `${year}${month}${String(counter).padStart(4, "0")}`; // e.g., 2025040001
    localStorage.setItem(key, counter + 1);

    return uid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const uid = generateCustomUID();
    const newItem = {
      ...formData,
      uid,
    };

    const saveItem = (itemToSave) => {
      const storedItems = JSON.parse(localStorage.getItem("items")) || [];
      storedItems.push(itemToSave);
      localStorage.setItem("items", JSON.stringify(storedItems));

      alert(`Item registered with ID: ${itemToSave.uid}`);
      resetForm();
      console.log("Item Registered:", itemToSave);
    };

    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newItem.image = reader.result;
        saveItem(newItem);
      };
      reader.readAsDataURL(formData.image);
    } else {
      saveItem(newItem);
    }
  };

  const locations = [
    "MB",
    "JRF",
    "JRN",
    "CB",
    "South Lounge",
    "Student Center",
    "Sports Complex",
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="ItemRegisterContent">
        <h1>Item Register</h1>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="columns">
            <div className="column1">
              <label className="label">Insert Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="column2">
              <label className="label">Brand</label>
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />

              <label className="label">Item Type</label>
              <input
                type="text"
                name="type"
                placeholder="Type"
                value={formData.type}
                onChange={handleChange}
                required
              />

              <label className="label">Color/s</label>
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
                required
              />

              <label className="label">Location Found</label>
              <select
                name="locationFound"
                value={formData.locationFound}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a location
                </option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

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

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <button type="submit">Register Item</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterItem;
