// =============================================================================
// EMPLOYEE ONBOARDING ROUTE WRAPPER
// File: src/components/onboarding/EmployeeOnboardingPage.js (New file)
// =============================================================================

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import EmployeeOnboarding from './EmployeeOnboarding';
import { Alert, Box, Typography } from '@mui/material';

const EmployeeOnboardingPage = () => {
  const { user } = useAuth();

  // Check if user is an employee (not admin/HR)
  const isEmployee = user?.role?.includes('Employee') || user?.role === 'Employee';

  if (!isEmployee) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="info" sx={{ maxWidth: 500 }}>
          <Typography variant="h6">Employee Onboarding</Typography>
          <Typography>This page is only available for employees. Administrators and HR staff should use the Onboarding Management section.</Typography>
        </Alert>
      </Box>
    );
  }

  return <EmployeeOnboarding />;
};

export default EmployeeOnboardingPage;