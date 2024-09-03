/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
import { useEffect, useContext, useState, useCallback } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/AdminDashboard/Dashboard";
import DuplicationPage from "./components/DuplicationCheck/DuplicationPage";
import CategorizationPage from "./components/ProposalCategorization/CategorizationPage";
import MatchReviewersForm from "./components/MatchReviewers/MatchReviewersForm";
import MatchReviewersTable from "./components/MatchReviewers/MatchReviewersTable";
import UploadZipForm from "./components/Upload/UploadZip";
import Login from "./components/util/LoginPage";
import Logout from "./components/util/Logout";
import MainNavbar from "./components/util/Navbar";
import PrivateRoute from "./components/util/PrivateRoute";
import AuthContext from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import PageNotFound from "./components/util/PageNotFound";
import MatchReviewersPage from "./components/MatchReviewers/MatchReviewersPage";

function App() {
  const [allCycles, setAllCycles] = useState([]);
  const [modalFile, setModalFile] = useState([]);
  const [usernameContext, setusernameContext] = useState(
    localStorage.getItem("username")
  );

  const navigate = useNavigate();
  const location = useLocation();

  const { loggedInUser, isLoggedIn, setLoggedInUser, handleAuthLogout } =
    useContext(AuthContext);

  const logLevelOptions = [
    { label: "info" },
    { label: "debug" },
    { label: "warning" },
    { label: "critical" },
  ];

  useEffect(() => {
    if (isLoggedIn) {
      const fetchCurrentUser = async () => {
        try {
          const response = await fetch("/api/get_current_user");
          if (!response.ok) {
            handleAuthLogout();
            navigate("/login");
          }
          const currentUser = await response.json();
          setLoggedInUser(currentUser);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      };
      async function fetchCycles() {
        const fullResponse = await fetch(`/api/get_cycles`);
        const fullResponseJson = await fullResponse.json();
        const valid_cycles = fullResponseJson["proposal_cycles_valid"];
        const invalid_cycles = fullResponseJson["proposal_cycles_invalid"];
        const allAvailableCycles = valid_cycles
          .concat(invalid_cycles)
          .map((cycleNumber) => ({
            cycleNumber: cycleNumber,
            label: cycleNumber.toString(), // Convert id to string for display
            style: {
              backgroundColor: valid_cycles.includes(cycleNumber)
                ? ""
                : "#FFBABA",
            },
          }));
        setAllCycles(allAvailableCycles);
        const modalFilesList = fullResponseJson["models"].map((item) => ({
          label: item,
        }));
        setModalFile(modalFilesList);
      }
      fetchCurrentUser();
      fetchCycles();
    }
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn && <MainNavbar />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={location.state?.from || "/categorize"} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/categorize"
          element={
            <PrivateRoute>
              <CategorizationPage
                key="PROP"
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
                logLevelOptions={logLevelOptions}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/duplication"
          element={
            <PrivateRoute>
              <DuplicationPage
                key="DUP"
                allCycles={allCycles}
                logLevelOptions={logLevelOptions}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/review"
          element={
            <PrivateRoute>
              <MatchReviewersPage
                key="MATCH"
                mode="MATCH"
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
                logLevelOptions={logLevelOptions}
                renderFormComponent={(props) => (
                  <MatchReviewersForm {...props} />
                )}
                renderTableComponent={(props) => (
                  <MatchReviewersTable {...props} />
                )}
                button_label="Match Reviewers"
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadZipForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard usernameContext={usernameContext} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login />
            ) : (
              <Navigate to={location.state?.from || "/categorize"} replace />
            )
          }
        />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;
