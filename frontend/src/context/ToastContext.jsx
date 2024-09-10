/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import CustomToast from "../components/util/CustomToast";

const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToastMessage = (variant, message) => {
    setToastVariant(variant);
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <ToastContext.Provider value={{ showToastMessage }}>
      {children}
      <CustomToast
        variant={toastVariant}
        message={toastMessage}
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </ToastContext.Provider>
  );
};

export default ToastContext;