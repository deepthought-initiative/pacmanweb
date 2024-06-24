import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

// eslint-disable-next-line react/prop-types
const EditUserModal = ({ show, setShow, mode }) => {
  const handleClose = () => setShow(false);

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
              <Form.Control type="text" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Form.Password">
              <Form.Label>
                <strong>Password</strong>
              </Form.Label>
              <Form.Control type="text" />
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
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Admin"
                  name="group1"
                  id="inline-radio-2"
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            {mode === "edit" ? "Save Changes" : "Create User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUserModal;
