// src/components/ui/CustomButton.js
import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ 
  children, 
  variant = 'contained', 
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  gradient = false,
  ...props 
}) => {
  const gradientStyle = gradient ? {
    background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    '&:hover': {
      background: 'linear-gradient(45deg, #1565c0 30%, #f57c00 90%)',
    }
  } : {};

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        ...gradientStyle,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;