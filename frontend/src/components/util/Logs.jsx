/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";

const Logs = ({ currentId, setShowTable, onTerminate }) => {
  const [logs, setLogs] = useState([]);
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);

  const headers = [
    "Proposal Number",
    "Title",
    "PACMan Science Category",
    "PACMan Probability",
    "Original Science Category",
  ];
  const csvContent =
    headers.join(",") +
    "\n" +
    logs.map((row) => Object.values(row).join(",")).join("\n");

  const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
  const handleTable = async (event) => {
    event.preventDefault();
    setShowTable(true);
  };

  const handleTerminate = async () => {
    if (!currentId) {
      return;
    }
    await fetch(
      `http://127.0.0.1:5000/api/terminate/${currentId}?api_key=barebones`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("default:barebones"),
          "Content-Type": "application/json",
        },
      }
    );
    onTerminate();
  };

  useEffect(() => {
    console.log("here 3");
    if (!currentId) {
      return;
    }
    const eventSource = new EventSource(
      `http://127.0.0.1:5000/api/stream/${currentId}?api_key=barebones`
    );
    eventSource.onopen = () => {
      setShowTerminateProcess(true);
    };
    eventSource.onmessage = (event) => {
      const newLog = event.data;
      if (
        newLog.includes("PROCESS COMPLETE") ||
        newLog.includes("run complete")
      ) {
        eventSource.close();
        setShowTerminateProcess(false);
      }
      setLogs((prevLogs) => [...prevLogs, newLog]);
    };
    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      setShowTerminateProcess(false);
    };
    return () => {
      eventSource.close();
    };
  }, [currentId, setLogs, setShowTerminateProcess]);

  return (
    <>
      <div id="log-container" className="container-fluid mt-5">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
      {showTerminateProcess ? (
        <div className="button-tray container-fluid p-0">
          <button className="btn rounded-0" onClick={handleTerminate}>
            Terminate Process
          </button>
        </div>
      ) : (
        <div className="button-tray p-0 container-fluid">
          <button className="btn rounded-0" onClick={handleTable}>
            See Results
          </button>
          <a href={encodedUri} download="proposals.csv">
            <button className="btn rounded-0">Download As CSV</button>
          </a>
          <button className="btn rounded-0">View Logs</button>
        </div>
      )}
    </>
  );
};

export default Logs;
