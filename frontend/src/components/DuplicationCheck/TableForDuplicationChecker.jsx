/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";

const TableForDuplicationChecker = ({
  currentId,
  setShowTable,
  setShowLogs,
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
        }/api/outputs/duplicates_output/${currentId}?cycle_number=221026`,
        {
          method: "GET",
          headers: { Authorization: "Basic " + btoa("default:barebones") },
        }
      );
      const tableData = await tableResponse.json();
      setDataToDisplay(reformatData(tableData));
    }
    fetchTable();
  }, [currentId, setShowTable]);

  const reformatData = (originalData) => {
    const reformattedData = {};

    for (const key in originalData) {
      const [firstNo, secondNo] = key
        .replace(/[()]/g, "")
        .split(", ")
        .map(Number);

      if (!reformattedData[firstNo]) {
        reformattedData[firstNo] = [];
      }

      if (!reformattedData[secondNo]) {
        reformattedData[secondNo] = [];
      }

      reformattedData[firstNo].push({
        duplicateProposalNumber: secondNo.toString(),
        ...originalData[key],
      });

      reformattedData[secondNo].push({
        duplicateProposalNumber: firstNo.toString(),
        ...originalData[key],
      });
    }

    return reformattedData;
  };

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
          <h6 className="mx-3 my-4 fw-bolder">Duplicate Proposals in cycle</h6>
          <div className="table-container">
            <table className="container-fluid p-0">
              <thead>
                <tr>
                  <th className="col-md-2 col-sm-6">Proposal Number</th>
                  <th className="col-md-2 col-sm-6">Number of Duplicates</th>
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
                      <td>{key}</td>
                      <td>{value.length}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-6 px-3">
          <h6 className="mx-3 my-4 fw-bolder">Duplicates found for proposal</h6>
          {highlighted ? (
            <div className="table-container">
              <table className="container-fluid p-0">
                <thead>
                  <tr>
                    <th className="col-md-4 col-sm-4">Cycle Number</th>
                    <th className="col-md-4 col-sm-4">Proposal Number</th>
                    <th className="col-md-4 col-sm-4">CS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay &&
                    dataToDisplay[currentRow] &&
                    dataToDisplay[currentRow].map((row) => (
                      <tr key={row["no"]}>
                        <td className="text-break">{row["Cycle 2"]}</td>
                        <td className="text-break">
                          {row["duplicateProposalNumber"]}
                        </td>
                        <td className="text-break">{row["Similarity"]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <AlternateCategoriesTest />
            </div>
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

export default TableForDuplicationChecker;
