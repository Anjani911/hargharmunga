import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Download,
  DateRange,
  FilterList,
  LocalFlorist,
  People,
  PhotoCamera,
  Timeline
} from '@mui/icons-material';

const AnalyticsContainer = styled.div`
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

const DateFilter = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
    
    label {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    
    select, input {
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
  
  .date-buttons {
    display: flex;
    gap: 8px;
    
    button {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      
      &:hover, &.active {
        background: #4CAF50;
        color: white;
        border-color: #4CAF50;
      }
    }
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled.div`
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
    
    .trend-indicator {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 12px;
      
      &.positive {
        background: #E8F5E8;
        color: #4CAF50;
      }
      
      &.negative {
        background: #FFEBEE;
        color: #f44336;
      }
      
      .trend-icon {
        margin-right: 4px;
        font-size: 14px;
      }
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
  
  .comparison {
    font-size: 12px;
    color: #666;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
    }
    
    .chart-options {
      display: flex;
      gap: 8px;
      
      button {
        padding: 4px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-size: 12px;
        
        &.active {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }
      }
    }
  }
  
  .chart-placeholder {
    height: 300px;
    background: #f8f9fa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
    border: 2px dashed #ddd;
  }
`;

const ProgressChart = styled.div`
  .progress-item {
    margin-bottom: 20px;
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .label {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a1a;
      }
      
      .value {
        font-size: 14px;
        font-weight: bold;
        color: #4CAF50;
      }
    }
    
    .progress-bar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #66BB6A);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }
    
    .progress-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
      font-size: 11px;
      color: #666;
    }
  }
