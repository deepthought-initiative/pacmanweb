import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const TextArea = (value, setvalue) => {
  return (
    <div>
      <InputGroup>
        <Form.Control as="textarea" aria-label="With textarea" />
      </InputGroup>
    </div>
  );
};

export default TextArea;
