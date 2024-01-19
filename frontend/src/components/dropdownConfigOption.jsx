import "../css/dropdownConfigOption.css";

const DropdownConfigOption = ({ data }) => {
  return (
    <div>        
        <label className="form-label" htmlFor="CurrentCycle">Selected Current Cycle</label>
        <div className="select-wrapper">
            <select id="CurrentCycle" className="form-select" aria-label="Select Current Cycle">
              {data.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
        </div>
    </div>
  )
}


export default DropdownConfigOption