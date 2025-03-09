import { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { 
  FaUserCircle, 
  FaBars, 
  FaTimes, 
  FaHeart, 
  FaHandHoldingHeart, 
  FaChevronRight, 
  FaTint,
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaInfoCircle
} from "react-icons/fa";
import BloodDropIcon from "./ui/BloodDropIcon";
import "../styles/animations.css";

// Tooltip component for consistent styling
const Tooltip = ({ text, position = "bottom" }) => {
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2"
  };

  return (
    <span className={`absolute ${positionClasses[position]} bg-white text-primary text-xs font-medium py-1 px-2 rounded shadow-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity duration-200`}>
      {text}
    </span>
  );
};

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuExiting, setIsMenuExiting] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);

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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Handle clicks outside the mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        event.target.id !== 'mobile-menu-toggle'
      ) {
        toggleMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Handle mobile menu toggle with animation
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // Start exit animation
      setIsMenuExiting(true);
      // Wait for animation to complete before closing
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsMenuExiting(false);
      }, 300);
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Define navbar classes based on scroll position
  const navbarClasses = `py-3 md:py-4 ${
    isScrolled
      ? "bg-white shadow-md"
      : "bg-transparent"
  } transition-all duration-300 sticky top-0 z-[1000]`;

  const navItems = (
    <>
      <li className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Link 
          to="/" 
          className={`navbar-link group flex items-center gap-2 text-sm md:text-base hover-underline ${isActive("/") ? "text-primary after:w-full" : ""} relative`}
        >
          <FaHome className="text-lg group-hover:animate-heartbeat" />
          <span>Home</span>
          <Tooltip text="Go to homepage" />
        </Link>
      </li>
      <li className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <Link 
          to="/find-blood" 
          className={`navbar-link group flex items-center gap-2 text-sm md:text-base hover-underline ${isActive("/find-blood") ? "text-primary after:w-full" : ""} relative`}
        >
          <BloodDropIcon size="sm" animate={isActive("/find-blood")} className="group-hover:animate-blood-drip" />
          <span>Find Blood</span>
          <Tooltip text="Search for blood donors" />
        </Link>
      </li>
      {user ? (
        <>
          <li className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link 
              to="/dashboard" 
              className={`navbar-link group flex items-center gap-2 text-sm md:text-base hover-underline ${isActive("/dashboard") ? "text-primary after:w-full" : ""} relative`}
            >
              <FaUserCircle className="text-lg group-hover:animate-pulse-gentle" />
              <span>Dashboard</span>
              <Tooltip text="View your dashboard" />
            </Link>
          </li>
          <li className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <button 
              onClick={handleLogOut} 
              className="btn-outline px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm hover-pulse group relative"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Log Out</span>
              <Tooltip text="Sign out of your account" />
            </button>
          </li>
        </>
      ) : (
        <>
          <li className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link 
              to="/login" 
              className={`navbar-link group flex items-center gap-2 text-sm md:text-base hover-underline ${isActive("/login") ? "text-primary after:w-full" : ""} relative`}
            >
              <FaSignInAlt className="text-lg group-hover:animate-pulse-gentle" />
              <span>Login</span>
              <Tooltip text="Sign in to your account" />
            </Link>
          </li>
          <li className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Link 
              to="/signup" 
              className="btn-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm hover-pulse donate-button-pulse group relative"
            >
              <FaHeart className="animate-heartbeat" />
              <span>Become a Donor</span>
              <Tooltip text="Register as a blood donor" />
            </Link>
          </li>
        </>
      )}
    </>
  );

  // Mobile menu items with larger touch targets and icons
  const mobileNavItems = (
    <>
      <li>
        <Link 
          to="/" 
          className={`flex items-center gap-3 p-4 rounded-xl ${isActive("/") ? "bg-primary/10 text-primary font-medium" : "text-gray-700"} group relative`}
          onClick={toggleMobileMenu}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive("/") ? "bg-primary text-white" : "bg-gray-100"}`}>
            <FaHome className="text-xl" />
          </div>
          <span className="text-lg">Home</span>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 z-10">
            Go to homepage
          </div>
        </Link>
      </li>
      <li>
        <Link 
          to="/find-blood" 
          className={`flex items-center gap-3 p-4 rounded-xl ${isActive("/find-blood") ? "bg-primary/10 text-primary font-medium" : "text-gray-700"} group relative`}
          onClick={toggleMobileMenu}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive("/find-blood") ? "bg-primary text-white" : "bg-gray-100"}`}>
            <FaTint className="text-xl" />
          </div>
          <span className="text-lg">Find Blood</span>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 z-10">
            Search for blood donors
          </div>
        </Link>
      </li>
      {user ? (
        <>
          <li>
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-3 p-4 rounded-xl ${isActive("/dashboard") ? "bg-primary/10 text-primary font-medium" : "text-gray-700"} group relative`}
              onClick={toggleMobileMenu}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive("/dashboard") ? "bg-primary text-white" : "bg-gray-100"}`}>
                <FaUserCircle className="text-xl" />
              </div>
              <span className="text-lg">Dashboard</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 z-10">
                View your dashboard
              </div>
            </Link>
          </li>
          <li>
            <button 
              onClick={() => {
                handleLogOut();
                toggleMobileMenu();
              }} 
              className="flex items-center gap-3 p-4 rounded-xl w-full text-left text-gray-700 group relative"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FaSignOutAlt className="text-xl" />
              </div>
              <span className="text-lg">Log Out</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 z-10">
                Sign out of your account
              </div>
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link 
              to="/login" 
              className={`flex items-center gap-3 p-4 rounded-xl ${isActive("/login") ? "bg-primary/10 text-primary font-medium" : "text-gray-700"} group relative`}
              onClick={toggleMobileMenu}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive("/login") ? "bg-primary text-white" : "bg-gray-100"}`}>
                <FaSignInAlt className="text-xl" />
              </div>
              <span className="text-lg">Login</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 z-10">
                Sign in to your account
              </div>
            </Link>
          </li>
          <li>
            <Link 
              to="/signup" 
              className={`flex items-center gap-3 p-4 rounded-xl ${isActive("/signup") ? "bg-primary/10 text-primary font-medium" : "text-gray-700"} group relative`}
              onClick={toggleMobileMenu}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive("/signup") ? "bg-primary text-white" : "bg-gray-100"}`}>
                <FaUserPlus className="text-xl" />
              </div>
              <span className="text-lg">Become a Donor</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 z-10">
                Register as a blood donor
              </div>
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-10 animate-fade-in group relative">
            <div className="w-8 h-8 md:w-10 md:h-10 relative animate-blood-drip">
              <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
            </div>
            <div>
              <h1 className={`font-bold transition-colors duration-300 ${isScrolled ? "text-primary text-lg md:text-xl" : "text-primary text-xl md:text-2xl"}`}>
                The Blood Link
              </h1>
              <p className={`text-xs transition-all duration-300 ${isScrolled ? "opacity-0 h-0" : "opacity-100"}`}>
                Donate & Save Lives
              </p>
            </div>
            <Tooltip text="Return to homepage" />
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
              <div className="flex items-center ml-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
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
            id="mobile-menu-toggle"
            className="md:hidden w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center focus:outline-none z-10 hover-pulse group relative"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-primary text-xl animate-pulse-gentle" />
            ) : (
              <FaBars className="text-primary text-xl" />
            )}
            <Tooltip text={isMobileMenuOpen ? "Close menu" : "Open menu"} />
          </button>
        </div>

        {/* Overlay for background blur */}
        <div 
          className={`md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>

        {/* Mobile Navigation - 80% width sidebar */}
        <div
          className={`md:hidden fixed top-0 bottom-0 right-0 w-4/5 bg-white z-50 shadow-xl transition-all duration-300 ease-in-out transform ${
            isMobileMenuOpen 
              ? isMenuExiting 
                ? "translate-x-full" 
                : "translate-x-0" 
              : "translate-x-full"
          }`}
        >
          <div 
            ref={mobileMenuRef}
            className="flex flex-col h-full pt-24 pb-8 px-4 overflow-y-auto"
          >
            {/* Close button - Visible and fixed at the top right */}
            <button
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary group relative"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <FaTimes className="text-2xl" />
              <div className="absolute top-full mt-1 right-0 bg-white text-primary text-xs py-1 px-2 rounded shadow-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Close menu
              </div>
            </button>
            
            {/* Mobile menu header */}
            <div className="mb-8 px-4">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <BloodDropIcon size="lg" animate={true} className="mr-2" />
                Menu
              </h2>
              <p className="text-gray-500 mt-1">Find what you need</p>
            </div>
            
            {/* Mobile navigation items */}
            <ul className="flex flex-col space-y-2 mb-auto stagger-fade-in">
              {mobileNavItems}
            </ul>
            
            {/* User profile section at the bottom */}
            {user && (
              <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '500ms' }}>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-4 w-full bg-primary/5 p-4 rounded-xl transition-all duration-200 hover-lift group relative"
                  onClick={toggleMobileMenu}
                >
                  <div className="avatar">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
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
                    <span className="text-lg font-medium truncate block">
                      {user.displayName || user.email}
                    </span>
                    <span className="text-primary flex items-center gap-1">
                      View your profile
                      <FaChevronRight className="text-xs animate-pulse-gentle" />
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 z-10">
                    Go to your dashboard
                  </div>
                </Link>
              </div>
            )}
            
            {/* App version and info */}
            <div className="mt-8 text-center text-gray-400 text-xs">
              <p>The Blood Link v1.0</p>
              <p className="mt-1">Saving lives through donation</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 