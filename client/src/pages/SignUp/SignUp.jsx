import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt, FaMapMarkerAlt, FaTint, FaArrowLeft, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
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
        "http://localhost:5000/donors",
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

            {/* Right Side - Image and Info */}
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
                <h1 className="text-3xl font-bold mb-6 text-center">Become a Hero!</h1>
                
                <div className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <h3 className="font-bold text-xl mb-2">Why Donate Blood?</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>A single donation can save up to 3 lives</li>
                      <li>Blood cannot be manufactured, only donated</li>
                      <li>Every 2 seconds someone needs blood</li>
                      <li>Most donated red blood cells must be used within 42 days</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <h3 className="font-bold text-xl mb-2">Who Can Donate?</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Most people in good health</li>
                      <li>Age 17 or older (16 with parental consent)</li>
                      <li>Weight at least 110 pounds</li>
                      <li>Pass the physical and health history assessments</li>
                    </ul>
                  </div>
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