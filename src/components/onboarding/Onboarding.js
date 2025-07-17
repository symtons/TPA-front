// src/components/onboarding/Onboarding.js
import React, { useState } from 'react';
import {Box,Tabs,Tab,Paper,Typography,Breadcrumbs, Link} from '@mui/material';
import {Dashboard as DashboardIcon,Assignment,People,Analytics
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import OnboardingOverview from './OnboardingOverview';
import OnboardingTaskList from './OnboardingTaskList';
import PageHeader from '../layout/PageHeader';

const Onboarding = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTabs = () => {
    const baseTabs = [
      { label: 'Overview', icon: <DashboardIcon />, component: <OnboardingOverview /> }
    ];

    // Add different tabs based on user role
    switch (user?.role) {
      case 'Admin':
      case 'HR Manager':
        return [
          ...baseTabs,
          { label: 'Task Management', icon: <Assignment />, component: <OnboardingTaskList /> },
          { label: 'Employee Directory', icon: <People />, component: <EmployeeDirectory /> },
          { label: 'Reports', icon: <Analytics />, component: <OnboardingReports /> }
        ];
      
      case 'Employee (Admin Staff)':
      case 'Employee (Field Staff)':
        return [
          { label: 'My Onboarding', icon: <Assignment />, component: <MyOnboardingTasks /> },
          { label: 'Progress', icon: <Analytics />, component: <MyProgress /> }
        ];
      
      default:
        return baseTabs;
    }
  };

  const tabs = getTabs();

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <PageHeader
        title="Employee Onboarding"
        subtitle="Streamline the onboarding process and track new employee progress"
        breadcrumbs={[
          { label: 'TPA System', href: '#' },
          { label: 'Dashboard', href: '#' },
          { label: 'Onboarding' }
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
const EmployeeDirectory = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>Employee Directory</Typography>
    <Typography variant="body1" color="text.secondary">
      Complete employee directory with onboarding status - coming soon!
    </Typography>
  </Box>
);

const OnboardingReports = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>Onboarding Reports</Typography>
    <Typography variant="body1" color="text.secondary">
      Detailed analytics and reports on onboarding performance - coming soon!
    </Typography>
  </Box>
);

const MyOnboardingTasks = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>My Onboarding Tasks</Typography>
    <Typography variant="body1" color="text.secondary">
      Your personal onboarding checklist and progress - coming soon!
    </Typography>
  </Box>
);

const MyProgress = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>My Progress</Typography>
    <Typography variant="body1" color="text.secondary">
      Track your onboarding progress and milestones - coming soon!
    </Typography>
  </Box>
);

export default Onboarding;