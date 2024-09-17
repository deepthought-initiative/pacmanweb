/* eslint-disable react/prop-types */
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const AlertModal = ({ show, onHide, title, desc, buttonText }) => {
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
          <strong>{title}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {desc.map((line, count) => {
          count += 1;
          return <p key={`${count}_${line}`}>{line}</p>;
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>{buttonText}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
