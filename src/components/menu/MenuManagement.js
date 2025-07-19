// =============================================================================
// MENU MANAGEMENT COMPONENT - ADMIN INTERFACE FOR MENU CRUD
// File: src/components/menu/MenuManagement.js (NEW FILE - CLEAN VERSION)
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  Refresh,
  Save,
  Cancel
} from '@mui/icons-material';
import menuApi from '../../services/menuApi';

const MenuManagement = ({ user }) => {
  // State management
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [rolePermissions, setRolePermissions] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    icon: '',
    parentId: null,
    sortOrder: 0,
    requiredPermission: '',
    rolePermissions: []
  });

  const availableIcons = [
    'Dashboard', 'People', 'Schedule', 'RequestPage', 'Settings', 
    'Assignment', 'BarChart', 'Security', 'Business', 
    'AdminPanelSettings', 'ManageAccounts', 'Notifications'
  ];

  const availableRoles = [
    'SuperAdmin', 'Admin', 'HRAdmin', 'ProgramDirector', 
    'ProgramCoordinator', 'Employee'
  ];

  // Load data on component mount
  useEffect(() => {
    loadMenus();
    loadRolePermissions();
  }, []);

  // API Functions
  const loadMenus = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await menuApi.getAllMenuItems();
      
      if (response.success) {
        setMenus(response.menus || []);
      } else {
        setError(response.error || 'Failed to load menu items');
      }
    } catch (err) {
      console.error('Error loading menus:', err);
      setError('Unable to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const loadRolePermissions = async () => {
    try {
      const response = await menuApi.getRolePermissions();
      if (response.success) {
        setRolePermissions(response.rolePermissions || []);
      }
    } catch (err) {
      console.error('Error loading role permissions:', err);
    }
  };

  // Dialog handlers
  const handleCreateMenu = () => {
    setEditingMenu(null);
    setFormData({
      name: '',
      route: '',
      icon: '',
      parentId: null,
      sortOrder: 0,
      requiredPermission: '',
      rolePermissions: availableRoles.map(role => ({
        role,
        canView: false,
        canEdit: false,
        canDelete: false
      }))
    });
    setOpenDialog(true);
  };

  const handleEditMenu = async (menu) => {
    try {
      setDialogLoading(true);
      const response = await menuApi.getMenuItem(menu.id);
      
      if (response.success) {
        const menuData = response.menuItem;
        setEditingMenu(menuData);
        setFormData({
          name: menuData.name,
          route: menuData.route,
          icon: menuData.icon || '',
          parentId: menuData.parentId,
          sortOrder: menuData.sortOrder,
          requiredPermission: menuData.requiredPermission || '',
          rolePermissions: availableRoles.map(role => {
            const existing = menuData.rolePermissions?.find(rp => rp.role === role);
            return {
              role,
              canView: existing?.canView || false,
              canEdit: existing?.canEdit || false,
              canDelete: existing?.canDelete || false
            };
          })
        });
        setOpenDialog(true);
      } else {
        setError(response.error || 'Failed to load menu item');
      }
    } catch (err) {
      setError('Error loading menu item for editing');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteMenu = async (menu) => {
    if (!window.confirm(`Are you sure you want to delete "${menu.name}"?`)) {
      return;
    }

    try {
      const response = await menuApi.deleteMenuItem(menu.id);
      
      if (response.success) {
        await loadMenus();
      } else {
        setError(response.error || 'Failed to delete menu item');
      }
    } catch (err) {
      setError('Error deleting menu item');
    }
  };

  const handleSaveMenu = async () => {
    try {
      setDialogLoading(true);
      
      const menuData = {
        name: formData.name,
        route: formData.route,
        icon: formData.icon || null,
        parentId: formData.parentId || null,
        sortOrder: formData.sortOrder,
        requiredPermission: formData.requiredPermission || null,
        rolePermissions: formData.rolePermissions.filter(rp => 
          rp.canView || rp.canEdit || rp.canDelete
        )
      };

      let response;
      if (editingMenu) {
        response = await menuApi.updateMenuItem(editingMenu.id, menuData);
      } else {
        response = await menuApi.createMenuItem(menuData);
      }

      if (response.success) {
        setOpenDialog(false);
        await loadMenus();
      } else {
        setError(response.error || 'Failed to save menu item');
      }
    } catch (err) {
      setError('Error saving menu item');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleRolePermissionChange = (roleIndex, permission, value) => {
    const newRolePermissions = [...formData.rolePermissions];
    newRolePermissions[roleIndex][permission] = value;
    setFormData({ ...formData, rolePermissions: newRolePermissions });
  };

  // Utility functions
  const getParentMenuOptions = () => {
    const options = [{ id: null, name: 'No Parent (Root Level)' }];
    
    const addMenuOptions = (menuList, level = 0) => {
      menuList.forEach(menu => {
        if (!editingMenu || menu.id !== editingMenu.id) {
          options.push({
            id: menu.id,
            name: '  '.repeat(level) + menu.name
          });
          if (menu.children) {
            addMenuOptions(menu.children, level + 1);
          }
        }
      });
    };
    
    addMenuOptions(menus);
    return options;
  };

  // Render functions
  const renderMenuRow = (menu, level = 0) => {
    return (
      <React.Fragment key={menu.id}>
        <TableRow>
          <TableCell sx={{ pl: 2 + level * 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontWeight={level === 0 ? 600 : 400}>
                {menu.name}
              </Typography>
              {!menu.isActive && (
                <Chip label="Inactive" size="small" color="error" variant="outlined" />
              )}
            </Box>
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {menu.route}
            </Typography>
          </TableCell>
          <TableCell>
            {menu.icon && (
              <Chip label={menu.icon} size="small" variant="outlined" />
            )}
          </TableCell>
          <TableCell>
            <Typography variant="body2">
              {menu.sortOrder}
            </Typography>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {menu.rolePermissions?.map(rp => (
                <Chip 
                  key={rp.role} 
                  label={rp.role} 
                  size="small" 
                  color={rp.canView ? 'primary' : 'default'}
                  variant={rp.canEdit || rp.canDelete ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={() => handleEditMenu(menu)}
                disabled={dialogLoading}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                color="error"
                onClick={() => handleDeleteMenu(menu)}
                disabled={menu.children?.length > 0}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
        {menu.children?.map(child => renderMenuRow(child, level + 1))}
      </React.Fragment>
    );
  };

  // Security check
  if (user?.role !== 'SuperAdmin') {
    return (
      <Alert severity="error">
        Access denied. Only SuperAdmin can manage menus.
      </Alert>
    );
  }

  // Main render
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Menu Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadMenus}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateMenu}
          >
            Add Menu
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Menu Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Menu Name</strong></TableCell>
                    <TableCell><strong>Route</strong></TableCell>
                    <TableCell><strong>Icon</strong></TableCell>
                    <TableCell><strong>Sort Order</strong></TableCell>
                    <TableCell><strong>Role Access</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          No menu items found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    menus.map(menu => renderMenuRow(menu))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Overview */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Role Permissions Overview
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>View Role-based Menu Access</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {rolePermissions.map(roleData => (
                  <Grid item xs={12} md={6} key={roleData.role}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {roleData.role}
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                      {roleData.permissions.map(perm => (
                        <Box 
                          key={perm.menuId} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            py: 0.5 
                          }}
                        >
                          <Typography variant="body2">
                            {perm.menuName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {perm.canView && <Chip label="V" size="small" color="success" />}
                            {perm.canEdit && <Chip label="E" size="small" color="warning" />}
                            {perm.canDelete && <Chip label="D" size="small" color="error" />}
                          </Box>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Add/Edit Menu Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingMenu ? 'Edit Menu Item' : 'Create New Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Basic Information */}
            <Typography variant="h6" color="primary">
              Basic Information
            </Typography>
            
            <TextField
              label="Menu Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            
            <TextField
              label="Route"
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              required
              fullWidth
              helperText="e.g., /dashboard, /employees"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Icon</InputLabel>
                <Select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  label="Icon"
                >
                  <MenuItem value="">
                    <em>No Icon</em>
                  </MenuItem>
                  {availableIcons.map(icon => (
                    <MenuItem key={icon} value={icon}>
                      {icon}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                sx={{ width: 150 }}
              />
            </Box>
            
            <FormControl>
              <InputLabel>Parent Menu</InputLabel>
              <Select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                label="Parent Menu"
              >
                {getParentMenuOptions().map(option => (
                  <MenuItem key={option.id || 'root'} value={option.id || ''}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Required Permission"
              value={formData.requiredPermission}
              onChange={(e) => setFormData({ ...formData, requiredPermission: e.target.value })}
              fullWidth
              helperText="Optional: Specific permission required to access this menu"
            />

            {/* Role Permissions */}
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              Role Permissions
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
              <Grid container spacing={2}>
                {formData.rolePermissions.map((rolePermission, index) => (
                  <Grid item xs={12} sm={6} md={4} key={rolePermission.role}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {rolePermission.role}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rolePermission.canView}
                              onChange={(e) => handleRolePermissionChange(index, 'canView', e.target.checked)}
                              size="small"
                            />
                          }
                          label="Can View"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rolePermission.canEdit}
                              onChange={(e) => handleRolePermissionChange(index, 'canEdit', e.target.checked)}
                              size="small"
                            />
                          }
                          label="Can Edit"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rolePermission.canDelete}
                              onChange={(e) => handleRolePermissionChange(index, 'canDelete', e.target.checked)}
                              size="small"
                            />
                          }
                          label="Can Delete"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            startIcon={<Cancel />}
            disabled={dialogLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMenu}
            variant="contained"
            startIcon={<Save />}
            disabled={dialogLoading || !formData.name || !formData.route}
          >
            {dialogLoading ? <CircularProgress size={20} /> : (editingMenu ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManagement;