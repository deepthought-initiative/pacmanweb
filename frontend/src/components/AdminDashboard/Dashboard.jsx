/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import UserDelete from "../../assets/UserDelete.png";
import UserEdit from "../../assets/UserEdit.png";
import DeleteUserModal from "../util/DeleteUserModal";
import EditUserModal from "../util/EditUserModal";
import ToastContext from "../../context/ToastContext.jsx";

const Dashboard = ({ usernameContext }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [userType, setUserType] = useState("All");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    UID: "",
    username: "",
    isadmin: false,
  });

  // Function for showing toasts
  const { showToastMessage } = useContext(ToastContext);

  const handleShow = (newMode, user) => {
    setSelectedUser(user);
    if (newMode === "DELETE") {
      setDeleteModal(true);
    } else {
      setShow(true);
      setMode(newMode);
    }
  };

  useEffect(() => {
    async function fetchAllUsers() {
      const fetchUsers = await fetch("/api/admin/return_users");
      const all_users_json = await fetchUsers.json();
      const fixedAllUsers = all_users_json.map((user) => ({
        ...user,
        isadmin: user.isadmin === "True" || user.isadmin === "true",
      }));
      setAllUsers(fixedAllUsers);
    }
    fetchAllUsers();
  }, []);

  const handleDeleteUser = async () => {
    const formData = new FormData();
    formData.append("username", selectedUser.username);
    const response = await fetch("/api/admin/delete_user", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const deletedUser = await response.json();
      const deletedUsername = deletedUser.user_data.username;
      const newUsers = allUsers.filter(
        (item) => item.username !== deletedUsername
      );
      setAllUsers(newUsers);
      setDeleteModal(false);
      showToastMessage("success", `Deleted user ${deletedUsername}`);
    }
  };

  let filteredUsers;
  if (userType === "Admins") {
    filteredUsers = allUsers.filter((user) => user.isadmin);
  } else if (userType == "Users") {
    filteredUsers = allUsers.filter((user) => !user.isadmin);
  } else {
    filteredUsers = allUsers;
  }

  const filterUserByStatus = useCallback((event) => {
    setUserType(event.target.value);
  }, []);

  return (
    <>
      <div className="user-list-container">
        <h1>All Users</h1>
        <div className="row mb-3 filter-bar">
          <div className="filter-user-on-status">
            <Form.Check
              checked={userType === "All"}
              value="All"
              label="All"
              name="filter"
              type="radio"
              id="filter-all"
              onChange={filterUserByStatus}
            />
            <Form.Check
              checked={userType === "Admins"}
              value="Admins"
              label="Admins"
              name="filter"
              type="radio"
              id="filter-admins"
              onChange={filterUserByStatus}
            />
            <Form.Check
              checked={userType === "Users"}
              value="Users"
              label="Users"
              name="filter"
              type="radio"
              id="filter-users"
              onChange={filterUserByStatus}
            />
          </div>
          <div className="col new-user-btn-container">
            <button
              className="btn"
              onClick={() =>
                handleShow("ADD", {
                  UID: "",
                  username: "",
                  Password: "",
                  isadmin: false,
                })
              }
            >
              + New User
            </button>
          </div>
        </div>
        <div className="admin-table-container">
          <table className="container-fluid secondary-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index + 1}>
                  <td>{index + 1}</td>
                  <td>{user["username"]}</td>
                  <td>{user["isadmin"] ? "Admin" : "Normal User"}</td>
                  <td>
                    <div className="user-edit-options">
                      <img
                        src={UserEdit}
                        onClick={() => handleShow("EDIT", user)}
                      />
                      {user["username"] !== usernameContext &&
                        user["username"] !== "mainadmin" && (
                          <img
                            src={UserDelete}
                            onClick={() => handleShow("DELETE", user)}
                          />
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {show && (
          <EditUserModal
            show={show}
            setShow={setShow}
            mode={mode}
            selectedUser={selectedUser}
            key={selectedUser?.username}
            allUsers={allUsers}
            setAllUsers={setAllUsers}
          />
        )}
        {deleteModal && (
          <DeleteUserModal
            show={deleteModal}
            buttonText="Confirm Delete"
            onHide={() => setDeleteModal(false)}
            selectedUser={selectedUser}
            handleDeleteUser={handleDeleteUser}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
