import './App.css';
import Navbar from './components/navbar';
import ProposalTable from './components/proposalTable';
import SearchBox from './components/searchBox';

function App() {

  return (
    <div>
      <Navbar/>
      <SearchBox/>
      <ProposalTable/>
    </div>
  )
}

export default App;
