import React, { useState } from 'react';
import apiService from '../services/apiService';

const FamilyManagement = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiService.get('search', { query });
      if (res.success) {
        setResults(res.data);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError('Search error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Family Search</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or mobile number"
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, background: '#4CAF50', color: 'white', border: 'none' }}>
          Search
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {results.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Child Name</th>
              <th>Parent Name</th>
              <th>Mobile Number</th>
              <th>Village</th>
              <th>Plant Distributed</th>
            </tr>
          </thead>
          <tbody>
            {results.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.childName}</td>
                <td>{row.parentName}</td>
                <td>{row.mobileNumber}</td>
                <td>{row.village}</td>
                <td>{row.plantDistributed ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FamilyManagement;
