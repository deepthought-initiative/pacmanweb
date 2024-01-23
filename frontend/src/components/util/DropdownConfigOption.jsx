/* eslint-disable react/prop-types */
const DropdownConfigOption = ({ data, label, desc }) => {
  return (
    <div>
      <label className="form-label" htmlFor="CurrentCycle">{label}</label>
      <div>
        <select id="CurrentCycle" className="form-select rounded-0 border-2" aria-label="Select Current Cycle">
          {data.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>
      <div className='form-text text-start mt-2'>{desc}</div> 
    </div>
  );
};

export default DropdownConfigOption;
