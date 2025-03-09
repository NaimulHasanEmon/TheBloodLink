import { useState, useContext, useEffect, useRef } from "react";
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
  FaHistory,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaIdCard,
  FaGlobe,
  FaCity,
  FaMapPin,
  FaHome
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import './calendar.css'; // We'll create this file next
import React from "react";
import { bangladeshData } from "../../data/bangladeshData";

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
    division: "",
    district: "",
    upazila: "",
    lastDonationDate: "",
    photoURL: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Custom date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  
  const calendarRef = useRef(null);
  const dateInputRef = useRef(null);
  
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Add these new states for location dropdowns
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  
  // Fetch donor data
  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/donors/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.data.success) {
        const donorData = response.data.data;
        
        // Format the date for display
        let formattedDate = null;
        if (donorData.lastDonationDate) {
          const date = new Date(donorData.lastDonationDate);
          date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
          formattedDate = date.toISOString().split('T')[0];
          
          // Set the current date for the calendar
          setCurrentDate(date);
        }
        
        setFormData({
          name: donorData.name || "",
          email: donorData.email || "",
          phone: donorData.phone || "",
          bloodGroup: donorData.bloodGroup || "",
          division: donorData.division || "",
          district: donorData.district || "",
          upazila: donorData.upazila || "",
          address: donorData.address || "",
          lastDonationDate: formattedDate || "",
          profileImage: donorData.profileImage || "",
        });
      }
    } catch (error) {
      console.error("Error fetching donor data:", error);
      toast.error("Failed to load your profile data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch donor data on component mount
  useEffect(() => {
    if (user) {
      fetchDonorData();
    }
  }, [user]);

  // Set districts and upazilas based on initial form data
  useEffect(() => {
    if (formData.division) {
      const selectedDivision = bangladeshData.divisions.find(div => div.name === formData.division);
      if (selectedDivision) {
        setDistricts(selectedDivision.districts);
        
        if (formData.district) {
          const selectedDistrict = selectedDivision.districts.find(dist => dist.name === formData.district);
          if (selectedDistrict) {
            setUpazilas(selectedDistrict.upazilas);
          }
        }
      }
    }
  }, [formData.division, formData.district]);

  useEffect(() => {
    const fetchDonorData = async () => {
      if (user) {
        try {
          console.log("Fetching donor data for user:", user.uid);
          const response = await axios.get(`http://localhost:5000/donors/user/${user.uid}`);
          console.log("Donor data response:", response.data);
          
          setDonor(response.data);
          
          // Format the date for the input field (YYYY-MM-DD)
          let formattedDate = "";
          if (response.data?.lastDonationDate) {
            const date = new Date(response.data.lastDonationDate);
            formattedDate = date.toISOString().split('T')[0];
          }
          
          setFormData({
            name: response.data?.name || user.displayName || "",
            email: response.data?.email || user.email || "",
            bloodGroup: response.data?.bloodGroup || "",
            phone: response.data?.phone || "",
            address: response.data?.address || "",
            division: response.data?.division || "",
            district: response.data?.district || "",
            upazila: response.data?.upazila || "",
            lastDonationDate: formattedDate,
            photoURL: response.data?.photoURL || user.photoURL || ""
          });
        } catch (error) {
          console.error("Error fetching donor data:", error);
          
          if (error.response && error.response.status === 404) {
            console.log("Donor not found, using user data");
            // If donor not found, use user data
            setFormData({
              name: user.displayName || "",
              email: user.email || "",
              bloodGroup: "",
              phone: "",
              address: "",
              division: "",
              district: "",
              upazila: "",
              lastDonationDate: "",
              photoURL: user.photoURL || ""
            });
            
            // Automatically create a basic donor profile for social login users
            if (user.providerData && user.providerData[0]?.providerId !== 'password') {
              console.log("Social login detected, creating basic donor profile");
              try {
                const response = await axios.post("http://localhost:5000/donors", {
                  name: user.displayName || "Anonymous User",
                  email: user.email || "",
                  uid: user.uid,
                  photoURL: user.photoURL || "",
                  createdAt: new Date()
                });
                
                console.log("Auto-created donor profile:", response.data);
                
                if (response.data && response.data.acknowledged) {
                  // Fetch the newly created donor
                  const newDonorResponse = await axios.get(`http://localhost:5000/donors/user/${user.uid}`);
                  setDonor(newDonorResponse.data);
                }
              } catch (createError) {
                console.error("Error auto-creating donor profile:", createError);
                // Don't show error to user for auto-creation
              }
            }
          } else {
            // For other errors, show a toast
            toast.error("Failed to fetch donor data. Please try again later.");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDonorData();
  }, [user]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update districts and upazilas based on division and district selection
    if (name === "division") {
      const selectedDivision = bangladeshData.divisions.find(div => div.name === value);
      setDistricts(selectedDivision ? selectedDivision.districts : []);
      setUpazilas([]);
      setFormData(prev => ({ ...prev, district: "", upazila: "" }));
    } else if (name === "district") {
      const selectedDivision = bangladeshData.divisions.find(div => div.name === formData.division);
      const selectedDistrict = selectedDivision?.districts.find(dist => dist.name === value);
      setUpazilas(selectedDistrict ? selectedDistrict.upazilas : []);
      setFormData(prev => ({ ...prev, upazila: "" }));
    }
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
      // Format the date for storage
      const updatedData = {...formData};
      if (updatedData.lastDonationDate) {
        // Create a new date object and set it to noon to avoid timezone issues
        const date = new Date(updatedData.lastDonationDate);
        date.setHours(12, 0, 0, 0);
        
        // Format the date consistently
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        updatedData.lastDonationDate = `${year}-${month}-${day}`;
      }
      
      // Ensure we have a name and email from user auth data if not provided in form
      if (!updatedData.name && user.displayName) {
        updatedData.name = user.displayName;
      }
      
      if (!updatedData.email && user.email) {
        updatedData.email = user.email;
      }
      
      // Update profile in Firebase if name or photo changed
      let firebaseUpdateSuccess = true;
      if (user.displayName !== formData.name || imageFile) {
        try {
          // In a real app, you would upload the image to storage and get URL
          // For this example, we'll just use the existing photoURL
          await updateUserProfile(formData.name, formData.photoURL);
          console.log("Firebase profile updated successfully");
        } catch (error) {
          console.error("Error updating Firebase profile:", error);
          toast.error("Failed to update Firebase profile. Please try again.");
          firebaseUpdateSuccess = false;
          // Don't throw here, continue with MongoDB update
        }
      }

      // Update donor info in MongoDB
      if (donor) {
        try {
          console.log("Updating donor with ID:", donor._id);
          console.log("Update data:", updatedData);
          
          const response = await axios.put(`http://localhost:5000/donors/${donor._id}`, {
            ...updatedData,
            uid: user.uid,
            updatedAt: new Date()
          });
          
          console.log("MongoDB update response:", response.data);
          
          if (!response.data || !response.data.acknowledged) {
            throw new Error("MongoDB update failed");
          }
          
          toast.success("Profile updated successfully!");
          setEditMode(false);
        } catch (error) {
          console.error("Error updating MongoDB donor:", error);
          toast.error("Failed to update donor information. Please try again.");
          // Don't throw here
        }
      } else {
        // Create new donor if not exists
        try {
          console.log("Creating new donor for user:", user.uid);
          console.log("Donor data:", {...updatedData, uid: user.uid});
          
          // Ensure we have the minimum required fields
          if (!updatedData.name) {
            updatedData.name = user.displayName || "Anonymous User";
          }
          
          if (!updatedData.email) {
            updatedData.email = user.email || "";
          }
          
          const response = await axios.post("http://localhost:5000/donors", {
            ...updatedData,
            uid: user.uid,
            createdAt: new Date()
          });
          
          console.log("MongoDB create response:", response.data);
          
          if (!response.data || !response.data.acknowledged) {
            throw new Error("MongoDB create failed");
          }
          
          toast.success("Donor profile created successfully!");
          setEditMode(false);
        } catch (error) {
          console.error("Error creating MongoDB donor:", error);
          toast.error("Failed to create donor profile. Please try again.");
          // Don't throw here
        }
      }
      
      // Refresh donor data
      try {
        const response = await axios.get(`http://localhost:5000/donors/user/${user.uid}`);
        setDonor(response.data);
      } catch (error) {
        console.error("Error refreshing donor data:", error);
        // Don't throw here, as the update might have been successful
      }
      
    } catch (error) {
      console.error("Error in profile update process:", error);
      toast.error(error.response?.data?.error || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Function to handle date selection
  const handleDateSelect = (date) => {
    // Create a new date object and set it to noon to avoid timezone issues
    const selectedDate = new Date(date);
    selectedDate.setHours(12, 0, 0, 0);
    
    // Format the date as YYYY-MM-DD, ensuring we get the correct day
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setFormData(prev => ({
      ...prev,
      lastDonationDate: formattedDate
    }));
    setCurrentDate(selectedDate);
    setShowDatePicker(false);
  };
  
  // Function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Function to get day of week for first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Function to navigate to previous month
  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  // Function to navigate to next month
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  // Function to check if a date is in the future
  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };
  
  // Function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // Function to check if a date is the selected date
  const isSelectedDate = (date) => {
    if (!currentDate) return false;
    return date.getDate() === currentDate.getDate() &&
           date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };
  
  // Function to handle year selection
  const handleYearSelect = (year) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setShowYearSelector(false);
  };
  
  // Function to handle month selection
  const handleMonthSelect = (month) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setShowMonthSelector(false);
  };
  
  // Function to get array of years (current year - 10 to current year)
  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 20; i--) {
      years.push(i);
    }
    return years;
  };
  
  // Function to get array of month names
  const getMonthNames = () => {
    return [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  };
  
  // Function to render the calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
    // Create calendar days
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = isFutureDate(date);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isDisabled ? 'future' : ''} ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''}`}
          onClick={() => !isDisabled && handleDateSelect(date)}
        >
          <span className="day-number">{day}</span>
          {isToday(date) && <div className="today-marker"></div>}
        </div>
      );
    }
    
    return (
      <div className="custom-calendar">
        {showYearSelector ? (
          <div className="year-selector">
            {getYearRange().map(year => (
              <div 
                key={year} 
                className={`year-item ${currentDate.getFullYear() === year ? 'active' : ''}`}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </div>
        ) : showMonthSelector ? (
          <div className="month-selector">
            {getMonthNames().map((monthName, index) => (
              <div 
                key={monthName} 
                className={`month-item ${currentDate.getMonth() === index ? 'active' : ''}`}
                onClick={() => handleMonthSelect(index)}
              >
                {monthName}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="calendar-header">
              <button 
                type="button"
                className="month-nav" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevMonth();
                }}
              >
                <FaChevronLeft />
              </button>
              <div className="current-month">
                <button 
                  type="button"
                  className="month-selector-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMonthSelector(true);
                  }}
                >
                  {monthName}
                </button>
                <span className="year-divider">/</span>
                <button 
                  type="button"
                  className="year-selector-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowYearSelector(true);
                  }}
                >
                  {year}
                </button>
              </div>
              <button 
                type="button"
                className="month-nav" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextMonth();
                }}
              >
                <FaChevronRight />
              </button>
            </div>
            <div className="calendar-weekdays">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>
            <div className="calendar-days">
              {days}
            </div>
          </>
        )}
      </div>
    );
  };
  
  // Initialize selected date when form data changes
  useEffect(() => {
    if (formData.lastDonationDate) {
      // Create a new date object and set it to noon to avoid timezone issues
      const date = new Date(formData.lastDonationDate);
      date.setHours(12, 0, 0, 0);
      setCurrentDate(date);
    }
  }, [formData.lastDonationDate]);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
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
                      className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditMode(false)} 
                      className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      <FaTimes className="mr-1" /> Cancel
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
                    {/* Profile Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <FaUser className="text-primary" /> Profile Information
                      </h3>
                      
                      {/* Name */}
                      <div className="form-group mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="name">
                          <FaIdCard className="text-primary" /> Full Name
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
                      <div className="form-group mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="email">
                          <FaEnvelope className="text-primary" /> Email
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
                      
                      {/* Phone */}
                      <div className="form-group mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="phone">
                          <FaPhone className="text-primary" /> Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-md border ${
                            editMode ? "bg-white" : "bg-gray-50"
                          } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          disabled={!editMode}
                        />
                      </div>
                      
                      {/* Blood Group */}
                      <div className="form-group mb-4">
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
                          } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
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
                      
                      {/* Last Donation Date */}
                      <div className="form-group relative z-50 mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="lastDonationDate">
                          <FaCalendarAlt className="text-primary" /> Last Donation Date
                        </label>
                        <div className="relative" ref={calendarRef}>
                          <div 
                            className={`date-input-container flex items-center w-full px-4 py-3 rounded-md border ${
                              editMode ? "bg-white cursor-pointer" : "bg-gray-50"
                            } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                            onClick={() => editMode && setShowDatePicker(!showDatePicker)}
                          >
                            <div className="flex-1">
                              {formData.lastDonationDate ? (
                                <span className="text-gray-700">
                                  {(() => {
                                    const date = new Date(formData.lastDonationDate);
                                    date.setHours(12, 0, 0, 0);
                                    return date.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    });
                                  })()}
                                </span>
                              ) : (
                                <span className="text-gray-400">Select donation date</span>
                              )}
                            </div>
                            <FaCalendarAlt className={`${editMode ? "text-primary" : "text-gray-400"}`} />
                            
                            {/* Hidden input for form submission */}
                            <input
                              type="hidden"
                              id="lastDonationDate"
                              name="lastDonationDate"
                              value={formData.lastDonationDate}
                            />
                          </div>
                          
                          {/* Custom Calendar Dropdown */}
                          {showDatePicker && editMode && (
                            <div className="calendar-dropdown">
                              {renderCalendar()}
                            </div>
                          )}
                        </div>
                        {editMode && (
                          <p className="text-xs text-gray-500 mt-1">
                            Click to select your last blood donation date
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Address Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" /> Address Information
                      </h3>
                      
                      {/* Division */}
                      <div className="form-group mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="division">
                          <FaGlobe className="text-primary" /> Division
                        </label>
                        <select
                          id="division"
                          name="division"
                          value={formData.division}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-md border ${
                            editMode ? "bg-white" : "bg-gray-50"
                          } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          disabled={!editMode}
                        >
                          <option value="">Select Division</option>
                          {bangladeshData.divisions.map((div) => (
                            <option key={div.name} value={div.name}>
                              {div.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* District */}
                      <div className="form-group mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="district">
                          <FaCity className="text-primary" /> District
                        </label>
                        <select
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-md border ${
                            editMode ? "bg-white" : "bg-gray-50"
                          } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          disabled={!editMode || !formData.division}
                        >
                          <option value="">Select District</option>
                          {districts.map((district) => (
                            <option key={district.name} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Upazila */}
                      <div className="form-group mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="upazila">
                          <FaMapPin className="text-primary" /> Upazila
                        </label>
                        <select
                          id="upazila"
                          name="upazila"
                          value={formData.upazila}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-md border ${
                            editMode ? "bg-white" : "bg-gray-50"
                          } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          disabled={!editMode || !formData.district}
                        >
                          <option value="">Select Upazila</option>
                          {upazilas.map((upazila) => (
                            <option key={upazila} value={upazila}>
                              {upazila}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Address */}
                      <div className="form-group mb-4">
                        <label className="form-label flex items-center gap-2" htmlFor="address">
                          <FaHome className="text-primary" /> Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-md border ${
                            editMode ? "bg-white" : "bg-gray-50"
                          } border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                          disabled={!editMode}
                          rows="3"
                        ></textarea>
                      </div>
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
                          {(() => {
                            // Create a new date object and set it to noon to avoid timezone issues
                            const date = new Date(donor.lastDonationDate);
                            date.setHours(12, 0, 0, 0);
                            return date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            });
                          })()}
                        </span>
                      </p>
                      
                      {/* Eligibility Status */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg inline-block">
                        <h4 className="font-bold mb-2">Next Eligible Donation Date</h4>
                        <p className="text-gray-600">
                          You can donate again after{" "}
                          <span className="font-semibold text-primary">
                            {(() => {
                              // Create a new date object and set it to noon to avoid timezone issues
                              const date = new Date(donor.lastDonationDate);
                              date.setHours(12, 0, 0, 0);
                              // Add 3 months
                              const nextDate = new Date(date);
                              nextDate.setMonth(date.getMonth() + 3);
                              return nextDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              });
                            })()}
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