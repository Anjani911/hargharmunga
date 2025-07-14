# 🔗 API URL Architecture - Centralized URL Management

## ✅ **CURRENT IMPLEMENTATION STATUS**

### **✅ Centralized Configuration**
All API URLs are now properly centralized in `src/config/api.js`:

```javascript
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    
    // Dashboard  
    DASHBOARD_STATS: '/dashboard/stats',
    RECENT_ACTIVITIES: '/dashboard/activities',
    
    // Plants
    PLANTS: '/plants',
    PLANT_BY_ID: '/plants/:id',
    PLANT_PHOTOS: '/plants/:id/photos',
    
    // Families
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
    EXPORT_DATA: '/export'
  }
}
```

### **✅ Helper Functions**
```javascript
// Get complete URL with parameters
export const getEndpointUrl = (endpoint, params = {}) => {
  let url = API_CONFIG.BASE_URL + endpoint;
  
  // Replace path parameters (:id, :centerId, etc.)
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Get authentication headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'X-API-Key': API_CONFIG.API_KEY,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
```

### **✅ Service Layer Usage**
All service files now import and use centralized config:

```javascript
import API_CONFIG, { getEndpointUrl } from '../config/api';

// Examples of proper usage:
class PlantService {
  async getPlantById(plantId) {
    // ✅ Correct: Using endpoint + params
    const response = await apiService.get(API_CONFIG.ENDPOINTS.PLANT_BY_ID, { id: plantId });
  }
  
  async uploadPlantPhoto(plantId, photoFile) {
    // ✅ Correct: Using helper function
    const response = await apiService.uploadFile(
      getEndpointUrl(API_CONFIG.ENDPOINTS.PLANT_PHOTOS, { id: plantId }),
      photoFile
    );
  }
}
```

### **✅ ApiService Integration**
The main apiService automatically handles URL construction:

```javascript
class ApiService {
  async get(endpoint, params = {}) {
    // ✅ Automatically constructs full URL
    const url = getEndpointUrl(endpoint, params);
    return this.request(url, { method: 'GET' });
  }
}
```

## 🎯 **BENEFITS OF THIS ARCHITECTURE**

### **1. Single Source of Truth** ✅
- All URLs defined in one place: `src/config/api.js`
- Easy to update backend URL by changing BASE_URL
- No hard-coded URLs scattered across files

### **2. Environment Flexibility** ✅
```javascript
// Development
REACT_APP_API_URL=http://localhost:3001/api

// Staging  
REACT_APP_API_URL=https://staging-api.hgm.gov.in/api

// Production
REACT_APP_API_URL=https://api.hgm.gov.in/api
```

### **3. Parameter Handling** ✅
```javascript
// ✅ Clean parameter replacement
'/plants/:id' + { id: 123 } → '/plants/123'
'/families/:id/members' + { id: 456 } → '/families/456/members'
```

### **4. Easy Maintenance** ✅
- Add new endpoint: Update `API_CONFIG.ENDPOINTS` only
- Change base URL: Update `BASE_URL` only  
- Update authentication: Update `getAuthHeaders()` only

## 🚀 **USAGE EXAMPLES**

### **Adding New Endpoint:**
```javascript
// 1. Add to config
ENDPOINTS: {
  NEW_FEATURE: '/new-feature/:id'
}

// 2. Use in service
async getNewFeature(id) {
  return await apiService.get(API_CONFIG.ENDPOINTS.NEW_FEATURE, { id });
}
```

### **Environment Configuration:**
```bash
# .env.local
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_API_KEY=your-production-key
REACT_APP_MOCK_API=false
```

## 📁 **FILE STRUCTURE**

```
src/
├── config/
│   └── api.js                 # ✅ All URLs & config here
├── services/
│   ├── apiService.js          # ✅ Uses centralized config
│   ├── authService.js         # ✅ Uses centralized config  
│   ├── dashboardService.js    # ✅ Uses centralized config
│   ├── plantService.js        # ✅ Uses centralized config
│   ├── familyService.js       # ✅ Uses centralized config
│   └── anganwadiService.js    # ✅ Uses centralized config
```

## ✅ **COMPLETION STATUS**

- ✅ **Centralized URL Configuration**
- ✅ **Helper Functions Implemented**  
- ✅ **All Services Updated**
- ✅ **Parameter Handling Working**
- ✅ **Environment Variables Support**
- ✅ **No Hard-coded URLs**
- ✅ **Clean Architecture**

**🎉 API URL Management is now completely centralized and maintainable!**
