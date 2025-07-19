// =============================================================================
// DYNAMIC BREADCRUMBS COMPONENT - CONNECTS TO MENU API
// File: src/components/layout/DynamicBreadcrumbs.js (NEW FILE)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Breadcrumbs, 
  Link, 
  Typography, 
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  NavigateNext,
  Home,
  Dashboard as DashboardIcon 
} from '@mui/icons-material';
import menuApi from '../../services/menuApi';

const DynamicBreadcrumbs = ({ 
  currentRoute, 
  onNavigate,
  showPermissions = false,
  sx = {} 
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentRoute) {
      loadBreadcrumbs(currentRoute);
    } else {
      setBreadcrumbs([]);
    }
  }, [currentRoute]);

  const loadBreadcrumbs = async (route) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🍞 Loading breadcrumbs for route:', route);
      const response = await menuApi.getBreadcrumbs(route);
      
      if (response.success) {
        console.log('✅ Breadcrumbs loaded:', response.breadcrumbs);
        setBreadcrumbs(response.breadcrumbs || []);
      } else {
        console.error('❌ Failed to load breadcrumbs:', response.error);
        setError(response.error || 'Failed to load breadcrumbs');
        setBreadcrumbs([]);
      }
    } catch (err) {
      console.error('💥 Error loading breadcrumbs:', err);
      setError('Unable to load breadcrumbs');
      setBreadcrumbs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBreadcrumbClick = (breadcrumb) => {
    if (onNavigate && breadcrumb.route) {
      onNavigate(breadcrumb.route);
    }
  };

  const renderBreadcrumbContent = (breadcrumb, isLast) => {
    const content = (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {breadcrumb.icon && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {breadcrumb.icon === 'Dashboard' ? (
              <DashboardIcon sx={{ fontSize: '1rem' }} />
            ) : breadcrumb.icon === 'Home' ? (
              <Home sx={{ fontSize: '1rem' }} />
            ) : null}
          </Box>
        )}
        <Typography 
          variant="body2" 
          component="span"
          sx={{ 
            fontWeight: isLast ? 600 : 400,
            color: isLast ? 'text.primary' : 'inherit'
          }}
        >
          {breadcrumb.name}
        </Typography>
      </Box>
    );

    if (isLast) {
      return (
        <Typography 
          color="text.primary" 
          variant="body2" 
          component="span"
          sx={{ fontWeight: 600 }}
        >
          {content}
        </Typography>
      );
    }

    return (
      <Link
        component="button"
        variant="body2"
        color="inherit"
        onClick={() => handleBreadcrumbClick(breadcrumb)}
        sx={{ 
          cursor: breadcrumb.route ? 'pointer' : 'default',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: breadcrumb.route ? 'underline' : 'none'
          },
          border: 'none',
          background: 'none',
          padding: 0,
          font: 'inherit'
        }}
      >
        {content}
      </Link>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Loading navigation...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ ...sx }}>
        <Chip 
          label={`Navigation error: ${error}`} 
          size="small" 
          color="error" 
          variant="outlined" 
        />
      </Box>
    );
  }

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Box sx={{ ...sx }}>
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />}
        maxItems={6}
        itemsAfterCollapse={2}
        itemsBeforeCollapse={2}
        sx={{ mb: 1 }}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <Box key={breadcrumb.id || index}>
              {renderBreadcrumbContent(breadcrumb, isLast)}
            </Box>
          );
        })}
      </Breadcrumbs>
      
      {showPermissions && breadcrumbs.length > 0 && (
        <PermissionChips currentRoute={currentRoute} />
      )}
    </Box>
  );
};

// Optional component to show current menu permissions
const PermissionChips = ({ currentRoute }) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRoute) {
      loadPermissions(currentRoute);
    }
  }, [currentRoute]);

  const loadPermissions = async (route) => {
    try {
      setLoading(true);
      
      // Extract menu name from route (simple approach)
      const menuName = route.split('/').pop() || route;
      const response = await menuApi.getMenuPermissions(menuName);
      
      if (response.success) {
        setPermissions(response.permissions);
      }
    } catch (err) {
      console.error('Error loading permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !permissions) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
      {permissions.canView && (
        <Chip label="View" size="small" color="success" variant="outlined" />
      )}
      {permissions.canEdit && (
        <Chip label="Edit" size="small" color="warning" variant="outlined" />
      )}
      {permissions.canDelete && (
        <Chip label="Delete" size="small" color="error" variant="outlined" />
      )}
    </Box>
  );
};

export default DynamicBreadcrumbs;