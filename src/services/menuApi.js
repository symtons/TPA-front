// =============================================================================
// MENU API SERVICE - CONNECTS TO MENU CONTROLLER
// File: src/services/menuApi.js (NEW FILE)
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7062/api';

class MenuApiService {
  constructor() {
    console.log('🔧 Menu API initialized with base URL:', API_BASE_URL);
  }

  getHeaders() {
    const token = localStorage.getItem('tpa_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Making menu request to:', url);
    
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('📥 Menu response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Menu response received:', data);
      
      return data;
      
    } catch (error) {
      console.error('💥 Menu request failed:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // =============================================================================
  // USER MENU OPERATIONS
  // =============================================================================

  /**
   * Get user's accessible menu items based on their role
   */
  async getUserMenus() {
    try {
      console.log('🔍 Fetching user menus...');
      const response = await this.request('/menu');
      
      if (response.success) {
        console.log('✅ User menus loaded successfully:', response.data);
        return {
          success: true,
          menus: response.data.menus,
          userInfo: {
            role: response.data.userRole,
            userId: response.data.userId,
            email: response.data.userEmail,
            departmentId: response.data.departmentId,
            departmentName: response.data.departmentName
          },
          totalMenus: response.data.totalMenus
        };
      } else {
        throw new Error(response.message || 'Failed to fetch user menus');
      }
    } catch (error) {
      console.error('❌ Error fetching user menus:', error);
      return {
        success: false,
        error: error.message,
        menus: []
      };
    }
  }

  /**
   * Check permissions for a specific menu
   */
  async getMenuPermissions(menuName) {
    try {
      console.log(`🔒 Checking permissions for menu: ${menuName}`);
      const response = await this.request(`/menu/permissions/${encodeURIComponent(menuName)}`);
      
      if (response.success) {
        return {
          success: true,
          permissions: response.data.permissions
        };
      } else {
        throw new Error(response.message || 'Failed to check menu permissions');
      }
    } catch (error) {
      console.error(`❌ Error checking permissions for ${menuName}:`, error);
      return {
        success: false,
        error: error.message,
        permissions: {
          canView: false,
          canEdit: false,
          canDelete: false
        }
      };
    }
  }

  /**
   * Get breadcrumbs for current route
   */
  async getBreadcrumbs(currentRoute) {
    try {
      if (!currentRoute) {
        return { success: true, breadcrumbs: [] };
      }

      console.log(`🍞 Getting breadcrumbs for route: ${currentRoute}`);
      const response = await this.request(`/menu/breadcrumbs?currentRoute=${encodeURIComponent(currentRoute)}`);
      
      if (response.success) {
        return {
          success: true,
          breadcrumbs: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to get breadcrumbs');
      }
    } catch (error) {
      console.error(`❌ Error getting breadcrumbs for ${currentRoute}:`, error);
      return {
        success: false,
        error: error.message,
        breadcrumbs: []
      };
    }
  }

  // =============================================================================
  // ADMIN MENU OPERATIONS (SuperAdmin only)
  // =============================================================================

  /**
   * Get all menu items for management (Admin/SuperAdmin only)
   */
  async getAllMenuItems() {
    try {
      console.log('🔍 Fetching all menu items for admin...');
      const response = await this.request('/menu/all');
      
      if (response.success) {
        return {
          success: true,
          menus: response.data.menus,
          totalMenus: response.data.totalMenus,
          roles: response.data.roles
        };
      } else {
        throw new Error(response.message || 'Failed to fetch all menu items');
      }
    } catch (error) {
      console.error('❌ Error fetching all menu items:', error);
      return {
        success: false,
        error: error.message,
        menus: []
      };
    }
  }

  /**
   * Get role permissions for all menus (SuperAdmin only)
   */
  async getRolePermissions() {
    try {
      console.log('🔍 Fetching role permissions...');
      const response = await this.request('/menu/role-permissions');
      
      if (response.success) {
        return {
          success: true,
          rolePermissions: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to fetch role permissions');
      }
    } catch (error) {
      console.error('❌ Error fetching role permissions:', error);
      return {
        success: false,
        error: error.message,
        rolePermissions: []
      };
    }
  }

  /**
   * Create a new menu item (SuperAdmin only)
   */
  async createMenuItem(menuData) {
    try {
      console.log('➕ Creating new menu item:', menuData);
      const response = await this.request('/menu', {
        method: 'POST',
        body: JSON.stringify(menuData)
      });
      
      if (response.success) {
        console.log('✅ Menu item created successfully:', response.data);
        return {
          success: true,
          menuItem: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to create menu item');
      }
    } catch (error) {
      console.error('❌ Error creating menu item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update an existing menu item (SuperAdmin only)
   */
  async updateMenuItem(menuId, updateData) {
    try {
      console.log(`✏️ Updating menu item ${menuId}:`, updateData);
      const response = await this.request(`/menu/${menuId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (response.success) {
        console.log('✅ Menu item updated successfully:', response.data);
        return {
          success: true,
          menuItem: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to update menu item');
      }
    } catch (error) {
      console.error(`❌ Error updating menu item ${menuId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete a menu item (SuperAdmin only)
   */
  async deleteMenuItem(menuId) {
    try {
      console.log(`🗑️ Deleting menu item ${menuId}`);
      const response = await this.request(`/menu/${menuId}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        console.log('✅ Menu item deleted successfully');
        return {
          success: true,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Failed to delete menu item');
      }
    } catch (error) {
      console.error(`❌ Error deleting menu item ${menuId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get a specific menu item for editing (SuperAdmin only)
   */
  async getMenuItem(menuId) {
    try {
      console.log(`🔍 Fetching menu item ${menuId} for editing`);
      const response = await this.request(`/menu/${menuId}`);
      
      if (response.success) {
        return {
          success: true,
          menuItem: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to fetch menu item');
      }
    } catch (error) {
      console.error(`❌ Error fetching menu item ${menuId}:`, error);
      return {
        success: false,
        error: error.message,
        menuItem: null
      };
    }
  }

  /**
   * Update role permissions for a menu item (SuperAdmin only)
   */
  async updateMenuPermissions(menuId, permissions) {
    try {
      console.log(`🔒 Updating permissions for menu ${menuId}:`, permissions);
      const response = await this.request(`/menu/${menuId}/permissions`, {
        method: 'POST',
        body: JSON.stringify(permissions)
      });
      
      if (response.success) {
        console.log('✅ Menu permissions updated successfully');
        return {
          success: true,
          data: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to update menu permissions');
      }
    } catch (error) {
      console.error(`❌ Error updating permissions for menu ${menuId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Health check for menu API
   */
  async healthCheck() {
    try {
      const response = await this.request('/menu/health');
      return response;
    } catch (error) {
      console.error('❌ Menu API health check failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Debug current user session for menu
   */
  async debugSession() {
    try {
      const response = await this.request('/menu/debug-session');
      return response;
    } catch (error) {
      console.error('❌ Menu debug session failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Transform menu items for UI consumption
   */
  transformMenusForUI(menus) {
    return menus.map(menu => ({
      id: menu.id,
      name: menu.name,
      route: menu.route,
      icon: menu.icon,
      permissions: menu.permissions || {
        canView: true,
        canEdit: false,
        canDelete: false
      },
      children: menu.children ? this.transformMenusForUI(menu.children) : []
    }));
  }

  /**
   * Find menu item by route
   */
  findMenuByRoute(menus, route) {
    for (const menu of menus) {
      if (menu.route === route) {
        return menu;
      }
      if (menu.children && menu.children.length > 0) {
        const found = this.findMenuByRoute(menu.children, route);
        if (found) return found;
      }
    }
    return null;
  }
}

// Export singleton instance
const menuApi = new MenuApiService();
export default menuApi;