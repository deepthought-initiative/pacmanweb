/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useRef, useState } from "react";
import "../../css/searchBox.css";
import InputConfigOption from "../util/InputConfigOption.jsx";
import NewDropdown from "../util/NewDropdown.jsx";
import MultiprocessModal from "../util/MultiprocessModal.jsx";
import Spinner from "react-bootstrap/Spinner";

const DuplicationForm = ({
  allCycles,
  mode,
  button_label,
  showLogs,
  showTable,
  setCurrentId,
  setShowLogs,
  startFetchingLogs,
  loading,
  preventClick,
  setLoading,
  setInputFields,
  inputFields,
  logLevelOptions
}) => {
  const [modalShow, setModalShow] = useState(false); // for showing alert when running multiple processes at the same time
  const bothPastAndCurrentCycles = [
    ...inputFields.pastCycle,
    inputFields.currentCycle ? inputFields.currentCycle : [],
  ];
  const [filteredCycles, setFilteredCycles] = useState();

  // Error variables
  const [currentCycleError, setCurrentCycleError] = useState("");
  const [logLevelError, setLogLevelError] = useState("");
  const [pastCycleError, setPastCycleError] = useState("");

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
    if (!inputFields.logLevel) {
      setLogLevelError("Required");
      noError = false;
    }
    if (inputFields.pastCycle.length === 0) {
      setPastCycleError("Select at least one");
      noError = false;
    }
    return noError;
  };

  const resetErrors = () => {
    setCurrentCycleError("");
    setPastCycleError("");
    setLogLevelError("");
  };

  const handleClick = async (event) => {
    event.preventDefault();
    resetErrors();
    const checkErrors = validateFields();
    if (checkErrors) {
      let spawnResponse;
      setLoading(true);
      const params = [
        `mode=${mode}`,
        `past_cycles=${bothPastAndCurrentCycles.toString()}`,
        `main_test_cycle=${inputFields.currentCycle}`,
        `log_level=${inputFields.logLevel}`,
      ];
      const query = params.join("&");
      const Url = `/api/run_pacman?${query}`;
      spawnResponse = await fetch(Url, {
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

  const handleFilteringCycles = (newCurrentCycle) => {
    const newCycles = allCycles.filter((cycle) => {
      return cycle.cycleNumber !== newCurrentCycle;
    });
    const newPastCycles = inputFields.pastCycle.filter((cycle) => {
      return cycle !== newCurrentCycle;
    });
    setInputFields({
      ...inputFields,
      currentCycle: newCurrentCycle,
      pastCycle: newPastCycles,
    });
    setFilteredCycles(newCycles);
  };

  return (
    <form>
      <div className="mt-5" id="main-container">
        {!showLogs && !showTable && <h3>Start a new process</h3>}
        <div className="all-options">
          <div className="row">
            <div className="single-option col-12">
              <NewDropdown
                data={allCycles}
                label="Selected Current Cycle"
                desc="Prefix used throughout script to match with cycle description"
                inputField={inputFields.currentCycle}
                multiple={false}
                setInputField={handleFilteringCycles}
                disabled={showTable || showLogs}
                error={currentCycleError}
              />
            </div>
          </div>
          <div className="row">
            <div className="single-option col-12">
              <NewDropdown
                data={filteredCycles}
                label="Selected Past Cycle(Multiple)"
                desc="Cycle prefixes of past cycles"
                inputField={inputFields.pastCycle}
                multiple={true}
                setInputField={(value) => updateInputFields("pastCycle", value)}
                disabled={showTable || showLogs}
                error={pastCycleError}
              />
            </div>
          </div>
        </div>
      </div>
      {!showTable && !showLogs && (
        <>
          <div className="separator">Other Options</div>
          <div className="all-options">
            <div className="row">
              <div className="single-option col-12">
                <InputConfigOption
                  label="Enter Run name(optional)"
                  value={inputFields.runName}
                  desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
                  setValue={(value) => updateInputFields("runName", value)}
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
                  setInputField={(value) =>
                    updateInputFields("logLevel", value)
                  }
                  disabled={false}
                  error={logLevelError}
                />
              </div>
            </div>
          </div>
          {modalShow && (
            <MultiprocessModal
            modalShow={modalShow}
            setModalShow={setModalShow}
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
        </>
      )}
    </form>
  );
};

export default DuplicationForm;
