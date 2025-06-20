// src/components/dashboard/RecentActivitiesSection.js
import React from 'react';
import { Typography } from '@mui/material';
import CustomCard from '../ui/CustomCard';
import RecentActivities from './RecentActivities';

const RecentActivitiesSection = ({ user }) => {
  return (
    <CustomCard 
      title="Recent Activities"
      sx={{ 
        height: 'auto',
        minHeight: '600px', // Allow it to be taller
        '& .MuiCardContent-root': {
          pb: 1 // Reduce bottom padding for better content flow
        }
      }}
      headerActions={
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ 
            cursor: 'pointer',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          View All
        </Typography>
      }
    >
      <RecentActivities user={user} />
    </CustomCard>
  );
};

export default RecentActivitiesSection;