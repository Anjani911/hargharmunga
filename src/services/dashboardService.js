// Dashboard API Service
// Dashboard specific API calls

import apiService from './apiService';
import API_CONFIG, { getEndpointUrl } from '../config/api';

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      // For demo purposes, return mock data if API call fails
      const response = await apiService.get(API_CONFIG.ENDPOINTS.DASHBOARD_STATS);
      
      if (response.success) {
        return response.data;
      } else {
        // Return demo data if API is not available
        return this.getMockDashboardStats();
      }
    } catch (error) {
      console.log('Using demo data for dashboard stats');
      return this.getMockDashboardStats();
    }
  }

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.RECENT_ACTIVITIES);
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockActivities();
      }
    } catch (error) {
      console.log('Using demo data for recent activities');
      return this.getMockActivities();
    }
  }

  // Mock data for demo purposes
  getMockDashboardStats() {
    return {
      totalAnganwadi: 156,
      totalFamilies: 2847,
      totalPlants: 28470,
      activePlants: 25623,
      monthlyGrowth: {
        anganwadi: 12,
        families: 8,
        plants: 15,
        activePlants: 5
      }
    };
  }

  getMockActivities() {
    return [
      {
        id: 1,
        type: 'plant',
        title: 'Plant distributed to Ram Kumar',
        meta: 'Today, 2:30 PM',
        status: 'success',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'photo',
        title: 'Photo uploaded by Sita Devi',
        meta: 'Yesterday, 4:15 PM',
        status: 'success',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        type: 'family',
        title: 'New family registered',
        meta: 'Yesterday, 11:20 AM',
        status: 'pending',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 4,
        type: 'plant',
        title: 'Plant care report submitted',
        meta: '2 days ago',
        status: 'success',
        timestamp: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 5,
        type: 'family',
        title: 'Family data updated',
        meta: '3 days ago',
        status: 'success',
        timestamp: new Date(Date.now() - 259200000).toISOString()
      }
    ];
  }

  // Update dashboard stats (for real-time updates)
  async updateStats() {
    return await this.getDashboardStats();
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
