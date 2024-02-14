import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import TableForDuplicationChecker from "./components/DuplicationCheck/TableForDuplicationChecker";
import ProposalTable from "./components/ProposalCategorization/ProposalTable";
import TableMatchReviewers from "./components/Reviewers/TableMatchReviewers";
import UploadZipForm from "./components/Upload/UploadZip";
import Login from "./components/util/LoginPage";
import Logout from "./components/util/Logout";
import Navbar from "./components/util/Navbar";
import SinglePage from "./components/util/SinglePage";

function App() {
  const [allCycles, setAllCycles] = useState([]);
  const [modalFile, setModalFile] = useState();
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  useEffect(() => {
    async function fetchCycles() {
      const cycles = await fetch(`/api/get_cycles`);
      const cycleList = await cycles.json();
      setAllCycles(cycleList["proposal_cycles"]);
      setModalFile(cycleList["models"]);
    }
    fetchCycles();
  }, []);
  return loggedIn ? (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/categorize"
            element={
              <SinglePage
                key="PROP"
                mode="PROP"
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
                renderTableComponent={(props) => <ProposalTable {...props} />}
                button_label="Proposals-Categorize"
              />
            }
          />
          <Route
            path="/duplication"
            element={
              <SinglePage
                key="DUP"
                mode="DUP"
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
                renderTableComponent={(props) => (
                  <TableForDuplicationChecker {...props} />
                )}
                button_label="Duplication Check"
              />
            }
          />
          <Route
            path="/review"
            element={
              <SinglePage
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
