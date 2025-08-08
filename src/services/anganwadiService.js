// Anganwadi Center API Service
// Anganwadi center related API calls

import apiService from './apiService';
import API_CONFIG, { getEndpointUrl } from '../config/api';

class AnganwadiService {
  // Get hierarchical filter options with search support for USERS table
  async getPariyojnaList(searchTerm = '') {
    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await apiService.get(`/get-pariyojna-list-users${params}`);
      if (response.success) {
        return response;
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching pariyojna list:', error);
      return { success: false, data: [] };
    }
  }

  async getSectorList(pariyojnaName = null, searchTerm = '') {
    try {
      const params = new URLSearchParams();
      if (pariyojnaName) params.append('pariyojna_name', pariyojnaName);
      if (searchTerm) params.append('search', searchTerm);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await apiService.get(`/get-sector-list-users${queryString}`);
      if (response.success) {
        return response;
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching sector list:', error);
      return { success: false, data: [] };
    }
  }

  async getVillageList(pariyojnaName = null, sectorName = null, searchTerm = '') {
    try {
      const params = new URLSearchParams();
      if (pariyojnaName) params.append('pariyojna_name', pariyojnaName);
      if (sectorName) params.append('sector_name', sectorName);
      if (searchTerm) params.append('search', searchTerm);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await apiService.get(`/get-village-list-users${queryString}`);
      if (response.success) {
        return response;
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching village list:', error);
      return { success: false, data: [] };
    }
  }

  async getAanganwadiList(pariyojnaName = null, sectorName = null, villageName = null, searchTerm = '') {
    try {
      const params = new URLSearchParams();
      if (pariyojnaName) params.append('pariyojna_name', pariyojnaName);
      if (sectorName) params.append('sector_name', sectorName);
      if (villageName) params.append('village_name', villageName);
      if (searchTerm) params.append('search', searchTerm);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await apiService.get(`/get-aanganwadi-list-users${queryString}`);
      if (response.success) {
        return response;
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching aanganwadi list:', error);
      return { success: false, data: [] };
    }
  }

  async getAllUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.pariyojnaName) params.append('pariyojna_name', filters.pariyojnaName);
      if (filters.sectorName) params.append('sector_name', filters.sectorName);
      if (filters.villageName) params.append('village_name', filters.villageName);
      if (filters.aanganwadiKendraName) params.append('aanganwadi_kendra_name', filters.aanganwadiKendraName);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await apiService.get(`/get-filtered-users${queryString}`);
      if (response.success) {
        return response;
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, data: [] };
    }
  }

