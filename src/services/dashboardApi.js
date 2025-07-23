// =============================================================================
// SIMPLIFIED DASHBOARD API SERVICE - BETTER ERROR HANDLING
// File: src/services/dashboardApi.js (Replace existing)
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7169/api';

class DashboardApiService {
  constructor() {
    console.log('🔧 Dashboard API initialized with base URL:', API_BASE_URL);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      // Remove authorization for now to test without JWT
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Making request to:', url);
    
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('📥 Response status:', response.status);
      
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
      console.log('✅ Response received:', data);
      
      return data;
      
    } catch (error) {
      console.error('💥 Request failed:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  async getDashboardStats(role) {
    console.log('📊 Fetching dashboard stats for role:', role);
    if (!role) {
      throw new Error('Role is required to fetch dashboard stats');
    }
    return await this.request(`/dashboard/stats/${encodeURIComponent(role)}`);
  }

  async getQuickActions(role) {
    console.log('⚡ Fetching quick actions for role:', role);
    if (!role) {
      throw new Error('Role is required to fetch quick actions');
    }
    return await this.request(`/dashboard/quick-actions/${encodeURIComponent(role)}`);
  }

  async getRecentActivities(userId, role) {
    console.log('🔄 Fetching recent activities for user:', userId, 'role:', role);
    if (!userId || !role) {
      throw new Error('User ID and role are required to fetch recent activities');
    }
    return await this.request(`/dashboard/recent-activities/${userId}?role=${encodeURIComponent(role)}`);
  }

  async getDashboardSummary(userId, role) {
    console.log('📋 Fetching dashboard summary for user:', userId, 'role:', role);
    if (!userId || !role) {
      throw new Error('User ID and role are required to fetch dashboard summary');
    }
    return await this.request(`/dashboard/summary/${userId}?role=${encodeURIComponent(role)}`);
  }

  // Test endpoint
  async testDashboard() {
    console.log('🧪 Testing dashboard controller...');
    return await this.request('/dashboard/test');
  }

  // Test connectivity
  async testConnection() {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch(`${API_BASE_URL}/test/health`);
      console.log('🧪 Health check response:', response.status, response.ok);
      return response.ok;
    } catch (error) {
      console.error('🧪 Health check failed:', error);
      return false;
    }
  }

  refreshToken() {
    // For now, do nothing since we removed auth
    console.log('🔄 Token refresh skipped (auth disabled for testing)');
  }
}

export default new DashboardApiService();