import { useState } from "react";
import "../css/searchBox.css";
import ProposalTable from './proposalTable';


const SearchBox = () => {
  const [show, setShow] = useState(false)

  const handleClick = () => {
    setShow(true)
  }
  return (
    <>
    <div className="container mt-5" id="main-container">
        <label>Selected Current Cycle</label>
        <div className="input-group">
          <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
        </div>
        <div className='form-text text-start'>
            Proposals were categorized for this cycle
        </div>
    </div>
    {show ? 
        <ProposalTable/> :
        <div className="row mt-5">
            <button className="btn" onClick={handleClick}>Proposals- Categorize</button>
        </div>}
    </>
    

  )
}

export default SearchBox