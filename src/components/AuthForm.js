// src/components/AuthForm.js
import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import { Person, Business } from '@mui/icons-material';
import { ROLES } from '../constants';
import { mockUsers } from '../data/mockData';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    role: '' 
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = mockUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials');
      }
    } else {
      if (formData.name && formData.email && formData.password && formData.role) {
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };
        onLogin(newUser);
      } else {
        setError('Please fill all fields');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 50%, #ffc107 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', minHeight: '600px' }}>
            {/* Left Side - Branding */}
            <Box 
              sx={{
                flex: 1,
                background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                color: 'white',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              {/* TPA Logo Area */}
              <Box 
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                <Box 
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Tennessee stars representation */}
                  <Box sx={{ position: 'relative' }}>
                    <Business sx={{ fontSize: 40, color: '#ff9800' }} />
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#1976d2'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                TPA
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Tennessee Personal Assistance
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 300 }}>
                Empowering communities through comprehensive personal assistance services across Tennessee
              </Typography>
              
              {/* Decorative elements */}
              <Box sx={{ mt: 4, display: 'flex', gap: 1 }}>
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.6)',
                      animation: `pulse 2s infinite ${i * 0.5}s`
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box sx={{ flex: 1, p: 4 }}>
              <Box sx={{ maxWidth: 400, mx: 'auto', mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48
                    }}
                  >
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {isLogin ? 'Welcome Back' : 'Join Us'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </Typography>
                  </Box>
                </Stack>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <TextField
                      fullWidth
                      label="Full Name"
                      margin="normal"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required={!isLogin}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  {!isLogin && (
                    <FormControl 
                      fullWidth 
                      margin="normal"
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      <InputLabel>Select Role</InputLabel>
                      <Select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        required={!isLogin}
                      >
                        <MenuItem value={ROLES.HR_MANAGER}>HR Manager</MenuItem>
                        <MenuItem value={ROLES.ADMIN_STAFF}>Admin Staff</MenuItem>
                        <MenuItem value={ROLES.FIELD_STAFF}>Field Staff</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 3, 
                      mb: 3,
                      borderRadius: 2,
                      height: 48,
                      background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {isLogin ? 'Sign In to TPA' : 'Create TPA Account'}
                  </Button>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Button 
                    fullWidth
                    onClick={() => setIsLogin(!isLogin)}
                    sx={{ 
                      textTransform: 'none',
                      color: 'primary.main',
                      fontWeight: 'medium'
                    }}
                  >
                    {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                  </Button>
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
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthForm;