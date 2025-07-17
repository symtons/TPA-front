// src/components/leave/LeaveManagement.js
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
  Assignment,
  CalendarToday,
  Analytics,
  Settings,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants';
import LeaveManagementDashboard from './LeaveManagementDashboard';
import EmployeeLeaveDashboard from './EmployeeLeaveDashboard';
import PageHeader from '../layout/PageHeader';

const LeaveManagement = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTabs = () => {
    const isManagerOrHR = user?.role === ROLES.ADMIN || user?.role === ROLES.HR_MANAGER;
    const isEmployee = user?.role === ROLES.ADMIN_STAFF || user?.role === ROLES.FIELD_STAFF;

    if (isManagerOrHR) {
      return [
        { 
          label: 'Dashboard', 
          icon: <DashboardIcon />, 
          component: <LeaveManagementDashboard />,
          description: 'Overview of all leave requests and team status'
        },
        { 
          label: 'My Leave', 
          icon: <Person />, 
          component: <EmployeeLeaveDashboard />,
          description: 'Manage your personal time off requests'
        },
        { 
          label: 'Calendar View', 
          icon: <CalendarToday />, 
          component: <LeaveCalendarView />,
          description: 'Visual calendar of team leave schedules'
        },
        { 
          label: 'Reports', 
          icon: <Analytics />, 
          component: <LeaveReportsView />,
          description: 'Detailed analytics and leave reports'
        },
        { 
          label: 'Settings', 
          icon: <Settings />, 
          component: <LeaveSettingsView />,
          description: 'Configure leave policies and types'
        }
      ];
    } else if (isEmployee) {
      return [
        { 
          label: 'My Leave', 
          icon: <Person />, 
          component: <EmployeeLeaveDashboard />,
          description: 'Manage your time off requests and balances'
        },
        { 
          label: 'Team Calendar', 
          icon: <CalendarToday />, 
          component: <TeamLeaveCalendar />,
          description: 'View your team\'s leave schedule'
        }
      ];
    }

    // Default view for other roles
    return [
      { 
        label: 'My Leave', 
        icon: <Person />, 
        component: <EmployeeLeaveDashboard />,
        description: 'Manage your time off requests'
      }
    ];
  };

  const tabs = getTabs();

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Mock data for pending requests badge
  const pendingRequestsCount = user?.role === ROLES.ADMIN || user?.role === ROLES.HR_MANAGER ? 12 : 0;

  return (
    <Box>
      <PageHeader
        title="Leave Management"
        subtitle="Manage time off requests, track balances, and maintain work-life balance"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Leave Management' }
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
              
              // Add badge for pending requests on Dashboard tab
              if (tab.label === 'Dashboard' && pendingRequestsCount > 0) {
                label = (
                  <Badge badgeContent={pendingRequestsCount} color="error">
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
    </Box>
  );
};

// Placeholder components for additional tabs
const LeaveCalendarView = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Leave Calendar View
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Interactive calendar showing all team leave requests and approved time off - coming soon!
    </Typography>
    <Box sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Planned Features:
      </Typography>
      <ul>
        <li>Monthly/weekly calendar views</li>
        <li>Color-coded leave types</li>
        <li>Drag and drop rescheduling</li>
        <li>Team overlap detection</li>
        <li>Holiday integration</li>
        <li>Export to external calendars</li>
      </ul>
    </Box>
  </Box>
);

const LeaveReportsView = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Leave Analytics & Reports
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Comprehensive reporting and analytics for leave management - coming soon!
    </Typography>
    <Box sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Available Reports:
      </Typography>
      <ul>
        <li>Leave utilization by department</li>
        <li>Peak leave periods analysis</li>
        <li>Employee leave balance reports</li>
        <li>Approval/rejection trends</li>
        <li>Leave pattern analysis</li>
        <li>Cost analysis and projections</li>
      </ul>
    </Box>
  </Box>
);

const LeaveSettingsView = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Leave Policy Settings
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Configure leave policies, types, and approval workflows - coming soon!
    </Typography>
    <Box sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Configuration Options:
      </Typography>
      <ul>
        <li>Leave type management (PTO, Sick, Personal, etc.)</li>
        <li>Accrual policies and rules</li>
        <li>Approval workflow customization</li>
        <li>Holiday calendar management</li>
        <li>Notification settings</li>
        <li>Integration with payroll systems</li>
      </ul>
    </Box>
  </Box>
);

const TeamLeaveCalendar = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Team Leave Calendar
    </Typography>
    <Typography variant="body1" color="text.secondary">
      View your team's upcoming leave and plan accordingly - coming soon!
    </Typography>
    <Box sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Team Calendar Features:
      </Typography>
      <ul>
        <li>See who's out when</li>
        <li>Plan around team availability</li>
        <li>Identify coverage needs</li>
        <li>Coordinate project timelines</li>
        <li>Request time off with team visibility</li>
      </ul>
    </Box>
  </Box>
);

export default LeaveManagement;