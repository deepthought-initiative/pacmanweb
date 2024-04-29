/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [modalShow, setModalShow] = useState(false); // for showing alert when running multiple processes at the same time
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [currentCycle, setCurrentCycle] = useState();
  const [filteredCycles, setFilteredCycles] = useState();
  const [progressPercentage, setProgressPercentage] = useState(0);

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

  // Text description for alert modals
  const multipleRequestAlertTitle = "Process Running Elsewhere";
  const multipleRequestAlertDesc =
    "It seems you started a process somewhere else. You can move to that tab or start a process here after terminating the process.";

  const terminateAllProcesses = useCallback(async () => {
    if (!currentId) {
      return;
    }
    await fetch(`/api/terminate/${currentId}?mode=${mode}`, {
      method: "POST",
    });
    onTerminate();
  }, [currentId, mode]);

  useEffect(() => {
    setFilteredCycles(allCycles);
    const handleBeforeUnload = async (event) => {
      await terminateAllProcesses();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [allCycles, terminateAllProcesses]);

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
    setProgressPercentage(0);
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

  const handleFilteringCycles = (newCurrentCycle) => {
    const newCycles = allCycles.filter((cycle) => {
      return cycle.cycleNumber !== newCurrentCycle;
    });
    const newPastCycles = pastCycle.filter((cycle) => {
      return cycle !== newCurrentCycle;
    });
    setCurrentCycle(newCurrentCycle);
    setPastCycle(newPastCycles);
    setFilteredCycles(newCycles);
  };

  const fetchTable = useCallback(
    async (curId) => {
      if (!curId) {
        return;
      }
      let tableCategory = "";
      if (mode == "PROP") {
        tableCategory = "proposal_cat_output";
      }
      if (mode == "DUP") {
        tableCategory = "duplicates_output";
      }
      if (mode == "MATCH") {
        tableCategory = "match_reviewers_output";
      }
      try {
        const tableResponse = await fetch(
          `/api/outputs/${tableCategory}/${curId}?cycle_number=${currentCycle}`,
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
        console.log(tabularData, code);
        setDataToDisplay(tabularData);
        if (code !== 200) {
          setProcessStatus(false);
          setProgressPercentage(100);
          alert("Process failed! Please try again");
          setLogs((prevLogs) => [...prevLogs, "PROCESS FAILED"]);
        } else {
          setProcessStatus(true);
          setProgressPercentage(100);
          setLogs((prevLogs) => [...prevLogs, "PROCESS SUCCESSFUL"]);
        }
        logContainerRef.current.scrollTop =
          logContainerRef.current.scrollHeight;
        console.log(processStatus);
      } catch (error) {
        setProgressPercentage(100);
        console.error("Error fetching table data:", error);
      }
    },
    [currentCycle, mode, processStatus]
  );
  const startFetchingLogs = useCallback(
    async (curId) => {
      let reconnectFrequencySeconds = 1;

      const fetchLogs = async () => {
        try {
          const eventSource = new EventSource(`/api/stream/${curId}`);
          eventSource.onopen = () => {
            setShowTerminateProcess(true);
          };
          eventSource.onmessage = async (event) => {
            const newLog = event.data;
            console.log("message");
            if (newLog.includes("STARTING RUN")) {
              setProgressPercentage(10);
            }
            if (
              newLog.includes("PROCESS COMPLETE") ||
              newLog.includes("run complete")
            ) {
              await fetchTable(curId);
              eventSource.close();
              setShowTerminateProcess(false);
              return; // Exit after process completion
            }
            setLogs((prevLogs) => [...prevLogs, newLog]);
            logContainerRef.current.scrollTop =
              logContainerRef.current.scrollHeight;
          };
          eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            setShowTerminateProcess(false);
            reconnectFrequencySeconds = Math.min(
              reconnectFrequencySeconds * 2,
              64
            );
            setTimeout(
              () => startFetchingLogs(curId),
              reconnectFrequencySeconds * 1000
            );
          };
        } catch (error) {
          console.error("Error fetching logs:", error);
          setTimeout(
            () => startFetchingLogs(curId),
            reconnectFrequencySeconds * 1000
          );
        }
      };

      await fetchLogs();
    },
    [fetchTable, setShowTerminateProcess, setLogs, logContainerRef]
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
      console.log(spawnResponse.status);
      if (spawnResponse.status === 429) {
        setModalShow(true);
      } else {
        const data = await spawnResponse.json();
        setCurrentId(data["result_id"]);
        setShowLogs(true);
        setSubmitButtonStatus(false);
        await startFetchingLogs(data["result_id"]);
      }
    }
    console.log(allCycles);
    console.log(filteredCycles);
  };

  const downloadCSV = async () => {
    const csvUrl = `/api/outputs/download/${currentId}?cycle_number=${currentCycle}&mode=${mode}`;
    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fileName = response.headers
        .get("content-disposition")
        .split("=")[1];
      let blob;
      if (mode == "MATCH") {
        blob = await response.blob();
      } else {
        const data = await response.text();
        blob = new Blob([data], { type: "text/csv" });
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const downloadZIP = async () => {
    const zipUrl = `/api/outputs/download/zip/${currentId}`;
    try {
      const response = await fetch(zipUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fileName = response.headers
        .get("content-disposition")
        .split("=")[1];
      const blob = await response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadURL;
      downloadLink.setAttribute("download", fileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading ZIP file:", error);
    }
  };

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
            setInputField={handleFilteringCycles}
            disabled={showTable || showLogs}
            error={currentCycleError}
          />
        </div>
        {mode === "DUP" && (
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
          currentId: currentId,
          currentCycle: currentCycle,
          setShowTable: setShowTable,
          setShowLogs: setShowLogs,
          onCategorizeAnotherCycle: onTerminate,
          dataToDisplay: dataToDisplay,
          downloadCSV: downloadCSV,
          mode: mode,
          downloadZIP: downloadZIP,
        })
      ) : showLogs ? (
        <Logs
          currentId={currentId}
          setShowTable={setShowTable}
          terminateAllProcesses={terminateAllProcesses}
          onTerminate={onTerminate}
          logs={logs}
          progressPercentage={progressPercentage}
          processStatus={processStatus}
          logContainerRef={logContainerRef}
          showTerminateProcess={showTerminateProcess}
          dataToDisplay={dataToDisplay}
          downloadCSV={downloadCSV}
          downloadZIP={downloadZIP}
        />
      ) : (
        <OtherConfigOptions
          button_label={button_label}
          modalShow={modalShow}
          multipleRequestAlertTitle={multipleRequestAlertTitle}
          multipleRequestAlertDesc={multipleRequestAlertDesc}
          setModalShow={setModalShow}
          handleClick={handleClick}
          currentCycle={currentCycle}
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
