// src/components/forms/LoginForm.js
import React, { useState } from 'react';
import { Box, Alert, Divider, Typography, MenuItem, Paper, Stack } from '@mui/material';
import { Person, Visibility, VisibilityOff } from '@mui/icons-material';
import CustomInput from '../ui/CustomInput';
import CustomButton from '../ui/CustomButton';
import { ROLES } from '../../constants';

const LoginForm = ({ onSubmit, switchToRegister, error }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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

      <Box component="form" onSubmit={handleSubmit}>
        <CustomInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <CustomInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <Box 
                sx={{ cursor: 'pointer', p: 1 }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </Box>
            )
          }}
        />

        <CustomButton
          type="submit"
          fullWidth
          gradient
          size="large"
          sx={{ mb: 3, height: 48, fontSize: '1.1rem' }}
        >
          Sign In to TPA
        </CustomButton>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <CustomButton 
          fullWidth
          variant="text"
          onClick={switchToRegister}
          sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 'medium' }}
        >
          Don't have an account? Create one
        </CustomButton>
      </Box>

      {/* Demo Credentials */}
      <Paper 
        sx={{ 
          mt: 4, 
          p: 3, 
          bgcolor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}
      >
        <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
          🔑 Demo Access Credentials
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2"><strong>Admin:</strong> admin@company.com / admin123</Typography>
          <Typography variant="body2"><strong>HR Manager:</strong> hr@company.com / hr123</Typography>
          <Typography variant="body2"><strong>Admin Staff:</strong> staff@company.com / staff123</Typography>
          <Typography variant="body2"><strong>Field Staff:</strong> field@company.com / field123</Typography>
        </Stack>
      </Paper>
    </>
  );
};

export default LoginForm;