/* eslint-disable react/prop-types */

const Logs = ({ data, currentId, setShowTable, terminateProcessBtn }) => {
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
    data.map((row) => Object.values(row).join(",")).join("\n");

  const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
  const handleTable = async (event) => {
    event.preventDefault();
    setShowTable(true);
  };

  const handleTerminate = async () => {
    const terminateResponse = await fetch(
      `http://127.0.0.1:5000/terminate/${currentId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("default:barebones"),
          "Content-Type": "application/json",
        },
      }
    );
    console.log(terminateResponse);
  };

  return (
    <>
      <div id="log-container" className="container-fluid mt-5">
        {data.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
      {terminateProcessBtn ? (
        <div className="button-tray container-fluid p-0">
          <button className="btn rounded-0" onClick={handleTerminate}>
            {" "}
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
