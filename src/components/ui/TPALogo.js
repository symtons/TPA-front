// src/components/ui/TPALogo.js - Simple working version
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Business } from '@mui/icons-material';

const TPALogo = ({ 
  size = 'medium', 
  showText = true,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizes = {
    small: { width: 60, height: 90 },
    medium: { width: 100, height: 150 },
    large: { width: 140, height: 210 },
    xlarge: { width: 180, height: 270 }
  };

  const currentSize = sizes[size];

  useEffect(() => {
    // Test if image exists
    const img = new Image();
    img.onload = () => {
      console.log('✅ TPA Logo image loaded successfully');
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.log('❌ TPA Logo image not found, using fallback');
      setImageError(true);
    };
    img.src = '/logo-tpa.png';
  }, []);

  // If image loads successfully, show it
  if (imageLoaded) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        {...props}
      >
        <Box 
          sx={{
            width: currentSize.width,
            height: currentSize.height,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            mb: showText ? 2 : 0
          }}
        >
          <img 
            src="/logo-tpa.png"
            alt="Tennessee Personal Assistance"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: 'white'
            }}
          />
        </Box>
        
        {showText && (
          <Typography 
            variant="body2" 
            color="inherit" 
            sx={{ opacity: 0.9, textAlign: 'center', mt: 1 }}
          >
            Tennessee Personal Assistance
          </Typography>
        )}
      </Box>
    );
  }

  // Fallback: Custom TPA logo design
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      {...props}
    >
      <Box 
        sx={{
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: showText ? 2 : 0,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          color: 'white',
          textAlign: 'center',
          p: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            opacity: 0.3
          }}
        />
        
        {/* TPA Text */}
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{ 
            mb: 1,
            fontSize: currentSize.width * 0.25,
            zIndex: 1
          }}
        >
          TPA
        </Typography>
        
        {/* White circle with orange center */}
        <Box
          sx={{
            width: currentSize.width * 0.6,
            height: currentSize.width * 0.4,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            zIndex: 1
          }}
        >
          <Box
            sx={{
              width: currentSize.width * 0.3,
              height: currentSize.width * 0.3,
              borderRadius: '50%',
              background: '#ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {/* Tennessee stars */}
            <Box sx={{ color: 'white', fontSize: currentSize.width * 0.08 }}>
              ★ ★ ★
            </Box>
          </Box>
        </Box>
        
        {/* Support figures representation */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 0.5, 
            alignItems: 'flex-end',
            zIndex: 1
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: currentSize.width * 0.06,
                height: currentSize.width * 0.1 + (i % 2 === 0 ? 0 : currentSize.width * 0.02),
                borderRadius: '50% 50% 0 0',
                background: i === 2 ? '#ff9800' : ['#2196f3', '#ffc107', '#ff9800', '#ffc107', '#2196f3'][i],
                opacity: 0.8
              }}
            />
          ))}
        </Box>
        
        {/* Bottom text */}
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1,
            fontSize: currentSize.width * 0.06,
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          TENNESSEE PERSONAL ASSISTANCE
        </Typography>
      </Box>
      
      {showText && (
        <Typography 
          variant="body2" 
          color="inherit" 
          sx={{ opacity: 0.9, textAlign: 'center', mt: 1 }}
        >
          Empowering Tennessee Communities
        </Typography>
      )}
    </Box>
  );
};

export default TPALogo;