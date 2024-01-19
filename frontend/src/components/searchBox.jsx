import "../css/searchBox.css";
import OtherConfigOptions from "./otherConfigOptions";


const SearchBox = () => {
  // const [show, setShow] = useState(false)

const numbers = [123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012, 172345];

  // const handleClick = () => {
  //   setShow(show => !show)
  // }
  return (
    <>
    <div className="mt-5" id="main-container">
      <form>
        <label className="form-label" htmlFor="CurrentCycle">Selected Current Cycle</label>
        <select id="CurrentCycle" className="form-select" aria-label="Select Current Cycle">
          {numbers.map((number) => {
          return (
          <option key={number} value={number}>
            {number}
          </option>);
        })}
        </select>
        
        <div className='form-text text-start'>
            Prefix used throughout script to match with cycle description
        </div>    
      </form>
    </div>
    <OtherConfigOptions />
    </>
    

  )
}

export default SearchBox