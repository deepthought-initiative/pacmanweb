/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import CustomToast from "../components/util/CustomToast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToastMessage = (variant, message) => {
    const newToast = { id: Date.now(), variant, message }; // Unique ID for each toast
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

return (
    <ToastContext.Provider value={{ showToastMessage }}>
      {children}
      <ToastContainer className="p-3 position-static">
        {toasts.map((toast) => (
          <CustomToast
            key={toast.id}
            variant={toast.variant}
            message={toast.message}
            showToast={true}
            setShowToast={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastContext;

