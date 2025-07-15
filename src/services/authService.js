// Authentication API Service
// Login and authentication related API calls

import apiService from './apiService';
import API_CONFIG, { getEndpointUrl } from '../config/api';

class AuthService {
  // User login
  async login(credentials) {
    console.log('AuthService: Login attempt with', credentials);
    
    try {
      // Call your real backend API
      const response = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      
      if (response.success) {
        // Store authentication data from backend response
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role || 'user');
        localStorage.setItem('userName', user.name || user.username);
        localStorage.setItem('userId', user.id || user._id);
        
        console.log('AuthService: Backend login successful');
        return {
          success: true,
          message: 'Logged in successfully',
          data: response.data
        };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.log('AuthService: Backend login failed, checking demo credentials...', error.message);
      
      // Fallback to demo login for testing
      if (this.isDemoCredentials(credentials)) {
        console.log('AuthService: Using demo login as fallback');
        return this.handleDemoLogin(credentials);
      }
      
      console.error('AuthService: Login failed completely');
      return {
        success: false,
        message: 'Login error occurred',
        error: error.message
      };
    }
  }

  // User logout
  async logout() {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.LOGOUT);
      
      // Clear local storage regardless of API response
      this.clearAuthData();
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear local storage even if API call fails
      this.clearAuthData();
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  // Refresh authentication token
  async refreshToken() {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.REFRESH_TOKEN);
      
      if (response.success) {
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        return true;
      } else {
        this.clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      return false;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return !!(token && isLoggedIn === 'true');
  }

  // Get current user data
  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
      token: localStorage.getItem('authToken')
    };
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  }

  // Check if credentials are demo credentials
  isDemoCredentials(credentials) {
    const demoUsers = [
      { username: 'admin555', password: 'admin@222' },
      { username: 'supervisor', password: 'super123' },
      { username: 'demo', password: 'demo123' },
      { username: 'test', password: 'test123' },
      { username: 'hgm', password: 'hgm2024' },
      { username: 'raipur', password: 'raipur123' }
    ];

    return demoUsers.some(user => 
      user.username === credentials.username && 
      user.password === credentials.password
    );
  }

  // Handle demo login
  handleDemoLogin(credentials) {
    let userRole = 'admin';
    let userName = 'Admin Raipur';
    let userId = 'demo-001';

    if (credentials.username === 'admin555') {
      userRole = 'admin';
      userName = 'Admin Raipur';
      userId = 'demo-001';
    } else if (credentials.username === 'supervisor') {
      userRole = 'supervisor';
      userName = 'Supervisor Demo';
      userId = 'demo-002';
    } else if (credentials.username === 'demo') {
      userRole = 'user';
      userName = 'Demo User';
      userId = 'demo-003';
    } else if (credentials.username === 'test') {
      userRole = 'admin';
      userName = 'Test Admin';
      userId = 'demo-004';
    } else if (credentials.username === 'hgm') {
      userRole = 'admin';
      userName = 'HGM Administrator';
      userId = 'demo-005';
    } else if (credentials.username === 'raipur') {
      userRole = 'supervisor';
      userName = 'Raipur Supervisor';
      userId = 'demo-006';
    }

    // Generate demo token
    const demoToken = `demo-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store demo authentication data
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);

    return {
      success: true,
      message: 'Demo login successful',
      data: {
        token: demoToken,
        user: {
          id: userId,
          name: userName,
          role: userRole,
          permissions: this.getUserPermissions(userRole)
        }
      }
    };
  }

  // Get user permissions based on role
  getUserPermissions(role) {
    const permissions = {
      admin: [
        'dashboard.view',
        'families.view',
        'families.create',
        'families.edit',
        'families.delete',
        'plants.view',
        'plants.create',
        'plants.edit',
        'plants.delete',
        'anganwadi.view',
        'anganwadi.create',
        'anganwadi.edit',
        'anganwadi.delete',
        'analytics.view',
        'reports.view',
        'reports.export',
        'settings.view',
        'settings.edit'
      ],
      supervisor: [
        'dashboard.view',
        'families.view',
        'families.create',
        'families.edit',
        'plants.view',
        'plants.create',
        'plants.edit',
        'anganwadi.view',
        'anganwadi.edit',
        'analytics.view',
        'reports.view'
      ],
      user: [
        'dashboard.view',
        'families.view',
        'plants.view',
        'anganwadi.view'
      ]
    };

    return permissions[role] || permissions.user;
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions = this.getUserPermissions(user.role);
    return permissions.includes(permission);
  }

  // User registration
  async register(userData) {
    // userData should be a FormData object
    return apiService.uploadFormData('register', userData);
  }

  // Get user details
  async getUserDetails() {
    console.log('AuthService: Fetching user details');
    
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.USER_DETAILS);
      
      if (response.success) {
        console.log('AuthService: User details fetched successfully');
        return {
          success: true,
          data: response.data
        };
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('AuthService: Failed to fetch user details', error.message);
      return {
        success: false,
        message: 'Error fetching user details',
        error: error.message
      };
    }
  }

  // Test root endpoint
  async testConnection() {
    console.log('AuthService: Testing backend connection');
    
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ROOT);
      
      console.log('AuthService: Backend connection successful');
      return {
        success: true,
        message: 'Backend connection successful',
        data: response.data
      };
    } catch (error) {
      console.error('AuthService: Backend connection failed', error.message);
      return {
        success: false,
        message: 'Backend connection failed',
        error: error.message
      };
    }
  }
}

const authService = new AuthService();
export default authService;
