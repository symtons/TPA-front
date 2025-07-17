// src/components/Dashboard.js - Updated with Employee Onboarding
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Schedule,
  RequestPage,
  Settings,
  ExitToApp,
  Assignment,
  Notifications
} from '@mui/icons-material';
import { ROLES } from '../constants';
import TPALogo from './ui/TPALogo';
import PageHeader from './layout/PageHeader';
import DashboardStatsSection from './dashboard/DashboardStatsSection';
import QuickActionsSection from './dashboard/QuickActionsSection';
import RecentActivitiesSection from './dashboard/RecentActivitiesSection';
import CustomCard from './ui/CustomCard';

// Import Time & Attendance Components
import TimeAttendancePage from './timeAttendance/TimeAttendancePage';

// Import Leave Management Components
import LeaveManagement from './leave/LeaveManagement';

// Import Onboarding Components  
import Onboarding from './onboarding/Onboarding';
import EmployeeOnboarding from './onboarding/EmployeeOnboarding';
import EmployeeManagement from './employees/EmployeeManagement';

// ADD THESE TWO IMPORTS FOR HR ACTION FORM:
import HRActionForm from './hrAction/HRActionForm';
import HRManagementDashboard from './hrAction/HRManagementDashboard';

const Dashboard = ({ user, onLogout }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // ADD THESE TWO STATE VARIABLES FOR HR ACTION FORM:
  const [hrActionFormOpen, setHrActionFormOpen] = useState(false);
  const [hrManagementOpen, setHrManagementOpen] = useState(false);

  const getMenuItems = (role) => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, tab: 0 },
    ];

    switch (role) {
      case ROLES.ADMIN:
        return [
          ...baseItems,
          { text: 'Employees', icon: <People />, tab: 1 },
          { text: 'Time & Attendance', icon: <Schedule />, tab: 2 },
          { text: 'Leave Management', icon: <RequestPage />, tab: 3 },
          { text: 'Onboarding', icon: <Assignment />, tab: 4 },
          { text: 'Settings', icon: <Settings />, tab: 5 }
        ];
      case ROLES.HR_MANAGER:
        return [
          ...baseItems,
          { text: 'Employees', icon: <People />, tab: 1 },
          { text: 'Time & Attendance', icon: <Schedule />, tab: 2 },
          { text: 'Leave Management', icon: <RequestPage />, tab: 3 },
          { text: 'Onboarding', icon: <Assignment />, tab: 4 }
        ];
      case ROLES.ADMIN_STAFF:
        return [
          ...baseItems,
          { text: 'Time & Attendance', icon: <Schedule />, tab: 2 },
          { text: 'Leave Management', icon: <RequestPage />, tab: 3 },
          { text: 'My Onboarding', icon: <Assignment />, tab: 4 },
          { text: 'My Profile', icon: <Settings />, tab: 5 }
        ];
      case ROLES.FIELD_STAFF:
        return [
          ...baseItems,
          { text: 'Time & Attendance', icon: <Schedule />, tab: 2 },
          { text: 'Leave Management', icon: <RequestPage />, tab: 3 },
          { text: 'My Onboarding', icon: <Assignment />, tab: 4 }
        ];
      default:
        return baseItems;
    }
  };

  const handleQuickAction = (action) => {
    console.log('Quick action clicked:', action);
    
    // ADD THESE TWO CASES FOR HR ACTION FORM:
    if (action === 'hr_action_form') {
      setHrActionFormOpen(true);
      return;
    }
    
    if (action === 'hr_management') {
      setHrManagementOpen(true);
      return;
    }
    
    // KEEP ALL YOUR EXISTING LOGIC EXACTLY THE SAME:
    switch (action) {
      case 'employees':
        setSelectedTab(1);
        break;
      case 'schedule':
      case 'time-tracking':
      case 'clock-toggle':
      case 'view-timesheet':
      case 'submit-timesheet':
      case 'view-attendance':
      case 'approve-timesheets':
      case 'attendance-reports':
        setSelectedTab(2);
        break;
      case 'leave-requests':
      case 'request-leave':
        setSelectedTab(3);
        break;
      case 'onboarding':
      case 'tasks':
      case 'my-onboarding':
        setSelectedTab(4);
        break;
      case 'settings':
        setSelectedTab(5);
        break;
      default:
        break;
    }
  };

  const menuItems = getMenuItems(user.role);
  const currentPage = menuItems.find(item => item.tab === selectedTab);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <>
            <PageHeader
              title={`${user.role} Dashboard`}
              subtitle={`Welcome back, ${user.name}! Here's what's happening at TPA today.`}
              breadcrumbs={[
                { label: 'TPA System', href: '#' },
                { label: 'Dashboard' }
              ]}
            />
            
            {/* Two Column Layout */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'flex-start' }}>
              {/* Left Column - Stats Cards + Quick Actions */}
              <Box sx={{ flex: '3', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Stats Cards Section */}
                <DashboardStatsSection user={user} />
                
                {/* Quick Actions Section */}
                <QuickActionsSection user={user} onActionClick={handleQuickAction} />
              </Box>
              
              {/* Right Column - Recent Activities (Independent) */}
              <Box sx={{ flex: '1', minWidth: '300px' }}>
                <RecentActivitiesSection user={user} />
              </Box>
            </Box>
          </>
        );
      
      case 1: // Employees Tab
        return <EmployeeManagement />;

      case 2: // Time & Attendance Tab
        return <TimeAttendancePage />;
      
      case 3: // Leave Management Tab
        return <LeaveManagement />;
      
      case 4: // Onboarding Tab - UPDATED LOGIC
        // Show different onboarding views based on role
        if (user.role === ROLES.ADMIN || user.role === ROLES.HR_MANAGER) {
          // Management view - full onboarding system
          return <Onboarding />;
        } else if (user.role === ROLES.ADMIN_STAFF || user.role === ROLES.FIELD_STAFF || user.role?.includes('Employee')) {
          // Employee view - personal onboarding tasks using the NEW component
          return <EmployeeOnboarding />;
        } else {
          // Fallback for other roles
          return (
            <CustomCard>
              <Typography variant="h6" gutterBottom>Onboarding</Typography>
              <Typography variant="body1" color="text.secondary">
                Onboarding functionality is not available for your role.
              </Typography>
            </CustomCard>
          );
        }
      
      default:
        return (
          <>
            <PageHeader
              title={currentPage?.text || 'Page'}
              subtitle={`Manage ${currentPage?.text.toLowerCase()} for TPA.`}
              breadcrumbs={[
                { label: 'TPA System', href: '#' },
                { label: 'Dashboard', href: '#' },
                { label: currentPage?.text || 'Page' }
              ]}
            />
            <CustomCard>
              <Typography variant="h6" gutterBottom>
                {currentPage?.text || 'Page'} - {user.role}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This section is under development. Content for {user.role} coming soon!
              </Typography>
            </CustomCard>
          </>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TPALogo size="medium" variant="minimal" />
        </Box>
        
        <List sx={{ px: 2, py: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={selectedTab === item.tab}
              onClick={() => setSelectedTab(item.tab)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #f57c00 90%)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: selectedTab === item.tab ? 600 : 400
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          elevation={1}
          sx={{ 
            zIndex: 1201, 
            width: `calc(100% - 260px)`, 
            ml: `260px`,
            background: 'linear-gradient(90deg, #1976d2 0%, #ff9800 100%)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }} fontWeight="600">
              TPA Management System
            </Typography>
            
            <Badge badgeContent={4} color="error">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <Notifications />
              </IconButton>
            </Badge>
            
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                {user.name.charAt(0)}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>
                  {user.name.charAt(0)}
                </Avatar>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Settings sx={{ width: 24, height: 24, mr: 1 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={onLogout}>
                <ExitToApp sx={{ width: 24, height: 24, mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="xl" sx={{ mt: 10, mb: 4, px: 3 }}>
          {renderTabContent()}
        </Container>
      </Box>

      {/* ADD THESE TWO COMPONENTS AT THE END FOR HR ACTION FORM: */}
      <HRActionForm 
        open={hrActionFormOpen}
        onClose={() => setHrActionFormOpen(false)}
        currentUser={user}
      />

      {(user?.role === 'Admin' || user?.role === 'HR Manager') && (
        <HRManagementDashboard 
          open={hrManagementOpen}
          onClose={() => setHrManagementOpen(false)}
          currentUser={user}
        />
      )}
    </Box>
  );
};

export default Dashboard;