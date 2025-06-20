// src/components/dashboard/DashboardStats.js
import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import {
  People,
  PendingActions,
  Schedule,
  CheckCircle,
  RequestPage,
  Assignment,
  AccessTime,
  Analytics,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { ROLES } from '../../constants';

const DashboardStats = ({ user }) => {
  // Role-based statistics configuration
  const getStatsForRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          {
            title: 'Total Employees',
            value: '142',
            subtitle: 'Active staff members',
            icon: <People />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
          },
          {
            title: 'Pending Requests',
            value: '24',
            subtitle: 'Awaiting approval',
            icon: <Warning />,
            color: '#f57c00',
            bgColor: '#fff3e0'
          },
          {
            title: 'Active Shifts',
            value: '8',
            subtitle: 'Currently running',
            icon: <Schedule />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
          },
          {
            title: 'System Status',
            value: 'Online',
            subtitle: 'All systems operational',
            icon: <CheckCircle />,
            color: '#388e3c',
            bgColor: '#e8f5e8'
          }
        ];

      case ROLES.HR_MANAGER:
        return [
          {
            title: 'Total Employees',
            value: '142',
            subtitle: 'Active staff members',
            icon: <People />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
          },
          {
            title: 'Leave Requests',
            value: '18',
            subtitle: 'Pending approval',
            icon: <RequestPage />,
            color: '#f57c00',
            bgColor: '#fff3e0'
          },
          {
            title: 'Onboarding',
            value: '3',
            subtitle: 'New employees this month',
            icon: <Assignment />,
            color: '#388e3c',
            bgColor: '#e8f5e8'
          }
        ];

      case ROLES.ADMIN_STAFF:
        return [
          {
            title: 'My Attendance',
            value: '96%',
            subtitle: 'This month',
            icon: <Schedule />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
          },
          {
            title: 'Pending Tasks',
            value: '7',
            subtitle: 'Requiring attention',
            icon: <PendingActions />,
            color: '#f57c00',
            bgColor: '#fff3e0'
          },
          {
            title: 'Completed',
            value: '23',
            subtitle: 'Tasks this week',
            icon: <CheckCircle />,
            color: '#388e3c',
            bgColor: '#e8f5e8'
          }
        ];

      case ROLES.FIELD_STAFF:
        return [
          {
            title: 'Hours This Week',
            value: '38.5',
            subtitle: 'Logged hours',
            icon: <AccessTime />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
          },
          {
            title: 'Active Tasks',
            value: '5',
            subtitle: 'In progress',
            icon: <Assignment />,
            color: '#f57c00',
            bgColor: '#fff3e0'
          }
        ];

      default:
        return [];
    }
  };

  const stats = getStatsForRole(user.role);

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={stats.length === 4 ? 3 : stats.length === 3 ? 4 : 6} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                borderColor: stat.color
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color={stat.color} gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    width: 56,
                    height: 56,
                    ml: 2
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
              
              {/* Progress bar for certain stats */}
              {(stat.title.includes('Attendance') || stat.title.includes('Completed')) && (
                <Box sx={{ mt: 2 }}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 4, 
                      bgcolor: '#e0e0e0', 
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: stat.title.includes('Attendance') ? '96%' : '78%',
                        height: '100%', 
                        bgcolor: stat.color,
                        borderRadius: 2,
                        transition: 'width 1s ease-in-out'
                      }} 
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;