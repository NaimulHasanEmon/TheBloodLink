import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import Marquee from "react-fast-marquee";
import {
  FaHandHoldingHeart,
  FaSearch,
  FaUserFriends,
  FaHeart,
  FaArrowRight,
  FaQuoteLeft,
  FaQuoteRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserCircle,
  FaTint,
  FaCode,
  FaLinkedin,
  FaGithub,
  FaGlobe
} from "react-icons/fa";
import { GiHeartOrgan, GiHealthNormal } from "react-icons/gi";
import { getDonors, getDonorByUid } from "../../utils/api";
import { formatPhoneNumber } from "../../utils/formatters";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    donors: 0,
    donations: 0,
    lives: 0,
  });
  const [userDonor, setUserDonor] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await getDonors();
        setDonors(response.data.slice(0, 6)); // Get first 6 donors for display
        setLoading(false);

        // Set some stats based on donors count
        const donorsCount = response.data.length;
        setStats({
          donors: donorsCount,
          donations: Math.floor(donorsCount * 1.8), // Estimate
          lives: Math.floor(donorsCount * 3), // Each donor saves ~3 lives
        });

        // Check if logged-in user is already a donor
        if (user) {
          try {
            const userDonorResponse = await getDonorByUid(user.uid);
            setUserDonor(userDonorResponse.data);
          } catch (error) {
            console.log("User is not a donor yet");
          }
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
        setLoading(false);
      }
    };

    fetchDonors();

    // Animate stats on scroll
    const handleScroll = () => {
      const statsSection = document.getElementById("stats-section");
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          statsSection.classList.add("animate-fade-in");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  // Blood group data for the blood type section
  const bloodGroups = [
    {
      type: "A+",
      canDonateTo: ["A+", "AB+"],
      canReceiveFrom: ["A+", "A-", "O+", "O-"],
    },
    {
      type: "A-",
      canDonateTo: ["A+", "A-", "AB+", "AB-"],
      canReceiveFrom: ["A-", "O-"],
    },
    {
      type: "B+",
      canDonateTo: ["B+", "AB+"],
      canReceiveFrom: ["B+", "B-", "O+", "O-"],
    },
    {
      type: "B-",
      canDonateTo: ["B+", "B-", "AB+", "AB-"],
      canReceiveFrom: ["B-", "O-"],
    },
    {
      type: "AB+",
      canDonateTo: ["AB+"],
      canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    {
      type: "AB-",
      canDonateTo: ["AB+", "AB-"],
      canReceiveFrom: ["A-", "B-", "AB-", "O-"],
    },
    {
      type: "O+",
      canDonateTo: ["A+", "B+", "AB+", "O+"],
      canReceiveFrom: ["O+", "O-"],
    },
    {
      type: "O-",
      canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      canReceiveFrom: ["O-"],
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Donor",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote:
        "Donating blood has become a regular part of my life. It's a simple way to make a huge impact on someone else's life.",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Blood Recipient",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      quote:
        "After my accident, I needed multiple blood transfusions. I'm alive today because strangers decided to donate blood.",
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Medical Professional",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote:
        "As a nurse, I've seen firsthand how blood donations save lives every day. It's truly a gift that keeps on giving.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className='hero-section'>
        <div className='hero-pattern'></div>
        <div className='container mx-auto px-4'>
          {/* Main Heading with Hover Effect - Moved to the top of the entire section */}
          <div className='max-w-3xl mx-auto text-center mb-4'>
            <div className='group relative overflow-hidden p-1 z-20'>
              <div className='absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-700 rounded-lg'></div>
              <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-neutral font-serif leading-tight relative z-10'>
                Donate Blood,<br />
                <span className='text-primary relative'>
                  Save Lives
                  <span className='absolute -bottom-2 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-700 ease-in-out'></span>
                </span>
              </h1>
            </div>
          </div>
          
          {/* Action Buttons - Horizontal placement above Life-Saving Impact section */}
          <div className='flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-4 mb-8'>
            {/* Find Blood Button */}
            <Link 
              to='/find-blood' 
              className='w-64 group relative overflow-hidden btn-primary px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-red-600 to-primary'
            >
              {/* Pulsing background effect */}
              <span className='absolute inset-0 bg-gradient-to-r from-red-700 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></span>
              
              {/* Animated particles */}
              <span className='absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <span className='absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full animate-float-up'></span>
                <span className='absolute top-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-float-up' style={{animationDelay: '0.3s'}}></span>
                <span className='absolute top-0 left-3/4 w-2 h-2 bg-white rounded-full animate-float-up' style={{animationDelay: '0.5s'}}></span>
                <span className='absolute top-0 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-float-up' style={{animationDelay: '0.7s'}}></span>
              </span>
              
              {/* Icon with enhanced animation */}
              <FaSearch size={20} className='text-white relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500' /> 
              
              {/* Text with glow effect */}
              <span className='font-medium relative z-10 text-white group-hover:text-white group-hover:font-bold transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'>Find Blood</span>
              
              {/* Animated border */}
              <span className='absolute inset-0 border-2 border-white/0 rounded-full group-hover:border-white/20 group-hover:scale-105 transition-all duration-500'></span>
            </Link>
            
            {/* Donor Button */}
            {!user ? (
              <Link 
                to='/signup' 
                className='w-64 relative overflow-hidden btn-outline px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 border-2 border-primary/70 group hover:border-primary'
              >
                <span className='absolute inset-0 bg-red-50 transform scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-500'></span>
                <FaHandHoldingHeart size={24} className='text-primary relative z-10 group-hover:scale-110 group-hover:text-red-700 transition-all duration-300' /> 
                <span className='font-medium relative z-10 group-hover:text-red-700 transition-colors duration-300'>Become a Donor</span>
              </Link>
            ) : userDonor ? (
              <Link 
                to='/dashboard' 
                className='w-64 relative overflow-hidden btn-outline px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 border-2 border-primary/70 group hover:border-primary'
              >
                <span className='absolute inset-0 bg-red-50 transform scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-500'></span>
                <FaUserCircle size={24} className='text-primary relative z-10 group-hover:scale-110 group-hover:text-red-700 transition-all duration-300' /> 
                <span className='font-medium relative z-10 group-hover:text-red-700 transition-colors duration-300'>My Donor Profile</span>
              </Link>
            ) : (
              <Link 
                to='/dashboard' 
                className='w-64 relative overflow-hidden btn-outline px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 border-2 border-primary/70 group hover:border-primary'
              >
                <span className='absolute inset-0 bg-red-50 transform scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-500'></span>
                <FaTint size={24} className='text-primary relative z-10 group-hover:scale-110 group-hover:text-red-700 transition-all duration-300' /> 
                <span className='font-medium relative z-10 group-hover:text-red-700 transition-colors duration-300'>Complete Donor Profile</span>
              </Link>
            )}
          </div>
          
          <div className='flex flex-col md:flex-row items-center'>
            <div className='md:w-1/2 hero-content animate-slide-up'>
              {/* Life-Saving Impact Card */}
              <div className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 mb-10 transform hover:-translate-y-1 border-l-4 border-primary overflow-hidden z-10 relative'>
                <div className='p-6 relative'>
                  {/* Decorative Elements */}
                  <div className='absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full'></div>
                  <div className='absolute -bottom-10 -left-10 w-24 h-24 rounded-full border-8 border-red-50 opacity-30'></div>
                  
                  {/* Card Content */}
                  <div className='flex items-start gap-4 relative z-10'>
                    {/* Left Icon */}
                    <div className='hidden sm:block flex-shrink-0 mt-1'>
                      <div className='w-14 h-14 rounded-full bg-red-50 flex items-center justify-center group-hover:animate-pulse transition-all duration-300'>
                        <FaHeart className='text-primary text-2xl group-hover:scale-110 transition-transform duration-300' />
                      </div>
                    </div>
                    
                    {/* Right Content */}
                    <div>
                      <h3 className='text-2xl font-bold text-neutral mb-3 relative inline-block'>
                        Life-Saving Impact
                        <span className='absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full'></span>
                      </h3>
                      <p className='text-lg text-gray-700 leading-relaxed'>
                        Your blood donation can <span className='text-primary font-bold hover:underline'>save up to 3 lives</span>. 
                        Join our community of donors and make a 
                        <span className='relative mx-1 group'>
                          <span className='relative z-10 font-semibold'>difference today</span>
                          <span className='absolute bottom-0 left-0 w-full h-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors duration-300'></span>
                        </span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='md:w-1/2 mt-10 md:mt-0 flex justify-center animate-slide-down'>
              <div className='relative'>
                <img
                  src='https://img.freepik.com/free-photo/doctor-holding-blood-donation-bag-transfusion_53876-129014.jpg'
                  alt='Blood Donation'
                  className='rounded-lg shadow-2xl max-w-full h-auto'
                  style={{ maxHeight: "500px" }}
                />
                <div className='absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg animate-pulse-slow'>
                  <div className='flex items-center gap-2'>
                    <div className='blood-group'>A+</div>
                    <div>
                      <p className='font-bold text-primary'>Urgent Need</p>
                      <p className='text-sm text-gray-600'>Low inventory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id='stats-section'
        className='py-16 bg-gradient-to-br from-red-700 via-red-600 to-red-900 text-white relative overflow-hidden'
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blood-drops-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 30C20 35.5228 16.4183 40 12 40C7.58172 40 4 35.5228 4 30C4 24.4772 12 10 12 10C12 10 20 24.4772 20 30Z" fill="#ffffff" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#blood-drops-pattern)"/>
          </svg>
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='stats-card bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-b-4 border-white rounded-xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-white/60 hover:to-white/40'>
              <div className='mb-6 flex justify-center'>
                <div className="bg-red-600 p-5 rounded-full shadow-lg">
                  <FaUserFriends className='text-white text-4xl' />
                </div>
              </div>
              <div className="bg-red-800/70 rounded-lg py-3 px-4 text-center shadow-md">
                <h3 className='text-4xl font-bold mb-1 text-white text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]'>
                  {stats.donors}+
                </h3>
                <p className='text-xl font-medium text-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'>
                  Registered Donors
                </p>
              </div>
            </div>
            <div className='stats-card bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-b-4 border-white rounded-xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-white/60 hover:to-white/40'>
              <div className='mb-6 flex justify-center'>
                <div className="bg-red-600 p-5 rounded-full shadow-lg">
                  <GiHeartOrgan className='text-white text-4xl' />
                </div>
              </div>
              <div className="bg-red-800/70 rounded-lg py-3 px-4 text-center shadow-md">
                <h3 className='text-4xl font-bold mb-1 text-white text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]'>
                  {stats.donations}+
                </h3>
                <p className='text-xl font-medium text-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'>
                  Blood Donations
                </p>
              </div>
            </div>
            <div className='stats-card bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-b-4 border-white rounded-xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-white/60 hover:to-white/40'>
              <div className='mb-6 flex justify-center'>
                <div className="bg-red-600 p-5 rounded-full shadow-lg">
                  <GiHealthNormal className='text-white text-4xl' />
                </div>
              </div>
              <div className="bg-red-800/70 rounded-lg py-3 px-4 text-center shadow-md">
                <h3 className='text-4xl font-bold mb-1 text-white text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]'>
                  {stats.lives}+
                </h3>
                <p className='text-xl font-medium text-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'>
                  Lives Saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Types Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='section-title text-center'>
            Blood Types Compatibility
          </h2>
          <p className='section-subtitle text-center'>
            Understanding blood type compatibility is crucial for successful
            transfusions. Find out which blood types are compatible with yours.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12'>
            {bloodGroups.map((group, index) => (
              <div
                key={group.type}
                className='card p-6 border-2 border-gray-100 hover:border-primary transition-all duration-300'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='flex justify-between items-center mb-4'>
                  <div className='blood-group text-2xl'>{group.type}</div>
                  <FaHeart className='text-2xl text-primary animate-beat' />
                </div>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-bold text-neutral mb-2'>
                      Can Donate To:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {group.canDonateTo.map((type) => (
                        <span key={type} className='donor-badge'>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className='font-bold text-neutral mb-2'>
                      Can Receive From:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {group.canReceiveFrom.map((type) => (
                        <span
                          key={type}
                          className='donor-badge bg-blue-100 text-donor-blue'
                        >
                          {type}
                        </span>
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
      <section className='py-16 bg-accent'>
        <div className='container mx-auto px-4'>
          <h2 className='section-title text-center'>Our Blood Donors</h2>
          <p className='section-subtitle text-center'>
            Meet our amazing blood donors who are saving lives with their
            generous donations. Join them today and become a hero.
          </p>

          {loading ? (
            <div className='flex justify-center my-12'>
              <div className='loading-blood'></div>
            </div>
          ) : (
            <div className='mt-12'>
              {donors.length > 0 ? (
                <Marquee speed={100} gradient={true} gradientWidth={50}>
                  <div className='flex gap-6 px-3'>
                    {donors.map((donor, index) => (
                      <div
                        key={donor._id}
                        className='donor-card card-hover min-w-[320px]'
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className='flex items-center gap-4 mb-4'>
                          <div className='avatar'>
                            <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-primary'>
                              <img
                                src={
                                  donor.photoURL ||
                                  "https://i.ibb.co/5GzXkwq/user.png"
                                }
                                alt={donor.name}
                                className='w-full h-full object-cover'
                              />
                            </div>
                          </div>
                          <div>
                            <h3 className='text-xl font-bold donor-name transition-colors duration-300'>
                              {donor.name}
                            </h3>
                            <div className='blood-group text-sm mt-1'>
                              {donor.bloodGroup}
                            </div>
                          </div>
                        </div>
                        <div className='space-y-2 text-gray-600 mb-4'>
                          <p className='flex items-start gap-2'>
                            <FaMapMarkerAlt className='text-primary mt-1 flex-shrink-0' />
                            <span>{donor.address}</span>
                          </p>
                          <p className='flex items-center gap-2'>
                            <FaPhoneAlt className='text-primary flex-shrink-0' />
                            <span>{formatPhoneNumber(donor.phone)}</span>
                          </p>
                        </div>
                        <div className='card-actions justify-end mt-4'>
                          <Link
                            to={`/checkout/${donor._id}`}
                            className='btn-primary px-4 py-2 rounded-full flex items-center gap-2 text-sm'
                          >
                            Contact Donor <FaArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </Marquee>
              ) : (
                <div className='text-center py-12'>
                  <div className='max-w-md mx-auto'>
                    <img
                      src='https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg'
                      alt='No donors found'
                      className='w-64 mx-auto mb-6'
                    />
                    <p className='text-xl text-gray-600 mb-6'>
                      No donors found. Be the first to register!
                    </p>
                    <Link
                      to='/signup'
                      className='btn-primary px-6 py-3 rounded-full inline-flex items-center gap-2'
                    >
                      Register Now <FaArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='section-title text-center'>What People Say</h2>
          <p className='section-subtitle text-center'>
            Hear from our donors and recipients about the impact of blood
            donation.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className='testimonial-card transform transition-transform hover:-translate-y-2'
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='avatar'>
                    <div className='w-16 h-16 rounded-full overflow-hidden'>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className='font-bold text-lg'>{testimonial.name}</h3>
                    <p className='text-sm text-gray-600'>{testimonial.role}</p>
                  </div>
                </div>
                <div className='relative'>
                  <FaQuoteLeft className='absolute top-0 left-0 text-primary/20 text-4xl' />
                  <p className='text-gray-600 relative z-10 pl-8 pr-4 py-2'>
                    {testimonial.quote}
                  </p>
                  <FaQuoteRight className='absolute bottom-0 right-0 text-primary/20 text-4xl' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-16 bg-gradient-blood text-white relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern
                id='hearts'
                x='0'
                y='0'
                width='40'
                height='40'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M20 10 Q15 0 10 10 Q0 15 10 25 L20 35 L30 25 Q40 15 30 10 Q25 0 20 10Z'
                  fill='white'
                />
              </pattern>
            </defs>
            <rect x='0' y='0' width='100%' height='100%' fill='url(#hearts)' />
          </svg>
        </div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              Ready to Save Lives?
            </h2>
            <p className='text-xl mb-8'>
              Join our community of blood donors today. Your donation can make a
              difference in someone's life. It takes just a few minutes to
              register.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link
                to='/signup'
                className='group relative overflow-hidden btn bg-white text-primary px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-white'
              >
                {/* Animated background */}
                <span className='absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500'></span>
                
                {/* Animated icon */}
                <span className='relative z-10 bg-primary text-white p-1.5 rounded-full transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300'>
                  <FaHandHoldingHeart size={16} className='group-hover:animate-pulse' />
                </span>
                
                {/* Text with underline animation */}
                <span className='font-medium relative z-10'>
                  Register as Donor
                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500'></span>
                </span>
                
                {/* Animated shine effect */}
                <span className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <span className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></span>
                </span>
              </Link>
              <Link
                to='/login'
                className='group relative overflow-hidden btn border-2 border-white text-white px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              >
                {/* Ripple effect background */}
                <span className='absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300'></span>
                
                {/* Animated circles */}
                <span className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden'>
                  <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full border-2 border-white/30 group-hover:w-[150%] group-hover:h-[150%] transition-all duration-700'></span>
                  <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full border-2 border-white/20 group-hover:w-[200%] group-hover:h-[200%] transition-all duration-1000 delay-100'></span>
                </span>
                
                {/* Animated icon */}
                <span className='relative z-10 bg-white/20 text-white p-1.5 rounded-full backdrop-blur-sm transform group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300'>
                  <FaSearch size={16} className='group-hover:animate-spin-slow' />
                </span>
                
                {/* Text with glow effect */}
                <span className='font-medium relative z-10 group-hover:text-white group-hover:font-bold transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'>
                  Find Blood
                </span>
                
                {/* Border flash effect */}
                <span className='absolute inset-0 border-2 border-white/0 rounded-full group-hover:border-white/40 group-hover:scale-105 transition-all duration-500'></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className='py-10 bg-gradient-to-b from-slate-50 to-white border-t border-gray-100'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold text-center text-neutral mb-3'>Developer</h2>
          
          <div className='max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1'>
            <div className='flex flex-col md:flex-row'>
              <div className='md:w-1/3'>
                <div className='h-full bg-primary/5 flex items-center justify-center p-6'>
                  <div className='w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden'>
                    <img 
                      src="/images/Developer.JPG" 
                      alt="Developer" 
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
              </div>
              <div className='md:w-2/3 p-6'>
                <div className='flex flex-col h-full justify-between'>
                  <div>
                    <h3 className='text-xl font-bold text-neutral mb-1'>Md. Naimul Hasan</h3>
                    <p className='text-sm text-gray-500 mb-4 flex items-center'>
                      <FaCode className='mr-2 text-primary' /> MERN Stack Developer
                    </p>
                  </div>
                  <div className='flex gap-3'>
                    <a 
                      href="https://www.linkedin.com/in/md-naimul-hasan-emon/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white'
                    >
                      <FaLinkedin size={18} />
                    </a>
                    <a 
                      href="https://github.com/NaimulHasanEmon" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white'
                    >
                      <FaGithub size={18} />
                    </a>
                    <a 
                      href="https://mdnaimulhasan.netlify.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 hover:bg-primary hover:text-white'
                    >
                      <FaGlobe size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
