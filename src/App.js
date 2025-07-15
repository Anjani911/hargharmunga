import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FamilyDashboard from './components/FamilyDashboard';
import AnganvadiDashboard from './components/AnganvadiDashboard';   // ← NEW import
import { authService } from './services';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = authService.isAuthenticated();
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- public login page --- */}
          <Route path="/" element={<Login />} />

          {/* --- protected dashboards --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-dashboard"
            element={
              <ProtectedRoute>
                <FamilyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anganvadi-dashboard"          /* NEW protected route */
            element={
              <ProtectedRoute>
                <AnganvadiDashboard />
              </ProtectedRoute>
            }
          />

          {/* --- catch‑all redirect --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
