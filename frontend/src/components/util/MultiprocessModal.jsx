/* eslint-disable react/prop-types */
import AlertModal from "./AlertModal";

const MultiprocessModal = ({ modalShow, setModalShow }) => {
  const multipleRequestAlertTitle = "Process Running Elsewhere";
  const multipleRequestAlertDesc = [
    "It seems you started a process somewhere else. You can move to that tab or start a process here after terminating the process.",
  ];

  return (
    <AlertModal
      show={modalShow}
      buttonText="Close"
      title={multipleRequestAlertTitle}
      desc={multipleRequestAlertDesc}
      onHide={() => setModalShow(false)}
    />
  );
};

export default MultiprocessModal;
