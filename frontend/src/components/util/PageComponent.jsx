/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "../../css/searchBox.css";
import Logs from "./Logs.jsx";
import CustomToast from "./CustomToast.jsx";
import AppContext from "../../context/AppContext.jsx";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

const PageComponent = ({
  allCycles,
  modalFile,
  mode,
  renderTableComponent,
  button_label,
  renderFormComponent,
  logLevelOptions,
  inputFields,
  setInputFields,
  defaultInputFields,
}) => {
  const [currentTaskId, setCurrentTaskId] = useState();
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [processStatus, setProcessStatus] = useState();
  const logContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { showToast, setShowToast, toastVariant, setToastVariant } =
    useContext(AppContext);

  const onTerminate = useCallback(() => {
    setCurrentTaskId();
    setShowLogs(false);
    setShowTable(false);
    setProgressPercentage(0);
    setLogs([]);
    setShowTerminateProcess(true);
    setProcessStatus();
    setInputFields(defaultInputFields);
    setLoading(false);
  }, [defaultInputFields, setInputFields]);

  const terminateAllProcesses = useCallback(async () => {
    if (!currentTaskId) {
      return;
    }
    await fetch(`/api/terminate/${currentTaskId}?mode=${mode}`, {
      method: "POST",
    });
    onTerminate();
  }, [currentTaskId, mode, onTerminate]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      await terminateAllProcesses();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [allCycles, terminateAllProcesses]);

  const fetchTable = useCallback(
    async (curId) => {
      if (!curId) {
        return;
      }
      let tableCategory = "";
      if (mode === "PROP") {
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
          setToastVariant("success");
          setShowToast(true);
        } else if (code === 204) {
          setProgressPercentage(100);
          setLogs((prevLogs) => [...prevLogs, "DUPLICATION FILE IS EMPTY."]);
          setToastVariant("success");
          setShowToast(true);
        } else {
          setProgressPercentage(100);
          setLogs((prevLogs) => [...prevLogs, "PROCESS FAILED"]);
          setToastVariant("danger");
          setShowToast(true);
        }
        logContainerRef.current.scrollTop =
          logContainerRef.current.scrollHeight;
      } catch (error) {
        setProgressPercentage(100);
        console.error("Error fetching table data:", error);
      }
    },
    [inputFields, mode, setShowToast, setToastVariant]
  );

  const startFetchingLogs = useCallback(
    async (curId) => {
      let reconnectFrequencySeconds = 1;
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
    },
    [fetchTable]
  );

  const preventClick = (event) => {
    event.preventDefault();
    return false;
  };

  const viewLogs = () => {
    setShowLogs(true);
    setShowTable(false);
  };

  const updateInputFields = useCallback(
    (key, value) => {
      setInputFields((prev) => ({ ...prev, [key]: value }));
    },
    [setInputFields]
  );

  function useConfirmExit(confirmExit, when = true) {
    const { navigator } = useContext(NavigationContext);

    useEffect(() => {
      if (!when) {
        return;
      }

      const push = navigator.push;

      navigator.push = (...args) => {
        const result = confirmExit();
        if (result !== false) {
          push(...args);
        }
      };

      return () => {
        navigator.push = push;
      };
    }, [navigator, confirmExit, when]);
  }

  function usePrompt(message, when = true) {
    useEffect(() => {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = message;
        return "";
      };
      if (when) {
        window.addEventListener("beforeunload", handleBeforeUnload);
      }
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [message, when]);

    const confirmExit = useCallback(() => {
      const confirm = window.confirm(message);
      if (confirm) {
        terminateAllProcesses();
      }
      return confirm;
    }, [message]);
    useConfirmExit(confirmExit, when);
  }
  return (
    <>
      {showToast && (
        <CustomToast
          showToast={showToast}
          setShowToast={setShowToast}
          variant={toastVariant}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "transparent",
          }}
        />
      )}
      {renderFormComponent({
        allCycles: allCycles,
        modalFile: modalFile,
        mode: mode,
        preventClick: preventClick,
        loading: loading,
        setLoading: setLoading,
        button_label: button_label,
        inputFields: inputFields,
        setInputFields: setInputFields,
        updateInputFields: updateInputFields,
        showLogs: showLogs,
        showTable: showTable,
        setCurrentTaskId: setCurrentTaskId,
        setShowLogs: setShowLogs,
        startFetchingLogs: startFetchingLogs,
        logLevelOptions: logLevelOptions,
      })}
      {showTable ? (
        renderTableComponent({
          currentTaskId: currentTaskId,
          currentCycle: inputFields["currentCycle"],
          onCategorizeAnotherCycle: onTerminate,
          dataToDisplay: dataToDisplay,
          mode: mode,
          viewLogs: viewLogs,
        })
      ) : showLogs ? (
        <Logs
          currentTaskId={currentTaskId}
          usePrompt={usePrompt}
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

export default PageComponent;
