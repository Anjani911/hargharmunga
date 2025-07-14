// API Utilities and Helper Functions
// Common utility functions for API operations

import API_CONFIG from '../config/api';

// Format date to Indian format
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format numbers to Indian locale
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  return number.toLocaleString('hi-IN');
};

// Validate phone number (Indian format)
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate Aadhar number format
export const validateAadharNumber = (aadhar) => {
  const aadharRegex = /^\d{4}-\d{4}-\d{4}$/;
  return aadharRegex.test(aadhar);
};

// Generate plant ID
export const generatePlantId = (sequence) => {
  return `HGM${sequence.toString().padStart(3, '0')}`;
};

// Generate family ID
export const generateFamilyId = (sequence) => {
  return `FAM${sequence.toString().padStart(3, '0')}`;
};

// Generate anganwadi center ID
export const generateCenterId = (sequence) => {
  return `AWC${sequence.toString().padStart(3, '0')}`;
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type for images
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPG, PNG, and WebP format files are allowed'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 5MB'
    };
  }
  
  return { isValid: true };
};

// Generate download filename
export const generateDownloadFilename = (type, date = new Date()) => {
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  
  return `HGM_${type}_${dateStr}_${timeStr}`;
};

// API error handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'AbortError') {
    return 'अनुरोध रद्द कर दिया गया';
  }
  
  if (error.message.includes('Failed to fetch')) {
    return 'सर्वर से कनेक्शन नहीं हो सका';
  }
  
  if (error.message.includes('401')) {
    return 'लॉगिन की अवधि समाप्त हो गई है';
  }
  
  if (error.message.includes('403')) {
    return 'इस कार्य की अनुमति नहीं है';
  }
  
  if (error.message.includes('404')) {
    return 'डेटा नहीं मिला';
  }
  
  if (error.message.includes('500')) {
    return 'सर्वर में त्रुटि हुई है';
  }
  
  return error.message || 'कुछ गलत हुआ है';
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Convert English numbers to Hindi
export const toHindiNumbers = (str) => {
  const englishToHindi = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  
  return str.toString().replace(/[0-9]/g, (match) => englishToHindi[match]);
};

// Get plant status color
export const getPlantStatusColor = (status) => {
  const statusColors = {
    'Healthy': '#4CAF50',
    'Needs Care': '#FF9800',
    'Sick': '#f44336',
    'New': '#2196F3',
    'Harvested': '#9C27B0'
  };
  
  return statusColors[status] || '#666';
};

// Get family status color
export const getFamilyStatusColor = (status) => {
  const statusColors = {
    'Active': '#4CAF50',
    'Pending': '#FF9800',
    'Inactive': '#f44336',
    'New': '#2196F3'
  };
  
  return statusColors[status] || '#666';
};

// Calculate plant survival rate
export const calculateSurvivalRate = (totalPlants, healthyPlants) => {
  if (!totalPlants || totalPlants === 0) return 0;
  return Math.round((healthyPlants / totalPlants) * 100);
};

// Generate report data structure
export const generateReportStructure = (type, data) => {
  const timestamp = new Date().toISOString();
  
  return {
    reportType: type,
    generatedAt: timestamp,
    generatedBy: storage.get('userName', 'Unknown User'),
    data: data,
    summary: {
      totalRecords: data.length,
      generationTime: timestamp
    }
  };
};

// Export data to CSV format
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('एक्सपोर्ट करने के लिए कोई डेटा उपलब्ध नहीं है');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
