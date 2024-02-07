/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";

const TableMatchReviewers = ({ currentId, setShowTable, setShowLogs }) => {
  const [highlighted, setHighlighted] = useState();
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [currentRow, setCurrentRow] = useState();

  useEffect(() => {
    async function fetchTable() {
      if (!currentId) {
        return;
      }
      const tableResponse = await fetch(
        `http://127.0.0.1:5000/api/outputs/match_reviewers_output/${currentId}?cycle_number=221026`,
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

  const handleHighlight = (current_id) => {
    setHighlighted((prevId) => (prevId === current_id ? null : current_id));
    setCurrentRow(current_id);
  };

  const viewLogs = () => {
    setShowLogs(true);
    setShowTable(false);
  };

  const anotherCycle = () => {
    setShowTable(false);
    setShowLogs(false);
  };
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
      column3: 0.9,
      column4: "Text1-4",
    },
    {
      id: 2,
      column1: "Text2-1",
      column2: "Text2-2",
      column3: 0.2,
      column4: "Text2-4",
    },
    {
      id: 3,
      column1: "Text3-1",
      column2: "Text3-2",
      column3: 0.35,
      column4: "Text3-4",
    },
    {
      id: 4,
      column1: "Text4-1",
      column2: "Text4-2",
      column3: 0.7,
      column4: "Text4-4",
    },
    {
      id: 5,
      column1: "Text5-1",
      column2: "Text5-2",
      column3: 0.8,
      column4: "Text5-4",
    },
    {
      id: 6,
      column1: "Text6-1",
      column2: "Text6-2",
      column3: 0.3,
      column4: "Text6-4",
    },
    {
      id: 7,
      column1: "Text7-1",
      column2: "Text7-2",
      column3: 0.5,
      column4: "Text7-4",
    },
    {
      id: 8,
      column1: "Text8-1",
      column2: "Text8-2",
      column3: 0.9,
      column4: "Text8-4",
    },
    {
      id: 9,
      column1: "Text9-1",
      column2: "Text9-2",
      column3: 0.5,
      column4: "Text9-4",
    },
    {
      id: 10,
      column1: "Text10-1",
      column2: "Text10-2",
      column3: 0.1,
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
  return (
    <>
      <div
        id="outer-container"
        className="container-fluid border border-1 border-black mt-5 rounded-3"
      >
        <div className="col-6 px-3">
          <h6 className="mx-3 my-4">All Reviewers</h6>
          <div className="table-container">
            <table className="container-fluid p-0">
              <thead>
                <tr>
                  <th className="col">Reviewer</th>
                  <th className="col">Science Category</th>
                  <th className="col">Science Category Probability</th>
                  <th className="col">Number of Records Found</th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay &&
                  dataToDisplay["Main Table"] &&
                  Object.entries(dataToDisplay["Main Table"]).map(
                    ([key, value]) => (
                      <tr
                        onClick={() => handleHighlight(value["fname"])}
                        className={
                          highlighted === value["fname"] ? "highlighted" : ""
                        }
                        key={key}
                      >
                        <td className="text-break" scope="row">
                          {value["fname"]}
                        </td>
                        <td className="text-break">
                          {value["model_classification"]}
                        </td>
                        <td className="text-break">{expo(value["prob"])}</td>
                        <td className="text-break">{value["nrecords"]}</td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-3 px-3">
          <h6 className="mx-3 my-4">Assigned Proposals for {currentRow}</h6>
          {highlighted ? (
            <div className="scroll-table-container">
              <table className="container-fluid p-0">
                <thead>
                  <tr>
                    <th className="col-md-2 col-sm-1">Proposal Title</th>
                    <th className="col-md-2 col-sm-1">CS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay &&
                    dataToDisplay["Proposal Assignments"] &&
                    Object.entries(
                      dataToDisplay["Proposal Assignments"][currentRow]
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
        <div className="col-3 px-3">
          <h6 className="mx-3 my-4">Reviewer Conflicts for {currentRow}</h6>
          {highlighted ? (
            <div className="scroll-table-container">
              <table className="container-fluid p-0">
                <thead>
                  <tr>
                    <th className="col-md-2 col-sm-1">Cycle Number</th>
                    <th className="col-md-2 col-sm-1">CS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay &&
                    dataToDisplay["Conflicts"] &&
                    Object.entries(dataToDisplay["Conflicts"][currentRow]).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td className="col-6 text-break">{key}</td>
                          <td className="col-2 text-break">{value}</td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          ) : (
            <AlternateCategoriesTest />
          )}
        </div>
      </div>
      <div className="button-tray container-fluid p-0">
        <button className="btn rounded-0" onClick={anotherCycle}>
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

export default TableMatchReviewers;
