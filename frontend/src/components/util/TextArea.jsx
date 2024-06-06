/* eslint-disable react/prop-types */
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const TextArea = ({ value, setValue }) => {
  const handleOnChange = (event) => {
    console.log(value);
    setValue(event.target.value);
  };
  return (
    <div>
      <InputGroup>
        <Form.Control
          as="textarea"
          value={value}
          aria-label="With textarea"
          onChange={handleOnChange}
        />
      </InputGroup>
    </div>
  );
};

export default TextArea;
