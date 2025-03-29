import { useState, useEffect, useContext } from 'react';
import { 
  FaUsers, 
  FaUserEdit, 
  FaSearch, 
  FaSpinner, 
  FaExclamationTriangle,
  FaChevronLeft, 
  FaChevronRight,
  FaFilter, 
  FaTint, 
  FaPhoneAlt, 
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { AuthContext } from '../../providers/AuthProvider';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    address: '',
    division: '',
    district: '',
    upazila: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Helper function to get blood group color for styling
  const getBloodGroupColor = (bloodGroup) => {
    switch (bloodGroup) {
      case 'A+': case 'A-': return 'text-red-500';
      case 'B+': case 'B-': return 'text-blue-500';
      case 'AB+': case 'AB-': return 'text-purple-500';
      case 'O+': case 'O-': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };
  
  // Helper function to get a fallback image if user's photo URL is broken
  const getProfileImage = (user, size = 'sm', noMargin = false) => {
    if (!user) return null;
    
    const sizeClasses = {
      sm: 'h-10 w-10',
      md: 'h-16 w-16',
      lg: 'h-20 w-20'
    };
    
    const marginClass = noMargin ? '' : 'mr-3';
    const imageClass = `${sizeClasses[size] || sizeClasses.sm} rounded-full object-cover ${marginClass}`;
    const placeholderClass = `${sizeClasses[size] || sizeClasses.sm} rounded-full bg-primary/70 flex items-center justify-center ${marginClass}`;
    const textClass = size === 'lg' ? 'text-xl' : 'text-sm';
    
    if (user.photoURL) {
      return (
        <img 
          src={user.photoURL} 
          alt={user.name || "User"}
          className={imageClass}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random`;
          }}
        />
      );
    }
    
    return (
      <div className={placeholderClass}>
        <span className={`text-white font-medium ${textClass}`}>
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </span>
      </div>
    );
  };

  // Fetch all users from the main /donors endpoint (not using /admin/all-users)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching all users from ${API_URL}/donors`);
        
        if (!user?.email) {
          console.error("No user email available");
          setError("User email not available. Please log in again.");
          setLoading(false);
          return;
        }
        
        // Check if the current user is an admin (hardcoded for now)
        const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
        if (!adminEmails.includes(user.email)) {
          setError("Access denied. You do not have admin privileges.");
          setLoading(false);
          return;
        }
        
        // Use the main /donors endpoint which returns all users
        // We don't use a specialized admin endpoint since all donors
        // are accessible through this single main endpoint
        const response = await axios.get(`${API_URL}/donors`);
        console.log('API response received with', response.data.length, 'users');
        
        // Mark admin users in the list and filter out deleted users
        const userData = response.data
          .filter(user => !user.isDeleted && user.status !== 'deleted')
          .map(user => {
            const isAdmin = adminEmails.includes(user.email);
            return {
              ...user,
              isAdmin
            };
          });
        
        setUsers(userData);
      } catch (err) {
        console.error('Error fetching users:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(`Failed to load users: ${err.response?.data?.error || err.message}`);
        toast.error(`Failed to load users: ${err.response?.status || ''} ${err.response?.statusText || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchUsers();
    }
  }, [user]);

  // Filter users based on search term and blood group filter
  const filteredUsers = users.filter(user => {
    const matchesSearchTerm = (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesBloodGroup = bloodGroupFilter ? user.bloodGroup === bloodGroupFilter : true;

    return matchesSearchTerm && matchesBloodGroup;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open edit modal and populate form
  const handleEditClick = (user) => {
    // Prevent editing admin users
    if (user.isAdmin) {
      toast.error("Admin users cannot be edited");
      return;
    }
    
    setSelectedUser(user);
    setUserFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bloodGroup: user.bloodGroup || '',
      address: user.address || '',
      division: user.division || '',
      district: user.district || '',
      upazila: user.upazila || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit user update using the main /donors/:id endpoint (not using /admin/update-user/:id)
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) return;

    try {
      setUpdateLoading(true);
      
      // First verify admin status
      const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
      if (!adminEmails.includes(user.email)) {
        toast.error("You don't have permission to update users");
        return;
      }
      
      // Use the standard update endpoint /donors/:id (not using /admin/update-user/:id)
      const response = await axios.put(
        `${API_URL}/donors/${selectedUser._id}`,
        userFormData
      );

      if (response.data.acknowledged) {
        // Update the local users state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === selectedUser._id ? { ...u, ...userFormData } : u
          )
        );
        toast.success('User updated successfully');
        setIsEditModalOpen(false);
      } else {
        toast.error('Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(err.response?.data?.error || 'Failed to update user');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-primary text-4xl mx-auto" />
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto" />
          <p className="mt-4 text-gray-800 font-medium">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Admin Dashboard Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white relative">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                  <FaUsers className="mr-3" /> Admin Dashboard
                </h1>
                <p className="mt-2 opacity-90">Manage users and their information</p>
              </div>
            </div>
            
            {/* Stats section */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                <p className="text-3xl font-bold text-primary/80">{users.length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Admin Users</h3>
                <p className="text-3xl font-bold text-purple-500">{users.filter(u => u.isAdmin).length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">With Blood Group</h3>
                <p className="text-3xl font-bold text-green-500">{users.filter(u => u.bloodGroup).length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">No Blood Group</h3>
                <p className="text-3xl font-bold text-amber-500">{users.filter(u => !u.bloodGroup).length}</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-md mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or address..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={bloodGroupFilter}
                    onChange={(e) => setBloodGroupFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-800 appearance-none"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 md:p-0">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                      <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentUsers.length > 0 ? (
                      currentUsers.map(user => (
                        <tr
                          key={user._id}
                          className="group hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {getProfileImage(user, 'sm', false)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                  {user.name || "Anonymous User"}
                                  {user.isAdmin && (
                                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FaEnvelope className="mr-2 text-gray-400" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-900 flex items-center">
                              <FaPhoneAlt className="mr-2 text-gray-400" />
                              {user.phone || "Not available"}
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                            {user.bloodGroup ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                <FaTint className="mr-1 text-red-500" />
                                {user.bloodGroup}
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm">None</span>
                            )}
                          </td>
                          <td className="px-2 sm:px-6 py-4 hidden md:table-cell">
                            <div className="text-sm text-gray-900 flex items-start">
                              <FaMapMarkerAlt className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <div>
                                {user.division || user.district || user.upazila || user.address ? (
                                  <div className="space-y-1">
                                    {/* Show full location hierarchy */}
                                    <div className="flex flex-col">
                                      {user.division && (
                                        <span className="font-medium">{user.division}</span>
                                      )}
                                      {user.district && (
                                        <span>{user.district}</span>
                                      )}
                                      {user.upazila && (
                                        <span className="text-gray-600 text-xs">{user.upazila}</span>
                                      )}
                                    </div>
                                    {/* Show detailed address if available */}
                                    {user.address && (
                                      <p className="text-gray-500 text-xs mt-1">{user.address}</p>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Not available</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditClick(user)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 sm:p-1.5 rounded-full hover:bg-blue-100 bg-blue-50 flex items-center justify-center"
                                title="Edit user"
                              >
                                <FaUserEdit className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredUsers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredUsers.length}</span> users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                        currentPage === 1
                          ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                        currentPage === totalPages
                          ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateUser}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit User Information</h3>
                      
                      {/* User profile image */}
                      <div className="mb-4 flex justify-center">
                        {getProfileImage(selectedUser, 'lg', true)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={userFormData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={userFormData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                            disabled // Email shouldn't be changed
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={userFormData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                          />
                        </div>
                        <div>
                          <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
                          <select
                            name="bloodGroup"
                            id="bloodGroup"
                            value={userFormData.bloodGroup}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                          >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="division" className="block text-sm font-medium text-gray-700">Division</label>
                          <input
                            type="text"
                            name="division"
                            id="division"
                            value={userFormData.division}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                          />
                        </div>
                        <div>
                          <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                          <input
                            type="text"
                            name="district"
                            id="district"
                            value={userFormData.district}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                          />
                        </div>
                        <div>
                          <label htmlFor="upazila" className="block text-sm font-medium text-gray-700">Upazila</label>
                          <input
                            type="text"
                            name="upazila"
                            id="upazila"
                            value={userFormData.upazila}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                          <textarea
                            name="address"
                            id="address"
                            rows="3"
                            value={userFormData.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-800"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update User'
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={updateLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;