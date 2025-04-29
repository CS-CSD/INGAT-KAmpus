import React, { useState } from "react";
import { supabase } from "./supabase"; // Import Supabase client
import Sidebar from "./SideBar.js";
import "./css/Account.css";


const CreateAccount = () => {
  const [newAccount, setNewAccount] = useState({
    id: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("accounts_table")
        .insert([
          {
            id: newAccount.id,
            password: "password",
            first_name: newAccount.first_name,
            last_name: newAccount.last_name,
            role: newAccount.role,
          },
        ]);

      if (error) {
        console.error("Error inserting account:", error.message);
        setMessage("Failed to create account.");
      } else {
        console.log("Account created successfully:", data);
        setMessage("Account created successfully!");
        // Clear form
        setNewAccount({ id: "", first_name: "", last_name: "", role: "" });
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setMessage("An unexpected error occurred.");
    }
  };

  const roles = ["admin","student","manager","staff"];

  return (
    <div className="AccountContent">
        <Sidebar/>
      <h1>Create New Account</h1>
      <form onSubmit={handleSubmit} className="AccountForm">
        <div className="FormGroup">
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={newAccount.id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="FormGroup">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={newAccount.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="FormGroup">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={newAccount.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="FormGroup">
          <label>Role:</label>
          <select
          name="role"
          value={newAccount.role}
          onChange={handleChange}
          required
          >
            <option value=""disabled>select role</option>
            {roles.map((loc,index)=>(
                <option key={index} value={loc}>{loc}</option>
            ))}
            </select>
        </div>
        <div className="FormActions">
          <button type="submit">Create Account</button>
        </div>
      </form>
      {message && <p className="Message">{message}</p>}
    </div>
  );
};

export default CreateAccount;
