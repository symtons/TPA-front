// =============================================================================
// FRONTEND STEP 4: UPDATED RECENT ACTIVITIES COMPONENT
// File: src/components/dashboard/RecentActivities.js (Replace existing)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import dashboardApi from '../../services/dashboardApi';

const RecentActivities = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        dashboardApi.refreshToken(); // Refresh token before making request
        const response = await dashboardApi.getRecentActivities(user.id, user.role);
        
        if (response.success) {
          setActivities(response.data);
        } else {
          setError('Failed to load recent activities');
        }
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        setError('Error loading recent activities');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && user?.role) {
      fetchActivities();
    }
  }, [user?.id, user?.role]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const activityTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
                    {formatTimeAgo(activity.time)}
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