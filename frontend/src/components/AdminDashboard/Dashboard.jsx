/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import UserDelete from "../../assets/UserDelete.png";
import UserEdit from "../../assets/UserEdit.png";
import AlertModal from "../util/AlertBox";
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

  const deleteUserAlertTitle = "Delete a User";
  const deleteUserAlertDesc = "Deleting";

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
            {allUsers.map((user) => (
              <tr key={user["UID"]}>
                <td>{user["UID"]}</td>
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
        <AlertModal
          show={deleteModal}
          title={deleteUserAlertTitle}
          desc={deleteUserAlertDesc}
          onHide={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
