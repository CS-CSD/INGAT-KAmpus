import React, { useState } from "react";
import Sidebar from "./SideBar"; // Import the Sidebar component
import "./css/Account.css";

const Account = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "********",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    console.log("Updated User:", user); // Replace with API call to update user
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Add the Sidebar here */}
      <div className="AccountContent"> {/* Wrap main content in a div */}
        <div className="AccountPage">
          <h1>Account Settings</h1>
          <form onSubmit={handleSubmit} className="AccountForm">
            <div className="FormGroup">
              <label>Name:</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.name}</span>
              )}
            </div>
            <div className="FormGroup">
              <label>Email:</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            <div className="FormGroup">
              <label>Password:</label>
              {editMode ? (
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.password}</span>
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