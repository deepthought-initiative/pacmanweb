/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";

const ProposalTable = ({
  currentId,
  setShowTable,
  setShowLogs,
  onCategorizeAnotherCycle,
}) => {
  const [highlighted, setHighlighted] = useState();
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [currentRow, setCurrentRow] = useState();

  useEffect(() => {
    async function fetchTable() {
      if (!currentId) {
        return;
      }
      const tableResponse = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/outputs/proposal_cat_output/${currentId}?cycle_number=221026`,
        {
          method: "GET",
          headers: { Authorization: "Basic " + btoa("default:barebones") },
        }
      );
      const tableData = await tableResponse.json();
      setDataToDisplay(tableData);
    }
    fetchTable();
  }, [currentId, setShowTable]);

  const expo = (num) => {
    if (num < 0.001) {
      return Number.parseFloat(num).toExponential(3);
    } else {
      return Number.parseFloat(num).toFixed(3);
    }
  };
  const data = [
    {
      id: 1,
      column1: "Text1-1",
      column2: "Text1-2",
      column3: "Text1-3",
      column4: "Text1-4",
    },
    {
      id: 2,
      column1: "Text2-1",
      column2: "Text2-2",
      column3: "Text2-3",
      column4: "Text2-4",
    },
    {
      id: 3,
      column1: "Text3-1",
      column2: "Text3-2",
      column3: "Text3-3",
      column4: "Text3-4",
    },
    {
      id: 4,
      column1: "Text4-1",
      column2: "Text4-2",
      column3: "Text4-3",
      column4: "Text4-4",
    },
    {
      id: 5,
      column1: "Text5-1",
      column2: "Text5-2",
      column3: "Text5-3",
      column4: "Text5-4",
    },
    {
      id: 6,
      column1: "Text6-1",
      column2: "Text6-2",
      column3: "Text6-3",
      column4: "Text6-4",
    },
    {
      id: 7,
      column1: "Text7-1",
      column2: "Text7-2",
      column3: "Text7-3",
      column4: "Text7-4",
    },
    {
      id: 8,
      column1: "Text8-1",
      column2: "Text8-2",
      column3: "Text8-3",
      column4: "Text8-4",
    },
    {
      id: 9,
      column1: "Text9-1",
      column2: "Text9-2",
      column3: "Text9-3",
      column4: "Text9-4",
    },
    {
      id: 10,
      column1: "Text10-1",
      column2: "Text10-2",
      column3: "Text10-3",
      column4: "Text10-4",
    },
  ];
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

  const handleHighlight = (current_id) => {
    setHighlighted((prevId) => (prevId === current_id ? null : current_id));
    setCurrentRow(current_id);
  };

  const viewLogs = (event) => {
    event.preventDefault();

    setShowLogs(true);
    setShowTable(false);
  };

  return (
    <>
      <div
        id="outer-container"
        className="container-fluid border border-1 border-black mt-5"
      >
        <div className="col-md-9">
          <h6 className="mx-3 my-4 fw-bolder">All Proposals</h6>
          <div className="table-container">
            <table className="container-fluid">
              <thead>
                <tr>
                  <th scope="col">Proposal Number</th>
                  <th scope="col">PACMan Science Category</th>
                  <th scope="col">PACMan Probability</th>
                  <th scope="col">Original Science Category</th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay &&
                  Object.entries(dataToDisplay).map(([key, value]) => (
                    <tr
                      onClick={() => handleHighlight(key)}
                      className={highlighted === key ? "highlighted" : ""}
                      key={key}
                    >
                      <td className="col-2 text-break" scope="row">
                        {key}
                      </td>
                      <td className="col-6 text-break">
                        {value["PACMan Science Category"]}
                      </td>
                      <td className="col-2 text-break">
                        {value["PACMan Probability"]}
                      </td>
                      <td className="col-4 text-break">
                        {value["Original Science Category"]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-3">
          <h6 className="mx-3 my-4">Alternate Categories</h6>
          {highlighted ? (
            <div className="table-container rounded-4">
              <table className="container-fluid">
                <thead>
                  <tr>
                    <th scope="col">PACMan Science Category</th>
                    <th scope="col">PACMan Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay &&
                    dataToDisplay[currentRow]["Alternate Categories"] &&
                    Object.entries(
                      dataToDisplay[currentRow]["Alternate Categories"]
                    ).map(([key, value]) => (
                      <tr key={key}>
                        <td className="col-6 text-break">{key}</td>
                        <td className="col-2 text-break">{expo(value)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AlternateCategoriesTest />
          )}
        </div>
      </div>
      <div className="button-tray container-fluid p-0">
        <button className="btn rounded-0" onClick={onCategorizeAnotherCycle}>
          Categorize Another Cycle
        </button>
        <a href={encodedUri} download="proposals.csv">
          <button className="btn rounded-0">Download As CSV</button>
        </a>
        <button className="btn rounded-0" onClick={viewLogs}>
          View Logs
        </button>
      </div>
    </>
  );
};

export default ProposalTable;
