import React, { useState } from "react";
import Sidebar from "./SideBar"; // Ensure correct import
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
    console.log(formData);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="MainContent">
        <h1>Item Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="uid" placeholder="UID" onChange={handleChange} required />
          <input type="text" name="brand" placeholder="Brand" onChange={handleChange} required />
          <input type="text" name="type" placeholder="Type" onChange={handleChange} required />
          <input type="text" name="color" placeholder="Color" onChange={handleChange} required />
          <input type="text" name="locationFound" placeholder="Location Found" onChange={handleChange} required />
          <input type="date" name="dateFound" onChange={handleChange} required />
          <input type="time" name="timeFound" onChange={handleChange} required />
          <input type="date" name="dateSurrendered" onChange={handleChange} required />
          <input type="time" name="timeSurrendered" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} required />
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
          <button type="submit">Register Item</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterItem;
