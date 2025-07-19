// =============================================================================
// UPDATED DASHBOARD WITH DYNAMIC MENU SYSTEM
// File: src/components/Dashboard.js (REPLACE EXISTING)
// =============================================================================

import React, { useState, useEffect } from 'react';
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
  Badge,
  Divider,
  Alert,
  Button
} from '@mui/material';
import {
  Settings,
  ExitToApp,
  Notifications,
  Refresh
} from '@mui/icons-material';

// Import existing components
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

// Import HR Action Components
import HRActionForm from './hrAction/HRActionForm';
import HRManagementDashboard from './hrAction/HRManagementDashboard';

// Import new dynamic menu components
import DynamicSidebar from './layout/DynamicSidebar';
import DynamicBreadcrumbs from './layout/DynamicBreadcrumbs';
import MenuManagement from './menu/MenuManagement';

const Dashboard = ({ user, onLogout }) => {
  const [currentRoute, setCurrentRoute] = useState('/dashboard');
  const [anchorEl, setAnchorEl] = useState(null);
  const [hrActionFormOpen, setHrActionFormOpen] = useState(false);
  const [hrManagementOpen, setHrManagementOpen] = useState(false);
  const [menuError, setMenuError] = useState('');

  // Set initial route based on user role
  useEffect(() => {
    if (user) {
      setCurrentRoute('/dashboard');
    }
  }, [user]);

  const handleMenuSelect = (route, menuItem) => {
    console.log('🔄 Navigating to:', route, menuItem);
    setCurrentRoute(route);
    setMenuError(''); // Clear any menu errors when navigating
  };

  const handleBreadcrumbNavigate = (route) => {
    console.log('🍞 Breadcrumb navigation to:', route);
    setCurrentRoute(route);
  };

  const handleQuickAction = (action) => {
    console.log('⚡ Quick action clicked:', action);
    
    // Map quick actions to routes
    const actionRoutes = {
      'employees': '/employees',
      'schedule': '/time-attendance',
      'time-tracking': '/time-attendance',
      'leave-requests': '/leave',
      'request-leave': '/leave',
      'onboarding': '/onboarding',
      'tasks': '/onboarding',
      'settings': '/settings',
      'reports': '/reports'
    };

    const route = actionRoutes[action];
    if (route) {
      setCurrentRoute(route);
    }
  };

  const getCurrentPageTitle = () => {
    const routeTitles = {
      '/dashboard': `${user?.role || 'User'} Dashboard`,
      '/employees': 'Employee Management',
      '/time-attendance': 'Time & Attendance',
      '/leave': 'Leave Management',
      '/onboarding': 'Employee Onboarding',
      '/settings': 'Settings',
      '/reports': 'Reports',
      '/menu-management': 'Menu Management'
    };

    return routeTitles[currentRoute] || 'TPA HR System';
  };

  const getCurrentPageSubtitle = () => {
    const routeSubtitles = {
      '/dashboard': `Welcome back, ${user?.name || user?.email}!`,
      '/employees': 'Manage employee information and records',
      '/time-attendance': 'Track time, attendance, and schedules',
      '/leave': 'Manage leave requests and approvals',
      '/onboarding': 'Employee onboarding and orientation',
      '/settings': 'System configuration and preferences',
      '/reports': 'View and generate reports',
      '/menu-management': 'Configure navigation menus and permissions'
    };

    return routeSubtitles[currentRoute] || '';
  };

  const renderPageContent = () => {
    try {
      switch (currentRoute) {
        case '/dashboard':
          return (
            <>
              <DashboardStatsSection 
                user={user} 
                onQuickAction={handleQuickAction} 
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mt: 3 }}>
                <QuickActionsSection 
                  user={user} 
                  onAction={handleQuickAction} 
                />
                <RecentActivitiesSection user={user} />
              </Box>
            </>
          );

        case '/employees':
          return <EmployeeManagement user={user} />;

        case '/time-attendance':
          return <TimeAttendancePage user={user} />;

        case '/leave':
          return <LeaveManagement user={user} />;

        case '/onboarding':
          if (user?.role === 'Employee') {
            return <EmployeeOnboarding user={user} />;
          } else {
            return <Onboarding user={user} />;
          }

        case '/menu-management':
          return <MenuManagement user={user} />;

        case '/settings':
          return (
            <CustomCard title="Settings" subtitle="System configuration and preferences">
              <Typography variant="body1" color="text.secondary" sx={{ p: 3 }}>
                Settings functionality coming soon! You can configure:
              </Typography>
              <Box component="ul" sx={{ pl: 4, pr: 2, pb: 2 }}>
                <li>User preferences</li>
                <li>Notification settings</li>
                <li>System configurations</li>
                <li>Role permissions</li>
              </Box>
            </CustomCard>
          );

        case '/reports':
          return (
            <CustomCard title="Reports" subtitle="View and generate comprehensive reports">
              <Typography variant="body1" color="text.secondary" sx={{ p: 3 }}>
                Reporting functionality coming soon! Available reports will include:
              </Typography>
              <Box component="ul" sx={{ pl: 4, pr: 2, pb: 2 }}>
                <li>Employee attendance reports</li>
                <li>Leave balance summaries</li>
                <li>Department performance metrics</li>
                <li>Onboarding progress tracking</li>
              </Box>
            </CustomCard>
          );

        default:
          return (
            <CustomCard title="Page Not Found" subtitle="The requested page could not be found">
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  The page "{currentRoute}" is not available or you don't have permission to access it.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setCurrentRoute('/dashboard')}
                  sx={{ mt: 2 }}
                >
                  Return to Dashboard
                </Button>
              </Box>
            </CustomCard>
          );
      }
    } catch (error) {
      console.error('Error rendering page content:', error);
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Page
          </Typography>
          <Typography variant="body2" gutterBottom>
            There was an error loading the page content: {error.message}
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Refresh Page
          </Button>
        </Alert>
      );
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Dynamic Sidebar */}
      <DynamicSidebar
        selectedRoute={currentRoute}
        onMenuSelect={handleMenuSelect}
        user={user}
        width={260}
      />

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
            
            {/* Menu Error Indicator */}
            {menuError && (
              <IconButton 
                color="inherit" 
                size="small"
                onClick={() => setMenuError('')}
                sx={{ mr: 1 }}
              >
                <Alert severity="error" sx={{ py: 0 }}>
                  Menu Error
                </Alert>
              </IconButton>
            )}
            
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
                {(user?.name || user?.email)?.charAt(0)?.toUpperCase()}
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
                  {(user?.name || user?.email)?.charAt(0)?.toUpperCase()}
                </Avatar>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); setCurrentRoute('/settings'); }}>
                <Settings sx={{ width: 24, height: 24, mr: 1 }} />
                Settings
              </MenuItem>
              {(user?.role === 'SuperAdmin') && (
                <MenuItem onClick={() => { setAnchorEl(null); setCurrentRoute('/menu-management'); }}>
                  <Settings sx={{ width: 24, height: 24, mr: 1 }} />
                  Menu Management
                </MenuItem>
              )}
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
          {/* Page Header with Dynamic Breadcrumbs */}
          <PageHeader
            title={getCurrentPageTitle()}
            subtitle={getCurrentPageSubtitle()}
            actions={
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton 
                  size="small" 
                  onClick={() => window.location.reload()}
                  title="Refresh page"
                >
                  <Refresh />
                </IconButton>
              </Box>
            }
          />
          
          {/* Dynamic Breadcrumbs */}
          <DynamicBreadcrumbs
            currentRoute={currentRoute}
            onNavigate={handleBreadcrumbNavigate}
            showPermissions={user?.role === 'SuperAdmin'}
            sx={{ mb: 3 }}
          />

          {/* Page Content */}
          {renderPageContent()}
        </Container>
      </Box>

      {/* HR Action Modals */}
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