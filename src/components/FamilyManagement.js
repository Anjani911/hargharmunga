import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Search,
  Add,
  Download,
  Visibility,
  Edit,
  People,
  LocationOn,
  Phone,
  LocalFlorist,
  PhotoCamera,
  Assessment
} from '@mui/icons-material';

const FamilyContainer = styled.div`
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

const FamilyTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  
  .table-header {
    background: #f8f9fa;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    display: grid;
    grid-template-columns: 1fr 150px 120px 120px 100px 120px;
    gap: 15px;
    font-weight: 600;
    color: #666;
    font-size: 14px;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
  
  .table-row {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    display: grid;
    grid-template-columns: 1fr 150px 120px 120px 100px 120px;
    gap: 15px;
    align-items: center;
    transition: background 0.3s ease;
    
    &:hover {
      background: #f8f9fa;
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 10px;
    }
  }
  
  .family-info {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #4CAF50;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      font-weight: bold;
    }
    
    .details {
      .name {
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 4px;
      }
      
      .meta {
        font-size: 12px;
        color: #666;
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
    
    @media (max-width: 1024px) {
      justify-content: center;
    }
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    
    &.active {
      background: #E8F5E8;
      color: #4CAF50;
    }
    
    &.inactive {
      background: #FFEBEE;
      color: #f44336;
    }
    
    &.pending {
      background: #FFF3E0;
      color: #FF9800;
    }
  }
  
  .plant-count {
    text-align: center;
    font-weight: 600;
    color: #4CAF50;
  }
  
  .actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    
    button {
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f5f5f5;
        border-color: #4CAF50;
        color: #4CAF50;
      }
    }
  }
`;

const FamilyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anganwadiFilter, setAnganwadiFilter] = useState('all');
  const [language, setLanguage] = useState('hindi');

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

  // Translation content
  const content = {
    hindi: {
      familyManagement: 'परिवार प्रबंधन',
      downloadReport: 'रिपोर्ट डाउनलोड',
      addNewFamily: 'नया परिवार जोड़ें',
      totalFamilies: 'कुल परिवार',
      activeFamilies: 'सक्रिय परिवार',
      newRegistrations: 'नए पंजीकरण',
      completeProfiles: 'पूर्ण प्रोफाइल',
      searchPlaceholder: 'परिवार का नाम या ID खोजें...',
      status: 'स्थिति:',
      allStatus: 'सभी',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      pending: 'लंबित',
      anganwadi: 'आंगनबाड़ी:',
      allAnganwadi: 'सभी आंगनबाड़ी',
      anganwadiCenter: 'आंगनबाड़ी',
      familyHead: 'परिवार मुखिया:',
      members: 'सदस्य:',
      plants: 'पौधे:',
      joinDate: 'जुड़ने की तारीख:',
      contact: 'संपर्क:',
      location: 'स्थान:',
      viewDetails: 'विवरण देखें',
      editFamily: 'परिवार संपादित करें',
      viewPhotos: 'फोटो देखें',
      viewProgress: 'प्रगति देखें'
    },
    english: {
      familyManagement: 'Family Management',
      downloadReport: 'Download Report',
      addNewFamily: 'Add New Family',
      totalFamilies: 'Total Families',
      activeFamilies: 'Active Families',
      newRegistrations: 'New Registrations',
      completeProfiles: 'Complete Profiles',
      searchPlaceholder: 'Search family name or ID...',
      status: 'Status:',
      allStatus: 'All',
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      anganwadi: 'Anganwadi:',
      allAnganwadi: 'All Anganwadi',
      anganwadiCenter: 'Anganwadi',
      familyHead: 'Family Head:',
      members: 'Members:',
      plants: 'Plants:',
      joinDate: 'Join Date:',
      contact: 'Contact:',
      location: 'Location:',
      viewDetails: 'View Details',
      editFamily: 'Edit Family',
      viewPhotos: 'View Photos',
      viewProgress: 'View Progress'
    }
  };

  const t = content[language];

  const familyStats = [
    { label: t.totalFamilies, number: '2,847', icon: People, color: '#4CAF50' },
    { label: t.activeFamilies, number: '2,645', icon: '👨‍👩‍👧‍👦', color: '#2196F3' },
    { label: t.newRegistrations, number: '156', icon: '✨', color: '#FF9800' },
    { label: t.completeProfiles, number: '2,498', icon: '✅', color: '#9C27B0' }
  ];

  const families = [
    {
      id: 'FAM-001',
      name: language === 'hindi' ? 'राम कुमार शर्मा' : 'Ram Kumar Sharma',
      phone: '9876543210',
      anganwadi: language === 'hindi' ? 'आंगनबाड़ी #123' : 'Anganwadi #123',
      location: language === 'hindi' ? 'रायपुर, छत्तीसगढ़' : 'Raipur, Chhattisgarh',
      plants: 3,
      status: 'active',
      joinDate: language === 'hindi' ? '15 मार्च 2024' : '15 March 2024',
      lastActive: language === 'hindi' ? '2 दिन पहले' : '2 Days Ago'
    },
    {
      id: 'FAM-002',
      name: language === 'hindi' ? 'सीता देवी पटेल' : 'Sita Devi Patel',
      phone: '9876543211',
      anganwadi: language === 'hindi' ? 'आंगनबाड़ी #124' : 'Anganwadi #124',
      location: language === 'hindi' ? 'बिलासपुर, छत्तीसगढ़' : 'Bilaspur, Chhattisgarh',
      plants: 2,
      status: 'active',
      joinDate: language === 'hindi' ? '20 मार्च 2024' : '20 March 2024',
      lastActive: language === 'hindi' ? '1 दिन पहले' : '1 Day Ago'
    },
    {
      id: 'FAM-003',
      name: language === 'hindi' ? 'गीता शर्मा' : 'Geeta Sharma',
      phone: '9876543212',
      anganwadi: language === 'hindi' ? 'आंगनबाड़ी #125' : 'Anganwadi #125',
      location: language === 'hindi' ? 'दुर्ग, छत्तीसगढ़' : 'Durg, Chhattisgarh',
      plants: 1,
      status: 'pending',
      joinDate: language === 'hindi' ? '25 मार्च 2024' : '25 March 2024',
      lastActive: language === 'hindi' ? '5 दिन पहले' : '5 Days Ago'
    },
    {
      id: 'FAM-004',
      name: language === 'hindi' ? 'मीरा पटेल' : 'Meera Patel',
      phone: '9876543213',
      anganwadi: language === 'hindi' ? 'आंगनबाड़ी #126' : 'Anganwadi #126',
      location: language === 'hindi' ? 'राजनांदगांव, छत्तीसगढ़' : 'Rajnandgaon, Chhattisgarh',
      plants: 4,
      status: 'active',
      joinDate: language === 'hindi' ? '10 मार्च 2024' : '10 March 2024',
      lastActive: language === 'hindi' ? 'आज' : 'Today'
    },
    {
      id: 'FAM-005',
      name: language === 'hindi' ? 'रीता गुप्ता' : 'Rita Gupta',
      phone: '9876543214',
      anganwadi: language === 'hindi' ? 'आंगनबाड़ी #127' : 'Anganwadi #127',
      location: language === 'hindi' ? 'कोरबा, छत्तीसगढ़' : 'Korba, Chhattisgarh',
      plants: 2,
      status: 'active',
      joinDate: '5 मार्च 2024',
      lastActive: '3 दिन पहले'
    },
    {
      id: 'FAM-006',
      name: 'सुनीता देवी',
      phone: '9876543215',
      anganwadi: 'आंगनबाड़ी #128',
      location: 'जगदलपुर, छत्तीसगढ़',
      plants: 3,
      status: 'inactive',
      joinDate: '1 मार्च 2024',
      lastActive: '10 दिन पहले'
    }
  ];

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return t.active;
      case 'inactive': return t.inactive;
      case 'pending': return t.pending;
      default: return status;
    }
  };

  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.phone.includes(searchTerm) ||
                         family.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || family.status === statusFilter;
    const matchesAnganwadi = anganwadiFilter === 'all' || family.anganwadi.includes(anganwadiFilter);
    
    return matchesSearch && matchesStatus && matchesAnganwadi;
  });

  return (
    <FamilyContainer>
      <div className="section-header">
        <h2>{t.familyManagement}</h2>
        <div className="actions">
          <ActionButton className="secondary">
            <Download />
            {t.downloadReport}
          </ActionButton>
          <ActionButton className="primary">
            <Add />
            {t.addNewFamily}
          </ActionButton>
        </div>
      </div>

      <StatsRow>
        {familyStats.map((stat, index) => (
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
            <option value="active">{t.active}</option>
            <option value="inactive">{t.inactive}</option>
            <option value="pending">{t.pending}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t.anganwadi}</label>
          <select value={anganwadiFilter} onChange={(e) => setAnganwadiFilter(e.target.value)}>
            <option value="all">{t.allAnganwadi}</option>
            <option value="#123">{t.anganwadiCenter} #123</option>
            <option value="#124">{t.anganwadiCenter} #124</option>
            <option value="#125">{t.anganwadiCenter} #125</option>
            <option value="#126">{t.anganwadiCenter} #126</option>
          </select>
        </div>
      </FilterBar>

      <FamilyTable>
        <div className="table-header">
          <div>{language === 'hindi' ? 'परिवार की जानकारी' : 'Family Information'}</div>
          <div>{t.anganwadiCenter}</div>
          <div>{t.plants}</div>
          <div>{language === 'hindi' ? 'स्थिति' : 'Status'}</div>
          <div>{language === 'hindi' ? 'अंतिम सक्रिय' : 'Last Active'}</div>
          <div>{language === 'hindi' ? 'कार्य' : 'Actions'}</div>
        </div>
        
        {filteredFamilies.map((family) => (
          <div key={family.id} className="table-row">
            <div className="family-info">
              <div className="avatar">
                {family.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="details">
                <div className="name">{family.name}</div>
                <div className="meta">
                  <Phone style={{ fontSize: '14px' }} />
                  {family.phone}
                  <span>•</span>
                  <LocationOn style={{ fontSize: '14px' }} />
                  {family.location}
                </div>
              </div>
            </div>
            
            <div>{family.anganwadi}</div>
            
            <div className="plant-count">
              <LocalFlorist style={{ fontSize: '16px', marginRight: '4px' }} />
              {family.plants}
            </div>
            
            <div>
              <div className={`status-badge ${family.status}`}>
                {getStatusText(family.status)}
              </div>
            </div>
            
            <div style={{ fontSize: '12px', color: '#666' }}>
              {family.lastActive}
            </div>
            
            <div className="actions">
              <button title={t.viewDetails}>
                <Visibility style={{ fontSize: '16px' }} />
              </button>
              <button title={t.editFamily}>
                <Edit style={{ fontSize: '16px' }} />
              </button>
              <button title="फोटो गैलरी">
                <PhotoCamera style={{ fontSize: '16px' }} />
              </button>
              <button title="रिपोर्ट">
                <Assessment style={{ fontSize: '16px' }} />
              </button>
            </div>
          </div>
        ))}
      </FamilyTable>
    </FamilyContainer>
  );
};

export default FamilyManagement;
