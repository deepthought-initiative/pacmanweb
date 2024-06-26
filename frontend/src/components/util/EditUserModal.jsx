/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import ConfirmationModal from "./ConfirmationModal";

// eslint-disable-next-line react/prop-types
const EditUserModal = ({ show, setShow, mode, selectedUser }) => {
  const [loading, setLoading] = useState(false);
  const [processStatusCode, setProcessStatusCode] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(true);
  const [updatedUser, setUpdatedUser] = useState({
    username: selectedUser?.username || "",
    isadmin: selectedUser?.isadmin || false,
    password: selectedUser?.password || "",
  });
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setUpdatedUser({
      username: selectedUser?.username || "",
      isadmin: selectedUser?.isadmin || false,
      password: selectedUser?.password || "",
    });
  }, [selectedUser]);

  const handleClose = () => {
    setShow(false);
    setShowConfirmationModal(false);
    setShowEditModal(false);
  };

  const handleUsernameChange = (event) => {
    setUpdatedUser({ ...updatedUser, username: event.target.value });
    setUsernameError(false);
  };

  const handlePasswordChange = (event) => {
    setUpdatedUser({ ...updatedUser, password: event.target.value });
    setPasswordError(false);
  };

  const handleAdminStatusChange = (event) => {
    setUpdatedUser({ ...updatedUser, isadmin: event.target.value === "admin" });
  };

  const handleSaveChanges = async () => {
    // Check if any of the user's information has changed
    const hasChanged =
      updatedUser.username !== selectedUser.username ||
      updatedUser.isadmin !== selectedUser.isadmin ||
      updatedUser.password !== selectedUser.password;

    if (
      mode === "add" &&
      (updatedUser.username === "" || updatedUser.password === "")
    ) {
      setUsernameError(updatedUser.username === "");
      setPasswordError(updatedUser.password === "");
      return;
    }

    if (hasChanged) {
      // Ask for confirmation before saving changes
      setConfirmationMessage(
        `Are you sure you want to update the information for user "${
          selectedUser.username
        }"?

Changes:

- Username: ${
          updatedUser.username !== selectedUser.username
            ? `${selectedUser.username} -> ${updatedUser.username}`
            : "No change"
        }

- Admin status: ${
          updatedUser.isadmin !== selectedUser.isadmin
            ? `${selectedUser.isadmin ? "Admin" : "Normal user"} -> ${
                updatedUser.isadmin ? "Admin" : "Normal user"
              }`
            : "No change"
        }

- Password: ${
          updatedUser.password !== selectedUser.password
            ? "Changed"
            : "No change"
        }`
      );
      setShowConfirmationModal(true);
      setShowEditModal(false);
    } else {
      try {
        const formData = new FormData();
        formData.append("username", updatedUser.username);
        formData.append("isadmin", updatedUser.isadmin);
        formData.append("password", updatedUser.password);

        const ifExists = await fetch(
          `/api/admin/ifexists/${selectedUser.username}`,
          {
            method: "GET",
            credentials: "include",
            headers: { Authorization: "Basic " + btoa("default:barebones") },
          }
        );
        if (ifExists.ok) {
          formData.append("overwrite", true);
        }

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
          if (mode === "edit") {
            handleClose();
            window.location.reload();
          } else {
            alert(
              `User "${updatedUser.username}" (${
                updatedUser.isadmin ? "Admin" : "Normal user"
              }) added successfully.`
            );
            handleClose();
          }
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleConfirmation = async () => {
    setShowConfirmationModal(false);
    setShowEditModal(true);
    try {
      const formData = new FormData();
      formData.append("username", updatedUser.username);
      formData.append("isadmin", updatedUser.isadmin);
      formData.append("password", updatedUser.password);

      const ifExists = await fetch(
        `/api/admin/ifexists/${selectedUser.username}`,
        {
          method: "GET",
          credentials: "include",
          headers: { Authorization: "Basic " + btoa("default:barebones") },
        }
      );
      if (ifExists.ok) {
        formData.append("overwrite", true);
      }

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
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setShowEditModal(true);
  };

  return (
    <>
      {showEditModal && (
        <Modal show={show} backdrop="static" onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {mode === "edit"
                ? `Editing credentials for ${selectedUser.username}`
                : "Create New User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {mode === "add" && (
                <Form.Group className="mb-3" controlId="Form.Username">
                  <Form.Label>
                    <strong>Username</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    autoFocus
                    value={updatedUser.username}
                    onChange={handleUsernameChange}
                    isInvalid={usernameError}
                  />
                  {usernameError && (
                    <Form.Control.Feedback type="invalid">
                      Username is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              )}
              <Form.Group className="mb-3" controlId="Form.NewPassword">
                <Form.Label>
                  <strong>
                    {mode === "edit" ? "New Password" : "Password"}
                  </strong>
                </Form.Label>
                <Form.Control
                  type="password"
                  autoFocus
                  value={updatedUser.password}
                  onChange={handlePasswordChange}
                  isInvalid={passwordError}
                />
                {passwordError && (
                  <Form.Control.Feedback type="invalid">
                    Password is required.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="Form.AdminStatus"
              >
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
                    checked={!updatedUser.isadmin}
                    value="normal"
                    onChange={handleAdminStatusChange}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Admin"
                    name="group1"
                    id="inline-radio-2"
                    checked={updatedUser.isadmin}
                    value="admin"
                    onChange={handleAdminStatusChange}
                  />
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={handleSaveChanges}
              disabled={
                mode === "edit" &&
                !updatedUser.username &&
                !updatedUser.password
              }
            >
              {mode === "edit" ? "Save Changes" : "Create User"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <ConfirmationModal
        show={showConfirmationModal}
        onConfirm={handleConfirmation}
        onCancel={handleCancelConfirmation}
        message={confirmationMessage}
      />
    </>
  );
};

export default EditUserModal;
