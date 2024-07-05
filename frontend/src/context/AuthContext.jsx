/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext,useEffect, useState } from "react";

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

  useEffect(() =>{
    if(isLoggedIn){
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/get_current_user");
        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }
        const currentUser = await response.json();
        setLoggedInUser(currentUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }
      fetchCurrentUser()
    }
  },[isLoggedIn])

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        isLoggedIn,
        setIsLoggedIn,
        setLoggedInUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
