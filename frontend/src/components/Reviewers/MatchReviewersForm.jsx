/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useRef, useState } from "react";
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
  setCurrentId,
  setShowLogs,
  startFetchingLogs,
  setLoading,
  preventClick,
  logLevelOptions,
  loading,
}) => {
  const [modalShow, setModalShow] = useState(false); // for showing alert when running multiple processes at the same time

  // Error variables
  const [currentCycleError, setCurrentCycleError] = useState("");
  const [selectedModalError, setSelectedModalError] = useState("");
  const [numberOfTopReviewersError, setNumberOfTopReviewersError] =
    useState("");
  const [closeCollaboratorTimeFrameError, setCloseCollaboratorTimeFrameError] =
    useState("");
  const [logLevelError, setLogLevelError] = useState("");
  const [textAreaError, setTextAreaError] = useState("");

  const updateInputFields = useCallback(
    (key, value) => {
      setInputFields((prev) => ({ ...prev, [key]: value }));
    },
    [setInputFields]
  );

  const validateFields = () => {
    let noError = true;
    if (!inputFields.currentCycle) {
      setCurrentCycleError("Required");
      noError = false;
    }
    if (!inputFields.selectedModal) {
      setSelectedModalError("Required");
      noError = false;
    }
    if (!inputFields.numberOfTopReviewers) {
      setNumberOfTopReviewersError("Required");
      noError = false;
    }
    if (!inputFields.closeCollaboratorTimeFrame) {
      setCloseCollaboratorTimeFrameError("Required");
      noError = false;
    }
    if (textAreaError) {
      setTextAreaError("Required");
      noError = false;
    }
    if (!inputFields.logLevel) {
      setLogLevelError("Required");
    }
    return noError;
  };

  const resetErrors = () => {
    setCurrentCycleError("");
    setSelectedModalError("");
    setNumberOfTopReviewersError("");
    setCloseCollaboratorTimeFrameError("");
    setTextAreaError("");
    setLogLevelError("");
  };

  const handleClick = async (event) => {
    event.preventDefault();
    resetErrors();
    const checkErrors = validateFields();
    const params = [
      `mode=${mode}`,
      `main_test_cycle=${inputFields.currentCycle}`,
      `modelfile=${inputFields.selectedModal}`,
      `assignment_number_top_reviewers=${inputFields.numberOfTopReviewers}`,
      `close_collaborator_time_frame=${inputFields.closeCollaboratorTimeFrame}`,
      `log_level=${inputFields.logLevel}`,
      `assignment_number_top_reviewers=${inputFields.numberOfTopReviewers}`,
    ];
    if (inputFields.panelistNames.length !== 0) {
      params.push("panelist_names", inputFields.panelistNames);
      params.push("panelist_names_mode", "append");
    }

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
        setCurrentId(data["result_id"]);
        setShowLogs(true);
        setLoading(false);
        await startFetchingLogs(data["result_id"]);
      }
    }
  };

  return (
    <form>
      <div className="mt-5" id="main-container">
        {!showLogs && !showTable && <h3>Start a new process</h3>}
        <div>
          <div className="row">
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
              error={currentCycleError}
            />
          </div>
          {!showLogs && (
            <div>
              {" "}
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
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Enter Run name(optional)"
              value={inputFields.setRunName}
              desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
              setValue={(value) => updateInputFields("runName", value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
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
              error={selectedModalError}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Assignment Number Top Reviewers"
              value={inputFields.numberOfTopReviewers}
              desc="Number of top recommended reviewers"
              setValue={(value) =>
                updateInputFields("numberOfTopReviewers", value)
              }
              error={numberOfTopReviewersError}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Close Collaborator Time Frame"
              value={inputFields.closeCollaboratorTimeFrame}
              desc="Number of years over which to check close collaborators"
              setValue={(value) =>
                updateInputFields("closeCollaboratorTimeFrame", value)
              }
              error={closeCollaboratorTimeFrameError}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <NewDropdown
              data={logLevelOptions}
              multiple={false}
              label="Select Log Level"
              desc="Log Level to set"
              inputField={inputFields.logLevel}
              setInputField={(value) => updateInputFields("logLevel", value)}
              disabled={false}
              error={logLevelError}
            />
          </div>
        </div>
      </div>
      {modalShow && (
        <MultiprocessModal modalShow={modalShow} setModalShow={setModalShow} />
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

export default MatchReviewersForm;
