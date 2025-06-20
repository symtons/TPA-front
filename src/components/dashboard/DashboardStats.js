// =============================================================================
// FIXED DASHBOARD STATS COMPONENT - CONSISTENT CARD HEIGHTS
// File: src/components/dashboard/DashboardStats.js (Replace existing)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar, CircularProgress } from '@mui/material';
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
import dashboardApi from '../../services/dashboardApi';

const iconMap = {
  'People': People,
  'Warning': Warning,
  'Schedule': Schedule,
  'CheckCircle': CheckCircle,
  'Analytics': Analytics,
  'PendingActions': PendingActions,
  'RequestPage': RequestPage,
  'Assignment': Assignment,
  'AccessTime': AccessTime,
  'TrendingUp': TrendingUp
};

const DashboardStats = ({ user }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        dashboardApi.refreshToken(); // Refresh token before making request
        const response = await dashboardApi.getDashboardStats(user.role);
        
        if (response.success) {
          setStats(response.data);
        } else {
          setError('Failed to load dashboard stats');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Error loading dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchStats();
    }
  }, [user?.role]);

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

  const getColorFromName = (colorName) => {
    const colorMap = {
      'primary': '#1976d2',
      'secondary': '#ff9800',
      'success': '#4caf50',
      'warning': '#ffc107',
      'error': '#f44336',
      'info': '#2196f3'
    };
    return colorMap[colorName] || '#1976d2';
  };

  const getBackgroundColor = (colorName) => {
    const bgColorMap = {
      'primary': '#e3f2fd',
      'secondary': '#fff3e0',
      'success': '#e8f5e8',
      'warning': '#fff8e1',
      'error': '#ffebee',
      'info': '#e1f5fe'
    };
    return bgColorMap[colorName] || '#e3f2fd';
  };

  return (
    <Grid container spacing={3} sx={{ '& .MuiGrid-item': { display: 'flex' } }}>
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon] || Analytics;
        
        return (
          <Grid item xs={12} sm={6} md={4} key={index}> {/* 3 cards per row on desktop */}
            <Card 
              sx={{ 
                height: 140, // Fixed height for all cards
                width: '100%', // Full width of grid item
                minWidth: 240, // Minimum width to prevent shrinking
                maxWidth: '100%', // Prevent expansion beyond grid
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: getColorFromName(stat.color)
                }
              }}
            >
              {/* Top accent bar */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${getColorFromName(stat.color)}, ${getColorFromName('secondary')})`
                }}
              />
              
              <CardContent 
                sx={{ 
                  p: 2.5,
                  pb: '16px !important', // Override MUI default
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Top section - Icon and Value */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}> {/* minWidth: 0 prevents overflow */}
                    <Typography 
                      variant="h4" 
                      fontWeight="bold" 
                      color={getColorFromName(stat.color)} 
                      sx={{ 
                        lineHeight: 1.2,
                        mb: 0.5,
                        fontSize: { xs: '1.75rem', sm: '2rem' } // Responsive font size
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="600" 
                      color="text.primary"
                      sx={{ 
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  
                  <Avatar 
                    sx={{ 
                      bgcolor: getBackgroundColor(stat.color),
                      color: getColorFromName(stat.color),
                      width: 48,
                      height: 48,
                      ml: 1,
                      flexShrink: 0 // Prevent shrinking
                    }}
                  >
                    <IconComponent sx={{ fontSize: '1.5rem' }} />
                  </Avatar>
                </Box>
                
                {/* Bottom section - Subtitle */}
                <Box sx={{ mt: 'auto' }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: '0.875rem'
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                </Box>
                
                {/* Progress bar for certain stats */}
                {(stat.title.includes('Attendance') || stat.title.includes('Completed') || stat.title.includes('%')) && (
                  <Box sx={{ mt: 1 }}>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 3, 
                        bgcolor: 'rgba(0,0,0,0.08)', 
                        borderRadius: 1.5,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: stat.title.includes('Attendance') ? '96%' : 
                                stat.title.includes('%') ? stat.value : '78%',
                          height: '100%', 
                          bgcolor: getColorFromName(stat.color),
                          borderRadius: 1.5,
                          transition: 'width 1s ease-in-out'
                        }} 
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DashboardStats;