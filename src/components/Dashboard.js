// src/components/Dashboard.js
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
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import RecentActivities from './dashboard/RecentActivities';
import CustomCard from './ui/CustomCard';
import SessionTimeoutModal from './ui/SessionTimeoutModal';
import useSessionTimeout from '../hooks/useSessionTimeout';

const Dashboard = ({ user, onLogout }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  // Session timeout management
  const {
    showModal,
    timeLeft,
    handleContinue,
    handleLogoutNow
  } = useSessionTimeout(onLogout, true);

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
          { text: 'Leave Management', icon: <RequestPage />, tab: 3 },
          { text: 'Onboarding', icon: <Assignment />, tab: 4 }
        ];
      case ROLES.ADMIN_STAFF:
        return [
          ...baseItems,
          { text: 'Time & Attendance', icon: <Schedule />, tab: 2 },
          { text: 'Leave Management', icon: <RequestPage />, tab: 3 },
          { text: 'My Profile', icon: <Settings />, tab: 5 }
        ];
      case ROLES.FIELD_STAFF:
        return [
          ...baseItems,
          { text: 'Time & Attendance', icon: <Schedule />, tab: 2 },
          { text: 'My Tasks', icon: <Assignment />, tab: 4 }
        ];
      default:
        return baseItems;
    }
  };

  const handleQuickAction = (action) => {
    console.log('Quick action clicked:', action);
    switch (action) {
      case 'employees':
        setSelectedTab(1);
        break;
      case 'schedule':
      case 'time-tracking':
        setSelectedTab(2);
        break;
      case 'leave-requests':
      case 'request-leave':
        setSelectedTab(3);
        break;
      case 'onboarding':
      case 'tasks':
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
            
            <DashboardStats user={user} />
            
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
              <Box sx={{ flex: '2' }}>
                <CustomCard title="Quick Actions" sx={{ height: 'fit-content' }}>
                  <QuickActions user={user} onActionClick={handleQuickAction} />
                </CustomCard>
              </Box>
              
              <Box sx={{ flex: '1' }}>
                <CustomCard 
                  title="Recent Activities"
                  sx={{ height: 'fit-content' }}
                  headerActions={
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ cursor: 'pointer' }}
                    >
                      View All
                    </Typography>
                  }
                >
                  <RecentActivities user={user} />
                </CustomCard>
              </Box>
            </Box>
          </>
        );
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
      {/* Session Timeout Modal */}
      <SessionTimeoutModal
        open={showModal}
        timeLeft={timeLeft}
        onContinue={handleContinue}
        onLogout={handleLogoutNow}
      />

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

        <Container maxWidth="xl" sx={{ mt: 10, mb: 4, px: 3 }}>
          {renderTabContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;