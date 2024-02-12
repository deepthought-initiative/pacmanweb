/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";
import ButtonTray from "../util/ButtonTray";

const TableMatchReviewers = ({
  currentId,
  setShowTable,
  setShowLogs,
  onCategorizeAnotherCycle,
  currentCycle,
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
        }/api/outputs/match_reviewers_output/${currentId}?cycle_number=${currentCycle}`,
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

  const expo = (num) => {
    if (num < 0.001) {
      return Number.parseFloat(num).toExponential(3);
    } else {
      return Number.parseFloat(num).toFixed(3);
    }
  };

  return (
    <>
      <div
        id="outer-container"
        className="container-fluid border border-1 border-black mt-5"
      >
        <div className="col-6">
          <h6 className="my-3">All Reviewers</h6>
          <div className="table-container">
            <table className="container-fluid">
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
        <div className="col-3">
          <h6 className="my-3">Assigned Proposals for {currentRow}</h6>
          {highlighted ? (
            <div className="table-container">
              <table className="container-fluid">
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
        <div className="col-3">
          <h6 className="my-3">Reviewer Conflicts for {currentRow}</h6>
          {highlighted ? (
            <div className="scroll-table-container">
              <table className="container-fluid">
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
      <ButtonTray
        onCategorizeAnotherCycle={onCategorizeAnotherCycle}
        viewLogs={viewLogs}
        downloadContent={dataToDisplay}
      />
    </>
  );
};

export default TableMatchReviewers;
