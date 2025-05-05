import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import { supabase } from "./supabase";
import { useUser } from './userContext';
import "./css/Account.css";

const Account = () => {
  const { userId, userRole } = useUser();
  const [user, setUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    role: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("accounts_table")
        .select("id, first_name, last_name, role")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setUser({
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setMessage({ text: "Failed to load user data", type: "error" });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const validatePasswordChange = () => {
    if (password.new !== password.confirm) {
      setMessage({ text: "New passwords don't match", type: "error" });
      return false;
    }
    if (password.new.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify current password if changing password
      if (password.new) {
        if (!validatePasswordChange()) {
          setLoading(false);
          return;
        }

        // In production, you should verify current password first
        // This is a simplified version
        const { error } = await supabase
          .from("accounts_table")
          .update({ password: password.new })
          .eq("id", user.id);

        if (error) throw error;

        setMessage({ text: "Password updated successfully!", type: "success" });
        setPassword({ current: "", new: "", confirm: "" });
      }

      // Update user info if changed
      const { error: updateError } = await supabase
        .from("accounts_table")
        .update({
          first_name: user.first_name,
          last_name: user.last_name
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setMessage({ text: "Profile updated successfully!", type: "success" });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating account:", error.message);
      setMessage({ text: error.message || "Failed to update account", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="AccountContent">
        <div className="AccountPage">
          <h1>Account Settings</h1>
          {message.text && (
            <p className={`Message ${message.type}`}>{message.text}</p>
          )}
          <form onSubmit={handleSubmit} className="AccountForm">
            <div className="FormGroup">
              <label>ID:</label>
              <span>{user.id}</span>
            </div>
            <div className="FormGroup">
              <label>Full Name:</label>
              {editMode ? (
                <div className="name-inputs">
                  <input
                    type="text"
                    name="first_name"
                    value={user.first_name}
                    onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={user.last_name}
                    onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                    required
                  />
                </div>
              ) : (
                <span>{user.first_name} {user.last_name}</span>
              )}
            </div>
            <div className="FormGroup">
              <label>Role:</label>
              <span>{user.role}</span>
            </div>
            
            {editMode && (
              <>
                <div className="FormGroup">
                  <label>Current Password:</label>
                  <input
                    type="password"
                    name="current"
                    value={password.current}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="FormGroup">
                  <label>New Password:</label>
                  <input
                    type="password"
                    name="new"
                    value={password.new}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="FormGroup">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
            
            <div className="FormActions">
              {editMode ? (
                <>
                  <button type="button" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setEditMode(true)}>
                  Edit Profile
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