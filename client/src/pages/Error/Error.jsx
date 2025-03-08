import { Link, useRouteError } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const Error = () => {
  const error = useRouteError();
  console.error(error);

  const errorMessage = error?.statusText || error?.message || "Sorry, the page you are looking for doesn't exist.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cross" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0 L20 40 M0 20 L40 20" stroke="#E53E3E" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#cross)"/>
        </svg>
      </div>
      
      <div className="text-center relative z-10 max-w-lg animate-slide-up">
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaExclamationTriangle className="text-6xl text-primary animate-pulse-slow" />
          </div>
        </div>
        
        <h2 className="text-4xl font-bold text-neutral mb-6">Page Not Found</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <p className="text-xl text-gray-600 mb-4">
            {errorMessage}
          </p>
          <p className="text-gray-500">
            The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        <Link
          to="/"
          className="btn-primary px-8 py-3 rounded-full inline-flex items-center gap-2 text-lg animate-bounce-slow"
        >
          <FaHome /> Go Back Home
        </Link>
        
        <div className="mt-8 text-gray-500">
          <p>Error Reference: {error?.status || "Unknown"}</p>
        </div>
      </div>
      
      {/* Blood Drop Decorations */}
      <div className="absolute top-20 left-20 opacity-20 animate-float" style={{animationDelay: '0.5s'}}>
        <img src="/blood-drop.svg" alt="" className="w-16 h-16" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 animate-float" style={{animationDelay: '1s'}}>
        <img src="/blood-drop.svg" alt="" className="w-16 h-16" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-20 animate-float" style={{animationDelay: '1.5s'}}>
        <img src="/blood-drop.svg" alt="" className="w-16 h-16" />
      </div>
      <div className="absolute bottom-1/3 left-1/4 opacity-20 animate-float" style={{animationDelay: '2s'}}>
        <img src="/blood-drop.svg" alt="" className="w-16 h-16" />
      </div>
    </div>
  );
};

export default Error; 