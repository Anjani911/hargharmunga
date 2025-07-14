// Plant Management API Service
// Plant related API calls

import apiService from './apiService';
import API_CONFIG, { getEndpointUrl } from '../config/api';

class PlantService {
  // Get all plants with pagination
  async getPlants(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PLANTS}?${queryParams}`);
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockPlants(page, limit, filters);
      }
    } catch (error) {
      console.log('Using demo data for plants');
      return this.getMockPlants(page, limit, filters);
    }
  }

  // Get plant by ID
  async getPlantById(plantId) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.PLANT_BY_ID, { id: plantId });
      
      if (response.success) {
        return response.data;
      } else {
        return this.getMockPlantById(plantId);
      }
    } catch (error) {
      console.log('Using demo data for plant details');
      return this.getMockPlantById(plantId);
    }
  }

  // Add new plant
  async addPlant(plantData) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.PLANTS, plantData);
      
      if (response.success) {
        return {
          success: true,
          message: 'Plant added successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to add plant');
      }
    } catch (error) {
      console.error('Error adding plant:', error);
      return {
        success: false,
        message: 'Error adding plant',
        error: error.message
      };
    }
  }

  // Update plant
  async updatePlant(plantId, plantData) {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.PLANT_BY_ID, plantData, { id: plantId });
      
      if (response.success) {
        return {
          success: true,
          message: 'Plant information updated successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to update plant');
      }
    } catch (error) {
      console.error('Error updating plant:', error);
      return {
        success: false,
        message: 'Error updating plant information',
        error: error.message
      };
    }
  }

  // Delete plant
  async deletePlant(plantId) {
    try {
      const response = await apiService.delete(API_CONFIG.ENDPOINTS.PLANT_BY_ID, { id: plantId });
      
      if (response.success) {
        return {
          success: true,
          message: 'Plant deleted successfully'
        };
      } else {
        throw new Error('Failed to delete plant');
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      return {
        success: false,
        message: 'Error deleting plant',
        error: error.message
      };
    }
  }

  // Upload plant photo
  async uploadPlantPhoto(plantId, photoFile, description = '') {
    try {
      const response = await apiService.uploadFile(
        getEndpointUrl(API_CONFIG.ENDPOINTS.PLANT_PHOTOS, { id: plantId }),
        photoFile,
        { description }
      );
      
      if (response.success) {
        return {
          success: true,
          message: 'Photo uploaded successfully',
          data: response.data
        };
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      return {
        success: false,
        message: 'Error uploading photo',
        error: error.message
      };
    }
  }

  // Mock data for demo
  getMockPlants(page = 1, limit = 10, filters = {}) {
    const allPlants = [
      {
        id: 1,
        plantId: 'HGM001',
        varietyName: 'Munga Variety 1',
        familyName: 'Ram Kumar',
        familyId: 'FAM001',
        anganwadiCenter: 'Center 1',
        distributionDate: '2024-01-15',
        currentStatus: 'Healthy',
        lastPhotoDate: '2024-01-20',
        careScore: 85
      },
      {
        id: 2,
        plantId: 'HGM002',
        varietyName: 'Munga Variety 2',
        familyName: 'Sita Devi',
        familyId: 'FAM002',
        anganwadiCenter: 'Center 1',
        distributionDate: '2024-01-16',
        currentStatus: 'Healthy',
        lastPhotoDate: '2024-01-21',
        careScore: 92
      },
      {
        id: 3,
        plantId: 'HGM003',
        varietyName: 'Munga Diamond',
        familyName: 'Geeta Sharma',
        familyId: 'FAM003',
        anganwadiCenter: 'Center 2',
        distributionDate: '2024-01-17',
        currentStatus: 'Needs Care',
        lastPhotoDate: '2024-01-18',
        careScore: 65
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlants = allPlants.slice(startIndex, endIndex);

    return {
      plants: paginatedPlants,
      totalCount: allPlants.length,
      currentPage: page,
      totalPages: Math.ceil(allPlants.length / limit),
      hasNextPage: endIndex < allPlants.length,
      hasPreviousPage: page > 1
    };
  }

  getMockPlantById(plantId) {
    return {
      id: plantId,
      plantId: `HGM${plantId.toString().padStart(3, '0')}`,
      varietyName: 'Munga Variety 1',
      familyName: 'Ram Kumar',
      familyId: 'FAM001',
      anganwadiCenter: 'Center 1',
      distributionDate: '2024-01-15',
      currentStatus: 'Healthy',
      lastPhotoDate: '2024-01-20',
      careScore: 85,
      photos: [
        {
          id: 1,
          url: '/images/plant1.jpg',
          uploadDate: '2024-01-20',
          description: 'पौधे की वर्तमान स्थिति'
        }
      ],
      careHistory: [
        {
          date: '2024-01-20',
          action: 'Photo uploaded',
          status: 'Complete'
        },
        {
          date: '2024-01-18',
          action: 'Watered',
          status: 'Complete'
        }
      ]
    };
  }
}

const plantService = new PlantService();
export default plantService;
