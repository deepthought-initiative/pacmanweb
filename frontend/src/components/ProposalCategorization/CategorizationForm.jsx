/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useState } from "react";
import "../../css/searchBox.css";
import NewDropdown from "../util/NewDropdown.jsx";
import Spinner from "react-bootstrap/Spinner";
import "../../css/otherConfigOptions.css";
import MultiprocessModal from "../util/MultiprocessModal.jsx";
import InputConfigOption from "../util/InputConfigOption.jsx";
import { runPacman } from "../util/Api.jsx";

const CategorizationForm = ({
  allCycles,
  modalFile,
  mode,
  showLogs,
  showTable,
  button_label,
  setCurrentTaskId,
  setShowLogs,
  startFetchingLogs,
  loading,
  preventClick,
  setLoading,
  setInputFields,
  updateInputFields,
  inputFields,
  logLevelOptions,
}) => {
  const [modalShow, setModalShow] = useState(false); // for showing alert when running multiple processes at the same time

  const defaultInputFieldsErrors = {
    currentCycle: "",
    selectedModal: "",
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
    if (!inputFields?.currentCycle) {
      updateInputFieldsErrors("currentCycle", "Required");
      noError = false;
    }
    if (!inputFields?.selectedModal) {
      updateInputFieldsErrors("selectedModal", "Required");
      noError = false;
    }
    if (!inputFields?.logLevel) {
      updateInputFieldsErrors("logLevel", "Required");
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
      try{
        let paramsObject = {
          mode: inputFields.mode,
          main_test_cycle: inputFields.currentCycle,
          modelfile: inputFields.selectedModal,
          log_level: inputFields.logLevel
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
      } catch(e) {
        console.log(e);
      }
    }
  };

  return (
    <form>
      <div className="mt-3" id="main-container">
        {!showLogs && !showTable && <h3>Start a new process</h3>}
        <NewDropdown
          data={allCycles}
          label="Selected Current Cycle"
          desc="Prefix used throughout script to match with cycle description"
          inputField={inputFields["currentCycle"]}
          multiple={false}
          setInputField={(value) => updateInputFields("currentCycle", value)}
          disabled={showLogs || showTable}
          error={inputFieldsErrors.currentCycle}
        />
      </div>
      {!showLogs && !showTable && (
        <>
          <div className="separator">Other Options</div>
          <div className="all-options">
              <InputConfigOption
                label="Enter Run name(optional)"
                value={inputFields["runName"]}
                desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
                setValue={(value) => updateInputFields("runName", value)}
              />
              <NewDropdown
                data={modalFile}
                multiple={false}
                label="Select modal file to use"
                desc="Name of modal file to use"
                inputField={inputFields["selectedModal"]}
                setInputField={(value) =>
                  updateInputFields("selectedModal", value)
                }
                disabled={false}
                error={inputFieldsErrors.selectedModal}
              />
              <NewDropdown
                data={logLevelOptions}
                multiple={false}
                label="Select Log Level"
                desc="Log Level to set"
                inputField={inputFields["logLevel"]}
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

export default CategorizationForm;
