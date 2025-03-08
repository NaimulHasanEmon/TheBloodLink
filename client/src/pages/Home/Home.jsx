import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHandHoldingHeart, FaSearch, FaUserFriends, FaHeart, FaArrowRight, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { GiHeartOrgan, GiHealthNormal } from "react-icons/gi";

const Home = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    donors: 0,
    donations: 0,
    lives: 0
  });

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/donors");
        setDonors(response.data.slice(0, 6)); // Get first 6 donors for display
        setLoading(false);
        
        // Set some stats based on donors count
        const donorsCount = response.data.length;
        setStats({
          donors: donorsCount,
          donations: Math.floor(donorsCount * 1.8), // Estimate
          lives: Math.floor(donorsCount * 3) // Each donor saves ~3 lives
        });
      } catch (error) {
        console.error("Error fetching donors:", error);
        setLoading(false);
      }
    };

    fetchDonors();
    
    // Animate stats on scroll
    const handleScroll = () => {
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          statsSection.classList.add('animate-fade-in');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blood group data for the blood type section
  const bloodGroups = [
    { type: "A+", canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
    { type: "A-", canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
    { type: "B+", canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
    { type: "B-", canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
    { type: "AB+", canDonateTo: ["AB+"], canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    { type: "AB-", canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["A-", "B-", "AB-", "O-"] },
    { type: "O+", canDonateTo: ["A+", "B+", "AB+", "O+"], canReceiveFrom: ["O+", "O-"] },
    { type: "O-", canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], canReceiveFrom: ["O-"] }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Donor",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "Donating blood has become a regular part of my life. It's a simple way to make a huge impact on someone else's life."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Blood Recipient",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      quote: "After my accident, I needed multiple blood transfusions. I'm alive today because strangers decided to donate blood."
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Medical Professional",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "As a nurse, I've seen firsthand how blood donations save lives every day. It's truly a gift that keeps on giving."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 hero-content animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral mb-4 font-serif">
                Donate Blood, <span className="text-primary">Save Lives</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Your blood donation can save up to 3 lives. Join our community of donors and make a difference today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup" className="btn-primary px-8 py-3 text-lg rounded-full flex items-center gap-2">
                  <FaHandHoldingHeart /> Become a Donor
                </Link>
                <Link to="/login" className="btn-outline px-8 py-3 text-lg rounded-full flex items-center gap-2">
                  <FaSearch /> Find Blood
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center animate-slide-down">
              <div className="relative">
                <img 
                  src="https://img.freepik.com/free-photo/doctor-holding-blood-donation-bag-transfusion_53876-129014.jpg" 
                  alt="Blood Donation" 
                  className="rounded-lg shadow-2xl max-w-full h-auto"
                  style={{ maxHeight: '500px' }}
                />
                <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg animate-pulse-slow">
                  <div className="flex items-center gap-2">
                    <div className="blood-group">A+</div>
                    <div>
                      <p className="font-bold text-primary">Urgent Need</p>
                      <p className="text-sm text-gray-600">Low inventory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-gradient-blood text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stats-card bg-white/10 backdrop-blur-sm border border-white/20 transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4 flex justify-center">
                <FaUserFriends className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stats.donors}+</h3>
              <p className="text-xl">Registered Donors</p>
            </div>
            <div className="stats-card bg-white/10 backdrop-blur-sm border border-white/20 transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4 flex justify-center">
                <GiHeartOrgan className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stats.donations}+</h3>
              <p className="text-xl">Blood Donations</p>
            </div>
            <div className="stats-card bg-white/10 backdrop-blur-sm border border-white/20 transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4 flex justify-center">
                <GiHealthNormal className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stats.lives}+</h3>
              <p className="text-xl">Lives Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Types Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Blood Types Compatibility</h2>
          <p className="section-subtitle text-center">
            Understanding blood type compatibility is crucial for successful transfusions. 
            Find out which blood types are compatible with yours.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {bloodGroups.map((group, index) => (
              <div 
                key={group.type} 
                className="card p-6 border-2 border-gray-100 hover:border-primary transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="blood-group text-2xl">{group.type}</div>
                  <FaHeart className="text-2xl text-primary animate-beat" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-neutral mb-2">Can Donate To:</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.canDonateTo.map(type => (
                        <span key={type} className="donor-badge">{type}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral mb-2">Can Receive From:</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.canReceiveFrom.map(type => (
                        <span key={type} className="donor-badge bg-blue-100 text-donor-blue">{type}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Donors Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Our Blood Donors</h2>
          <p className="section-subtitle text-center">
            Meet our amazing blood donors who are saving lives with their generous donations.
            Join them today and become a hero.
          </p>
          
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="loading-blood"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {donors.length > 0 ? (
                donors.map((donor, index) => (
                  <div 
                    key={donor._id} 
                    className="donor-card card-hover"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                          <img
                            src={
                              donor.photoURL ||
                              "https://i.ibb.co/5GzXkwq/user.png"
                            }
                            alt={donor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold donor-name transition-colors duration-300">{donor.name}</h3>
                        <div className="blood-group text-sm mt-1">{donor.bloodGroup}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-gray-600 mb-4">
                      <p className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                        <span>{donor.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaPhone className="text-primary flex-shrink-0" />
                        <span>{donor.phone}</span>
                      </p>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/checkout/${donor._id}`}
                        className="btn-primary px-4 py-2 rounded-full flex items-center gap-2 text-sm"
                      >
                        Contact Donor <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="max-w-md mx-auto">
                    <img 
                      src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg" 
                      alt="No donors found" 
                      className="w-64 mx-auto mb-6"
                    />
                    <p className="text-xl text-gray-600 mb-6">No donors found. Be the first to register!</p>
                    <Link to="/signup" className="btn-primary px-6 py-3 rounded-full inline-flex items-center gap-2">
                      Register Now <FaArrowRight />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">What People Say</h2>
          <p className="section-subtitle text-center">
            Hear from our donors and recipients about the impact of blood donation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="testimonial-card transform transition-transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="relative">
                  <FaQuoteLeft className="absolute top-0 left-0 text-primary/20 text-4xl" />
                  <p className="text-gray-600 relative z-10 pl-8 pr-4 py-2">
                    {testimonial.quote}
                  </p>
                  <FaQuoteRight className="absolute bottom-0 right-0 text-primary/20 text-4xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-blood text-white relative overflow-hidden">
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Save Lives?</h2>
            <p className="text-xl mb-8">
              Join our community of blood donors today. Your donation can make a
              difference in someone's life. It takes just a few minutes to register.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full flex items-center gap-2 text-lg font-bold">
                <FaHandHoldingHeart /> Register as Donor
              </Link>
              <Link to="/login" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full flex items-center gap-2 text-lg font-bold">
                <FaSearch /> Find Blood
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 