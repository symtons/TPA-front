// src/components/hrAction/HRManagementDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Badge,
  Alert,
  Paper
} from '@mui/material';
import {
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  SupervisorAccount as SupervisorIcon
} from '@mui/icons-material';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hr-mgmt-tabpanel-${index}`}
      aria-labelledby={`hr-mgmt-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const HRManagementDashboard = ({ open, onClose, currentUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const [hrForms, setHrForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [reviewDialog, setReviewDialog] = useState({ open: false, form: null });
  const [reviewComments, setReviewComments] = useState('');

  // Load dummy HR forms from localStorage
  useEffect(() => {
    const loadHRForms = () => {
      const storedForms = JSON.parse(localStorage.getItem('hrActionForms') || '[]');
      
      // Add some dummy forms if none exist
      if (storedForms.length === 0) {
        const dummyForms = [
          {
            submissionId: 'HRF-1001',
            employeeName: 'John Doe',
            employeeId: '12345',
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Pending HR Review',
            requestType: 'Rate Change',
            effectiveStartDate: '2025-08-01',
            previousRate: '$18.00',
            newRate: '$20.00',
            requestReason: 'Performance-based salary increase request',
            additionalComments: 'Requesting review for annual performance increase'
          },
          {
            submissionId: 'HRF-1002',
            employeeName: 'Jane Smith',
            employeeId: '12346',
            submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Approved',
            requestType: 'Leave Request',
            leaveStartDate: '2025-07-15',
            leaveEndDate: '2025-07-22',
            leaveDays: '8',
            leaveTypes: { vacation: true },
            requestReason: 'Family vacation',
            reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            reviewedBy: currentUser?.name || 'HR Manager',
            reviewComments: 'Approved - adequate vacation time available'
          },
          {
            submissionId: 'HRF-1003',
            employeeName: 'Bob Wilson',
            employeeId: '12347',
            submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Rejected',
            requestType: 'Promotion',
            oldJobTitle: 'Assistant',
            newJobTitle: 'Supervisor',
            promotionNewRate: '$25.00',
            requestReason: 'Seeking promotion to supervisor role',
            reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            reviewedBy: currentUser?.name || 'HR Manager',
            reviewComments: 'Position not currently available. Will reconsider in Q4.'
          }
        ];
        
        // Combine with any existing forms
        const allForms = [...dummyForms, ...storedForms];
        localStorage.setItem('hrActionForms', JSON.stringify(allForms));
        setHrForms(allForms);
      } else {
        setHrForms(storedForms);
      }
    };

    if (open) {
      loadHRForms();
    }
  }, [open, currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending HR Review':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending HR Review':
        return <PendingIcon />;
      case 'Approved':
        return <ApprovedIcon />;
      case 'Rejected':
        return <RejectedIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  const determineRequestType = (form) => {
    if (form.requestType) return form.requestType;
    
    if (form.newRate || form.previousRate) return 'Rate Change';
    if (form.newJobTitle) return 'Promotion';
    if (form.newLocation) return 'Transfer';
    if (form.leaveStartDate) return 'Leave Request';
    if (form.newName || form.newEmail || form.newAddress) return 'Personal Info Change';
    
    return 'General Request';
  };

  const handleReviewForm = (form, action) => {
    const updatedForms = hrForms.map(f => {
      if (f.submissionId === form.submissionId) {
        return {
          ...f,
          status: action === 'approve' ? 'Approved' : 'Rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser?.name || 'HR Manager',
          reviewComments: reviewComments || (action === 'approve' ? 'Approved' : 'Rejected')
        };
      }
      return f;
    });

    setHrForms(updatedForms);
    localStorage.setItem('hrActionForms', JSON.stringify(updatedForms));
    setReviewDialog({ open: false, form: null });
    setReviewComments('');
  };

  const openReviewDialog = (form) => {
    setReviewDialog({ open: true, form });
    setReviewComments('');
  };

  const closeReviewDialog = () => {
    setReviewDialog({ open: false, form: null });
    setReviewComments('');
  };

  const pendingForms = hrForms.filter(form => form.status === 'Pending HR Review');
  const approvedForms = hrForms.filter(form => form.status === 'Approved');
  const rejectedForms = hrForms.filter(form => form.status === 'Rejected');

  const stats = [
    {
      title: 'Pending Review',
      count: pendingForms.length,
      color: 'warning',
      icon: <PendingIcon />
    },
    {
      title: 'Approved',
      count: approvedForms.length,
      color: 'success',
      icon: <ApprovedIcon />
    },
    {
      title: 'Rejected',
      count: rejectedForms.length,
      color: 'error',
      icon: <RejectedIcon />
    },
    {
      title: 'Total Forms',
      count: hrForms.length,
      color: 'primary',
      icon: <AssignmentIcon />
    }
  ];

  const tabs = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      badge: null
    },
    {
      label: 'Pending Review',
      icon: <PendingIcon />,
      badge: pendingForms.length
    },
    {
      label: 'All Forms',
      icon: <AssignmentIcon />,
      badge: null
    },
    {
      label: 'History',
      icon: <HistoryIcon />,
      badge: null
    }
  ];

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { 
            minHeight: '80vh',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupervisorIcon />
            <Typography variant="h6">HR Action Forms Management</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, index) => {
                const label = tab.badge > 0 ? (
                  <Badge badgeContent={tab.badge} color="error">
                    {tab.label}
                  </Badge>
                ) : tab.label;

                return (
                  <Tab
                    key={index}
                    label={label}
                    icon={tab.icon}
                    iconPosition="start"
                    sx={{ gap: 1 }}
                  />
                );
              })}
            </Tabs>
          </Box>

          {/* Dashboard Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              HR Action Forms Overview
            </Typography>
            
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Chip
                          icon={stat.icon}
                          label={stat.count}
                          color={stat.color}
                          size="large"
                          sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                        />
                      </Box>
                      <Typography variant="h6" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Recent Pending Forms */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Pending Forms
                </Typography>
                {pendingForms.length === 0 ? (
                  <Alert severity="info">No pending forms to review</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {pendingForms.slice(0, 3).map((form) => (
                      <Grid item xs={12} md={4} key={form.submissionId}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {form.employeeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {determineRequestType(form)}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              Submitted: {new Date(form.submittedAt).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              startIcon={<ViewIcon />}
                              onClick={() => openReviewDialog(form)}
                            >
                              Review
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          {/* Pending Review Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Forms Pending Review ({pendingForms.length})
            </Typography>
            
            {pendingForms.length === 0 ? (
              <Alert severity="info">No forms pending review</Alert>
            ) : (
              <Grid container spacing={3}>
                {pendingForms.map((form) => (
                  <Grid item xs={12} md={6} lg={4} key={form.submissionId}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6">
                            {form.employeeName}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(form.status)}
                            label={form.status}
                            color={getStatusColor(form.status)}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Request Type:</strong> {determineRequestType(form)}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Employee ID:</strong> {form.employeeId}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Submitted:</strong> {new Date(form.submittedAt).toLocaleDateString()}
                        </Typography>
                        
                        {form.requestReason && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            "{form.requestReason}"
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          startIcon={<ViewIcon />}
                          onClick={() => openReviewDialog(form)}
                          fullWidth
                        >
                          Review & Decide
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          {/* All Forms Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              All HR Action Forms ({hrForms.length})
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Form ID</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Request Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hrForms.map((form) => (
                    <TableRow key={form.submissionId}>
                      <TableCell>{form.submissionId}</TableCell>
                      <TableCell>{form.employeeName}</TableCell>
                      <TableCell>{determineRequestType(form)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(form.status)}
                          label={form.status}
                          color={getStatusColor(form.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(form.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedForm(form)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* History Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Reviewed Forms History
            </Typography>
            
            <Grid container spacing={3}>
              {[...approvedForms, ...rejectedForms].map((form) => (
                <Grid item xs={12} md={6} key={form.submissionId}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">
                          {form.employeeName}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(form.status)}
                          label={form.status}
                          color={getStatusColor(form.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Request Type:</strong> {determineRequestType(form)}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Reviewed By:</strong> {form.reviewedBy}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Reviewed On:</strong> {new Date(form.reviewedAt).toLocaleDateString()}
                      </Typography>
                      
                      {form.reviewComments && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          <strong>Comments:</strong> "{form.reviewComments}"
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialog.open} 
        onClose={closeReviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Review HR Action Form - {reviewDialog.form?.employeeName}
        </DialogTitle>
        <DialogContent>
          {reviewDialog.form && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Form ID:</Typography>
                  <Typography variant="body1">{reviewDialog.form.submissionId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Request Type:</Typography>
                  <Typography variant="body1">{determineRequestType(reviewDialog.form)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Employee ID:</Typography>
                  <Typography variant="body1">{reviewDialog.form.employeeId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Submitted:</Typography>
                  <Typography variant="body1">
                    {new Date(reviewDialog.form.submittedAt).toLocaleString()}
                  </Typography>
                </Grid>
                
                {/* Display relevant form details based on request type */}
                {reviewDialog.form.previousRate && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Previous Rate:</Typography>
                      <Typography variant="body1">{reviewDialog.form.previousRate}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Requested New Rate:</Typography>
                      <Typography variant="body1">{reviewDialog.form.newRate}</Typography>
                    </Grid>
                  </>
                )}
                
                {reviewDialog.form.leaveStartDate && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Leave Start Date:</Typography>
                      <Typography variant="body1">{reviewDialog.form.leaveStartDate}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Leave End Date:</Typography>
                      <Typography variant="body1">{reviewDialog.form.leaveEndDate}</Typography>
                    </Grid>
                  </>
                )}

                {reviewDialog.form.newJobTitle && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Current Job Title:</Typography>
                      <Typography variant="body1">{reviewDialog.form.oldJobTitle}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Requested New Job Title:</Typography>
                      <Typography variant="body1">{reviewDialog.form.newJobTitle}</Typography>
                    </Grid>
                  </>
                )}

                {reviewDialog.form.newLocation && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Requested Transfer Location:</Typography>
                    <Typography variant="body1">{reviewDialog.form.newLocation}</Typography>
                  </Grid>
                )}

                {reviewDialog.form.newName && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Requested Name Change:</Typography>
                    <Typography variant="body1">{reviewDialog.form.newName}</Typography>
                  </Grid>
                )}

                {reviewDialog.form.newEmail && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">New Email:</Typography>
                    <Typography variant="body1">{reviewDialog.form.newEmail}</Typography>
                  </Grid>
                )}
                
                {reviewDialog.form.requestReason && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Request Reason:</Typography>
                    <Typography variant="body1">{reviewDialog.form.requestReason}</Typography>
                  </Grid>
                )}
                
                {reviewDialog.form.additionalComments && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Additional Comments:</Typography>
                    <Typography variant="body1">{reviewDialog.form.additionalComments}</Typography>
                  </Grid>
                )}
              </Grid>
              
              <TextField
                fullWidth
                label="Review Comments"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                multiline
                rows={3}
                sx={{ mt: 3 }}
                placeholder="Enter your review comments..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewDialog}>
            Cancel
          </Button>
          <Button
            onClick={() => handleReviewForm(reviewDialog.form, 'reject')}
            color="error"
            variant="outlined"
          >
            Reject
          </Button>
          <Button
            onClick={() => handleReviewForm(reviewDialog.form, 'approve')}
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Form Dialog */}
      <Dialog 
        open={!!selectedForm} 
        onClose={() => setSelectedForm(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Form Details - {selectedForm?.employeeName}
        </DialogTitle>
        <DialogContent>
          {selectedForm && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Chip
                    icon={getStatusIcon(selectedForm.status)}
                    label={selectedForm.status}
                    color={getStatusColor(selectedForm.status)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Form ID:</Typography>
                  <Typography variant="body1">{selectedForm.submissionId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Request Type:</Typography>
                  <Typography variant="body1">{determineRequestType(selectedForm)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Employee ID:</Typography>
                  <Typography variant="body1">{selectedForm.employeeId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Submitted:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedForm.submittedAt).toLocaleString()}
                  </Typography>
                </Grid>
                
                {selectedForm.requestReason && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Request Reason:</Typography>
                    <Typography variant="body1">{selectedForm.requestReason}</Typography>
                  </Grid>
                )}

                {selectedForm.reviewComments && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Review Comments:</Typography>
                    <Typography variant="body1">{selectedForm.reviewComments}</Typography>
                  </Grid>
                )}

                {selectedForm.reviewedBy && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Reviewed By:</Typography>
                    <Typography variant="body1">{selectedForm.reviewedBy}</Typography>
                  </Grid>
                )}

                {selectedForm.reviewedAt && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Reviewed On:</Typography>
                    <Typography variant="body1">
                      {new Date(selectedForm.reviewedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedForm(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HRManagementDashboard;