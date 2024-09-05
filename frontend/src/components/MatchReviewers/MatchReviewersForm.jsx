/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useState } from "react";
import "../../css/searchBox.css";
import NewDropdown from "../util/NewDropdown.jsx";
import TextArea from "../util/TextArea.jsx";
import Spinner from "react-bootstrap/Spinner";
import "../../css/otherConfigOptions.css";
import MultiprocessModal from "../util/MultiprocessModal.jsx";
import InputConfigOption from "../util/InputConfigOption.jsx";

const MatchReviewersForm = ({
  allCycles,
  modalFile,
  mode,
  button_label,
  showTable,
  showLogs,
  inputFields,
  setInputFields,
  setCurrentTaskId,
  setShowLogs,
  startFetchingLogs,
  setLoading,
  preventClick,
  logLevelOptions,
  loading,
  updateInputFields
}) => {
  const [modalShow, setModalShow] = useState(false); // for showing alert when running multiple processes at the same time

  // Error variables
  const [textAreaError, setTextAreaError] = useState("");
  const defaultInputFieldsErrors = {
    currentCycle: "",
    selectedModal: "",
    numberOfTopReviewers: "",
    closeCollaboratorTimeFrame: "",
    logLevel: "",
  };
  const [inputFieldsErrors, setInputFieldsErrors] = useState(
    defaultInputFieldsErrors
  );

  const updateInputFieldsErrors = useCallback((key, value) => {
    setInputFieldsErrors((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validateFields = () => {
    let noError = true;
    if (!inputFields.currentCycle) {
      updateInputFieldsErrors("currentCycle", "Required");
      noError = false;
    }
    if (!inputFields.selectedModal) {
      updateInputFieldsErrors("selectedModal", "Required");
      noError = false;
    }
    if (!inputFields.numberOfTopReviewers) {
      updateInputFieldsErrors("numberOfTopReviewers", "Required");
      noError = false;
    }
    if (!inputFields.closeCollaboratorTimeFrame) {
      updateInputFieldsErrors("closeCollaboratorTimeFrame", "Required");
      noError = false;
    }
    if (textAreaError) {
      setTextAreaError("Required");
      noError = false;
    }
    if (!inputFields.logLevel) {
      updateInputFieldsErrors("logLevel", "Required");
    }
    return noError;
  };

  const handleClick = async (event) => {
    event.preventDefault();
    setInputFieldsErrors(defaultInputFieldsErrors)
    setTextAreaError("");
    const checkErrors = validateFields();
    const params = [
      `mode=${mode}`,
      `main_test_cycle=${inputFields.currentCycle}`,
      `modelfile=${inputFields.selectedModal}`,
      `assignment_number_top_reviewers=${inputFields.numberOfTopReviewers}`,
      `close_collaborator_time_frame=${inputFields.closeCollaboratorTimeFrame}`,
      `log_level=${inputFields.logLevel}`,
    ];
    if (inputFields.panelistNames.length !== 0) {
      params.push("panelist_names", inputFields.panelistNames);
      params.push("panelist_names_mode", "append");
    }
    // const runNameParam = inputFields.runName.trim().replace(/\s+/g, '_');
    // if (runNameParam !== "") {
    //   params.push(`run_name=${runNameParam}`);
    // }
    const query = params.join("&");
    const url = `/api/run_pacman?${query}`;
    if (checkErrors) {
      let spawnResponse;
      setLoading(true);
      spawnResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("default:barebones"),
          "Content-Type": "application/json",
        },
      });
      if (spawnResponse.status === 429) {
        setModalShow(true);
      } else {
        const data = await spawnResponse.json();
        setCurrentTaskId(data["result_id"]);
        setShowLogs(true);
        setLoading(false);
        await startFetchingLogs(data["result_id"]);
      }
    }
  };

  return (
    <form>
      <div className="mt-3" id="main-container">
        {!showLogs && !showTable && <h3>Start a new process</h3>}
        <div>
            <NewDropdown
              data={allCycles}
              label="Selected Current Cycle"
              desc="Prefix used throughout script to match with cycle description"
              inputField={inputFields.currentCycle}
              multiple={false}
              setInputField={(value) =>
                updateInputFields("currentCycle", value)
              }
              disabled={showTable || showLogs}
              error={inputFieldsErrors.currentCycle}
            />
          {!showLogs && (
            <div>
              {/** Use panelist panelist-name-container for css*/}
              {/* <div className="upload-panelist-file">
              <div className="border d-flex">
                <input type="file" />
                <button className="btn rounded-1" type="submit">
                  Upload
                </button>
              </div>
            </div>
            <div>OR</div> */}
              <div className="my-3">
                <TextArea
                  setValue={(value) =>
                    updateInputFields("panelistNames", value)
                  }
                  textAreaError={textAreaError}
                  setTextAreaError={setTextAreaError}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="separator">Other Options</div>
      <div className="all-options">
            <InputConfigOption
              label="Enter Run name(optional)"
              value={inputFields.setRunName}
              desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
              setValue={(value) => updateInputFields("runName", value)}
            />
            <NewDropdown
              data={modalFile}
              multiple={false}
              label="Select modal file to use"
              desc="Name of modal file to use"
              inputField={inputFields.selectedModal}
              setInputField={(value) =>
                updateInputFields("selectedModal", value)
              }
              disabled={false}
              error={inputFieldsErrors.selectedModal}
            />
            <InputConfigOption
              label="Assignment Number Top Reviewers"
              value={inputFields.numberOfTopReviewers}
              desc="Number of top recommended reviewers"
              setValue={(value) =>
                updateInputFields("numberOfTopReviewers", value)
              }
              error={inputFieldsErrors.numberOfTopReviewers}
            />
            <InputConfigOption
              label="Close Collaborator Time Frame"
              value={inputFields.closeCollaboratorTimeFrame}
              desc="Number of years over which to check close collaborators"
              setValue={(value) =>
                updateInputFields("closeCollaboratorTimeFrame", value)
              }
              error={inputFieldsErrors.closeCollaboratorTimeFrame}
            />
            <NewDropdown
              data={logLevelOptions}
              multiple={false}
              label="Select Log Level"
              desc="Log Level to set"
              inputField={inputFields.logLevel}
              setInputField={(value) => updateInputFields("logLevel", value)}
              disabled={false}
              error={inputFieldsErrors.logLevel}
            />
      </div>
      {modalShow && (
        <MultiprocessModal modalShow={modalShow} setModalShow={setModalShow} />
      )}
      <div className="row mt-5">
        <div className="col-md-6 text-start">
          <button
            className="btn form-page-button rounded-0"
            onClick={loading ? preventClick : handleClick}
            disabled={showLogs || showTable}
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

export default MatchReviewersForm;