`;

const SummaryTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  
  .table-header {
    background: #f8f9fa;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    display: grid;
    grid-template-columns: 1fr 100px 100px 100px 100px;
    gap: 15px;
    font-weight: 600;
    color: #666;
    font-size: 14px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
  
  .table-row {
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: grid;
    grid-template-columns: 1fr 100px 100px 100px 100px;
    gap: 15px;
    align-items: center;
    
    &:hover {
      background: #f8f9fa;
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 8px;
    }
  }
  
  .location-name {
    font-weight: 500;
    color: #1a1a1a;
  }
  
  .metric-value {
    text-align: center;
    font-weight: 600;
    
    &.families { color: #2196F3; }
    &.plants { color: #4CAF50; }
    &.photos { color: #FF9800; }
    &.growth { color: #9C27B0; }
  }
`;

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
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
      analytics: 'एनालिटिक्स',
      analyticsAndReports: 'एनालिटिक्स और रिपोर्ट्स',
      downloadReport: 'रिपोर्ट डाउनलोड',
      exportData: 'डेटा एक्सपोर्ट',
      totalRegistrations: 'कुल पंजीकरण',
      plantGrowthRate: 'पौधे का विकास दर',
      photoUploads: 'फोटो अपलोड',
      completionRate: 'पूर्णता दर',
      activityRate: 'सक्रियता दर',
      fromLastMonth: 'पिछले महीने से',
      fromLastQuarter: 'पिछली तिमाही से',
      fromLastWeek: 'पिछले सप्ताह से',
      plantProgress: 'पौधे की प्रगति',
      familyEngagement: 'परिवार की सहभागिता',
      photoSubmissions: 'फोटो प्रस्तुतियां',
      selectPeriod: 'अवधि चुनें:',
      timePeriod: 'समय अवधि:',
      thisWeek: 'इस सप्ताह',
      thisMonth: 'इस महीने',
      thisQuarter: 'इस तिमाही',
      thisYear: 'इस वर्ष',
      week: 'सप्ताह',
      month: 'महीना',
      quarter: 'तिमाही',
      year: 'वर्ष',
      from: 'से:',
      to: 'तक:',
      performance: 'प्रदर्शन',
      anganwadiPerformance: 'आंगनबाड़ी प्रदर्शन',
      anganwadiSummary: 'आंगनबाड़ी केंद्र सारांश',
      recentActivities: 'हाल की गतिविधियां',
      keyInsights: 'मुख्य अंतर्दृष्टि',
      center: 'केंद्र',
      families: 'परिवार',
      plants: 'पौधे',
      photos: 'फोटो',
      growthPercent: 'विकास %',
      target: 'लक्ष्य:'
    },
    english: {
      analytics: 'Analytics',
      analyticsAndReports: 'Analytics and Reports',
      downloadReport: 'Download Report',
      exportData: 'Export Data',
      totalRegistrations: 'Total Registrations',
      plantGrowthRate: 'Plant Growth Rate',
      photoUploads: 'Photo Uploads',
      completionRate: 'Completion Rate',
      activityRate: 'Activity Rate',
      fromLastMonth: 'From Last Month',
      fromLastQuarter: 'From Last Quarter',
      fromLastWeek: 'From Last Week',
      plantProgress: 'Plant Progress',
      familyEngagement: 'Family Engagement',
      photoSubmissions: 'Photo Submissions',
      selectPeriod: 'Select Period:',
      timePeriod: 'Time Period:',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisQuarter: 'This Quarter',
      thisYear: 'This Year',
      week: 'Week',
      month: 'Month',
      quarter: 'Quarter',
      year: 'Year',
      from: 'From:',
      to: 'To:',
      performance: 'Performance',
      anganwadiPerformance: 'Anganwadi Performance',
      anganwadiSummary: 'Anganwadi Center Summary',
      recentActivities: 'Recent Activities',
      keyInsights: 'Key Insights',
      center: 'Center',
      families: 'Families',
      plants: 'Plants',
      photos: 'Photos',
      growthPercent: 'Growth %',
      target: 'Target:'
    }
  };

  const t = content[language];

  const metrics = [
    {
      label: t.totalRegistrations,
      number: '2,847',
      icon: People,
      color: '#4CAF50',
      trend: 'positive',
      change: '+12.5%',
      comparison: t.fromLastMonth
    },
    {
      label: t.plantGrowthRate,
      number: '89.2%',
      icon: LocalFlorist,
      color: '#2196F3',
      trend: 'positive',
      change: '+5.3%',
      comparison: t.fromLastQuarter
    },
    {
      label: t.photoUploads,
      number: '15,624',
      icon: PhotoCamera,
      color: '#FF9800',
      trend: 'positive',
      change: '+8.7%',
      comparison: t.fromLastWeek
    },
    {
      label: t.activityRate,
      number: '76.4%',
      icon: TrendingUp,
      color: '#9C27B0',
      trend: 'negative',
      change: '-2.1%',
      comparison: t.fromLastMonth
    }
  ];

  const progressData = [
    { label: 'आंगनबाड़ी #123', value: 94, total: 100, current: 94 },
    { label: 'आंगनबाड़ी #124', value: 87, total: 100, current: 87 },
    { label: 'आंगनबाड़ी #125', value: 92, total: 100, current: 92 },
    { label: 'आंगनबाड़ी #126', value: 78, total: 100, current: 78 },
    { label: 'आंगनबाड़ी #127', value: 85, total: 100, current: 85 }
  ];

  const summaryData = [
    { location: 'आंगनबाड़ी #123', families: 45, plants: 450, photos: 1250, growth: 94 },
    { location: 'आंगनबाड़ी #124', families: 38, plants: 380, photos: 980, growth: 87 },
    { location: 'आंगनबाड़ी #125', families: 42, plants: 420, photos: 1180, growth: 92 },
    { location: 'आंगनबाड़ी #126', families: 35, plants: 350, photos: 890, growth: 78 },
    { location: 'आंगनबाड़ी #127', families: 40, plants: 400, photos: 1020, growth: 85 }
  ];

  return (
    <AnalyticsContainer>
      <div className="section-header">
        <h2>{t.analyticsAndReports}</h2>
        <div className="actions">
          <ActionButton className="secondary">
            <Download />
            {t.exportData}
          </ActionButton>
          <ActionButton className="primary">
            <Assessment />
            {t.downloadReport}
          </ActionButton>
        </div>
      </div>

      <DateFilter>
        <div className="filter-group">
          <label>{t.timePeriod}</label>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="week">{t.week}</option>
            <option value="month">{t.month}</option>
            <option value="quarter">{t.quarter}</option>
            <option value="year">{t.year}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t.from}</label>
          <input type="date" />
        </div>
        
        <div className="filter-group">
          <label>{t.to}</label>
          <input type="date" />
        </div>
        
        <div className="date-buttons">
          <button className={selectedPeriod === 'week' ? 'active' : ''}>
            {t.thisWeek}
          </button>
          <button className={selectedPeriod === 'month' ? 'active' : ''}>
            {t.thisMonth}
          </button>
          <button className={selectedPeriod === 'quarter' ? 'active' : ''}>
            {t.thisQuarter}
          </button>
        </div>
      </DateFilter>

      <MetricsGrid>
        {metrics.map((metric, index) => (
          <MetricCard key={index} color={metric.color}>
            <div className="header">
              <div className="icon">
                <metric.icon />
              </div>
              <div className={`trend-indicator ${metric.trend}`}>
                <span className="trend-icon">
                  {metric.trend === 'positive' ? <TrendingUp /> : <TrendingDown />}
                </span>
                {metric.change}
              </div>
            </div>
            <div className="number">{metric.number}</div>
            <div className="label">{metric.label}</div>
            <div className="comparison">{metric.comparison}</div>
          </MetricCard>
        ))}
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <div className="chart-header">
            <h3>{t.anganwadiPerformance}</h3>
          </div>
          <ProgressChart>
            {progressData.map((item, index) => (
              <div key={index} className="progress-item">
                <div className="progress-header">
                  <span className="label">{item.label}</span>
                  <span className="value">{item.value}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <div className="progress-meta">
                  <span>{item.current}/{item.total}</span>
                  <span>{t.target} {item.total}</span>
                </div>
              </div>
            ))}
          </ProgressChart>
        </ChartCard>
      </ChartsGrid>

      <ChartCard>
        <div className="chart-header">
          <h3>{t.anganwadiSummary}</h3>
        </div>
        <SummaryTable>
          <div className="table-header">
            <div>{t.center}</div>
            <div>{t.families}</div>
            <div>{t.plants}</div>
            <div>{t.photos}</div>
            <div>{t.growthPercent}</div>
          </div>
          
          {summaryData.map((row, index) => (
            <div key={index} className="table-row">
              <div className="location-name">{row.location}</div>
              <div className="metric-value families">{row.families}</div>
              <div className="metric-value plants">{row.plants}</div>
              <div className="metric-value photos">{row.photos}</div>
              <div className="metric-value growth">{row.growth}%</div>
            </div>
          ))}
        </SummaryTable>
      </ChartCard>
    </AnalyticsContainer>
  );
};

export default Analytics;
