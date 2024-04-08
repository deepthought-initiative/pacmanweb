/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

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
      <DropdownButton id="dropdown-basic-button" title="Download Data">
        <Dropdown.Item className="download-option" onClick={downloadCSV}>
          Download as CSV
        </Dropdown.Item>
        <Dropdown.Item className="download-option" onClick={downloadZIP}>
          Download as Zip
        </Dropdown.Item>
      </DropdownButton>
      <button className="btn rounded-0" onClick={viewLogs}>
        View Logs
      </button>
    </div>
  );
};

export default ButtonTray;
