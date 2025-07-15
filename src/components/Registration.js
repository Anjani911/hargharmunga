import React, { useState } from 'react';
import styled from 'styled-components';
import apiService from '../services/apiService';

const RegistrationContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const RegistrationForm = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin: 15px 0;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  
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
`;

const BackToLogin = styled.div`
  text-align: center;
  margin-top: 20px;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Registration({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    guardian_name: '',
    father_name: '',
    mother_name: '',
    age: '',
    dob: '',
    aanganwadi_code: '',
    weight: '',
    height: '',
    health_status: 'healthy',
    village: '',
    ward: '',
    panchayat: '',
    district: '',
    block: '',
    address: '',
  });
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [pledgePhoto, setPledgePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'plant_photo') setPlantPhoto(files[0]);
    if (name === 'pledge_photo') setPledgePhoto(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const fd = new window.FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (plantPhoto) fd.append('plant_photo', plantPhoto);
      if (pledgePhoto) fd.append('pledge_photo', pledgePhoto);
      // For address, combine if needed
      if (!formData.address) {
        const address = `${formData.village}, Ward ${formData.ward}, Panchayat ${formData.panchayat}, Block ${formData.block}, District ${formData.district}`;
        fd.set('address', address);
      }
      const result = await apiService.uploadFormData('register', fd);
      if (result.success && result.data.success) {
        setMessage({ text: 'Registration successful! You can now login.', type: 'success' });
        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
        }, 2000);
      } else {
        setMessage({ text: (result.data && result.data.message) || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationContainer>
      <RegistrationForm>
        <Title>Register - HGM Admin</Title>
        
        {message.text && (
          <Message className={message.type}>
            {message.text}
          </Message>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="guardian_name">Guardian Name</Label>
            <Input
              type="text"
              id="guardian_name"
              name="guardian_name"
              value={formData.guardian_name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="father_name">Father Name</Label>
            <Input
              type="text"
              id="father_name"
              name="father_name"
              value={formData.father_name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="mother_name">Mother Name</Label>
            <Input
              type="text"
              id="mother_name"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="age">Age</Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="aanganwadi_code">Aanganwadi Code</Label>
            <Input
              type="text"
              id="aanganwadi_code"
              name="aanganwadi_code"
              value={formData.aanganwadi_code}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="health_status">Health Status</Label>
            <Select
              id="health_status"
              name="health_status"
              value={formData.health_status}
              onChange={handleInputChange}
            >
              <option value="healthy">Healthy</option>
              <option value="sick">Sick</option>
              <option value="injured">Injured</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="village">Village</Label>
            <Input
              type="text"
              id="village"
              name="village"
              value={formData.village}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="ward">Ward</Label>
            <Input
              type="text"
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="panchayat">Panchayat</Label>
            <Input
              type="text"
              id="panchayat"
              name="panchayat"
              value={formData.panchayat}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="district">District</Label>
            <Input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="block">Block</Label>
            <Input
              type="text"
              id="block"
              name="block"
              value={formData.block}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">Address (if different from village)</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="plant_photo">Plant Photo</Label>
            <Input
              type="file"
              id="plant_photo"
              name="plant_photo"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="pledge_photo">Pledge Photo</Label>
            <Input
              type="file"
              id="pledge_photo"
              name="pledge_photo"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <BackToLogin>
          <a href="#" onClick={(e) => { e.preventDefault(); if (onSwitchToLogin) onSwitchToLogin(); }}>
            Already have an account? Login here
          </a>
        </BackToLogin>
      </RegistrationForm>
    </RegistrationContainer>
  );
}

export default Registration;
