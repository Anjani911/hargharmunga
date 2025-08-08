import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useApi';
import apiService from '../services/apiService';


const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2E7D32, #4CAF50, #66BB6A);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }
`;

const LeftSection = styled.div`
  background: #4CAF50;
  border-radius: 16px;
  padding: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const TreeIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  position: relative;
`;

const TreeParts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const TreeLeaves = styled.div`
  position: relative;
  
  .leaf {
    position: absolute;
    background: #2E7D32;
    color: white;
    padding: 4px 8px;
    border-radius: 50px;
    font-size: 10px;
    font-weight: bold;
  }
  
  .leaf:nth-child(1) { top: -30px; left: -40px; }
  .leaf:nth-child(2) { top: -40px; right: -30px; }
  .leaf:nth-child(3) { top: -20px; left: -60px; }
  .leaf:nth-child(4) { top: -20px; right: -50px; }
  .leaf:nth-child(5) { bottom: -10px; left: -45px; }
  .leaf:nth-child(6) { bottom: -10px; right: -35px; }
`;

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin: 20px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  opacity: 0.9;
`;

const FeatureList = styled.div`
  text-align: left;
  width: 100%;
  
  .feature {
    display: flex;
    align-items: center;
    margin: 12px 0;
    font-size: 14px;
    
    .icon {
      margin-right: 12px;
      font-size: 18px;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    font-size: 28px;
    color: #1a1a1a;
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 50px 15px 15px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4CAF50;
  font-size: 20px;
`;

const LoginButton = styled.button`
  background: #2E7D32;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #1B5E20;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RememberSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  
  label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    
    input {
      margin-right: 8px;
    }
  }
  
  a {
    color: #4CAF50;
    text-decoration: none;
    font-size: 14px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 12px;
  
  .powered {
    margin-top: 10px;
    
    .org {
      color: #4CAF50;
      font-weight: bold;
    }
  }
`;

const TestButton = styled.button`
  background: #FF9800;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin: 10px 0;
  transition: background 0.3s;
  
  &:hover {
    background: #F57C00;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ConnectionStatus = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  
  &.success {
    background: #e8f5e8;
    color: #2e7d32;
    border: 1px solid #4caf50;
  }
  
  &.error {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #f44336;
  }
  
  &.info {
    background: #e3f2fd;
    color: #1565c0;
    border: 1px solid #2196f3;
  }
`;

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
    setConnectionStatus('');
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus('');
    
    try {
      const result = await apiService.post('login', {
        username: credentials.username,
        password: credentials.password
});


      
      if (result.success) {
  localStorage.setItem('authToken', result.data.token);
}
 else {
        setConnectionStatus('Backend connection failed. Using demo mode.');
      }
    } catch (error) {
      setConnectionStatus('Backend connection failed. Using demo mode.');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('=== LOGIN DEBUG START ===');
    console.log('Login attempt with credentials:', credentials);

    try {
      console.log('Calling login function...');
      const result = await login(credentials);
      console.log('Login result received:', result);
      
      if (result && result.success) {
        // Role-based navigation
        const userRole = result.data?.user?.role || result.data?.role || '';
        localStorage.setItem('userRole', userRole);
        if (userRole === 'family') {
          // Store full user object for family dashboard
          localStorage.setItem('familyUser', JSON.stringify(result.data.user));
          navigate('/family-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.log('Login failed:', result);
        setError(result?.message || 'Login failed - Invalid credentials');
      }
    } catch (err) {
      console.error('Login error caught:', err);
      setError('Login error: ' + err.message);
    } finally {
      console.log('=== LOGIN DEBUG END ===');
      setLoading(false);
    }
  };

  if (false) { // Removed registration functionality
    return null;
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LeftSection>
          <TreeIcon>
            
          </TreeIcon>
          
          <MainTitle>हर घर मुंगा</MainTitle>
          
          <Subtitle>
            हर घर मुंगा योजना एडमिन पैनल में आपका स्वागत है।
            पोषणयुक्त आहार के लिए एक कदम आगे।
          </Subtitle>
          
          <FeatureList>
            <div className="feature">
              <span className="icon"></span>
              पौधा प्रबंधन व्यवस्था
            </div>
            <div className="feature">
              <span className="icon"></span>
              माता/हितग्राही प्रबंधन सिस्टम
            </div>
            <div className="feature">
              <span className="icon"></span>
              रिपोर्ट और विश्लेषण
            </div>
            <div className="feature">
              <span className="icon"></span>
              सुरक्षित डेटा प्रबंधन
            </div>
          </FeatureList>
        </LeftSection>

        <RightSection>
          <LoginHeader>
            <h2>एडमिन लॉगिन</h2>
            <p>कृपया अपनी जानकारी दर्ज करें</p>
          </LoginHeader>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Input
                type="text"
                name="username"
                placeholder="उपयोगकर्ता आईडी"
                value={credentials.username}
                onChange={handleInputChange}
                required
              />
              <InputIcon></InputIcon>
            </InputGroup>

            <InputGroup>
              <Input
                type="password"
                name="password"
                placeholder="पासवर्ड"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
              <InputIcon>🔒</InputIcon>
            </InputGroup>

            {error && (
              <ConnectionStatus className="error">{error}</ConnectionStatus>
            )}

            <RememberSection>
              <label>
                <input type="checkbox" />
                मुझे याद रखें
              </label>
              <a href="#forgot">पासवर्ड भूल गए?</a>
            </RememberSection>

            <LoginButton type="submit" disabled={loading}>
              {loading ? 'लॉगिन करे...' : '🚀 लॉगिन करें'}
            </LoginButton>
          </Form>

          <Footer>
            © 2024 हर घर मुंगा योजना। सभी अधिकार सुरक्षित।
            <div className="powered">
              <span className="org">Powered by SSIPMT</span>
            </div>
          </Footer>
        </RightSection>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
