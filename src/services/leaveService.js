// src/services/leaveService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7062/api';

class LeaveService {
  constructor() {
    this.token = localStorage.getItem('tpa_token');
    console.log('🏖️ Leave Service initialized');
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
    console.log('🌐 Leave API request to:', url);
    
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
      console.log('✅ Leave response received:', data);
      return data;
      
    } catch (error) {
      console.error('💥 Leave request failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // Leave Request CRUD Operations
  async getLeaveRequests(filters = {}) {
    console.log('📋 Fetching leave requests with filters:', filters);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const endpoint = params.toString() ? `/leave/requests?${params}` : '/leave/requests';
    return await this.request(endpoint);
  }

  async getMyLeaveRequests() {
    console.log('👤 Fetching my leave requests');
    return await this.request('/leave/my-requests');
  }

  async getLeaveRequestById(requestId) {
    console.log('🔍 Fetching leave request by ID:', requestId);
    return await this.request(`/leave/requests/${requestId}`);
  }

  async createLeaveRequest(requestData) {
    console.log('✨ Creating leave request:', requestData);
    return await this.request('/leave/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }

  async updateLeaveRequest(requestId, updates) {
    console.log('📝 Updating leave request:', requestId, updates);
    return await this.request(`/leave/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteLeaveRequest(requestId) {
    console.log('🗑️  Deleting leave request:', requestId);
    return await this.request(`/leave/requests/${requestId}`, {
      method: 'DELETE'
    });
  }

  // Leave Approval Operations
  async approveLeaveRequest(requestId, comments = '') {
    console.log('✅ Approving leave request:', requestId);
    return await this.request(`/leave/requests/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments })
    });
  }

  async rejectLeaveRequest(requestId, reason) {
    console.log('❌ Rejecting leave request:', requestId);
    return await this.request(`/leave/requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async bulkApproveRequests(requestIds, comments = '') {
    console.log('🔄 Bulk approving requests:', requestIds);
    return await this.request('/leave/requests/bulk-approve', {
      method: 'POST',
      body: JSON.stringify({ requestIds, comments })
    });
  }

  async bulkRejectRequests(requestIds, reason) {
    console.log('🔄 Bulk rejecting requests:', requestIds);
    return await this.request('/leave/requests/bulk-reject', {
      method: 'POST',
      body: JSON.stringify({ requestIds, reason })
    });
  }

  // Leave Balance Operations
  async getLeaveBalances(employeeId = null) {
    console.log('💰 Fetching leave balances for employee:', employeeId);
    const endpoint = employeeId ? `/leave/balances/${employeeId}` : '/leave/my-balances';
    return await this.request(endpoint);
  }

  async getTeamLeaveBalances() {
    console.log('👥 Fetching team leave balances');
    return await this.request('/leave/team-balances');
  }

  async getAllLeaveBalances() {
    console.log('🏢 Fetching all employee leave balances');
    return await this.request('/leave/all-balances');
  }

  async updateLeaveBalance(employeeId, balanceData) {
    console.log('📝 Updating leave balance for employee:', employeeId);
    return await this.request(`/leave/balances/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(balanceData)
    });
  }

  async addLeaveAccrual(employeeId, accrualData) {
    console.log('➕ Adding leave accrual for employee:', employeeId);
    return await this.request(`/leave/balances/${employeeId}/accrual`, {
      method: 'POST',
      body: JSON.stringify(accrualData)
    });
  }

  // Leave Calendar Operations
  async getLeaveCalendar(startDate, endDate, departmentId = null) {
    console.log('📅 Fetching leave calendar from', startDate, 'to', endDate);
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    
    if (departmentId) params.append('departmentId', departmentId);
    
    return await this.request(`/leave/calendar?${params}`);
  }

  async getTeamCalendar(startDate, endDate) {
    console.log('👥 Fetching team calendar');
    const params = new URLSearchParams({ startDate, endDate });
    return await this.request(`/leave/team-calendar?${params}`);
  }

  async checkLeaveConflicts(startDate, endDate, employeeId, departmentId = null) {
    console.log('⚠️  Checking leave conflicts');
    return await this.request('/leave/check-conflicts', {
      method: 'POST',
      body: JSON.stringify({ startDate, endDate, employeeId, departmentId })
    });
  }

  // Leave Statistics and Reports
  async getLeaveStatistics(filters = {}) {
    console.log('📊 Fetching leave statistics with filters:', filters);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const endpoint = params.toString() ? `/leave/statistics?${params}` : '/leave/statistics';
    return await this.request(endpoint);
  }

  async getDepartmentLeaveReport(departmentId, startDate, endDate) {
    console.log('📈 Fetching department leave report');
    const params = new URLSearchParams({ startDate, endDate });
    return await this.request(`/leave/reports/department/${departmentId}?${params}`);
  }

  async getEmployeeLeaveHistory(employeeId, year = null) {
    console.log('📜 Fetching employee leave history');
    const endpoint = year 
      ? `/leave/history/${employeeId}?year=${year}`
      : `/leave/history/${employeeId}`;
    return await this.request(endpoint);
  }

  async getLeaveUtilizationReport(startDate, endDate) {
    console.log('📊 Fetching leave utilization report');
    const params = new URLSearchParams({ startDate, endDate });
    return await this.request(`/leave/reports/utilization?${params}`);
  }

  // Leave Policies and Settings
  async getLeavePolicies() {
    console.log('📜 Fetching leave policies');
    return await this.request('/leave/policies');
  }

