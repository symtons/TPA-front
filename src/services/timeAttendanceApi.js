// =============================================================================
// TIME ATTENDANCE API SERVICE WITH COMPREHENSIVE MOCK DATA
// File: src/services/timeAttendanceApi.js
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7062/api';

// Mock data for development and testing
const mockTimeEntries = [
  {
    id: 1,
    employeeId: 1,
    clockIn: new Date(2025, 6, 1, 8, 30).toISOString(),
    clockOut: new Date(2025, 6, 1, 17, 15).toISOString(),
    totalHours: 8.75,
    status: 'Completed',
    location: 'Main Office',
    date: '2025-07-01'
  },
  {
    id: 2,
    employeeId: 1,
    clockIn: new Date(2025, 6, 2, 8, 45).toISOString(),
    clockOut: new Date(2025, 6, 2, 17, 30).toISOString(),
    totalHours: 8.75,
    status: 'Completed',
    location: 'Main Office',
    date: '2025-07-02'
  },
  {
    id: 3,
    employeeId: 1,
    clockIn: new Date(2025, 6, 3, 9, 0).toISOString(),
    clockOut: null,
    totalHours: null,
    status: 'Active',
    location: 'Remote',
    date: '2025-07-03'
  },
  // Additional entries for different employees
  {
    id: 4,
    employeeId: 2,
    clockIn: new Date(2025, 6, 1, 7, 30).toISOString(),
    clockOut: new Date(2025, 6, 1, 16, 30).toISOString(),
    totalHours: 9.0,
    status: 'Completed',
    location: 'Field Site A',
    date: '2025-07-01'
  },
  {
    id: 5,
    employeeId: 2,
    clockIn: new Date(2025, 6, 2, 7, 45).toISOString(),
    clockOut: new Date(2025, 6, 2, 18, 0).toISOString(),
    totalHours: 10.25,
    status: 'Completed',
    location: 'Field Site B',
    date: '2025-07-02'
  }
];

const mockCurrentStatus = {
  isClockedIn: false,
  currentTimeEntry: null,
  currentWeekHours: 32.5,
  todayHours: 0,
  lastClockIn: null,
  lastClockOut: new Date(2025, 6, 2, 17, 30).toISOString()
};

const mockTimesheets = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Smith',
    weekStartDate: '2025-06-30',
    weekEndDate: '2025-07-06',
    weekDisplay: 'June 30 - July 6, 2025',
    totalHours: 40.0,
    regularHours: 40.0,
    overtimeHours: 0.0,
    status: 'Draft',
    submittedAt: null,
    approvedAt: null,
    approverName: null,
    timeEntries: [
      {
        id: 101,
        clockIn: new Date(2025, 5, 30, 8, 30).toISOString(),
        clockOut: new Date(2025, 5, 30, 17, 30).toISOString(),
        totalHours: 8.0,
        status: 'Completed',
        location: 'Main Office'
      },
      {
        id: 102,
        clockIn: new Date(2025, 6, 1, 8, 30).toISOString(),
        clockOut: new Date(2025, 6, 1, 17, 15).toISOString(),
        totalHours: 8.75,
        status: 'Completed',
        location: 'Main Office'
      },
      {
        id: 103,
        clockIn: new Date(2025, 6, 2, 8, 45).toISOString(),
        clockOut: new Date(2025, 6, 2, 17, 30).toISOString(),
        totalHours: 8.75,
        status: 'Completed',
        location: 'Main Office'
      },
      {
        id: 104,
        clockIn: new Date(2025, 6, 3, 9, 0).toISOString(),
        clockOut: new Date(2025, 6, 3, 18, 0).toISOString(),
        totalHours: 8.0,
        status: 'Completed',
        location: 'Remote'
      },
      {
        id: 105,
        clockIn: new Date(2025, 6, 4, 8, 30).toISOString(),
        clockOut: new Date(2025, 6, 4, 17, 0).toISOString(),
        totalHours: 6.5,
        status: 'Completed',
        location: 'Main Office'
      }
    ]
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: 'John Smith',
    weekStartDate: '2025-06-23',
    weekEndDate: '2025-06-29',
    weekDisplay: 'June 23 - 29, 2025',
    totalHours: 42.5,
    regularHours: 40.0,
    overtimeHours: 2.5,
    status: 'Approved',
    submittedAt: new Date(2025, 5, 29, 18, 0).toISOString(),
    approvedAt: new Date(2025, 5, 30, 9, 0).toISOString(),
    approverName: 'Sarah Johnson',
    timeEntries: []
  },
  {
    id: 3,
    employeeId: 2,
    employeeName: 'Jane Doe',
    weekStartDate: '2025-06-30',
    weekEndDate: '2025-07-06',
    weekDisplay: 'June 30 - July 6, 2025',
    totalHours: 45.0,
    regularHours: 40.0,
    overtimeHours: 5.0,
    status: 'Submitted',
    submittedAt: new Date(2025, 6, 5, 17, 30).toISOString(),
    approvedAt: null,
    approverName: null,
    timeEntries: []
  }
];

