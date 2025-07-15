import React from 'react';
import { useNavigate } from 'react-router-dom';

const FamilyDashboard = () => {
  const navigate = useNavigate();
  // Get user info from localStorage (set at login)
  const user = JSON.parse(localStorage.getItem('familyUser') || '{}');
  const name = user.name || localStorage.getItem('userName') || '';
  const father_name = user.father_name || '';
  const mother_name = user.mother_name || '';
  const guardian_name = user.guardian_name || '';
  const age = user.age || '';
  const aanganwadi_code = user.aanganwadi_code || '';
  const username = user.username || localStorage.getItem('userId') || '';
  const totalImagesYet = user.totalImagesYet || '';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e8f5e9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 320 }}>
        <h2 style={{ color: '#2E7D32', marginBottom: 16 }}>Welcome, {name}!</h2>
        <div style={{ marginBottom: 16 }}>
          <strong>Username:</strong> {username}<br/>
          <strong>Father Name:</strong> {father_name}<br/>
          <strong>Mother Name:</strong> {mother_name}<br/>
          <strong>Guardian Name:</strong> {guardian_name}<br/>
          <strong>Age:</strong> {age}<br/>
          <strong>Aanganwadi Code:</strong> {aanganwadi_code}<br/>
          <strong>Total Images Yet:</strong> {totalImagesYet}
        </div>
        <button onClick={handleLogout} style={{ background: '#2E7D32', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default FamilyDashboard; 