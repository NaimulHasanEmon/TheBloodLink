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
      }, 300); // After form has moved back to center
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
        <div className="text-center mb-8 md:mb-12 pt-8 md:pt-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 page-title">
            Find Blood Donors
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mt-6 px-4">
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
                    className="btn-primary-animated btn-animated px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                  >
                    <FaSearch /> Search Donors
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Results Container */}
          {searched && (
  <div className="results-container-parent">
    <div className={`results-wrapper ${showResults ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <FaTint className="text-primary mr-2" /> 
            Search Results
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({donors.length} donors found)
            </span>
          </h2>
          <button
            onClick={handleReset}
            className="btn-secondary-animated btn-animated px-4 py-2 rounded-full text-sm self-start md:self-auto flex items-center gap-1"
          >
            <FaSearch className="text-xs" /> New Search
          </button>
        </div>
        
        {donors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 opacity-25">
              <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full empty-state-icon" />
            </div>
            <h3 className="text-2xl font-bold text-neutral mb-2">No donors found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any donors matching your search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto donor-results-container">
            {donors.map((donor) => (
              <div 
                key={donor._id} 
                className="donor-card bg-white rounded-lg shadow-md overflow-hidden mb-4"
              >
                <div className="flex flex-col items-center p-4"> {/* Vertical stack for mobile */}
                  {/* Left: Donor Image with Blood Group */}
                  <div className="donor-image-container">
                    <div className="relative">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-primary">
                        {donor.photoURL ? (
                          <img src={donor.photoURL} alt={donor.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <FaUser className="text-gray-400 text-xl" />
                          </div>
                        )}
                      </div>
                      {/* Blood Group Badge */}
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white font-bold rounded-full h-7 w-7 flex items-center justify-center border-2 border-white">
                        <span className="text-xs">{donor.bloodGroup}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle: Donor Info */}
                  <div className="donor-info mt-4 text-center w-full"> {/* Added text-center and margin */}
                    <h3 className="donor-name text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {donor.name}
                    </h3>
                    
                    <div className="donor-details">
                      <div className="flex items-center justify-center mb-1">
                        <FaMapMarkerAlt className="text-primary text-xs mr-2" />
                        <span className="text-sm text-gray-700">
                          {[donor.upazila, donor.district].filter(Boolean).join(", ")}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center mb-1">
                        <FaPhone className="text-primary text-xs mr-2" />
                        <span className="text-sm text-gray-700">
                          {donor.phone}
                        </span>
                      </div>
                      
                      {donor.lastDonationDate && (
                        <div className="flex items-center justify-center">
                          <FaCalendarAlt className="text-primary text-xs mr-2" />
                          <span className="text-sm text-gray-700">
                            Last Donation: {new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {/* Eligibility indicator */}
                          {(() => {
                            const lastDonation = new Date(donor.lastDonationDate);
                            const nextEligible = new Date(lastDonation);
                            nextEligible.setMonth(lastDonation.getMonth() + 3);
                            const today = new Date();
                            const isEligible = today >= nextEligible;
                            
                            return (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                isEligible 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isEligible ? 'Eligible' : 'Not Eligible'}
                              </span>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right: Contact Button */}
                  <div className="contact-button-container mt-4 w-full"> {/* Added margin and full width */}
                    <Link 
                      to={`/checkout/${donor._id}`}
                      className="contact-button bg-primary text-white px-4 py-2 rounded-md inline-flex items-center text-sm gap-1.5 whitespace-nowrap w-full justify-center"
                    >
                      Contact <FaArrowRight className="text-xs" />
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
)}
        </div>
      </div>
    </div>
  );
};

export default FindBlood; 