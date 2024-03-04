/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const ButtonTray = ({ onCategorizeAnotherCycle, viewLogs, currentId }) => {
  const downloadCSV = async () => {
    const url = `/proposal_cat_output_download/${currentId}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
        const blob = new Blob([data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `downloaded_Report_${new Date()
          .toLocaleDateString()
          .replace(/\//g, "-")}.csv`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
      <button className="btn rounded-0" onClick={viewLogs}>
        View Logs
      </button>
    </div>
  );
};

export default ButtonTray;
