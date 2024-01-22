import { GearFill, QuestionCircle } from 'react-bootstrap-icons';
import sample from "../assets/react.svg";
import "../css/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light border">
        <button className="navbar-toggler" type="button" 
        data-toggle="collapse" data-target="#navbarNav" 
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="nav">
                <li className="nav-item border ms-5 px-5">
                    <a className="nav-link text-dark" href="#">
                        <div>
                            Proposals- Categorize
                        </div>
                    </a>
                </li>
                <li className="nav-item border ms-5 px-5">
                    <a className="nav-link text-dark" href="#">
                        <div>
                            Sample #2
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <div id="right-corner" className="">
            <div className=''>
                <a href="#">
                    <QuestionCircle size={20} color='black'/>
                </a>
            </div>
            <div className=''>
                <a href="#">
                    <GearFill size={20} color='black'/>
                </a>
            </div>
            <div id="profile" className=''>
                <a href="#">
                    <img
                        className='border'
                        src={sample}
                        style={{ width: '40px', borderRadius: '50%' }}
                    />
                </a>
            </div>
        </div>
    </nav>
  )
}


export default Navbar;
