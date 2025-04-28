import React, { createContext, useState, useContext } from 'react';

// Create the User Context
const UserContext = createContext();

// Custom hook to use the User Context for user data
export const useUser = () => {
  return useContext(UserContext);
};

// Custom hook to use the User Context for role
export const useRole = () => {
  const { userRole } = useContext(UserContext); // Get userRole from the context
  return userRole; // Return userRole
};

// Create a UserProvider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Function to set user ID
  const setUser = (id) => {
    setUserId(id);
  };

  // Function to set user role
  const setRole = (role) => {
    setUserRole(role);
  };

  return (
    <UserContext.Provider value={{ userId, setUser, userRole, setRole }}>
      {children}
    </UserContext.Provider>
  );
};
