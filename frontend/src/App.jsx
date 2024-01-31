import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProposalDuplicationChecker from "./components/DuplicationCheck/ProposalDuplicationChecker";
import ProposalCategorize from "./components/ProposalCategorization/ProposalCategorize";
import MatchReviewers from "./components/Reviewers/MatchReviewers";
import Navbar from "./components/util/Navbar";

function App() {
  const [currentId, setCurrentId] = useState();
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/categorize"
            element={
              <ProposalCategorize
                currentId={currentId}
                setCurrentId={setCurrentId}
              />
            }
          />
          <Route
            path="/duplication"
            element={
              <ProposalDuplicationChecker
                currentId={currentId}
                setCurrentId={setCurrentId}
              />
            }
          />
          <Route
            path="/review"
            element={
              <MatchReviewers
                currentId={currentId}
                setCurrentId={setCurrentId}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
