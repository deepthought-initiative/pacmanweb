/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "../../css/otherConfigOptions.css";
import DropdownConfigOption from "./DropdownConfigOption";
import InputConfigOption from "./InputConfigOption";

const OtherConfigOptions = ({
  button_label,
  handleClick,
  runName,
  modalFile,
  numberOfTopReviewers,
  closeCollaboratorTimeFrame,
  setNumberOfTopReviewers,
  setSelectedModal,
  setRunName,
  setCloseCollaboratorTimeFrame,
  runNameError,
  selectedModalError,
  numberOfTopReviewersError,
  closeCollaboratorTimeFrameError,
}) => {
  return (
    <>
      <div className="separator">Other Options(optional)</div>
      <div className="all-options">
        <div className="single-option">
          <InputConfigOption
            label="Enter Run name"
            value={runName}
            desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
            setValue={setRunName}
            error={runNameError}
          />
        </div>
        <div className="single-option">
          <DropdownConfigOption
            data={modalFile}
            label="Select modal file to use"
            desc="Name of modal file to use"
            setValue={setSelectedModal}
            placeholderText="Select a current cycle"
            disabled={false}
            error={selectedModalError}
          />
        </div>
        <div className="single-option">
          <InputConfigOption
            label="Assignment number top reviewers"
            value={numberOfTopReviewers}
            desc="Number of top recommended reviewers"
            setValue={setNumberOfTopReviewers}
            error={numberOfTopReviewersError}
          />
        </div>
        <div className="single-option">
          <InputConfigOption
            label="Close Collaborator Time Frame"
            value={closeCollaboratorTimeFrame}
            desc="Number of years over which to check close collaborators"
            setValue={setCloseCollaboratorTimeFrame}
            error={closeCollaboratorTimeFrameError}
          />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6 text-start">
          <button className="btn rounded-0" onClick={handleClick}>
            {button_label}
          </button>
        </div>
      </div>
    </>
  );
};

export default OtherConfigOptions;
