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

function App() {
  const [allCycles, setAllCycles] = useState([]);
  const [modalFile, setModalFile] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

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
    }
    fetchCycles();
  }, []);
  return loggedIn ? (
    <>
      <BrowserRouter>
        <MainNavbar />
        <Routes>
          <Route
            path="/categorize"
            element={
              <CategorizationForm
                key="PROP"
                mode="PROP"
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
                renderTableComponent={(props) => <ProposalTable {...props} />}
                button_label="Categorize Proposals"
              />
            }
          />
          <Route
            path="/duplication"
            element={
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
            }
          />
          <Route
            path="/review"
            element={
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
            }
          />
          <Route path="/upload" element={<UploadZipForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/logout"
            element={<Logout setLoggedIn={setLoggedIn} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  ) : (
    <Login setLoggedIn={setLoggedIn} />
  );
}

export default App;
