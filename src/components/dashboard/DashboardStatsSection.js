// src/components/dashboard/DashboardStatsSection.js
import React from 'react';
import { Box } from '@mui/material';
import DashboardStats from './DashboardStats';

const DashboardStatsSection = ({ user }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <DashboardStats user={user} />
    </Box>
  );
};

export default DashboardStatsSection;