import { useContext, useState } from "react";
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhoneAlt, FaCommentAlt, FaMapMarkerAlt, FaTint, FaPaperPlane, FaArrowLeft, FaUserCircle } from "react-icons/fa";

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
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-accent">
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
    <div className="min-h-screen pt-20 pb-12 bg-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-neutral">Contact Donor</h1>
            <Link to="/" className="text-primary hover:text-blood-dark flex items-center gap-1">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donor Information Card */}
            <div className="card bg-white shadow-xl p-8 animate-slide-up">
              <div className="flex items-center gap-6 mb-8">
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
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
                  <h2 className="text-2xl font-bold text-neutral">{donor.name}</h2>
                  <div className="blood-group mt-2">{donor.bloodGroup}</div>
                </div>
              </div>

              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0 text-xl" />
                  <div>
                    <h3 className="font-bold text-neutral">Location</h3>
                    <p>{donor.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaPhoneAlt className="text-primary mt-1 flex-shrink-0 text-xl" />
                  <div>
                    <h3 className="font-bold text-neutral">Phone</h3>
                    <p>{donor.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-primary mt-1 flex-shrink-0 text-xl" />
                  <div>
                    <h3 className="font-bold text-neutral">Email</h3>
                    <p>{donor.email}</p>
                  </div>
                </div>

                {donor.lastDonationDate && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaTint className="text-primary mt-1 flex-shrink-0 text-xl" />
                    <div>
                      <h3 className="font-bold text-neutral">Last Donation</h3>
                      <p>{new Date(donor.lastDonationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100">
                <h3 className="font-bold text-primary mb-2">Important Note</h3>
                <p className="text-gray-700 text-sm">
                  Please be respectful when contacting donors. Only reach out if you have a genuine need for blood donation.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card bg-white shadow-xl p-8 animate-slide-down">
              <h2 className="text-2xl font-bold text-neutral mb-6">Send Message</h2>
              
              <form onSubmit={handleContactDonor} className="space-y-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Your Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Your Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhoneAlt className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your Phone Number"
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FaCommentAlt className="text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Explain your need for blood donation, including location, time, and any other relevant details."
                      className="form-input pl-10 h-32 resize-none"
                      required
                    ></textarea>
                  </div>
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
  );
};

export default CheckOut; 