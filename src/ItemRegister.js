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

  return (
    <div className="flex">
      <Sidebar />
      <div className="ItemRegisterContent">
        <h1>Item Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
          <input type="text" name="uid" placeholder="UID" value={formData.uid} onChange={handleChange} required />
          <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
          <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
          <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} required />
          <input type="text" name="locationFound" placeholder="Location Found" value={formData.locationFound} onChange={handleChange} required />
          <input type="date" name="dateFound" value={formData.dateFound} onChange={handleChange} required />
          <input type="time" name="timeFound" value={formData.timeFound} onChange={handleChange} required />
          <input type="date" name="dateSurrendered" value={formData.dateSurrendered} onChange={handleChange} required />
          <input type="time" name="timeSurrendered" value={formData.timeSurrendered} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          
          <button type="submit">Register Item</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterItem;
