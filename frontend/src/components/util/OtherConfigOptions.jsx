/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Spinner from "react-bootstrap/Spinner";
import "../../css/otherConfigOptions.css";
import AlertModal from "./AlertBox.jsx";
import InputConfigOption from "./InputConfigOption";
import NewDropdown from "./NewDropdown.jsx";

const OtherConfigOptions = ({
  button_label,
  modalShow,
  multipleRequestAlertTitle,
  multipleRequestAlertDesc,
  setModalShow,
  handleClick,
  preventClick,
  runName,
  modalFile,
  selectedModal,
  setSelectedModal,
  setRunName,
  selectedModalError,
  logLevelError,
  loading,
  logLevel,
  numberOfTopReviewers,
  closeCollaboratorTimeFrame,
  setNumberOfTopReviewers,
  setCloseCollaboratorTimeFrame,
  setLogLevel,
}) => {
  const createDropdownObjects = (dataList) => {
    return dataList.map((item) => ({
      cycleNumber: item,
      label: item.toString(), // Assuming items have a toString method
      style: {
        backgroundColor: "",
      },
    }));
  };
  const logLevelOptions = ["info", "debug", "warning", "critical"];
  return (
    <form>
      <div className="separator">Other Options</div>
      <div className="all-options">
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Enter Run name(optional)"
              value={runName}
              desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
              setValue={setRunName}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <NewDropdown
              data={createDropdownObjects(modalFile)}
              multiple={false}
              label="Select modal file to use"
              desc="Name of modal file to use"
              inputField={selectedModal}
              setInputField={setSelectedModal}
              disabled={false}
              error={selectedModalError}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Assignment Number Top Reviewers"
              value={numberOfTopReviewers}
              desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
              setValue={setNumberOfTopReviewers}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Close Collaborator Time Frame"
              value={closeCollaboratorTimeFrame}
              desc="Number of years over which to check close collaborators"
              setValue={setCloseCollaboratorTimeFrame}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <NewDropdown
              data={createDropdownObjects(logLevelOptions)}
              multiple={false}
              label="Select Log Level"
              desc="Log Level to set"
              inputField={logLevel}
              setInputField={setLogLevel}
              disabled={false}
              error={logLevelError}
            />
          </div>
        </div>
      </div>
      {modalShow && (
        <AlertModal
          show={modalShow}
          title={multipleRequestAlertTitle}
          desc={multipleRequestAlertDesc}
          buttonText="Close"
          onHide={() => setModalShow(false)}
        />
      )}
      <div className="row mt-5">
        <div className="col-md-6 text-start">
          <button
            className="btn form-page-button rounded-0"
            onClick={loading ? preventClick : handleClick}
          >
            {loading ? (
              <>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            ) : (
              button_label
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OtherConfigOptions;
