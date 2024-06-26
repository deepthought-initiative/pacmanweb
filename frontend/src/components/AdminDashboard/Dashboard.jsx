/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import UserDelete from "../../assets/UserDelete.png";
import UserEdit from "../../assets/UserEdit.png";
import DeleteUserModal from "../util/DeleteUserModal";
import EditUserModal from "../util/EditUserModal";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    UID: "",
    username: "",
    password: "",
    isadmin: false,
  });

  const handleShow = (newMode, user) => {
    console.log("dash", user);
    setSelectedUser(user);
    if (newMode.toLowerCase() == "delete") {
      setDeleteModal(true);
    } else {
      setShow(true);
      setMode(newMode.toLowerCase());
    }
  };

  useEffect(() => {
    async function fetchAllUsers() {
      const fetchUsers = await fetch("/api/admin/return_users");
      const all_users_json = await fetchUsers.json();
      setAllUsers(all_users_json);
    }
    fetchAllUsers();
    console.log(allUsers);
  }, []);

  const handleDeleteUser = async () => {
    const formData = new FormData();
    formData.append("username", selectedUser.username);
    const response = await fetch("/api/admin/delete_user", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      <div className="row mb-3">
        <div className="col d-flex">
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
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, index) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>{user["username"]}</td>
                <td>{user["isadmin"] ? "Admin" : "Normal User"}</td>
                <td>
                  <div className="user-edit-options">
                    <img
                      src={UserEdit}
                      onClick={() => handleShow("edit", user)}
                    />
                    <img
                      src={UserDelete}
                      onClick={() => handleShow("DELETE", user)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {show && (
        <EditUserModal
          show={show}
          setShow={setShow}
          mode={mode}
          selectedUser={selectedUser}
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
  );
};

export default Dashboard;
