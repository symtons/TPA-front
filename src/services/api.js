// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7069/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.sessionToken = localStorage.getItem('sessionToken');
  }

  // Configure request headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.sessionToken) {
      headers['X-Session-Token'] = this.sessionToken;
    }

    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle session expiry
      if (response.status === 401) {
        this.clearAuthData();
        window.location.href = '/login';
        throw new Error('Session expired');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });

    if (response.success) {
      this.token = response.data.token;
      this.sessionToken = response.data.sessionToken;
      
      localStorage.setItem('authToken', this.token);
      localStorage.setItem('sessionToken', this.sessionToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async refreshSession() {
    try {
      const response = await this.request('/auth/refresh-session', { method: 'POST' });
      if (response.success) {
        this.sessionToken = response.data.sessionToken;
        localStorage.setItem('sessionToken', this.sessionToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  }

  clearAuthData() {
    this.token = null;
    this.sessionToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
  }

  // User methods
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Dashboard methods (using test endpoints for now)
  async getDashboardStats(role) {
    return this.request('/test/dashboard-stats');
  }

  // Health check
  async healthCheck() {
    return this.request('/test/health', { includeAuth: false });
  }
}

export default new ApiService();