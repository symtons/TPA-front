// src/components/employees/EmployeeProfile.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  IconButton,
  Paper,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  Work,
  School,
  Star,
  TrendingUp,
  AccessTime,
  Assignment,
  Close,
  PhotoCamera,
  ContactEmergency,
  AccountBalance,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const EmployeeProfile = ({ open, type, employee, onClose, onSave }) => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(type === 'add' || type === 'edit');
  const [formData, setFormData] = useState(
    employee || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      employeeType: 'Full-time',
      status: 'Active',
      hireDate: '',
      manager: '',
      location: '',
      salary: '',
      skills: [],
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    }
  );
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const employeeData = {
      ...formData,
      id: employee?.id || Date.now(),
      employeeNumber: employee?.employeeNumber || `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      avatar: employee?.avatar || null
    };

    onSave(employeeData);
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Inactive': return 'error';
      default: return 'default';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const canEdit = user?.role === 'Admin' || user?.role === 'HR Manager';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: 'primary.main',
                position: 'relative'
              }}
              src={formData.avatar}
            >
              {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              {editMode && canEdit && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: -5,
                    right: -5,
                    bgcolor: 'secondary.main',
                    color: 'white',
                    width: 24,
                    height: 24,
                    '&:hover': { bgcolor: 'secondary.dark' }
                  }}
                  size="small"
                >
                  <PhotoCamera sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {type === 'add' ? 'Add New Employee' : 
                 editMode ? `Edit ${formData.firstName} ${formData.lastName}` :
                 `${formData.firstName} ${formData.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.employeeNumber} • {formData.position}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!editMode && canEdit && type !== 'add' && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
                size="small"
              >
                Edit
              </Button>
            )}
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Personal Info" />
            <Tab label="Employment" />
            <Tab label="Performance" />
            <Tab label="Documents" />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!editMode}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!editMode}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!editMode}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!editMode}
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact Name"
                value={formData.emergencyContact?.name || ''}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                disabled={!editMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Relationship"
                value={formData.emergencyContact?.relationship || ''}
                onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                disabled={!editMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.emergencyContact?.phone || ''}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                disabled={!editMode}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Employment Information Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Employment Details</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  disabled={!editMode}
                >
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position/Job Title"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={!editMode}
                error={!!errors.position}
                helperText={errors.position}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Employee Type</InputLabel>
                <Select
                  value={formData.employeeType}
                  label="Employee Type"
                  onChange={(e) => handleInputChange('employeeType', e.target.value)}
                  disabled={!editMode}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Intern">Intern</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={!editMode}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Hire Date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                disabled={!editMode}
                InputLabelProps={{ shrink: true }}
                error={!!errors.hireDate}
                helperText={errors.hireDate}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manager"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                disabled={!editMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Work Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!editMode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Annual Salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                disabled={!editMode || user?.role !== 'Admin'}
                InputProps={{
                  startAdornment: <Typography>$</Typography>
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Performance Overview</Typography>
            </Grid>

            {!editMode && employee && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {employee.performanceRating || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Performance Rating
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <CalendarToday sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="info.main">
                        {employee.lastReview || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Review
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {employee.nextReview || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Next Review
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AccessTime sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {(() => {
                          const hireDate = new Date(employee.hireDate);
                          const today = new Date();
                          const years = Math.floor((today - hireDate) / (365 * 24 * 60 * 60 * 1000));
                          const months = Math.floor(((today - hireDate) % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
                          return `${years}y ${months}m`;
                        })()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tenure
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Skills */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Skills & Competencies
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {employee.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Leave Balance */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Leave Balance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          {employee.leaveBalance?.pto || 0}
                        </Typography>
                        <Typography variant="caption">PTO Days</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="error.main">
                          {employee.leaveBalance?.sick || 0}
                        </Typography>
                        <Typography variant="caption">Sick Days</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {editMode && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Performance data is managed through the performance review system.
                  Contact HR for performance-related updates.
                </Alert>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Employee Documents</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Document management system will be integrated in a future update.
          </Alert>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText
                primary="Employment Contract"
                secondary="Signed on hire date"
              />
              <Button size="small" variant="outlined">View</Button>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Background Check"
                secondary="Completed and verified"
              />
              <Button size="small" variant="outlined">View</Button>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText
                primary="Certifications"
                secondary="Professional certifications on file"
              />
              <Button size="small" variant="outlined">View</Button>
            </ListItem>
          </List>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)} disabled={type === 'add'}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<Save />}
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                fontWeight: 600
              }}
            >
              {type === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeProfile;