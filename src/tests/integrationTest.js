// Integration Test Suite for HGM Admin Panel
// Basic integration tests to verify API connectivity

import { 
  authService, 
  dashboardService, 
  plantService, 
  familyService, 
  anganwadiService, 
  analyticsService 
} from '../services';

class IntegrationTest {
  constructor() {
    this.results = [];
    this.isRunning = false;
  }

  log(test, status, message = '') {
    const result = {
      test,
      status, // 'PASS', 'FAIL', 'SKIP'
      message,
      timestamp: new Date().toISOString()
    };
    
    this.results.push(result);
    console.log(`[${status}] ${test}: ${message}`);
    
    return result;
  }

  async runAllTests() {
    if (this.isRunning) {
      console.log('Tests are already running...');
      return;
    }

    this.isRunning = true;
    this.results = [];
    
    console.log('🚀 Starting HGM Admin Panel Integration Tests...');
    console.log('=' .repeat(60));

    try {
      await this.testAuthentication();
      await this.testDashboardServices();
      await this.testPlantServices();
      await this.testFamilyServices();
      await this.testAnganwadiServices();
      await this.testAnalyticsServices();
      
      this.generateReport();
      
    } catch (error) {
      console.error('Test suite failed:', error);
      this.log('TEST_SUITE', 'FAIL', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  async testAuthentication() {
    console.log('\n📝 Testing Authentication Services...');
    
    try {
      // Test demo login
      const loginResult = await authService.login({
        username: 'admin',
        password: 'admin123'
      });
      
      if (loginResult.success) {
        this.log('AUTH_LOGIN', 'PASS', 'Demo login successful');
      } else {
        this.log('AUTH_LOGIN', 'FAIL', loginResult.message);
      }

      // Test authentication check
      const isAuth = authService.isAuthenticated();
      if (isAuth) {
        this.log('AUTH_CHECK', 'PASS', 'Authentication check working');
      } else {
        this.log('AUTH_CHECK', 'FAIL', 'Authentication check failed');
      }

      // Test user data
      const userData = authService.getCurrentUser();
      if (userData && userData.name) {
        this.log('AUTH_USER_DATA', 'PASS', `User: ${userData.name}`);
      } else {
        this.log('AUTH_USER_DATA', 'FAIL', 'User data not available');
      }

      // Test permissions
      const hasPermission = authService.hasPermission('dashboard.view');
      if (hasPermission) {
        this.log('AUTH_PERMISSIONS', 'PASS', 'Permission system working');
      } else {
        this.log('AUTH_PERMISSIONS', 'FAIL', 'Permission system not working');
      }

    } catch (error) {
      this.log('AUTH_SERVICE', 'FAIL', error.message);
    }
  }

  async testDashboardServices() {
    console.log('\n📊 Testing Dashboard Services...');
    
    try {
      // Test dashboard stats
      const stats = await dashboardService.getDashboardStats();
      if (stats && stats.totalFamilies) {
        this.log('DASHBOARD_STATS', 'PASS', `Stats loaded: ${stats.totalFamilies} families`);
      } else {
        this.log('DASHBOARD_STATS', 'FAIL', 'Stats not loaded');
      }

      // Test recent activities
      const activities = await dashboardService.getRecentActivities();
      if (activities && Array.isArray(activities) && activities.length > 0) {
        this.log('DASHBOARD_ACTIVITIES', 'PASS', `${activities.length} activities loaded`);
      } else {
        this.log('DASHBOARD_ACTIVITIES', 'FAIL', 'Activities not loaded');
      }

    } catch (error) {
      this.log('DASHBOARD_SERVICE', 'FAIL', error.message);
    }
  }

  async testPlantServices() {
    console.log('\n🌱 Testing Plant Services...');
    
    try {
      // Test get plants
      const plantsData = await plantService.getPlants(1, 5);
      if (plantsData && plantsData.plants && plantsData.plants.length > 0) {
        this.log('PLANTS_GET', 'PASS', `${plantsData.plants.length} plants loaded`);
      } else {
        this.log('PLANTS_GET', 'FAIL', 'Plants not loaded');
      }

      // Test get plant by ID
      const plantDetail = await plantService.getPlantById(1);
      if (plantDetail && plantDetail.plantId) {
        this.log('PLANT_DETAIL', 'PASS', `Plant ${plantDetail.plantId} loaded`);
      } else {
        this.log('PLANT_DETAIL', 'FAIL', 'Plant detail not loaded');
      }

    } catch (error) {
      this.log('PLANT_SERVICE', 'FAIL', error.message);
    }
  }

  async testFamilyServices() {
    console.log('\n👨‍👩‍👧‍👦 Testing Family Services...');
    
    try {
      // Test get families
      const familiesData = await familyService.getFamilies(1, 5);
      if (familiesData && familiesData.families && familiesData.families.length > 0) {
        this.log('FAMILIES_GET', 'PASS', `${familiesData.families.length} families loaded`);
      } else {
        this.log('FAMILIES_GET', 'FAIL', 'Families not loaded');
      }

      // Test get family by ID
      const familyDetail = await familyService.getFamilyById(1);
      if (familyDetail && familyDetail.familyId) {
        this.log('FAMILY_DETAIL', 'PASS', `Family ${familyDetail.familyId} loaded`);
      } else {
        this.log('FAMILY_DETAIL', 'FAIL', 'Family detail not loaded');
      }

    } catch (error) {
      this.log('FAMILY_SERVICE', 'FAIL', error.message);
    }
  }

  async testAnganwadiServices() {
    console.log('\n🏫 Testing Anganwadi Services...');
    
    try {
      // Test get centers
      const centersData = await anganwadiService.getAnganwadiCenters(1, 5);
      if (centersData && centersData.centers && centersData.centers.length > 0) {
        this.log('ANGANWADI_GET', 'PASS', `${centersData.centers.length} centers loaded`);
      } else {
        this.log('ANGANWADI_GET', 'FAIL', 'Centers not loaded');
      }

      // Test get center by ID
      const centerDetail = await anganwadiService.getAnganwadiById(1);
      if (centerDetail && centerDetail.centerId) {
        this.log('ANGANWADI_DETAIL', 'PASS', `Center ${centerDetail.centerId} loaded`);
      } else {
        this.log('ANGANWADI_DETAIL', 'FAIL', 'Center detail not loaded');
      }

    } catch (error) {
      this.log('ANGANWADI_SERVICE', 'FAIL', error.message);
    }
  }

  async testAnalyticsServices() {
    console.log('\n📈 Testing Analytics Services...');
    
    try {
      // Test analytics data
      const analyticsData = await analyticsService.getAnalyticsData();
      if (analyticsData && analyticsData.overview) {
        this.log('ANALYTICS_DATA', 'PASS', 'Analytics data loaded');
      } else {
        this.log('ANALYTICS_DATA', 'FAIL', 'Analytics data not loaded');
      }

      // Test plant distribution data
      const plantDistribution = await analyticsService.getPlantDistributionAnalytics();
      if (plantDistribution && plantDistribution.totalDistributed) {
        this.log('ANALYTICS_DISTRIBUTION', 'PASS', 'Distribution data loaded');
      } else {
        this.log('ANALYTICS_DISTRIBUTION', 'FAIL', 'Distribution data not loaded');
      }

    } catch (error) {
      this.log('ANALYTICS_SERVICE', 'FAIL', error.message);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 INTEGRATION TEST REPORT');
    console.log('='.repeat(60));

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;
    const total = this.results.length;

    console.log(`\n📊 Summary:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
    }

    console.log('\n✅ Detailed Results:');
    this.results.forEach(r => {
      const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⏭️';
      console.log(`   ${icon} ${r.test}: ${r.message}`);
    });

    // Return summary for programmatic access
    return {
      total,
      passed,
      failed,
      skipped,
      successRate: (passed / total) * 100,
      results: this.results
    };
  }

  // Quick health check
  async quickHealthCheck() {
    console.log('🔍 Running Quick Health Check...');
    
    try {
      const authCheck = authService.isAuthenticated();
      const dashboardCheck = await dashboardService.getDashboardStats();
      
      const isHealthy = authCheck && dashboardCheck;
      
      console.log(`Health Status: ${isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
      console.log(`- Authentication: ${authCheck ? '✅' : '❌'}`);
      console.log(`- Dashboard API: ${dashboardCheck ? '✅' : '❌'}`);
      
      return isHealthy;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export test instance
export const integrationTest = new IntegrationTest();

// Auto-run tests in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_AUTO_TEST === 'true') {
  // Run tests after a delay to allow app initialization
  setTimeout(() => {
    integrationTest.runAllTests();
  }, 3000);
}

// Global access for manual testing
if (typeof window !== 'undefined') {
  window.hgmTest = integrationTest;
}

export default IntegrationTest;
