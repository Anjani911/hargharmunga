import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People,
  LocalFlorist,
  Assessment,
  Settings,
  Logout,
  Menu,
  Close,
  TrendingUp,
  Group,
  Analytics as AnalyticsIcon,
  PhotoCamera,
  Assignment,
  LocationOn,
  Timeline
} from '@mui/icons-material';

// Import additional components
import PlantManagement from './PlantManagement';
import FamilyManagement from './FamilyManagement';
import { default as AnalyticsPage } from './Analytics';
import AnganwadiCenter from './AnganwadiCenter';

// Import API hooks
import { useDashboardData, useAuth } from '../hooks/useApi';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Sidebar = styled.div`
  width: ${props => props.isOpen ? '280px' : '70px'};
  background: linear-gradient(180deg, #2E7D32, #4CAF50);
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '280px' : '0'};
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  
  .logo {
    display: flex;
    align-items: center;
    color: white;
    
    .icon {
      font-size: 40px;
      margin-right: 15px;
    }
    
    .text {
      font-size: 18px;
      font-weight: bold;
      opacity: ${props => props.isOpen ? '1' : '0'};
      transition: opacity 0.3s ease;
    }
  }
`;

const MenuToggle = styled.button`
  position: fixed;
  top: 20px;
  left: ${props => props.isOpen ? '250px' : '20px'};
  z-index: 1001;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    left: 20px;
  }
`;

const SidebarMenu = styled.div`
  padding: 20px 0;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
  
  &.active {
    background: rgba(255,255,255,0.2);
    border-right: 4px solid white;
  }
  
  .icon {
    margin-right: 15px;
    font-size: 24px;
  }
  
  .text {
    opacity: ${props => props.isOpen ? '1' : '0'};
    transition: opacity 0.3s ease;
    font-weight: 500;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => props.sidebarOpen ? '280px' : '70px'};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TopBar = styled.div`
  background: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #1a1a1a;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #4CAF50;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    .details {
      .name {
        font-weight: bold;
        color: #1a1a1a;
      }
      .role {
        font-size: 12px;
        color: #666;
      }
    }
  }
`;

const ContentArea = styled.div`
  padding: 30px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => props.color || '#4CAF50'};
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: ${props => props.color || '#4CAF50'}20;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.color || '#4CAF50'};
      font-size: 24px;
    }
  }
  
  .number {
    font-size: 32px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 5px;
  }
  
  .label {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .trend {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: ${props => props.trending === 'up' ? '#4CAF50' : '#f44336'};
    
    .arrow {
      margin-right: 5px;
    }
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActivitySection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
    }
    
    .view-all {
      color: #4CAF50;
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.type === 'plant' ? '#E8F5E8' : 
                         props.type === 'family' ? '#E3F2FD' : 
                         props.type === 'photo' ? '#FFF3E0' : '#F3E5F5'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.type === 'plant' ? '#4CAF50' : 
                     props.type === 'family' ? '#2196F3' : 
                     props.type === 'photo' ? '#FF9800' : '#9C27B0'};
    margin-right: 15px;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 500;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    
    .meta {
      font-size: 12px;
      color: #666;
    }
  }
  
  .status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: ${props => props.status === 'success' ? '#E8F5E8' : 
                         props.status === 'pending' ? '#FFF3E0' : '#FFEBEE'};
    color: ${props => props.status === 'success' ? '#4CAF50' : 
                     props.status === 'pending' ? '#FF9800' : '#f44336'};
  }
