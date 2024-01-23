import { GearFill, QuestionCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import sample from "../../assets/react.svg";
import "../../css/navbar.css";

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
                <li className="nav-item border ms-5">
                    <Link className="nav-link text-dark" to="/categorize">Proposals- Categorize</Link>
                </li>
                <li className="nav-item border ms-5">
                    <Link className="nav-link text-dark" to="/duplication">Proposals- Duplication Check</Link>
                </li>
                <li className="nav-item border ms-5">
                    <Link className="nav-link text-dark" to="/review">Match Reviewers</Link>
                </li>
            </ul>
        </div>
        <div id="right-corner">
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
            <div>
                <a href="#">
                    <img
                        src={sample}
                    />
                </a>
            </div>
        </div>
    </nav>
  )
}


export default Navbar;
