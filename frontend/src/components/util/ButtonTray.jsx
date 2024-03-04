/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const ButtonTray = ({ onCategorizeAnotherCycle, viewLogs, currentId }) => {
  const downloadContent = async () => {
    const response = await fetch(
      `/api/proposal_cat_output_download/${currentId}`
    );
    console.log(response);
  };
  return (
    <div className="button-tray container-fluid p-0">
      <button className="btn rounded-0" onClick={onCategorizeAnotherCycle}>
        Categorize Another Cycle
      </button>
      <a>
        <button onClick={downloadContent} className="btn rounded-0">
          Download As CSV
        </button>
      </a>
      <button className="btn rounded-0" onClick={viewLogs}>
        View Logs
      </button>
    </div>
  );
};

export default ButtonTray;