`;

const QuickActions = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 20px;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-bottom: 12px;
  border: none;
  border-radius: 12px;
  background: ${props => props.primary ? '#4CAF50' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#1a1a1a'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [language, setLanguage] = useState('hindi');
  const navigate = useNavigate();

  // API hooks
  const { stats: apiStats, activities: apiActivities, loading: dashboardLoading, error: dashboardError, refetch } = useDashboardData();
  const { user, isAuthenticated, logout: apiLogout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await apiLogout();
    navigate('/');
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { language: newLanguage }
    }));
  };

  // Load saved language on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'hindi';
    setLanguage(savedLanguage);
  }, []);

  // Language content
  const content = {
    hindi: {
      title: 'हर घर मुंगा योजना',
      dashboard: 'डैशबोर्ड',
      plantManagement: 'पौधा प्रबंधन',
      familyManagement: 'परिवार प्रबंधन',
      anganwadiCenter: 'आंगनबाड़ी केंद्र',
      analytics: 'एनालिटिक्स',
      reports: 'रिपोर्ट्स',
      settings: 'सेटिंग्स',
      logout: 'लॉगआउट',
      totalAnganwadi: 'कुल आंगनबाड़ी केंद्र',
      totalFamilies: 'कुल परिवार',
      totalPlants: 'कुल पौधे',
      activePlants: 'सक्रिय पौधे',
      recentActivities: 'हाल की गतिविधियां',
      quickActions: 'त्वरित कार्य',
      addNewFamily: 'नया परिवार जोड़ें',
      plantDistribution: 'पौधा वितरण',
      generateReport: 'रिपोर्ट जेनरेट करें',
      exportData: 'डेटा एक्सपोर्ट',
      languageSettings: 'भाषा सेटिंग्स / Language Settings',
      selectLanguage: 'भाषा चुनें / Select Language:',
      dashboardSettings: 'डैशबोर्ड सेटिंग्स',
      dataManagement: 'डेटा प्रबंधन',
      exportDataBtn: 'डेटा एक्सपोर्ट करें',
      createBackup: 'बैकअप बनाएं',
      adminRole: 'प्रशासक',
      thisMonth: 'इस महीने',
      viewAll: 'सभी देखें',
      completed: 'पूर्ण',
      pending: 'लंबित',
      developmentInProgress: 'यह सेक्शन डेवलपमेंट में है...',
      comingSoon: 'जल्द ही उपलब्ध होगा...'
    },
    english: {
      title: 'Har Ghar Munga Scheme',
      dashboard: 'Dashboard',
      plantManagement: 'Plant Management',
      familyManagement: 'Family Management',
      anganwadiCenter: 'Anganwadi Center',
      analytics: 'Analytics',
      reports: 'Reports',
      settings: 'Settings',
      logout: 'Logout',
      totalAnganwadi: 'Total Anganwadi Centers',
      totalFamilies: 'Total Families',
      totalPlants: 'Total Plants',
      activePlants: 'Active Plants',
      recentActivities: 'Recent Activities',
      quickActions: 'Quick Actions',
      addNewFamily: 'Add New Family',
      plantDistribution: 'Plant Distribution',
      generateReport: 'Generate Report',
      exportData: 'Export Data',
      languageSettings: 'Language Settings',
      selectLanguage: 'Select Language:',
      dashboardSettings: 'Dashboard Settings',
      dataManagement: 'Data Management',
      exportDataBtn: 'Export Data',
      createBackup: 'Create Backup',
      adminRole: 'Administrator',
      thisMonth: 'This Month',
      viewAll: 'View All',
      completed: 'Completed',
      pending: 'Pending',
      developmentInProgress: 'This section is under development...',
      comingSoon: 'Coming Soon...'
    }
  };

  const t = content[language];

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: DashboardIcon },
    { id: 'plants', label: t.plantManagement, icon: LocalFlorist },
    { id: 'families', label: t.familyManagement, icon: People },
    { id: 'anganwadi', label: t.anganwadiCenter, icon: LocationOn },
    { id: 'analytics', label: t.analytics, icon: Assessment },
    { id: 'reports', label: t.reports, icon: Assignment },
    { id: 'settings', label: t.settings, icon: Settings }
  ];

  const stats = [
    { 
      label: t.totalAnganwadi, 
      number: apiStats?.totalAnganwadi?.toString() || '156', 
      icon: LocationOn, 
      color: '#4CAF50',
      trend: 'up',
      change: `+${apiStats?.monthlyGrowth?.anganwadi || 12}%`
    },
    { 
      label: t.totalFamilies, 
      number: apiStats?.totalFamilies?.toLocaleString() || '2,847', 
      icon: Group, 
      color: '#2196F3',
      trend: 'up',
      change: `+${apiStats?.monthlyGrowth?.families || 8}%`
    },
    { 
      label: t.totalPlants, 
      number: apiStats?.totalPlants?.toLocaleString() || '28,470', 
      icon: LocalFlorist, 
      color: '#FF9800',
      trend: 'up',
      change: `+${apiStats?.monthlyGrowth?.plants || 15}%`
    },
    { 
      label: t.activePlants, 
      number: apiStats?.activePlants?.toLocaleString() || '25,623', 
      icon: LocalFlorist, 
      color: '#9C27B0',
      trend: 'up',
      change: `+${apiStats?.monthlyGrowth?.activePlants || 5}%`
    }
  ];

  const recentActivities = apiActivities && apiActivities.length > 0 ? apiActivities : [
    {
      type: 'plant',
      title: 'राम कुमार को पौधा वितरित',
      meta: 'आज, 2:30 PM',
      status: 'success'
    },
    {
      type: 'photo',
      title: 'सीता देवी ने फोटो अपलोड किया',
      meta: 'कल, 4:15 PM',
      status: 'success'
    },
    {
      type: 'family',
      title: 'नया परिवार पंजीकृत',
      meta: 'कल, 11:20 AM',
      status: 'pending'
    },
    {
      type: 'plant',
      title: 'पौधे की देखभाल रिपोर्ट',
      meta: '2 दिन पहले',
      status: 'success'
    },
    {
      type: 'family',
      title: 'परिवार डेटा अपडेट',
      meta: '3 दिन पहले',
      status: 'success'
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <>
            <StatsGrid>
              {stats.map((stat, index) => (
                <StatCard key={index} color={stat.color} trending={stat.trend}>
                  <div className="header">
                    <div className="icon">
                      <stat.icon />
                    </div>
                  </div>
                  <div className="number">{stat.number}</div>
                  <div className="label">{stat.label}</div>
                  <div className="trend">
                    <span className="arrow">{stat.trend === 'up' ? '↗' : '↘'}</span>
                    {stat.change} {t.thisMonth}
                  </div>
                </StatCard>
              ))}
            </StatsGrid>

            <SectionGrid>
              <ActivitySection>
                <div className="header">
                  <h3>{t.recentActivities}</h3>
                  <a href="#" className="view-all">{t.viewAll}</a>
                </div>
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} type={activity.type} status={activity.status}>
                    <div className="icon">
                      {activity.type === 'plant' && <LocalFlorist />}
                      {activity.type === 'photo' && <PhotoCamera />}
                      {activity.type === 'family' && <Group />}
                    </div>
                    <div className="content">
                      <div className="title">{activity.title}</div>
                      <div className="meta">{activity.meta}</div>
                    </div>
                    <div className="status">{activity.status === 'success' ? t.completed : t.pending}</div>
                  </ActivityItem>
                ))}
              </ActivitySection>

              <QuickActions>
                <h3>{t.quickActions}</h3>
                <ActionButton primary onClick={() => setActiveSection('families')}>
                  <People />
                  {t.addNewFamily}
                </ActionButton>
                <ActionButton onClick={() => setActiveSection('plants')}>
                  <LocalFlorist />
                  {t.plantDistribution}
                </ActionButton>
                <ActionButton onClick={() => setActiveSection('analytics')}>
                  <Assessment />
                  {t.generateReport}
                </ActionButton>
                <ActionButton onClick={() => setActiveSection('analytics')}>
                  <AnalyticsIcon />
                  {t.exportData}
                </ActionButton>
              </QuickActions>
            </SectionGrid>
          </>
        );
      case 'plants':
        return <PlantManagement />;
      case 'families':
        return <FamilyManagement />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'anganwadi':
        return <AnganwadiCenter />;
      case 'reports':
        return (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>{t.reports}</h2>
            <p>{t.developmentInProgress}</p>
          </div>
        );
      case 'settings':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '30px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '20px' }}>
                {t.settings}
              </h2>
              
              <div style={{ 
                borderBottom: '1px solid #e0e0e0', 
                paddingBottom: '20px', 
                marginBottom: '20px' 
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '15px' }}>
                  {t.languageSettings}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <label style={{ fontSize: '14px', color: '#666', minWidth: '120px' }}>
                    {t.selectLanguage}
                  </label>
                  <select 
                    style={{ 
                      padding: '10px 15px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      background: 'white',
                      cursor: 'pointer',
                      minWidth: '200px'
                    }}
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="hindi">हिंदी (Hindi)</option>
                    <option value="english">English</option>
                  </select>
                </div>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                  {language === 'hindi' 
                    ? 'भाषा बदलने के लिए विकल्प चुनें / Select option to change language'
                    : 'Select option to change language / भाषा बदलने के लिए विकल्प चुनें'
                  }
                </p>
              </div>

              <div style={{ 
                borderBottom: '1px solid #e0e0e0', 
                paddingBottom: '20px', 
                marginBottom: '20px' 
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '15px' }}>
                  {t.dashboardSettings}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                    <input type="checkbox" style={{ marginRight: '10px' }} defaultChecked />
                    वास्तविक समय डेटा अपडेट दिखाएं
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                    <input type="checkbox" style={{ marginRight: '10px' }} defaultChecked />
                    नोटिफिकेशन इनेबल करें
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                    <input type="checkbox" style={{ marginRight: '10px' }} />
                    डार्क मोड
                  </label>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '15px' }}>
                  {t.dataManagement}
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button style={{ 
                    padding: '10px 20px', 
                    background: '#4CAF50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    {t.exportDataBtn}
                  </button>
                  <button style={{ 
                    padding: '10px 20px', 
                    background: '#f5f5f5', 
                    color: '#1a1a1a', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    {t.createBackup}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '20px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h4 style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                {t.title} - Admin Panel
              </h4>
              <p style={{ fontSize: '12px', color: '#999' }}>
                Version 1.0.0 | © 2024 सभी अधिकार सुरक्षित
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>{t.developmentInProgress}</h2>
            <p>{t.comingSoon}</p>
          </div>
        );
    }
  };

  return (
    <DashboardContainer>
      <MenuToggle isOpen={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <Close /> : <Menu />}
      </MenuToggle>

      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader isOpen={sidebarOpen}>
          <div className="logo">
            <span className="icon">🌳</span>
            <span className="text">{t.title}</span>
          </div>
        </SidebarHeader>

        <SidebarMenu>
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              isOpen={sidebarOpen}
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="icon" />
              <span className="text">{item.label}</span>
            </MenuItem>
          ))}
          
          <MenuItem isOpen={sidebarOpen} onClick={handleLogout}>
            <Logout className="icon" />
            <span className="text">{t.logout}</span>
          </MenuItem>
        </SidebarMenu>
      </Sidebar>

      <MainContent sidebarOpen={sidebarOpen}>
        <TopBar>
          <div className="title">
            {menuItems.find(item => item.id === activeSection)?.label || 'डैशबोर्ड'}
          </div>
          <div className="user-info">
            <div className="avatar">{user?.name?.substring(0, 2).toUpperCase() || 'RA'}</div>
            <div className="details">
              <div className="name">{user?.name || 'Admin Raipur'}</div>
              <div className="role">{t.adminRole}</div>
            </div>
          </div>
        </TopBar>

        <ContentArea>
          {dashboardLoading && activeSection === 'dashboard' ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px',
              fontSize: '18px',
              color: '#666'
            }}>
              डेटा लोड हो रहा है...
            </div>
          ) : (
            renderContent()
          )}
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
