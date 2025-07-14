// Analytics API Service
// Analytics and reports related API calls

import apiService from './apiService';
import API_CONFIG, { getEndpointUrl } from '../config/api';

class AnalyticsService {
  // Get analytics dashboard data
  async getAnalyticsData(dateRange = 'month', filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        dateRange,
        ...filters
      });

      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.ANALYTICS}?${queryParams}`);
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockAnalyticsData(dateRange, filters);
      }
    } catch (error) {
      console.log('Using demo data for analytics');
      return this.getMockAnalyticsData(dateRange, filters);
    }
  }

  // Generate reports
  async generateReport(reportType, parameters = {}) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.REPORTS, {
        reportType,
        parameters
      });
      
      if (response.success) {
        return {
          success: true,
          message: 'Report generated successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        success: false,
        message: 'Error generating report',
        error: error.message
      };
    }
  }

  // Export data
  async exportData(exportType, filters = {}) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.EXPORT_DATA, {
        exportType,
        filters
      });
      
      if (response.success) {
        return {
          success: true,
          message: 'Data export successful',
          downloadUrl: response.data.downloadUrl
        };
      } else {
        throw new Error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        success: false,
        message: 'Error exporting data',
        error: error.message
      };
    }
  }

  // Get plant distribution analytics
  async getPlantDistributionAnalytics() {
    try {
      const response = await apiService.get('/analytics/plant-distribution');
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockPlantDistributionData();
      }
    } catch (error) {
      console.log('Using demo data for plant distribution analytics');
      return this.getMockPlantDistributionData();
    }
  }

  // Get family registration trends
  async getFamilyRegistrationTrends() {
    try {
      const response = await apiService.get('/analytics/family-trends');
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockFamilyTrendsData();
      }
    } catch (error) {
      console.log('Using demo data for family registration trends');
      return this.getMockFamilyTrendsData();
    }
  }

  // Mock data for demo purposes
  getMockAnalyticsData(dateRange = 'month', filters = {}) {
    return {
      overview: {
        totalFamilies: 2847,
        totalPlants: 28470,
        activePlants: 25623,
        totalAnganwadi: 156,
        plantSurvivalRate: 90.1,
        familyParticipationRate: 94.3
      },
      trends: {
        familyRegistration: [
          { month: 'Jan', count: 234 },
          { month: 'Feb', count: 267 },
          { month: 'Mar', count: 298 },
          { month: 'Apr', count: 312 },
          { month: 'May', count: 345 },
          { month: 'Jun', count: 389 }
        ],
        plantDistribution: [
          { month: 'Jan', count: 2340 },
          { month: 'Feb', count: 2670 },
          { month: 'Mar', count: 2980 },
          { month: 'Apr', count: 3120 },
          { month: 'May', count: 3450 },
          { month: 'Jun', count: 3890 }
        ]
      },
      plantVarieties: [
        { name: 'Munga AD 1', count: 8500, percentage: 30 },
        { name: 'Munga AD 2', count: 7100, percentage: 25 },
        { name: 'Munga Diamond', count: 5700, percentage: 20 },
        { name: 'Munga Gold', count: 4270, percentage: 15 },
        { name: 'Others', count: 2900, percentage: 10 }
      ],
      anganwadiPerformance: [
        { name: 'Center 1', familyCount: 45, plantCount: 156, survivalRate: 92 },
        { name: 'Center 2', familyCount: 38, plantCount: 132, survivalRate: 88 },
        { name: 'Center 3', familyCount: 52, plantCount: 178, survivalRate: 95 },
        { name: 'Center 4', familyCount: 29, plantCount: 98, survivalRate: 91 }
      ],
      monthlyStats: {
        currentMonth: {
          newFamilies: 45,
          plantsDistributed: 234,
          photosUploaded: 156,
          plantsHarvested: 89
        },
        previousMonth: {
          newFamilies: 38,
          plantsDistributed: 198,
          photosUploaded: 142,
          plantsHarvested: 76
        }
      }
    };
  }

  getMockPlantDistributionData() {
    return {
      totalDistributed: 28470,
      currentMonthDistribution: 234,
      distributionByVariety: [
        { variety: 'Munga AD 1', count: 8500 },
        { variety: 'Munga AD 2', count: 7100 },
        { variety: 'Munga Diamond', count: 5700 },
        { variety: 'Munga Gold', count: 4270 },
        { variety: 'Others', count: 2900 }
      ],
      distributionByCenter: [
        { center: 'Center 1', count: 156 },
        { center: 'Center 2', count: 132 },
        { center: 'Center 3', count: 178 },
        { center: 'Center 4', count: 98 }
      ],
      monthlyDistribution: [
        { month: 'Jan', count: 2340 },
        { month: 'Feb', count: 2670 },
        { month: 'Mar', count: 2980 },
        { month: 'Apr', count: 3120 },
        { month: 'May', count: 3450 },
        { month: 'Jun', count: 3890 }
      ]
    };
  }

  getMockFamilyTrendsData() {
    return {
      totalRegistered: 2847,
      currentMonthRegistrations: 45,
      registrationTrends: [
        { month: 'Jan', count: 234, cumulative: 234 },
        { month: 'Feb', count: 267, cumulative: 501 },
        { month: 'Mar', count: 298, cumulative: 799 },
        { month: 'Apr', count: 312, cumulative: 1111 },
        { month: 'May', count: 345, cumulative: 1456 },
        { month: 'Jun', count: 389, cumulative: 1845 }
      ],
      familySizeDistribution: [
        { size: '1-2 Members', count: 456 },
        { size: '3-4 Members', count: 1234 },
        { size: '5-6 Members', count: 867 },
        { size: '7+ Members', count: 290 }
      ],
      activeParticipation: {
        highlyActive: 1689, // 60%
        moderatelyActive: 854, // 30%
        lowActivity: 284, // 10%
        inactive: 20 // <1%
      }
    };
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
