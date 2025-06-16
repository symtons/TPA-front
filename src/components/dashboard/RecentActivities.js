// src/components/dashboard/RecentActivities.js
import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  PersonAdd,
  Edit,
  CheckCircle,
  Schedule,
  Assignment,
  AccountBalance,
  Warning
} from '@mui/icons-material';

const RecentActivities = ({ user }) => {
  // Mock activities based on user role
  const getActivitiesForRole = (role) => {
    const baseActivities = [
      {
        id: 1,
        user: 'John Doe',
        action: 'added new employee',
        time: '2 hours ago',
        type: 'employee',
        avatar: 'J',
        color: '#4caf50'
      },
      {
        id: 2,
        user: 'Jane Smith',
        action: 'updated payroll info',
        time: '4 hours ago',
        type: 'payroll',
        avatar: 'J',
        color: '#2196f3'
      },
      {
        id: 3,
        user: 'Mike Johnson',
        action: 'approved leave request',
        time: '1 day ago',
        type: 'leave',
        avatar: 'M',
        color: '#ff9800'
      },
      {
        id: 4,
        user: 'Sarah Williams',
        action: 'created new shift',
        time: '1 day ago',
        type: 'schedule',
        avatar: 'S',
        color: '#1976d2',
        highlighted: true
      },
      {
        id: 5,
        user: 'Tom Brown',
        action: 'completed onboarding task',
        time: '2 days ago',
        type: 'onboarding',
        avatar: 'T',
        color: '#9c27b0'
      },
      {
        id: 6,
        user: 'Lisa Davis',
        action: 'submitted expense report',
        time: '3 days ago',
        type: 'expense',
        avatar: 'L',
        color: '#795548'
      }
    ];

    return baseActivities;
  };

  const getActionIcon = (type) => {
    const iconMap = {
      employee: <PersonAdd fontSize="small" />,
      payroll: <AccountBalance fontSize="small" />,
      leave: <CheckCircle fontSize="small" />,
      schedule: <Schedule fontSize="small" />,
      onboarding: <Assignment fontSize="small" />,
      expense: <Edit fontSize="small" />,
      default: <Warning fontSize="small" />
    };
    return iconMap[type] || iconMap.default;
  };

  const activities = getActivitiesForRole(user.role);

  return (
    <Box>
      <List sx={{ p: 0 }}>
        {activities.map((activity, index) => (
          <Box key={activity.id}>
            <ListItem 
              sx={{ 
                px: 0,
                py: 2,
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 1
                }
              }}
            >
              <ListItemAvatar>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      bgcolor: activity.color,
                      width: 40,
                      height: 40,
                      fontWeight: 'bold'
                    }}
                  >
                    {activity.avatar}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 20,
                      height: 20,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid',
                      borderColor: 'background.paper'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: activity.color,
                        '& .MuiSvgIcon-root': {
                          fontSize: '0.75rem'
                        }
                      }}
                    >
                      {getActionIcon(activity.type)}
                    </Avatar>
                  </Box>
                </Box>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {activity.user}
                    </Typography>
                    {activity.highlighted && (
                      <Chip 
                        label="new" 
                        size="small" 
                        color="primary"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                      {activity.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < activities.length - 1 && (
              <Divider variant="inset" component="li" sx={{ ml: 7 }} />
            )}
          </Box>
        ))}
      </List>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ 
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          View all activities
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentActivities;