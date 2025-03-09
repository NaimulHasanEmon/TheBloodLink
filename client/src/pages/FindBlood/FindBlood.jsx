import { useState, useEffect } from 'react';
import { FaSearch, FaTint, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSpinner, FaArrowRight, FaUser, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { bangladeshData } from '../../data/bangladeshData';
import { searchDonors } from '../../utils/api';
import './findblood.css'; // Import custom CSS for animations

const FindBlood = () => {
  // State for form inputs
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  
  // State for available options
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  
  // State for search results and loading
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // New state for controlling animations
  const [showResults, setShowResults] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Update districts when division changes
  useEffect(() => {
    if (division) {
      const selectedDivision = bangladeshData.divisions.find(div => div.name === division);
      if (selectedDivision) {
        setDistricts(selectedDivision.districts);
        setDistrict('');
        setUpazila('');
        setUpazilas([]);
      }
    } else {
      setDistricts([]);
      setDistrict('');
      setUpazila('');
      setUpazilas([]);
    }
  }, [division]);
  
  // Update upazilas when district changes
  useEffect(() => {
    if (district && districts.length > 0) {
      const selectedDistrict = districts.find(dist => dist.name === district);
      if (selectedDistrict) {
        setUpazilas(selectedDistrict.upazilas);
      } else {
        setUpazilas([]);
      }
      setUpazila('');
    }
  }, [district, districts]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);
    setIsExiting(false);
    
    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (division) params.division = division;
      if (district) params.district = district;
      if (upazila) params.upazila = upazila;
      
      const response = await searchDonors(params);
      setDonors(response.data);
      
      if (response.data.length === 0) {
        toast.error('No donors found matching your criteria');
      } else {
        toast.success(`Found ${response.data.length} donors matching your criteria`);
      }
      
      // First trigger the form slide
      setSearched(true);
      
      // Hide loading and show results container
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, 500); // Match this with the form transition duration
      
    } catch (error) {
      console.error('Error searching for donors:', error);
      toast.error('Failed to search for donors. Please try again.');
      setDonors([]);
      setSearched(true);
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, 500);
    }
  };
  
  // Reset form with animation
  const handleReset = () => {
    // Start exit animation for results
    setIsExiting(true);
    
    // After exit animation completes, reset everything together
    setTimeout(() => {
      // Hide results and reset form position simultaneously
      setShowResults(false);
      setIsExiting(false);
      setSearched(false);
      
      // Clear form data after animations complete
      setTimeout(() => {
        setDivision('');
        setDistrict('');
        setUpazila('');
        setBloodGroup('');
        setDonors([]);
      }, 800); // After form has moved back to center
    }, 500); // Match with exit animation duration
  };
  
  return (
    <div className="min-h-screen blood-page-bg">
      {/* Loading Overlay */}
      <div className={`loading-overlay ${loading ? 'active' : ''}`}>
        <div className="loading-spinner-container">
          <div className="relative">
            <FaSpinner className="text-primary text-4xl animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaTint className="text-primary text-sm blood-pulse" />
            </div>
          </div>
          <span className="text-gray-800 font-medium">Searching for donors...</span>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Header section with animations */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 page-title">
            Find Blood Donors
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mt-6">
            Search for blood donors in your area by selecting your location and required blood group.
            Our database connects you with willing donors to help save lives.
          </p>
        </div>
        
        {/* Main content */}
        <div className="content-container relative min-h-[500px] overflow-hidden px-4 lg:px-8">
          {/* Search Form */}
          <div className={`search-form-container ${searched ? 'search-form-searched' : ''}`}>
            <div className="bg-white rounded-lg shadow-lg h-full">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Group Selection */}
                  <div className="form-field select-field">
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Division Selection */}
                  <div className="form-field select-field">
                    <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                      Division
                    </label>
                    <select
                      id="division"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Division</option>
                      {bangladeshData.divisions.map((div) => (
                        <option key={div.id} value={div.name}>
                          {div.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* District Selection */}
                  <div className="form-field select-field">
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <select
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                      disabled={!division}
                    >
                      <option value="">Select District</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.name}>
                          {dist.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Upazila Selection */}
                  <div className="form-field select-field">
                    <label htmlFor="upazila" className="block text-sm font-medium text-gray-700 mb-1">
                      Upazila
                    </label>
                    <select
                      id="upazila"
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                      disabled={!district}
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((upz) => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                  >
                    <FaSearch /> Search Donors
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Results Container */}
          <div 
            className={`results-container ${showResults ? 'results-visible' : ''} ${isExiting ? 'results-exiting' : ''}`}
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaTint className="text-primary mr-2" /> 
                  Search Results
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({donors.length} donors found)
                  </span>
                </h2>
                <button
                  onClick={handleReset}
                  className="btn-outline px-4 py-2 rounded-full text-sm"
                >
                  New Search
                </button>
              </div>
              
              {donors.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 opacity-25">
                    <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral mb-2">No donors found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any donors matching your search criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donors.map((donor) => (
                    <div 
                      key={donor._id} 
                      className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 
                                hover:shadow-lg hover:border-primary group bg-white relative"
                    >
                      {/* Subtle background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Animated highlight line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                      
                      <div className="flex items-center p-4 relative z-10">
                        {/* Donor Image and Blood Group with enhanced styling */}
                        <div className="flex-shrink-0 mr-5">
                          <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary shadow-md">
                              {donor.photoURL ? (
                                <img src={donor.photoURL} alt={donor.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                  <FaUser className="text-gray-400 text-xl" />
                                </div>
                              )}
                              
                              {/* Subtle pulse animation on hover */}
                              <div className="absolute inset-0 rounded-full border-4 border-primary opacity-0 group-hover:opacity-30 animate-ping-slow"></div>
                            </div>
                            
                            {/* Enhanced blood group badge */}
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white font-bold rounded-full h-7 w-7 flex items-center justify-center border-2 border-white shadow-md transform group-hover:scale-110 transition-transform duration-300">
                              <span className="text-xs">{donor.bloodGroup}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Donor Info with improved typography */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-primary transition-colors duration-300">
                            {donor.name}
                          </h3>
                          
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mr-2 group-hover:bg-red-100 transition-colors duration-300">
                                <FaMapMarkerAlt className="text-primary text-xs" />
                              </div>
                              <span className="text-sm text-gray-700 font-medium">
                                {[donor.upazila, donor.district].filter(Boolean).join(", ")}
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mr-2 group-hover:bg-red-100 transition-colors duration-300">
                                <FaPhone className="text-primary text-xs" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {donor.phone}
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mr-2 group-hover:bg-red-100 transition-colors duration-300">
                                <FaCalendarAlt className="text-primary text-xs" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {donor.lastDonationDate 
                                  ? new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : "No donation record"}
                              </span>
                              
                              {/* Eligibility indicator */}
                              {donor.lastDonationDate && (() => {
                                const lastDonation = new Date(donor.lastDonationDate);
                                const nextEligible = new Date(lastDonation);
                                nextEligible.setMonth(lastDonation.getMonth() + 3);
                                const today = new Date();
                                const isEligible = today >= nextEligible;
                                
                                return (
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                    isEligible 
                                      ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
                                      : 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
                                  } transition-colors duration-300`}>
                                    {isEligible ? 'Eligible' : 'Not Eligible'}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Contact Button */}
                        <div className="ml-2">
                          <Link 
                            to={`/checkout/${donor._id}`}
                            className="relative overflow-hidden btn-primary px-4 py-2 rounded-md inline-flex items-center text-sm gap-1.5 
                                      transition-all duration-300 hover:shadow-md group-hover:shadow-lg transform group-hover:-translate-y-0.5"
                          >
                            {/* Button shine effect */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 
                                            transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                            
                            Contact <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBlood; 