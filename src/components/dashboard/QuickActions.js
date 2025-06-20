// src/components/dashboard/QuickActions.js
import React from 'react';
import { Grid, Button, Box } from '@mui/material';
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
import { ROLES } from '../../constants';

const QuickActions = ({ user, onActionClick }) => {
  // Role-based quick actions configuration
  const getActionsForRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { key: 'employees', label: 'Manage Employees', icon: <People />, color: 'primary' },
          { key: 'schedule', label: 'Schedule Shifts', icon: <Schedule />, color: 'info' },
          { key: 'reports', label: 'View Reports', icon: <Assessment />, color: 'success' },
          { key: 'settings', label: 'System Settings', icon: <Settings />, color: 'warning' },
          { key: 'analytics', label: 'Analytics', icon: <Analytics />, color: 'secondary' },
          { key: 'backup', label: 'System Backup', icon: <Backup />, color: 'error' }
        ];

      case ROLES.HR_MANAGER:
        return [
          { key: 'employees', label: 'Manage Employees', icon: <People />, color: 'primary' },
          { key: 'leave-requests', label: 'Leave Requests', icon: <RequestPage />, color: 'warning' },
          { key: 'onboarding', label: 'Onboarding', icon: <Assignment />, color: 'success' },
          { key: 'reports', label: 'HR Reports', icon: <Assessment />, color: 'info' }
        ];

      case ROLES.ADMIN_STAFF:
        return [
          { key: 'time-tracking', label: 'Time & Attendance', icon: <AccessTime />, color: 'primary' },
          { key: 'request-leave', label: 'Request Leave', icon: <RequestPage />, color: 'warning' },
          { key: 'my-profile', label: 'My Profile', icon: <Person />, color: 'info' }
        ];

      case ROLES.FIELD_STAFF:
        return [
          { key: 'time-tracking', label: 'Clock In/Out', icon: <AccessTime />, color: 'primary' },
          { key: 'tasks', label: 'My Tasks', icon: <Assignment />, color: 'success' }
        ];

      default:
        return [];
    }
  };

  const actions = getActionsForRole(user.role);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={actions.length <= 2 ? 6 : actions.length <= 4 ? 6 : 4} key={index}>
            <Button
              variant="contained"
              fullWidth
              color={action.color}
              startIcon={action.icon}
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
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;