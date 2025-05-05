import React, { useState } from "react";
import { supabase } from "./supabase";
import Sidebar from "./SideBar.js";
import "./css/Account.css";

const CreateAccount = () => {
  const [newAccount, setNewAccount] = useState({
    id: "",
    first_name: "",
    last_name: "",
    role: "",
    password: ""
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  const validateInputs = () => {
    if (!newAccount.id || !newAccount.first_name || !newAccount.last_name || !newAccount.role) {
      setMessage({ text: "All fields are required", type: "error" });
      return false;
    }
    
    // Validate ID format if needed (e.g., must be numeric)
    if (!/^\d+$/.test(newAccount.id)) {
      setMessage({ text: "ID must be numeric", type: "error" });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      // Check if account already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("accounts_table")
        .select("id")
        .eq("id", newAccount.id)
        .single();

      if (existingUser) {
        setMessage({ text: "Account with this ID already exists", type: "error" });
        setLoading(false);
        return;
      }

      // Create new account
      const { data, error } = await supabase
        .from("accounts_table")
        .insert([{
          id: newAccount.id,
          password: newAccount.password || "defaultPassword123", // In production, use proper hashing
          first_name: newAccount.first_name,
          last_name: newAccount.last_name,
          role: newAccount.role,
        }]);

      if (error) throw error;

      setMessage({ text: "Account created successfully!", type: "success" });
      setNewAccount({ id: "", first_name: "", last_name: "", role: "", password: "" });
    } catch (error) {
      console.error("Error creating account:", error);
      setMessage({ text: error.message || "Failed to create account", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const roles = ["admin", "student", "manager", "staff"];

  return (
    <div className="flex">
      <Sidebar />
      <div className="AccountContent">
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
              pattern="\d+"
              title="ID must be numeric"
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
              <option value="" disabled>Select role</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="FormGroup">
            <label>Temporary Password:</label>
            <input
              type="password"
              name="password"
              value={newAccount.password}
              onChange={handleChange}
              placeholder="Leave blank for default password"
            />
          </div>
          <div className="FormActions">
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
        {message.text && (
          <p className={`Message ${message.type}`}>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default CreateAccount;