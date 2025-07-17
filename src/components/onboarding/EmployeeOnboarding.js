// =============================================================================
// UPDATED EMPLOYEE ONBOARDING COMPONENT - CONNECTED TO REAL API
// File: src/components/onboarding/EmployeeOnboarding.js (Replace existing)
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, LinearProgress, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Avatar, Alert, Stepper, Step, StepLabel, StepContent,
  Paper, IconButton, Tooltip, CircularProgress, Snackbar
} from '@mui/material';
import {
  CheckCircle, RadioButtonUnchecked, Upload, Assignment, Person, AccountBalance,
  School, Security, Schedule, Info, Download, Close, Warning, CloudUpload
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import CustomCard from '../ui/CustomCard';
import PageHeader from '../layout/PageHeader';
import onboardingService from '../../services/onboardingService';

const EmployeeOnboarding = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [progress, setProgress] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const fetchOnboardingData = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching onboarding data...');
      
      const response = await onboardingService.getMyOnboarding();
      console.log('📥 Onboarding response:', response);
      
      if (response.success) {
        setTasks(response.data.tasks || []);
        setEmployeeInfo(response.data.employee);
        setProgress(response.data.progress || {});
        console.log('✅ Onboarding data loaded successfully');
      } else {
        console.error('❌ Failed to load onboarding data:', response.message);
        showSnackbar('Failed to load onboarding data', 'error');
      }
    } catch (error) {
      console.error('💥 Error fetching onboarding data:', error);
      showSnackbar('Error loading onboarding data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'PENDING': return 'warning';
      case 'OVERDUE': return 'error';
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
      case 'ORIENTATION': return <Person />;
      case 'DOCUMENTATION': return <Assignment />;
      case 'FINANCIAL': return <AccountBalance />;
      case 'PERSONAL': return <Person />;
      case 'EQUIPMENT': return <Security />;
      case 'TRAINING': return <School />;
      default: return <Assignment />;
    }
  };

  const getTaskIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle color="success" />;
      case 'IN_PROGRESS': return <CircularProgress size={20} color="info" />;
      default: return <RadioButtonUnchecked color="action" />;
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleMarkComplete = async (taskId) => {
    try {
      console.log('✅ Completing task:', taskId);
      const response = await onboardingService.completeTask(taskId, {
        notes: 'Completed by employee'
      });

      if (response.success) {
        showSnackbar('Task completed successfully!');
        await fetchOnboardingData(); // Refresh data
      } else {
        console.error('❌ Failed to complete task:', response.message);
        showSnackbar('Failed to complete task', 'error');
      }
    } catch (error) {
      console.error('💥 Error completing task:', error);
      showSnackbar('Error completing task: ' + error.message, 'error');
    }
  };

  const handleFileUpload = async (taskId, file, documentType) => {
    try {
      setUploadingFiles(prev => ({ ...prev, [`${taskId}-${documentType}`]: true }));
      console.log('📁 Uploading file:', { taskId, documentType, fileName: file.name });

      const response = await onboardingService.uploadDocument(taskId, file, documentType);

      if (response.success) {
        showSnackbar('File uploaded successfully!');
        await fetchOnboardingData(); // Refresh data
      } else {
        console.error('❌ Failed to upload file:', response.message);
        showSnackbar('Failed to upload file', 'error');
      }
    } catch (error) {
      console.error('💥 Error uploading file:', error);
      showSnackbar('Error uploading file: ' + error.message, 'error');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [`${taskId}-${documentType}`]: false }));
    }
  };

  const getCompletionPercentage = () => {
    return progress.completionPercentage || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading your onboarding checklist...</Typography>
      </Box>
    );
  }

  // Error state - no employee info
  if (!employeeInfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6">Unable to load employee information</Typography>
          <Typography>Please contact your HR department for assistance.</Typography>
          <Button onClick={fetchOnboardingData} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Welcome to TPA!"
        subtitle={`Hi ${employeeInfo.name}, let's get you set up and ready to go.`}
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'My Onboarding' }
        ]}
      />

      {/* Welcome Card */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome to your new journey! 🎉
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                {employeeInfo.position} • {employeeInfo.department || 'No department assigned'}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                We're excited to have you join our team. Complete your onboarding tasks below to get started.
                If you have any questions, don't hesitate to reach out to your manager or HR.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    fontSize: '2rem',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {employeeInfo.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Employee ID: {employeeInfo.employeeId || 'Not assigned'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Start Date: {formatDate(employeeInfo.startDate)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Progress Overview */}
        <Grid item xs={12} md={4}>
          <CustomCard title="Your Progress">
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                {Math.round(getCompletionPercentage())}%
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Onboarding Complete
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getCompletionPercentage()}
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {progress.completed || 0} of {progress.total || 0} tasks completed
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {progress.completed || 0}
                  </Typography>
                  <Typography variant="caption">Completed</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {(progress.pending || 0) + (progress.inProgress || 0)}
                  </Typography>
                  <Typography variant="caption">Remaining</Typography>
                </Paper>
              </Grid>
            </Grid>

            {employeeInfo.manager && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Need Help?</strong><br />
                  Contact your manager: {employeeInfo.manager}<br />
                  Email: {employeeInfo.managerEmail}
                </Typography>
              </Alert>
            )}

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Schedule />}
              sx={{ textTransform: 'none' }}
              onClick={() => showSnackbar('Meeting scheduling feature coming soon!', 'info')}
            >
              Schedule Check-in Meeting
            </Button>
          </CustomCard>
        </Grid>

        {/* Task List */}
        <Grid item xs={12} md={8}>
          <CustomCard title="Your Onboarding Checklist">
            {tasks.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>No onboarding tasks assigned yet</Typography>
                <Typography>Please contact HR if this seems incorrect.</Typography>
                <Button onClick={fetchOnboardingData} sx={{ mt: 2 }}>
                  Refresh
                </Button>
              </Alert>
            ) : (
              <Stepper orientation="vertical" sx={{ mt: 2 }}>
                {tasks.map((task, index) => (
                  <Step key={task.id} active={task.status !== 'COMPLETED'} completed={task.status === 'COMPLETED'}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          {getTaskIcon(task.status)}
                        </Box>
                      )}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            {task.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              icon={getCategoryIcon(task.category)}
                              label={task.category}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={task.status}
                              size="small"
                              color={getStatusColor(task.status)}
                            />
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                backgroundColor: getPriorityColor(task.priority),
                                color: 'white'
                              }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {task.dueDate && (
                            <Typography variant="body2" color="text.secondary">
                              Due: {formatDate(task.dueDate)}
                            </Typography>
                          )}
                          <IconButton size="small" onClick={() => handleTaskClick(task)}>
                            <Info />
                          </IconButton>
                        </Box>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {task.description}
                      </Typography>
                      
                      {task.estimatedTime && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Estimated Time:</strong> {task.estimatedTime}
                        </Typography>
                      )}

                      {/* Document Upload Section */}
                      {task.documents && task.documents.length > 0 && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Documents:
                          </Typography>
                          {task.documents.map((doc, docIndex) => (
                            <Box key={docIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="body2">{doc.name}</Typography>
                              {doc.uploaded ? (
                                <Chip label="Uploaded" color="success" size="small" />
                              ) : (
                                <Box>
                                  <input
                                    accept="*/*"
                                    style={{ display: 'none' }}
                                    id={`upload-${task.id}-${docIndex}`}
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        handleFileUpload(task.id, file, doc.documentType);
                                      }
                                    }}
                                  />
                                  <label htmlFor={`upload-${task.id}-${docIndex}`}>
                                    <Button
                                      variant="outlined"
                                      component="span"
                                      size="small"
                                      startIcon={uploadingFiles[`${task.id}-${doc.documentType}`] ? 
                                        <CircularProgress size={16} /> : <CloudUpload />}
                                      disabled={uploadingFiles[`${task.id}-${doc.documentType}`]}
                                    >
                                      Upload
                                    </Button>
                                  </label>
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}

                      {task.status !== 'COMPLETED' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleMarkComplete(task.id)}
                          sx={{ mt: 1 }}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            )}
          </CustomCard>
        </Grid>
      </Grid>

      {/* Task Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedTask && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedTask.title}</Typography>
                <IconButton onClick={() => setOpenDialog(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedTask.description}
              </Typography>
              
              {selectedTask.instructions && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Instructions:</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedTask.instructions}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Category:</strong> {selectedTask.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Priority:</strong> {selectedTask.priority}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Status:</strong> {selectedTask.status}</Typography>
                </Grid>
                {selectedTask.dueDate && (
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Due Date:</strong> {formatDate(selectedTask.dueDate)}
                    </Typography>
                  </Grid>
                )}
                {selectedTask.estimatedTime && (
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Estimated Time:</strong> {selectedTask.estimatedTime}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              {selectedTask.status !== 'COMPLETED' && (
                <Button 
                  variant="contained" 
                  onClick={() => {
                    handleMarkComplete(selectedTask.id);
                    setOpenDialog(false);
                  }}
                  startIcon={<CheckCircle />}
                >
                  Mark Complete
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeOnboarding;