// src/data/mockData.js
import { ROLES, LEAVE_STATUS, TASK_STATUS } from '../constants';

export const mockUsers = [
  { id: 1, email: 'admin@company.com', password: 'admin123', role: ROLES.ADMIN, name: 'John Admin' },
  { id: 2, email: 'hr@company.com', password: 'hr123', role: ROLES.HR_MANAGER, name: 'Sarah HR' },
  { id: 3, email: 'staff@company.com', password: 'staff123', role: ROLES.ADMIN_STAFF, name: 'Mike Staff' },
  { id: 4, email: 'field@company.com', password: 'field123', role: ROLES.FIELD_STAFF, name: 'Tom Field' }
];

export const mockEmployees = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@company.com', 
    role: ROLES.ADMIN_STAFF, 
    department: 'IT', 
    status: 'Active',
    hireDate: '2024-01-15',
    phoneNumber: '(555) 123-4567'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@company.com', 
    role: ROLES.FIELD_STAFF, 
    department: 'Operations', 
    status: 'Active',
    hireDate: '2024-02-20',
    phoneNumber: '(555) 234-5678'
  },
  { 
    id: 3, 
    name: 'Bob Wilson', 
    email: 'bob@company.com', 
    role: ROLES.ADMIN_STAFF, 
    department: 'Finance', 
    status: 'Active',
    hireDate: '2023-11-10',
    phoneNumber: '(555) 345-6789'
  }
];

export const mockLeaveRequests = [
  { 
    id: 1, 
    employeeId: 1,
    employee: 'John Doe', 
    type: 'PTO', 
    startDate: '2025-06-20', 
    endDate: '2025-06-22', 
    days: 3, 
    status: LEAVE_STATUS.PENDING,
    reason: 'Family vacation'
  },
  { 
    id: 2, 
    employeeId: 3,
    employee: 'Bob Wilson', 
    type: 'Sick', 
    startDate: '2025-06-18', 
    endDate: '2025-06-18', 
    days: 1, 
    status: LEAVE_STATUS.APPROVED,
    reason: 'Medical appointment'
  }
];

export const mockOnboardingTasks = [
  { 
    id: 1, 
    employeeId: null,
    employee: 'New Employee', 
    task: 'Upload ID Document', 
    status: TASK_STATUS.PENDING, 
    dueDate: '2025-06-20',
    description: 'Please upload a copy of your government-issued ID'
  },
  { 
    id: 2, 
    employeeId: null,
    employee: 'New Employee', 
    task: 'Complete Bank Info', 
    status: TASK_STATUS.COMPLETED, 
    dueDate: '2025-06-18',
    description: 'Provide banking details for direct deposit'
  },
  { 
    id: 3, 
    employeeId: null,
    employee: 'New Employee', 
    task: 'Policy Acknowledgment', 
    status: TASK_STATUS.OVERDUE, 
    dueDate: '2025-06-15',
    description: 'Read and acknowledge company policies'
  }
];

export const mockTimeEntries = [
  {
    id: 1,
    employeeId: 1,
    date: '2025-06-16',
    clockIn: '09:00',
    clockOut: '17:30',
    breakTime: 45,
    totalHours: 7.75,
    location: 'Office'
  },
  {
    id: 2,
    employeeId: 1,
    date: '2025-06-15',
    clockIn: '08:45',
    clockOut: '17:15',
    breakTime: 30,
    totalHours: 8.0,
    location: 'Office'
  }
];