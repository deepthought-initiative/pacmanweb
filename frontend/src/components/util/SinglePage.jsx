/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useRef, useState } from "react";
import "../../css/searchBox.css";
import Logs from "../util/Logs";
import NewDropdown from "./NewDropdown.jsx";
// import DropdownConfigOption from "./DropdownConfigOption.jsx";
import OtherConfigOptions from "./OtherConfigOptions";

const SinglePage = ({
  allCycles,
  modalFile,
  mode,
  renderTableComponent,
  button_label,
}) => {
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [currentCycle, setCurrentCycle] = useState();

  // state variables for other config options
  const [runName, setRunName] = useState("");
  const [selectedModal, setSelectedModal] = useState(
    "strolger_pacman_model_7cycles.joblib"
  );
  const [numberOfTopReviewers, setNumberOfTopReviewers] = useState(5);
  const [closeCollaboratorTimeFrame, setCloseCollaboratorTimeFrame] =
    useState(3);
  const [pastCycle, setPastCycle] = useState([]);
  const bothPastandCurrentCycles = [...pastCycle, currentCycle];

  // Error variables
  const [currentCycleError, setCurrentCycleError] = useState("");
  const [selectedModalError, setSelectedModalError] = useState("");
  const [numberOfTopReviewersError, setNumberOfTopReviewersError] =
    useState("");
  const [closeCollaboratorTimeFrameError, setCloseCollaboratorTimeFrameError] =
    useState("");
  const [pastCycleError, setPastCycleError] = useState("");
  //
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [processStatus, setProcessStatus] = useState(false);
  const logContainerRef = useRef(null);

  const [submitButtonStatus, setSubmitButtonStatus] = useState(true);

  const validateFields = () => {
    let noError = true;
    if (!currentCycle) {
      setCurrentCycleError("Required");
      noError = false;
    }
    if (!selectedModal) {
      setSelectedModalError("Required");
      noError = false;
    }
    if (!numberOfTopReviewers) {
      setNumberOfTopReviewersError("Required");
      noError = false;
    }
    if (!closeCollaboratorTimeFrame) {
      setCloseCollaboratorTimeFrameError("Required");
      noError = false;
    }

    // Validate pastCycle only if mode is "DUP"
    if (mode === "DUP" && pastCycle.length === 0) {
      setPastCycleError("Select at least one");
      noError = false;
    }
    return noError;
  };

  const resetErrors = () => {
    setCurrentCycleError("");
    setSelectedModalError("");
    setNumberOfTopReviewersError("");
    setCloseCollaboratorTimeFrameError("");
    setPastCycleError("");
  };

  const onTerminate = () => {
    setCurrentId();
    setShowLogs(false);
    setShowTable(false);
    setLogs([]);
    setShowTerminateProcess(true);
    setProcessStatus(false);
    setCurrentCycle("");
    setPastCycle([]);
    setRunName("");
    setSelectedModal("strolger_pacman_model_7cycles.joblib");
    setSubmitButtonStatus(true);
    setNumberOfTopReviewers(5);
    setCloseCollaboratorTimeFrame(3);
  };

  const filteredCycles = allCycles.filter((cycle) => {
    return cycle !== currentCycle;
  });

  // const handlePastCycles = (event) => {
  //   const options = Array.from(event.target.selectedOptions).map(
  //     (option) => option.value
  //   );
  //   setPastCycle(options);
  // };

  const fetchStatus = useCallback(
    async (curId) => {
      try {
        const statusResponse = await fetch(`/api/prev_runs/${curId}`);
        if (!statusResponse.ok) {
          throw new Error(
            `Failed to fetch status: ${statusResponse.statusText}`
          );
        }
        const activityStatus = await statusResponse.json();
        const status = activityStatus["successful"];
        console.log(status);
        const statusLog = status ? "PROCESS SUCCESSFUL" : "PROCESS FAILED";
        setProcessStatus(status);
        setLogs((prevLogs) => [...prevLogs, statusLog]);
        logContainerRef.current.scrollTop =
          logContainerRef.current.scrollHeight;
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    },
    [setProcessStatus, setLogs]
  );

  const fetchTable = useCallback(
    async (curId) => {
      if (!curId) {
        return;
      }
      try {
        const tableResponse = await fetch(
          `/api/outputs/proposal_cat_output/${curId}?cycle_number=${currentCycle}`,
          {
            method: "GET",
            credentials: "include",
            headers: { Authorization: "Basic " + btoa("default:barebones") },
          }
        );
        if (!tableResponse.ok) {
          throw new Error(
            `Failed to fetch table data: ${tableResponse.statusText}`
          );
        }
        const tableData = await tableResponse.json();
        const [tabularData, code] = tableData;
        setDataToDisplay(tabularData);
        console.log(tableData, code);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    },
    [currentCycle, setDataToDisplay]
  );

  const fetchLogs = useCallback(
    (curId) => {
      const eventSource = new EventSource(`/api/stream/${curId}`);
      eventSource.onopen = () => {
        setShowTerminateProcess(true);
        console.log("open");
      };
      eventSource.onmessage = (event) => {
        const newLog = event.data;
        console.log("message");
        if (
          newLog.includes("PROCESS COMPLETE") ||
          newLog.includes("run complete")
        ) {
          fetchTable(curId);
          fetchStatus(curId);
          eventSource.close();
          setShowTerminateProcess(false);
        }
        setLogs((prevLogs) => [...prevLogs, newLog]);
        logContainerRef.current.scrollTop =
          logContainerRef.current.scrollHeight;
      };
      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setShowTerminateProcess(false);
      };
    },
    [fetchStatus, fetchTable]
  );

  const handleClick = async (event) => {
    event.preventDefault();
    resetErrors();
    const checkErrors = validateFields();
    if (checkErrors) {
      let spawnResponse;
      if (mode == "DUP") {
        spawnResponse = await fetch(
          `/api/run_pacman?mode=${mode}&past_cycles=${bothPastandCurrentCycles.toString()}&main_test_cycle=${currentCycle}&modelfile=${selectedModal}&assignment_number_top_reviewers=${numberOfTopReviewers}&close_collaborator_time_frame=${closeCollaboratorTimeFrame}`,
          {
            method: "GET",
            headers: {
              Authorization: "Basic " + btoa("default:barebones"),
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        spawnResponse = await fetch(
          `/api/run_pacman?mode=${mode}&main_test_cycle=${currentCycle}&modelfile=${selectedModal}&assignment_number_top_reviewers=${numberOfTopReviewers}&close_collaborator_time_frame=${closeCollaboratorTimeFrame}`,
          {
            method: "GET",
            headers: {
              Authorization: "Basic " + btoa("default:barebones"),
              "Content-Type": "application/json",
            },
          }
        );
      }
      const data = await spawnResponse.json();
      setCurrentId(data["result_id"]);
      setShowLogs(true);
      setSubmitButtonStatus(false);
      await fetchLogs(data["result_id"]);
    }
  };

  // // useEffect hook to fetch logs when component mounts or currentId changes
  // useEffect(() => {
  //   if (currentId) {
  //     fetchLogs(currentId);
  //   }
  // }, [currentId, fetchLogs]);

  return (
    <div className="mt-5" id="main-container">
      {!showLogs && !showTable && <h3>Start a new process</h3>}
      <div className={`${mode === "DUP" && "d-flex"}`}>
        <div className={`row ${mode === "DUP" && "col-md-6"}`}>
          <NewDropdown
            data={allCycles}
            label="Selected Current Cycle"
            desc="Prefix used throughout script to match with cycle description"
            inputField={currentCycle}
            multiple={false}
            setInputField={setCurrentCycle}
            disabled={showTable || showLogs}
            error={currentCycleError}
          />
        </div>
        {mode === "DUP" && (
          // <div className="col-md-6 ms-auto">
          //   <div className="option-header">
          //     <label className="form-label">Selected Past Cycle</label>
          //     {pastCycleError && <ErrorMessage message={pastCycleError} />}
          //   </div>
          //   <div>
          //     <select
          //       className="form-select rounded-0 border-2"
          //       onChange={handlePastCycles}
          //       size="2"
          //       defaultValue={["DEFAULT"]}
          //       multiple
          //       disabled={showLogs || showTable}
          //     >
          //       <option disabled value={"DEFAULT"}>
          //         Select a past cycle
          //       </option>
          //       {filteredCycles &&
          //         filteredCycles.map((number) => (
          //           <option key={number} value={number}>
          //             {number}
          //           </option>
          //         ))}
          //     </select>
          //   </div>
          //   <div className="form-text text-start mt-2">
          //     Cycle prefixes of past cycles
          //   </div>
          // </div>
          <div className="row col-md-6 ms-auto">
            <NewDropdown
              data={filteredCycles}
              label="Selected Past Cycle(Multiple)"
              desc="Cycle prefixes of past cycles"
              inputField={pastCycle}
              multiple={true}
              setInputField={setPastCycle}
              disabled={showTable || showLogs}
              error={pastCycleError}
            />
          </div>
        )}
      </div>
      {showTable ? (
        renderTableComponent({
          setShowTable: setShowTable,
          setShowLogs: setShowLogs,
          onCategorizeAnotherCycle: onTerminate,
          dataToDisplay: dataToDisplay,
        })
      ) : showLogs ? (
        <Logs
          currentId={currentId}
          setShowTable={setShowTable}
          onTerminate={onTerminate}
          logs={logs}
          processStatus={processStatus}
          logContainerRef={logContainerRef}
          showTerminateProcess={showTerminateProcess}
          dataToDisplay={dataToDisplay}
        />
      ) : (
        <OtherConfigOptions
          button_label={button_label}
          handleClick={handleClick}
          runName={runName}
          modalFile={modalFile}
          numberOfTopReviewers={numberOfTopReviewers}
          closeCollaboratorTimeFrame={closeCollaboratorTimeFrame}
          selectedModal={selectedModal}
          setSelectedModal={setSelectedModal}
          setRunName={setRunName}
          setNumberOfTopReviewers={setNumberOfTopReviewers}
          setCloseCollaboratorTimeFrame={setCloseCollaboratorTimeFrame}
          selectedModalError={selectedModalError}
          numberOfTopReviewersError={numberOfTopReviewersError}
          closeCollaboratorTimeFrameError={closeCollaboratorTimeFrameError}
          submitButtonStatus={submitButtonStatus}
        />
      )}
    </div>
  );
};

export default SinglePage;
