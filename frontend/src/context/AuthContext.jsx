/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: null,
    isadmin: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e, usernameInput, passwordInput) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("creds", btoa(`${usernameInput}:${passwordInput}`));
      const response = await fetch(`/api/login`, {
        method: "POST",
        body: formData,
      });
      const loginResponse = await response.json();
      if (response.status === 200) {
        const { username, isadmin } = loginResponse;
        localStorage.setItem("loggedIn", "true");
        setUser({ username, isadmin });
        setIsLoggedIn(true);
        navigate("/logout");
        localStorage.setItem("username", username);
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error during login. Please try again later.");
    }
  };

  const handleLogout = async () => {
    const response = await fetch(`/api/logout`, {
      method: "POST",
    });
    if (response.ok) {
      setIsLoggedIn(false);
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("isadmin");
      navigate("/login");
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        handleLogin,
        handleLogout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
