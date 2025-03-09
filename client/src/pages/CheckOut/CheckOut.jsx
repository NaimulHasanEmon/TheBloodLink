import { useContext, useState } from "react";
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhoneAlt, FaCommentAlt, FaMapMarkerAlt, FaTint, FaPaperPlane, FaArrowLeft, FaUserCircle, FaCalendarAlt } from "react-icons/fa";

const CheckOut = () => {
  const donor = useLoaderData();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    message: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactDonor = (event) => {
    event.preventDefault();
    setLoading(true);

    // Here you would typically send this data to your backend
    // For now, we'll just simulate a successful contact
    setTimeout(() => {
      toast.success(`Message sent to ${donor.name}!`, {
        icon: '❤️',
        style: {
          borderRadius: '10px',
          background: '#FEE2E2',
          color: '#B91C1C',
        },
      });
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  if (!donor) {
    return (
      <div className="min-h-screen pt-5 pb-12 flex items-center justify-center bg-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 opacity-25">
              <img src="/blood-drop.svg" alt="Blood Drop" className="w-full h-full" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">Donor not found</h2>
            <p className="text-xl text-gray-600 mb-8">The donor you are looking for does not exist or has been removed.</p>
            <Link to="/" className="btn-primary px-6 py-3 rounded-full inline-flex items-center gap-2">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-5 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-neutral">Contact Donor</h1>
            <Link to="/" className="text-primary hover:text-blood-dark flex items-center gap-1 transition-colors duration-300">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donor Information Card */}
            <div className="card bg-white shadow-xl rounded-xl overflow-hidden animate-slide-up">
              <div className="bg-gradient-blood p-6 text-white relative">
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="hearts-donor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M20 10 Q15 0 10 10 Q0 15 10 25 L20 35 L30 25 Q40 15 30 10 Q25 0 20 10Z" fill="white"/>
                      </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#hearts-donor)"/>
                  </svg>
                </div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                      {donor.photoURL ? (
                        <img
                          src={donor.photoURL}
                          alt={donor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FaUserCircle className="w-full h-full text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{donor.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                        <FaTint className="mr-1" /> {donor.bloodGroup}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 text-gray-600">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0 text-xl" />
                  <div>
                    <h3 className="font-bold text-neutral">Location</h3>
                    <p>{donor.address}</p>
                    <div className="mt-1 text-sm text-gray-500">
                      {[donor.upazila, donor.district, donor.division].filter(Boolean).join(", ")}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <FaPhoneAlt className="text-primary mt-1 flex-shrink-0 text-xl" />
                  <div>
                    <h3 className="font-bold text-neutral">Phone</h3>
                    <p>{donor.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <FaEnvelope className="text-primary mt-1 flex-shrink-0 text-xl" />
                  <div>
                    <h3 className="font-bold text-neutral">Email</h3>
                    <p>{donor.email}</p>
                  </div>
                </div>

                {donor.lastDonationDate && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <FaCalendarAlt className="text-primary mt-1 flex-shrink-0 text-xl" />
                    <div>
                      <h3 className="font-bold text-neutral">Last Donation</h3>
                      <p>{new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      
                      {/* Eligibility Status */}
                      {(() => {
                        const lastDonation = new Date(donor.lastDonationDate);
                        lastDonation.setHours(12, 0, 0, 0);
                        const nextEligible = new Date(lastDonation);
                        nextEligible.setMonth(lastDonation.getMonth() + 3);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        const isEligible = today >= nextEligible;
                        
                        return (
                          <div className={`mt-2 text-sm ${isEligible ? 'text-green-600' : 'text-amber-600'}`}>
                            {isEligible ? (
                              <span className="font-medium">Eligible to donate now</span>
                            ) : (
                              <span className="font-medium">
                                Eligible after {nextEligible.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6">
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <FaTint /> Important Note
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Please be respectful when contacting donors. Only reach out if you have a genuine need for blood donation.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card bg-white shadow-xl rounded-xl overflow-hidden animate-slide-down">
              <div className="bg-gradient-to-r from-gray-100 to-white p-6 border-b">
                <h2 className="text-2xl font-bold text-neutral">Send Message</h2>
                <p className="text-gray-500 mt-1">Fill out the form below to contact this donor</p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleContactDonor} className="space-y-6">
                  {/* Name Field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Your Name
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
                        placeholder="Your Full Name"
                        className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Your Email
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
                        placeholder="your.email@example.com"
                        className="w-full h-full px-4 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Your Phone
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

                  {/* Message Field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      Message
                    </label>
                    <div className="flex h-[106px]">
                      <div className="w-12 h-full flex items-start justify-center pt-3 bg-gray-100 rounded-l-md border border-gray-300">
                        <FaCommentAlt className="text-gray-500 text-xl" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Explain your need for blood donation, including location, time, and any other relevant details."
                        className="w-full px-4 py-3 rounded-r-md border border-l-0 bg-slate-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-full"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-blood w-6 h-6"></div>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-700">
                    By sending this message, you agree to share your contact information with the donor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut; 