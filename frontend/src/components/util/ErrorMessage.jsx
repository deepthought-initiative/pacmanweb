import PropTypes from "prop-types";
import redExclamation from "../../assets/red_exclamation.png";
const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container config-error-message">
      <img src={redExclamation} />
      <div>{message}</div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
