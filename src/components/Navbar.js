import { useRef } from "react"
import { FaTimes, FaBars } from "react-icons/fa"
import { Link } from "react-router-dom"

function Navbar(props) {
  const isLoggedIn = props.isLoggedIn
  const handleLogout = props.handleLogout
  const navRef = useRef()

  const showNavbar = () => {
  navRef.current.classList.toggle("responsive_nav")
  }
  
  return (
    <header>
      <nav ref={navRef}>
        {isLoggedIn ? (
          <>
          <Link to="/" target="_self">
             Home       
          </Link>       
          <Link onClick={handleLogout}>
             Logout
          </Link>
          {localStorage.getItem('role') === 'admin' ? (
            <Link to="/admin" target="_self">
              Admin Profile
            </Link>
          ) : (
            <Link to="/profile" target="_self">
              User Profile
            </Link>
          )}
          <Link to="/staff" target="_self">
            Our Staff
          </Link>
    </>
        ) : (
          <>
          <Link to="/" target="_self">
             Home       
          </Link> 
          
          <Link to="/login" target="_self" >
            Login
          </Link>
          <Link to="/staff" target="_self">
            Our Staff
          </Link>
          </>
        )}
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar
