/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useState } from "react";
import "../../css/searchBox.css";
import InputConfigOption from "../util/InputConfigOption.jsx";
import NewDropdown from "../util/NewDropdown.jsx";
import MultiprocessModal from "../util/MultiprocessModal.jsx";
import Spinner from "react-bootstrap/Spinner";
import { runPacman } from "../util/Api.jsx";

const DuplicationForm = ({
  allCycles,
  button_label,
  showLogs,
  showTable,
  setCurrentTaskId,
  setShowLogs,
  startFetchingLogs,
  loading,
  preventClick,
  setLoading,
  setInputFields,
  inputFields,
  logLevelOptions,
  updateInputFields,
}) => {
  const [modalShow, setModalShow] = useState(false); // for showing alert when running multiple processes at the same time
  const bothPastAndCurrentCycles = [
    ...inputFields.pastCycle,
    inputFields.currentCycle ? inputFields.currentCycle : [],
  ];
  const [filteredCycles, setFilteredCycles] = useState(allCycles);

  // Error variables
  const defaultInputFieldsErrors = {
    currentCycle: "",
    logLevel: "",
    pastCycle: "",
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
    if (!inputFields.logLevel) {
      updateInputFieldsErrors("logLevel", "Required");
      noError = false;
    }
    if (inputFields.pastCycle.length === 0) {
      updateInputFieldsErrors("pastCycle", "Select at least one");
      noError = false;
    }
    return noError;
  };

  const handleClick = async (event) => {
    event.preventDefault();
    setInputFieldsErrors(defaultInputFieldsErrors);
    const checkErrors = validateFields();
    if (checkErrors) {
      setLoading(true);
      try {
        let paramsObject = {
          mode: inputFields.mode,
          main_test_cycle: inputFields.currentCycle,
          past_cycles: bothPastAndCurrentCycles,
          log_level: inputFields.logLevel,
        };
        const runNameParam = inputFields.runName.trim().replace(/\s+/g, '_');
        if (runNameParam !== "") {
          paramsObject["run_name"] = inputFields.runName;
        }
        const result_id = await runPacman(paramsObject, setModalShow);
        setCurrentTaskId(result_id);
        setShowLogs(true);
        setLoading(false);
        await startFetchingLogs(result_id);
      } catch (e) {
        console.log(e);
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
      <div className="mt-3" id="main-container">
        {!showLogs && !showTable && <h3>Start a new process</h3>}
        <div className="all-options">
          <NewDropdown
            data={allCycles}
            label="Selected Current Cycle"
            desc="Prefix used throughout script to match with cycle description"
            inputField={inputFields.currentCycle}
            multiple={false}
            setInputField={handleFilteringCycles}
            disabled={showTable || showLogs}
            error={inputFieldsErrors.currentCycle}
          />
          <NewDropdown
            data={filteredCycles}
            label="Selected Past Cycle(Multiple)"
            desc="Cycle prefixes of past cycles"
            inputField={inputFields.pastCycle}
            multiple={true}
            setInputField={(value) => updateInputFields("pastCycle", value)}
            disabled={showTable || showLogs}
            error={inputFieldsErrors.pastCycle}
          />
        </div>
      </div>
      {!showTable && !showLogs && (
        <>
          <div className="separator">Other Options</div>
          <div className="all-options">
            <InputConfigOption
              label="Enter Run name(optional)"
              value={inputFields.runName}
              desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
              setValue={(value) => updateInputFields("runName", value)}
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
        </>
      )}
    </form>
  );
};

export default DuplicationForm;
