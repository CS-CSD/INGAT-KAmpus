import React, { useState } from "react";
import Sidebar from "./SideBar"; 
import "./css/ItemRegister.css"; // Ensure the CSS file is linked
import {supabase} from './supabase'; // Assuming you have your Supabase client set up
import { useUser } from './userContext'; 

const RegisterItem = () => {
  const { userId } = useUser(); 
  const [formData, setFormData] = useState({
    category: "",
    locationFound: "",
    datetimeFound: "",
    description: "",
    surrenderedBy: "",
    storedIn: "",
    dateSurrendered: "",
    timeSurrendered: "",
    dateFound: "",
    timeFound: "",
    image: null, 
  });


const handleRegisterItem = async () => {
  const datetimeFound = `${formData.dateFound} ${formData.timeFound}`;
  const datetimeSurrendered = `${formData.dateSurrendered} ${formData.timeSurrendered}`;
  
  try {
    let imageUrl = null;
    
    
    if (formData.image) {
      
      const fileExt = formData.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `item-images/${fileName}`;
      
   
     
      const { error: uploadError } = await supabase.storage
        .from('items') 
        .upload(filePath, formData.image);
        
      if (uploadError) throw uploadError;
      

      const { data: urlData } = supabase.storage
        .from('items')
        .getPublicUrl(filePath);
        
      imageUrl = urlData.publicUrl;
    }
    
    const { data, error } = await supabase
      .from("registered_items")
      .insert({
        category: formData.category,
        location_found: formData.locationFound,
        description: formData.description,
        surrendered_by: formData.surrenderedBy,
        stored_in: formData.storedIn,
        datetime_surrendered: datetimeSurrendered,
        datetime_found: datetimeFound,
        processed_by: userId,
        claim_status: "unclaimed",
        image_url: imageUrl, 
      });

    console.log("Fetched data:", data);
    console.log("Fetch error:", error);

    if (error) throw error;
    
   
    setFormData({
      category: "",
      locationFound: "",
      datetimeFound: "",
      description: "",
      surrenderedBy: "",
      storedIn: "",
      dateSurrendered: "",
      timeSurrendered: "",
      dateFound: "",
      timeFound: "",
      image: null, 
    });

    // Show success alert
    alert("Item successfully registered!");
    
  } catch (error) {
    console.error("Fetch failed:", error.message);
    alert(error.message);
  }
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    // Store the file object when user selects an image
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Dropdown options for storing location
  const storedLocations = ["Unknown", "MB", "JRF", "JRN", "CB", "South Lounge", "Student Center", "Sports Complex"];

  return (
    <div className="flex">
      <Sidebar />
      <div className="ItemRegisterContent">
        <h1>Item Register</h1>
        <form className="form-container" onSubmit={(e) => {e.preventDefault();handleRegisterItem();}}>
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

              <label className="label">Surrendered By</label>
              <input
                type="text"
                name="surrenderedBy"
                placeholder="Surrenedered by"
                value={formData.surrenderedBy}
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
                 <option value="" disabled>Select location</option>
                {storedLocations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
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
                step="1"
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
                step="1"
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