/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useState } from "react";
import "../../css/searchBox.css";
import NewDropdown from "../util/NewDropdown.jsx";
import Spinner from "react-bootstrap/Spinner";
import "../../css/otherConfigOptions.css";
import AlertModal from "../util/AlertBox.jsx";
import InputConfigOption
 from "../util/InputConfigOption.jsx";

const CategorizationForm = ({
  allCycles,
  modalFile,
  mode,
  showLogs,
  showTable,
  button_label,
  setCurrentId,
  setShowLogs,
  startFetchingLogs, 
  loading,
  preventClick,
  setLoading,
  setInputFields,
  inputFields,
}) => {
  const [modalShow, setModalShow] = useState(false); // for showing alert when running multiple processes at the same time

  // Error variables
  const [currentCycleError, setCurrentCycleError] = useState("");
  const [selectedModalError, setSelectedModalError] = useState("");
  const [logLevelError, setLogLevelError] = useState("");
  
  // Text description for alert modals
  const multipleRequestAlertTitle = "Process Running Elsewhere";
  const multipleRequestAlertDesc =
    "It seems you started a process somewhere else. You can move to that tab or start a process here after terminating the process.";

  const createDropdownObjects = (dataList) => {
    return dataList.map((item) => ({
      cycleNumber: item,
      label: item.toString(),
      style: {
        backgroundColor: "",
      },
    }));
  };
  const logLevelOptions = ["info", "debug", "warning", "critical"];

  const updateInputFields = useCallback((key, value) => {
    setInputFields(prev => ({...prev, [key]: value}));
  }, [setInputFields]);

  const validateFields = () => {
    let noError = true;
    if (!inputFields?.currentCycle) {
      setCurrentCycleError("Required");
      noError = false;
    }
    if (!inputFields?.selectedModal) {
      setSelectedModalError("Required");
      noError = false;
    }
    if (!inputFields?.logLevel) {
      setLogLevelError("Required");
      noError = false;
    }
    return noError;
  };

  const resetErrors = () => {
    setCurrentCycleError("");
    setSelectedModalError("");
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
        `main_test_cycle=${inputFields["currentCycle"]}`,
        `modelfile=${inputFields["selectedModal"]}`,
        `log_level=${inputFields["logLevel"]}`,
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
              inputField={inputFields["currentCycle"]}
              multiple={false}
              setInputField={(value) => updateInputFields("currentCycle", value)}
              disabled={showLogs || showTable}
              error={currentCycleError}
            />
          </div>
        </div>
      </div>
      {!showLogs && !showTable && (
        <>
        <div className="separator">Other Options</div>
        <div className="all-options">
          <div className="row">
            <div className="single-option col-12">
              <InputConfigOption
                label="Enter Run name(optional)"
                value={inputFields["runName"]}
                desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"
                setValue={(value) => updateInputFields("runName", value)}
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
                inputField={inputFields["selectedModal"]}
                setInputField={(value) => updateInputFields("selectedModal", value)}
                disabled={false}
                error={selectedModalError}
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
                inputField={inputFields["logLevel"]}
                setInputField={(value) => updateInputFields("logLevel", value)}
                disabled={false}
                error={logLevelError}
              />
            </div>
          </div>
        </div>
        {modalShow && (
        <AlertModal
          show={modalShow}
          buttonText="Close"
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
        </>
      )}
    </form>
  );
};

export default CategorizationForm;
