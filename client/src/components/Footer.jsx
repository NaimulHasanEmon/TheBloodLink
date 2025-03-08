import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-neutral to-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 relative animate-float">
                <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-bold text-white">The Blood Link</h2>
            </div>
            <p className="text-gray-300 mt-4 leading-relaxed">
              Connecting blood donors with those in need. Your donation can save
              lives. Join our community today and be a hero.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="footer-link flex items-center gap-2 text-gray-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="footer-link flex items-center gap-2 text-gray-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  className="footer-link flex items-center gap-2 text-gray-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  to="/checkout/1" 
                  className="footer-link flex items-center gap-2 text-gray-300 hover:text-primary"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Donate Blood
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span>123 Blood Street, Medical District, City</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaPhone className="text-primary flex-shrink-0" />
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <span>info@thebloodlink.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2"></span>
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for updates on blood donation camps and more.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="btn-primary py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                Subscribe <FaEnvelope />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-400">
          <p className="flex items-center justify-center gap-1">
            &copy; {currentYear} The Blood Link. Made with <FaHeart className="text-primary animate-beat" /> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 