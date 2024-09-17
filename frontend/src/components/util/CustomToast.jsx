/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";

const CustomToast = ({ variant, message, showToast, setShowToast }) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;
    let progressTimer;

    if (showToast) {
      setIsVisible(true);
      setProgress(100);

      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowToast(false), 700);
      }, 3000);

      progressTimer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(progressTimer);
            return 0;
          }
          return prevProgress - 100 / 30;
        });
      }, 100);
    } else {
      setProgress(100);
      setIsVisible(false);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [showToast, setShowToast]);

  return (
    <Toast
      bg={variant}
      show={isVisible}
      onClose={() => setIsVisible(false)}
      className={`custom-toast ${isVisible ? "show" : "hide"}`}
    >
      <Toast.Header>
        <strong className="me-auto">
          {variant === "success" ? "Success" : "danger"}
        </strong>
      </Toast.Header>
      <Toast.Body className={variant === "danger" ? "text-white" : undefined}>
        {variant === "success" ? "✅ " : "⚠️ "}
        {message}
      </Toast.Body>
      <div
        className="toast-progress"
        style={{
          width: `${progress}%`,
          backgroundColor: variant === "success" ? "green" : "red",
        }}
      />
    </Toast>
  );
};

export default CustomToast;
