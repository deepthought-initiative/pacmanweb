import "../css/searchBox.css";
import DropdownConfigOption from "./dropdownConfigOption";
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
        <div>
          <DropdownConfigOption data={numbers}/>
          <div className='form-text text-start mt-2'>
            Prefix used throughout script to match with cycle description
          </div> 
        </div>
        <OtherConfigOptions />  
      </form>
    </div>
    </>
    

  )
}

export default SearchBox