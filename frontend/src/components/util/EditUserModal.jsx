/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import HidePasswordIcon from "../../assets/hide.png";
import ShowPasswordIcon from "../../assets/show.png";
import ConfirmationModal from "./ConfirmationModal";
import InputConfigOption from "./InputConfigOption";
import PasswordInput from "./PasswordInput";

// eslint-disable-next-line react/prop-types
const EditUserModal = ({ show, setShow, mode, selectedUser, allUsers }) => {
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
  const [usernameErrorMessage, setUsernameErrorMessage] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const hasChanged =
    updatedUser.username !== selectedUser.username ||
    updatedUser.isadmin !== selectedUser.isadmin ||
    updatedUser.password !== "";

  const handleSaveChanges = async () => {
    if (/\s|\t|\n/.test(updatedUser.password)) {
      setPasswordErrorMessage(
        "Password cannot have white spaces, tabs or new line characters"
      );
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    if (hasChanged) {
      // Ask for confirmation before saving changes
      setConfirmationMessage(
        `Are you sure you want to update the information for this user?

      Changes:
      - Admin status: ${
        updatedUser.isadmin !== selectedUser.isadmin
          ? `${selectedUser.isadmin ? "Admin" : "Normal user"} -> ${
              updatedUser.isadmin ? "Admin" : "Normal user"
            }`
          : "No change"
      }

      - Password: ${updatedUser.password !== "" ? "Changed" : "No change"}`
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

  const handleAddNewUser = () => {
    let noError = true
    if (updatedUser.username === "") {
      setUsernameErrorMessage(" Username is required.");
      noError = false
    }
    if (updatedUser.password === "") {
      setPasswordErrorMessage(" Password is required.");
      noError = false
    }
    if (/\s|\t|\n/.test(updatedUser.password)) {
      setPasswordErrorMessage(
        "No white spaces, tabs or new line characters"
      );
      noError = false
    }
    if (updatedUser.username !== "") {
      const isUsernamePresent = allUsers.some(
        (user) => user.username === updatedUser.username
      );
      if (isUsernamePresent) {
        setUsernameErrorMessage("Username already exists");
        noError = false
      }
    }
    if (noError){
        setConfirmationMessage(
          `Are you sure you want to add this user?

          - Username: ${updatedUser.username}
          - Admin status: ${updatedUser.isadmin ? "Admin" : "Normal user"}`
        );
        setShowConfirmationModal(true);
        setShowEditModal(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setShowEditModal(true);
  };

  const updateInputFields = useCallback(
    (key, value) => {
      setUpdatedUser((prev) => ({ ...prev, [key]: value }));
    },
    [setUpdatedUser]
  );

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
            <Form className="user-form">
              {mode === "add" && (
                <InputConfigOption
                  label="Username"
                  value={updatedUser.username}
                  desc="Enter the username"
                  setValue={(value) => updateInputFields("username", value)}
                  error={usernameErrorMessage}
                />
              )}
              <PasswordInput
                label={mode === "edit" ? "New Password" : "Password"}
                value={updatedUser.password}
                setValue={(value) => updateInputFields("password", value)}
                error={passwordErrorMessage}
                desc={mode === "edit" ? "Enter new password" : "Enter password"}
                showPassword={showPassword}
                toggleShowPassword={handleShowPassword}
                disabled={false}
              />
              {selectedUser["username"] !== "mainadmin" && (
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
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={mode === "edit" ? handleSaveChanges : handleAddNewUser}
              disabled={!hasChanged}
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
