import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import "./css/ItemRegister.css";
import { supabase } from './supabase';
import { useUser } from './userContext';

const RegisterItem = () => {
  const { userId } = useUser();
  const [formData, setFormData] = useState({
    category: "",
    locationFound: "",
    description: "",
    surrenderedBy: "",
    storedIn: "",
    dateSurrendered: "",
    timeSurrendered: "",
    dateFound: "",
    timeFound: "",
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Categories for items
  const itemCategories = [
    "Electronics", "Clothing", "Books", "Accessories", 
    "ID/Cards", "Keys", "Bags", "Other"
  ];

  // Dropdown options for found locations
  const foundLocations = [
    "MB", "JRF", "JRN", "CB", "South Lounge", 
    "Student Center", "Sports Complex", "Other"
  ];
  
  // Drawer storage locations
  const generateDrawerLocations = () => {
    const sections = ["A", "B", "C", "D"];
    const drawers = [];
    
    // Generate drawer locations (A1-A10, B1-B10, etc.)
    sections.forEach(section => {
      for (let i = 1; i <= 10; i++) {
        drawers.push(`Drawer-${section}${i}`);
      }
    });
    
    // Add additional storage options
    return [...drawers, "Large Item Storage", "Secure Cabinet", "Reception Desk"];
  };
  
  const storageLocations = generateDrawerLocations();

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Category validation
    if (!formData.category) {
      newErrors.category = "Item category is required";
    }
    
    // Location validation
    if (!formData.locationFound) {
      newErrors.locationFound = "Location found is required";
    }
    
    // Description validation
    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description should be at least 10 characters";
    }
    
    // Surrendered By validation
    if (!formData.surrenderedBy) {
      newErrors.surrenderedBy = "Name of person who surrendered the item is required";
    }
    
    // Storage location validation
    if (!formData.storedIn) {
      newErrors.storedIn = "Storage location is required";
    }
    
    // Date validations
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (!formData.dateFound) {
      newErrors.dateFound = "Date found is required";
    } else {
      const dateFound = new Date(formData.dateFound);
      if (dateFound > currentDate) {
        newErrors.dateFound = "Date found cannot be in the future";
      }
    }
    
    if (!formData.dateSurrendered) {
      newErrors.dateSurrendered = "Date surrendered is required";
    } else {
      const dateSurrendered = new Date(formData.dateSurrendered);
      if (dateSurrendered > currentDate) {
        newErrors.dateSurrendered = "Date surrendered cannot be in the future";
      }
      
      // Check if found date is after surrendered date
      if (formData.dateFound) {
        const dateFound = new Date(formData.dateFound);
        if (dateFound > dateSurrendered) {
          newErrors.dateFound = "Date found cannot be after date surrendered";
        }
      }
    }
    
    // Time validations
    if (!formData.timeFound) {
      newErrors.timeFound = "Time found is required";
    }
    
    if (!formData.timeSurrendered) {
      newErrors.timeSurrendered = "Time surrendered is required";
    }
    
    // Image validation (if provided)
    if (formData.image) {
      const fileSize = formData.image.size / 1024 / 1024; // in MB
      const fileType = formData.image.type;
      
      if (fileSize > 5) {
        newErrors.image = "Image must be less than 5MB";
      }
      
      if (!fileType.includes('image/')) {
        newErrors.image = "File must be an image";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterItem = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    const datetimeFound = `${formData.dateFound} ${formData.timeFound}`;
    const datetimeSurrendered = `${formData.dateSurrendered} ${formData.timeSurrendered}`;
    
    try {

      
if (formData.image) {
  // Ensure we extract the file extension safely
const fileExt = formData.image.name.split('.').pop();
const fileName = `${Date.now()}.${fileExt}`;
const filePath = `unclaimed/${fileName}`; // or 'claimed/'


  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, formData.image, {
      contentType: formData.image.type || 'image/png', // fallback to image/png
    });

  if (uploadError) throw uploadError;

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
        });

      if (error) throw error;
      
      // Clear form data and show success message
      setFormData({
        category: "",
        locationFound: "",
        description: "",
        surrenderedBy: "",
        storedIn: "",
        dateSurrendered: "",
        timeSurrendered: "",
        dateFound: "",
        timeFound: "",
        image: null,
      });
      
      setImagePreview(null);
      setSuccessMessage("Item successfully registered!");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
    } catch (error) {
      console.error("Registration failed:", error.message);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any image errors
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  return (
    <div className="register-page-container">
      <Sidebar />
      <div className="register-content">
        <h1>Register Found Item</h1>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}
        
        <form className="form-container" onSubmit={handleRegisterItem}>
          <div className="form-layout">
            <div className="image-column">
              <div className="image-upload-container">
                <h3>Item Image</h3>
                <input
                  type="file"
                  name="image"
                  className="file-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.image && <div className="error-message">{errors.image}</div>}
                
                <div className="image-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Item preview" />
                  ) : (
                    <div className="no-image-placeholder">
                      No image selected
                    </div>
                  )}
                </div>
                <p className="image-hint">
                  Upload a clear image of the item (Max: 5MB)
                </p>
              </div>
            </div>
            
            <div className="fields-column">
              <div className="form-row">
                <div className="form-group">
                  <label className="label">Item Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? "input-error" : ""}
                  >
                    <option value="" disabled>Select category</option>
                    {itemCategories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <div className="error-message">{errors.category}</div>}
                </div>
                
                <div className="form-group">
                  <label className="label">Location Found*</label>
                  <select
                    name="locationFound"
                    value={formData.locationFound}
                    onChange={handleChange}
                    className={errors.locationFound ? "input-error" : ""}
                  >
                    <option value="" disabled>Select location</option>
                    {foundLocations.map((loc, index) => (
                      <option key={index} value={loc}>{loc}</option>
                    ))}
                  </select>
                  {errors.locationFound && <div className="error-message">{errors.locationFound}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="label">Date Found*</label>
                  <input
                    type="date"
                    name="dateFound"
                    value={formData.dateFound}
                    onChange={handleChange}
                    className={errors.dateFound ? "input-error" : ""}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dateFound && <div className="error-message">{errors.dateFound}</div>}
                </div>
                
                <div className="form-group">
                  <label className="label">Time Found*</label>
                  <input
                    type="time"
                    name="timeFound"
                    step="60"
                    value={formData.timeFound}
                    onChange={handleChange}
                    className={errors.timeFound ? "input-error" : ""}
                  />
                  {errors.timeFound && <div className="error-message">{errors.timeFound}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="label">Date Surrendered*</label>
                  <input
                    type="date"
                    name="dateSurrendered"
                    value={formData.dateSurrendered}
                    onChange={handleChange}
                    className={errors.dateSurrendered ? "input-error" : ""}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dateSurrendered && <div className="error-message">{errors.dateSurrendered}</div>}
                </div>
                
                <div className="form-group">
                  <label className="label">Time Surrendered*</label>
                  <input
                    type="time"
                    name="timeSurrendered"
                    step="60"
                    value={formData.timeSurrendered}
                    onChange={handleChange}
                    className={errors.timeSurrendered ? "input-error" : ""}
                  />
                  {errors.timeSurrendered && <div className="error-message">{errors.timeSurrendered}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label className="label">Surrendered By*</label>
                <input
                  type="text"
                  name="surrenderedBy"
                  placeholder="Full name of person who surrendered the item"
                  value={formData.surrenderedBy}
                  onChange={handleChange}
                  className={errors.surrenderedBy ? "input-error" : ""}
                />
                {errors.surrenderedBy && <div className="error-message">{errors.surrenderedBy}</div>}
              </div>
              
              <div className="form-group">
                <label className="label">Stored In*</label>
                <select
                  name="storedIn"
                  value={formData.storedIn}
                  onChange={handleChange}
                  className={errors.storedIn ? "input-error" : ""}
                >
                  <option value="" disabled>Select storage location</option>
                  {storageLocations.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.storedIn && <div className="error-message">{errors.storedIn}</div>}
              </div>
              
              <div className="form-group">
                <label className="label">Description*</label>
                <textarea
                  name="description"
                  placeholder="Detailed description of the item (color, brand, distinctive features, etc.)"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? "input-error" : ""}
                  rows="4"
                />
                {errors.description && <div className="error-message">{errors.description}</div>}
              </div>
              
              <div className="submit-container">
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Item"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterItem;