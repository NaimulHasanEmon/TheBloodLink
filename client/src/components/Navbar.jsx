import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FaUserCircle, FaBars, FaTimes, FaHeart, FaHandHoldingHeart, FaChevronRight, FaTint } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((error) => console.log(error));
  };

  // Check if the navbar should change style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? "bg-white shadow-md py-2"
      : "bg-transparent py-4"
  }`;

  const navItems = (
    <>
      <li>
        <Link 
          to="/" 
          className={`navbar-link group flex items-center gap-1 ${isActive("/") ? "text-primary after:w-full" : ""}`}
        >
          <span className="group-hover:animate-beat inline-block">Home</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/find-blood" 
          className={`navbar-link group flex items-center gap-1 ${isActive("/find-blood") ? "text-primary after:w-full" : ""}`}
        >
          <FaTint className="group-hover:animate-beat" />
          <span>Find Blood</span>
        </Link>
      </li>
      {user ? (
        <>
          <li>
            <Link 
              to="/dashboard" 
              className={`navbar-link group flex items-center gap-1 ${isActive("/dashboard") ? "text-primary after:w-full" : ""}`}
            >
              <FaUserCircle className="group-hover:animate-beat" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/checkout/1" 
              className={`navbar-link group flex items-center gap-1 ${isActive("/checkout/1") ? "text-primary after:w-full" : ""}`}
            >
              <FaHandHoldingHeart className="group-hover:animate-beat" />
              <span>Donate Blood</span>
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogOut} 
              className="btn-outline px-4 py-2 rounded-full flex items-center gap-1 text-sm"
            >
              <span>Log Out</span>
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link 
              to="/login" 
              className={`navbar-link group flex items-center gap-1 ${isActive("/login") ? "text-primary after:w-full" : ""}`}
            >
              <span>Login</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/signup" 
              className="btn-primary px-4 py-2 rounded-full flex items-center gap-1 text-sm"
            >
              <FaHeart className="animate-beat" />
              <span>Become a Donor</span>
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className={navbarClasses}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 relative animate-float">
              <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
            </div>
            <div>
              <h1 className={`font-bold transition-colors duration-300 ${isScrolled ? "text-primary text-xl" : "text-primary text-2xl"}`}>
                The Blood Link
              </h1>
              <p className={`text-xs transition-all duration-300 ${isScrolled ? "opacity-0 h-0" : "opacity-100"}`}>
                Donate & Save Lives
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Always on the right */}
          <div className="hidden md:flex items-center justify-end flex-1">
            <nav>
              <ul className="flex items-center space-x-6">
                {navItems}
              </ul>
            </nav>
            
            {/* User Avatar (if logged in) - Now part of the right-side navigation */}
            {user && (
              <div className="flex items-center ml-4">
                <Link to="/dashboard" className="relative group">
                  <div className="avatar transition-all duration-300 group-hover:ring-2 group-hover:ring-primary rounded-full">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || "User"} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-full h-full text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-1 transition-all duration-300">
                    <FaChevronRight className="text-white text-xs" />
                  </div>
                  <span className="absolute top-full mt-1 right-0 bg-white text-primary text-xs font-medium py-1 px-2 rounded shadow-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    View Dashboard
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes className="text-primary" /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 overflow-hidden z-50 ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col space-y-4 p-4">
            {navItems}
            {user && (
              <li className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <Link to="/dashboard" className="flex items-center gap-2 w-full hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || "User"} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-full h-full text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium truncate block">
                      {user.displayName || user.email}
                    </span>
                    <span className="text-xs text-primary">View Dashboard</span>
                  </div>
                  <FaChevronRight className="text-primary text-xs" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 