import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar"; // Import the Sidebar component
import { supabase } from "./supabase"; // Import Supabase for database access
import { useUser } from './userContext'; // Import user context to access user data
import "./css/Account.css";

const Account = () => {
  // Access the logged-in user's ID and role from context
  const { userId, userRole } = useUser();

  const [user, setUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Fetch user data from the database on component mount
  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  // Fetch user data from Supabase
  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("accounts_table")
        .select("id, first_name, last_name, role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      setUser({
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Handle form submission (Save Changes)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditMode(false);

    // Update password if changed
    if (newPassword) {
      const { error } = await supabase
        .from("accounts_table")
        .update({ password: newPassword }) // Assuming 'password' column exists
        .eq("id", user.id);

      if (error) {
        console.error("Error updating password:", error.message);
      } else {
        console.log("Password updated successfully!");
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="AccountContent">
        <div className="AccountPage">
          <h1>Account Settings</h1>
          <form onSubmit={handleSubmit} className="AccountForm">
            <div className="FormGroup">
              <label>ID:</label>
              <span>{user.id}</span>
            </div>
            <div className="FormGroup">
              <label>Full Name:</label>
              {editMode ? (
                <>
                  <input
                    type="text"
                    name="first_name"
                    value={user.first_name}
                    onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={user.last_name}
                    onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                  />
                </>
              ) : (
                <span>{user.first_name} {user.last_name}</span>
              )}
            </div>
            <div className="FormGroup">
              <label>Role:</label>
              <span>{user.role}</span>
            </div>
            <div className="FormGroup">
              <label>Change Password:</label>
              {editMode ? (
                <input
                  type="password"
                  name="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                />
              ) : (
                <span>********</span> // Placeholder for hidden password
              )}
            </div>
            <div className="FormActions">
              {editMode ? (
                <button type="submit">Save Changes</button>
              ) : (
                <button type="button" onClick={() => setEditMode(true)}>
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
