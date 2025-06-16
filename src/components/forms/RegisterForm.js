// src/components/forms/RegisterForm.js
import React, { useState } from 'react';
import { Box, Alert, Divider, Typography, MenuItem } from '@mui/material';
import CustomInput from '../ui/CustomInput';
import CustomButton from '../ui/CustomButton';
import { ROLES } from '../../constants';

const RegisterForm = ({ onSubmit, switchToLogin, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {formData.password !== formData.confirmPassword && formData.confirmPassword && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Passwords do not match
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <CustomInput
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <CustomInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <CustomInput
          type="select"
          label="Select Role"
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          required
          sx={{ mb: 2 }}
        >
          <MenuItem value={ROLES.HR_MANAGER}>HR Manager</MenuItem>
          <MenuItem value={ROLES.ADMIN_STAFF}>Admin Staff</MenuItem>
          <MenuItem value={ROLES.FIELD_STAFF}>Field Staff</MenuItem>
        </CustomInput>

        <CustomInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <CustomInput
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <CustomButton
          type="submit"
          fullWidth
          gradient
          size="large"
          sx={{ mb: 3, height: 48, fontSize: '1.1rem' }}
          disabled={formData.password !== formData.confirmPassword}
        >
          Create TPA Account
        </CustomButton>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <CustomButton 
          fullWidth
          variant="text"
          onClick={switchToLogin}
          sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 'medium' }}
        >
          Already have an account? Sign in
        </CustomButton>
      </Box>
    </>
  );
};

export default RegisterForm;