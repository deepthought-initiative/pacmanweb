/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // useEffect(() => {
  //   let loggedIn = localStorage.getItem("loggedIn");
  //   const checkLogin = async () => {
  //     try {
  //       const response = await fetch("/api/logged_in");
  //       const data = await response.json();
  //       const s = data.value === "True";
  //       console.log(s);
  //       setStatus(s);
  //       if (!s || !loggedIn) {
  //         localStorage.removeItem("username");
  //         localStorage.removeItem("isUserAdmin");
  //         console.log("hi");
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       console.error("Error checking login status:", error);
  //       setStatus(false);
  //       navigate("/login");
  //     }
  //   };
  //   checkLogin();
  // }, [navigate]);

  return isLoggedIn ? children : null;
};

export default PrivateRoute;
