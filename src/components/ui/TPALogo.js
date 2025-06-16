// src/components/ui/TPALogo.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Business } from '@mui/icons-material';

const TPALogo = ({ 
  size = 'medium', 
  showText = true, 
  variant = 'default',
  ...props 
}) => {
  const sizes = {
    small: { container: 60, inner: 40, icon: 20, text: 'body1' },
    medium: { container: 80, inner: 60, icon: 30, text: 'h6' },
    large: { container: 120, inner: 80, icon: 40, text: 'h4' },
    xlarge: { container: 160, inner: 120, icon: 60, text: 'h3' }
  };

  const currentSize = sizes[size];

  const logoStyles = {
    default: {
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255,255,255,0.3)'
    },
    solid: {
      background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
      border: 'none'
    },
    minimal: {
      background: 'white',
      border: '2px solid #e0e0e0'
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      {...props}
    >
      <Box 
        sx={{
          width: currentSize.container,
          height: currentSize.container,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: showText ? 2 : 0,
          ...logoStyles[variant]
        }}
      >
        <Box 
          sx={{
            width: currentSize.inner,
            height: currentSize.inner,
            borderRadius: '50%',
            background: variant === 'minimal' ? '#1976d2' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Business 
              sx={{ 
                fontSize: currentSize.icon, 
                color: variant === 'minimal' ? 'white' : '#ff9800' 
              }} 
            />
            <Box 
              sx={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#1976d2'
              }}
            />
          </Box>
        </Box>
      </Box>
      
      {showText && (
        <>
          <Typography 
            variant={currentSize.text} 
            fontWeight="bold" 
            color="inherit"
            sx={{ mb: 0.5 }}
          >
            TPA
          </Typography>
          {size === 'large' || size === 'xlarge' ? (
            <Typography 
              variant="body2" 
              color="inherit" 
              sx={{ opacity: 0.8, textAlign: 'center' }}
            >
              Tennessee Personal Assistance
            </Typography>
          ) : null}
        </>
      )}
    </Box>
  );
};

export default TPALogo;