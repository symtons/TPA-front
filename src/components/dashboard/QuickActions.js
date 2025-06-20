// =============================================================================
// FRONTEND STEP 3: UPDATED QUICK ACTIONS COMPONENT
// File: src/components/dashboard/QuickActions.js (Replace existing)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Grid, Button, Box, CircularProgress, Typography } from '@mui/material';
import {
  People,
  Schedule,
  Assessment,
  Settings,
  Analytics,
  Backup,
  RequestPage,
  Assignment,
  Person,
  AccessTime
} from '@mui/icons-material';
import dashboardApi from '../../services/dashboardApi';

const iconMap = {
  'People': People,
  'Schedule': Schedule,
  'Assessment': Assessment,
  'Settings': Settings,
  'Analytics': Analytics,
  'Backup': Backup,
  'RequestPage': RequestPage,
  'Assignment': Assignment,
  'Person': Person,
  'AccessTime': AccessTime
};

const QuickActions = ({ user, onActionClick }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        dashboardApi.refreshToken(); // Refresh token before making request
        const response = await dashboardApi.getQuickActions(user.role);
        
        if (response.success) {
          setActions(response.data);
        } else {
          setError('Failed to load quick actions');
        }
      } catch (err) {
        console.error('Error fetching quick actions:', err);
        setError('Error loading quick actions');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchActions();
    }
  }, [user?.role]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getButtonColor = (colorName) => {
    const colorMap = {
      'primary': 'primary',
      'secondary': 'secondary',
      'success': 'success',
      'warning': 'warning',
      'error': 'error',
      'info': 'info'
    };
    return colorMap[colorName] || 'primary';
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={2}>
        {actions.map((action, index) => {
          const IconComponent = iconMap[action.icon] || Assignment;
          
          return (
            <Grid item xs={12} sm={6} md={actions.length <= 2 ? 6 : actions.length <= 4 ? 6 : 4} key={index}>
              <Button
                variant="contained"
                fullWidth
                color={getButtonColor(action.color)}
                startIcon={<IconComponent />}
                onClick={() => onActionClick(action.key)}
                sx={{
                  py: 2,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
                  }
                }}
              >
                {action.label}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default QuickActions;