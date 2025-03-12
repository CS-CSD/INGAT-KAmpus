import React, { useState } from "react";
import Sidebar from "./SideBar"; 
import "./css/ItemRegister.css";

const RegisterItem = () => {
  const [formData, setFormData] = useState({
    uid: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newItem = { ...formData };

    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newItem.image = reader.result;

        
        const storedItems = JSON.parse(localStorage.getItem("items")) || [];
        storedItems.push(newItem);
        localStorage.setItem("items", JSON.stringify(storedItems));

        alert("Item successfully registered!");

        
        setFormData({
          uid: "",
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
      reader.readAsDataURL(formData.image);
    } else {
      
      const storedItems = JSON.parse(localStorage.getItem("items")) || [];
      storedItems.push(newItem);
      localStorage.setItem("items", JSON.stringify(storedItems));

      alert("Item successfully registered!");

 
      setFormData({
        uid: "",
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
    }
  
    console.log("Item Registered:", newItem);
  };
  const locations = ["MB", "JRF", "JRN", "CB", "South Lounge", "Student Center","Sports Complex"];

  return (
<div className="flex">
  <Sidebar />
  <div className="ItemRegisterContent">
    <h1>Item Register</h1>
    <form onSubmit={handleSubmit} className="form-container">
      <div className="columns">
        <div className="column1">
          <label className="label">Insert Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="column2">
          <label className="label">Unique Identifier</label>
          <input type="text" name="uid" placeholder="UID" value={formData.uid} onChange={handleChange} required />

          <label className="label">Brand</label>
          <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />

          <label className="label">Item Type</label>
          <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />

          <label className="label">Color/s</label>
          <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} required />

          <label className="label">Location Found</label>
<select name="locationFound" value={formData.locationFound} onChange={handleChange} required>
  <option value="" disabled>Select a location</option>
  {locations.map((loc, index) => (
    <option key={index} value={loc}>{loc}</option>
  ))}
</select>

          <label className="label">Date Found</label>
          <input type="date" name="dateFound" value={formData.dateFound} onChange={handleChange} required />

          <label className="label">Time Found</label>
          <input type="time" name="timeFound" value={formData.timeFound} onChange={handleChange} required />

          <label className="label">Date Surrendered</label>
          <input type="date" name="dateSurrendered" value={formData.dateSurrendered} onChange={handleChange} required />

          <label className="label">Time Surrendered</label>
          <input type="time" name="timeSurrendered" value={formData.timeSurrendered} onChange={handleChange} required />

          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

          <button type="submit">Register Item</button>
        </div>
      </div>
    </form>
  </div>
</div>

  );
};

export default RegisterItem;
