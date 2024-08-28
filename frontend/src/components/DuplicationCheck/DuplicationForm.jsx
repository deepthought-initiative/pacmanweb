/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useRef, useState } from "react";
import "../../css/searchBox.css";
import InputConfigOption from "../util/InputConfigOption.jsx";
import Logs from "../util/Logs.jsx";
import NewDropdown from "../util/NewDropdown.jsx";
import OtherConfigOptionsDuplication from "../util/OtherConfigOptionsDuplication.jsx";

const DuplicationForm = ({
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
  const [upperLimit, setUpperLimit] = useState("");
  const [lowerLimit, setLowerLimit] = useState("");

  // state variables for other config options
  const [runName, setRunName] = useState("");
  const [logLevel, setLogLevel] = useState("info");
  const [pastCycle, setPastCycle] = useState([]);
  const bothPastandCurrentCycles = [...pastCycle, currentCycle];

  // Error variables
  const [currentCycleError, setCurrentCycleError] = useState("");
  const [logLevelError, setLogLevelError] = useState("");
  const [pastCycleError, setPastCycleError] = useState("");

  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [processStatus, setProcessStatus] = useState();
  const logContainerRef = useRef(null);

  //loading
  const [loading, setLoading] = useState(false);

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
    if (!logLevel) {
      setLogLevelError("Required");
      noError = false;
    }
    if (pastCycle.length === 0) {
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

  const onTerminate = () => {
    setCurrentId();
    setLogLevel("info");
    setShowLogs(false);
    setShowTable(false);
    setProgressPercentage(0);
    setLogs([]);
    setShowTerminateProcess(true);
    setProcessStatus();
    setCurrentCycle("");
    setPastCycle([]);
    setRunName("");
    setLoading(false);
    setUpperLimit("");
    setLowerLimit("");
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
      if (mode == "DUP") {
        tableCategory = "duplicates_output";
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
          setProgressPercentage(100);
          throw new Error(
            `Failed to fetch table data: ${tableResponse.statusText}`
          );
        }
        const tableData = await tableResponse.json();
        const [tabularData, code] = tableData;
        setDataToDisplay(tabularData);
        setProcessStatus(code);
        if (code === 200) {
          setProgressPercentage(100);
          setLogs((prevLogs) => [...prevLogs, "PROCESS SUCCESSFUL"]);
        } else if (code === 204) {
          setProgressPercentage(100);
          setLogs((prevLogs) => [...prevLogs, "DUPLICATION FILE IS EMPTY."]);
        } else {
          setProgressPercentage(100);
          alert("Process failed! Please try again");
          setLogs((prevLogs) => [...prevLogs, "PROCESS FAILED"]);
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
            if (newLog.includes("STARTING RUN")) {
              setProgressPercentage(10);
            }
            if (newLog.includes("Log file can be found")) {
              setProgressPercentage(50);
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
      setLoading(true);
      spawnResponse = await fetch(
        `/api/run_pacman?mode=${mode}&past_cycles=${bothPastandCurrentCycles.toString()}&main_test_cycle=${currentCycle}&log_level=${logLevel}`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa("default:barebones"),
            "Content-Type": "application/json",
          },
        }
      );
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

  const preventClick = (event) => {
    event.preventDefault();
    return false;
  };

  return (
    <div className="mt-5" id="main-container">
      {!showLogs && !showTable && <h3>Start a new process</h3>}
      <div className="all-options">
        <div className="row">
          <div className="single-option col-12">
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
        </div>
        <div className="row">
          <div className="single-option col-12">
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
        </div>
        {showTable ? (
          <>
            <div className="row">
              <div className="single-option col-12">
                <InputConfigOption
                  label="Lower Limit for CS Score"
                  value={lowerLimit}
                  desc="Scores below this will be marked green"
                  setValue={setLowerLimit}
                  disabled={showLogs}
                />
              </div>
            </div>
            <div className="row">
              <div className="single-option col-12">
                <InputConfigOption
                  label="Upper Limit for CS Score"
                  value={upperLimit}
                  desc="Scores above this will be marked red"
                  setValue={setUpperLimit}
                  disabled={showLogs}
                />
              </div>
            </div>
          </>
        ) : (
          <></>
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
          mode: mode,
          lowerLimit: lowerLimit,
          setLowerLimit: setLowerLimit,
          upperLimit: upperLimit,
          setUpperLimit: setUpperLimit,
        })
      ) : showLogs ? (
        <Logs
          currentId={currentId}
          setShowTable={setShowTable}
          setShowLogs={setShowLogs}
          terminateAllProcesses={terminateAllProcesses}
          onTerminate={onTerminate}
          logs={logs}
          preventClick={preventClick}
          loading={loading}
          progressPercentage={progressPercentage}
          processStatus={processStatus}
          logContainerRef={logContainerRef}
          showTerminateProcess={showTerminateProcess}
          dataToDisplay={dataToDisplay}
          currentCycle={currentCycle}
          mode={mode}
          showLogs={showLogs}
          showTable={showTable}
        />
      ) : (
        <OtherConfigOptionsDuplication
          button_label={button_label}
          logLevelError={logLevelError}
          modalShow={modalShow}
          lowerLimit={lowerLimit}
          setLowerLimit={setLowerLimit}
          upperLimit={upperLimit}
          setUpperLimit={setUpperLimit}
          multipleRequestAlertTitle={multipleRequestAlertTitle}
          multipleRequestAlertDesc={multipleRequestAlertDesc}
          setModalShow={setModalShow}
          handleClick={handleClick}
          preventClick={preventClick}
          currentCycle={currentCycle}
          runName={runName}
          modalFile={modalFile}
          logLevel={logLevel}
          setLogLevel={setLogLevel}
          setRunName={setRunName}
          loading={loading}
        />
      )}
    </div>
  );
};

export default DuplicationForm;
