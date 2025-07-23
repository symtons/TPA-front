// src/services/onboardingService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7169/api';

class OnboardingService {
  constructor() {
    this.token = localStorage.getItem('tpa_token');
    console.log('🚀 Onboarding Service initialized');
  }

  getHeaders() {
    this.token = localStorage.getItem('tpa_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Onboarding API request to:', url);
    
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('🔒 Authentication failed - redirecting to login');
          // Handle authentication failure
          throw new Error('Authentication failed. Please log in again.');
        }
        
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
      console.log('✅ Onboarding response received:', data);
      return data;
      
    } catch (error) {
      console.error('💥 Onboarding request failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // Onboarding Tasks API
  async getTasks(employeeId = null, status = null) {
    console.log('📋 Fetching onboarding tasks for employee:', employeeId);
    let endpoint = '/onboarding/tasks';
    const params = new URLSearchParams();
    
    if (employeeId) params.append('employeeId', employeeId);
    if (status) params.append('status', status);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return await this.request(endpoint);
  }

  async getTaskById(taskId) {
    console.log('📋 Fetching task by ID:', taskId);
    return await this.request(`/onboarding/tasks/${taskId}`);
  }

  async createTask(taskData) {
    console.log('✨ Creating new onboarding task:', taskData);
    return await this.request('/onboarding/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(taskId, updates) {
    console.log('📝 Updating task:', taskId, updates);
    return await this.request(`/onboarding/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteTask(taskId) {
    console.log('🗑️  Deleting task:', taskId);
    return await this.request(`/onboarding/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  async completeTask(taskId, completionData = {}) {
    console.log('✅ Marking task as complete:', taskId);
    return await this.request(`/onboarding/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData)
    });
  }

  // Employee Onboarding API
  async getEmployeeOnboarding(employeeId) {
    console.log('👤 Fetching employee onboarding data:', employeeId);
    return await this.request(`/onboarding/employees/${employeeId}`);
  }

  async getMyOnboarding() {
    console.log('👤 Fetching current user onboarding data');
    return await this.request('/onboarding/my-tasks');
  }

  async getOnboardingOverview(role = null) {
    console.log('📊 Fetching onboarding overview for role:', role);
    let endpoint = '/onboarding/overview';
    if (role) {
      endpoint += `?role=${encodeURIComponent(role)}`;
    }
    return await this.request(endpoint);
  }

  // Onboarding Templates API
  async getTemplates() {
    console.log('📝 Fetching onboarding templates');
    return await this.request('/onboarding/templates');
  }

  async createTemplate(templateData) {
    console.log('✨ Creating onboarding template:', templateData);
    return await this.request('/onboarding/templates', {
      method: 'POST',
      body: JSON.stringify(templateData)
    });
  }

  async applyTemplate(templateId, employeeId) {
    console.log('🎯 Applying template to employee:', templateId, employeeId);
    return await this.request(`/onboarding/templates/${templateId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ employeeId })
    });
  }

  // File Upload API
  async uploadDocument(taskId, file, documentType) {
    console.log('📎 Uploading document for task:', taskId, documentType);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('taskId', taskId);

    return await this.request('/onboarding/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
        // Don't set Content-Type for FormData - let browser set it with boundary
      }
    });
  }

  async getDocuments(taskId) {
    console.log('📎 Fetching documents for task:', taskId);
    return await this.request(`/onboarding/tasks/${taskId}/documents`);
  }

  async downloadDocument(documentId) {
    console.log('📥 Downloading document:', documentId);
    const response = await fetch(`${API_BASE_URL}/onboarding/documents/${documentId}/download`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to download document');
    }
    
    return response.blob();
  }

  // Statistics and Reports API
  async getOnboardingStats(startDate = null, endDate = null) {
    console.log('📊 Fetching onboarding statistics');
    let endpoint = '/onboarding/stats';
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return await this.request(endpoint);
  }

  async getCompletionReport(departmentId = null) {
    console.log('📈 Fetching completion report for department:', departmentId);
    let endpoint = '/onboarding/reports/completion';
    if (departmentId) {
      endpoint += `?departmentId=${departmentId}`;
    }
    return await this.request(endpoint);
  }

  async getRecentActivity(limit = 10) {
    console.log('🔄 Fetching recent onboarding activity');
    return await this.request(`/onboarding/activity?limit=${limit}`);
  }

  // Notification API
  async sendReminder(taskId, message = null) {
    console.log('📧 Sending task reminder:', taskId);
    return await this.request(`/onboarding/tasks/${taskId}/remind`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async notifyManager(employeeId, message) {
    console.log('📧 Notifying manager about employee:', employeeId);
    return await this.request('/onboarding/notify-manager', {
      method: 'POST',
      body: JSON.stringify({ employeeId, message })
    });
  }

  // Bulk Operations API
  async bulkUpdateTasks(taskIds, updates) {
    console.log('🔄 Bulk updating tasks:', taskIds.length, 'tasks');
    return await this.request('/onboarding/tasks/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ taskIds, updates })
    });
  }

  async bulkAssignTasks(employeeIds, taskData) {
    console.log('👥 Bulk assigning tasks to employees:', employeeIds.length, 'employees');
    return await this.request('/onboarding/tasks/bulk-assign', {
      method: 'POST',
      body: JSON.stringify({ employeeIds, taskData })
    });
  }

  // Search and Filter API
  async searchTasks(searchTerm, filters = {}) {
    console.log('🔍 Searching tasks:', searchTerm, filters);
    const params = new URLSearchParams();
    params.append('search', searchTerm);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return await this.request(`/onboarding/tasks/search?${params.toString()}`);
  }

  async getFilterOptions() {
    console.log('🏷️  Fetching filter options');
    return await this.request('/onboarding/filters');
  }

  // Checklist Management API
  async getChecklists() {
    console.log('📋 Fetching onboarding checklists');
    return await this.request('/onboarding/checklists');
  }

  async createChecklist(checklistData) {
    console.log('✨ Creating onboarding checklist:', checklistData);
    return await this.request('/onboarding/checklists', {
      method: 'POST',
      body: JSON.stringify(checklistData)
    });
  }

  async assignChecklist(checklistId, employeeId) {
    console.log('🎯 Assigning checklist to employee:', checklistId, employeeId);
    return await this.request(`/onboarding/checklists/${checklistId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ employeeId })
    });
  }

  // Utility Methods
  refreshToken() {
    this.token = localStorage.getItem('tpa_token');
    console.log('🔄 Onboarding service token refreshed');
  }

  async testConnection() {
    try {
      console.log('🧪 Testing onboarding API connection...');
      const response = await this.request('/onboarding/health');
      return response.success || true;
    } catch (error) {
      console.error('🧪 Onboarding API connection test failed:', error);
      return false;
    }
  }
}

export default new OnboardingService();