  async updateLeavePolicy(policyId, policyData) {
    console.log('📝 Updating leave policy:', policyId);
    return await this.request(`/leave/policies/${policyId}`, {
      method: 'PUT',
      body: JSON.stringify(policyData)
    });
  }

  async getLeaveTypes() {
    console.log('🏷️  Fetching leave types');
    return await this.request('/leave/types');
  }

  async createLeaveType(typeData) {
    console.log('✨ Creating leave type:', typeData);
    return await this.request('/leave/types', {
      method: 'POST',
      body: JSON.stringify(typeData)
    });
  }

  // Leave Workflow Operations
  async getApprovalWorkflow(requestId) {
    console.log('🔄 Fetching approval workflow for request:', requestId);
    return await this.request(`/leave/requests/${requestId}/workflow`);
  }

  async getPendingApprovals(managerId = null) {
    console.log('⏳ Fetching pending approvals for manager:', managerId);
    const endpoint = managerId 
      ? `/leave/pending-approvals/${managerId}`
      : '/leave/my-pending-approvals';
    return await this.request(endpoint);
  }

  async delegateApproval(requestId, delegateToUserId, reason = '') {
    console.log('🔄 Delegating approval for request:', requestId);
    return await this.request(`/leave/requests/${requestId}/delegate`, {
      method: 'POST',
      body: JSON.stringify({ delegateToUserId, reason })
    });
  }

  // Notification Operations
  async sendLeaveReminder(requestId, reminderType = 'PENDING_APPROVAL') {
    console.log('📧 Sending leave reminder for request:', requestId);
    return await this.request(`/leave/requests/${requestId}/remind`, {
      method: 'POST',
      body: JSON.stringify({ reminderType })
    });
  }

  async notifyTeamAboutLeave(requestId, message = '') {
    console.log('📢 Notifying team about leave request:', requestId);
    return await this.request(`/leave/requests/${requestId}/notify-team`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async getLeaveNotifications(limit = 10) {
    console.log('🔔 Fetching leave notifications');
    return await this.request(`/leave/notifications?limit=${limit}`);
  }

  // Import/Export Operations
  async exportLeaveData(filters = {}, format = 'xlsx') {
    console.log('📥 Exporting leave data in format:', format);
    const params = new URLSearchParams({ format });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await fetch(`${API_BASE_URL}/leave/export?${params}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to export leave data');
    }
    
    return response.blob();
  }

  async importLeaveData(file, importType = 'requests') {
    console.log('📤 Importing leave data, type:', importType);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('importType', importType);

    return await this.request('/leave/import', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
        // Don't set Content-Type for FormData - let browser set it with boundary
      }
    });
  }

  // Advanced Search and Filtering
  async searchLeaveRequests(searchTerm, filters = {}) {
    console.log('🔍 Searching leave requests:', searchTerm);
    const params = new URLSearchParams({ search: searchTerm });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return await this.request(`/leave/search?${params}`);
  }

  async getLeaveRequestFilters() {
    console.log('🏷️  Fetching filter options for leave requests');
    return await this.request('/leave/filters');
  }

  // Leave Analytics
  async getLeaveAnalytics(period = 'year', year = new Date().getFullYear()) {
    console.log('📈 Fetching leave analytics for period:', period, year);
    const params = new URLSearchParams({ period, year: year.toString() });
    return await this.request(`/leave/analytics?${params}`);
  }

  async getLeavePatterns(employeeId = null, timeframe = '12months') {
    console.log('📊 Fetching leave patterns');
    const params = new URLSearchParams({ timeframe });
    if (employeeId) params.append('employeeId', employeeId);
    
    return await this.request(`/leave/patterns?${params}`);
  }

  async getLeaveProjections(departmentId = null, months = 6) {
    console.log('🔮 Fetching leave projections');
    const params = new URLSearchParams({ months: months.toString() });
    if (departmentId) params.append('departmentId', departmentId);
    
    return await this.request(`/leave/projections?${params}`);
  }

  // Holiday Management
  async getHolidays(year = new Date().getFullYear()) {
    console.log('🎉 Fetching holidays for year:', year);
    return await this.request(`/leave/holidays?year=${year}`);
  }

  async createHoliday(holidayData) {
    console.log('✨ Creating holiday:', holidayData);
    return await this.request('/leave/holidays', {
      method: 'POST',
      body: JSON.stringify(holidayData)
    });
  }

  async updateHoliday(holidayId, holidayData) {
    console.log('📝 Updating holiday:', holidayId);
    return await this.request(`/leave/holidays/${holidayId}`, {
      method: 'PUT',
      body: JSON.stringify(holidayData)
    });
  }

  async deleteHoliday(holidayId) {
    console.log('🗑️  Deleting holiday:', holidayId);
    return await this.request(`/leave/holidays/${holidayId}`, {
      method: 'DELETE'
    });
  }

  // Utility Methods
  refreshToken() {
    this.token = localStorage.getItem('tpa_token');
    console.log('🔄 Leave service token refreshed');
  }

  async testConnection() {
    try {
      console.log('🧪 Testing leave API connection...');
      const response = await this.request('/leave/health');
      return response.success || true;
    } catch (error) {
      console.error('🧪 Leave API connection test failed:', error);
      return false;
    }
  }

  // Helper method to calculate business days
  calculateBusinessDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return businessDays;
  }

  // Helper method to format leave duration
  formatLeaveDuration(days) {
    if (days === 0.5) return '0.5 day (Half day)';
    if (days === 1) return '1 day';
    return `${days} days`;
  }

  // Helper method to check if date is weekend
  isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }

  // Helper method to get next business day
  getNextBusinessDay(date) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    while (this.isWeekend(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
  }
}

export default new LeaveService();