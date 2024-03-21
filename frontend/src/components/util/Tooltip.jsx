import { useRef, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import QuestionMark from "../../assets/QuestionMark.png";

const ImgTooltip = () => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <>
      <img
        ref={target}
        src={QuestionMark}
        className="tooltip-icon"
        onClick={() => setShow(!show)}
      />
      <Overlay target={target.current} show={show} placement="right">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            My Tooltip
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default ImgTooltip;
