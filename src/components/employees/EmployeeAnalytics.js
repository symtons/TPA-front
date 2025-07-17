// src/components/employees/EmployeeAnalytics.js - Fixed Complete Version
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Alert,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Group,
  Business,
  Schedule,
  Star,
  Warning,
  CheckCircle,
  PersonAdd,
  PersonRemove,
  Analytics,
  Download
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../ui/StatCard';
import CustomCard from '../ui/CustomCard';

const EmployeeAnalytics = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('12months');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalEmployees: 156,
      activeEmployees: 148,
      newHires: 12,
      terminations: 4,
      turnoverRate: 8.5,
      avgTenure: 2.8,
      employeeSatisfaction: 4.2,
      retentionRate: 91.5
    },
    departmentBreakdown: [
      { name: 'Operations', count: 45, percentage: 28.8, growth: 5.2 },
      { name: 'IT', count: 32, percentage: 20.5, growth: 8.1 },
      { name: 'Finance', count: 28, percentage: 17.9, growth: -2.1 },
      { name: 'HR', count: 18, percentage: 11.5, growth: 12.5 },
      { name: 'Sales', count: 21, percentage: 13.5, growth: 15.3 },
      { name: 'Marketing', count: 12, percentage: 7.7, growth: 0 }
    ],
    employeeTypes: [
      { type: 'Full-time', count: 132, percentage: 84.6 },
      { type: 'Part-time', count: 18, percentage: 11.5 },
      { type: 'Contract', count: 6, percentage: 3.9 }
    ],
    locationBreakdown: [
      { location: 'Nashville Office', count: 89, percentage: 57.1 },
      { location: 'Remote', count: 35, percentage: 22.4 },
      { location: 'Field Operations', count: 32, percentage: 20.5 }
    ],
    hiringTrends: [
      { month: 'Jan', hires: 8, terminations: 2 },
      { month: 'Feb', hires: 5, terminations: 1 },
      { month: 'Mar', hires: 12, terminations: 3 },
      { month: 'Apr', hires: 7, terminations: 2 },
      { month: 'May', hires: 9, terminations: 1 },
      { month: 'Jun', hires: 15, terminations: 4 }
    ],
    performanceMetrics: {
      avgRating: 4.2,
      topPerformers: 23,
      needsImprovement: 8,
      reviewsCompleted: 89,
      reviewsPending: 12
    },
    diversityMetrics: {
      genderDistribution: [
        { category: 'Female', count: 78, percentage: 50 },
        { category: 'Male', count: 72, percentage: 46.2 },
        { category: 'Other/Not Specified', count: 6, percentage: 3.8 }
      ],
      ageDistribution: [
        { range: '20-30', count: 45, percentage: 28.8 },
        { range: '31-40', count: 62, percentage: 39.7 },
        { range: '41-50', count: 35, percentage: 22.4 },
        { range: '51+', count: 14, percentage: 9.0 }
      ]
    },
    upcomingEvents: [
      { type: 'Performance Reviews', count: 12, dueDate: '2025-07-15' },
      { type: 'Probation Endings', count: 3, dueDate: '2025-07-20' },
      { type: 'Contract Renewals', count: 5, dueDate: '2025-08-01' },
      { type: 'Training Completions', count: 18, dueDate: '2025-07-30' }
    ]
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [timeframe, selectedDepartment]);

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp color="success" />;
    if (growth < 0) return <TrendingDown color="error" />;
    return <Analytics color="action" />;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'success.main';
    if (growth < 0) return 'error.main';
    return 'text.secondary';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            label="Timeframe"
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <MenuItem value="3months">Last 3 Months</MenuItem>
            <MenuItem value="6months">Last 6 Months</MenuItem>
            <MenuItem value="12months">Last 12 Months</MenuItem>
            <MenuItem value="ytd">Year to Date</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={selectedDepartment}
            label="Department"
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <MenuItem value="all">All Departments</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="Operations">Operations</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<Download />}
          sx={{ ml: 'auto' }}
        >
          Export Report
        </Button>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={analyticsData.overview.totalEmployees}
            icon={<Group />}
            color="primary"
            subtitle="Active workforce"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Hires"
            value={analyticsData.overview.newHires}
            icon={<PersonAdd />}
            color="success"
            subtitle="This quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Turnover Rate"
            value={`${analyticsData.overview.turnoverRate}%`}
            icon={<PersonRemove />}
            color="warning"
            subtitle="Annual rate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Performance"
            value={analyticsData.overview.employeeSatisfaction}
            icon={<Star />}
            color="secondary"
            subtitle="Out of 5.0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Department Breakdown */}
        <Grid item xs={12} lg={6}>
          <CustomCard title="Department Breakdown">
            <List sx={{ p: 0 }}>
              {analyticsData.departmentBreakdown.map((dept, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="600">
                          {dept.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {dept.count} ({dept.percentage}%)
                          </Typography>
                          {getGrowthIcon(dept.growth)}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={dept.percentage}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography 
                          variant="caption" 
                          color={getGrowthColor(dept.growth)}
                          sx={{ mt: 0.5, display: 'block' }}
                        >
                          {dept.growth > 0 ? '+' : ''}{dept.growth}% growth
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CustomCard>
        </Grid>

        {/* Employee Types */}
        <Grid item xs={12} lg={6}>
          <CustomCard title="Employee Types">
            <Grid container spacing={2}>
              {analyticsData.employeeTypes.map((type, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {type.type}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        {type.count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={type.percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {type.percentage}% of workforce
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CustomCard>
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12} lg={6}>
          <CustomCard title="Performance Overview">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                  <CheckCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {analyticsData.performanceMetrics.topPerformers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Top Performers
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                  <Warning sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {analyticsData.performanceMetrics.needsImprovement}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Needs Improvement
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Review Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(analyticsData.performanceMetrics.reviewsCompleted / 
                           (analyticsData.performanceMetrics.reviewsCompleted + analyticsData.performanceMetrics.reviewsPending)) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {analyticsData.performanceMetrics.reviewsCompleted} completed, {analyticsData.performanceMetrics.reviewsPending} pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} lg={6}>
          <CustomCard title="Upcoming HR Events">
            <List sx={{ p: 0 }}>
              {analyticsData.upcomingEvents.map((event, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="600">
                          {event.type}
                        </Typography>
                        <Chip 
                          label={event.count} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Due: {event.dueDate}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CustomCard>
        </Grid>

        {/* Diversity Metrics */}
        <Grid item xs={12}>
          <CustomCard title="Workforce Diversity">
            <Grid container spacing={3}>
              {/* Gender Distribution */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Gender Distribution
                </Typography>
                {analyticsData.diversityMetrics.genderDistribution.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{item.category}</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {item.count} ({item.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Grid>

              {/* Age Distribution */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Age Distribution
                </Typography>
                {analyticsData.diversityMetrics.ageDistribution.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{item.range} years</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {item.count} ({item.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>

        {/* Location Breakdown */}
        <Grid item xs={12}>
          <CustomCard title="Work Location Distribution">
            <Grid container spacing={2}>
              {analyticsData.locationBreakdown.map((location, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                      {location.count}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {location.location}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={location.percentage}
                      sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {location.percentage}% of workforce
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CustomCard>
        </Grid>

        {/* Key Insights */}
        <Grid item xs={12}>
          <CustomCard title="Key Insights & Recommendations">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Strong Retention
                  </Typography>
                  <Typography variant="body2">
                    91.5% retention rate is above industry average. Continue current employee engagement initiatives.
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Growth Opportunity
                  </Typography>
                  <Typography variant="body2">
                    Sales team showing 15.3% growth. Consider expanding recruitment in this department.
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Performance Reviews
                  </Typography>
                  <Typography variant="body2">
                    12 performance reviews pending. Schedule completion before month-end.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeAnalytics;