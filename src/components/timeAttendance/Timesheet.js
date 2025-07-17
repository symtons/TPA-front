// =============================================================================
// TIMESHEET COMPONENT - COMPLETE TIMESHEET MANAGEMENT
// File: src/components/timeAttendance/Timesheet.js
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  Send,
  AccessTime,
  DateRange,
  TrendingUp,
  Warning,
  Refresh,
  Download,
  Edit,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import timeAttendanceApi from '../../services/timeAttendanceApi';

const Timesheet = () => {
  const { user } = useAuth();
  const [currentTimesheet, setCurrentTimesheet] = useState(null);
  const [historicalTimesheets, setHistoricalTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitDialog, setSubmitDialog] = useState(false);
  const [selectedHistoricalTab, setSelectedHistoricalTab] = useState(0);

  useEffect(() => {
    fetchTimesheetData();
  }, []);

  const fetchTimesheetData = async () => {
    try {
      setLoading(true);
      const employeeId = user.employee?.id || user.id;

      // Fetch current week timesheet
      const currentResponse = await timeAttendanceApi.getCurrentWeekTimesheet(employeeId);
      if (currentResponse.success && currentResponse.data) {
        setCurrentTimesheet(currentResponse.data);
      }

      // Fetch historical timesheets
      const historicalResponse = await timeAttendanceApi.getTimesheets(employeeId, 1, 20);
      if (historicalResponse.success) {
        setHistoricalTimesheets(historicalResponse.data);
      }
    } catch (err) {
      setError('Failed to load timesheet data');
      console.error('Error fetching timesheet data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTimesheet = async () => {
    if (!currentTimesheet || currentTimesheet.id === 0) {
      setError('Current week timesheet is not available for submission');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await timeAttendanceApi.submitTimesheet(
        currentTimesheet.id, 
        user.employee?.id || user.id
      );

      if (response.success) {
        setSuccess('Timesheet submitted successfully');
        setSubmitDialog(false);
        fetchTimesheetData(); // Refresh data
      } else {
        setError(response.message || 'Failed to submit timesheet');
      }
    } catch (err) {
      setError('Error submitting timesheet');
      console.error('Error submitting timesheet:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (hours) => {
    if (!hours) return '-';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Submitted': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft': return <Edit />;
      case 'Submitted': return <Send />;
      case 'Approved': return <CheckCircle />;
      case 'Rejected': return <Warning />;
      default: return <Schedule />;
    }
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const calculateWeekProgress = (timesheet) => {
    if (!timesheet) return 0;
    return Math.min((timesheet.totalHours / 40) * 100, 100);
  };

  const getProgressColor = (hours) => {
    if (hours >= 40) return 'success';
    if (hours >= 30) return 'warning';
    return 'primary';
  };

  // Group historical timesheets by status
  const groupedHistoricalTimesheets = historicalTimesheets.reduce((acc, timesheet) => {
    if (!acc[timesheet.status]) {
      acc[timesheet.status] = [];
    }
    acc[timesheet.status].push(timesheet);
    return acc;
  }, {});

  const historicalTabs = Object.keys(groupedHistoricalTimesheets).map(status => ({
    label: status,
    count: groupedHistoricalTimesheets[status].length,
    timesheets: groupedHistoricalTimesheets[status]
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
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

      {/* Current Week Timesheet */}
      {currentTimesheet ? (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Current Week Timesheet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentTimesheet.weekDisplay}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip 
                  label={currentTimesheet.status} 
                  color={getStatusColor(currentTimesheet.status)}
                  icon={getStatusIcon(currentTimesheet.status)}
                  variant="outlined"
                />
                {currentTimesheet.status === 'Draft' && currentTimesheet.totalHours > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={() => setSubmitDialog(true)}
                    sx={{ ml: 2 }}
                  >
                    Submit Timesheet
                  </Button>
                )}
                <Tooltip title="Refresh Data">
                  <IconButton onClick={fetchTimesheetData} disabled={loading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Weekly Progress Bar */}
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight="medium">
                  Weekly Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDuration(currentTimesheet.totalHours)} / 40h
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateWeekProgress(currentTimesheet)}
                color={getProgressColor(currentTimesheet.totalHours)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Weekly Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center" p={2} bgcolor="primary.50" borderRadius={2}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {formatDuration(currentTimesheet.totalHours)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                  <Typography variant="caption" color="primary.main">
                    This week
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center" p={2} bgcolor="success.50" borderRadius={2}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {formatDuration(currentTimesheet.regularHours)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Regular Hours
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    Standard time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center" p={2} bgcolor="warning.50" borderRadius={2}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {formatDuration(currentTimesheet.overtimeHours)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overtime Hours
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    Over 40h
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Daily Breakdown */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
              Daily Breakdown
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Clock In</TableCell>
                    <TableCell>Clock Out</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentTimesheet.timeEntries.map((entry, index) => (
                    <TableRow 
                      key={entry.id}
                      sx={{
                        bgcolor: entry.status === 'Active' ? 'primary.50' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {getDayOfWeek(entry.clockIn)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DateRange sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                          {formatDate(entry.clockIn)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <AccessTime sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                          {formatTime(entry.clockIn)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {entry.clockOut ? (
                          <Box display="flex" alignItems="center">
                            <AccessTime sx={{ mr: 1, color: 'error.main', fontSize: 16 }} />
                            {formatTime(entry.clockOut)}
                          </Box>
                        ) : (
                          <Chip 
                            label="In Progress" 
                            color="primary" 
                            size="small"
                            icon={<TrendingUp />}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color={entry.totalHours && entry.totalHours > 8 ? 'warning.main' : 'text.primary'}
                        >
                          {formatDuration(entry.totalHours)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.location || 'Not specified'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={entry.status} 
                          color={entry.status === 'Active' ? 'primary' : 'success'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {currentTimesheet.timeEntries.length === 0 && (
              <Box textAlign="center" py={4}>
                <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No time entries for this week
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clock in to start tracking your time
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No timesheet data available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start clocking in to generate your timesheet
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Historical Timesheets */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Previous Timesheets
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              size="small"
              disabled={!historicalTimesheets.length}
            >
              Export All
            </Button>
          </Box>
          
          {historicalTimesheets.length > 0 ? (
            <>
              {/* Status Tabs */}
              {historicalTabs.length > 0 && (
                <Tabs 
                  value={selectedHistoricalTab} 
                  onChange={(e, newValue) => setSelectedHistoricalTab(newValue)}
                  sx={{ mb: 2 }}
                >
                  {historicalTabs.map((tab, index) => (
                    <Tab
                      key={index}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          {getStatusIcon(tab.label)}
                          <span>{tab.label}</span>
                          <Chip 
                            label={tab.count} 
                            size="small" 
                            color={getStatusColor(tab.label)}
                          />
                        </Box>
                      }
                      sx={{ textTransform: 'none' }}
                    />
                  ))}
                </Tabs>
              )}

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Week Period</TableCell>
                      <TableCell align="right">Total Hours</TableCell>
                      <TableCell align="right">Regular Hours</TableCell>
                      <TableCell align="right">Overtime Hours</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Approved By</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(historicalTabs[selectedHistoricalTab]?.timesheets || historicalTimesheets).map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {timesheet.weekDisplay}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <TrendingUp sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                            <Typography variant="body2" fontWeight="medium">
                              {formatDuration(timesheet.totalHours)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main" fontWeight="medium">
                            {formatDuration(timesheet.regularHours)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="warning.main" fontWeight="medium">
                            {formatDuration(timesheet.overtimeHours)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={timesheet.status} 
                            color={getStatusColor(timesheet.status)}
                            size="small"
                            icon={getStatusIcon(timesheet.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {timesheet.submittedAt 
                              ? new Date(timesheet.submittedAt).toLocaleDateString()
                              : '-'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {timesheet.approverName || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No historical timesheets found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Submit Confirmation Dialog */}
      <Dialog open={submitDialog} onClose={() => setSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Send sx={{ mr: 2, color: 'primary.main' }} />
            Submit Timesheet
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to submit your timesheet for the week of{' '}
            <strong>{currentTimesheet?.weekDisplay}</strong>?
          </Typography>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Summary:</strong>
            </Typography>
            <Typography variant="body2">
              Total Hours: <strong>{formatDuration(currentTimesheet?.totalHours)}</strong>
            </Typography>
            <Typography variant="body2">
              Regular Hours: <strong>{formatDuration(currentTimesheet?.regularHours)}</strong>
            </Typography>
            <Typography variant="body2">
              Overtime Hours: <strong>{formatDuration(currentTimesheet?.overtimeHours)}</strong>
            </Typography>
          </Box>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Once submitted, you will not be able to modify this timesheet. 
            Please ensure all time entries are accurate.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialog(false)} disabled={submitLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitTimesheet} 
            variant="contained"
            disabled={submitLoading}
            startIcon={submitLoading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {submitLoading ? 'Submitting...' : 'Submit Timesheet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timesheet;