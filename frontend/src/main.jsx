import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import Footer from "./components/Footer.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { BrowserRouter} from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthContextProvider>
      <BrowserRouter>
      <App />
      {/* <Footer /> */}
      </BrowserRouter>
      </AuthContextProvider>
  </React.StrictMode>
);
