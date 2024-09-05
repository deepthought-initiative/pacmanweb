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
          body: "✅ Process Successful",
        };
      case "danger":
        return {
         body: "⚠️ Process Failed",
        };
    }
  };

  const { body } = getToastContent();

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
    }
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [showToast, setShowToast]);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
      <Toast
        bg={variant}
        show={showToast}
        onClose={() => setIsVisible(false)}
        className={`custom-toast ${isVisible ? "show" : "hide"}`}
      >
        <Toast.Body className={variant === "danger" ? "text-white" : undefined}>
          {body}
          <div className="timer-bar-container">
            <div className="timer-bar" style={{ width: `${progress}%` }} />
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast;
