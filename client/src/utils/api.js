import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status code
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API functions
export const getDonors = () => api.get('/donors');
export const getDonorById = (id) => api.get(`/donors/${id}`);
export const getDonorByUid = (uid) => api.get(`/donors/user/${uid}`);
export const createDonor = (donorData) => api.post('/donors', donorData);
export const updateDonor = (id, donorData) => api.put(`/donors/${id}`, donorData);
export const searchDonors = (params) => api.get('/search', { params });

export default api; 