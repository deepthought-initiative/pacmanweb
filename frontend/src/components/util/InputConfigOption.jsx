/* eslint-disable react/prop-types */
import ErrorMessage from "../util/ErrorMessage.jsx";

const InputConfigOption = ({ label, desc, setValue, value, error }) => {
  const handleOnChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };
  return (
    <>
      <div className="option-header">
        <label className="form-label" htmlFor="CurrentCycle">
          {label}
        </label>
        {error && <ErrorMessage message={error} />}
      </div>
      <div className="input-group">
        <input
          value={value}
          onChange={handleOnChange}
          type="text"
          className="form-control rounded-0 border-2"
        />
      </div>
      <div className="form-text text-start">{desc}</div>
    </>
  );
};

export default InputConfigOption;
