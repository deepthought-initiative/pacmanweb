/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch("/api/logged_in");
        const data = await response.json();
        const s = data.value === "True";
        console.log(s);
        setStatus(s);
        if (!s) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setStatus(false);
        navigate("/login");
      }
    };
    checkLogin();
  }, [navigate]);

  return status ? children : null;
};

export default PrivateRoute;
