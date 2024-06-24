/* eslint-disable no-unused-vars */
import { useState } from "react";
import Table from "react-bootstrap/Table";
import UserDelete from "../../assets/UserDelete.png";
import UserEdit from "../../assets/UserEdit.png";
import AlertModal from "../util/AlertBox";
import EditUserModal from "../util/EditUserModal";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [passwords, setPasswordStates] = useState({});

  const handleShow = (newMode, user) => {
    if (newMode.toLowerCase() == "delete") {
      setDeleteModal(true);
    } else {
      setShow(true);
      setMode(newMode.toLowerCase());
    }
  };

  const togglePasswordVisibility = (userId) => {
    setPasswordStates((prevStates) => ({
      ...prevStates,
      [userId]: !prevStates[userId], // Toggle visibility for the clicked user
    }));
  };

  const deleteUserAlertTitle = "Delete a User";
  const deleteUserAlertDesc = "Deleting";

  const users = [
    {
      UID: "1",
      Username: "user1",
      Password: "password1",
      Status: "normal",
    },
    {
      UID: "2",
      Username: "user2",
      Password: "password2",
      Status: "admin",
    },
    {
      UID: "3",
      Username: "user3",
      Password: "password3",
      Status: "normal",
    },
    {
      UID: "4",
      Username: "user4",
      Password: "password4",
      Status: "admin",
    },
    {
      UID: "5",
      Username: "user5",
      Password: "password5",
      Status: "normal",
    },
  ];

  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      <div className="row mb-3">
        <div className="col d-flex">
          <button className="btn" onClick={() => handleShow("ADD")}>
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
              <th>Password</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user["UID"]}>
                <td>{index}</td>
                <td>{user["Username"]}</td>
                <td>
                  <div className="password-container">
                    <div>
                      {passwords[user.UID]
                        ? user["Password"]
                        : "****************"}
                    </div>
                    <div>
                      <button
                        className="mx-2 password-toggle-btn"
                        onClick={() => togglePasswordVisibility(user.UID)}
                      >
                        {passwords[user.UID] ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </td>
                <td>{user["Status"]}</td>
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
      {show && <EditUserModal show={show} setShow={setShow} mode={mode} />}
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
