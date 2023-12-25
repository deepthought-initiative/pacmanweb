import "../css/searchBox.css";

const SearchBox = () => {
  return (
    <div className="container mt-5" id="main-container">
        <label>Selected Current Cycle</label>
        <div className="input-group">
          <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
        </div>
        <div className='form-text text-start'>
            Proposals were categorized for this cycle
        </div>
        <div className="row mt-5">
            <button className="btn border">Proposals- Categorize</button>
        </div>
    </div>

  )
}

export default SearchBox