  async getFilteredUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.pariyojnaName) params.append('pariyojna_name', filters.pariyojnaName);
      if (filters.sectorName) params.append('sector_name', filters.sectorName);
      if (filters.villageName) params.append('village_name', filters.villageName);
      if (filters.aanganwadiKendraName) params.append('aanganwadi_kendra_name', filters.aanganwadiKendraName);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await apiService.get(`/get-filtered-users${queryString}`);
      if (response.success) {
        return response;
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      return { success: false, data: [] };
    }
  }
  // Get all anganwadi centers
  async getAnganwadiCenters(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.ANGANWADI}?${queryParams}`);
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockAnganwadiCenters(page, limit, filters);
      }
    } catch (error) {
      console.log('Using demo data for anganwadi centers');
      return this.getMockAnganwadiCenters(page, limit, filters);
    }
  }

  // Get anganwadi center by ID
  async getAnganwadiById(centerId) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ANGANWADI_BY_ID, { id: centerId });
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockAnganwadiById(centerId);
      }
    } catch (error) {
      console.log('Using demo data for anganwadi center details');
      return this.getMockAnganwadiById(centerId);
    }
  }

  // Add new anganwadi center
  async addAnganwadiCenter(centerData) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.ANGANWADI, centerData);
      
      if (response.success) {
        return {
          success: true,
          message: 'Anganwadi center added successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to add anganwadi center');
      }
    } catch (error) {
      console.error('Error adding anganwadi center:', error);
      return {
        success: false,
        message: 'Error adding anganwadi center',
        error: error.message
      };
    }
  }

  // Update anganwadi center
  async updateAnganwadiCenter(centerId, centerData) {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.ANGANWADI_BY_ID, centerData, { id: centerId });
      
      if (response.success) {
        return {
          success: true,
          message: 'Anganwadi center information updated successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to update anganwadi center');
      }
    } catch (error) {
      console.error('Error updating anganwadi center:', error);
      return {
        success: false,
        message: 'Error updating anganwadi center',
        error: error.message
      };
    }
  }

  // Get families assigned to anganwadi center
  async getAnganwadiFamilies(centerId) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.ANGANWADI_FAMILIES, { id: centerId });
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockAnganwadiFamilies(centerId);
      }
    } catch (error) {
      console.log('Using demo data for anganwadi families');
      return this.getMockAnganwadiFamilies(centerId);
    }
  }

  // Mock data for demo purposes
  getMockAnganwadiCenters(page = 1, limit = 10, filters = {}) {
    const allCenters = [
      {
        id: 1,
        centerId: 'AWC001',
        centerName: 'आंगनबाड़ी केंद्र 1',
        supervisorName: 'प्रिया शर्मा',
        contactNumber: '9876543220',
        address: 'ग्राम पंचायत रायपुर, मुख्य मार्ग',
        ward: 'वार्ड 1',
        totalFamilies: 45,
        activeFamilies: 42,
        totalPlants: 156,
        healthyPlants: 142,
        establishmentDate: '2020-01-15',
        status: 'सक्रिय',
        lastInspection: '2024-01-20'
      },
      {
        id: 2,
        centerId: 'AWC002',
        centerName: 'आंगनबाड़ी केंद्र 2',
        supervisorName: 'सुनीता देवी',
        contactNumber: '9876543221',
        address: 'ग्राम पंचायत रायपुर, स्कूल रोड',
        ward: 'वार्ड 2',
        totalFamilies: 38,
        activeFamilies: 35,
        totalPlants: 132,
        healthyPlants: 125,
        establishmentDate: '2020-03-10',
        status: 'सक्रिय',
        lastInspection: '2024-01-18'
      },
      {
        id: 3,
        centerId: 'AWC003',
        centerName: 'आंगनबाड़ी केंद्र 3',
        supervisorName: 'रीता कुमारी',
        contactNumber: '9876543222',
        address: 'ग्राम पंचायत रायपुर, मंदिर चौक',
        ward: 'वार्ड 3',
        totalFamilies: 52,
        activeFamilies: 48,
        totalPlants: 178,
        healthyPlants: 165,
        establishmentDate: '2019-11-20',
        status: 'सक्रिय',
        lastInspection: '2024-01-22'
      },
      {
        id: 4,
        centerId: 'AWC004',
        centerName: 'आंगनबाड़ी केंद्र 4',
        supervisorName: 'कमला देवी',
        contactNumber: '9876543223',
        address: 'ग्राम पंचायत रायपुर, बस स्टैंड के पास',
        ward: 'वार्ड 4',
        totalFamilies: 29,
        activeFamilies: 26,
        totalPlants: 98,
        healthyPlants: 89,
        establishmentDate: '2021-06-05',
        status: 'सक्रिय',
        lastInspection: '2024-01-15'
      }
    ];

    // Apply filters
    let filteredCenters = allCenters;
    if (filters.search) {
      filteredCenters = allCenters.filter(center => 
        center.centerName.includes(filters.search) ||
        center.centerId.includes(filters.search) ||
        center.supervisorName.includes(filters.search)
      );
    }
    if (filters.ward) {
      filteredCenters = filteredCenters.filter(center => 
        center.ward === filters.ward
      );
    }
    if (filters.status) {
      filteredCenters = filteredCenters.filter(center => 
        center.status === filters.status
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCenters = filteredCenters.slice(startIndex, endIndex);

    return {
      centers: paginatedCenters,
      totalCount: filteredCenters.length,
      currentPage: page,
      totalPages: Math.ceil(filteredCenters.length / limit),
      hasNextPage: endIndex < filteredCenters.length,
      hasPreviousPage: page > 1
    };
  }

  getMockAnganwadiById(centerId) {
    return {
      id: centerId,
      centerId: `AWC${centerId.toString().padStart(3, '0')}`,
      centerName: 'आंगनबाड़ी केंद्र 1',
      supervisorName: 'प्रिया शर्मा',
      contactNumber: '9876543220',
      address: 'ग्राम पंचायत रायपुर, मुख्य मार्ग',
      ward: 'वार्ड 1',
      totalFamilies: 45,
      activeFamilies: 42,
      totalPlants: 156,
      healthyPlants: 142,
      establishmentDate: '2020-01-15',
      status: 'सक्रिय',
      lastInspection: '2024-01-20',
      facilities: [
        'पोषण कार्यक्रम',
        'स्वास्थ्य जांच',
        'प्री-स्कूल शिक्षा',
        'टीकाकरण'
      ],
      workingHours: {
        openTime: '08:00',
        closeTime: '17:00',
        workingDays: 'सोमवार से शनिवार'
      },
      performance: {
        familyRegistrationRate: 93,
        plantSurvivalRate: 91,
        photoUploadCompliance: 78,
        overallScore: 87
      }
    };
  }

  getMockAnganwadiFamilies(centerId) {
    return [
      {
        id: 1,
        familyId: 'FAM001',
        headOfFamily: 'राम कुमार',
        contactNumber: '9876543210',
        totalMembers: 5,
        plantsAssigned: 2,
        status: 'सक्रिय'
      },
      {
        id: 2,
        familyId: 'FAM002',
        headOfFamily: 'सीता देवी',
        contactNumber: '9876543211',
        totalMembers: 4,
        plantsAssigned: 1,
        status: 'सक्रिय'
      },
      {
        id: 5,
        familyId: 'FAM005',
        headOfFamily: 'विकास कुमार',
        contactNumber: '9876543214',
        totalMembers: 3,
        plantsAssigned: 2,
        status: 'सक्रिय'
      }
    ];
  }
}

const anganwadiService = new AnganwadiService();

// Named exports for functions
export const getPariyojnaList = (searchTerm) => anganwadiService.getPariyojnaList(searchTerm);
export const getSectorList = (pariyojnaName, searchTerm) => anganwadiService.getSectorList(pariyojnaName, searchTerm);
export const getVillageList = (pariyojnaName, sectorName, searchTerm) => anganwadiService.getVillageList(pariyojnaName, sectorName, searchTerm);
export const getAanganwadiList = (pariyojnaName, sectorName, villageName, searchTerm) => anganwadiService.getAanganwadiList(pariyojnaName, sectorName, villageName, searchTerm);
export const getAllUsers = (filters) => anganwadiService.getAllUsers(filters);
export const getFilteredUsers = (filters) => anganwadiService.getFilteredUsers(filters);

export default anganwadiService;
