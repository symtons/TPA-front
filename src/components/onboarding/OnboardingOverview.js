// src/components/onboarding/OnboardingOverview.js
import React, { useState, useEffect } from 'react';
import {Grid,Card,CardContent,Typography,Box,Avatar,Chip,LinearProgress,List,ListItem,ListItemAvatar,ListItemText,Button,IconButton,Menu,MenuItem,Dialog,DialogTitle,
  DialogContent,DialogActions,TextField,Alert,Tabs,Tab,Badge} from '@mui/material';
import {Person,Assignment,CheckCircle,Warning,Schedule,MoreVert,Add,Email,Phone,CalendarToday,TrendingUp,Group,AssignmentTurnedIn} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import CustomCard from '../ui/CustomCard';
import StatCard from '../ui/StatCard';

const OnboardingOverview = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data
  const onboardingStats = {
    activeEmployees: 5,
    completedThisMonth: 8,
    overdueItems: 3,
    avgCompletionTime: '5.2 days',
    completionRate: 92
  };

  const newHires = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      department: 'IT',
      startDate: '2025-06-20',
      email: 'john.doe@company.com',
      phone: '(555) 123-4567',
      status: 'IN_PROGRESS',
      progress: 65,
      tasksTotal: 8,
      tasksCompleted: 5,
      daysOnboarding: 3,
      manager: 'Sarah Johnson',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Field Operations Specialist',
      department: 'Operations',
      startDate: '2025-06-18',
      email: 'jane.smith@company.com',
      phone: '(555) 234-5678',
      status: 'PENDING_ITEMS',
      progress: 40,
      tasksTotal: 10,
      tasksCompleted: 4,
      daysOnboarding: 5,
      manager: 'Mike Stevens',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Bob Wilson',
      position: 'Financial Analyst',
      department: 'Finance',
      startDate: '2025-06-15',
      email: 'bob.wilson@company.com',
      phone: '(555) 345-6789',
      status: 'ALMOST_COMPLETE',
      progress: 90,
      tasksTotal: 6,
      tasksCompleted: 5,
      daysOnboarding: 8,
      manager: 'Lisa Chen',
      avatar: 'BW'
    },
    {
      id: 4,
      name: 'Alice Brown',
      position: 'HR Coordinator',
      department: 'Human Resources',
      startDate: '2025-06-22',
      email: 'alice.brown@company.com',
      phone: '(555) 456-7890',
      status: 'JUST_STARTED',
      progress: 15,
      tasksTotal: 9,
      tasksCompleted: 1,
      daysOnboarding: 1,
      manager: 'David Park',
      avatar: 'AB'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'TASK_COMPLETED',
      employee: 'John Doe',
      task: 'Upload Government ID',
      timestamp: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'TASK_OVERDUE',
      employee: 'Jane Smith',
      task: 'Emergency Contact Information',
      timestamp: '3 hours ago',
      status: 'error'
    },
    {
      id: 3,
      type: 'NEW_HIRE_ADDED',
      employee: 'Alice Brown',
      task: 'Onboarding process initiated',
      timestamp: '1 day ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'ONBOARDING_COMPLETED',
      employee: 'Tom Wilson',
      task: 'All tasks completed successfully',
      timestamp: '2 days ago',
      status: 'success'
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'info';
      case 'PENDING_ITEMS': return 'warning';
      case 'ALMOST_COMPLETE': return 'success';
      case 'JUST_STARTED': return 'primary';
      case 'COMPLETED': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'In Progress';
      case 'PENDING_ITEMS': return 'Pending Items';
      case 'ALMOST_COMPLETE': return 'Almost Complete';
      case 'JUST_STARTED': return 'Just Started';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'TASK_COMPLETED': return <CheckCircle color="success" />;
      case 'TASK_OVERDUE': return <Warning color="error" />;
      case 'NEW_HIRE_ADDED': return <Person color="info" />;
      case 'ONBOARDING_COMPLETED': return <AssignmentTurnedIn color="success" />;
      default: return <Assignment />;
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleMenuClick = (event, employee) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading onboarding overview...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Active Employees"
            value={onboardingStats.activeEmployees}
            icon={<Group />}
            color="primary"
            subtitle="Currently onboarding"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Completed This Month"
            value={onboardingStats.completedThisMonth}
            icon={<CheckCircle />}
            color="success"
            subtitle="Successfully onboarded"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Overdue Items"
            value={onboardingStats.overdueItems}
            icon={<Warning />}
            color="error"
            subtitle="Requiring attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Avg. Completion"
            value={onboardingStats.avgCompletionTime}
            icon={<Schedule />}
            color="info"
            subtitle="Time to complete"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Completion Rate"
            value={`${onboardingStats.completionRate}%`}
            icon={<TrendingUp />}
            color="secondary"
            subtitle="Overall success rate"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* New Hires Section */}
        <Grid item xs={12} lg={8}>
          <CustomCard 
            title="New Hires"
            headerActions={
              user?.role === 'Admin' || user?.role === 'HR Manager' ? (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  size="small"
                >
                  Add New Hire
                </Button>
              ) : null
            }
          >
            <Box>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="All Employees" />
                <Tab label={<Badge badgeContent={3} color="error">Needs Attention</Badge>} />
                <Tab label="Recently Completed" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <List sx={{ p: 0 }}>
                  {newHires.map((employee) => (
                    <ListItem
                      key={employee.id}
                      button
                      onClick={() => handleEmployeeClick(employee)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid #f0f0f0',
                        '&:hover': {
                          bgcolor: '#f8f9fa',
                          borderColor: '#1976d2'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 56,
                            height: 56,
                            fontSize: '1.2rem',
                            fontWeight: 600
                          }}
                        >
                          {employee.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" fontWeight="600">
                              {employee.name}
                            </Typography>
                            <Chip
                              label={getStatusLabel(employee.status)}
                              color={getStatusColor(employee.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {employee.position} • {employee.department}
                            </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                              Started: {employee.startDate} ({employee.daysOnboarding} days ago)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Typography variant="caption">
                                Progress: {employee.tasksCompleted}/{employee.tasksTotal} tasks
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={employee.progress}
                                sx={{ flexGrow: 1, mx: 1 }}
                              />
                              <Typography variant="caption" fontWeight="600">
                                {employee.progress}%
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <IconButton
                        onClick={(e) => handleMenuClick(e, employee)}
                        sx={{ ml: 1 }}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <List sx={{ p: 0 }}>
                  {newHires.filter(emp => emp.status === 'PENDING_ITEMS' || emp.progress < 50).map((employee) => (
                    <ListItem
                      key={employee.id}
                      button
                      onClick={() => handleEmployeeClick(employee)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '2px solid #ff9800',
                        bgcolor: '#fff3e0'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          {employee.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={employee.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {employee.position} • {employee.department}
                            </Typography>
                            <Alert severity="warning" sx={{ mt: 1, p: 1 }}>
                              {employee.status === 'PENDING_ITEMS' ? 'Has overdue items' : 'Low progress after 3+ days'}
                            </Alert>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <List sx={{ p: 0 }}>
                  {newHires.filter(emp => emp.progress >= 90).map((employee) => (
                    <ListItem
                      key={employee.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '2px solid #4caf50',
                        bgcolor: '#e8f5e8'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          {employee.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={employee.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {employee.position} • {employee.department}
                            </Typography>
                            <Typography variant="caption" color="success.main" fontWeight="600">
                              ✓ {employee.progress}% complete - Ready for final review
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            </Box>
          </CustomCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <CustomCard 
            title="Recent Activity"
            headerActions={
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              >
                View All
              </Typography>
            }
          >
            <List sx={{ p: 0 }}>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id} sx={{ px: 0, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 36, height: 36 }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="600">
                        {activity.employee}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {activity.task}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {activity.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CustomCard>
        </Grid>
      </Grid>

      {/* Employee Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedEmployee && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  {selectedEmployee.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {selectedEmployee.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEmployee.position} • {selectedEmployee.department}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={getStatusLabel(selectedEmployee.status)}
                    color={getStatusColor(selectedEmployee.status)}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email color="action" />
                    <Typography variant="body2">{selectedEmployee.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Phone color="action" />
                    <Typography variant="body2">{selectedEmployee.phone}</Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>Employment Details</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday color="action" />
                    <Typography variant="body2">Start Date: {selectedEmployee.startDate}</Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    Manager: {selectedEmployee.manager}
                  </Typography>
                  <Typography variant="body2">
                    Days Onboarding: {selectedEmployee.daysOnboarding}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Progress Overview</Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Tasks Completed: {selectedEmployee.tasksCompleted}/{selectedEmployee.tasksTotal}
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {selectedEmployee.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={selectedEmployee.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Assignment />}
                      fullWidth
                    >
                      View Tasks
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Email />}
                      fullWidth
                    >
                      Send Email
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button variant="contained" startIcon={<Assignment />}>
                Manage Tasks
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Assignment sx={{ mr: 1 }} />
          View Tasks
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1 }} />
          Send Email
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Phone sx={{ mr: 1 }} />
          Call Employee
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Person sx={{ mr: 1 }} />
          View Profile
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OnboardingOverview;