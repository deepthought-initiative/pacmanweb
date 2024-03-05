/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";
import ButtonTray from "../util/ButtonTray";

const TableForDuplicationChecker = ({
  setShowTable,
  setShowLogs,
  dataToDisplay,
  onCategorizeAnotherCycle,
  downloadCSV,
}) => {
  const [highlighted, setHighlighted] = useState();
  const [currentRow, setCurrentRow] = useState();

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

  return (
    <>
      <div
        id="outer-container"
        className="container-fluid border border-1 border-black mt-5"
      >
        <div className="col-md-6">
          <h6 className="my-3">Duplicate Proposals in cycle</h6>
          <div className="table-container">
            <table className="container-fluid">
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
                      <td className="col-6 text-break" scope="row">
                        {key}
                      </td>
                      <td className="col-6 text-break">{value.length}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          <h6 className="my-3">Duplicates found for proposal</h6>
          {highlighted ? (
            <div className="table-container">
              <table className="container-fluid">
                <thead>
                  <tr>
                    <th className="col-md-4 col-sm-4">Cycle Number</th>
                    <th className="col-md-4 col-sm-4">Proposal Number</th>
                    <th className="col-md-4 col-sm-4">CS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {reformatData(dataToDisplay) &&
                    reformatData(dataToDisplay)[currentRow] &&
                    reformatData(dataToDisplay)[currentRow].map((row) => (
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
            <AlternateCategoriesTest />
          )}
        </div>
      </div>
      <ButtonTray
        onCategorizeAnotherCycle={onCategorizeAnotherCycle}
        viewLogs={viewLogs}
        downloadCSV={downloadCSV}
      />
    </>
  );
};

export default TableForDuplicationChecker;
