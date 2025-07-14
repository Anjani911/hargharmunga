// API Service - Main API communication handler
// API service handler for all API calls

import API_CONFIG, { getEndpointUrl, getAuthHeaders } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Generic request handler
  async request(url, options = {}) {
    const config = {
      timeout: this.timeout,
      headers: getAuthHeaders(),
      ...options
    };

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`API Response: ${url}`, data);
      
      return {
        success: true,
        data: data,
        status: response.status
      };
      
    } catch (error) {
      console.error(`API Error: ${url}`, error);
      
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const url = getEndpointUrl(endpoint, params);
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}, params = {}) {
    const url = getEndpointUrl(endpoint, params);
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data = {}, params = {}) {
    const url = getEndpointUrl(endpoint, params);
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint, params = {}) {
    const url = getEndpointUrl(endpoint, params);
    return this.request(url, { method: 'DELETE' });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const url = getEndpointUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const headers = { 
      'X-API-Key': API_CONFIG.API_KEY 
    };
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request(url, {
      method: 'POST',
      body: formData,
      headers: headers
    });
  }
}

// Create and export API service instance
const apiService = new ApiService();
export default apiService;
