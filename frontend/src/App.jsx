import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProposalDuplicationChecker from "./components/DuplicationCheck/ProposalDuplicationChecker";
import ProposalCategorize from "./components/ProposalCategorization/ProposalCategorize";
import MatchReviewers from "./components/Reviewers/MatchReviewers";
import UploadZipForm from "./components/Upload/UploadZip";
import Navbar from "./components/util/Navbar";

function App() {
  const [allCycles, setAllCycles] = useState([]);
  const [modalFile, setModalFile] = useState();

  useEffect(() => {
    async function fetchCycles() {
      const cycles = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/get_cycles?api_key=barebones`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic" + btoa("default:barebones"),
            "Content-Type": "application/json",
          },
        }
      );
      const cycleList = await cycles.json();
      setAllCycles(cycleList["proposal_cycles"]);
      setModalFile(cycleList["models"]);
    }
    fetchCycles();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/categorize"
            element={
              <ProposalCategorize
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
              />
            }
          />
          <Route
            path="/duplication"
            element={
              <ProposalDuplicationChecker
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
              />
            }
          />
          <Route
            path="/review"
            element={
              <MatchReviewers
                allCycles={allCycles}
                modalFile={modalFile}
                setModalFile={setModalFile}
              />
            }
          />
          <Route path="/upload" element={<UploadZipForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
