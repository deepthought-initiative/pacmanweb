/* eslint-disable react/prop-types */

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";

const Logs = ({
  setShowTable,
  onTerminate,
  terminateAllProcesses,
  logs,
  progressPercentage,
  processStatus,
  logContainerRef,
  showTerminateProcess,
  downloadCSV,
  downloadZIP,
  loading,
  preventClick,
  setShowLogs,
}) => {
  const handleTable = (event) => {
    event.preventDefault();
    setShowTable(true);
    setShowLogs(false);
  };

  const variant =
    progressPercentage < 100
      ? ""
      : processStatus === 200 || processStatus === 204
      ? "success"
      : "danger";

  const progressBarLabel =
    progressPercentage < 100
      ? ""
      : processStatus === 200 || processStatus === 204
      ? "Process Successful!"
      : "Process Failed!";

  return (
    <>
      <ProgressBar
        variant={variant}
        animated={progressPercentage < 100}
        now={progressPercentage}
        label={progressBarLabel}
      />
      <div
        ref={logContainerRef}
        id="log-container"
        className="container-fluid mt-4"
      >
        {logs.map((log, index) => (
          <div
            key={index}
            className={
              !showTerminateProcess && index === logs.length - 1
                ? processStatus === 200 || processStatus === 204
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
          <button
            className="btn form-page-button rounded-0"
            onClick={loading ? preventClick : terminateAllProcesses}
          >
            {loading ? (
              <>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            ) : (
              "Terminate Process"
            )}
          </button>
        </div>
      ) : processStatus !== 200 ? (
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
