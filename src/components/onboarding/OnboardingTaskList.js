// src/components/onboarding/OnboardingTaskList.js
import React, { useState, useEffect } from 'react';
import {Card,CardContent,Typography,List,ListItem,ListItemIcon,ListItemText,ListItemSecondaryAction,Chip,IconButton,Button,Dialog,DialogTitle,DialogContent,DialogActions,
  TextField,Box,LinearProgress,Avatar,Alert,Divider,Grid,Paper} from '@mui/material';
import {CheckCircle,RadioButtonUnchecked,Warning,Assignment,Upload,Person,AccountBalance,School,Security,MoreVert,Add,Edit,Delete} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import CustomCard from '../ui/CustomCard';
import PageHeader from '../layout/PageHeader';

const OnboardingTaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'DOCUMENTATION',
    priority: 'MEDIUM'
  });

  // Mock data for development
  const mockTasks = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Doe',
      title: 'Upload Government ID',
      description: 'Please upload a copy of your driver\'s license or passport',
      category: 'DOCUMENTATION',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: '2025-06-25',
      assignedDate: '2025-06-20',
      completedDate: null,
      notes: ''
    },
    {
      id: 2,
      employeeId: 1,
      employeeName: 'John Doe',
      title: 'Complete Bank Information',
      description: 'Provide banking details for direct deposit setup',
      category: 'FINANCIAL',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: '2025-06-22',
      assignedDate: '2025-06-20',
      completedDate: '2025-06-21',
      notes: 'Completed via employee portal'
    },
    {
      id: 3,
      employeeId: 1,
      employeeName: 'John Doe',
      title: 'Safety Training Completion',
      description: 'Complete mandatory workplace safety training module',
      category: 'TRAINING',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: '2025-06-30',
      assignedDate: '2025-06-20',
      completedDate: null,
      notes: 'Training started on 6/21'
    },
    {
      id: 4,
      employeeId: 2,
      employeeName: 'Jane Smith',
      title: 'IT Equipment Setup',
      description: 'Schedule laptop and equipment pickup from IT department',
      category: 'EQUIPMENT',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: '2025-06-23',
      assignedDate: '2025-06-20',
      completedDate: null,
      notes: ''
    },
    {
      id: 5,
      employeeId: 2,
      employeeName: 'Jane Smith',
      title: 'Emergency Contact Information',
      description: 'Provide emergency contact details and beneficiary information',
      category: 'PERSONAL',
      status: 'OVERDUE',
      priority: 'MEDIUM',
      dueDate: '2025-06-19',
      assignedDate: '2025-06-18',
      completedDate: null,
      notes: 'Multiple reminders sent'
    }
  ];

  const mockEmployees = [
    { id: 1, name: 'John Doe', department: 'IT', startDate: '2025-06-20', status: 'ONBOARDING' },
    { id: 2, name: 'Jane Smith', department: 'Operations', startDate: '2025-06-18', status: 'ONBOARDING' },
    { id: 3, name: 'Bob Wilson', department: 'Finance', startDate: '2025-06-15', status: 'COMPLETED' }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setTasks(mockTasks);
      setEmployees(mockEmployees);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'OVERDUE': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#f44336';
      case 'MEDIUM': return '#ff9800';
      case 'LOW': return '#4caf50';
      default: return '#757575';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'DOCUMENTATION': return <Assignment />;
      case 'FINANCIAL': return <AccountBalance />;
      case 'TRAINING': return <School />;
      case 'EQUIPMENT': return <Security />;
      case 'PERSONAL': return <Person />;
      default: return <Assignment />;
    }
  };

  const getTaskIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle color="success" />;
      case 'IN_PROGRESS': return <CheckCircle color="info" />;
      case 'OVERDUE': return <Warning color="error" />;
      default: return <RadioButtonUnchecked color="action" />;
    }
  };

  const handleTaskStatusUpdate = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedDate: newStatus === 'COMPLETED' ? new Date().toISOString().split('T')[0] : null
            }
          : task
      )
    );
  };

  const handleAddTask = () => {
    const task = {
      id: Date.now(),
      employeeId: selectedEmployee?.id || 1,
      employeeName: selectedEmployee?.name || 'Unassigned',
      ...newTask,
      status: 'PENDING',
      assignedDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      notes: ''
    };

    setTasks(prev => [...prev, task]);
    setOpenDialog(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      category: 'DOCUMENTATION',
      priority: 'MEDIUM'
    });
  };

  const getCompletionPercentage = (employeeId) => {
    const employeeTasks = tasks.filter(task => task.employeeId === employeeId);
    const completedTasks = employeeTasks.filter(task => task.status === 'COMPLETED');
    return employeeTasks.length > 0 ? Math.round((completedTasks.length / employeeTasks.length) * 100) : 0;
  };

  const filterTasks = () => {
    if (selectedEmployee) {
      return tasks.filter(task => task.employeeId === selectedEmployee.id);
    }
    return tasks;
  };

  const getTaskStats = () => {
    const filteredTasks = filterTasks();
    return {
      total: filteredTasks.length,
      completed: filteredTasks.filter(t => t.status === 'COMPLETED').length,
      pending: filteredTasks.filter(t => t.status === 'PENDING').length,
      overdue: filteredTasks.filter(t => t.status === 'OVERDUE').length,
      inProgress: filteredTasks.filter(t => t.status === 'IN_PROGRESS').length
    };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading onboarding tasks...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Employee Onboarding"
        subtitle="Manage onboarding tasks and track new employee progress"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Onboarding' }
        ]}
        actions={
          user?.role === 'Admin' || user?.role === 'HR Manager' ? (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                fontWeight: 600
              }}
            >
              Add Task
            </Button>
          ) : null
        }
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {stats.overdue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Employee List */}
        <Grid item xs={12} md={4}>
          <CustomCard title="New Employees">
            <List>
              <ListItem
                button
                selected={!selectedEmployee}
                onClick={() => setSelectedEmployee(null)}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    ALL
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="All Employees"
                  secondary={`${employees.length} total`}
                />
              </ListItem>
              {employees.map((employee) => (
                <ListItem
                  key={employee.id}
                  button
                  selected={selectedEmployee?.id === employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {employee.name.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={employee.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {employee.department} • Started {employee.startDate}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={getCompletionPercentage(employee.id)}
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                          <Typography variant="caption">
                            {getCompletionPercentage(employee.id)}%
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={employee.status}
                      size="small"
                      color={employee.status === 'COMPLETED' ? 'success' : 'warning'}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CustomCard>
        </Grid>

        {/* Task List */}
        <Grid item xs={12} md={8}>
          <CustomCard 
            title={
              selectedEmployee 
                ? `${selectedEmployee.name}'s Onboarding Tasks`
                : 'All Onboarding Tasks'
            }
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <List>
              {filterTasks().map((task, index) => (
                <Box key={task.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      {getTaskIcon(task.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {task.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={task.priority}
                            sx={{
                              bgcolor: getPriorityColor(task.priority),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                          <Chip
                            size="small"
                            label={task.status.replace('_', ' ')}
                            color={getStatusColor(task.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {task.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getCategoryIcon(task.category)}
                              <Typography variant="caption">
                                {task.category}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Due: {task.dueDate}
                            </Typography>
                            {!selectedEmployee && (
                              <Typography variant="caption" color="text.secondary">
                                • {task.employeeName}
                              </Typography>
                            )}
                          </Box>
                          {task.notes && (
                            <Typography variant="caption" sx={{ fontStyle: 'italic', mt: 0.5, display: 'block' }}>
                              Note: {task.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {task.status === 'PENDING' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleTaskStatusUpdate(task.id, 'COMPLETED')}
                          >
                            Mark Complete
                          </Button>
                        )}
                        {task.status === 'COMPLETED' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleTaskStatusUpdate(task.id, 'PENDING')}
                          >
                            Reopen
                          </Button>
                        )}
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filterTasks().length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            {filterTasks().length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedEmployee 
                    ? `No onboarding tasks for ${selectedEmployee.name}`
                    : 'No onboarding tasks found'
                  }
                </Typography>
              </Box>
            )}
          </CustomCard>
        </Grid>
      </Grid>

      {/* Add Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Onboarding Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                  SelectProps={{ native: true }}
                >
                  <option value="DOCUMENTATION">Documentation</option>
                  <option value="FINANCIAL">Financial</option>
                  <option value="TRAINING">Training</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="PERSONAL">Personal</option>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  SelectProps={{ native: true }}
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddTask}
            variant="contained"
            disabled={!newTask.title || !newTask.description || !newTask.dueDate}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnboardingTaskList;