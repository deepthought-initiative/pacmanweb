/* eslint-disable react/prop-types */
const Logout = ({ setLoggedIn }) => {
  const handleLogout = async () => {
    const response = await fetch(`/logout`, {
      method: "POST",
    });
    console.log(response);
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };
  return (
    <div>
      <button className="btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
