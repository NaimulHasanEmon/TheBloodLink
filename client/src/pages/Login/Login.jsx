import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaArrowLeft, FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

const Login = () => {
  const { logIn } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await logIn(email, password);
      const user = result.user;
      console.log(user);
      toast.success("Login successful! Welcome back.");
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      setError(error.message);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Image */}
            <div className="md:w-1/2 bg-gradient-blood p-8 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hearts" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 10 Q15 0 10 10 Q0 15 10 25 L20 35 L30 25 Q40 15 30 10 Q25 0 20 10Z" fill="white"/>
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#hearts)"/>
                </svg>
              </div>
              <div className="relative z-10 animate-slide-up">
                <div className="w-16 h-16 relative mx-auto mb-6 animate-float">
                  <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-center">Welcome Back!</h1>
                <p className="text-lg mb-8 text-center">
                  Login to your account to donate blood or find blood donors. Your
                  contribution can save lives.
                </p>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-3">Did You Know?</h3>
                  <p className="mb-3">A single blood donation can save up to 3 lives.</p>
                  <p>Every 2 seconds someone needs blood. Your donation matters!</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-1/2 p-8 md:p-12 animate-slide-down">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral">Login</h2>
                <Link to="/" className="text-primary hover:text-blood-dark flex items-center gap-1">
                  <FaArrowLeft /> Back to Home
                </Link>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <div className="flex">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                      <FaEnvelope className="text-gray-500 text-xl" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-r-md border border-l-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex justify-between items-center">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <a href="#" className="text-sm text-primary hover:text-blood-dark">
                      Forgot password?
                    </a>
                  </div>
                  <div className="flex">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                      <FaLock className="text-gray-500 text-xl" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-r-md border border-l-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading-blood w-6 h-6"></div>
                  ) : (
                    <>
                      <FaSignInAlt /> Login
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  New to The Blood Link?{" "}
                  <Link to="/signup" className="text-primary hover:text-blood-dark font-bold inline-flex items-center">
                    Sign Up <FaUserPlus className="ml-1" />
                  </Link>
                </p>
              </div>
              
              {/* Social Login Options */}
              <div className="mt-10 pb-4">
                <div className="relative flex items-center justify-center mb-6">
                  <hr className="w-full border-gray-300" />
                  <span className="absolute bg-white px-4 text-sm font-medium text-gray-500">Or continue with</span>
                </div>
                
                <div className="flex justify-center gap-6 mt-6">
                  <button 
                    type="button" 
                    className="w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:-translate-y-1"
                    onClick={() => toast.success("Google login feature coming soon!")}
                  >
                    <FaGoogle className="text-[#4285F4] text-2xl" />
                  </button>
                  
                  <button 
                    type="button" 
                    className="w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:-translate-y-1"
                    onClick={() => toast.success("Facebook login feature coming soon!")}
                  >
                    <FaFacebookF className="text-[#1877F2] text-2xl" />
                  </button>
                  
                  <button 
                    type="button" 
                    className="w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:-translate-y-1"
                    onClick={() => toast.success("X (Twitter) login feature coming soon!")}
                  >
                    <FaTwitter className="text-[#1DA1F2] text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 