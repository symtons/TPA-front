// src/components/ui/CustomCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CustomCard = ({ 
  title, 
  children, 
  elevation = 2, 
  gradient = false,
  headerActions,
  ...props 
}) => {
  const gradientStyle = gradient ? {
    background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
    color: 'white'
  } : {};

  return (
    <Card
      elevation={elevation}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        ...props.sx
      }}
      {...props}
    >
      {title && (
        <Box 
          sx={{ 
            p: 3, 
            pb: title && !headerActions ? 2 : 3,
            ...gradientStyle,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            component="h2" 
            fontWeight="bold"
            color={gradient ? 'inherit' : 'text.primary'}
          >
            {title}
          </Typography>
          {headerActions && (
            <Box>{headerActions}</Box>
          )}
        </Box>
      )}
      <CardContent sx={{ p: 3, pt: title ? 2 : 3 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default CustomCard;