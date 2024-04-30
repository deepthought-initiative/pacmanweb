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
  numberOfTopReviewers,
  closeCollaboratorTimeFrame,
  setNumberOfTopReviewers,
  selectedModal,
  setSelectedModal,
  setRunName,
  setCloseCollaboratorTimeFrame,
  selectedModalError,
  numberOfTopReviewersError,
  closeCollaboratorTimeFrameError,
  loading,
}) => {
  const validModalFile = modalFile.map((modal) => ({
    cycleNumber: modal,
    label: modal.toString(),
    style: {
      backgroundColor: "",
    },
  }));

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
              data={validModalFile}
              multiple={false}
              label="Select modal file to use"
              desc="Name of modal file to use"
              inputField={selectedModal}
              setInputField={setSelectedModal}
              placeholderText="Select a current cycle"
              disabled={false}
              error={selectedModalError}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Assignment number top reviewers"
              value={numberOfTopReviewers}
              desc="Number of top recommended reviewers"
              setValue={setNumberOfTopReviewers}
              error={numberOfTopReviewersError}
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
              error={closeCollaboratorTimeFrameError}
            />
          </div>
        </div>
      </div>
      {modalShow && (
        <AlertModal
          show={modalShow}
          title={multipleRequestAlertTitle}
          desc={multipleRequestAlertDesc}
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
