/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/AdminDashboard/Dashboard";
import DuplicationForm from "./components/DuplicationCheck/DuplicationForm";
import TableForDuplicationChecker from "./components/DuplicationCheck/TableForDuplicationChecker";
import CategorizationForm from "./components/ProposalCategorization/CategorizationForm";
import ProposalTable from "./components/ProposalCategorization/ProposalTable";
import MatchReviewersForm from "./components/Reviewers/MatchReviewersForm";
import TableMatchReviewers from "./components/Reviewers/TableMatchReviewers";
import UploadZipForm from "./components/Upload/UploadZip";
import Login from "./components/util/LoginPage";
import Logout from "./components/util/Logout";
import MainNavbar from "./components/util/Navbar";
import PrivateRoute from "./components/util/PrivateRoute";

function App() {
  const [allCycles, setAllCycles] = useState([]);
  const [modalFile, setModalFile] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [isUserAdminContext, setIsUserAdminContext] = useState(false);
  const [usernameContext, setusernameContext] = useState(
    localStorage.getItem("username")
  );

  const checkAdminStatus = async () => {
    const ifExists = await fetch(`/api/admin/ifexists/${usernameContext}`, {
      method: "GET",
      credentials: "include",
      headers: { Authorization: "Basic " + btoa("default:barebones") },
    });
    if (ifExists.ok) {
      const existsResponse = await ifExists.json();
      if (existsResponse.value === "User is admin and exists") {
        setIsUserAdminContext(true);
      }
    }
  };

  useEffect(() => {
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
      setModalFile(fullResponseJson["models"]);
      checkAdminStatus();
    }
    fetchCycles();
  }, []);
  return (
    <>
      <BrowserRouter>
        <MainNavbar isUserAdminContext={isUserAdminContext} />
        <Routes>
          <Route
            path="/categorize"
            element={
              <PrivateRoute>
                <CategorizationForm
                  key="PROP"
                  mode="PROP"
                  allCycles={allCycles}
                  modalFile={modalFile}
                  setModalFile={setModalFile}
                  renderTableComponent={(props) => <ProposalTable {...props} />}
                  button_label="Categorize Proposals"
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/duplication"
            element={
              <PrivateRoute>
                <DuplicationForm
                  key="DUP"
                  mode="DUP"
                  allCycles={allCycles}
                  modalFile={modalFile}
                  setModalFile={setModalFile}
                  renderTableComponent={(props) => (
                    <TableForDuplicationChecker {...props} />
                  )}
                  button_label="Find Duplicates"
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/review"
            element={
              <PrivateRoute>
                <MatchReviewersForm
                  key="MATCH"
                  mode="MATCH"
                  allCycles={allCycles}
                  modalFile={modalFile}
                  setModalFile={setModalFile}
                  renderTableComponent={(props) => (
                    <TableMatchReviewers {...props} />
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
          {isUserAdminContext && (
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard usernameContext={usernameContext} />
                </PrivateRoute>
              }
            />
          )}
          <Route
            path="/logout"
            element={
              <PrivateRoute>
                <Logout
                  usernameContext={usernameContext}
                  isUserAdminContext={isUserAdminContext}
                  setLoggedIn={setLoggedIn}
                />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
