/* eslint-disable react/prop-types */
import ErrorMessage from "../util/ErrorMessage.jsx";
const DropdownConfigOption = ({
  data,
  label,
  desc,
  setValue,
  placeholderText,
  disabled,
  error,
}) => {
  const handleOnChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };
  return (
    <div>
      <div className="option-header">
        <label className="form-label" htmlFor="CurrentCycle">
          {label}
        </label>
        {error && <ErrorMessage message={error} />}
      </div>
      <div>
        <select
          id="CurrentCycle"
          className="form-select rounded-0 border-2"
          aria-label="Select Current Cycle"
          size="2"
          onChange={handleOnChange}
          disabled={disabled}
        >
          <option disabled value="DEFAULT">
            {placeholderText}
          </option>
          {data &&
            data.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
        </select>
      </div>
      <div className="form-text text-start mt-2">{desc}</div>
    </div>
  );
};

export default DropdownConfigOption;
