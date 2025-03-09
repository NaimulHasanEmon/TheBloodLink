import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaTint, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaEdit, 
  FaCamera, 
  FaSave, 
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCircle,
  FaHistory
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    phone: "",
    address: "",
    lastDonationDate: "",
    photoURL: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const fetchDonorData = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/donors/user/${user.uid}`);
          setDonor(response.data);
          setFormData({
            name: response.data?.name || user.displayName || "",
            email: response.data?.email || user.email || "",
            bloodGroup: response.data?.bloodGroup || "",
            phone: response.data?.phone || "",
            address: response.data?.address || "",
            lastDonationDate: response.data?.lastDonationDate || "",
            photoURL: response.data?.photoURL || user.photoURL || ""
          });
        } catch (error) {
          console.error("Error fetching donor data:", error);
          // If donor not found, use user data
          setFormData({
            name: user.displayName || "",
            email: user.email || "",
            bloodGroup: "",
            phone: "",
            address: "",
            lastDonationDate: "",
            photoURL: user.photoURL || ""
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDonorData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Update profile in Firebase if name or photo changed
      if (user.displayName !== formData.name || imageFile) {
        // In a real app, you would upload the image to storage and get URL
        // For this example, we'll just use the existing photoURL
        await updateUserProfile(formData.name, formData.photoURL);
      }

      // Update donor info in MongoDB
      if (donor) {
        await axios.put(`http://localhost:5000/donors/${donor._id}`, {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        // Create new donor if not exists
        await axios.post("http://localhost:5000/donors", {
          ...formData,
          uid: user.uid
        });
      }

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-blood p-6 text-white relative">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hearts-dashboard" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 10 Q15 0 10 10 Q0 15 10 25 L20 35 L30 25 Q40 15 30 10 Q25 0 20 10Z" fill="white"/>
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#hearts-dashboard)"/>
                </svg>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  {imagePreview || formData.photoURL ? (
                    <img 
                      src={imagePreview || formData.photoURL} 
                      alt={formData.name} 
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                      <FaUserCircle className="text-gray-400 text-5xl" />
                    </div>
                  )}
                  {editMode && (
                    <label htmlFor="profile-image" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaCamera className="text-white text-2xl" />
                      <input 
                        type="file" 
                        id="profile-image" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold">{formData.name || "Donor Name"}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                      <FaEnvelope className="mr-1" /> {formData.email}
                    </span>
                    {formData.bloodGroup && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                        <FaTint className="mr-1" /> {formData.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-auto mt-4 md:mt-0">
                  {!editMode ? (
                    <button 
                      onClick={() => setEditMode(true)} 
                      className="btn-outline border-white text-white hover:bg-white hover:text-primary px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditMode(false)} 
                      className="btn-outline border-white text-white hover:bg-white hover:text-primary px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Dashboard Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === "profile"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } transition-colors duration-200`}
                >
                  <FaUser className="inline mr-2" /> Profile
                </button>
                <button
                  onClick={() => setActiveTab("donations")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === "donations"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } transition-colors duration-200`}
                >
                  <FaHistory className="inline mr-2" /> Donation History
                </button>
              </nav>
            </div>
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="form-group">
                      <label className="form-label flex items-center gap-2" htmlFor="name">
                        <FaUser className="text-primary" /> Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-md border ${
                          editMode ? "bg-white" : "bg-gray-50"
                        } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        disabled={!editMode}
                      />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label className="form-label flex items-center gap-2" htmlFor="email">
                        <FaEnvelope className="text-primary" /> Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        className="w-full px-4 py-3 rounded-md border bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Blood Group */}
                    <div className="form-group">
                      <label className="form-label flex items-center gap-2" htmlFor="bloodGroup">
                        <FaTint className="text-primary" /> Blood Group
                      </label>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-md border ${
                          editMode ? "bg-white" : "bg-gray-50"
                        } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none`}
                        disabled={!editMode}
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <label className="form-label flex items-center gap-2" htmlFor="phone">
                        <FaPhone className="text-primary" /> Phone Number
                      </label>
                      <div className="flex">
                        <div className="flex-shrink-0 flex items-center justify-center bg-gray-200 px-3 border border-r-0 border-gray-300 rounded-l-md font-medium text-gray-600">
                          +880
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="1XXXXXXXXX"
                          className={`w-full px-4 py-3 rounded-r-md border ${
                            editMode ? "bg-white" : "bg-gray-50"
                          } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    {/* Last Donation Date */}
                    <div className="form-group">
                      <label className="form-label flex items-center gap-2" htmlFor="lastDonationDate">
                        <FaCalendarAlt className="text-primary" /> Last Donation Date
                      </label>
                      <input
                        type="date"
                        id="lastDonationDate"
                        name="lastDonationDate"
                        value={formData.lastDonationDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-md border ${
                          editMode ? "bg-white" : "bg-gray-50"
                        } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        disabled={!editMode}
                      />
                    </div>

                    {/* Address */}
                    <div className="form-group md:col-span-2">
                      <label className="form-label flex items-center gap-2" htmlFor="address">
                        <FaMapMarkerAlt className="text-primary" /> Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Your full address"
                        className={`w-full px-4 py-3 rounded-md border ${
                          editMode ? "bg-white" : "bg-gray-50"
                        } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-24`}
                        disabled={!editMode}
                      ></textarea>
                    </div>
                  </div>

                  {editMode && (
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <FaSpinner className="animate-spin" /> Updating...
                          </>
                        ) : (
                          <>
                            <FaSave /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Donation History Tab Content */}
          {activeTab === "donations" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="text-center py-8">
                  {donor?.lastDonationDate ? (
                    <div>
                      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500">
                        <FaCheckCircle className="text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Last Donation</h3>
                      <p className="text-gray-600">
                        You last donated blood on{" "}
                        <span className="font-semibold text-primary">
                          {new Date(donor.lastDonationDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </span>
                      </p>
                      
                      {/* Eligibility Status */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg inline-block">
                        <h4 className="font-bold mb-2">Next Eligible Donation Date</h4>
                        <p className="text-gray-600">
                          You can donate again after{" "}
                          <span className="font-semibold text-primary">
                            {new Date(new Date(donor.lastDonationDate).setMonth(
                              new Date(donor.lastDonationDate).getMonth() + 3
                            )).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500">
                        <FaExclamationTriangle className="text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Donation History</h3>
                      <p className="text-gray-600 mb-4">
                        You haven't recorded any blood donations yet.
                      </p>
                      <button 
                        onClick={() => {
                          setActiveTab("profile");
                          setEditMode(true);
                        }}
                        className="btn-primary px-4 py-2 rounded-lg inline-flex items-center gap-2"
                      >
                        <FaEdit /> Update Your Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 