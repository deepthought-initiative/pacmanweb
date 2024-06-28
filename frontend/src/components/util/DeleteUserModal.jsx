/* eslint-disable react/prop-types */
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const DeleteUserModal = ({
  show,
  onHide,
  buttonText,
  handleDeleteUser,
  selectedUser,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <strong>{`Deleting user for ${selectedUser.username}`}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{`Username: ${selectedUser.username}`}</p>
        <p>{`Status: ${selectedUser.isadmin ? "Admin" : "Normal User"}`}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleDeleteUser}>{buttonText}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;
