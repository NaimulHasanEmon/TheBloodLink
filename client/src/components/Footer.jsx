import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCode, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import BloodDropIcon from "./ui/BloodDropIcon";
import "../styles/animations.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-neutral to-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative animate-blood-drip">
                <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">The Blood Link</h2>
            </div>
            <p className="text-gray-300 mt-2 sm:mt-4 text-sm sm:text-base leading-relaxed">
              Connecting blood donors with those in need. Your donation can save
              lives. Join our community today and be a hero.
            </p>
            <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6">
              <a 
                href="#" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 transform hover-lift"
                aria-label="Facebook"
              >
                <FaFacebook className="hover-pulse" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 transform hover-lift"
                aria-label="Twitter"
              >
                <FaTwitter className="hover-pulse" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 transform hover-lift"
                aria-label="Instagram"
              >
                <FaInstagram className="hover-pulse" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 relative">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-2 sm:space-y-3 stagger-fade-in">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-1 text-sm sm:text-base hover-underline">
                  <span className="text-primary">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/find-blood" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-1 text-sm sm:text-base hover-underline">
                  <span className="text-primary">›</span> Find Blood
                  <BloodDropIcon size="sm" color="primary" className="ml-1" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-1 text-sm sm:text-base hover-underline">
                  <span className="text-primary">›</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-1 text-sm sm:text-base hover-underline">
                  <span className="text-primary">›</span> Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-1 text-sm sm:text-base hover-underline">
                  <span className="text-primary">›</span> Become a Donor
                  <FaHeart className="text-primary ml-1 animate-heartbeat" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 relative">
              <span className="relative z-10">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-3 sm:space-y-4 stagger-fade-in">
              <li className="flex items-start gap-3 text-sm sm:text-base hover-lift">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0 animate-pulse-gentle" />
                <span className="text-gray-300">
                  123 Blood Donor Street, Medical District, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm sm:text-base hover-lift">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:+8801712345678" className="text-gray-300 hover:text-white transition-colors duration-300 hover-underline">
                  +880 171 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm sm:text-base hover-lift">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href="mailto:info@thebloodlink.com" className="text-gray-300 hover:text-white transition-colors duration-300 hover-underline">
                  info@thebloodlink.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 relative">
              <span className="relative z-10">Newsletter</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary"></span>
            </h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Subscribe to our newsletter for updates on blood donation camps and urgent requirements.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base transition-all duration-300 focus:bg-white/15"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blood-dark transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base hover-pulse donate-button-pulse"
              >
                Subscribe <FaHeart className="animate-heartbeat" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-gray-400 text-xs sm:text-sm animate-fade-in">
            &copy; {currentYear} The Blood Link. All rights reserved.
          </p>
          <div className="mt-3 sm:mt-0 flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-gray-400 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <a href="#" className="hover:text-white transition-colors duration-300 hover-underline">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300 hover-underline">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300 hover-underline">Cookie Policy</a>
          </div>
        </div>
        
        {/* Developer Credits */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-center items-center gap-3 text-center">
          <p className="text-gray-400 text-xs sm:text-sm flex items-center justify-center">
            <FaCode className="text-primary mr-2" /> Developed by <span className="text-red-500 font-medium ml-1">Md. Naimul Hasan</span>
          </p>
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <a 
              href="https://www.linkedin.com/in/md-naimul-hasan-emon/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={12} />
            </a>
            <a 
              href="https://github.com/NaimulHasanEmon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300"
              aria-label="GitHub"
            >
              <FaGithub size={12} />
            </a>
            <a 
              href="https://mdnaimulhasan.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Portfolio"
            >
              <FaGlobe size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 