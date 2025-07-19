// =============================================================================
// DYNAMIC SIDEBAR COMPONENT - CONNECTS TO MENU API
// File: src/components/layout/DynamicSidebar.js (NEW FILE)
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  People,
  Schedule,
  RequestPage,
  Settings,
  Assignment,
  BarChart,
  Security,
  Business,
  AdminPanelSettings,
  ManageAccounts,
  Notifications
} from '@mui/icons-material';
import TPALogo from '../ui/TPALogo';
import menuApi from '../../services/menuApi';

// Icon mapping for menu items
const iconMap = {
  'Dashboard': DashboardIcon,
  'People': People,
  'Schedule': Schedule,
  'RequestPage': RequestPage,
  'Settings': Settings,
  'Assignment': Assignment,
  'BarChart': BarChart,
  'Security': Security,
  'Business': Business,
  'AdminPanelSettings': AdminPanelSettings,
  'ManageAccounts': ManageAccounts,
  'Notifications': Notifications
};

const DynamicSidebar = ({ 
  selectedRoute, 
  onMenuSelect, 
  user,
  width = 260 
}) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedMenus, setExpandedMenus] = useState(new Set());
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    loadUserMenus();
  }, [user]);

  const loadUserMenus = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Loading dynamic menus for user:', user?.email);
      const response = await menuApi.getUserMenus();
      
      if (response.success) {
        console.log('✅ Dynamic menus loaded:', response.menus);
        setMenus(response.menus || []);
        setUserInfo(response.userInfo);
        
        // Auto-expand parent menus that contain the selected route
        expandParentMenusForRoute(response.menus, selectedRoute);
      } else {
        console.error('❌ Failed to load menus:', response.error);
        setError(response.error || 'Failed to load navigation menus');
      }
    } catch (err) {
      console.error('💥 Error loading dynamic menus:', err);
      setError('Unable to load navigation. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const expandParentMenusForRoute = (menuItems, route) => {
    const newExpanded = new Set(expandedMenus);
    
    const findAndExpandParents = (items, targetRoute, parents = []) => {
      for (const item of items) {
        const currentPath = [...parents, item.id];
        
        if (item.route === targetRoute) {
          // Expand all parent menus
          parents.forEach(parentId => newExpanded.add(parentId));
          return true;
        }
        
        if (item.children && item.children.length > 0) {
          if (findAndExpandParents(item.children, targetRoute, currentPath)) {
            newExpanded.add(item.id);
            return true;
          }
        }
      }
      return false;
    };
    
    findAndExpandParents(menuItems, route);
    setExpandedMenus(newExpanded);
  };

  const handleMenuClick = (menu) => {
    // If menu has children, toggle expansion
    if (menu.children && menu.children.length > 0) {
      const newExpanded = new Set(expandedMenus);
      if (expandedMenus.has(menu.id)) {
        newExpanded.delete(menu.id);
      } else {
        newExpanded.add(menu.id);
      }
      setExpandedMenus(newExpanded);
    } else {
      // Navigate to the route
      if (menu.route && onMenuSelect) {
        onMenuSelect(menu.route, menu);
      }
    }
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || DashboardIcon;
    return <IconComponent />;
  };

  const renderMenuItem = (menu, level = 0) => {
    const isSelected = selectedRoute === menu.route;
    const isExpanded = expandedMenus.has(menu.id);
    const hasChildren = menu.children && menu.children.length > 0;
    const canView = menu.permissions?.canView !== false;

    // Don't render if user can't view this menu
    if (!canView) {
      return null;
    }

    return (
      <React.Fragment key={menu.id}>
        <ListItemButton
          selected={isSelected}
          onClick={() => handleMenuClick(menu)}
          sx={{
            pl: 2 + (level * 2),
            borderRadius: 2,
            mb: 0.5,
            mx: 1,
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #f57c00 90%)',
              },
              '& .MuiListItemIcon-root': {
                color: 'white',
              }
            },
            '&:hover': {
              backgroundColor: level === 0 ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.04)',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {getIcon(menu.icon)}
          </ListItemIcon>
          <ListItemText 
            primary={menu.name}
            primaryTypographyProps={{
              fontWeight: isSelected ? 600 : 400,
              fontSize: level === 0 ? '0.875rem' : '0.8rem'
            }}
          />
          {hasChildren && (
            isExpanded ? <ExpandLess /> : <ExpandMore />
          )}
        </ListItemButton>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menu.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  if (loading) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width,
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
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress size={32} />
        </Box>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width,
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
        
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <ListItemButton
            onClick={loadUserMenus}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.main'
            }}
          >
            <ListItemText primary="Retry" />
          </ListItemButton>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TPALogo size="medium" variant="minimal" />
      </Box>

      {/* User Info */}
      {userInfo && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Logged in as
          </Typography>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            {user?.name || userInfo.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={userInfo.role} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            {userInfo.departmentName && (
              <Chip 
                label={userInfo.departmentName} 
                size="small" 
                color="secondary" 
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {menus.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No menu items available for your role.
            </Typography>
          </Box>
        ) : (
          menus.map(menu => renderMenuItem(menu))
        )}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          TPA HR System v1.0
        </Typography>
        {userInfo && (
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            {menus.length} menu{menus.length !== 1 ? 's' : ''} available
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default DynamicSidebar;