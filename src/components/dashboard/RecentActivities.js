// src/components/dashboard/RecentActivities.js
import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Chip,
  Box 
} from '@mui/material';
import { ROLES } from '../../constants';

const RecentActivities = ({ user }) => {
  // Role-based activities
  const getActivitiesForRole = (role) => {
    const baseActivities = [
      {
        id: 1,
        user: 'John Doe',
        action: 'added new employee',
        details: 'Sofia Martinez joined Field Operations',
        time: '2 hours ago',
        avatar: 'J',
        color: '#4caf50',
        type: 'USER_CREATED'
      },
      {
        id: 2,
        user: 'Jane Smith',
        action: 'updated payroll info',
        details: 'Processed monthly payroll for 15 employees',
        time: '4 hours ago',
        avatar: 'J',
        color: '#2196f3',
        type: 'PAYROLL_PROCESSED'
      },
      {
        id: 3,
        user: 'Mike Johnson',
        action: 'approved leave request',
        details: 'Vacation leave for Emma Garcia (5 days)',
        time: '1 day ago',
        avatar: 'M',
        color: '#ff9800',
        type: 'LEAVE_APPROVED'
      },
      {
        id: 4,
        user: 'Sarah Williams',
        action: 'created new shift',
        details: 'Morning shift scheduled for next week',
        time: '1 day ago',
        avatar: 'S',
        color: '#9c27b0',
        type: 'SCHEDULE_UPDATED',
        isNew: true
      },
      {
        id: 5,
        user: 'Tom Brown',
        action: 'completed onboarding',
        details: 'Successfully completed training modules',
        time: '2 days ago',
        avatar: 'T',
        color: '#795548',
        type: 'ONBOARDING_COMPLETED'
      },
      {
        id: 6,
        user: 'Lisa Davis',
        action: 'submitted report',
        details: 'Monthly expense report uploaded',
        time: '3 days ago',
        avatar: 'L',
        color: '#607d8b',
        type: 'REPORT_SUBMITTED'
      }
    ];

    // Filter activities based on role
    switch (role) {
      case ROLES.ADMIN:
        return baseActivities; // Admins see all activities

      case ROLES.HR_MANAGER:
        return baseActivities.filter(activity => 
          ['USER_CREATED', 'LEAVE_APPROVED', 'ONBOARDING_COMPLETED', 'PAYROLL_PROCESSED'].includes(activity.type)
        );

      case ROLES.ADMIN_STAFF:
        return baseActivities.filter(activity => 
          ['PAYROLL_PROCESSED', 'SCHEDULE_UPDATED', 'LEAVE_APPROVED', 'REPORT_SUBMITTED'].includes(activity.type)
        );

      case ROLES.FIELD_STAFF:
        return baseActivities.filter(activity => 
          ['SCHEDULE_UPDATED', 'ONBOARDING_COMPLETED', 'REPORT_SUBMITTED'].includes(activity.type)
        ).slice(0, 4); // Limit to 4 activities for field staff

      default:
        return baseActivities.slice(0, 3);
    }
  };

  const activities = getActivitiesForRole(user.role);

  return (
    <Box sx={{ mt: 1 }}>
      <List sx={{ width: '100%', p: 0 }}>
        {activities.map((activity, index) => (
          <ListItem 
            key={activity.id}
            sx={{ 
              px: 0,
              py: 1.5,
              borderBottom: index !== activities.length - 1 ? '1px solid #f0f0f0' : 'none',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderRadius: 1
              }
            }}
          >
            <ListItemAvatar>
              <Avatar 
                sx={{ 
                  bgcolor: activity.color,
                  width: 40,
                  height: 40,
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                {activity.avatar}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="600" color="text.primary">
                    {activity.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.action}
                  </Typography>
                  {activity.isNew && (
                    <Chip 
                      label="NEW" 
                      size="small" 
                      color="primary" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }} 
                    />
                  )}
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {activity.details}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {activity.time}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      
      {activities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No recent activities to display
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecentActivities;