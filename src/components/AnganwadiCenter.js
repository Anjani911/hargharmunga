import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import anganwadiService from '../services/anganwadiService';
import {
  Search,
  LocationOn,
  People,
  LocalFlorist,
  Visibility,
  Close,
  PhotoCamera,
  Assessment,
  Phone,
  Home
} from '@mui/icons-material';

const AnganwadiContainer = styled.div`
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
  }
`;

const FilterBar = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  
  .filter-section {
    margin-bottom: 20px;
    
    h4 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .filter-row {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }
  
  .search-box {
    position: relative;
    flex: 1;
    min-width: 250px;
    
    input {
      width: 100%;
      padding: 12px 45px 12px 15px;
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
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }
`;

const FilterDropdown = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-width: 180px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  &:disabled {
    background: #f5f5f5;
    color: #999;
  }
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #d32f2f;
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

const CentersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const CenterCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  .center-header {
    background: linear-gradient(135deg, #4CAF50, #2E7D32);
    color: white;
    padding: 20px;
    
    .center-id {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .center-name {
      font-size: 14px;
      opacity: 0.9;
    }
  }
  
  .center-content {
    padding: 20px;
    
    .address {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 15px;
      color: #666;
      font-size: 14px;
      
      .icon {
        margin-top: 2px;
        font-size: 16px;
      }
    }
    
    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
      
      .stat-item {
        text-align: center;
        
        .number {
          font-size: 20px;
          font-weight: bold;
          color: #1a1a1a;
        }
        
        .label {
          font-size: 12px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-top: 4px;
        }
      }
    }
    
    .actions {
      display: flex;
      gap: 10px;
      
      button {
        flex: 1;
        padding: 10px;
        border: 1px solid #4CAF50;
        border-radius: 8px;
        background: white;
        color: #4CAF50;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        
        &:hover {
          background: #4CAF50;
          color: white;
        }
        
        &.primary {
          background: #4CAF50;
          color: white;
          
          &:hover {
            background: #2E7D32;
          }
        }
      }
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  
  .modal-header {
    padding: 20px 30px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      font-size: 20px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 5px;
      border-radius: 50%;
      
      &:hover {
        background: #f5f5f5;
      }
    }
  }
  
  .modal-body {
    padding: 30px;
  }
`;

const CenterDetails = styled.div`
  margin-bottom: 30px;
  
  .detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    
    .icon {
      color: #4CAF50;
      font-size: 18px;
    }
    
    .label {
      font-weight: 500;
      color: #1a1a1a;
      min-width: 100px;
    }
    
    .value {
      color: #666;
    }
  }
`;

const PhotosGrid = styled.div`
  h4 {
    font-size: 18px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .photos-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
`;

const PhotoCard = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4CAF50;
    background: #E8F5E8;
  }
  
  .plant-icon {
    font-size: 40px;
    color: #4CAF50;
    margin-bottom: 8px;
  }
  
  .plant-id {
    font-size: 12px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 4px;
  }
  
  .plant-status {
    font-size: 10px;
    color: #666;
    padding: 2px 8px;
    background: white;
    border-radius: 10px;
  }
`;

const AnganwadiCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState('hindi');
  
  // New state for hierarchical filters
  const [filters, setFilters] = useState({
    pariyojnaName: '',
    sectorName: '',
    villageName: '',
    aanganwadiKendraName: ''
  });
  
  const [filterOptions, setFilterOptions] = useState({
    pariyojnaList: [],
    sectorList: [],
    villageList: [],
    aanganwadiList: []
  });
  
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'hindi';
    setLanguage(savedLanguage);

    // Listen for language change events
    const handleLanguageChange = (event) => {
      setLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Load initial pariyojna list
  useEffect(() => {
    loadPariyojnaList();
  }, []);

  // Load sectors when pariyojna changes
  useEffect(() => {
    if (filters.pariyojnaName) {
      loadSectorList(filters.pariyojnaName);
    } else {
      setFilterOptions(prev => ({ ...prev, sectorList: [] }));
      setFilters(prev => ({ ...prev, sectorName: '', villageName: '', aanganwadiKendraName: '' }));
    }
  }, [filters.pariyojnaName]);

  // Load villages when sector changes
  useEffect(() => {
    if (filters.sectorName) {
      loadVillageList(filters.pariyojnaName, filters.sectorName);
    } else {
      setFilterOptions(prev => ({ ...prev, villageList: [] }));
      setFilters(prev => ({ ...prev, villageName: '', aanganwadiKendraName: '' }));
    }
  }, [filters.sectorName]);

  // Load aanganwadi centers when village changes
  useEffect(() => {
    if (filters.villageName) {
      loadAanganwadiList(filters.pariyojnaName, filters.sectorName, filters.villageName);
    } else {
      setFilterOptions(prev => ({ ...prev, aanganwadiList: [] }));
      setFilters(prev => ({ ...prev, aanganwadiKendraName: '' }));
    }
  }, [filters.villageName]);

  // Load filtered users when any filter changes
  useEffect(() => {
    loadFilteredUsers();
  }, [filters]);

  const loadPariyojnaList = async () => {
    try {
      const list = await anganwadiService.getPariyojnaList();
      setFilterOptions(prev => ({ ...prev, pariyojnaList: list }));
    } catch (error) {
      console.error('Error loading pariyojna list:', error);
    }
  };

  const loadSectorList = async (pariyojnaName) => {
    try {
      const list = await anganwadiService.getSectorList(pariyojnaName);
      setFilterOptions(prev => ({ ...prev, sectorList: list }));
    } catch (error) {
      console.error('Error loading sector list:', error);
    }
  };

  const loadVillageList = async (pariyojnaName, sectorName) => {
    try {
      const list = await anganwadiService.getVillageList(pariyojnaName, sectorName);
      setFilterOptions(prev => ({ ...prev, villageList: list }));
    } catch (error) {
      console.error('Error loading village list:', error);
    }
  };

  const loadAanganwadiList = async (pariyojnaName, sectorName, villageName) => {
    try {
      const list = await anganwadiService.getAanganwadiList(pariyojnaName, sectorName, villageName);
      setFilterOptions(prev => ({ ...prev, aanganwadiList: list }));
    } catch (error) {
      console.error('Error loading aanganwadi list:', error);
    }
  };

  const loadFilteredUsers = async () => {
    try {
      const users = await anganwadiService.getFilteredUsers(filters);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error loading filtered users:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value };
      
      // Clear dependent filters when parent filter changes
      if (filterName === 'pariyojnaName') {
        newFilters.sectorName = '';
        newFilters.villageName = '';
        newFilters.aanganwadiKendraName = '';
      } else if (filterName === 'sectorName') {
        newFilters.villageName = '';
        newFilters.aanganwadiKendraName = '';
      } else if (filterName === 'villageName') {
        newFilters.aanganwadiKendraName = '';
      }
      
      return newFilters;
    });
  };

  // Translation content
  const content = {
    hindi: {
      anganwadiCenters: 'आंगनबाड़ी केंद्र',
      searchPlaceholder: 'केंद्र कोड या पता खोजें...',
      totalCenters: 'कुल केंद्र',
      activeCenters: 'सक्रिय केंद्र',
      families: 'परिवार',
      plants: 'पौधे',
      children: 'बच्चे',
      inspect: 'निरीक्षण करें',
      centerDetails: 'केंद्र विवरण',
      centerCode: 'केंद्र कोड:',
      inCharge: 'प्रभारी:',
      contactNumber: 'संपर्क नंबर:',
      address: 'पता:',
      plantPhotos: 'मुंगा पौधों की तस्वीरें',
      plantId: 'पौधा',
      growing: 'बढ़ रहा है',
      healthy: 'स्वस्थ',
      needsCare: 'देखभाल चाहिए',
      pariyojnaName: 'परियोजना का नाम',
      sectorName: 'सेक्टर का नाम',
      villageName: 'गांव का नाम',
      aanganwadiKendraName: 'आंगनबाड़ी केंद्र का नाम',
      selectPariyojna: 'परियोजना चुनें',
      selectSector: 'सेक्टर चुनें',
      selectVillage: 'गांव चुनें',
      selectAanganwadi: 'आंगनबाड़ी केंद्र चुनें',
      clearFilters: 'फिल्टर साफ़ करें'
    },
    english: {
      anganwadiCenters: 'Anganwadi Centers',
      searchPlaceholder: 'Search center code or address...',
      totalCenters: 'Total Centers',
      activeCenters: 'Active Centers',
      families: 'Families',
      plants: 'Plants',
      children: 'Children',
      inspect: 'Inspect',
      centerDetails: 'Center Details',
      centerCode: 'Center Code:',
      inCharge: 'In Charge:',
      contactNumber: 'Contact Number:',
      address: 'Address:',
      plantPhotos: 'Munga Plant Photos',
      plantId: 'Plant',
      growing: 'Growing',
      healthy: 'Healthy',
      needsCare: 'Needs Care',
      pariyojnaName: 'Project Name',
      sectorName: 'Sector Name',
      villageName: 'Village Name',
      aanganwadiKendraName: 'Anganwadi Center Name',
      selectPariyojna: 'Select Project',
      selectSector: 'Select Sector',
      selectVillage: 'Select Village',
      selectAanganwadi: 'Select Anganwadi Center',
      clearFilters: 'Clear Filters'
    }
  };

  const t = content[language];

  // Calculate stats from filtered data
  const stats = [
    { 
      label: t.totalCenters, 
      number: filteredUsers.length.toString(), 
      icon: Home, 
      color: '#4CAF50' 
    },
    { 
      label: t.activeCenters, 
      number: filteredUsers.filter(user => user.role === 'aanganwadi_worker').length.toString(), 
      icon: '', 
      color: '#2196F3' 
    }
  ];

  const anganwadiCenters = [
    {
      id: 'AWC-001',
      code: 'AWC-RYP-001',
      name: language === 'hindi' ? 'आंगनबाड़ी केंद्र #001' : 'Anganwadi Center #001',
      address: language === 'hindi' ? 'गांधी चौक, रायपुर, छत्तीसगढ़ - 492001' : 'Gandhi Chowk, Raipur, Chhattisgarh - 492001',
      inCharge: language === 'hindi' ? 'श्रीमती सुनीता देवी' : 'Mrs. Sunita Devi',
      phone: '9876543210',
      families: 25,
      plants: 75,
      children: 45,
      status: 'active'
    },
    {
      id: 'AWC-002',
      code: 'AWC-RYP-002',
      name: language === 'hindi' ? 'आंगनबाड़ी केंद्र #002' : 'Anganwadi Center #002',
      address: language === 'hindi' ? 'बस स्टैंड रोड, रायपुर, छत्तीसगढ़ - 492001' : 'Bus Stand Road, Raipur, Chhattisgarh - 492001',
      inCharge: language === 'hindi' ? 'श्रीमती गीता शर्मा' : 'Mrs. Geeta Sharma',
      phone: '9876543211',
      families: 30,
      plants: 90,
      children: 52,
      status: 'active'
    },
    {
      id: 'AWC-003',
      code: 'AWC-RYP-003',
      name: language === 'hindi' ? 'आंगनबाड़ी केंद्र #003' : 'Anganwadi Center #003',
      address: language === 'hindi' ? 'मोहल्ला पारा, रायपुर, छत्तीसगढ़ - 492001' : 'Mohalla Para, Raipur, Chhattisgarh - 492001',
      inCharge: language === 'hindi' ? 'श्रीमती मीरा पटेल' : 'Mrs. Meera Patel',
      phone: '9876543212',
      families: 22,
      plants: 66,
      children: 38,
      status: 'active'
    },
    {
      id: 'AWC-004',
      code: 'AWC-BLP-001',
      name: language === 'hindi' ? 'आंगनबाड़ी केंद्र #004' : 'Anganwadi Center #004',
      address: language === 'hindi' ? 'सिविल लाइन्स, बिलासपुर, छत्तीसगढ़ - 495001' : 'Civil Lines, Bilaspur, Chhattisgarh - 495001',
      inCharge: language === 'hindi' ? 'श्रीमती रीता गुप्ता' : 'Mrs. Rita Gupta',
      phone: '9876543213',
      families: 28,
      plants: 84,
      children: 48,
      status: 'active'
    },
    {
      id: 'AWC-005',
      code: 'AWC-DRG-001',
      name: language === 'hindi' ? 'आंगनबाड़ी केंद्र #005' : 'Anganwadi Center #005',
      address: language === 'hindi' ? 'स्टेशन रोड, दुर्ग, छत्तीसगढ़ - 491001' : 'Station Road, Durg, Chhattisgarh - 491001',
      inCharge: language === 'hindi' ? 'श्रीमती सीता यादव' : 'Mrs. Sita Yadav',
      phone: '9876543214',
      families: 26,
      plants: 78,
      children: 42,
      status: 'active'
    },
    {
      id: 'AWC-006',
      code: 'AWC-RJN-001',
      name: language === 'hindi' ? 'आंगनबाड़ी केंद्र #006' : 'Anganwadi Center #006',
      address: language === 'hindi' ? 'मुख्य बाज़ार, राजनांदगांव, छत्तीसगढ़ - 491441' : 'Main Bazaar, Rajnandgaon, Chhattisgarh - 491441',
      inCharge: language === 'hindi' ? 'श्रीमती प्रिया वर्मा' : 'Mrs. Priya Verma',
      phone: '9876543215',
      families: 24,
      plants: 72,
      children: 40,
      status: 'active'
    }
  ];

  const generatePlantPhotos = (centerCode) => {
    const plants = [];
    const statuses = ['healthy', 'growing', 'needsCare'];
    
    for (let i = 1; i <= 10; i++) {
      plants.push({
        id: `${centerCode}-P${i.toString().padStart(2, '0')}`,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    return plants;
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'healthy': return t.healthy;
      case 'growing': return t.growing;
      case 'needsCare': return t.needsCare;
      default: return status;
    }
  };

  const handleInspect = (center) => {
    console.log('=== Selected Center Debug ===');
    console.log('Full Center Data:', center);
    console.log('aanganwadi_kendra_name:', center.aanganwadi_kendra_name);
    console.log('pariyojna_name:', center.pariyojna_name);
    console.log('sector_name:', center.sector_name);
    console.log('supervisor_name:', center.supervisor_name);
    console.log('=== End Debug ===');
    setSelectedCenter(center);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCenter(null);
  };

  // Combine filtered users with search term filtering
  const filteredCenters = filteredUsers
    .filter(user => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.contact_number && user.contact_number.toLowerCase().includes(searchLower)) ||
        (user.gram && user.gram.toLowerCase().includes(searchLower)) ||
        (user.aanganwadi_kendra_name && user.aanganwadi_kendra_name.toLowerCase().includes(searchLower))
      );
    })
    .map(user => ({
      id: user.id,
      code: `AWC-${user.id}`,
      name: user.aanganwadi_kendra_name || `${language === 'hindi' ? 'आंगनबाड़ी केंद्र' : 'Anganwadi Center'} #${user.id}`,
      address: `${user.village_name || user.gram || ''}, ${user.block_name || user.block || ''}, ${user.zila || ''}`.replace(/^,\s*|,\s*$/g, ''),
      inCharge: user.name,
      phone: user.contact_number,
      families: Math.floor(Math.random() * 30) + 10, // Demo data
      plants: Math.floor(Math.random() * 100) + 20, // Demo data  
      children: Math.floor(Math.random() * 50) + 15, // Demo data
      status: 'active',
      // Complete registration data
      pariyojna_name: user.pariyojna_name,
      sector_name: user.sector_name,
      village_name: user.village_name,
      supervisor_name: user.supervisor_name,
      block_name: user.block_name,
      gram: user.gram,
      tehsil: user.tehsil,
      zila: user.zila,
      role: user.role,
      created_at: user.created_at,
      aanganwadi_kendra_name: user.aanganwadi_kendra_name // Add this explicitly for modal
    }));

  return (
    <AnganwadiContainer>
      <div className="section-header">
        <h2>{t.anganwadiCenters}</h2>
      </div>

      <StatsRow>
        {stats.map((stat, index) => (
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
        <div className="filter-section">
          <h4>{language === 'hindi' ? 'फिल्टर करें' : 'Filter Options'}</h4>
          
          <div className="filter-row">
            <FilterDropdown
              value={filters.pariyojnaName}
              onChange={(e) => handleFilterChange('pariyojnaName', e.target.value)}
            >
              <option value="">{t.selectPariyojna}</option>
              {filterOptions.pariyojnaList.map((pariyojna, index) => (
                <option key={index} value={pariyojna}>
                  {pariyojna}
                </option>
              ))}
            </FilterDropdown>

            <FilterDropdown
              value={filters.sectorName}
              onChange={(e) => handleFilterChange('sectorName', e.target.value)}
              disabled={!filters.pariyojnaName}
            >
              <option value="">{t.selectSector}</option>
              {filterOptions.sectorList.map((sector, index) => (
                <option key={index} value={sector}>
                  {sector}
                </option>
              ))}
            </FilterDropdown>

            <FilterDropdown
              value={filters.villageName}
              onChange={(e) => handleFilterChange('villageName', e.target.value)}
              disabled={!filters.sectorName}
            >
              <option value="">{t.selectVillage}</option>
              {filterOptions.villageList.map((village, index) => (
                <option key={index} value={village}>
                  {village}
                </option>
              ))}
            </FilterDropdown>

            <FilterDropdown
              value={filters.aanganwadiKendraName}
              onChange={(e) => handleFilterChange('aanganwadiKendraName', e.target.value)}
              disabled={!filters.villageName}
            >
              <option value="">{t.selectAanganwadi}</option>
              {filterOptions.aanganwadiList.map((aanganwadi, index) => (
                <option key={index} value={aanganwadi}>
                  {aanganwadi}
                </option>
              ))}
            </FilterDropdown>

            <ClearButton
              onClick={() => {
                setFilters({
                  pariyojnaName: '',
                  sectorName: '',
                  villageName: '',
                  aanganwadiKendraName: ''
                });
              }}
            >
              {t.clearFilters}
            </ClearButton>
          </div>
        </div>
        
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-icon" />
          </div>
        </div>
      </FilterBar>

      <CentersGrid>
        {filteredCenters.map((center) => (
          <CenterCard key={center.id}>
            <div className="center-header">
              <div className="center-id">{center.code}</div>
              <div className="center-name">{center.name}</div>
            </div>
            
            <div className="center-content">
              <div className="address">
                <LocationOn className="icon" />
                <span>{center.address}</span>
              </div>
              
              <div className="stats-row">
                <div className="stat-item">
                  <div className="number">{center.families}</div>
                  <div className="label">
                    <People style={{ fontSize: '12px' }} />
                    {t.families}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="number">{center.plants}</div>
                  <div className="label">
                    <LocalFlorist style={{ fontSize: '12px' }} />
                    {t.plants}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="number">{center.children}</div>
                  <div className="label">
                    👶
                    {t.children}
                  </div>
                </div>
              </div>
              
              <div className="actions">
                <button className="primary" onClick={() => handleInspect(center)}>
                  <Visibility />
                  {t.inspect}
                </button>
              </div>
            </div>
          </CenterCard>
        ))}
      </CentersGrid>

      {isModalOpen && selectedCenter && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCenter.code} - {t.centerDetails}</h3>
              <button className="close-btn" onClick={closeModal}>
                <Close />
              </button>
            </div>
            
            <div className="modal-body">
              <CenterDetails>
                <div className="detail-row">
                  <People className="icon" />
                  <span className="label">Name:</span>
                  <span className="value">{selectedCenter.inCharge}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Role:</span>
                  <span className="value">{selectedCenter.role || 'aanganwadi_worker'}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Aanganwadi Center Name:</span>
                  <span className="value">{selectedCenter.aanganwadi_kendra_name || selectedCenter.name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Project Name:</span>
                  <span className="value">{selectedCenter.pariyojna_name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Sector Name:</span>
                  <span className="value">{selectedCenter.sector_name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <People className="icon" />
                  <span className="label">Supervisor Name:</span>
                  <span className="value">{selectedCenter.supervisor_name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <LocationOn className="icon" />
                  <span className="label">Village/Gram:</span>
                  <span className="value">{selectedCenter.village_name || selectedCenter.gram || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Block:</span>
                  <span className="value">{selectedCenter.block_name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Tehsil:</span>
                  <span className="value">{selectedCenter.tehsil || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Zila:</span>
                  <span className="value">{selectedCenter.zila || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Phone className="icon" />
                  <span className="label">Contact:</span>
                  <span className="value">{selectedCenter.phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <Home className="icon" />
                  <span className="label">Created At:</span>
                  <span className="value">{selectedCenter.created_at ? new Date(selectedCenter.created_at).toLocaleString() : 'N/A'}</span>
                </div>
              </CenterDetails>

              <PhotosGrid>
                <h4>
                  <PhotoCamera />
                  {t.plantPhotos} (10)
                </h4>
                
                <div className="photos-container">
                  {generatePlantPhotos(selectedCenter.code).map((plant) => (
                    <PhotoCard key={plant.id}>
                      <div className="plant-icon">🌱</div>
                      <div className="plant-id">{t.plantId} {plant.id.split('-').pop()}</div>
                      <div className="plant-status">{getStatusText(plant.status)}</div>
                    </PhotoCard>
                  ))}
                </div>
              </PhotosGrid>
            </div>
          </ModalContent>
        </Modal>
      )}
    </AnganwadiContainer>
  );
};

export default AnganwadiCenter;
