/* eslint-disable react/prop-types */

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const Logs = ({
  setShowTable,
  onTerminate,
  terminateAllProcesses,
  logs,
  processStatus,
  logContainerRef,
  showTerminateProcess,
  downloadCSV,
  downloadZIP,
}) => {
  const handleTable = (event) => {
    event.preventDefault();
    setShowTable(true);
  };
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
          <DropdownButton id="dropdown-basic-button" title="Download Data">
            <Dropdown.Item className="download-option" onClick={downloadCSV}>
              Download as CSV
            </Dropdown.Item>
            <Dropdown.Item className="download-option" onClick={downloadZIP}>
              Download as Zip
            </Dropdown.Item>
          </DropdownButton>
          <button className="btn rounded-0">View Logs</button>
        </div>
      )}
    </>
  );
};

export default Logs;
