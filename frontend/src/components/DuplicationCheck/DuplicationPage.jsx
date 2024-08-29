/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useRef, useState } from "react";
import "../../css/searchBox.css";
import Logs from "../util/Logs.jsx";

const DuplicationPage = ({
  allCycles,
  modalFile,
  mode,
  renderTableComponent,
  renderFormComponent,
  button_label,
}) => {
  const defaultInputFields = {
    currentCycle: "",
    runName: "",
    pastCycle: [],
    selectedModal: "strolger_pacman_model_7cycles.joblib",
    logLevel: "info",
  };
  const [inputFields, setInputFields] = useState(defaultInputFields);

  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [filteredCycles, setFilteredCycles] = useState();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [upperLimit, setUpperLimit] = useState("");
  const [lowerLimit, setLowerLimit] = useState("");

  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [processStatus, setProcessStatus] = useState();
  const logContainerRef = useRef(null);

  //loading
  const [loading, setLoading] = useState(false);

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

  const onTerminate = () => {
    setCurrentId();
    setInputFields(defaultInputFields);
    setShowLogs(false);
    setShowTable(false);
    setProgressPercentage(0);
    setLogs([]);
    setShowTerminateProcess(true);
    setProcessStatus();
    setLoading(false);
    setUpperLimit("");
    setLowerLimit("");
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
          `/api/outputs/${tableCategory}/${curId}?cycle_number=${inputFields.currentCycle}`,
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
    [inputFields.currentCycle, mode, processStatus]
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

  const preventClick = (event) => {
    event.preventDefault();
    return false;
  };

  return (
    <>
      {renderFormComponent({
        allCycles: allCycles,
        modalFile: modalFile,
        mode: mode,
        handleFilteringCycles: handleFilteringCycles,
        preventClick: preventClick,
        loading: loading,
        filteredCycles: filteredCycles,
        setLoading: setLoading,
        button_label: button_label,
        inputFields: inputFields,
        setInputFields: setInputFields,
        defaultInputFields: defaultInputFields,
        showLogs: showLogs,
        showTable: showTable,
        setCurrentId: setCurrentId,
        setShowLogs: setShowLogs,
        startFetchingLogs: startFetchingLogs,
      })}
      {showTable ? (
        renderTableComponent({
          currentId: currentId,
          currentCycle: inputFields.currentCycle,
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
          currentCycle={inputFields.currentCycle}
          mode={mode}
          showLogs={showLogs}
          showTable={showTable}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default DuplicationPage;
