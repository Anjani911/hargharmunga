import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Search,
  Add,
  FilterList,
  Download,
  Visibility,
  Edit,
  Delete,
  LocalFlorist,
  Timeline,
  PhotoCamera
} from '@mui/icons-material';
import { usePlants } from '../hooks/useApi';
import { exportToCSV, formatDate } from '../utils/apiUtils';

const PlantsContainer = styled.div`
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    h2 {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
    }
    
    .actions {
      display: flex;
      gap: 15px;
    }
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &.primary {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #2E7D32;
    }
  }
  
  &.secondary {
    background: #f5f5f5;
    color: #1a1a1a;
    
    &:hover {
      background: #e0e0e0;
    }
  }
`;

const FilterBar = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
  
  .search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
    
    input {
      width: 100%;
      padding: 12px 40px 12px 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #4CAF50;
      }
    }
    
    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
    
    label {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    
    select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #4CAF50;
      }
    }
  }
`;

const PlantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const PlantCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  .plant-image {
    height: 200px;
    background: linear-gradient(135deg, #E8F5E8, #C8E6C9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    position: relative;
    
    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      
      &.healthy {
        background: #E8F5E8;
        color: #4CAF50;
      }
      
      &.growing {
        background: #FFF3E0;
        color: #FF9800;
      }
      
      &.needs-care {
        background: #FFEBEE;
        color: #f44336;
      }
    }
  }
  
  .plant-info {
    padding: 20px;
    
    .plant-id {
      font-size: 16px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    
    .plant-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 15px;
      
      .detail {
        font-size: 12px;
        
        .label {
          color: #666;
          display: block;
        }
        
        .value {
          color: #1a1a1a;
          font-weight: 500;
        }
      }
    }
    
    .plant-family {
      font-size: 14px;
      color: #4CAF50;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .plant-actions {
      display: flex;
      gap: 8px;
      
      button {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #f5f5f5;
        }
        
        &.primary {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
          
          &:hover {
            background: #2E7D32;
          }
        }
      }
    }
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  
  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: ${props => props.color}20;
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-size: 24px;
  }
  
  .stat-number {
    font-size: 28px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #666;
  }
`;

const PlantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [language, setLanguage] = useState('hindi');

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'hindi';
    setLanguage(savedLanguage);
    
    // Listen for language changes from other components
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('selectedLanguage') || 'hindi';
      setLanguage(newLanguage);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-window changes)
    const handleLanguageChange = (event) => {
      setLanguage(event.detail.language);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // Translation content
  const content = {
    hindi: {
      plantManagement: 'पौधा प्रबंधन',
      downloadReport: 'रिपोर्ट डाउनलोड',
      addNewPlant: 'नया पौधा जोड़ें',
      totalPlants: 'कुल पौधे',
      healthyPlants: 'स्वस्थ पौधे',
      needsCare: 'देखभाल चाहिए',
      newPlants: 'नए पौधे',
      searchPlaceholder: 'पौधा ID या परिवार का नाम खोजें...',
      status: 'स्थिति:',
      location: 'स्थान:',
      allStatus: 'सभी',
      healthy: 'स्वस्थ',
      growing: 'बढ़ रहा है',
      needsCareStatus: 'देखभाल चाहिए',
      allAnganwadi: 'सभी आंगनबाड़ी',
      anganwadiCenter: 'आंगनबाड़ी',
      mungaPlant: 'मूंगा पौधा',
      age: 'आयु:',
      careScore: 'देखभाल स्कोर:',
      lastPhoto: 'अंतिम फोटो:',
      locationLabel: 'स्थान:',
      days: 'दिन',
      today: 'आज',
      daysAgo: 'दिन पहले',
      family: 'परिवार'
    },
    english: {
      plantManagement: 'Plant Management',
      downloadReport: 'Download Report',
      addNewPlant: 'Add New Plant',
      totalPlants: 'Total Plants',
      healthyPlants: 'Healthy Plants',
      needsCare: 'Needs Care',
      newPlants: 'New Plants',
      searchPlaceholder: 'Search plant ID or family name...',
      status: 'Status:',
      location: 'Location:',
      allStatus: 'All',
      healthy: 'Healthy',
      growing: 'Growing',
      needsCareStatus: 'Needs Care',
      allAnganwadi: 'All Anganwadi',
      anganwadiCenter: 'Anganwadi',
      mungaPlant: 'Munga Plant',
      age: 'Age:',
      careScore: 'Care Score:',
      lastPhoto: 'Last Photo:',
      locationLabel: 'Location:',
      days: 'Days',
      today: 'Today',
      daysAgo: 'Days Ago',
      family: 'Family'
    }
  };

  const t = content[language];

  const plantStats = [
    { label: t.totalPlants, number: '28,470', icon: LocalFlorist, color: '#4CAF50' },
    { label: t.healthyPlants, number: '25,623', icon: '🌱', color: '#4CAF50' },
    { label: t.needsCare, number: '2,847', icon: '⚠️', color: '#FF9800' },
    { label: t.newPlants, number: '456', icon: '🌿', color: '#2196F3' }
  ];

  const plants = [
    {
      id: 'MNG-001',
      type: t.mungaPlant,
      age: language === 'hindi' ? '45 दिन' : '45 Days',
      status: 'healthy',
      family: language === 'hindi' ? 'राम कुमार परिवार' : 'Ram Kumar Family',
      location: language === 'hindi' ? 'आंगनबाड़ी #123' : 'Anganwadi #123',
      lastPhoto: language === 'hindi' ? '2 दिन पहले' : '2 Days Ago',
      careScore: 85
    },
    {
      id: 'MNG-002',
      type: t.mungaPlant,
      age: language === 'hindi' ? '30 दिन' : '30 Days',
      status: 'growing',
      family: language === 'hindi' ? 'सीता देवी परिवार' : 'Sita Devi Family',
      location: language === 'hindi' ? 'आंगनबाड़ी #124' : 'Anganwadi #124',
      lastPhoto: language === 'hindi' ? '1 दिन पहले' : '1 Day Ago',
      careScore: 92
    },
    {
      id: 'MNG-003',
      type: t.mungaPlant,
      age: language === 'hindi' ? '60 दिन' : '60 Days',
      status: 'needs-care',
      family: language === 'hindi' ? 'गीता शर्मा परिवार' : 'Geeta Sharma Family',
      location: language === 'hindi' ? 'आंगनबाड़ी #125' : 'Anganwadi #125',
      lastPhoto: language === 'hindi' ? '5 दिन पहले' : '5 Days Ago',
      careScore: 68
    },
    {
      id: 'MNG-004',
      type: t.mungaPlant,
      age: language === 'hindi' ? '25 दिन' : '25 Days',
      status: 'healthy',
      family: language === 'hindi' ? 'मीरा पटेल परिवार' : 'Meera Patel Family',
      location: language === 'hindi' ? 'आंगनबाड़ी #126' : 'Anganwadi #126',
      lastPhoto: language === 'hindi' ? 'आज' : 'Today',
      careScore: 95
    },
    {
      id: 'MNG-005',
      type: t.mungaPlant,
      age: language === 'hindi' ? '40 दिन' : '40 Days',
      status: 'growing',
      family: language === 'hindi' ? 'रीता गुप्ता परिवार' : 'Rita Gupta Family',
      location: language === 'hindi' ? 'आंगनबाड़ी #127' : 'Anganwadi #127',
      lastPhoto: language === 'hindi' ? '3 दिन पहले' : '3 Days Ago',
      careScore: 78
    },
    {
      id: 'MNG-006',
      type: t.mungaPlant,
      age: language === 'hindi' ? '55 दिन' : '55 Days',
      status: 'healthy',
      family: language === 'hindi' ? 'सुनीता देवी परिवार' : 'Sunita Devi Family',
      location: language === 'hindi' ? 'आंगनबाड़ी #128' : 'Anganwadi #128',
      lastPhoto: language === 'hindi' ? '1 दिन पहले' : '1 Day Ago',
      careScore: 89
    }
  ];

  const getStatusText = (status) => {
    switch(status) {
      case 'healthy': return t.healthy;
      case 'growing': return t.growing;
      case 'needs-care': return t.needsCareStatus;
      default: return status;
    }
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.family.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plant.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || plant.location.includes(locationFilter);
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <PlantsContainer>
      <div className="section-header">
        <h2>{t.plantManagement}</h2>
        <div className="actions">
          <ActionButton className="secondary">
            <Download />
            {t.downloadReport}
          </ActionButton>
          <ActionButton className="primary">
            <Add />
            {t.addNewPlant}
          </ActionButton>
        </div>
      </div>

      <StatsRow>
        {plantStats.map((stat, index) => (
          <StatCard key={index} color={stat.color}>
            <div className="stat-icon">
              {typeof stat.icon === 'string' ? stat.icon : <stat.icon />}
            </div>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </StatCard>
        ))}
      </StatsRow>

      <FilterBar>
        <div className="search-box">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" />
        </div>
        
        <div className="filter-group">
          <label>{t.status}</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">{t.allStatus}</option>
            <option value="healthy">{t.healthy}</option>
            <option value="growing">{t.growing}</option>
            <option value="needs-care">{t.needsCareStatus}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t.location}</label>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="all">{t.allAnganwadi}</option>
            <option value="#123">{t.anganwadiCenter} #123</option>
            <option value="#124">{t.anganwadiCenter} #124</option>
            <option value="#125">{t.anganwadiCenter} #125</option>
            <option value="#126">{t.anganwadiCenter} #126</option>
          </select>
        </div>
      </FilterBar>

      <PlantsGrid>
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id}>
            <div className="plant-image">
              🌱
              <div className={`status-badge ${plant.status}`}>
                {getStatusText(plant.status)}
              </div>
            </div>
            
            <div className="plant-info">
              <div className="plant-id">{plant.id}</div>
              
              <div className="plant-details">
                <div className="detail">
                  <span className="label">{t.age}</span>
                  <span className="value">{plant.age}</span>
                </div>
                <div className="detail">
                  <span className="label">{t.careScore}</span>
                  <span className="value">{plant.careScore}%</span>
                </div>
                <div className="detail">
                  <span className="label">{t.lastPhoto}</span>
                  <span className="value">{plant.lastPhoto}</span>
                </div>
                <div className="detail">
                  <span className="label">{t.locationLabel}</span>
                  <span className="value">{plant.location}</span>
                </div>
              </div>
              
              <div className="plant-family">
                👨‍👩‍👧‍👦 {plant.family}
              </div>
              
              <div className="plant-actions">
                <button>
                  <Visibility />
                </button>
                <button>
                  <PhotoCamera />
                </button>
                <button>
                  <Timeline />
                </button>
                <button className="primary">
                  <Edit />
                </button>
              </div>
            </div>
          </PlantCard>
        ))}
      </PlantsGrid>
    </PlantsContainer>
  );
};

export default PlantManagement;
