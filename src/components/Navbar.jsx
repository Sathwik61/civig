import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  
  const ApiUrl="http://localhost:5000/api/auth";
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLog, setLog] = useState('Login');
  const navigate = useNavigate();

  useEffect(() => {
    
    const userData = localStorage.getItem('user');
    console.log('User data:', userData,"\n");
    if (userData) {
      setIsLoggedIn(true);
     
    } else {
      setIsLoggedIn(false);
    }
  }, []);



  const handleLogout = () => {
    // Clear cookies and localStorage data
    Cookies.remove('user');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('pid');

    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
    // window.location.reload(); 
  };
  const loginfn=()=>{
    navigate('/login');
    // window.location.reload(); 
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white dark:bg-black text-black dark:text-white border-b border-gray-300 dark:border-gray-700 p-4 flex justify-between items-center relative">
      <div className="text-2xl font-bold">Civigo</div>

      {/* Hamburger menu icon for mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu}>
          {menuOpen ? (
            <FaTimes className="text-black dark:text-white text-2xl" />
          ) : (
            <FaBars className="text-black dark:text-white text-2xl" />
          )}
        </button>
      </div>

     
      <div 
        className={`flex items-center space-x-6 md:flex ${menuOpen ? 'flex-col items-start absolute top-full left-0 w-full bg-white dark:bg-black p-4 border-t border-gray-300 dark:border-gray-700' : 'hidden'} md:block`}
      >
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-gray-500 dark:border-gray-600 transition-all duration-300 hover:scale-105 mb-2 md:mb-0"
        >
          {darkMode ? (
            <FaSun className="text-yellow-500 text-xl" />
          ) : (
            <FaMoon className="text-gray-600 text-xl" />
          )}
        </button>

        <>
  <div
    onClick={isLoggedIn ? handleLogout : loginfn}
    className={`text-gray-800 dark:text-gray-300 hover:underline mb-2 md:mb-0 cursor-pointer ${isLoggedIn ? 'text-red-600 dark:text-red-400 ' : ''}`}
  >
    {isLoggedIn ? 'Logout' : 'Login'}
  </div>
  {isLoggedIn ? (''):(
  <Link to="/signup" className="text-gray-800 dark:text-gray-300 hover:underline mb-2 md:mb-0">
    Signup
  </Link>
  )}
</>

      </div>
    </nav>
  );
};

export default Navbar;
