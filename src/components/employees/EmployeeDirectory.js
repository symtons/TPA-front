// src/components/employees/EmployeeDirectory.js
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
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Badge,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  Person,
  Business,
  Schedule,
  CheckCircle,
  Warning,
  TrendingUp,
  Group,
  Work,
  LocationOn,
  CalendarToday,
  Download,
  Upload
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../ui/StatCard';
import CustomCard from '../ui/CustomCard';
import PageHeader from '../layout/PageHeader';

const EmployeeDirectory = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionMenuEmployee, setActionMenuEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState({ type: null, open: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employeeType: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  // Mock employee data
  const mockEmployees = [
    {
      id: 1,
      employeeNumber: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '(555) 123-4567',
      department: 'IT',
      position: 'Software Engineer',
      employeeType: 'Full-time',
      status: 'Active',
      hireDate: '2024-01-15',
      manager: 'Sarah Johnson',
      location: 'Nashville Office',
      salary: 75000,
      avatar: '/api/placeholder/150/150',
      skills: ['JavaScript', 'React', 'Node.js'],
      performanceRating: 4.5,
      lastReview: '2024-12-01',
      nextReview: '2025-06-01',
      leaveBalance: { pto: 15, sick: 8 },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '(555) 123-4568'
      }
    },
    {
      id: 2,
      employeeNumber: 'EMP002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '(555) 234-5678',
      department: 'Operations',
      position: 'Field Operations Specialist',
      employeeType: 'Full-time',
      status: 'Active',
      hireDate: '2024-02-20',
      manager: 'Mike Stevens',
      location: 'Mobile Field Unit',
      salary: 58000,
      avatar: '/api/placeholder/150/150',
      skills: ['Customer Service', 'Field Operations', 'Safety Protocols'],
      performanceRating: 4.8,
      lastReview: '2024-11-15',
      nextReview: '2025-05-15',
      leaveBalance: { pto: 20, sick: 7 },
      emergencyContact: {
        name: 'Bob Smith',
        relationship: 'Father',
        phone: '(555) 234-5679'
      }
    },
    {
      id: 3,
      employeeNumber: 'EMP003',
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson@company.com',
      phone: '(555) 345-6789',
      department: 'Finance',
      position: 'Financial Analyst',
      employeeType: 'Full-time',
      status: 'Active',
      hireDate: '2023-11-10',
      manager: 'Lisa Chen',
      location: 'Nashville Office',
      salary: 68000,
      avatar: '/api/placeholder/150/150',
      skills: ['Financial Analysis', 'Excel', 'QuickBooks'],
      performanceRating: 4.2,
      lastReview: '2024-10-30',
      nextReview: '2025-04-30',
      leaveBalance: { pto: 12, sick: 8 },
      emergencyContact: {
        name: 'Mary Wilson',
        relationship: 'Wife',
        phone: '(555) 345-6790'
      }
    },
    {
      id: 4,
      employeeNumber: 'EMP004',
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice.brown@company.com',
      phone: '(555) 456-7890',
      department: 'HR',
      position: 'HR Coordinator',
      employeeType: 'Full-time',
      status: 'Active',
      hireDate: '2024-03-01',
      manager: 'David Park',
      location: 'Nashville Office',
      salary: 52000,
      avatar: '/api/placeholder/150/150',
      skills: ['Recruitment', 'Employee Relations', 'HRIS'],
      performanceRating: 4.6,
      lastReview: '2024-12-15',
      nextReview: '2025-06-15',
      leaveBalance: { pto: 18, sick: 8 },
      emergencyContact: {
        name: 'Charlie Brown',
        relationship: 'Brother',
        phone: '(555) 456-7891'
      }
    },
    {
      id: 5,
      employeeNumber: 'EMP005',
      firstName: 'Charlie',
      lastName: 'Davis',
      email: 'charlie.davis@company.com',
      phone: '(555) 567-8901',
      department: 'IT',
      position: 'System Administrator',
      employeeType: 'Full-time',
      status: 'On Leave',
      hireDate: '2023-09-15',
      manager: 'Sarah Johnson',
      location: 'Remote',
      salary: 72000,
      avatar: '/api/placeholder/150/150',
      skills: ['System Administration', 'Network Security', 'Linux'],
      performanceRating: 4.4,
      lastReview: '2024-09-15',
      nextReview: '2025-03-15',
      leaveBalance: { pto: 8, sick: 8 },
      emergencyContact: {
        name: 'Diana Davis',
        relationship: 'Mother',
        phone: '(555) 567-8902'
      }
    },
    {
      id: 6,
      employeeNumber: 'EMP006',
      firstName: 'Diana',
      lastName: 'Martinez',
      email: 'diana.martinez@company.com',
      phone: '(555) 678-9012',
      department: 'Operations',
      position: 'Customer Service Representative',
      employeeType: 'Part-time',
      status: 'Active',
      hireDate: '2024-05-10',
      manager: 'Mike Stevens',
      location: 'Nashville Office',
      salary: 35000,
      avatar: '/api/placeholder/150/150',
      skills: ['Customer Service', 'CRM Software', 'Bilingual (Spanish)'],
      performanceRating: 4.7,
      lastReview: '2024-11-10',
      nextReview: '2025-05-10',
      leaveBalance: { pto: 14, sick: 6 },
      emergencyContact: {
        name: 'Eduardo Martinez',
        relationship: 'Husband',
        phone: '(555) 678-9013'
      }
    }
  ];

  // Employee statistics
  const employeeStats = {
    totalEmployees: mockEmployees.length,
    activeEmployees: mockEmployees.filter(emp => emp.status === 'Active').length,
    newHires: mockEmployees.filter(emp => {
      const hireDate = new Date(emp.hireDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate > thirtyDaysAgo;
    }).length,
    avgTenure: '1.2 years',
    departments: [...new Set(mockEmployees.map(emp => emp.department))].length,
    turnoverRate: '8.5%'
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setEmployees(mockEmployees);
      setFilteredEmployees(mockEmployees);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, filters, employees]);

  const filterEmployees = () => {
    let filtered = employees;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (filters.department) {
      filtered = filtered.filter(employee => employee.department === filters.department);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(employee => employee.status === filters.status);
    }

    // Employee type filter
    if (filters.employeeType) {
      filtered = filtered.filter(employee => employee.employeeType === filters.employeeType);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(employee => employee.location === filters.location);
    }

    setFilteredEmployees(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Inactive': return 'error';
      case 'Terminated': return 'error';
      default: return 'default';
    }
  };

  const getEmployeeTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'primary';
      case 'Part-time': return 'secondary';
      case 'Contract': return 'info';
      case 'Intern': return 'warning';
      default: return 'default';
    }
  };

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setActionMenuEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionMenuEmployee(null);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog({ type: 'view', open: true });
    setAnchorEl(null);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog({ type: 'edit', open: true });
    setAnchorEl(null);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setOpenDialog({ type: 'add', open: true });
  };

  const closeDialog = () => {
    setOpenDialog({ type: null, open: false });
    setSelectedEmployee(null);
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      employeeType: '',
      location: ''
    });
    setSearchTerm('');
  };

  const departments = [...new Set(employees.map(emp => emp.department))];
  const locations = [...new Set(employees.map(emp => emp.location))];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading employee directory...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Employee Directory"
        subtitle="Manage and view all TPA employees and their information"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Employees' }
        ]}
        actions={
          user?.role === 'Admin' || user?.role === 'HR Manager' ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
              >
                Import
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddEmployee}
                sx={{
                  background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                  fontWeight: 600
                }}
              >
                Add Employee
              </Button>
            </Box>
          ) : null
        }
      />

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Total Employees"
            value={employeeStats.totalEmployees}
            icon={<Group />}
            color="primary"
            subtitle="All employees"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Active Employees"
            value={employeeStats.activeEmployees}
            icon={<CheckCircle />}
            color="success"
            subtitle="Currently working"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="New Hires"
            value={employeeStats.newHires}
            icon={<TrendingUp />}
            color="info"
            subtitle="Last 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Departments"
            value={employeeStats.departments}
            icon={<Business />}
            color="secondary"
            subtitle="Active departments"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Avg Tenure"
            value={employeeStats.avgTenure}
            icon={<Schedule />}
            color="warning"
            subtitle="Employee tenure"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Turnover Rate"
            value={employeeStats.turnoverRate}
            icon={<TrendingUp />}
            color="error"
            subtitle="Annual rate"
          />
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <CustomCard sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department}
                label="Department"
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.employeeType}
                label="Type"
                onChange={(e) => setFilters(prev => ({ ...prev, employeeType: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={clearFilters}
                fullWidth
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CustomCard>

      {/* Employee Table */}
      <CustomCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="600">
            Employees ({filteredEmployees.length})
          </Typography>
          <Chip 
            label={`${filteredEmployees.length} of ${employees.length} employees`} 
            color="primary" 
            variant="outlined"
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Hire Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ bgcolor: 'primary.main' }}
                        src={employee.avatar}
                      >
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {employee.firstName} {employee.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.employeeNumber} • {employee.position}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{employee.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.department}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={employee.status}
                        color={getStatusColor(employee.status)}
                        size="small"
                      />
                      <Chip
                        label={employee.employeeType}
                        color={getEmployeeTypeColor(employee.employeeType)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{employee.location}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{employee.hireDate}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {(user?.role === 'Admin' || user?.role === 'HR Manager') && (
                        <Tooltip title="Edit Employee">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, employee)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredEmployees.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No employees found matching your search criteria
            </Typography>
            <Button onClick={clearFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          </Box>
        )}
      </CustomCard>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewEmployee(actionMenuEmployee)}>
          <Visibility sx={{ mr: 1 }} />
          View Profile
        </MenuItem>
        {(user?.role === 'Admin' || user?.role === 'HR Manager') && [
          <MenuItem key="edit" onClick={() => handleEditEmployee(actionMenuEmployee)}>
            <Edit sx={{ mr: 1 }} />
            Edit Employee
          </MenuItem>,
          <Divider key="divider" />
        ]}
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1 }} />
          Send Email
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Phone sx={{ mr: 1 }} />
          Call Employee
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CalendarToday sx={{ mr: 1 }} />
          View Schedule
        </MenuItem>
      </Menu>

      {/* Employee Detail/Edit Dialog - Will be implemented in the next component */}
      <EmployeeDialog
        open={openDialog.open}
        type={openDialog.type}
        employee={selectedEmployee}
        onClose={closeDialog}
      />
    </Box>
  );
};

// Placeholder for Employee Dialog - will be implemented separately
const EmployeeDialog = ({ open, type, employee, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      {type === 'view' ? 'Employee Details' : 
       type === 'edit' ? 'Edit Employee' : 'Add New Employee'}
    </DialogTitle>
    <DialogContent>
      <Typography>
        Employee dialog will be implemented in the next component...
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default EmployeeDirectory;