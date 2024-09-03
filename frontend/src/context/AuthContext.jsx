/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState({
    username: null,
    isadmin: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkIsUserLoggedIn = async () => {
      try {
        const response = await fetch("/api/logged_in");
        const data = await response.json();
        const status = data.value === "True";
        setIsLoggedIn(status);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    checkIsUserLoggedIn();
  }, []);

  const handleAuthLogout = async () => {
    const response = await fetch(`/api/logout`, {
      method: "POST",
    });
    if (response.ok) {
      setIsLoggedIn(false)
      setLoggedInUser(null)
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        isLoggedIn,
        setIsLoggedIn,
        setLoggedInUser,
        handleAuthLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
