// Family Management API Service
// Family related API calls

import apiService from './apiService';
import API_CONFIG, { getEndpointUrl } from '../config/api';

class FamilyService {
  // Get all families with pagination and filters
  async getFamilies(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.FAMILIES}?${queryParams}`);
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockFamilies(page, limit, filters);
      }
    } catch (error) {
      console.log('Using demo data for families');
      return this.getMockFamilies(page, limit, filters);
    }
  }

  // Get family by ID
  async getFamilyById(familyId) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.FAMILY_BY_ID, { id: familyId });
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockFamilyById(familyId);
      }
    } catch (error) {
      console.log('Using demo data for family details');
      return this.getMockFamilyById(familyId);
    }
  }

  // Add new family
  async addFamily(familyData) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.FAMILIES, familyData);
      
      if (response.success) {
        return {
          success: true,
          message: 'Family registered successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to add family');
      }
    } catch (error) {
      console.error('Error adding family:', error);
      return {
        success: false,
        message: 'Error in family registration',
        error: error.message
      };
    }
  }

  // Update family information
  async updateFamily(familyId, familyData) {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.FAMILY_BY_ID, familyData, { id: familyId });
      
      if (response.success) {
        return {
          success: true,
          message: 'Family information updated successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to update family');
      }
    } catch (error) {
      console.error('Error updating family:', error);
      return {
        success: false,
        message: 'Error updating family information',
        error: error.message
      };
    }
  }

  // Delete family
  async deleteFamily(familyId) {
    try {
      const response = await apiService.delete(API_CONFIG.ENDPOINTS.FAMILY_BY_ID, { id: familyId });
      
      if (response.success) {
        return {
          success: true,
          message: 'Family record deleted successfully'
        };
      } else {
        throw new Error('Failed to delete family');
      }
    } catch (error) {
      console.error('Error deleting family:', error);
      return {
        success: false,
        message: 'Error deleting family record',
        error: error.message
      };
    }
  }

  // Get family members
  async getFamilyMembers(familyId) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.FAMILY_MEMBERS, { id: familyId });
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockFamilyMembers(familyId);
      }
    } catch (error) {
      console.log('Using demo data for family members');
      return this.getMockFamilyMembers(familyId);
    }
  }

  // Mock data for demo purposes
  getMockFamilies(page = 1, limit = 10, filters = {}) {
    const allFamilies = [
      {
        id: 1,
        familyId: 'FAM001',
        headOfFamily: 'राम कुमार',
        contactNumber: '9876543210',
        address: 'ग्राम पंचायत रायपुर, वार्ड 1',
        anganwadiCenter: 'केंद्र 1',
        registrationDate: '2024-01-15',
        totalMembers: 5,
        plantsAssigned: 2,
        status: 'सक्रिय',
        lastUpdate: '2024-01-20'
      },
      {
        id: 2,
        familyId: 'FAM002',
        headOfFamily: 'सीता देवी',
        contactNumber: '9876543211',
        address: 'ग्राम पंचायत रायपुर, वार्ड 2',
        anganwadiCenter: 'केंद्र 1',
        registrationDate: '2024-01-16',
        totalMembers: 4,
        plantsAssigned: 1,
        status: 'सक्रिय',
        lastUpdate: '2024-01-21'
      },
      {
        id: 3,
        familyId: 'FAM003',
        headOfFamily: 'गीता शर्मा',
        contactNumber: '9876543212',
        address: 'ग्राम पंचायत रायपुर, वार्ड 3',
        anganwadiCenter: 'केंद्र 2',
        registrationDate: '2024-01-17',
        totalMembers: 6,
        plantsAssigned: 3,
        status: 'सक्रिय',
        lastUpdate: '2024-01-18'
      },
      {
        id: 4,
        familyId: 'FAM004',
        headOfFamily: 'मोहन लाल',
        contactNumber: '9876543213',
        address: 'ग्राम पंचायत रायपुर, वार्ड 4',
        anganwadiCenter: 'केंद्र 2',
        registrationDate: '2024-01-18',
        totalMembers: 3,
        plantsAssigned: 1,
        status: 'लंबित',
        lastUpdate: '2024-01-19'
      }
    ];

    // Apply filters
    let filteredFamilies = allFamilies;
    if (filters.search) {
      filteredFamilies = allFamilies.filter(family => 
        family.headOfFamily.includes(filters.search) ||
        family.familyId.includes(filters.search) ||
        family.contactNumber.includes(filters.search)
      );
    }
    if (filters.anganwadiCenter) {
      filteredFamilies = filteredFamilies.filter(family => 
        family.anganwadiCenter === filters.anganwadiCenter
      );
    }
    if (filters.status) {
      filteredFamilies = filteredFamilies.filter(family => 
        family.status === filters.status
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFamilies = filteredFamilies.slice(startIndex, endIndex);

    return {
      families: paginatedFamilies,
      totalCount: filteredFamilies.length,
      currentPage: page,
      totalPages: Math.ceil(filteredFamilies.length / limit),
      hasNextPage: endIndex < filteredFamilies.length,
      hasPreviousPage: page > 1
    };
  }

  getMockFamilyById(familyId) {
    return {
      id: familyId,
      familyId: `FAM${familyId.toString().padStart(3, '0')}`,
      headOfFamily: 'राम कुमार',
      contactNumber: '9876543210',
      address: 'ग्राम पंचायत रायपुर, वार्ड 1',
      anganwadiCenter: 'केंद्र 1',
      registrationDate: '2024-01-15',
      totalMembers: 5,
      plantsAssigned: 2,
      status: 'सक्रिय',
      lastUpdate: '2024-01-20',
      members: [
        {
          id: 1,
          name: 'राम कुमार',
          relation: 'मुखिया',
          age: 45,
          gender: 'पुरुष'
        },
        {
          id: 2,
          name: 'गीता देवी',
          relation: 'पत्नी',
          age: 40,
          gender: 'महिला'
        },
        {
          id: 3,
          name: 'अमित कुमार',
          relation: 'पुत्र',
          age: 20,
          gender: 'पुरुष'
        }
      ],
      plants: [
        {
          id: 1,
          plantId: 'HGM001',
          varietyName: 'मुंगा एडी 1',
          distributionDate: '2024-01-15',
          status: 'स्वस्थ'
        },
        {
          id: 2,
          plantId: 'HGM002',
          varietyName: 'मुंगा एडी 2',
          distributionDate: '2024-01-16',
          status: 'स्वस्थ'
        }
      ]
    };
  }

  getMockFamilyMembers(familyId) {
    return [
      {
        id: 1,
        name: 'राम कुमार',
        relation: 'मुखिया',
        age: 45,
        gender: 'पुरुष',
        aadharNumber: '1234-5678-9012'
      },
      {
        id: 2,
        name: 'गीता देवी',
        relation: 'पत्नी',
        age: 40,
        gender: 'महिला',
        aadharNumber: '1234-5678-9013'
      },
      {
        id: 3,
        name: 'अमित कुमार',
        relation: 'पुत्र',
        age: 20,
        gender: 'पुरुष',
        aadharNumber: '1234-5678-9014'
      }
    ];
  }
}

const familyService = new FamilyService();
export default familyService;
