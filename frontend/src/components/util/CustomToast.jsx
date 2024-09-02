/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const CustomToast = ({ variant, showToast, setShowToast }) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  const getToastContent = () => {
    switch (variant) {
      case "success":
        return {
          header: "Process Completed",
          body: "The Process was completed successfully.",
          icon: "✅",
        };
      case "danger":
        return {
          header: "Process Failed",
          body: "An error occurred. Please try again.",
          icon: "❌",
        };
      default:
        return {
          header: "Notification",
          body: "",
          icon: "ℹ️",
        };
    }
  };

  const { header, body, icon } = getToastContent();

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
          return prevProgress - (100 / 30);
        });
      }, 100);
    }
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [showToast, setShowToast]);

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