import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import authService from '../services/authService';

const TestContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const TestSection = styled.div`
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const TestButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #45a049;
  }
`;

const Result = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  white-space: pre-wrap;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
`;

const Input = styled.input`
  padding: 8px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

function BackendTester() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'user'
  });

  const addResult = (testName, result, type = 'info') => {
    setResults(prev => ({
      ...prev,
      [testName]: { result, type, timestamp: new Date().toLocaleTimeString() }
    }));
  };

  const setTestLoading = (testName, isLoading) => {
    setLoading(prev => ({
      ...prev,
      [testName]: isLoading
    }));
  };

  const testConnection = async () => {
    setTestLoading('connection', true);
    try {
      const result = await authService.testConnection();
      addResult('connection', JSON.stringify(result, null, 2), result.success ? 'success' : 'error');
    } catch (error) {
      addResult('connection', `Error: ${error.message}`, 'error');
    }
    setTestLoading('connection', false);
  };

  const testLogin = async () => {
    if (!loginData.username || !loginData.password) {
      addResult('login', 'Please enter username and password', 'error');
      return;
    }

    setTestLoading('login', true);
    try {
      const result = await authService.login(loginData);
      addResult('login', JSON.stringify(result, null, 2), result.success ? 'success' : 'error');
    } catch (error) {
      addResult('login', `Error: ${error.message}`, 'error');
    }
    setTestLoading('login', false);
  };

  const testRegister = async () => {
    if (!registerData.username || !registerData.email || !registerData.password) {
      addResult('register', 'Please fill all required fields', 'error');
      return;
    }

    setTestLoading('register', true);
    try {
      const result = await authService.register(registerData);
      addResult('register', JSON.stringify(result, null, 2), result.success ? 'success' : 'error');
    } catch (error) {
      addResult('register', `Error: ${error.message}`, 'error');
    }
    setTestLoading('register', false);
  };

  const testGetDetails = async () => {
    setTestLoading('details', true);
    try {
      const result = await authService.getUserDetails();
      addResult('details', JSON.stringify(result, null, 2), result.success ? 'success' : 'error');
    } catch (error) {
      addResult('details', `Error: ${error.message}`, 'error');
    }
    setTestLoading('details', false);
  };

  useEffect(() => {
    // Auto-test connection on component mount
    testConnection();
  }, []);

  return (
    <TestContainer>
      <Title>🧪 Backend API Tester</Title>
      <p>Test your backend APIs: <strong>https://grx6djfl-5000.inc1.devtunnels.ms</strong></p>

      <TestSection>
        <h3>🔗 Connection Test</h3>
        <TestButton onClick={testConnection} disabled={loading.connection}>
          {loading.connection ? 'Testing...' : 'Test Root Endpoint (/)'}
        </TestButton>
        {results.connection && (
          <Result className={results.connection.type}>
            [{results.connection.timestamp}] {results.connection.result}
          </Result>
        )}
      </TestSection>

      <TestSection>
        <h3>👤 Login Test</h3>
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
          />
          <TestButton onClick={testLogin} disabled={loading.login}>
            {loading.login ? 'Testing...' : 'Test Login (/login)'}
          </TestButton>
        </div>
        {results.login && (
          <Result className={results.login.type}>
            [{results.login.timestamp}] {results.login.result}
          </Result>
        )}
      </TestSection>

      <TestSection>
        <h3>📝 Registration Test</h3>
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
          />
          <Input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
          />
          <Input
            type="text"
            placeholder="Full Name"
            value={registerData.name}
            onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
          />
          <TestButton onClick={testRegister} disabled={loading.register}>
            {loading.register ? 'Testing...' : 'Test Register (/register)'}
          </TestButton>
        </div>
        {results.register && (
          <Result className={results.register.type}>
            [{results.register.timestamp}] {results.register.result}
          </Result>
        )}
      </TestSection>

      <TestSection>
        <h3>📋 User Details Test</h3>
        <TestButton onClick={testGetDetails} disabled={loading.details}>
          {loading.details ? 'Testing...' : 'Test Get Details (/details)'}
        </TestButton>
        {results.details && (
          <Result className={results.details.type}>
            [{results.details.timestamp}] {results.details.result}
          </Result>
        )}
      </TestSection>

      <TestSection>
        <h3>📝 API Information</h3>
        <Result className="info">
          <strong>Available Endpoints:</strong>
          {'\n'}• GET  / (Root endpoint)
          {'\n'}• POST /login (User login)
          {'\n'}• POST /register (User registration)
          {'\n'}• GET  /details (User details)
          {'\n'}
          {'\n'}<strong>Backend URL:</strong> https://grx6djfl-5000.inc1.devtunnels.ms
          {'\n'}
          {'\n'}<strong>Expected Request/Response Format:</strong>
          {'\n'}Login: {"{ username, password }"}
          {'\n'}Register: {"{ username, email, password, name, role }"}
        </Result>
      </TestSection>
    </TestContainer>
  );
}

export default BackendTester;
