/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import QuestionMark from "../../assets/QuestionMark.png";

const ImgTooltip = ({ content }) => {
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
          <Tooltip className="tooltip-body" {...props}>
            <ul>
              {content.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default ImgTooltip;
