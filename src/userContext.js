import React, { createContext, useState, useContext } from 'react';

// Create the User Context
const UserContext = createContext();

// Create a custom hook to use the User Context
export const useUser = () => {
  return useContext(UserContext);
};

// Create a UserProvider component to wrap around the app
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Default is null (no user logged in)

  // Function to set user ID (called after login)
  const setUser = (id) => {
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
