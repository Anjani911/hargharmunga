// API Hooks - React hooks for API integration
// Custom React hooks for data fetching and state management

import { useState, useEffect, useCallback } from 'react';
import { 
  dashboardService, 
  plantService, 
  familyService, 
  anganwadiService, 
  analyticsService,
  authService 
} from '../services';

// Custom hook for dashboard data
export const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities()
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, activities, loading, error, refetch: fetchDashboardData };
};

// Custom hook for plant management
export const usePlants = (page = 1, limit = 10, filters = {}) => {
  const [plants, setPlants] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await plantService.getPlants(page, limit, filters);
      setPlants(data.plants || []);
      setPagination({
        totalCount: data.totalCount,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage
      });
    } catch (err) {
      setError(err.message);
      console.error('Plants fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const addPlant = async (plantData) => {
    const result = await plantService.addPlant(plantData);
    if (result.success) {
      fetchPlants(); // Refresh the list
    }
    return result;
  };

  const updatePlant = async (plantId, plantData) => {
    const result = await plantService.updatePlant(plantId, plantData);
    if (result.success) {
      fetchPlants(); // Refresh the list
    }
    return result;
  };

  const deletePlant = async (plantId) => {
    const result = await plantService.deletePlant(plantId);
    if (result.success) {
      fetchPlants(); // Refresh the list
    }
    return result;
  };

  return { 
    plants, 
    pagination, 
    loading, 
    error, 
    refetch: fetchPlants,
    addPlant,
    updatePlant,
    deletePlant
  };
};

// Custom hook for family management
export const useFamilies = (page = 1, limit = 10, filters = {}) => {
  const [families, setFamilies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFamilies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await familyService.getFamilies(page, limit, filters);
      setFamilies(data.families || []);
      setPagination({
        totalCount: data.totalCount,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage
      });
    } catch (err) {
      setError(err.message);
      console.error('Families fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  const addFamily = async (familyData) => {
    const result = await familyService.addFamily(familyData);
    if (result.success) {
      fetchFamilies(); // Refresh the list
    }
    return result;
  };

  const updateFamily = async (familyId, familyData) => {
    const result = await familyService.updateFamily(familyId, familyData);
    if (result.success) {
      fetchFamilies(); // Refresh the list
    }
    return result;
  };

  const deleteFamily = async (familyId) => {
    const result = await familyService.deleteFamily(familyId);
    if (result.success) {
      fetchFamilies(); // Refresh the list
    }
    return result;
  };

  return { 
    families, 
    pagination, 
    loading, 
    error, 
    refetch: fetchFamilies,
    addFamily,
    updateFamily,
    deleteFamily
  };
};

// Custom hook for anganwadi centers
export const useAnganwadiCenters = (page = 1, limit = 10, filters = {}) => {
  const [centers, setCenters] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCenters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await anganwadiService.getAnganwadiCenters(page, limit, filters);
      setCenters(data.centers || []);
      setPagination({
        totalCount: data.totalCount,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage
      });
    } catch (err) {
      setError(err.message);
      console.error('Anganwadi centers fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  return { centers, pagination, loading, error, refetch: fetchCenters };
};

// Custom hook for analytics
export const useAnalytics = (dateRange = 'month', filters = {}) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await analyticsService.getAnalyticsData(dateRange, filters);
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange, filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analyticsData, loading, error, refetch: fetchAnalytics };
};

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    const result = await authService.login(credentials);
    
    if (result.success) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await authService.logout();
    
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    
    return result;
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  return { 
    user, 
    loading, 
    isAuthenticated, 
    login, 
    logout, 
    hasPermission 
  };
};
