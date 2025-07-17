// src/components/leave/LeaveManagementDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  MoreVert,
  CalendarToday,
  Person,
  Schedule,
  TrendingUp,
  Warning,
  FilterList,
  Download,
  Email,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../ui/StatCard';
import CustomCard from '../ui/CustomCard';
import PageHeader from '../layout/PageHeader';

const LeaveManagementDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionMenuRequest, setActionMenuRequest] = useState(null);
  const [approvalDialog, setApprovalDialog] = useState({ open: false, request: null, action: null });
  const [filterDialog, setFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    department: '',
    dateRange: ''
  });

  // Mock data
  const leaveStats = {
    pendingRequests: 12,
    approvedThisMonth: 45,
    totalDaysRequested: 156,
    approvalRate: 89,
    topLeaveType: 'PTO',
    avgProcessingTime: '2.3 days'
  };

  const mockRequests = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Doe',
      department: 'IT',
      position: 'Software Engineer',
      leaveType: 'PTO',
      startDate: '2025-07-15',
      endDate: '2025-07-17',
      daysRequested: 3,
      reason: 'Family vacation',
      status: 'PENDING',
      requestedAt: '2025-06-20',
      manager: 'Sarah Johnson',
      urgency: 'normal',
      balance: { pto: 12, sick: 8, personal: 3, vacation: 15 }
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Jane Smith',
      department: 'Operations',
      position: 'Field Specialist',
      leaveType: 'SICK',
      startDate: '2025-06-25',
      endDate: '2025-06-25',
      daysRequested: 1,
      reason: 'Medical appointment',
      status: 'APPROVED',
      requestedAt: '2025-06-18',
      approvedBy: 'Mike Stevens',
      approvedAt: '2025-06-19',
      manager: 'Mike Stevens',
      urgency: 'high',
      balance: { pto: 20, sick: 7, personal: 3, vacation: 18 }
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: 'Bob Wilson',
      department: 'Finance',
      position: 'Financial Analyst',
      leaveType: 'PERSONAL',
      startDate: '2025-07-01',
      endDate: '2025-07-03',
      daysRequested: 3,
      reason: 'Personal matters',
      status: 'REJECTED',
      requestedAt: '2025-06-15',
      rejectedBy: 'Lisa Chen',
      rejectedAt: '2025-06-16',
      rejectionReason: 'Insufficient coverage during month-end closing',
      manager: 'Lisa Chen',
      urgency: 'normal',
      balance: { pto: 15, sick: 8, personal: 0, vacation: 22 }
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: 'Alice Brown',
      department: 'HR',
      position: 'HR Coordinator',
      leaveType: 'VACATION',
      startDate: '2025-08-10',
      endDate: '2025-08-20',
      daysRequested: 8,
      reason: 'Annual family vacation to Europe',
      status: 'PENDING',
      requestedAt: '2025-06-19',
      manager: 'David Park',
      urgency: 'normal',
      balance: { pto: 10, sick: 8, personal: 3, vacation: 15 }
    },
    {
      id: 5,
      employeeId: 5,
      employeeName: 'Charlie Davis',
      department: 'IT',
      position: 'System Administrator',
      leaveType: 'PTO',
      startDate: '2025-06-28',
      endDate: '2025-06-28',
      daysRequested: 0.5,
      reason: 'Dentist appointment',
      status: 'PENDING',
      requestedAt: '2025-06-20',
      manager: 'Sarah Johnson',
      urgency: 'low',
      balance: { pto: 18, sick: 8, personal: 3, vacation: 20 }
    }
  ];

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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#f44336';
      case 'normal': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const handleApproval = (request, action) => {
    setApprovalDialog({ open: true, request, action });
    setAnchorEl(null);
  };

  const handleConfirmAction = async (reason = '') => {
    const { request, action } = approvalDialog;
    console.log(`${action} request ${request.id}`, reason);
    
    // Here you would call your API
    // await leaveService.updateRequestStatus(request.id, action, reason);
    
    setApprovalDialog({ open: false, request: null, action: null });
  };

  const handleMenuClick = (event, request) => {
    setAnchorEl(event.currentTarget);
    setActionMenuRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionMenuRequest(null);
  };

  const filterRequests = (requests) => {
    return requests.filter(request => {
      if (filters.status && request.status !== filters.status) return false;
      if (filters.leaveType && request.leaveType !== filters.leaveType) return false;
      if (filters.department && request.department !== filters.department) return false;
      return true;
    });
  };

  const getFilteredRequests = () => {
    const filtered = filterRequests(mockRequests);
    switch (tabValue) {
      case 0: return filtered; // All
      case 1: return filtered.filter(r => r.status === 'PENDING'); // Pending
      case 2: return filtered.filter(r => r.status === 'APPROVED'); // Approved
      case 3: return filtered.filter(r => r.status === 'REJECTED'); // Rejected
      default: return filtered;
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const pendingCount = mockRequests.filter(r => r.status === 'PENDING').length;

  return (
    <Box>
      <PageHeader
        title="Leave Management"
        subtitle="Manage employee leave requests and track time-off patterns"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Leave Management' }
        ]}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDialog(true)}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export
            </Button>
          </Box>
        }
      />

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Pending Requests"
            value={leaveStats.pendingRequests}
            icon={<Schedule />}
            color="warning"
            subtitle="Awaiting approval"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Approved This Month"
            value={leaveStats.approvedThisMonth}
            icon={<CheckCircle />}
            color="success"
            subtitle="Leave requests approved"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Total Days Requested"
            value={leaveStats.totalDaysRequested}
            icon={<CalendarToday />}
            color="info"
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Approval Rate"
            value={`${leaveStats.approvalRate}%`}
            icon={<TrendingUp />}
            color="primary"
            subtitle="Overall approval rate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Avg Processing Time"
            value={leaveStats.avgProcessingTime}
            icon={<Schedule />}
            color="secondary"
            subtitle="To approval/rejection"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Leave Requests Table */}
        <Grid item xs={12} lg={8}>
          <CustomCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab label="All Requests" />
                <Tab 
                  label={
                    <Badge badgeContent={pendingCount} color="error">
                      Pending Approval
                    </Badge>
                  } 
                />
                <Tab label="Approved" />
                <Tab label="Rejected" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <LeaveRequestsTable 
                requests={getFilteredRequests()}
                onMenuClick={handleMenuClick}
                onApproval={handleApproval}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <LeaveRequestsTable 
                requests={getFilteredRequests()}
                onMenuClick={handleMenuClick}
                onApproval={handleApproval}
                showActions={true}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <LeaveRequestsTable 
                requests={getFilteredRequests()}
                onMenuClick={handleMenuClick}
                onApproval={handleApproval}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <LeaveRequestsTable 
                requests={getFilteredRequests()}
                onMenuClick={handleMenuClick}
                onApproval={handleApproval}
              />
            </TabPanel>
          </CustomCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <CustomCard title="Quick Actions" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Email />}
                fullWidth
              >
                Send Bulk Reminders
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarToday />}
                fullWidth
              >
                View Calendar
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                fullWidth
              >
                Generate Report
              </Button>
            </Box>
          </CustomCard>

          {/* Recent Activity */}
          <CustomCard title="Recent Activity">
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CheckCircle />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Bob Wilson's personal leave rejected"
                  secondary="1 day ago by Lisa Chen"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <CalendarToday />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Alice Brown submitted vacation request"
                  secondary="2 days ago • 8 days requested"
                />
              </ListItem>
            </List>
          </CustomCard>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {actionMenuRequest?.status === 'PENDING' && [
          <MenuItem key="approve" onClick={() => handleApproval(actionMenuRequest, 'APPROVE')}>
            <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
            Approve
          </MenuItem>,
          <MenuItem key="reject" onClick={() => handleApproval(actionMenuRequest, 'REJECT')}>
            <Cancel sx={{ mr: 1, color: 'error.main' }} />
            Reject
          </MenuItem>,
          <Divider key="divider" />
        ]}
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1 }} />
          Contact Employee
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Person sx={{ mr: 1 }} />
          View Employee Profile
        </MenuItem>
      </Menu>

      {/* Approval/Rejection Dialog */}
      <Dialog 
        open={approvalDialog.open} 
        onClose={() => setApprovalDialog({ open: false, request: null, action: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalDialog.action === 'APPROVE' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </DialogTitle>
        <DialogContent>
          {approvalDialog.request && (
            <Box>
              <Alert 
                severity={approvalDialog.action === 'APPROVE' ? 'success' : 'warning'} 
                sx={{ mb: 3 }}
              >
                {approvalDialog.action === 'APPROVE' 
                  ? 'You are about to approve this leave request.'
                  : 'You are about to reject this leave request. Please provide a reason.'
                }
              </Alert>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Request Details:</Typography>
                <Typography variant="body2">
                  <strong>Employee:</strong> {approvalDialog.request.employeeName}
                </Typography>
                <Typography variant="body2">
                  <strong>Leave Type:</strong> {approvalDialog.request.leaveType}
                </Typography>
                <Typography variant="body2">
                  <strong>Dates:</strong> {approvalDialog.request.startDate} to {approvalDialog.request.endDate}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {approvalDialog.request.daysRequested} days
                </Typography>
                <Typography variant="body2">
                  <strong>Reason:</strong> {approvalDialog.request.reason}
                </Typography>
              </Box>

              {approvalDialog.action === 'REJECT' && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason for Rejection"
                  placeholder="Please provide a clear reason for rejecting this request..."
                  required
                />
              )}

              {approvalDialog.action === 'APPROVE' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Comments (Optional)"
                  placeholder="Add any comments or conditions for approval..."
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog({ open: false, request: null, action: null })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={approvalDialog.action === 'APPROVE' ? 'success' : 'error'}
            onClick={() => handleConfirmAction()}
          >
            {approvalDialog.action === 'APPROVE' ? 'Approve Request' : 'Reject Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialog} onClose={() => setFilterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Leave Requests</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={filters.leaveType}
                  label="Leave Type"
                  onChange={(e) => setFilters(prev => ({ ...prev, leaveType: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PTO">PTO</MenuItem>
                  <MenuItem value="SICK">Sick</MenuItem>
                  <MenuItem value="PERSONAL">Personal</MenuItem>
                  <MenuItem value="VACATION">Vacation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  label="Department"
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  label="Date Range"
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                >
                  <MenuItem value="">All Time</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="thisQuarter">This Quarter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilters({ status: '', leaveType: '', department: '', dateRange: '' })}>
            Clear All
          </Button>
          <Button onClick={() => setFilterDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Separate component for the requests table
const LeaveRequestsTable = ({ requests, onMenuClick, onApproval, showActions = false }) => {
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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#f44336';
      case 'normal': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  if (requests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No leave requests found matching your criteria
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Requested</TableCell>
            {showActions && <TableCell>Actions</TableCell>}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {request.employeeName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600">
                      {request.employeeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.department} • {request.position}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={request.leaveType}
                  color={getLeaveTypeColor(request.leaveType)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {request.startDate}
                  {request.startDate !== request.endDate && ` to ${request.endDate}`}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="600">
                  {request.daysRequested} {request.daysRequested === 1 ? 'day' : 'days'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: getUrgencyColor(request.urgency)
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {request.requestedAt}
                </Typography>
              </TableCell>
              {showActions && request.status === 'PENDING' && (
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Approve">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => onApproval(request, 'APPROVE')}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onApproval(request, 'REJECT')}
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              )}
              <TableCell>
                <IconButton
                  size="small"
                  onClick={(e) => onMenuClick(e, request)}
                >
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaveManagementDashboard;
                  