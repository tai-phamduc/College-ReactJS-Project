import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaTicketAlt, FaCog, FaUserCircle } from 'react-icons/fa';
import { authService } from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    };

    // Check on initial load
    checkUserLoggedIn();

    // Set up event listener for storage changes (for when user logs in/out in another tab)
    window.addEventListener('storage', checkUserLoggedIn);

    // Set up custom event listener for login/logout
    window.addEventListener('auth-change', checkUserLoggedIn);

    // Check every second for changes (as a fallback)
    const interval = setInterval(checkUserLoggedIn, 1000);

    return () => {
      window.removeEventListener('storage', checkUserLoggedIn);
      window.removeEventListener('auth-change', checkUserLoggedIn);
      clearInterval(interval);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);

    // Dispatch auth-change event
    window.dispatchEvent(new Event('auth-change'));

    // Close user menu
    setIsUserMenuOpen(false);

    // Navigate to login page
    navigate('/login');
  };

  return (
    <header className="bg-secondary py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          <span className="text-primary">Movie</span>Hub
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
            }
          >
            Movies
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
            }
          >
            Events
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
            }
          >
            News
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
            }
          >
            Contact
          </NavLink>

          {currentUser?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* User Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center text-white hover:text-primary focus:outline-none"
              >
                <FaUserCircle className="mr-2 text-xl" />
                {currentUser.name}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-1 z-50">
                  {currentUser.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-white hover:bg-gray-700 flex items-center"
                    >
                      <FaUser className="mr-2" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-gray-700 flex items-center"
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                  )}


                  <Link
                    to="/account/reminders"
                    className="block px-4 py-2 text-white hover:bg-gray-700 flex items-center"
                  >
                    <FaCog className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-white hover:text-primary"
              >
                <FaUser className="mr-2" />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-secondary z-50 p-4 shadow-lg">
            <nav className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
                }
                onClick={toggleMenu}
              >
                Home
              </NavLink>
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
                }
                onClick={toggleMenu}
              >
                Movies
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
                }
                onClick={toggleMenu}
              >
                Events
              </NavLink>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
                }
                onClick={toggleMenu}
              >
                News
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
                }
                onClick={toggleMenu}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
                }
                onClick={toggleMenu}
              >
                Contact
              </NavLink>

              {currentUser?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? 'text-primary font-medium' : 'text-white hover:text-primary'
                  }
                  onClick={toggleMenu}
                >
                  Admin
                </NavLink>
              )}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700">
                {currentUser ? (
                  <>
                    <div className="flex items-center text-white mb-2">
                      <FaUserCircle className="mr-2 text-xl" />
                      <span>{currentUser.name}</span>
                    </div>
                    {currentUser.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="flex items-center text-white hover:text-primary"
                        onClick={toggleMenu}
                      >
                        <FaUser className="mr-2" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/profile"
                        className="flex items-center text-white hover:text-primary"
                        onClick={toggleMenu}
                      >
                        <FaUser className="mr-2" />
                        My Profile
                      </Link>
                    )}


                    <Link
                      to="/account/reminders"
                      className="flex items-center text-white hover:text-primary"
                      onClick={toggleMenu}
                    >
                      <FaCog className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex items-center text-white hover:text-primary"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center text-white hover:text-primary"
                      onClick={toggleMenu}
                    >
                      <FaUser className="mr-2" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary text-center"
                      onClick={toggleMenu}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
