// src/components/layout/AuthLayout.js
import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import TPALogo from '../ui/TPALogo';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 50%, #ff6f00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            minHeight: '600px'
          }}
        >
          <Box sx={{ display: 'flex', minHeight: '600px' }}>
            {/* Left Side - TPA Branding */}
            <Box 
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white',
                p: 4,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
                    radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  opacity: 0.3
                }}
              />
              
              {/* TPA Logo */}
              <TPALogo 
                size="xlarge"
                showText={false}
                sx={{ zIndex: 1 }}
              />
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2,
                  mb: 2, 
                  opacity: 0.9, 
                  maxWidth: 350,
                  zIndex: 1,
                  fontWeight: 500,
                  letterSpacing: 0.5
                }}
              >
                Empowering communities through comprehensive personal assistance services across Tennessee
              </Typography>
              
              {/* Decorative elements */}
              <Box sx={{ mt: 4, display: 'flex', gap: 1, zIndex: 1 }}>
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.6)',
                      animation: `pulse 2s infinite ${i * 0.5}s`,
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.6 },
                        '50%': { opacity: 1 }
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box 
              sx={{ 
                flex: 1, 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
            >
              <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
                {/* Mobile Logo */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
                  <TPALogo size="medium" showText={false} />
                </Box>
                
                {title && (
                  <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                      {title}
                    </Typography>
                    {subtitle && (
                      <Typography variant="body1" color="text.secondary">
                        {subtitle}
                      </Typography>
                    )}
                  </Box>
                )}
                
                {children}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;