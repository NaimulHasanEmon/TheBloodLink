import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTint, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { bangladeshData } from '../../data/bangladeshData';
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
    if (district) {
      const selectedDistrict = districts.find(dist => dist.name === district);
      if (selectedDistrict) {
        setUpazilas(selectedDistrict.upazilas);
        setUpazila('');
      }
    } else {
      setUpazilas([]);
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
      
      const response = await axios.get('http://localhost:5000/search', { params });
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
    <div className="min-h-screen blood-page-bg py-20">
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
                      onChange={(e) => {
                        setDivision(e.target.value);
                        setDistrict('');
                        setUpazila('');
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Division</option>
                      {bangladeshData.divisions.map((div) => (
                        <option key={div.name} value={div.name}>
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
                      disabled={!division}
                      className={`w-full p-3 border border-gray-300 rounded-md ${
                        division ? 'bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-100 cursor-not-allowed'
                      }`}
                    >
                      <option value="">Select District</option>
                      {districts.map((dist) => (
                        <option key={dist.name} value={dist.name}>
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
                      disabled={!district}
                      className={`w-full p-3 border border-gray-300 rounded-md ${
                        district ? 'bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-100 cursor-not-allowed'
                      }`}
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((upz) => (
                        <option key={upz.name} value={upz.name}>
                          {upz.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Form Buttons */}
                <div className="flex items-center justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-1/2 py-3 px-6 rounded-md flex items-center justify-center gap-2 btn-animated btn-secondary-animated"
                    disabled={loading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 px-6 rounded-md flex items-center justify-center gap-2 text-white btn-animated btn-primary-animated"
                    disabled={loading}
                  >
                    <FaSearch />
                    Search Donors
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Search Results */}
          <div 
            className={`results-container-parent transition-all duration-1000 ease-in-out ${
              showResults ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            style={{ 
              animation: isExiting 
                ? 'fadeOutToRight 500ms ease-in-out forwards' 
                : showResults 
                  ? 'fadeInFromRight 800ms ease-in-out forwards' 
                  : 'none'
            }}
          >
            <div className="results-wrapper bg-white rounded-lg shadow-lg h-full">
              <div className="flex justify-between items-center mb-6 p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaTint className="text-primary mr-2" />
                  {donors.length > 0 ? `Found ${donors.length} Donors` : 'Search Results'}
                </h2>
                {donors.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <span>New Search</span>
                  </button>
                )}
              </div>
              
              {donors.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto results-container p-6 pt-0">
                  {donors.map((donor, index) => (
                    <div 
                      key={donor._id || index} 
                      className="donor-card bg-slate-50 rounded-lg p-4 shadow-sm border border-slate-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{donor.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <FaMapMarkerAlt className="text-primary" />
                            <span>
                              {donor.upazila}, {donor.district}, {donor.division}
                            </span>
                          </div>
                        </div>
                        <div className="blood-badge bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                          {donor.bloodGroup}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-3">
                        <a
                          href={`tel:${donor.phone}`}
                          className="contact-link flex items-center gap-1 text-sm text-gray-700 hover:text-primary"
                        >
                          <FaPhone className="text-primary" />
                          <span>{donor.phone}</span>
                        </a>
                        
                        {donor.email && (
                          <a
                            href={`mailto:${donor.email}`}
                            className="contact-link flex items-center gap-1 text-sm text-gray-700 hover:text-primary"
                          >
                            <FaEnvelope className="text-primary" />
                            <span>{donor.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : showResults ? (
                <div className="text-center py-10 px-6">
                  <div className="text-5xl text-gray-300 mb-4 flex justify-center empty-state-icon">
                    <FaSearch />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Donors Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any donors matching your search criteria.
                    Try broadening your search or register as a donor to help others.
                  </p>
                  <Link
                    to="/signup"
                    className="btn-animated btn-primary-animated py-2 px-6 rounded-full inline-flex items-center gap-2 text-white"
                  >
                    Register as Donor
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBlood; 