// =============================================================================
// COMPLETE CLOCK IN/OUT COMPONENT
// File: src/components/timeAttendance/ClockInOut.js
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AccessTime,
  PlayArrow,
  Stop,
  Schedule,
  LocationOn,
  Refresh,
  TrendingUp,
  Timer
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import timeAttendanceApi from '../../services/timeAttendanceApi';

const ClockInOut = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchCurrentStatus();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCurrentStatus = async () => {
    try {
      setLoading(true);
      const response = await timeAttendanceApi.getCurrentStatus(user.employee?.id || user.id);
      if (response.success) {
        setCurrentStatus(response.data);
      }
    } catch (err) {
      setError('Failed to fetch current status');
      console.error('Error fetching status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await timeAttendanceApi.clockIn(user.employee?.id || user.id, 'Main Office');
      
      if (response.success) {
        setSuccess(response.message);
        fetchCurrentStatus();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to clock in');
      console.error('Error clocking in:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await timeAttendanceApi.clockOut(user.employee?.id || user.id);
      
      if (response.success) {
        setSuccess(response.message);
        fetchCurrentStatus();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to clock out');
      console.error('Error clocking out:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentShiftDuration = () => {
    if (!currentStatus?.currentTimeEntry) return null;
    
    const clockInTime = new Date(currentStatus.currentTimeEntry.clockIn);
    const now = new Date();
    const diffMs = now - clockInTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getProgressPercentage = () => {
    if (!currentStatus?.currentTimeEntry) return 0;
    
    const clockInTime = new Date(currentStatus.currentTimeEntry.clockIn);
    const now = new Date();
    const diffHours = (now - clockInTime) / (1000 * 60 * 60);
    return Math.min((diffHours / 8) * 100, 100); // 8 hour workday
  };

  if (loading && !currentStatus) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Current Time Display */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
                opacity: 0.3
              }}
            />
            <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
              <AccessTime sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {formatTime(currentTime)}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {formatDate(currentTime)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="Live Clock" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clock In/Out Controls */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ py: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: currentStatus?.isClockedIn ? 'success.main' : 'grey.400',
                      width: 64,
                      height: 64,
                      mr: 2
                    }}
                  >
                    {currentStatus?.isClockedIn ? <Stop sx={{ fontSize: 32 }} /> : <PlayArrow sx={{ fontSize: 32 }} />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user.employee?.fullName || user.name}
                    </Typography>
                    <Chip 
                      label={currentStatus?.isClockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
                      color={currentStatus?.isClockedIn ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
                <Tooltip title="Refresh Status">
                  <IconButton onClick={fetchCurrentStatus} disabled={loading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              {currentStatus?.isClockedIn && currentStatus.currentTimeEntry && (
                <Box sx={{ mb: 3, p: 3, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="body2" color="success.main" gutterBottom>
                    <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    Clocked in at: {new Date(currentStatus.currentTimeEntry.clockIn).toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" color="success.main" gutterBottom>
                    <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    Location: {currentStatus.currentTimeEntry.location}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="success.main">
                        <Timer sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                        Duration: {getCurrentShiftDuration()}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {getProgressPercentage().toFixed(0)}% of day
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getProgressPercentage()} 
                      sx={{ 
                        mt: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'success.100',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: 'success.main'
                        }
                      }}
                    />
                  </Box>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={currentStatus?.isClockedIn ? handleClockOut : handleClockIn}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> :
                  currentStatus?.isClockedIn ? <Stop /> : <PlayArrow />
                }
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  bgcolor: currentStatus?.isClockedIn ? 'error.main' : 'success.main',
                  '&:hover': {
                    bgcolor: currentStatus?.isClockedIn ? 'error.dark' : 'success.dark'
                  },
                  boxShadow: 3,
                  borderRadius: 2
                }}
              >
                {loading ? 'Processing...' : (currentStatus?.isClockedIn ? 'Clock Out' : 'Clock In')}
              </Button>

              {!currentStatus?.isClockedIn && (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                  Click "Clock In" to start tracking your work time
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  This Week Summary
                </Typography>
                <Chip 
                  icon={<TrendingUp />}
                  label="Current Week" 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="primary.50" borderRadius={2}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {currentStatus?.currentWeekHours?.toFixed(1) || '0.0'}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Hours
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((currentStatus?.currentWeekHours || 0) / 40 * 100, 100)}
                      sx={{ mt: 1, height: 4, borderRadius: 2 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {Math.min(currentStatus?.currentWeekHours || 0, 40).toFixed(1)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Regular Hours
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      Up to 40 hours
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="warning.50" borderRadius={2}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {Math.max((currentStatus?.currentWeekHours || 0) - 40, 0).toFixed(1)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overtime Hours
                    </Typography>
                    <Typography variant="caption" color="warning.main">
                      Over 40 hours
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center" p={2} bgcolor="info.50" borderRadius={2}>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {((currentStatus?.currentWeekHours || 0) / 40 * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Week Progress
                    </Typography>
                    <Typography variant="caption" color="info.main">
                      Based on 40h week
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  Track your time accurately for payroll and compliance purposes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClockInOut;