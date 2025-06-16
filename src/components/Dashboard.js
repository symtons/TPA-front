// src/components/Dashboard.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Schedule,
  RequestPage,
  Settings,
  ExitToApp,
  Assignment
} from '@mui/icons-material';
import { ROLES } from '../constants';

const Dashboard = ({ user, onLogout }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const menuItems = getMenuItems(user.role);

  const getStatsForRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { title: 'Total Employees', value: '156', color: 'primary' },
          { title: 'Pending Requests', value: '23', color: 'warning' },
          { title: 'Active Projects', value: '12', color: 'success' },
          { title: 'System Uptime', value: '99.9%', color: 'info' }
        ];
      case ROLES.HR_MANAGER:
        return [
          { title: 'Total Employees', value: '156', color: 'primary' },
          { title: 'Pending Leave', value: '8', color: 'warning' },
          { title: 'New Hires', value: '5', color: 'success' },
          { title: 'Onboarding Tasks', value: '12', color: 'info' }
        ];
      case ROLES.ADMIN_STAFF:
        return [
          { title: 'PTO Balance', value: '15 days', color: 'success' },
          { title: 'Hours This Week', value: '32', color: 'info' },
          { title: 'Pending Tasks', value: '3', color: 'warning' },
          { title: 'Team Members', value: '8', color: 'primary' }
        ];
      case ROLES.FIELD_STAFF:
        return [
          { title: 'Hours Today', value: '6.5', color: 'info' },
          { title: 'Active Tasks', value: '4', color: 'warning' },
          { title: 'Completed Jobs', value: '23', color: 'success' },
          { title: 'Next Shift', value: 'Tomorrow', color: 'primary' }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole(user.role);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" color={stat.color + '.main'}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              {menuItems.find(item => item.tab === selectedTab)?.text || 'Dashboard'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              This section is under development. Content for {user.role} coming soon!
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              TPA
            </Box>
            <Typography variant="h6" noWrap component="div" fontWeight="bold">
              TPA System
            </Typography>
          </Box>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={selectedTab === item.tab}
              onClick={() => setSelectedTab(item.tab)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: 1201, 
            width: `calc(100% - 240px)`, 
            ml: `240px`,
            background: 'linear-gradient(90deg, #1976d2 0%, #ff9800 100%)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }} fontWeight="600">
              TPA Management System - {user.name}
            </Typography>
            
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.name.charAt(0)}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>
                Settings
              </MenuItem>
              <MenuItem onClick={onLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
          {renderTabContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;