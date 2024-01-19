import "../css/otherConfigOptions.css";
import DropdownConfigOption from "./dropdownConfigOption";
import InputConfigOption from "./inputConfigOption";

const OtherConfigOptions = () => {
  const numbers = [123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012, 172345];
  return (
    <>
      <div className="separator">Other Options(optional)</div>
      <div className="all-options">
        <div className="single-option">
          <InputConfigOption />
          <div className='form-text text-start'>
            Name for specific run of the PACMan code (e.g.,'Telescope_Cycle4b' as an example)
          </div>  
        </div>
        <div className="single-option">
          <DropdownConfigOption data={numbers} />
          <div className='form-text text-start'>
            Name of modal file to use
          </div> 
        </div>
        <div className="single-option">
          <InputConfigOption />
          <div className='form-text text-start'>
            Number of top recommended reviewers
          </div> 
        </div>
        <div className="single-option">
          <InputConfigOption />
          <div className='form-text text-start'>
            Number of years over which to check close collaborators
          </div> 
        </div>
      </div>
      <div className="row mt-5">
        <button className="btn">Proposals- Categorize</button>
      </div>
    </>
  )
}

export default OtherConfigOptions