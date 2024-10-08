/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";
import ButtonTray from "../util/ButtonTray";
import InputConfigOption from "../util/InputConfigOption";

const DuplicationTable = ({
  dataToDisplay,
  onCategorizeAnotherCycle,
  currentCycle,
  currentTaskId,
  mode,
  viewLogs,
}) => {
  const [highlighted, setHighlighted] = useState();
  const [currentRow, setCurrentRow] = useState();
  const [upperLimit, setUpperLimit] = useState();
  const [lowerLimit, setLowerLimit] = useState();

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
    }
    return reformattedData;
  };

  const handleHighlight = (row_id) => {
    setHighlighted((prevId) => (prevId === row_id ? null : row_id));
    setCurrentRow(row_id);
  };

  const applySimilarityScoreBgColor = (score) => {
    const similarityScore = parseFloat(score);
    if (isNaN(similarityScore)) {
      return "";
    }

    if (upperLimit === 0 && lowerLimit === 0) {
      return "";
    }

    if (upperLimit && !lowerLimit) {
      if (similarityScore >= upperLimit) {
        return "score-high";
      } else {
        return "score-low";
      }
    }

    if (!upperLimit && lowerLimit) {
      if (similarityScore < lowerLimit) {
        return "score-low";
      } else {
        return "score-high";
      }
    }

    if (upperLimit && lowerLimit) {
      if (upperLimit <= lowerLimit) {
        console.error("Upper limit should be greater than lower limit.");
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
    }

    return "";
  };

  return (
    <>
      <div className="all-options">
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Lower Limit for CS Score"
              value={lowerLimit}
              desc="Scores below this will be marked green"
              setValue={setLowerLimit}
            />
          </div>
        </div>
        <div className="row">
          <div className="single-option col-12">
            <InputConfigOption
              label="Upper Limit for CS Score"
              value={upperLimit}
              desc="Scores above this will be marked red"
              setValue={setUpperLimit}
            />
          </div>
        </div>
      </div>
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
              ? ` Duplicates found for proposal ${highlighted}`
              : "--"}
          </h6>
          {highlighted ? (
            <div className="table-container">
              <table className="container-fluid secondary-table">
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
                    reformatData(dataToDisplay)[currentRow].map(
                      (row, index) => (
                        <tr key={index}>
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
        mode={mode}
        currentCycle={currentCycle}
        currentTaskId={currentTaskId}
      />
    </>
  );
};

export default DuplicationTable;
