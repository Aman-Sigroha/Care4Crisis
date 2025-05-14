import axios from 'axios';

// Define API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://care4crisis.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Health check
  checkHealth: () => apiClient.get('/health'),
  
  // User endpoints
  login: (credentials) => apiClient.post('/api/users/login', credentials),
  register: (userData) => apiClient.post('/api/users/register', userData),
  getUserProfile: () => apiClient.get('/api/users/profile'),
  
  // Donation endpoints
  getDonations: () => apiClient.get('/api/donations'),
  createDonation: (donationData) => apiClient.post('/api/donations', donationData),
  
  // Campaign endpoints
  getCampaigns: () => apiClient.get('/api/campaigns'),
  getCampaignById: (id) => apiClient.get(`/api/campaigns/${id}`),
  
  // NGO endpoints
  getNGOs: () => apiClient.get('/api/ngos'),
  getNGOById: (id) => apiClient.get(`/api/ngos/${id}`),
  
  // Transaction endpoints
  getTransactions: () => apiClient.get('/api/transactions'),
  createTransaction: (txData) => apiClient.post('/api/transactions', txData),
};

export default apiService; 