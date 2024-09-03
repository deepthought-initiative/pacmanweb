/* eslint-disable react/prop-types */
import { useState } from "react";
import AlternateCategoriesTest from "../util/AlternateCategoriesText";
import ButtonTray from "../util/ButtonTray";

const CategorizationTable = ({
  currentTaskId,
  currentCycle,
  viewLogs,
  onCategorizeAnotherCycle,
  dataToDisplay,
  mode,
}) => {
  const [highlighted, setHighlighted] = useState();
  const [currentRow, setCurrentRow] = useState();
  const expo = (num) => {
    if (num < 0.001) {
      return Number.parseFloat(num).toExponential(3);
    } else {
      return Number.parseFloat(num).toFixed(3);
    }
  };
  const handleHighlight = (current_id) => {
    setHighlighted((prevId) => (prevId === current_id ? null : current_id));
    setCurrentRow(current_id);
  };

  return (
    <>
      <div
        id="outer-container"
        className="container-fluid border border-1 border-black mt-5"
      >
        <div className="col-md-9">
          <h6 className="my-3">All Proposals</h6>
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
                      <td className="col-md-6 text-break">
                        {value["PACMan Science Category"]}
                      </td>
                      <td className="col-md-2 text-break">
                        {value["PACMan Probability"]}
                      </td>
                      <td className="col-md-4 text-break">
                        {value["Original Science Category"]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-3">
          <h6 className="my-3">Alternate Categories</h6>
          {highlighted ? (
            <div className="table-container">
              <table className="container-fluid secondary-table">
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

export default CategorizationTable;
