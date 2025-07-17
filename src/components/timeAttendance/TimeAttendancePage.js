// =============================================================================
// TIME ATTENDANCE PAGE - MAIN CONTAINER
// File: src/components/timeAttendance/TimeAttendancePage.js
// =============================================================================

import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper
} from '@mui/material';
import {
  AccessTime,
  Schedule,
  Assignment,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../layout/PageHeader';
import ClockInOut from './ClockInOut';
import TimeEntries from './TimeEntries';
import Timesheet from './Timesheet';
import AttendanceReports from './AttendanceReports';

const TimeAttendancePage = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  const isManager = user.role === 'Admin' || user.role === 'HR Manager';

  const tabs = [
    { 
      label: 'Clock In/Out', 
      icon: <AccessTime />, 
      component: <ClockInOut />,
      description: 'Track your work time with easy clock in/out'
    },
    { 
      label: 'Time Entries', 
      icon: <Schedule />, 
      component: <TimeEntries />,
      description: 'View your detailed time entry history'
    },
    { 
      label: 'Timesheet', 
      icon: <Assignment />, 
      component: <Timesheet />,
      description: 'Review and submit weekly timesheets'
    },
    ...(isManager ? [{ 
      label: 'Reports', 
      icon: <Assessment />, 
      component: <AttendanceReports />,
      description: 'Comprehensive attendance and time reports'
    }] : [])
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const currentTab = tabs[selectedTab];

  return (
    <Container maxWidth="xl" sx={{ py: 0 }}>
      <PageHeader
        title="Time & Attendance"
        subtitle="Track work hours, manage timesheets, and monitor attendance"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Time & Attendance' }
        ]}
      />

      {/* Tab Navigation */}
      <Paper 
        elevation={1} 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)'
        }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                minHeight: 72
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                icon={tab.icon} 
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="600">
                      {tab.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {tab.description}
                    </Typography>
                  </Box>
                }
                iconPosition="top"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 72,
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main'
                    }
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content Header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box display="flex" alignItems="center">
            {currentTab.icon}
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {currentTab.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTab.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {tabs[selectedTab]?.component}
      </Box>

      {/* Footer Info */}
      <Box sx={{ 
        mt: 4, 
        p: 2, 
        bgcolor: 'grey.50', 
        borderRadius: 2,
        textAlign: 'center' 
      }}>
        <Typography variant="body2" color="text.secondary">
          <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
          All times are recorded in your local timezone. 
          Contact HR if you have questions about time tracking policies.
        </Typography>
      </Box>
    </Container>
  );
};

export default TimeAttendancePage;