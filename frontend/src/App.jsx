import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import ProposalDuplicationChecker from "./components/DuplicationCheck/ProposalDuplicationChecker";
import ProposalCategorize from './components/ProposalCategorization/ProposalCategorize';
import MatchReviewers from "./components/Reviewers/MatchReviewers";
import Navbar from './components/util/Navbar';

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/categorize" element={<ProposalCategorize/>} />
          <Route path="/duplication" element={<ProposalDuplicationChecker/>} />
          <Route path="/review" element={<MatchReviewers/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
