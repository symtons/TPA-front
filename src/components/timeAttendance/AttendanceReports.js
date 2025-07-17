// =============================================================================
// ATTENDANCE REPORTS COMPONENT - MANAGEMENT REPORTS
// File: src/components/timeAttendance/AttendanceReports.js
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
  TextField,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Divider
} from '@mui/material';
import {
  Assessment,
  FilterList,
  Download,
  TrendingUp,
  TrendingDown,
  Remove,
  People,
  Schedule,
  Warning,
  CheckCircle,
  AccessTime,
  Refresh,
  PieChart,
  BarChart
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import timeAttendanceApi from '../../services/timeAttendanceApi';

const AttendanceReports = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalEmployees: 0,
    avgAttendance: 0,
    totalHours: 0,
    avgOvertime: 0,
    activeShifts: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportsData();
    }
  }, [startDate, endDate, selectedTab]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError('');

      if (selectedTab === 0) {
        // Fetch attendance summary
        const response = await timeAttendanceApi.getAttendanceSummary(
          new Date(startDate),
          new Date(endDate),
          user.role
        );
        
        if (response.success) {
          setAttendanceData(response.data);
          calculateSummaryStats(response.data);
        }
      } else if (selectedTab === 1) {
        // Fetch pending timesheets
        const response = await timeAttendanceApi.getPendingTimesheets(user.role);
        
        if (response.success) {
          setPendingTimesheets(response.data);
        }
      }
    } catch (err) {
      setError('Error loading reports data');
      console.error('Error fetching reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummaryStats = (data) => {
    if (!data.length) {
      setSummaryStats({
        totalEmployees: 0,
        avgAttendance: 0,
        totalHours: 0,
        avgOvertime: 0,
        activeShifts: 0,
        pendingApprovals: 0
      });
      return;
    }

    const stats = {
      totalEmployees: data.length,
      avgAttendance: data.reduce((sum, emp) => sum + emp.attendanceRate, 0) / data.length,
      totalHours: data.reduce((sum, emp) => sum + emp.totalHours, 0),
      avgOvertime: data.reduce((sum, emp) => sum + emp.overtimeHours, 0) / data.length,
      activeShifts: data.filter(emp => emp.status === 'Active').length,
      pendingApprovals: pendingTimesheets.length
    };

    setSummaryStats(stats);
  };

  const handleApproveTimesheet = async (timesheetId) => {
    try {
      const response = await timeAttendanceApi.approveTimesheet(timesheetId, user.id);
      
      if (response.success) {
        setSuccess('Timesheet approved successfully');
        fetchReportsData(); // Refresh data
      } else {
        setError('Failed to approve timesheet');
      }
    } catch (err) {
      setError('Error approving timesheet');
      console.error('Error approving timesheet:', err);
    }
  };

  const handleRejectTimesheet = async (timesheetId) => {
    try {
      const response = await timeAttendanceApi.rejectTimesheet(timesheetId, user.id, 'Rejected by manager');
      
      if (response.success) {
        setSuccess('Timesheet rejected successfully');
        fetchReportsData(); // Refresh data
      } else {
        setError('Failed to reject timesheet');
      }
    } catch (err) {
      setError('Error rejecting timesheet');
      console.error('Error rejecting timesheet:', err);
    }
  };

  const formatDuration = (hours) => {
    if (!hours) return '0h';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'success';
    if (rate >= 85) return 'warning';
    return 'error';
  };

  const getTrendIcon = (value, threshold = 90) => {
    if (value > threshold) return <TrendingUp color="success" />;
    if (value < threshold - 10) return <TrendingDown color="error" />;
    return <Remove color="disabled" />;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const tabs = [
    { 
      label: 'Attendance Overview', 
      icon: <Assessment />,
      description: 'Employee attendance summary and statistics'
    },
    { 
      label: 'Pending Approvals', 
      icon: <Schedule />,
      description: 'Timesheets awaiting approval'
    },
    { 
      label: 'Analytics', 
      icon: <BarChart />,
      description: 'Detailed attendance analytics and trends'
    }
  ];

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

      {/* Summary Dashboard */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                <People />
              </Avatar>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {summaryStats.totalEmployees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                <CheckCircle />
              </Avatar>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {summaryStats.avgAttendance.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Attendance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                <AccessTime />
              </Avatar>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {formatDuration(summaryStats.totalHours)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {formatDuration(summaryStats.avgOvertime)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Overtime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                <Schedule />
              </Avatar>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {summaryStats.activeShifts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Shifts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>
                <Warning />
              </Avatar>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {pendingTimesheets.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approvals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tab Navigation */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                icon={tab.icon} 
                label={tab.label}
                iconPosition="start"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 56
                }}
              />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            {tabs[selectedTab].description}
          </Typography>
        </Box>
      </Card>

      {/* Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="administration">Administration</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                  <MenuItem value="operations">Field Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                startIcon={<FilterList />}
                onClick={fetchReportsData}
                disabled={loading}
                fullWidth
                size="small"
              >
                Filter
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  size="small"
                  disabled={!attendanceData.length && !pendingTimesheets.length}
                  sx={{ flex: 1 }}
                >
                  Export
                </Button>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={fetchReportsData}
                    disabled={loading}
                    size="small"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {selectedTab === 0 && (
        /* Attendance Overview */
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Employee Attendance Summary
              </Typography>
              {loading && <LinearProgress sx={{ width: 200 }} />}
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Total Hours</TableCell>
                    <TableCell align="right">Regular Hours</TableCell>
                    <TableCell align="right">Overtime Hours</TableCell>
                    <TableCell align="right">Days Worked</TableCell>
                    <TableCell align="center">Attendance Rate</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.8rem' }}>
                            {getInitials(employee.employeeName)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {employee.employeeName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {employee.department}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatDuration(employee.totalHours)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main">
                          {formatDuration(employee.regularHours)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="warning.main">
                          {formatDuration(employee.overtimeHours)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {employee.daysWorked} / {employee.daysScheduled}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Box sx={{ minWidth: 80 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={employee.attendanceRate}
                              color={getAttendanceColor(employee.attendanceRate)}
                              sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {employee.attendanceRate.toFixed(1)}%
                            </Typography>
                          </Box>
                          <Tooltip title="Attendance Trend">
                            <IconButton size="small" sx={{ ml: 1 }}>
                              {getTrendIcon(employee.attendanceRate, 90)}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={employee.status}
                          color={employee.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {attendanceData.length === 0 && !loading && (
              <Box textAlign="center" py={4}>
                <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No attendance data found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select a date range and click Filter to view attendance reports
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTab === 1 && (
        /* Pending Approvals */
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Timesheets Pending Approval
              </Typography>
              {loading && <CircularProgress size={20} />}
            </Box>

            {pendingTimesheets.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Week Period</TableCell>
                      <TableCell align="right">Total Hours</TableCell>
                      <TableCell align="right">Regular Hours</TableCell>
                      <TableCell align="right">Overtime Hours</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingTimesheets.map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.8rem' }}>
                              {getInitials(timesheet.employeeName)}
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">
                              {timesheet.employeeName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {timesheet.weekDisplay}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {formatDuration(timesheet.totalHours)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main">
                            {formatDuration(timesheet.regularHours)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="warning.main">
                            {formatDuration(timesheet.overtimeHours)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {timesheet.submittedAt 
                              ? new Date(timesheet.submittedAt).toLocaleDateString()
                              : '-'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApproveTimesheet(timesheet.id)}
                              disabled={loading}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Warning />}
                              onClick={() => handleRejectTimesheet(timesheet.id)}
                              disabled={loading}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No pending approvals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All timesheets have been reviewed and processed
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTab === 2 && (
        /* Analytics */
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Attendance Trends
                </Typography>
                <Box textAlign="center" py={4}>
                  <PieChart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Analytics charts will be implemented here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visual representation of attendance patterns and trends
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Department Comparison
                </Typography>
                <Box textAlign="center" py={4}>
                  <BarChart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Department analytics will be implemented here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compare attendance rates across different departments
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Key Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box p={2} bgcolor="success.50" borderRadius={2}>
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        High Performers
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attendanceData.filter(emp => emp.attendanceRate >= 95).length} employees
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        95%+ attendance rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box p={2} bgcolor="warning.50" borderRadius={2}>
                      <Typography variant="h6" color="warning.main" fontWeight="bold">
                        At Risk
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attendanceData.filter(emp => emp.attendanceRate < 85).length} employees
                      </Typography>
                      <Typography variant="caption" color="warning.main">
                        Below 85% attendance
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box p={2} bgcolor="info.50" borderRadius={2}>
                      <Typography variant="h6" color="info.main" fontWeight="bold">
                        Overtime Usage
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attendanceData.filter(emp => emp.overtimeHours > 0).length} employees
                      </Typography>
                      <Typography variant="caption" color="info.main">
                        Working overtime
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box p={2} bgcolor="primary.50" borderRadius={2}>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        Avg Weekly Hours
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attendanceData.length > 0 
                          ? (attendanceData.reduce((sum, emp) => sum + emp.totalHours, 0) / attendanceData.length).toFixed(1)
                          : '0'
                        }h
                      </Typography>
                      <Typography variant="caption" color="primary.main">
                        Per employee
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AttendanceReports;