const mockAttendanceData = [
  {
    employeeId: 1,
    employeeName: 'John Smith',
    department: 'Administration',
    totalHours: 160.5,
    regularHours: 160.0,
    overtimeHours: 0.5,
    daysWorked: 20,
    daysScheduled: 22,
    attendanceRate: 95.2,
    status: 'Active'
  },
  {
    employeeId: 2,
    employeeName: 'Jane Doe',
    department: 'Field Operations',
    totalHours: 175.0,
    regularHours: 160.0,
    overtimeHours: 15.0,
    daysWorked: 22,
    daysScheduled: 22,
    attendanceRate: 100.0,
    status: 'Active'
  },
  {
    employeeId: 3,
    employeeName: 'Mike Wilson',
    department: 'Human Resources',
    totalHours: 152.0,
    regularHours: 152.0,
    overtimeHours: 0.0,
    daysWorked: 19,
    daysScheduled: 22,
    attendanceRate: 86.4,
    status: 'Active'
  },
  {
    employeeId: 4,
    employeeName: 'Sarah Johnson',
    department: 'Administration',
    totalHours: 168.0,
    regularHours: 160.0,
    overtimeHours: 8.0,
    daysWorked: 21,
    daysScheduled: 22,
    attendanceRate: 95.5,
    status: 'Active'
  },
  {
    employeeId: 5,
    employeeName: 'Tom Brown',
    department: 'Field Operations',
    totalHours: 180.0,
    regularHours: 160.0,
    overtimeHours: 20.0,
    daysWorked: 22,
    daysScheduled: 22,
    attendanceRate: 100.0,
    status: 'Active'
  }
];

const mockPendingTimesheets = [
  {
    id: 3,
    employeeId: 2,
    employeeName: 'Jane Doe',
    weekStartDate: '2025-06-30',
    weekEndDate: '2025-07-06',
    weekDisplay: 'June 30 - July 6, 2025',
    totalHours: 45.0,
    regularHours: 40.0,
    overtimeHours: 5.0,
    status: 'Submitted',
    submittedAt: new Date(2025, 6, 5, 17, 30).toISOString(),
    approvedAt: null,
    approverName: null
  },
  {
    id: 4,
    employeeId: 3,
    employeeName: 'Mike Wilson',
    weekStartDate: '2025-06-30',
    weekEndDate: '2025-07-06',
    weekDisplay: 'June 30 - July 6, 2025',
    totalHours: 38.0,
    regularHours: 38.0,
    overtimeHours: 0.0,
    status: 'Submitted',
    submittedAt: new Date(2025, 6, 6, 16, 0).toISOString(),
    approvedAt: null,
    approverName: null
  },
  {
    id: 5,
    employeeId: 4,
    employeeName: 'Sarah Johnson',
    weekStartDate: '2025-06-30',
    weekEndDate: '2025-07-06',
    weekDisplay: 'June 30 - July 6, 2025',
    totalHours: 42.0,
    regularHours: 40.0,
    overtimeHours: 2.0,
    status: 'Submitted',
    submittedAt: new Date(2025, 6, 6, 18, 15).toISOString(),
    approvedAt: null,
    approverName: null
  }
];

class TimeAttendanceApiService {
  constructor() {
    this.useMockData = process.env.REACT_APP_USE_MOCK !== 'false';
    this.token = localStorage.getItem('tpa_token');
    console.log('⏰ Time Attendance API initialized with mock data:', this.useMockData);
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
    if (this.useMockData) {
      // Return mock data based on endpoint
      return this.getMockResponse(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('⏰ Time Attendance API Request failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      
      throw error;
    }
  }

  getMockResponse(endpoint, options) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('⏰ Mock API call:', endpoint, options);
        
        if (endpoint.includes('/clock-in')) {
          mockCurrentStatus.isClockedIn = true;
          mockCurrentStatus.currentTimeEntry = {
            id: Date.now(),
            clockIn: new Date().toISOString(),
            clockOut: null,
            status: 'Active',
            location: options.body ? JSON.parse(options.body).location : 'Main Office'
          };
          resolve({
            success: true,
            message: 'Successfully clocked in',
            data: mockCurrentStatus.currentTimeEntry
          });
        } else if (endpoint.includes('/clock-out')) {
          if (mockCurrentStatus.currentTimeEntry) {
            mockCurrentStatus.currentTimeEntry.clockOut = new Date().toISOString();
            mockCurrentStatus.currentTimeEntry.status = 'Completed';
            mockCurrentStatus.currentTimeEntry.totalHours = 8.5; // Mock calculation
          }
          mockCurrentStatus.isClockedIn = false;
          mockCurrentStatus.lastClockOut = new Date().toISOString();
          resolve({
            success: true,
            message: 'Successfully clocked out',
            data: mockCurrentStatus.currentTimeEntry
          });
        } else if (endpoint.includes('/current-status')) {
          resolve({
            success: true,
            data: mockCurrentStatus
          });
        } else if (endpoint.includes('/time-entries')) {
          resolve({
            success: true,
            data: mockTimeEntries,
            total: mockTimeEntries.length
          });
        } else if (endpoint.includes('/current-week-timesheet')) {
          resolve({
            success: true,
            data: mockTimesheets[0] // Current week is always the first one
          });
        } else if (endpoint.includes('/timesheets') && endpoint.includes('/submit')) {
          const timesheetId = endpoint.split('/')[3];
          const timesheet = mockTimesheets.find(t => t.id === parseInt(timesheetId));
          if (timesheet) {
            timesheet.status = 'Submitted';
            timesheet.submittedAt = new Date().toISOString();
          }
          resolve({
            success: true,
            message: 'Timesheet submitted successfully',
            data: timesheet
          });
        } else if (endpoint.includes('/timesheets') && endpoint.includes('/approve')) {
          const timesheetId = endpoint.split('/')[3];
          const timesheet = mockPendingTimesheets.find(t => t.id === parseInt(timesheetId));
          if (timesheet) {
            timesheet.status = 'Approved';
            timesheet.approvedAt = new Date().toISOString();
            timesheet.approverName = 'System Manager';
            // Remove from pending list
            const index = mockPendingTimesheets.findIndex(t => t.id === parseInt(timesheetId));
            if (index > -1) {
              mockPendingTimesheets.splice(index, 1);
            }
          }
          resolve({
            success: true,
            message: 'Timesheet approved successfully',
            data: timesheet
          });
        } else if (endpoint.includes('/timesheets') && endpoint.includes('/reject')) {
          const timesheetId = endpoint.split('/')[3];
          const timesheet = mockPendingTimesheets.find(t => t.id === parseInt(timesheetId));
          if (timesheet) {
            timesheet.status = 'Rejected';
            timesheet.approvedAt = new Date().toISOString();
            timesheet.approverName = 'System Manager';
            // Remove from pending list
            const index = mockPendingTimesheets.findIndex(t => t.id === parseInt(timesheetId));
            if (index > -1) {
              mockPendingTimesheets.splice(index, 1);
            }
          }
          resolve({
            success: true,
            message: 'Timesheet rejected successfully',
            data: timesheet
          });
        } else if (endpoint.includes('/timesheets')) {
          resolve({
            success: true,
            data: mockTimesheets.filter(t => t.status !== 'Draft'),
            total: mockTimesheets.length
          });
        } else if (endpoint.includes('/pending-timesheets')) {
          resolve({
            success: true,
            data: mockPendingTimesheets
          });
        } else if (endpoint.includes('/attendance-summary')) {
          resolve({
            success: true,
            data: mockAttendanceData
          });
        } else {
          resolve({
            success: false,
            message: 'Mock endpoint not implemented'
          });
        }
      }, Math.random() * 500 + 200); // Random delay between 200-700ms
    });
  }

  // Clock In/Out Operations
  async clockIn(employeeId, location = 'Main Office') {
    console.log('⏰ Clocking in employee:', employeeId, 'at location:', location);
    return await this.request(`/time-attendance/clock-in`, {
      method: 'POST',
      body: JSON.stringify({ employeeId, location })
    });
  }

  async clockOut(employeeId) {
    console.log('⏰ Clocking out employee:', employeeId);
    return await this.request(`/time-attendance/clock-out`, {
      method: 'POST',
      body: JSON.stringify({ employeeId })
    });
  }

  async getCurrentStatus(employeeId) {
    console.log('⏰ Getting current status for employee:', employeeId);
    return await this.request(`/time-attendance/current-status/${employeeId}`);
  }

  // Time Entries
  async getTimeEntries(employeeId, startDate = null, endDate = null, page = 1, pageSize = 50) {
    console.log('⏰ Getting time entries for employee:', employeeId, 'from:', startDate, 'to:', endDate);
    
    let query = `?page=${page}&pageSize=${pageSize}`;
    if (startDate) query += `&startDate=${startDate.toISOString()}`;
    if (endDate) query += `&endDate=${endDate.toISOString()}`;
    
    return await this.request(`/time-attendance/time-entries/${employeeId}${query}`);
  }

  async updateTimeEntry(entryId, updates) {
    console.log('⏰ Updating time entry:', entryId, 'with:', updates);
    return await this.request(`/time-attendance/time-entries/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteTimeEntry(entryId) {
    console.log('⏰ Deleting time entry:', entryId);
    return await this.request(`/time-attendance/time-entries/${entryId}`, {
      method: 'DELETE'
    });
  }

  // Timesheet Operations
  async getCurrentWeekTimesheet(employeeId) {
    console.log('⏰ Getting current week timesheet for employee:', employeeId);
    return await this.request(`/time-attendance/current-week-timesheet/${employeeId}`);
  }

  async getTimesheets(employeeId, page = 1, pageSize = 20) {
    console.log('⏰ Getting timesheets for employee:', employeeId);
    return await this.request(`/time-attendance/timesheets/${employeeId}?page=${page}&pageSize=${pageSize}`);
  }

  async submitTimesheet(timesheetId, employeeId) {
    console.log('⏰ Submitting timesheet:', timesheetId, 'for employee:', employeeId);
    return await this.request(`/time-attendance/timesheets/${timesheetId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ employeeId })
    });
  }

  async approveTimesheet(timesheetId, approverId) {
    console.log('⏰ Approving timesheet:', timesheetId, 'by:', approverId);
    return await this.request(`/time-attendance/timesheets/${timesheetId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approverId })
    });
  }

  async rejectTimesheet(timesheetId, approverId, reason) {
    console.log('⏰ Rejecting timesheet:', timesheetId, 'by:', approverId, 'reason:', reason);
    return await this.request(`/time-attendance/timesheets/${timesheetId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ approverId, reason })
    });
  }

  // Management/Reporting Operations
  async getPendingTimesheets(role) {
    console.log('⏰ Getting pending timesheets for role:', role);
    return await this.request(`/time-attendance/pending-timesheets?role=${role}`);
  }

  async getAttendanceSummary(startDate, endDate, role) {
    console.log('⏰ Getting attendance summary from:', startDate, 'to:', endDate, 'for role:', role);
    
    let query = `?role=${role}`;
    if (startDate) query += `&startDate=${startDate.toISOString()}`;
    if (endDate) query += `&endDate=${endDate.toISOString()}`;
    
    return await this.request(`/time-attendance/attendance-summary${query}`);
  }

  async getEmployeeAttendance(employeeId, startDate, endDate) {
    console.log('⏰ Getting attendance for employee:', employeeId, 'from:', startDate, 'to:', endDate);
    
    let query = '';
    if (startDate) query += `?startDate=${startDate.toISOString()}`;
    if (endDate) query += `${query ? '&' : '?'}endDate=${endDate.toISOString()}`;
    
    return await this.request(`/time-attendance/employee-attendance/${employeeId}${query}`);
  }

  // Schedule Operations
  async getSchedule(employeeId, startDate, endDate) {
    console.log('⏰ Getting schedule for employee:', employeeId, 'from:', startDate, 'to:', endDate);
    
    let query = '';
    if (startDate) query += `?startDate=${startDate.toISOString()}`;
    if (endDate) query += `${query ? '&' : '?'}endDate=${endDate.toISOString()}`;
    
    return await this.request(`/time-attendance/schedule/${employeeId}${query}`);
  }

  async updateSchedule(employeeId, scheduleData) {
    console.log('⏰ Updating schedule for employee:', employeeId, 'with:', scheduleData);
    return await this.request(`/time-attendance/schedule/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData)
    });
  }

  // Utility Methods
  refreshToken() {
    this.token = localStorage.getItem('tpa_token');
    console.log('⏰ Token refreshed:', this.token ? 'Present' : 'Missing');
  }

  // Test connectivity
  async testConnection() {
    try {
      console.log('⏰ Testing Time Attendance API connection...');
      if (this.useMockData) {
        return true;
      }
      const response = await fetch(`${API_BASE_URL}/time-attendance/health`);
      return response.ok;
    } catch (error) {
      console.error('⏰ Health check failed:', error);
      return false;
    }
  }

  // Helper method to add more mock data for testing
  addMockTimeEntry(entry) {
    mockTimeEntries.push({
      ...entry,
      id: mockTimeEntries.length + 1
    });
  }

  addMockTimesheet(timesheet) {
    mockTimesheets.push({
      ...timesheet,
      id: mockTimesheets.length + 1
    });
  }

  // Clear mock data (useful for testing)
  clearMockData() {
    mockTimeEntries.length = 0;
    mockTimesheets.length = 0;
    mockPendingTimesheets.length = 0;
    mockAttendanceData.length = 0;
  }

  // Get all mock data for debugging
  getAllMockData() {
    return {
      timeEntries: mockTimeEntries,
      timesheets: mockTimesheets,
      pendingTimesheets: mockPendingTimesheets,
      attendanceData: mockAttendanceData,
      currentStatus: mockCurrentStatus
    };
  }
}

export default new TimeAttendanceApiService();