import "../css/otherConfigOptions.css";
import DropdownConfigOption from "./DropdownConfigOption";
import InputConfigOption from "./InputConfigOption";

const OtherConfigOptions = ({button_label}) => {
  const numbers = [123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012, 172345];
  return (
    <>
      <div className="separator">Other Options(optional)</div>
      <div className="all-options">
        <div className="single-option">
          <InputConfigOption label="Enter Run name" desc="Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)"/>
        </div>
        <div className="single-option">
          <DropdownConfigOption data={numbers} label="Select modal file to use" desc="Name of modal file to use"/>
        </div>
        <div className="single-option">
          <InputConfigOption label="Assignment number top reviewers" desc="Number of top recommended reviewers"/>
        </div>
        <div className="single-option">
          <InputConfigOption label="Close Collaborator Time Frame" desc="Number of years over which to check close collaborators"/>
        </div>
      </div>
      <div className="row mt-5">
        <button className="btn">{button_label}</button>
      </div>
    </>
  )
}

export default OtherConfigOptions