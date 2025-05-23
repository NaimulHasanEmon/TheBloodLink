import { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaArrowLeft, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Login = () => {
  const { logIn, signInWithGoogle, signInWithFacebook, signInWithTwitter, user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

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

  const handleSocialLogin = async (loginMethod, providerName) => {
    setLoading(true);
    setError("");
    
    try {
      const result = await loginMethod();
      const user = result.user;
      console.log(user);
      toast.success(`Successfully logged in with ${providerName}!`);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      setError(error.message);
      toast.error(`Failed to login with ${providerName}.`);
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
              
              {/* Social Login Options - Moved to top */}
              <div className="mb-8">
                <div className="relative flex items-center justify-center mb-6">
                  <hr className="w-full border-gray-300" />
                  <span className="absolute bg-white px-4 text-sm font-medium text-gray-500">Login with</span>
                </div>
                
                <div className="flex justify-center gap-6 mt-4">
                  {/* Google Button */}
                  <button 
                    type="button" 
                    className="w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
                    onClick={() => handleSocialLogin(signInWithGoogle, "Google")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                  </button>
                  
                  {/* Facebook Button */}
                  <button 
                    type="button" 
                    className="w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-[#1877F2]"
                    onClick={() => handleSocialLogin(signInWithFacebook, "Facebook")}
                  >
                    <FaFacebookF className="text-white text-2xl" />
                  </button>
                  
                  {/* X Button */}
                  <button 
                    type="button" 
                    className="w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-black"
                    onClick={() => handleSocialLogin(signInWithTwitter, "X")}
                  >
                    <FaXTwitter className="text-white text-2xl" />
                  </button>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center mb-6">
                <hr className="w-full border-gray-300" />
                <span className="absolute bg-white px-4 text-sm font-medium text-gray-500">Or login with email</span>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <div className="flex h-[46px]">
                    <div className="w-12 h-full flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                      <FaEnvelope className="text-gray-500 text-xl" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <div className="flex h-[46px] relative">
                    <div className="w-12 h-full flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                      <FaLock className="text-gray-500 text-xl" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[46px] flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt />
                        Login
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  New to The Blood Link?{" "}
                  <Link to="/signup" className="text-primary hover:text-blood-dark font-bold inline-flex items-center">
                    Sign Up <FaUserPlus className="ml-1" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 