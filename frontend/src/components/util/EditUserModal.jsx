/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

// eslint-disable-next-line react/prop-types
const EditUserModal = ({ show, setShow, mode, selectedUser, onUserUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [processStatusCode, setProcessStatusCode] = useState();
  const [updatedUser, setUpdatedUser] = useState({
    username: selectedUser?.username || "",
    isAdmin: selectedUser?.isAdmin || false,
  });

  useEffect(() => {
    setUpdatedUser({
      username: selectedUser?.username || "",
      isAdmin: selectedUser?.isAdmin || false,
    });
  }, [selectedUser]);

  const handleClose = () => {
    setShow(false);
  };

  const handleUsernameChange = (event) => {
    setUpdatedUser({ ...updatedUser, username: event.target.value });
  };

  const handleAdminStatusChange = (event) => {
    setUpdatedUser({ ...updatedUser, isAdmin: event.target.value === "admin" });
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("username", updatedUser.username);
    formData.append("isadmin", updatedUser.isAdmin);

    try {
      const response = await fetch("/api/admin/edit_users", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: { Authorization: "Basic " + btoa("default:barebones") },
      });

      if (!response.ok) {
        setProcessStatusCode(400);
      } else {
        setProcessStatusCode(200);
        onUserUpdate(updatedUser);
        handleClose();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <Modal show={show} backdrop="static" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "edit" ? "Edit User" : "Create New User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="Form.Username">
              <Form.Label>
                <strong>Username</strong>
              </Form.Label>
              <Form.Control
                type="text"
                autoFocus
                value={updatedUser.username}
                onChange={handleUsernameChange}
              />
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="Form.AdminStatus">
              <Form.Label>
                <strong>Status</strong>
              </Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Normal user"
                  name="group1"
                  id="inline-radio-1"
                  checked={!updatedUser.isAdmin}
                  value="normal"
                  onChange={handleAdminStatusChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Admin"
                  name="group1"
                  id="inline-radio-2"
                  checked={updatedUser.isAdmin}
                  value="admin"
                  onChange={handleAdminStatusChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveChanges}>
            {mode === "edit" ? "Save Changes" : "Create User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUserModal;
