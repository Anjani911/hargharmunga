// API Configuration File
// API configuration and settings handler

const API_CONFIG = {
  // Demo API Key - Should come from environment variable in production
  API_KEY: process.env.REACT_APP_API_KEY || 'demo-hgm-api-key-2024-raipur',
  
  // Base URL - Your real backend server URL
  BASE_URL: process.env.REACT_APP_API_URL || 'https://grx6djfl-5000.inc1.devtunnels.ms',
  
  // Debug mode
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true',
  
  // Mock API mode
  MOCK_API: process.env.REACT_APP_MOCK_API === 'true',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/auth/refresh',
    
    // User Details
    USER_DETAILS: '/details',
    ROOT: '/',
    
    // Dashboard Stats (will be mapped to your backend routes)
    DASHBOARD_STATS: '/dashboard/stats',
    RECENT_ACTIVITIES: '/dashboard/activities',
    
    // Plant Management
    PLANTS: '/plants',
    PLANT_BY_ID: '/plants/:id',
    PLANT_DISTRIBUTION: '/plants/distribution',
    PLANT_PHOTOS: '/plants/:id/photos',
    
    // Family Management
    FAMILIES: '/families',
    FAMILY_BY_ID: '/families/:id',
    FAMILY_MEMBERS: '/families/:id/members',
    
    // Anganwadi Centers
    ANGANWADI: '/anganwadi',
    ANGANWADI_BY_ID: '/anganwadi/:id',
    ANGANWADI_FAMILIES: '/anganwadi/:id/families',
    
    // Analytics
    ANALYTICS: '/analytics',
    REPORTS: '/reports',
    EXPORT_DATA: '/export',
    
    // File Upload
    UPLOAD_PHOTO: '/upload/photo',
    UPLOAD_DOCUMENT: '/upload/document'
  },
  
  // Request Timeout (in milliseconds)
  TIMEOUT: 30000,
  
  // Default Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Version': '1.0'
  }
};

// Export configuration
export default API_CONFIG;

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint, params = {}) => {
  let url = API_CONFIG.BASE_URL + endpoint;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Helper function to get headers with API key
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'X-API-Key': API_CONFIG.API_KEY,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
