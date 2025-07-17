// src/components/employees/EmployeeManagement.js
import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Analytics,
  Assignment,
  Settings,
  PersonAdd
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants';
import EmployeeDirectory from './EmployeeDirectory';
import EmployeeProfile from './EmployeeProfile';
import EmployeeAnalytics from './EmployeeAnalytics';
import PageHeader from '../layout/PageHeader';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [profileDialog, setProfileDialog] = useState({ open: false, type: null, employee: null });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTabs = () => {
    const isAdminOrHR = user?.role === ROLES.ADMIN || user?.role === ROLES.HR_MANAGER;

    if (isAdminOrHR) {
      return [
        { 
          label: 'Employee Directory', 
          icon: <People />, 
          component: (
            <EmployeeDirectory 
              onViewEmployee={(employee) => setProfileDialog({ open: true, type: 'view', employee })}
              onEditEmployee={(employee) => setProfileDialog({ open: true, type: 'edit', employee })}
              onAddEmployee={() => setProfileDialog({ open: true, type: 'add', employee: null })}
            />
          ),
          description: 'Complete directory of all employees with search and filtering'
        },
        { 
          label: 'Analytics', 
          icon: <Analytics />, 
          component: <EmployeeAnalytics />,
          description: 'Workforce analytics, metrics, and insights'
        },
        { 
          label: 'Organization Chart', 
          icon: <DashboardIcon />, 
          component: <OrganizationChart />,
          description: 'Visual organization structure and reporting lines'
        },
        { 
          label: 'Performance', 
          icon: <Assignment />, 
          component: <PerformanceOverview />,
          description: 'Performance reviews and employee development tracking'
        },
        { 
          label: 'Settings', 
          icon: <Settings />, 
          component: <EmployeeSettings />,
          description: 'Configure employee policies and system settings'
        }
      ];
    } else {
      // Limited view for non-admin users
      return [
        { 
          label: 'Employee Directory', 
          icon: <People />, 
          component: (
            <EmployeeDirectory 
              onViewEmployee={(employee) => setProfileDialog({ open: true, type: 'view', employee })}
              viewOnly={true}
            />
          ),
          description: 'View employee directory and contact information'
        },
        { 
          label: 'Organization Chart', 
          icon: <DashboardIcon />, 
          component: <OrganizationChart />,
          description: 'Company organization structure'
        }
      ];
    }
  };

  const handleSaveEmployee = (employeeData) => {
    console.log('Saving employee:', employeeData);
    // Here you would call your API to save the employee
    // await employeeService.saveEmployee(employeeData);
    setProfileDialog({ open: false, type: null, employee: null });
  };

  const tabs = getTabs();

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Mock data for badges
  const pendingReviewsCount = 12;
  const newEmployeesCount = 3;

  return (
    <Box>
      <PageHeader
        title="Employee Management"
        subtitle="Manage employees, track performance, and analyze workforce data"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Employees' }
        ]}
      />

      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              px: 3,
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            {tabs.map((tab, index) => {
              let label = tab.label;
              
              // Add badges for specific tabs
              if (tab.label === 'Performance' && pendingReviewsCount > 0) {
                label = (
                  <Badge badgeContent={pendingReviewsCount} color="warning">
                    {tab.label}
                  </Badge>
                );
              } else if (tab.label === 'Employee Directory' && newEmployeesCount > 0) {
                label = (
                  <Badge badgeContent={newEmployeesCount} color="success">
                    {tab.label}
                  </Badge>
                );
              }

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

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </Paper>

      {/* Employee Profile Dialog */}
      <EmployeeProfile
        open={profileDialog.open}
        type={profileDialog.type}
        employee={profileDialog.employee}
        onClose={() => setProfileDialog({ open: false, type: null, employee: null })}
        onSave={handleSaveEmployee}
      />
    </Box>
  );
};

// Placeholder components for additional tabs
const OrganizationChart = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Organization Chart
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Interactive organization chart showing reporting structure and team hierarchies - coming soon!
    </Typography>
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Planned Features:
      </Typography>
      <ul>
        <li>Visual organization tree with employee photos</li>
        <li>Department-based views</li>
        <li>Drag-and-drop reorganization</li>
        <li>Reporting line management</li>
        <li>Team structure analysis</li>
        <li>Export to various formats</li>
      </ul>
    </Box>
  </Box>
);

const PerformanceOverview = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Performance Management
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Comprehensive performance tracking and review management system - coming soon!
    </Typography>
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Performance Features:
      </Typography>
      <ul>
        <li>360-degree performance reviews</li>
        <li>Goal setting and tracking</li>
        <li>Performance improvement plans</li>
        <li>Competency assessments</li>
        <li>Career development planning</li>
        <li>Performance analytics and reporting</li>
      </ul>
    </Box>
  </Box>
);

const EmployeeSettings = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Employee System Settings
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Configure employee management policies and system preferences - coming soon!
    </Typography>
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Configuration Options:
      </Typography>
      <ul>
        <li>Employee number generation rules</li>
        <li>Department and role management</li>
        <li>Performance review cycles</li>
        <li>Onboarding workflow templates</li>
        <li>Document requirements and templates</li>
        <li>Integration settings (HRIS, Payroll)</li>
      </ul>
    </Box>
  </Box>
);

export default EmployeeManagement;