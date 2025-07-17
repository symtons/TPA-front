// src/components/leave/LeaveRequestForm.js
import React, { useState, useEffect } from 'react';
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
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Schedule,
  Warning,
  Info,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const LeaveRequestForm = ({ open, onClose, onSubmit, editRequest = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false,
    halfDayPeriod: 'morning'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState({
    pto: 15,
    sick: 8,
    personal: 3,
    vacation: 20
  });

  const leaveTypes = [
    { value: 'PTO', label: 'Paid Time Off', balance: leaveBalance.pto, color: 'primary' },
    { value: 'SICK', label: 'Sick Leave', balance: leaveBalance.sick, color: 'error' },
    { value: 'PERSONAL', label: 'Personal Leave', balance: leaveBalance.personal, color: 'warning' },
    { value: 'VACATION', label: 'Vacation', balance: leaveBalance.vacation, color: 'success' }
  ];

  useEffect(() => {
    if (editRequest) {
      setFormData({
        leaveType: editRequest.leaveType,
        startDate: editRequest.startDate,
        endDate: editRequest.endDate,
        reason: editRequest.reason,
        halfDay: editRequest.halfDay || false,
        halfDayPeriod: editRequest.halfDayPeriod || 'morning'
      });
    } else {
      resetForm();
    }
  }, [editRequest, open]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculateLeaveDays();
    }
  }, [formData.startDate, formData.endDate, formData.halfDay]);

  const resetForm = () => {
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      halfDay: false,
      halfDayPeriod: 'morning'
    });
    setErrors({});
    setCalculatedDays(0);
  };

  const calculateLeaveDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start > end) {
      setCalculatedDays(0);
      return;
    }

    // Calculate business days between dates
    let businessDays = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    // If it's a half day and single day
    if (formData.halfDay && start.getTime() === end.getTime()) {
      businessDays = 0.5;
    }

    setCalculatedDays(businessDays);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }

      if (start > end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    // Check leave balance
    if (formData.leaveType && calculatedDays > 0) {
      const selectedType = leaveTypes.find(type => type.value === formData.leaveType);
      if (selectedType && calculatedDays > selectedType.balance) {
        newErrors.balance = `Insufficient ${selectedType.label.toLowerCase()} balance. You have ${selectedType.balance} days available.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const requestData = {
        ...formData,
        daysRequested: calculatedDays,
        employeeId: user.employee?.id || user.id,
        status: 'PENDING'
      };

      await onSubmit(requestData);
      resetForm();
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to submit leave request' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getSelectedTypeBalance = () => {
    if (!formData.leaveType) return null;
    return leaveTypes.find(type => type.value === formData.leaveType);
  };

  const selectedType = getSelectedTypeBalance();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <CalendarToday />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {editRequest ? 'Edit Leave Request' : 'Request Time Off'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submit your leave request for approval
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={handleClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.submit}
            </Alert>
          )}

          {errors.balance && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {errors.balance}
            </Alert>
          )}

          {/* Employee Info Card */}
          <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.employee?.jobTitle || user.role} • {user.employee?.department || 'TPA'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Leave Type Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.leaveType}>
                <InputLabel>Leave Type *</InputLabel>
                <Select
                  value={formData.leaveType}
                  label="Leave Type *"
                  onChange={(e) => setFormData(prev => ({ ...prev, leaveType: e.target.value }))}
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography>{type.label}</Typography>
                        <Chip 
                          label={`${type.balance} days`} 
                          size="small" 
                          color={type.color}
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.leaveType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.leaveType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Date Selection */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
              />
            </Grid>

            {/* Half Day Option */}
            {formData.startDate && formData.endDate && formData.startDate === formData.endDate && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl>
                    <Select
                      value={formData.halfDay ? 'half' : 'full'}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        halfDay: e.target.value === 'half'
                      }))}
                      size="small"
                    >
                      <MenuItem value="full">Full Day</MenuItem>
                      <MenuItem value="half">Half Day</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {formData.halfDay && (
                    <FormControl>
                      <Select
                        value={formData.halfDayPeriod}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          halfDayPeriod: e.target.value 
                        }))}
                        size="small"
                      >
                        <MenuItem value="morning">Morning</MenuItem>
                        <MenuItem value="afternoon">Afternoon</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Grid>
            )}

            {/* Calculated Days Display */}
            {calculatedDays > 0 && (
              <Grid item xs={12}>
                <Card sx={{ bgcolor: selectedType?.color === 'error' ? '#ffebee' : '#e3f2fd' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Schedule color={selectedType?.color || 'primary'} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          Duration: {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
                        </Typography>
                        {selectedType && (
                          <Typography variant="body2" color="text.secondary">
                            Remaining balance after request: {selectedType.balance - calculatedDays} days
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Reason */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason for Leave"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                error={!!errors.reason}
                helperText={errors.reason || 'Please provide a brief explanation for your time off request'}
                required
              />
            </Grid>

            {/* Leave Balance Summary */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Current Leave Balances
              </Typography>
              <List dense sx={{ bgcolor: '#f8f9fa', borderRadius: 1 }}>
                {leaveTypes.map((type) => (
                  <ListItem key={type.value}>
                    <ListItemIcon>
                      <Chip 
                        size="small" 
                        label={type.value} 
                        color={type.color}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={type.label}
                      secondary={`${type.balance} days available`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || calculatedDays === 0}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
            fontWeight: 600,
            minWidth: 120
          }}
        >
          {loading ? 'Submitting...' : editRequest ? 'Update Request' : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveRequestForm;