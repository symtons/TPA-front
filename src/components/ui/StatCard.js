// src/components/ui/StatCard.js
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const StatCard = ({ 
  title, 
  value, 
  color = 'primary', 
  icon,
  trend,
  subtitle
}) => {
  const getColorValue = (color) => {
    const colors = {
      primary: '#1976d2',
      secondary: '#ff9800',
      success: '#4caf50',
      warning: '#ffc107',
      error: '#f44336',
      info: '#2196f3'
    };
    return colors[color] || colors.primary;
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography 
              color="text.secondary" 
              gutterBottom 
              variant="body2"
              fontWeight="medium"
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="h2"
              fontWeight="bold"
              color={`${color}.main`}
              sx={{ mb: 1 }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Avatar
              sx={{
                bgcolor: `${color}.main`,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>
        
        {/* Decorative gradient bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${getColorValue(color)}, ${getColorValue('secondary')})`
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatCard;