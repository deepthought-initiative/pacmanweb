/* eslint-disable react/prop-types */

const Logs = ({
  setShowTable,
  onTerminate,
  terminateAllProcesses,
  logs,
  processStatus,
  logContainerRef,
  showTerminateProcess,
  downloadCSV,
}) => {
  const handleTable = (event) => {
    event.preventDefault();
    setShowTable(true);
  };
  console.log("logs,", processStatus);
  return (
    <>
      <div
        ref={logContainerRef}
        id="log-container"
        className="container-fluid mt-5"
      >
        {logs.map((log, index) => (
          <div
            key={index}
            className={
              !showTerminateProcess && index === logs.length - 1
                ? processStatus
                  ? "success"
                  : "failed"
                : ""
            }
          >
            {log}
          </div>
        ))}
      </div>
      {showTerminateProcess ? (
        <div className="button-tray container-fluid p-0">
          <button className="btn rounded-0" onClick={terminateAllProcesses}>
            Terminate Process
          </button>
        </div>
      ) : !processStatus ? (
        <div className="button-tray container-fluid p-0">
          <button className="btn rounded-0" onClick={onTerminate}>
            Categorize Another Cycle
          </button>
        </div>
      ) : (
        <div className="button-tray p-0 container-fluid">
          <button className="btn rounded-0" onClick={handleTable}>
            See Results
          </button>
          <button onClick={downloadCSV} className="btn rounded-0">
            Download As CSV
          </button>
          <button className="btn rounded-0">View Logs</button>
        </div>
      )}
    </>
  );
};

export default Logs;
