// src/components/dashboard/QuickActions.js
import React from 'react';
import { Grid, Box, Typography, Avatar } from '@mui/material';
import {
  People,
  Schedule,
  Assessment,
  Settings,
  PersonAdd,
  RequestPage,
  AccessTime,
  Assignment,
  Business,
  Analytics
} from '@mui/icons-material';
import CustomButton from '../ui/CustomButton';
import { ROLES } from '../../constants';

const QuickActions = ({ user, onActionClick }) => {
  const getActionsForRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          {
            title: 'MANAGE EMPLOYEES',
            icon: <People />,
            color: '#1976d2',
            action: 'employees'
          },
          {
            title: 'SCHEDULE SHIFTS',
            icon: <Schedule />,
            color: '#1976d2',
            action: 'schedule'
          },
          {
            title: 'VIEW REPORTS',
            icon: <Assessment />,
            color: '#1976d2',
            action: 'reports'
          },
          {
            title: 'SYSTEM SETTINGS',
            icon: <Settings />,
            color: '#1976d2',
            action: 'settings'
          }
        ];
      case ROLES.HR_MANAGER:
        return [
          {
            title: 'ADD NEW EMPLOYEE',
            icon: <PersonAdd />,
            color: '#1976d2',
            action: 'add-employee'
          },
          {
            title: 'REVIEW LEAVE REQUESTS',
            icon: <RequestPage />,
            color: '#1976d2',
            action: 'leave-requests'
          },
          {
            title: 'ONBOARDING TASKS',
            icon: <Assignment />,
            color: '#1976d2',
            action: 'onboarding'
          },
          {
            title: 'EMPLOYEE DIRECTORY',
            icon: <People />,
            color: '#1976d2',
            action: 'employees'
          }
        ];
      case ROLES.ADMIN_STAFF:
        return [
          {
            title: 'CLOCK IN/OUT',
            icon: <AccessTime />,
            color: '#1976d2',
            action: 'time-tracking'
          },
          {
            title: 'REQUEST LEAVE',
            icon: <RequestPage />,
            color: '#1976d2',
            action: 'request-leave'
          },
          {
            title: 'VIEW SCHEDULE',
            icon: <Schedule />,
            color: '#1976d2',
            action: 'schedule'
          },
          {
            title: 'MY TASKS',
            icon: <Assignment />,
            color: '#1976d2',
            action: 'tasks'
          }
        ];
      case ROLES.FIELD_STAFF:
        return [
          {
            title: 'CLOCK IN/OUT',
            icon: <AccessTime />,
            color: '#1976d2',
            action: 'time-tracking'
          },
          {
            title: 'VIEW TASKS',
            icon: <Assignment />,
            color: '#1976d2',
            action: 'tasks'
          },
          {
            title: 'CHECK SCHEDULE',
            icon: <Schedule />,
            color: '#1976d2',
            action: 'schedule'
          },
          {
            title: 'LOCATION CHECK',
            icon: <Business />,
            color: '#1976d2',
            action: 'location'
          }
        ];
      default:
        return [];
    }
  };

  const actions = getActionsForRole(user.role);

  return (
    <Grid container spacing={3}>
      {actions.map((action, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <CustomButton
            fullWidth
            onClick={() => onActionClick && onActionClick(action.action)}
            sx={{
              height: 80,
              background: action.color,
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: '#1565c0',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 32,
                height: 32,
                mb: 0.5
              }}
            >
              {action.icon}
            </Avatar>
            <Typography variant="body2" fontWeight="bold" textAlign="center">
              {action.title}
            </Typography>
          </CustomButton>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickActions;