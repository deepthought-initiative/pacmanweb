/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import ConfirmationModal from "./ConfirmationModal";
import InputConfigOption from "./InputConfigOption";
import PasswordInput from "./PasswordInput";
import ToastContext from "../../context/ToastContext.jsx";
import { AddUser, EditUser } from "./Api.jsx";

// eslint-disable-next-line react/prop-types
const EditUserModal = ({
  show,
  setShow,
  mode,
  selectedUser,
  allUsers,
  setAllUsers,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(true);
  const [updatedUser, setUpdatedUser] = useState({
    username: selectedUser?.username || "",
    isadmin: selectedUser?.isadmin || false,
    password: selectedUser?.password || "",
  });
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Function for showing toasts
  const { showToastMessage } = useContext(ToastContext);

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

  const handleEditUser = async () => {
    let noWhiteSpace = true;
    if (/\s|\t|\n/.test(updatedUser.password)) {
      noWhiteSpace = false;
      setPasswordErrorMessage("No white spaces, tabs or new line characters");
    }

    if (noWhiteSpace && hasChanged) {
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
    }
  };

  const handleConfirmation = async () => {
    setShowConfirmationModal(false);
    const formData = new FormData();
    formData.append("username", updatedUser.username);
    formData.append("isadmin", updatedUser.isadmin);
    formData.append("password", updatedUser.password);
    if (mode === "ADD") {
      try {
        const addedUser = await AddUser(formData);
        let addedUserData = addedUser.user_data;
        addedUserData.isadmin =
          addedUserData.isadmin === "True" || addedUserData.isadmin === "true";
        setAllUsers((prev) => [...prev, addedUserData]);
        showToastMessage("success", `Added user ${addedUserData.username}`);
        handleClose();
      } catch (error) {
        console.error("Error adding user:", error);
        showToastMessage("danger", "Failed to add user!");
      }
    }
    if (mode === "EDIT") {
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
      try {
        const editedUser = await EditUser(formData)
        const editedUserData = editedUser.user_data;
        const newUsers = allUsers.map((user) => {
          if (user.username === editedUserData.username) {
            return {
              username: editedUserData.username,
              isadmin:
                editedUserData.isadmin === "True" ||
                editedUserData.isadmin === "true",
            };
          } else {
            return user;
          }
        });
        setAllUsers(newUsers);
        showToastMessage("success", `Updated user ${editedUserData.username}`);
        handleClose();
      } catch (error) {
        showToastMessage("danger", "Failed to edit user!");
      }
    }
  };

  const validateFields = () => {
    let noError = true;
    if (updatedUser.username === "") {
      setUsernameErrorMessage(" Username is required.");
      noError = false;
    }
    if (updatedUser.password === "") {
      setPasswordErrorMessage(" Password is required.");
      noError = false;
    }
    if (/\s|\t|\n/.test(updatedUser.password)) {
      setPasswordErrorMessage("No white spaces, tabs or new line characters");
      noError = false;
    }
    if (updatedUser.username !== "") {
      const isUsernamePresent = allUsers.some(
        (user) => user.username === updatedUser.username
      );
      if (isUsernamePresent) {
        setUsernameErrorMessage("Username already exists");
        noError = false;
      }
    }
    return noError;
  };

  const handleAddNewUser = () => {
    const inputFieldsValidated = validateFields();
    if (inputFieldsValidated) {
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
              {mode === "EDIT"
                ? `Editing credentials for ${selectedUser.username}`
                : "Create New User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="user-form">
              {mode === "ADD" && (
                <InputConfigOption
                  label="Username"
                  value={updatedUser.username}
                  desc="Enter the username"
                  setValue={(value) => updateInputFields("username", value)}
                  error={usernameErrorMessage}
                />
              )}
              <PasswordInput
                label={mode === "EDIT" ? "New Password" : "Password"}
                value={updatedUser.password}
                setValue={(value) => updateInputFields("password", value)}
                error={passwordErrorMessage}
                desc={mode === "EDIT" ? "Enter new password" : "Enter password"}
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
              onClick={mode === "EDIT" ? handleEditUser : handleAddNewUser}
              disabled={!hasChanged}
            >
              {mode === "EDIT" ? "Save Changes" : "Create User"}
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
