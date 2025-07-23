// src/services/employeeService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7169/api';

class EmployeeService {
  constructor() {
    this.token = localStorage.getItem('tpa_token');
    console.log('👥 Employee Service initialized');
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
    console.log('🌐 Employee API request to:', url);
    
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
      console.log('✅ Employee response received:', data);
      return data;
      
    } catch (error) {
      console.error('💥 Employee request failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // Employee CRUD Operations
  async getAllEmployees(filters = {}) {
    console.log('👥 Fetching all employees with filters:', filters);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const endpoint = params.toString() ? `/employees?${params}` : '/employees';
    return await this.request(endpoint);
  }

  async getEmployeeById(employeeId) {
    console.log('🔍 Fetching employee by ID:', employeeId);
    return await this.request(`/employees/${employeeId}`);
  }

  async createEmployee(employeeData) {
    console.log('✨ Creating new employee:', employeeData);
    return await this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });
  }

  async updateEmployee(employeeId, updates) {
    console.log('📝 Updating employee:', employeeId, updates);
    return await this.request(`/employees/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteEmployee(employeeId) {
    console.log('🗑️  Deleting employee:', employeeId);
    return await this.request(`/employees/${employeeId}`, {
      method: 'DELETE'
    });
  }

  async deactivateEmployee(employeeId, reason = '') {
    console.log('🚫 Deactivating employee:', employeeId);
    return await this.request(`/employees/${employeeId}/deactivate`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async reactivateEmployee(employeeId) {
    console.log('✅ Reactivating employee:', employeeId);
    return await this.request(`/employees/${employeeId}/reactivate`, {
      method: 'POST'
    });
  }

  // Employee Search and Filtering
  async searchEmployees(searchTerm, filters = {}) {
    console.log('🔍 Searching employees:', searchTerm, filters);
    const params = new URLSearchParams({ search: searchTerm });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return await this.request(`/employees/search?${params}`);
  }

  async getEmployeesByDepartment(departmentId) {
    console.log('🏢 Fetching employees by department:', departmentId);
    return await this.request(`/employees/department/${departmentId}`);
  }

  async getEmployeesByManager(managerId) {
    console.log('👤 Fetching employees by manager:', managerId);
    return await this.request(`/employees/manager/${managerId}`);
  }

  async getEmployeesByStatus(status) {
    console.log('📊 Fetching employees by status:', status);
    return await this.request(`/employees/status/${status}`);
  }

  // Employee Profile and Details
  async getEmployeeProfile(employeeId) {
    console.log('📋 Fetching employee profile:', employeeId);
    return await this.request(`/employees/${employeeId}/profile`);
  }

  async updateEmployeeProfile(employeeId, profileData) {
    console.log('📝 Updating employee profile:', employeeId);
    return await this.request(`/employees/${employeeId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async uploadEmployeePhoto(employeeId, file) {
    console.log('📸 Uploading employee photo:', employeeId);
    const formData = new FormData();
    formData.append('photo', file);

    return await this.request(`/employees/${employeeId}/photo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
        // Don't set Content-Type for FormData - let browser set it with boundary
      }
    });
  }

  async getEmployeeDocuments(employeeId) {
    console.log('📄 Fetching employee documents:', employeeId);
    return await this.request(`/employees/${employeeId}/documents`);
  }

  async uploadEmployeeDocument(employeeId, file, documentType) {
    console.log('📎 Uploading employee document:', employeeId, documentType);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    return await this.request(`/employees/${employeeId}/documents`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  // Department Management
  async getDepartments() {
    console.log('🏢 Fetching departments');
    return await this.request('/departments');
  }

  async createDepartment(departmentData) {
    console.log('✨ Creating department:', departmentData);
    return await this.request('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
  }

  async updateDepartment(departmentId, updates) {
    console.log('📝 Updating department:', departmentId);
    return await this.request(`/departments/${departmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteDepartment(departmentId) {
    console.log('🗑️  Deleting department:', departmentId);
    return await this.request(`/departments/${departmentId}`, {
      method: 'DELETE'
    });
  }

  // Employee Analytics and Reports
  async getEmployeeAnalytics(filters = {}) {
    console.log('📊 Fetching employee analytics with filters:', filters);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const endpoint = params.toString() ? `/employees/analytics?${params}` : '/employees/analytics';
    return await this.request(endpoint);
  }

  async getDepartmentAnalytics(departmentId, timeframe = '12months') {
    console.log('📈 Fetching department analytics:', departmentId, timeframe);
    return await this.request(`/employees/analytics/department/${departmentId}?timeframe=${timeframe}`);
  }

  async getTurnoverReport(startDate, endDate) {
    console.log('📉 Fetching turnover report');
    const params = new URLSearchParams({ startDate, endDate });
    return await this.request(`/employees/reports/turnover?${params}`);
  }

  async getHeadcountReport(groupBy = 'department') {
    console.log('👥 Fetching headcount report');
    return await this.request(`/employees/reports/headcount?groupBy=${groupBy}`);
  }

  async getDiversityReport() {
    console.log('🌈 Fetching diversity report');
    return await this.request('/employees/reports/diversity');
  }

  // Performance Management
  async getEmployeePerformance(employeeId) {
    console.log('⭐ Fetching employee performance:', employeeId);
    return await this.request(`/employees/${employeeId}/performance`);
  }

  async updatePerformanceRating(employeeId, rating, reviewData) {
    console.log('📊 Updating performance rating:', employeeId, rating);
    return await this.request(`/employees/${employeeId}/performance`, {
      method: 'POST',
      body: JSON.stringify({ rating, ...reviewData })
    });
  }

  async getPerformanceReviews(employeeId, year = null) {
    console.log('📋 Fetching performance reviews:', employeeId, year);
    const endpoint = year 
      ? `/employees/${employeeId}/reviews?year=${year}`
      : `/employees/${employeeId}/reviews`;
    return await this.request(endpoint);
  }

  async createPerformanceReview(employeeId, reviewData) {
    console.log('✨ Creating performance review:', employeeId);
    return await this.request(`/employees/${employeeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // Employee Skills and Training
  async getEmployeeSkills(employeeId) {
    console.log('🎯 Fetching employee skills:', employeeId);
    return await this.request(`/employees/${employeeId}/skills`);
  }

  async updateEmployeeSkills(employeeId, skills) {
    console.log('📚 Updating employee skills:', employeeId);
    return await this.request(`/employees/${employeeId}/skills`, {
      method: 'PUT',
      body: JSON.stringify({ skills })
    });
  }

  async getTrainingHistory(employeeId) {
    console.log('🎓 Fetching training history:', employeeId);
    return await this.request(`/employees/${employeeId}/training`);
  }

  async enrollInTraining(employeeId, trainingId) {
    console.log('📖 Enrolling employee in training:', employeeId, trainingId);
    return await this.request(`/employees/${employeeId}/training`, {
      method: 'POST',
      body: JSON.stringify({ trainingId })
    });
  }

  // Organization Structure
  async getOrganizationChart() {
    console.log('🏗️  Fetching organization chart');
    return await this.request('/employees/organization-chart');
  }

  async updateReportingStructure(employeeId, managerId) {
    console.log('🔄 Updating reporting structure:', employeeId, managerId);
    return await this.request(`/employees/${employeeId}/manager`, {
      method: 'PUT',
      body: JSON.stringify({ managerId })
    });
  }

  async getDirectReports(managerId) {
    console.log('👨‍💼 Fetching direct reports:', managerId);
    return await this.request(`/employees/${managerId}/direct-reports`);
  }

  // Emergency Contacts
  async getEmergencyContacts(employeeId) {
    console.log('🚨 Fetching emergency contacts:', employeeId);
    return await this.request(`/employees/${employeeId}/emergency-contacts`);
  }

  async updateEmergencyContacts(employeeId, contacts) {
    console.log('📞 Updating emergency contacts:', employeeId);
    return await this.request(`/employees/${employeeId}/emergency-contacts`, {
      method: 'PUT',
      body: JSON.stringify({ contacts })
    });
  }

  // Bulk Operations
  async bulkUpdateEmployees(employeeIds, updates) {
    console.log('🔄 Bulk updating employees:', employeeIds.length, 'employees');
    return await this.request('/employees/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ employeeIds, updates })
    });
  }

  async bulkImportEmployees(file) {
    console.log('📤 Bulk importing employees');
    const formData = new FormData();
    formData.append('file', file);

    return await this.request('/employees/import', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  async exportEmployees(filters = {}, format = 'xlsx') {
    console.log('📥 Exporting employees in format:', format);
    const params = new URLSearchParams({ format });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await fetch(`${API_BASE_URL}/employees/export?${params}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to export employees');
    }
    
    return response.blob();
  }

  // Employee Status Tracking
  async getEmployeeTimeline(employeeId) {
    console.log('📅 Fetching employee timeline:', employeeId);
    return await this.request(`/employees/${employeeId}/timeline`);
  }

  async addEmployeeEvent(employeeId, eventData) {
    console.log('📝 Adding employee event:', employeeId, eventData);
    return await this.request(`/employees/${employeeId}/events`, {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  async getEmployeeEvents(employeeId, eventType = null) {
    console.log('📋 Fetching employee events:', employeeId, eventType);
    const endpoint = eventType 
      ? `/employees/${employeeId}/events?type=${eventType}`
      : `/employees/${employeeId}/events`;
    return await this.request(endpoint);
  }

  // Employee Compensation
  async getEmployeeCompensation(employeeId) {
    console.log('💰 Fetching employee compensation:', employeeId);
    return await this.request(`/employees/${employeeId}/compensation`);
  }

  async updateEmployeeCompensation(employeeId, compensationData) {
    console.log('💵 Updating employee compensation:', employeeId);
    return await this.request(`/employees/${employeeId}/compensation`, {
      method: 'PUT',
      body: JSON.stringify(compensationData)
    });
  }

  async getCompensationHistory(employeeId) {
    console.log('📊 Fetching compensation history:', employeeId);
    return await this.request(`/employees/${employeeId}/compensation/history`);
  }

  // Employee Benefits
  async getEmployeeBenefits(employeeId) {
    console.log('🏥 Fetching employee benefits:', employeeId);
    return await this.request(`/employees/${employeeId}/benefits`);
  }

  async updateEmployeeBenefits(employeeId, benefitsData) {
    console.log('📋 Updating employee benefits:', employeeId);
    return await this.request(`/employees/${employeeId}/benefits`, {
      method: 'PUT',
      body: JSON.stringify(benefitsData)
    });
  }

  async getBenefitsEligibility(employeeId) {
    console.log('✅ Checking benefits eligibility:', employeeId);
    return await this.request(`/employees/${employeeId}/benefits/eligibility`);
  }

  // Employee Onboarding Integration
  async getEmployeeOnboardingStatus(employeeId) {
    console.log('🚀 Fetching onboarding status:', employeeId);
    return await this.request(`/employees/${employeeId}/onboarding`);
  }

  async updateOnboardingStatus(employeeId, status, notes = '') {
    console.log('📝 Updating onboarding status:', employeeId, status);
    return await this.request(`/employees/${employeeId}/onboarding`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }

  // Employee Leave Integration
  async getEmployeeLeaveBalance(employeeId) {
    console.log('🏖️  Fetching leave balance:', employeeId);
    return await this.request(`/employees/${employeeId}/leave/balance`);
  }

  async getEmployeeLeaveHistory(employeeId, year = null) {
    console.log('📅 Fetching leave history:', employeeId, year);
    const endpoint = year 
      ? `/employees/${employeeId}/leave/history?year=${year}`
      : `/employees/${employeeId}/leave/history`;
    return await this.request(endpoint);
  }

  // Employee Directory Utilities
  async getEmployeeHierarchy(employeeId) {
    console.log('🏗️  Fetching employee hierarchy:', employeeId);
    return await this.request(`/employees/${employeeId}/hierarchy`);
  }

  async getEmployeePeers(employeeId) {
    console.log('👥 Fetching employee peers:', employeeId);
    return await this.request(`/employees/${employeeId}/peers`);
  }

  async getEmployeeContacts(employeeId) {
    console.log('📞 Fetching employee contacts:', employeeId);
    return await this.request(`/employees/${employeeId}/contacts`);
  }

  // Employee Notifications
  async sendEmployeeNotification(employeeId, notificationData) {
    console.log('📧 Sending employee notification:', employeeId);
    return await this.request(`/employees/${employeeId}/notify`, {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  async getEmployeeNotifications(employeeId, limit = 10) {
    console.log('🔔 Fetching employee notifications:', employeeId);
    return await this.request(`/employees/${employeeId}/notifications?limit=${limit}`);
  }

  // Quick Actions
  async promoteEmployee(employeeId, newPosition, newSalary, effectiveDate) {
    console.log('🎉 Promoting employee:', employeeId);
    return await this.request(`/employees/${employeeId}/promote`, {
      method: 'POST',
      body: JSON.stringify({ newPosition, newSalary, effectiveDate })
    });
  }

  async transferEmployee(employeeId, newDepartment, newManager, effectiveDate) {
    console.log('🔄 Transferring employee:', employeeId);
    return await this.request(`/employees/${employeeId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ newDepartment, newManager, effectiveDate })
    });
  }

  async terminateEmployee(employeeId, terminationData) {
    console.log('❌ Terminating employee:', employeeId);
    return await this.request(`/employees/${employeeId}/terminate`, {
      method: 'POST',
      body: JSON.stringify(terminationData)
    });
  }

  // Data Validation
  async validateEmployeeNumber(employeeNumber, excludeId = null) {
    console.log('🔍 Validating employee number:', employeeNumber);
    const params = new URLSearchParams({ employeeNumber });
    if (excludeId) params.append('excludeId', excludeId);
    
    return await this.request(`/employees/validate/employee-number?${params}`);
  }

  async validateEmail(email, excludeId = null) {
    console.log('📧 Validating email:', email);
    const params = new URLSearchParams({ email });
    if (excludeId) params.append('excludeId', excludeId);
    
    return await this.request(`/employees/validate/email?${params}`);
  }

  // Quick Stats for Dashboard
  async getQuickStats() {
    console.log('⚡ Fetching quick employee stats');
    return await this.request('/employees/quick-stats');
  }

  async getUpcomingEvents() {
    console.log('📅 Fetching upcoming employee events');
    return await this.request('/employees/upcoming-events');
  }

  async getBirthdaysThisMonth() {
    console.log('🎂 Fetching birthdays this month');
    return await this.request('/employees/birthdays/this-month');
  }

  async getWorkAnniversaries() {
    console.log('🎉 Fetching work anniversaries');
    return await this.request('/employees/anniversaries');
  }

  // Advanced Search
  async advancedSearch(searchCriteria) {
    console.log('🔎 Performing advanced employee search:', searchCriteria);
    return await this.request('/employees/advanced-search', {
      method: 'POST',
      body: JSON.stringify(searchCriteria)
    });
  }

  async getSavedSearches() {
    console.log('💾 Fetching saved searches');
    return await this.request('/employees/saved-searches');
  }

  async saveSearch(searchName, searchCriteria) {
    console.log('💾 Saving search:', searchName);
    return await this.request('/employees/saved-searches', {
      method: 'POST',
      body: JSON.stringify({ name: searchName, criteria: searchCriteria })
    });
  }

  // Integration Methods
  async syncWithPayroll() {
    console.log('🔄 Syncing with payroll system');
    return await this.request('/employees/sync/payroll', {
      method: 'POST'
    });
  }

  async syncWithActiveDirectory() {
    console.log('🔄 Syncing with Active Directory');
    return await this.request('/employees/sync/active-directory', {
      method: 'POST'
    });
  }

  // Utility Methods
  refreshToken() {
    this.token = localStorage.getItem('tpa_token');
    console.log('🔄 Employee service token refreshed');
  }

  async testConnection() {
    try {
      console.log('🧪 Testing employee API connection...');
      const response = await this.request('/employees/health');
      return response.success || true;
    } catch (error) {
      console.error('🧪 Employee API connection test failed:', error);
      return false;
    }
  }

  // Helper methods for data processing
  formatEmployeeName(employee) {
    return `${employee.firstName} ${employee.lastName}`;
  }

  getEmployeeFullInfo(employee) {
    return `${this.formatEmployeeName(employee)} (${employee.employeeNumber})`;
  }

  calculateTenure(hireDate) {
    const hire = new Date(hireDate);
    const now = new Date();
    const diffTime = Math.abs(now - hire);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    } else {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  }

  isEmployeeActive(employee) {
    return employee.status === 'Active';
  }

  getEmployeeStatusColor(status) {
    switch (status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Inactive': return 'error';
      case 'Terminated': return 'error';
      default: return 'default';
    }
  }
}

export default new EmployeeService();