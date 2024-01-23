import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import MatchReviewers from "./components/MatchReviewers";
import Navbar from './components/Navbar';
import ProposalCategorize from './components/ProposalCategorize';
import ProposalDuplicationChecker from "./components/ProposalDuplicationChecker";

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
