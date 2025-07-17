// src/components/hrAction/HRActionForm.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  BusinessCenter as BusinessIcon,
  EventNote as EventIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hr-action-tabpanel-${index}`}
      aria-labelledby={`hr-action-tab-${index}`}
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

const HRActionForm = ({ open, onClose, currentUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Data
    employeeName: currentUser?.name || 'John Doe',
    employeeId: currentUser?.id || '12345',
    effectiveStartDate: '',
    socialSecurityNumber: '***-**-****',
    classification: 'Full Time',
    shift: 'Day',
    totalHours: '40',
    
    // Rate Change
    previousRate: '',
    amountIncrease: '',
    premiumIncentive: '',
    newRate: '',
    rateType: 'Hourly',
    newW4: false,
    
    // Transfer
    newLocation: '',
    leaderSupervisor: '',
    newClass: 'FT',
    transferShiftHours: '',
    
    // Promotion
    oldJobTitle: currentUser?.jobTitle || '',
    newJobTitle: '',
    promotionNewRate: '',
    promotionShiftHours: '',
    
    // Personal Information Changes
    newName: '',
    phoneNumber: '',
    cellNumber: '',
    maritalStatus: 'S',
    newAddress: '',
    newEmail: '',
    
    // Leave Types
    leaveTypes: {
      vacation: false,
      unpaidPersonalTime: false,
      votingTime: false,
      military: false,
      paidSickTime: false,
      familyMedical: false,
      pregnancyDisability: false,
      juryDuty: false,
      unpaidSickTime: false,
      funeral: false
    },
    funeralRelation: '',
    leaveStartDate: '',
    leaveEndDate: '',
    leaveDays: '',
    leaveHours: '',
    
    // Additional Comments
    additionalComments: '',
    requestReason: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeaveTypeChange = (leaveType, checked) => {
    setFormData(prev => ({
      ...prev,
      leaveTypes: {
        ...prev.leaveTypes,
        [leaveType]: checked
      }
    }));
  };

  const calculateLeaveDays = () => {
    if (formData.leaveStartDate && formData.leaveEndDate) {
      const start = new Date(formData.leaveStartDate);
      const end = new Date(formData.leaveEndDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      if (daysDiff > 0) {
        handleInputChange('leaveDays', daysDiff);
      }
    }
  };

  const handleSubmit = () => {
    // Create dummy submission data
    const submissionData = {
      ...formData,
      submissionId: `HRF-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending HR Review',
      submittedBy: currentUser?.name || 'John Doe',
      employeeId: currentUser?.id || '12345'
    };

    // Store in localStorage for dummy data persistence
    const existingForms = JSON.parse(localStorage.getItem('hrActionForms') || '[]');
    existingForms.push(submissionData);
    localStorage.setItem('hrActionForms', JSON.stringify(existingForms));

    console.log('HR Action Form submitted:', submissionData);
    setSubmitSuccess(true);

    // Hide success message and close after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      onClose();
    }, 3000);
  };

  const tabs = [
    {
      label: 'Personal Info',
      icon: <PersonIcon />
    },
    {
      label: 'Rate & Position',
      icon: <MoneyIcon />
    },
    {
      label: 'Transfer & Status',
      icon: <BusinessIcon />
    },
    {
      label: 'Leave Request',
      icon: <EventIcon />
    },
    {
      label: 'Review & Submit',
      icon: <AssignmentIcon />
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
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
          <AssignmentIcon />
          <Typography variant="h6">TPA HR Action Form</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {submitSuccess && (
          <Alert severity="success" sx={{ m: 3, mb: 0 }}>
            HR Action Form submitted successfully! Your request ID is HRF-{Date.now()}. 
            HR will review your request and contact you soon.
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Personal Data & Classification
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee Name"
                value={formData.employeeName}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employeeId}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Effective Start Date"
                type="date"
                value={formData.effectiveStartDate}
                onChange={(e) => handleInputChange('effectiveStartDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Shift"
                value={formData.shift}
                onChange={(e) => handleInputChange('shift', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Hours"
                type="number"
                value={formData.totalHours}
                onChange={(e) => handleInputChange('totalHours', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Classification</FormLabel>
                <RadioGroup
                  row
                  value={formData.classification}
                  onChange={(e) => handleInputChange('classification', e.target.value)}
                >
                  <FormControlLabel value="Full Time" control={<Radio />} label="Full Time" />
                  <FormControlLabel value="Part Time" control={<Radio />} label="Part Time" />
                  <FormControlLabel value="PRN" control={<Radio />} label="PRN" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Rate & Position Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Rate Changes & Promotions
          </Typography>
          
          {/* Rate Change Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Rate Change Request
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Previous Rate/Salary"
                    value={formData.previousRate}
                    onChange={(e) => handleInputChange('previousRate', e.target.value)}
                    placeholder="$0.00"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Requested New Rate/Salary"
                    value={formData.newRate}
                    onChange={(e) => handleInputChange('newRate', e.target.value)}
                    placeholder="$0.00"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount of Increase"
                    value={formData.amountIncrease}
                    onChange={(e) => handleInputChange('amountIncrease', e.target.value)}
                    placeholder="$0.00"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Rate Type</FormLabel>
                    <RadioGroup
                      row
                      value={formData.rateType}
                      onChange={(e) => handleInputChange('rateType', e.target.value)}
                    >
                      <FormControlLabel value="Salary" control={<Radio />} label="Salary" />
                      <FormControlLabel value="Hourly" control={<Radio />} label="Hourly" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Promotion Section */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Promotion Request
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Job Title"
                    value={formData.oldJobTitle}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Requested New Job Title"
                    value={formData.newJobTitle}
                    onChange={(e) => handleInputChange('newJobTitle', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Requested New Rate/Salary"
                    value={formData.promotionNewRate}
                    onChange={(e) => handleInputChange('promotionNewRate', e.target.value)}
                    placeholder="$0.00"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Shift Hours"
                    value={formData.promotionShiftHours}
                    onChange={(e) => handleInputChange('promotionShiftHours', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Transfer & Status Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Transfer & Status Changes
          </Typography>
          
          {/* Transfer Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Transfer Request
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Location/Department"
                    value={formData.newLocation}
                    onChange={(e) => handleInputChange('newLocation', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Supervisor/Manager"
                    value={formData.leaderSupervisor}
                    onChange={(e) => handleInputChange('leaderSupervisor', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Transfer Shift Hours"
                    value={formData.transferShiftHours}
                    onChange={(e) => handleInputChange('transferShiftHours', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">New Classification</FormLabel>
                    <RadioGroup
                      row
                      value={formData.newClass}
                      onChange={(e) => handleInputChange('newClass', e.target.value)}
                    >
                      <FormControlLabel value="FT" control={<Radio />} label="FT" />
                      <FormControlLabel value="PT" control={<Radio />} label="PT" />
                      <FormControlLabel value="PRN" control={<Radio />} label="PRN" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Personal Information Changes */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Personal Information Changes
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Name (Legal Name Change)"
                    value={formData.newName}
                    onChange={(e) => handleInputChange('newName', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Email"
                    type="email"
                    value={formData.newEmail}
                    onChange={(e) => handleInputChange('newEmail', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cell Number"
                    value={formData.cellNumber}
                    onChange={(e) => handleInputChange('cellNumber', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Address"
                    value={formData.newAddress}
                    onChange={(e) => handleInputChange('newAddress', e.target.value)}
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Marital Status</FormLabel>
                    <RadioGroup
                      row
                      value={formData.maritalStatus}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    >
                      <FormControlLabel value="M" control={<Radio />} label="Married" />
                      <FormControlLabel value="D" control={<Radio />} label="Divorced" />
                      <FormControlLabel value="S" control={<Radio />} label="Single" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Leave Request Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Leave of Absence Request
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Type of Leave
              </Typography>
              <FormGroup>
                <Grid container spacing={2}>
                  {Object.entries({
                    vacation: 'Vacation',
                    unpaidPersonalTime: 'Unpaid Personal Time',
                    votingTime: 'Voting Time (max: 3hrs)',
                    military: 'Military',
                    paidSickTime: 'Paid Sick Time',
                    familyMedical: 'Family/Medical (FMLA)',
                    pregnancyDisability: 'Pregnancy Disability Leave',
                    juryDuty: 'Jury Duty',
                    unpaidSickTime: 'Unpaid Sick Time',
                    funeral: 'Funeral'
                  }).map(([key, label]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.leaveTypes[key]}
                            onChange={(e) => handleLeaveTypeChange(key, e.target.checked)}
                          />
                        }
                        label={label}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>

              {formData.leaveTypes.funeral && (
                <TextField
                  fullWidth
                  label="Funeral - Relation to Deceased"
                  value={formData.funeralRelation}
                  onChange={(e) => handleInputChange('funeralRelation', e.target.value)}
                  sx={{ mt: 2 }}
                  variant="outlined"
                />
              )}

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={formData.leaveStartDate}
                    onChange={(e) => {
                      handleInputChange('leaveStartDate', e.target.value);
                      setTimeout(calculateLeaveDays, 100);
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={formData.leaveEndDate}
                    onChange={(e) => {
                      handleInputChange('leaveEndDate', e.target.value);
                      setTimeout(calculateLeaveDays, 100);
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Number of Days"
                    type="number"
                    value={formData.leaveDays}
                    onChange={(e) => handleInputChange('leaveDays', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Hours"
                    type="number"
                    value={formData.leaveHours}
                    onChange={(e) => handleInputChange('leaveHours', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Review & Submit Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Review & Submit Request
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Request Reason & Additional Comments
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Request"
                    value={formData.requestReason}
                    onChange={(e) => handleInputChange('requestReason', e.target.value)}
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Please explain the reason for this HR action request..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Comments"
                    value={formData.additionalComments}
                    onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Any additional information or special instructions..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Authorization */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Authorization
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                By submitting this form, you authorize the requested HR actions and understand that 
                all changes are subject to HR approval and company policies.
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Employee:</strong> {formData.employeeName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Status:</strong> Ready for Submission
                  </Typography>
                  <Typography variant="body2">
                    <strong>HR Review:</strong> Pending
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
        >
          Print Form
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          size="large"
          sx={{ minWidth: 150 }}
        >
          Submit to HR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HRActionForm;