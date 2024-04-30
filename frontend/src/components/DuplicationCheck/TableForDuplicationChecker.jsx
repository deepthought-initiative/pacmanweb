/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import limitsData from "../../../limits.json";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";
import ButtonTray from "../util/ButtonTray";
import ImgTooltip from "../util/Tooltip";

const TableForDuplicationChecker = ({
  setShowTable,
  setShowLogs,
  dataToDisplay,
  onCategorizeAnotherCycle,
  downloadCSV,
  currentId,
  currentCycle,
  downloadZIP,
  mode,
}) => {
  const [highlighted, setHighlighted] = useState();
  const [currentRow, setCurrentRow] = useState();

  const toolTipCSScore = [
    "Red (high similarity): 0.6 or higher",
    "Yellow (moderate similarity): Between 0.2 and 0.59",
    "Green (low similarity): Below 0.2 ",
  ];

  const reformatData = (originalData) => {
    const reformattedData = {};

    for (const key in originalData) {
      const [firstNo, secondNo, cycle] = key.replace(/[()']/g, "").split(", ");
      const cycleNumber = parseInt(cycle, 10);

      if (!reformattedData[firstNo]) {
        reformattedData[firstNo] = [];
      }

      reformattedData[firstNo].push({
        duplicateProposalNumber: secondNo,
        Cycle2: cycleNumber,
        ...originalData[key],
      });

      reformattedData[secondNo].push({
        duplicateProposalNumber: firstNo,
        Cycle2: cycleNumber,
        ...originalData[key],
      });
    }

    return reformattedData;
  };

  const handleHighlight = (row_id) => {
    setHighlighted((prevId) => (prevId === row_id ? null : row_id));
    setCurrentRow(row_id);
  };

  const viewLogs = () => {
    setShowLogs(true);
    setShowTable(false);
  };

  const applySimilarityScoreBgColor = (score) => {
    const { upperLimit, lowerLimit } = limitsData;
    const similarityScore = parseFloat(score);
    if (isNaN(similarityScore)) {
      return "";
    }
    if (similarityScore >= upperLimit) {
      return "score-high";
    }
    if (similarityScore < upperLimit && similarityScore >= lowerLimit) {
      return "score-moderate";
    }
    if (similarityScore < lowerLimit) {
      return "score-low";
    }
  };

  return (
    <>
      <div
        id="outer-container"
        className="container-fluid border border-1 border-black mt-5"
      >
        <div className="col-md-6">
          <h6 className="my-3">{`Duplicate Proposals in cycle ${currentCycle}`}</h6>
          <div className="table-container">
            <table className="container-fluid">
              <thead>
                <tr>
                  <th className="col-md-2 col-sm-6">Proposal Number</th>
                  <th className="col-md-2 col-sm-6">Number of Duplicates</th>
                </tr>
              </thead>
              <tbody>
                {reformatData(dataToDisplay) &&
                  Object.entries(reformatData(dataToDisplay)).map(
                    ([key, value], index) => (
                      <tr
                        onClick={() => handleHighlight(key)}
                        className={highlighted === key ? "highlighted" : ""}
                        key={index}
                      >
                        <td className="col-6 text-break" scope="row">
                          {key}
                        </td>
                        <td className="col-6 text-break">{value.length}</td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          <h6 className="my-3">
            {highlighted
              ? ` Duplicates found for proposal ${highlighted} from ${currentCycle}`
              : "--"}
          </h6>
          {highlighted ? (
            <div className="table-container">
              <table className="container-fluid">
                <thead>
                  <tr>
                    <th className="col-md-4 col-sm-4">Cycle Number</th>
                    <th className="col-md-4 col-sm-4">Proposal Number</th>
                    <th className="col-md-4 col-sm-4">
                      CS Score <ImgTooltip content={toolTipCSScore} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reformatData(dataToDisplay) &&
                    reformatData(dataToDisplay)[currentRow] &&
                    reformatData(dataToDisplay)[currentRow].map((row) => (
                      <tr key={row["no"]}>
                        <td className="text-break">{row["Cycle2"]}</td>
                        <td className="text-break">
                          {row["duplicateProposalNumber"]}
                        </td>
                        <td
                          className={`text-break ${applySimilarityScoreBgColor(
                            row["Similarity"]
                          )}`}
                        >
                          {row["Similarity"]}
                        </td>
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
        downloadZIP={downloadZIP}
      />
    </>
  );
};

export default TableForDuplicationChecker;
