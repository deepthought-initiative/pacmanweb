/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate()
  const { loggedInUser, handleAuthLogout } = useContext(AuthContext);

  const handleSubmit = async () => {
    handleAuthLogout()
    navigate("/login")
  };

  return (
    <div className="user-info-box">
      <div className="user-info-content">
        <p>
          Username: <span id="username">{loggedInUser.username}</span>
        </p>
        <p>
          Status: <span id="user-status">{loggedInUser.isadmin ? "Admin" : "Normal User"}</span>
        </p>
        <button className="btn" onClick={handleSubmit}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
