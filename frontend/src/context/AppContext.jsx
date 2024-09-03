/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");

  return (
    <AppContext.Provider
      value={{
        showToast,
        setShowToast,
        toastVariant,
        setToastVariant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
