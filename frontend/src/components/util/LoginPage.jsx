/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useContext, useEffect, useCallback } from "react";
import "../../css/LoginPage.css";
import { useNavigate } from "react-router-dom";
import InputConfigOption from "./InputConfigOption";
import PasswordInput from "./PasswordInput";
import AuthContext from "../../context/AuthContext";

const Login = () => {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });
  const updateUserCredentials = useCallback(
    (key, value) => {
      setUserCredentials((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoggedInUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("creds", btoa(`${userCredentials.username}:${userCredentials.password}`));
      const response = await fetch(`/api/login`, {
        method: "POST",
        body: formData,
      });
      const userInfo = await response.json();
      if (!response.ok) {
        setError("Invalid username or password");
      } else {
        localStorage.setItem("loggedIn", "true");
        setIsLoggedIn(true);
        setLoggedInUser(userInfo);
        navigate("/categorize");
        localStorage.setItem("username", userCredentials.username);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error during login. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <InputConfigOption
            label="Username"
            value={userCredentials.username}
            desc="Enter the username"
            setValue={(value) => updateUserCredentials("username", value)}
          />

          <PasswordInput
            label="Password"
            value={userCredentials.password}
            setValue={(value) => updateUserCredentials("password", value)}
            desc="Enter password"
            disabled={false}
          />
          <button className="submit-button" type="submit">
            Login
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
