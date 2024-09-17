import PropTypes from "prop-types";

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container config-error-message">
      <div>{message}</div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
