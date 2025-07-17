// src/components/leave/EmployeeLeaveDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Add,
  CalendarToday,
  Schedule,
  CheckCircle,
  Warning,
  Cancel,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../ui/StatCard';
import CustomCard from '../ui/CustomCard';
import PageHeader from '../layout/PageHeader';
import LeaveRequestForm from './LeaveRequestForm';

const EmployeeLeaveDashboard = () => {
  const { user } = useAuth();
  const [openRequestForm, setOpenRequestForm] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, request: null });

  // Mock employee leave data
  const leaveBalance = {
    pto: { total: 20, used: 5, remaining: 15, accrued: 1.67 },
    sick: { total: 10, used: 2, remaining: 8, accrued: 0.83 },
    personal: { total: 5, used: 2, remaining: 3, accrued: 0.42 },
    vacation: { total: 15, used: 0, remaining: 15, accrued: 1.25 }
  };

  const myRequests = [
    {
      id: 1,
      leaveType: 'PTO',
      startDate: '2025-07-15',
      endDate: '2025-07-17',
      daysRequested: 3,
      reason: 'Family vacation',
      status: 'PENDING',
      requestedAt: '2025-06-20',
      manager: 'Sarah Johnson'
    },
    {
      id: 2,
      leaveType: 'SICK',
      startDate: '2025-06-10',
      endDate: '2025-06-10',
      daysRequested: 1,
      reason: 'Doctor appointment',
      status: 'APPROVED',
      requestedAt: '2025-06-08',
      approvedAt: '2025-06-09',
      manager: 'Sarah Johnson'
    },
    {
      id: 3,
      leaveType: 'PERSONAL',
      startDate: '2025-05-20',
      endDate: '2025-05-21',
      daysRequested: 2,
      reason: 'Personal matters',
      status: 'APPROVED',
      requestedAt: '2025-05-15',
      approvedAt: '2025-05-16',
      manager: 'Sarah Johnson'
    },
    {
      id: 4,
      leaveType: 'PTO',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      daysRequested: 5,
      reason: 'Summer vacation',
      status: 'REJECTED',
      requestedAt: '2025-06-18',
      rejectedAt: '2025-06-19',
      rejectionReason: 'Multiple team members already on vacation during this period',
      manager: 'Sarah Johnson'
    }
  ];

  const upcomingLeave = myRequests.filter(request => 
    request.status === 'APPROVED' && new Date(request.startDate) > new Date()
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'PTO': return 'primary';
      case 'SICK': return 'error';
      case 'PERSONAL': return 'warning';
      case 'VACATION': return 'success';
      default: return 'default';
    }
  };

  const getBalancePercentage = (balance) => {
    return ((balance.total - balance.remaining) / balance.total) * 100;
  };

  const handleRequestSubmit = (requestData) => {
    console.log('Submitting leave request:', requestData);
    // Here you would call your API
    // await leaveService.createRequest(requestData);
  };

  const handleEditRequest = (request) => {
    setEditRequest(request);
    setOpenRequestForm(true);
    setAnchorEl(null);
  };

  const handleDeleteRequest = (request) => {
    setDeleteDialog({ open: true, request });
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    console.log('Deleting request:', deleteDialog.request.id);
    // Here you would call your API
    // await leaveService.deleteRequest(deleteDialog.request.id);
    setDeleteDialog({ open: false, request: null });
  };

  const handleMenuClick = (event, request) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const getDaysUntilLeave = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const timeDiff = start - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  return (
    <Box>
      <PageHeader
        title="My Leave & Time Off"
        subtitle="Manage your time off requests and track your leave balances"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'My Leave' }
        ]}
        actions={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenRequestForm(true)}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
              fontWeight: 600
            }}
          >
            Request Time Off
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Leave Balance Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Leave Balances
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(leaveBalance).map(([type, balance]) => (
              <Grid item xs={12} sm={6} md={3} key={type}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: getLeaveTypeColor(type.toUpperCase()), mr: 2 }}>
                        <CalendarToday />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {type.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {balance.remaining} days remaining
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          Used: {balance.used}/{balance.total}
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {Math.round(getBalancePercentage(balance))}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getBalancePercentage(balance)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Monthly accrual: +{balance.accrued} days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Upcoming Leave */}
          {upcomingLeave.length > 0 && (
            <CustomCard title="Upcoming Time Off" sx={{ mb: 3 }}>
              <List>
                {upcomingLeave.map((leave, index) => (
                  <Box key={leave.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={leave.leaveType}
                              color={getLeaveTypeColor(leave.leaveType)}
                              size="small"
                            />
                            <Typography variant="subtitle2" fontWeight="600">
                              {leave.startDate} to {leave.endDate}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {leave.reason} • {leave.daysRequested} days
                            </Typography>
                            <Typography variant="caption" color="primary">
                              Starts in {getDaysUntilLeave(leave.startDate)} days
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingLeave.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CustomCard>
          )}

          {/* Request History */}
          <CustomCard title="Request History">
            {myRequests.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No leave requests found
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setOpenRequestForm(true)}
                  sx={{ mt: 2 }}
                >
                  Submit Your First Request
                </Button>
              </Box>
            ) : (
              <List>
                {myRequests.map((request, index) => (
                  <Box key={request.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              label={request.leaveType}
                              color={getLeaveTypeColor(request.leaveType)}
                              size="small"
                            />
                            <Chip
                              label={request.status}
                              color={getStatusColor(request.status)}
                              size="small"
                            />
                            <Typography variant="subtitle2" fontWeight="600">
                              {request.startDate}
                              {request.startDate !== request.endDate && ` to ${request.endDate}`}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {request.reason}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.daysRequested} days • Requested on {request.requestedAt}
                            </Typography>
                            {request.status === 'APPROVED' && request.approvedAt && (
                              <Typography variant="caption" color="success.main" display="block">
                                ✓ Approved on {request.approvedAt}
                              </Typography>
                            )}
                            {request.status === 'REJECTED' && request.rejectionReason && (
                              <Alert severity="error" sx={{ mt: 1, p: 1 }}>
                                <Typography variant="caption">
                                  Rejected: {request.rejectionReason}
                                </Typography>
                              </Alert>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={(e) => handleMenuClick(e, request)}
                        >
                          <MoreVert />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < myRequests.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </CustomCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <StatCard
                title="Total Days Off"
                value={Object.values(leaveBalance).reduce((sum, balance) => sum + balance.used, 0)}
                icon={<Schedule />}
                color="primary"
                subtitle="Used this year"
              />
            </Grid>
            <Grid item xs={12}>
              <StatCard
                title="Pending Requests"
                value={myRequests.filter(r => r.status === 'PENDING').length}
                icon={<AccessTime />}
                color="warning"
                subtitle="Awaiting approval"
              />
            </Grid>
          </Grid>

          {/* Tips & Information */}
          <CustomCard title="Leave Policy Tips">
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Submit requests early"
                  secondary="Give your manager at least 2 weeks notice for planned time off"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Check team calendar"
                  secondary="Avoid conflicts with major projects or other team members' leave"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Use your time off"
                  secondary="PTO doesn't roll over - use your earned time off for better work-life balance"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Emergency leave"
                  secondary="Contact your manager immediately for unexpected sick leave"
                />
              </ListItem>
            </List>
          </CustomCard>
        </Grid>
      </Grid>

      {/* Leave Request Form Dialog */}
      <LeaveRequestForm
        open={openRequestForm}
        onClose={() => {
          setOpenRequestForm(false);
          setEditRequest(null);
        }}
        onSubmit={handleRequestSubmit}
        editRequest={editRequest}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => console.log('View details', selectedRequest)}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedRequest?.status === 'PENDING' && [
          <MenuItem key="edit" onClick={() => handleEditRequest(selectedRequest)}>
            <Edit sx={{ mr: 1 }} />
            Edit Request
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleDeleteRequest(selectedRequest)}>
            <Delete sx={{ mr: 1, color: 'error.main' }} />
            Cancel Request
          </MenuItem>
        ]}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, request: null })}
      >
        <DialogTitle>Cancel Leave Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this leave request? This action cannot be undone.
          </Typography>
          {deleteDialog.request && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Request:</strong> {deleteDialog.request.leaveType} from {deleteDialog.request.startDate} to {deleteDialog.request.endDate}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, request: null })}>
            Keep Request
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Cancel Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeLeaveDashboard;