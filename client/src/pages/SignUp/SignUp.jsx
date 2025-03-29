import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt, FaMapMarkerAlt, FaTint, FaArrowLeft, FaUserPlus, FaSignInAlt, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const API_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const { createUser, signInWithGoogle, signInWithFacebook, signInWithTwitter, user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    phone: "",
    address: ""
  });
  const navigate = useNavigate();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create user in Firebase
      const userCredential = await createUser(formData.email, formData.password);
      const user = userCredential.user;

      // Create donor in MongoDB
      const donorData = {
        name: formData.name,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        address: formData.address,
        uid: user.uid,
        photoURL: user.photoURL || "",
      };

      const response = await axios.post(
        `${API_URL}/donors`,
        donorData
      );

      if (response.data.insertedId) {
        toast.success("Registration successful! Welcome to The Blood Link.");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers - consolidated into a single function
  const handleSocialLogin = async (loginMethod, providerName) => {
    setLoading(true);
    setError("");
    
    try {
      const result = await loginMethod();
      const user = result.user;
      
      // Check if user already exists in database
      try {
        await axios.get(`${API_URL}/donors/user/${user.uid}`);
        // If no error, user exists
        toast.success(`Welcome back ${user.displayName || ''}! You're now signed in.`);
      } catch (error) {
        // User doesn't exist, create new donor
        const donorData = {
          name: user.displayName || "",
          email: user.email || "",
          bloodGroup: "",
          phone: "",
          address: "",
          uid: user.uid,
          photoURL: user.photoURL || "",
        };

        await axios.post(`${API_URL}/donors`, donorData);
        toast.success(`Account created successfully with ${providerName}!`);
      }
      
      // Redirect to dashboard for social logins
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError(error.message);
      toast.error(`Failed to sign up with ${providerName}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Form */}
            <div className="md:w-3/5 p-8 md:p-12 animate-slide-up">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral">Register as a Donor</h2>
                <Link to="/" className="text-primary hover:text-blood-dark flex items-center gap-1">
                  <FaArrowLeft /> Back to Home
                </Link>
              </div>
              
              {/* Social Login Options - Moved to top */}
              <div className="mb-8">
                <div className="relative flex items-center justify-center mb-6">
                  <hr className="w-full border-gray-300" />
                  <span className="absolute bg-white px-4 text-sm font-medium text-gray-500">Sign up with</span>
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
                <span className="absolute bg-white px-4 text-sm font-medium text-gray-500">Or register with email</span>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Full Name
                    </label>
                    <div className="flex h-[46px]">
                      <div className="w-12 h-full flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                        <FaUser className="text-gray-500 text-xl" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <div className="flex h-[46px]">
                      <div className="w-12 h-full flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                        <FaLock className="text-gray-500 text-xl" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Blood Group */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="bloodGroup">
                      Blood Group
                    </label>
                    <div className="flex h-[46px]">
                      <div className="w-12 h-full flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                        <FaTint className="text-gray-500 text-xl" />
                      </div>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Phone Number
                    </label>
                    <div className="flex h-[46px]">
                      <div className="w-12 h-full flex items-center justify-center bg-gray-100 rounded-l-md border border-gray-300">
                        <FaPhoneAlt className="text-gray-500 text-xl" />
                      </div>
                      <div className="flex-shrink-0 h-full flex items-center justify-center bg-gray-200 px-3 border border-l-0 border-r-0 border-gray-300 font-medium text-gray-600">
                        +880
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="1XXXXXXXXX"
                        className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your 10-digit number without leading zero
                    </p>
                  </div>

                  {/* Address */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="address">
                      Address
                    </label>
                    <div className="flex h-[106px]">
                      <div className="w-12 h-full flex items-start justify-center pt-3 bg-gray-100 rounded-l-md border border-gray-300">
                        <FaMapMarkerAlt className="text-gray-500 text-xl" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Your full address"
                        className="w-full px-4 py-3 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-full"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:text-blood-dark">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:text-blood-dark">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading-blood w-6 h-6"></div>
                  ) : (
                    <>
                      <FaUserPlus /> Register as Donor
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:text-blood-dark font-bold inline-flex items-center">
                    Login <FaSignInAlt className="ml-1" />
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="md:w-2/5 bg-gradient-blood p-8 text-white flex flex-col justify-center relative overflow-hidden animate-slide-down">
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
              <div className="relative z-10">
                <div className="w-16 h-16 relative mx-auto mb-6 animate-float">
                  <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-center">Join Our Donors</h1>
                <p className="text-lg mb-8 text-center">
                  By registering as a donor, you're taking the first step towards saving lives. Your donation can make a difference.
                </p>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-3">Why Donate Blood?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>A single donation can save up to 3 lives</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Blood cannot be manufactured – it can only come from donors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Every 2 seconds someone needs blood</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 