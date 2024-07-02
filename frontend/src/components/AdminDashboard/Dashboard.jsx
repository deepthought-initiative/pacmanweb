/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import UserDelete from "../../assets/UserDelete.png";
import UserEdit from "../../assets/UserEdit.png";
import SearchIcon from "../../assets/search.png";
import DeleteUserModal from "../util/DeleteUserModal";
import EditUserModal from "../util/EditUserModal";

const Dashboard = ({ usernameContext }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    UID: "",
    username: "",
    isadmin: false,
  });

  const handleShow = (newMode, user) => {
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
      const fixedAllUsers = all_users_json.map((user) => ({
        ...user,
        isadmin: user.isadmin === "True",
      }));
      setAllUsers(fixedAllUsers);
      setFilteredUsers(fixedAllUsers);
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
      window.location.reload();
    }
  };

  const handleSearchTerm = () => {};

  const filterUserByStatus = useCallback(
    (event) => {
      if (event.target.value === "Admins") {
        setFilteredUsers(allUsers.filter((user) => user.isadmin === true));
      } else if (event.target.value === "Users") {
        setFilteredUsers(allUsers.filter((user) => user.isadmin === false));
      } else {
        setFilteredUsers(allUsers);
      }
    },
    [allUsers]
  );

  return (
    <div className="user-list-container">
      <h1>All Users</h1>
      <div className="row mb-3 filter-bar">
        <InputGroup size="" className="mb-3 search-bar-wrapper">
          <InputGroup.Text id="inputGroup-sizing-sm">
            <img src={SearchIcon} />
          </InputGroup.Text>
          <Form.Control
            className="search-bar"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            value={searchTerm}
            onChange={handleSearchTerm}
          />
        </InputGroup>

        <div className="filter-user-on-status">
          <Form.Check
            defaultChecked
            value="All"
            label="All"
            name="filter"
            type="radio"
            id="filter-all"
            onChange={filterUserByStatus}
          />
          <Form.Check
            value="Admins"
            label="Admins"
            name="filter"
            type="radio"
            id="filter-admins"
            onChange={filterUserByStatus}
          />
          <Form.Check
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
        <Table className="admin-table" bordered hover>
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
                      onClick={() => handleShow("edit", user)}
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
        </Table>
      </div>
      {show && (
        <EditUserModal
          show={show}
          setShow={setShow}
          mode={mode}
          selectedUser={selectedUser}
          key={selectedUser?.username}
          allUsers={allUsers}
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
