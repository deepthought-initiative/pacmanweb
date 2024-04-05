/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const ButtonTray = ({
  onCategorizeAnotherCycle,
  downloadZIP,
  viewLogs,
  downloadCSV,
}) => {
  return (
    <div className="button-tray container-fluid p-0">
      <button className="btn rounded-0" onClick={onCategorizeAnotherCycle}>
        Categorize Another Cycle
      </button>
      <a>
        <button onClick={downloadCSV} className="btn rounded-0">
          Download As CSV
        </button>
      </a>
      <a>
        <button onClick={downloadZIP} className="btn rounded-0">
          Download Zip
        </button>
      </a>
      <button className="btn rounded-0" onClick={viewLogs}>
        View Logs
      </button>
    </div>
  );
};

export default ButtonTray;
