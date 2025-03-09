import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTint, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { bangladeshData } from '../../data/bangladeshData';

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
    setSearched(true);
    
    try {
      // Build query parameters
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (division) params.division = division;
      if (district) params.district = district;
      if (upazila) params.upazila = upazila;
      
      // Make API request
      const response = await axios.get('http://localhost:5000/search', { params });
      setDonors(response.data);
      
      if (response.data.length === 0) {
        toast.error('No donors found matching your criteria');
      } else {
        toast.success(`Found ${response.data.length} donors matching your criteria`);
      }
    } catch (error) {
      console.error('Error searching for donors:', error);
      toast.error('Failed to search for donors. Please try again.');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form
  const handleReset = () => {
    setDivision('');
    setDistrict('');
    setUpazila('');
    setBloodGroup('');
    setDonors([]);
    setSearched(false);
  };
  
  return (
    <div className="min-h-screen bg-slate-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find Blood Donors
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search for blood donors in your area by selecting your location and required blood group.
              Our database connects you with willing donors to help save lives.
            </p>
          </div>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Division Selection */}
                <div>
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
                      <option key={div.name} value={div.name}>
                        {div.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* District Selection */}
                <div>
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
                <div>
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
                      <option key={upz} value={upz}>
                        {upz}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Blood Group Selection */}
                <div>
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
              </div>
              
              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 px-8 rounded-full flex items-center justify-center gap-2 text-white font-medium"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      <span>Search Donors</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-outline py-3 px-8 rounded-full flex items-center justify-center gap-2 font-medium"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          
          {/* Search Results */}
          {searched && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTint className="text-primary" />
                Search Results
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <FaSpinner className="text-primary text-3xl animate-spin" />
                </div>
              ) : donors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donors.map((donor) => (
                    <div key={donor._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                          <FaTint className="text-primary text-xl" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{donor.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span>
                              {[donor.upazila, donor.district, donor.division].filter(Boolean).join(', ')}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <FaPhone className="text-gray-400" />
                              <span>{donor.phone || 'No phone'}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <FaEnvelope className="text-gray-400" />
                              <span>{donor.email || 'No email'}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                              {donor.bloodGroup}
                            </span>
                            
                            <Link
                              to={`/contact-donor/${donor._id}`}
                              className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                              Contact Donor
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-5xl text-gray-300 mb-4 flex justify-center">
                    <FaTint />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Donors Found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any donors matching your search criteria.
                    Try broadening your search or register as a donor to help others.
                  </p>
                  <Link
                    to="/signup"
                    className="btn-primary py-2 px-6 rounded-full inline-flex items-center gap-2"
                  >
                    Register as Donor
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindBlood; 