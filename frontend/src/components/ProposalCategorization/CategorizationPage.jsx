/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useRef, useState } from "react";
import "../../css/searchBox.css";
import Logs from "../util/Logs.jsx";

const CategorizationPage = ({
  allCycles,
  modalFile,
  mode,
  renderTableComponent,
  button_label,
  renderFormComponent,
}) => {
  const defaultInputFields = {
    currentCycle: "",
    runName: "",
    selectedModal: "strolger_pacman_model_7cycles.joblib",
    logLevel: "info",
  };
  const [inputFields, setInputFields] = useState(defaultInputFields);
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [processStatus, setProcessStatus] = useState();
  const logContainerRef = useRef(null);
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
    setShowLogs(false);
    setShowTable(false);
    setProgressPercentage(0);
    setLogs([]);
    setShowTerminateProcess(true);
    setProcessStatus();
    setInputFields(defaultInputFields);
    setLoading(false);
  };

  const handleFilteringCycles = (newCurrentCycle) => {
    const newCycles = allCycles.filter((cycle) => {
      return cycle.cycleNumber !== newCurrentCycle;
    });
    setInputFields({ ...inputFields, currentCycle: newCurrentCycle });
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
      try {
        const tableResponse = await fetch(
          `/api/outputs/${tableCategory}/${curId}?cycle_number=${inputFields["currentCycle"]}`,
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
    [inputFields, mode, processStatus]
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
          currentCycle: inputFields["currentCycle"],
          setShowTable: setShowTable,
          showLogs: showLogs,
          showTable: showTable,
          setShowLogs: setShowLogs,
          onCategorizeAnotherCycle: onTerminate,
          dataToDisplay: dataToDisplay,
          mode: mode,
        })
      ) : showLogs ? (
        <Logs
          currentId={currentId}
          currentCycle={inputFields["currentCycle"]}
          setShowTable={setShowTable}
          terminateAllProcesses={terminateAllProcesses}
          onTerminate={onTerminate}
          logs={logs}
          mode={mode}
          setShowLogs={setShowLogs}
          showLogs={showLogs}
          showTable={showTable}
          preventClick={preventClick}
          loading={loading}
          progressPercentage={progressPercentage}
          processStatus={processStatus}
          logContainerRef={logContainerRef}
          showTerminateProcess={showTerminateProcess}
          dataToDisplay={dataToDisplay}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CategorizationPage;
