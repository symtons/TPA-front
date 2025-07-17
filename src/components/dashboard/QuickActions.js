// src/components/dashboard/QuickActions.js - Updated with HR Action Form
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
  AccessTime,
  Description,
  SupervisorAccount
} from '@mui/icons-material';
import dashboardApi from '../../services/dashboardApi';
import { ROLES } from '../../constants';

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
  'AccessTime': AccessTime,
  'Description': Description,
  'SupervisorAccount': SupervisorAccount
};

const QuickActions = ({ user, onActionClick }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          dashboardApi.refreshToken();
          const response = await dashboardApi.getQuickActions(user.role);
          
          if (response.success) {
            // Add HR Action Form to existing API actions
            const apiActions = response.data;
            const hrActions = getHRActions(user.role);
            setActions([...hrActions, ...apiActions]);
          } else {
            // Fallback to default actions if API fails
            setActions(getDefaultActions(user.role));
          }
        } catch (apiError) {
          console.log('API unavailable, using default actions');
          // Fallback to default actions
          setActions(getDefaultActions(user.role));
        }
      } catch (err) {
        console.error('Error fetching quick actions:', err);
        setActions(getDefaultActions(user.role));
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchActions();
    }
  }, [user?.role]);

  // HR Action Form actions for all users
  const getHRActions = (role) => {
    const baseHRActions = [
      {
        key: 'hr_action_form',
        label: 'HR Action Form',
        icon: 'Description',
        color: '#ff5722'
      }
    ];

    // Add HR Management for Admin and HR Manager
    if (role === ROLES.ADMIN || role === ROLES.HR_MANAGER) {
      baseHRActions.push({
        key: 'hr_management',
        label: 'HR Management',
        icon: 'SupervisorAccount',
        color: '#9c27b0'
      });
    }

    return baseHRActions;
  };

  // Default actions based on role (fallback)
  const getDefaultActions = (role) => {
    const hrActions = getHRActions(role);
    
    switch (role) {
      case ROLES.ADMIN:
        return [
          ...hrActions,
          {
            key: 'employees',
            label: 'Manage Employees',
            icon: 'People',
            color: '#1976d2'
          },
          {
            key: 'settings',
            label: 'System Settings',
            icon: 'Settings',
            color: '#ff9800'
          },
          {
            key: 'view-attendance',
            label: 'View Reports',
            icon: 'Assessment',
            color: '#4caf50'
          }
        ];

      case ROLES.HR_MANAGER:
        return [
          ...hrActions,
          {
            key: 'employees',
            label: 'Employee Directory',
            icon: 'People',
            color: '#1976d2'
          },
          {
            key: 'leave-requests',
            label: 'Leave Requests',
            icon: 'RequestPage',
            color: '#ff9800'
          },
          {
            key: 'onboarding',
            label: 'Onboarding Tasks',
            icon: 'Assignment',
            color: '#4caf50'
          }
        ];

      case ROLES.ADMIN_STAFF:
        return [
          ...hrActions,
          {
            key: 'clock-toggle',
            label: 'Clock In/Out',
            icon: 'AccessTime',
            color: '#607d8b'
          },
          {
            key: 'request-leave',
            label: 'Request Leave',
            icon: 'RequestPage',
            color: '#ff9800'
          },
          {
            key: 'view-timesheet',
            label: 'View Timesheet',
            icon: 'Schedule',
            color: '#2196f3'
          }
        ];

      case ROLES.FIELD_STAFF:
        return [
          ...hrActions,
          {
            key: 'clock-toggle',
            label: 'Clock In/Out',
            icon: 'AccessTime',
            color: '#607d8b'
          },
          {
            key: 'request-leave',
            label: 'Request Leave',
            icon: 'RequestPage',
            color: '#ff9800'
          },
          {
            key: 'schedule',
            label: 'My Schedule',
            icon: 'Schedule',
            color: '#9c27b0'
          }
        ];

      default:
        return hrActions;
    }
  };

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

  const getButtonColor = (colorHex) => {
    // Convert hex colors to Material-UI color names for best compatibility
    const colorMap = {
      '#1976d2': 'primary',
      '#ff9800': 'warning', 
      '#4caf50': 'success',
      '#f44336': 'error',
      '#9c27b0': 'secondary',
      '#607d8b': 'info',
      '#2196f3': 'info',
      '#ff5722': 'error'
    };
    return colorMap[colorHex] || 'primary';
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={2}>
        {actions.map((action, index) => {
          const IconComponent = iconMap[action.icon] || Assignment;
          const buttonColor = getButtonColor(action.color);
          
          return (
            <Grid item xs={12} sm={6} md={actions.length <= 2 ? 6 : actions.length <= 4 ? 6 : 4} key={index}>
              <Button
                variant="contained"
                fullWidth
                color={buttonColor}
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
                  },
                  // Custom colors for HR actions
                  ...(action.key === 'hr_action_form' && {
                    backgroundColor: '#ff5722',
                    '&:hover': {
                      backgroundColor: '#e64a19',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
                    }
                  }),
                  ...(action.key === 'hr_management' && {
                    backgroundColor: '#9c27b0',
                    '&:hover': {
                      backgroundColor: '#7b1fa2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
                    }
                  })
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