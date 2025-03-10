import { useState, useEffect } from "react";
import {
  FaSearch,
  FaTint,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaArrowRight,
  FaUser,
  FaInfoCircle,
  FaCalendarAlt,
  FaCheckCircle,
  FaUndo,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { bangladeshData } from "../../data/bangladeshData";
import { searchDonors } from "../../utils/api";
import "./findblood.css"; // Import custom CSS for animations

const FindBlood = () => {
  // State for form inputs
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

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
      const selectedDivision = bangladeshData.divisions.find(
        (div) => div.name === division
      );
      if (selectedDivision) {
        setDistricts(selectedDivision.districts);
        setDistrict("");
        setUpazila("");
        setUpazilas([]);
      }
    } else {
      setDistricts([]);
      setDistrict("");
      setUpazila("");
      setUpazilas([]);
    }
  }, [division]);

  // Update upazilas when district changes
  useEffect(() => {
    if (district && districts.length > 0) {
      const selectedDistrict = districts.find((dist) => dist.name === district);
      if (selectedDistrict) {
        setUpazilas(selectedDistrict.upazilas);
      } else {
        setUpazilas([]);
      }
      setUpazila("");
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
      
      // Sort donors based on blood group match and eligibility
      const sortedDonors = response.data.sort((a, b) => {
        const isEligible = (donor) => {
          if (!donor.lastDonationDate) return false;
          const lastDonation = new Date(donor.lastDonationDate);
          const nextEligible = new Date(lastDonation);
          nextEligible.setMonth(lastDonation.getMonth() + 3);
          const today = new Date();
          return today >= nextEligible;
        };

        const aEligible = isEligible(a);
        const bEligible = isEligible(b);

        // If searching with a specific blood group
        if (bloodGroup) {
          // First priority: Exact blood group match AND eligible
          if (a.isExactMatch && aEligible && (!b.isExactMatch || !bEligible)) return -1;
          if (b.isExactMatch && bEligible && (!a.isExactMatch || !aEligible)) return 1;

          // Second priority: Exact blood group match (even if not eligible)
          if (a.isExactMatch && !b.isExactMatch) return -1;
          if (b.isExactMatch && !a.isExactMatch) return 1;

          // Third priority: Compatible blood group AND eligible
          if (!a.isExactMatch && !b.isExactMatch) {
            if (aEligible && !bEligible) return -1;
            if (bEligible && !aEligible) return 1;
          }
        } else {
          // If no specific blood group selected, sort by eligibility
          if (aEligible && !bEligible) return -1;
          if (!aEligible && bEligible) return 1;
        }
        
        // If both have same priority, sort by donation date
        if (a.lastDonationDate && b.lastDonationDate) {
          return new Date(b.lastDonationDate) - new Date(a.lastDonationDate);
        }
        
        // Push donors without donation dates to the bottom
        if (a.lastDonationDate && !b.lastDonationDate) return -1;
        if (!a.lastDonationDate && b.lastDonationDate) return 1;
        
        return 0;  // maintain original order for equal cases
      });

      setDonors(sortedDonors);

      if (sortedDonors.length === 0) {
        toast.error("No donors found matching your criteria");
      } else {
        if (bloodGroup) {
          const exactMatches = sortedDonors.filter(d => d.isExactMatch).length;
          const compatibleMatches = sortedDonors.length - exactMatches;
          
          toast.success(
            `Found ${exactMatches} exact ${bloodGroup} donor${exactMatches !== 1 ? 's' : ''} and ${compatibleMatches} compatible donor${compatibleMatches !== 1 ? 's' : ''}`
          );
        } else {
          toast.success(
            `Found ${sortedDonors.length} donors matching your criteria`
          );
        }
      }

      // First trigger the form slide
      setSearched(true);

      // Hide loading and show results container
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, 500); // Match this with the form transition duration
    } catch (error) {
      console.error("Error searching for donors:", error);
      toast.error("Failed to search for donors. Please try again.");
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
        setDivision("");
        setDistrict("");
        setUpazila("");
        setBloodGroup("");
        setDonors([]);
      }, 300); // After form has moved back to center
    }, 500); // Match with exit animation duration
  };

  return (
    <div className='min-h-screen blood-page-bg'>
      {/* Loading Overlay */}
      <div className={`loading-overlay ${loading ? "active" : ""}`}>
        <div className='loading-spinner-container'>
          <div className='relative'>
            <FaSpinner className='text-primary text-4xl animate-spin' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <FaTint className='text-primary text-sm blood-pulse' />
            </div>
          </div>
          <span className='text-gray-800 font-medium'>
            Searching for donors...
          </span>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        {/* Header section with animations */}
        <div className='text-center mb-8 md:mb-12 pt-8 md:pt-12'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4 page-title hover:text-red-600 transition-colors duration-300 cursor-default'>
            Find Blood Donors
          </h1>
          <p className='text-gray-600 max-w-2xl mx-auto mt-6 px-4 hover:text-gray-800 transition-colors duration-300 transform hover:scale-[1.01] cursor-default'>
            Search for blood donors in your area by selecting your location and
            required blood group. Our database connects you with willing donors
            to help save lives.
          </p>
        </div>

        {/* Main content */}
        <div className='content-container relative min-h-[500px] overflow-hidden px-4 lg:px-8'>
          {/* Search Form */}
          <div
            className={`search-form-container ${
              searched ? "search-form-searched" : ""
            } hover:shadow-xl transition-shadow duration-300`}
          >
            <div className='bg-white rounded-lg shadow-lg h-full hover:bg-gradient-to-br hover:from-white hover:to-red-50 transition-colors duration-500'>
              <form onSubmit={handleSubmit} className='space-y-6 p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Blood Group Selection */}
                  <div className='form-field select-field transform hover:scale-[1.02] transition-transform duration-300'>
                    <label
                      htmlFor='bloodGroup'
                      className='block text-sm font-medium text-gray-700 mb-1 group-hover:text-red-600 transition-colors duration-300'
                    >
                      Blood Group
                    </label>
                    <select
                      id='bloodGroup'
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className='w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary hover:border-red-300 transition-colors duration-300'
                    >
                      <option value=''>Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Division Selection */}
                  <div className='form-field select-field transform hover:scale-[1.02] transition-transform duration-300'>
                    <label
                      htmlFor='division'
                      className='block text-sm font-medium text-gray-700 mb-1 group-hover:text-red-600 transition-colors duration-300'
                    >
                      Division
                    </label>
                    <select
                      id='division'
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className='w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary hover:border-red-300 transition-colors duration-300'
                    >
                      <option value=''>Select Division</option>
                      {bangladeshData.divisions.map((div) => (
                        <option key={div.id} value={div.name}>
                          {div.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Selection */}
                  <div className='form-field select-field transform hover:scale-[1.02] transition-transform duration-300'>
                    <label
                      htmlFor='district'
                      className='block text-sm font-medium text-gray-700 mb-1 group-hover:text-red-600 transition-colors duration-300'
                    >
                      District
                    </label>
                    <select
                      id='district'
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className='w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary hover:border-red-300 transition-colors duration-300'
                      disabled={!division}
                    >
                      <option value=''>Select District</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.name}>
                          {dist.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila Selection */}
                  <div className='form-field select-field transform hover:scale-[1.02] transition-transform duration-300'>
                    <label
                      htmlFor='upazila'
                      className='block text-sm font-medium text-gray-700 mb-1 group-hover:text-red-600 transition-colors duration-300'
                    >
                      Upazila
                    </label>
                    <select
                      id='upazila'
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className='w-full p-3 border border-gray-300 rounded-md bg-slate-200 focus:ring-2 focus:ring-primary focus:border-primary hover:border-red-300 transition-colors duration-300'
                      disabled={!district}
                    >
                      <option value=''>Select Upazila</option>
                      {upazilas.map((upz) => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
                  <button
                    type='submit'
                    className='btn-animated btn-primary-animated px-6 py-3 rounded-md text-white font-medium flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg transition-all duration-300 relative overflow-hidden group'
                  >
                    <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></span>
                    <FaSearch className='text-sm group-hover:rotate-12 transition-transform duration-300' />
                    <span>Search Donors</span>
                  </button>
                  <button
                    type='button'
                    onClick={handleReset}
                    className='btn-animated btn-secondary-animated px-6 py-3 rounded-md text-gray-700 font-medium flex items-center justify-center gap-2 hover:text-red-600 transform hover:scale-105 hover:shadow-md transition-all duration-300'
                  >
                    <FaUndo className='text-sm group-hover:rotate-180 transition-transform duration-500' />
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Container */}
          {searched && (
            <div className='results-container-parent'>
              <div
                className={`results-wrapper ${showResults ? "visible" : ""} ${
                  isExiting ? "exiting" : ""
                }`}
              >
                <div className='bg-white rounded-lg shadow-lg p-4 md:p-6'>
                  <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-800 flex items-center'>
                      <FaTint className='text-primary mr-2' />
                      Search Results
                      <span className='ml-2 text-sm font-normal text-gray-500'>
                        ({donors.length} donors found)
                      </span>
                    </h2>
                    <button
                      onClick={handleReset}
                      className='btn-secondary-animated btn-animated px-4 py-2 rounded-full text-sm self-start md:self-auto flex items-center gap-1'
                    >
                      <FaSearch className='text-xs' /> New Search
                    </button>
                  </div>

                  {donors.length === 0 ? (
                    <div className='text-center py-12'>
                      <div className='w-20 h-20 mx-auto mb-6 opacity-25'>
                        <img
                          src='/blood-drop.svg'
                          alt='Blood Drop'
                          className='w-full h-full empty-state-icon'
                        />
                      </div>
                      <h3 className='text-2xl font-bold text-neutral mb-2'>
                        No donors found
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        We couldn't find any donors matching your search
                        criteria.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-4 max-h-[70vh] overflow-y-auto donor-results-container'>
                      {donors.map((donor) => (
                        <div
                          key={donor._id}
                          className='donor-card bg-white rounded-lg shadow-md overflow-hidden mb-4'
                        >
                          {/* Mobile Layout (hidden on desktop) */}
                          <div className='flex flex-col p-4 md:hidden'>
                            {/* Top section with image and name */}
                            <div className='flex mb-3'>
                              <div className='donor-image-container'>
                                <div className='relative'>
                                  <div className='h-14 w-14 rounded-full overflow-hidden border-2 border-primary'>
                                    {donor.photoURL ? (
                                      <img
                                        src={donor.photoURL}
                                        alt={donor.name}
                                        className='h-full w-full object-cover'
                                      />
                                    ) : (
                                      <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200'>
                                        <FaUser className='text-gray-400 text-lg' />
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Subtle pulse animation */}
                                  <div className='absolute inset-0 rounded-full border-4 border-primary opacity-30 animate-ping-slow'></div>

                                  {/* Blood Group Badge */}
                                  <div className='absolute -bottom-1 -right-1 bg-primary text-white font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white'>
                                    <span className='text-xs'>
                                      {donor.bloodGroup}
                                    </span>
                                  </div>

                                  {/* Add compatibility badge for non-exact matches */}
                                  {bloodGroup && !donor.isExactMatch && (
                                    <div className='absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md'>
                                      <span>COMP</span>
                                    </div>
                                  )}
                                </div>

                                {/* Eligibility indicator */}
                                {donor.lastDonationDate && (
                                  <div className='mt-2 text-center'>
                                    {(() => {
                                      const lastDonation = new Date(
                                        donor.lastDonationDate
                                      );
                                      const nextEligible = new Date(
                                        lastDonation
                                      );
                                      nextEligible.setMonth(
                                        lastDonation.getMonth() + 3
                                      );
                                      const today = new Date();
                                      const isEligible = today >= nextEligible;

                                      return (
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                                            isEligible
                                              ? "bg-green-100 text-green-800"
                                              : "bg-amber-100 text-amber-800"
                                          }`}
                                        >
                                          {isEligible
                                            ? "Eligible"
                                            : "Not Eligible"}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>

                              {/* Donor Name and Details */}
                              <div className='ml-3'>
                                <h3 className='donor-name text-lg font-bold text-gray-900'>
                                  {donor.name}
                                </h3>
                                {donor.upazila && donor.district && (
                                  <div className='flex items-center'>
                                    <div className='w-5 h-5 text-xs rounded-full bg-red-50 flex items-center justify-center mr-2'>
                                      <FaMapMarkerAlt className='text-primary' />
                                    </div>
                                    <span className='text-xs text-gray-700'>
                                      {[donor.upazila, donor.district]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </span>
                                  </div>
                                )}
                                {donor.lastDonationDate && (
                                  <div className='flex mt-1'>
                                    <div className='w-5 h-5 text-xs rounded-full bg-red-50 flex items-center justify-center mr-2'>
                                      <FaCalendarAlt className='text-primary' />
                                    </div>
                                    <div className='flex flex-col'>
                                      <span className='text-xs text-gray-700'>
                                        Last Donation:
                                        <br />
                                        <span className='text-xs text-red-500'>{new Date(
                                          donor.lastDonationDate
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}</span>
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bottom section - Contact Button */}
                            <div className='contact-button-container w-full'>
                              <Link
                                to={`/checkout/${donor._id}`}
                                className='contact-button bg-primary text-white px-4 py-2 rounded-md flex items-center justify-center text-sm gap-1.5 w-full'
                              >
                                Contact <FaArrowRight className='text-xs' />
                              </Link>
                            </div>
                          </div>

                          {/* Desktop Layout (hidden on mobile) */}
                          <div className='hidden md:flex items-center p-4 relative z-10 hover:bg-red-50 transition-colors duration-300 group'>
                            {/* Left: Donor Image and Blood Group with enhanced styling */}
                            <div className='flex-shrink-0 mr-4'>
                              <div className='relative transform group-hover:scale-105 transition-transform duration-300'>
                                <div className='h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-primary shadow-md group-hover:shadow-lg group-hover:border-red-500 transition-all duration-300'>
                                  {donor.photoURL ? (
                                    <img
                                      src={donor.photoURL}
                                      alt={donor.name}
                                      className='h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                                    />
                                  ) : (
                                    <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-red-50 group-hover:to-white transition-colors duration-300'>
                                      <FaUser className='text-gray-400 text-xl group-hover:text-red-400 transition-colors duration-300' />
                                    </div>
                                  )}

                                  {/* Subtle pulse animation on hover */}
                                  <div className='absolute inset-0 rounded-full border-4 border-primary opacity-0 group-hover:opacity-30 animate-ping-slow'></div>
                                </div>

                                {/* Enhanced blood group badge */}
                                <div className='absolute -bottom-1 -right-1 bg-primary text-white font-bold rounded-full h-7 w-7 flex items-center justify-center border-2 border-white shadow-md transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300'>
                                  <span className='text-xs'>
                                    {donor.bloodGroup}
                                  </span>
                                </div>

                                {/* Add compatibility badge for non-exact matches */}
                                {bloodGroup && !donor.isExactMatch && (
                                  <div className='absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md'>
                                    <span>COMP</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Middle: Donor Information with enhanced styling */}
                            <div className='donor-info flex-grow mr-4'>
                              <h3 className='donor-name text-lg font-semibold mb-1 group-hover:text-red-600 transition-colors duration-300'>
                                {donor.name}
                              </h3>
                              <div className='donor-details text-sm space-y-1'>
                                {donor.upazila && donor.district && (
                                  <div className='flex items-center'>
                                    <div className='w-5 h-5 rounded-full bg-red-50 flex items-center justify-center mr-2 group-hover:bg-red-100 transition-colors duration-300'>
                                      <FaMapMarkerAlt className='text-primary text-xs' />
                                    </div>
                                    <span className='text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
                                      {[donor.upazila, donor.district]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </span>
                                  </div>
                                )}
                                {donor.lastDonationDate && (
                                  <div className='flex items-center'>
                                    <div className='w-5 h-5 rounded-full bg-red-50 flex items-center justify-center mr-2 group-hover:bg-red-100 transition-colors duration-300'>
                                      <FaCalendarAlt className='text-primary text-xs' />
                                    </div>
                                    <span className='text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
                                      Last Donation:{" "}
                                      <span className='text-red-500 font-medium'>
                                        {new Date(
                                          donor.lastDonationDate
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </span>
                                  </div>
                                )}
                                {donor.lastDonationDate && (
                                  <div className='flex items-center'>
                                    <div className='w-5 h-5 rounded-full bg-red-50 flex items-center justify-center mr-2 group-hover:bg-red-100 transition-colors duration-300'>
                                      <FaCheckCircle className='text-primary text-xs' />
                                    </div>
                                    <span className='text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
                                      {(() => {
                                        const lastDonation = new Date(
                                          donor.lastDonationDate
                                        );
                                        const nextEligible = new Date(
                                          lastDonation
                                        );
                                        nextEligible.setMonth(
                                          lastDonation.getMonth() + 3
                                        );
                                        const today = new Date();
                                        const isEligible = today >= nextEligible;

                                        return (
                                          <span
                                            className={`${
                                              isEligible
                                                ? "text-green-600"
                                                : "text-amber-600"
                                            } font-medium`}
                                          >
                                            {isEligible
                                              ? "Eligible to donate"
                                              : "Not eligible yet"}
                                          </span>
                                        );
                                      })()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Contact Button with enhanced styling */}
                            <div className='flex-shrink-0'>
                              <Link
                                to={`/checkout/${donor._id}`}
                                className='contact-button bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md group-hover:shadow-lg transform group-hover:translate-y-[-2px] transition-all duration-300'
                              >
                                Contact
                                <FaArrowRight className='text-xs transition-transform duration-300 group-hover:translate-x-1' />
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
