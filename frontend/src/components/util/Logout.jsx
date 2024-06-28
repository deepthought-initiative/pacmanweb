/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const Logout = ({ usernameContext, isUserAdminContext, setLoggedIn }) => {
  const handleLogout = async () => {
    const response = await fetch(`/logout`, {
      method: "POST",
    });
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("isUserAdmin");
    setLoggedIn(false);
  };
  return (
    <div className="user-info-box">
      <div className="user-info-content">
        <p>
          Username: <span id="username">{usernameContext}</span>
        </p>
        <p>
          Status:{" "}
          <span id="user-status">{isUserAdminContext ? "Admin" : "User"}</span>
        </p>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
