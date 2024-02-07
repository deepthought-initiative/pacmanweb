/* eslint-disable react/prop-types */
const InputConfigOption = ({ label, desc, setValue, value }) => {
  const handleOnChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };
  return (
    <>
      <label className="form-label" htmlFor="CurrentCycle">
        {label}
      </label>
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
