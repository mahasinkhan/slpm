// src/types/index.ts
import { Request } from 'express';
import { Role, InterviewStatus, EmploymentStatus, TrackingStatus } from '@prisma/client';
import { JWTPayload } from '../utils/jwt.util';

//  ==================== AUTH TYPES ====================

// Extend Express Request type to add our custom user property
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export interface AuthRequest extends Request {
  visitorId?: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

//  ==================== USER TYPES ====================

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  role?: Role;
  status?: EmploymentStatus;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: Role;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  status: EmploymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithEmployee extends UserResponse {
  employee?: {
    id: string;
    employeeId: string;
    department: string;
    position: string;
    joinDate: Date;
    salary?: number;
    status: EmploymentStatus;
  };
}

export interface PaginatedUsersResponse {
  users: UserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStatsResponse {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  terminated: number;
  superadmins: number;
  admins: number;
  employees: number;
}

// ==================== INTERVIEW TYPES ====================

export interface CreateInterviewDTO {
  candidateId: string;
  position: string;
  division: string;
  scheduledAt?: Date;
  notes?: string;
}

export interface UpdateInterviewDTO {
  status?: InterviewStatus;
  scheduledAt?: Date;
  notes?: string;
  feedback?: string;
}

export interface InterviewResponse {
  id: string;
  candidateId: string;
  interviewerId?: string;
  position: string;
  division: string;
  status: InterviewStatus;
  scheduledAt?: Date;
  notes?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== EMPLOYEE TYPES ====================

export interface EmployeeResponse {
  id: string;
  userId: string;
  employeeId: string;
  department: string;
  position: string;
  joinDate: Date;
  status: EmploymentStatus;
  salary?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeDTO {
  userId: string;
  department: string;
  position: string;
  salary?: number;
}

export interface UpdateEmployeeDTO {
  department?: string;
  position?: string;
  salary?: number;
  status?: EmploymentStatus;
}

// ==================== TERMINATION TYPES ====================

export interface TerminationResponse {
  id: string;
  employeeId: string;
  reason: string;
  terminatedAt: Date;
  terminatedBy?: string;
  notes?: string;
}

export interface CreateTerminationDTO {
  employeeId: string;
  reason: string;
  notes?: string;
  terminatedBy?: string;
}

// ==================== EMPLOYEE TRACKING TYPES ====================

export interface EmployeeLoginDTO {
  employeeId: string;
  email: string;
  department: string;
  position?: string;
  location?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface EmployeeLogoutDTO {
  employeeId: string;
  email: string;
}

export interface EmployeeTrackingResponse {
  id: string;
  userId: string;
  employeeId: string;
  email: string;
  department: string;
  position?: string;
  loginTime: Date;
  logoutTime?: Date;
  status: TrackingStatus;
  workDurationHours?: number;
  ipAddress?: string;
  deviceInfo?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkSessionResponse {
  id: string;
  userId: string;
  employeeId: string;
  email: string;
  department: string;
  loginTime: Date;
  logoutTime: Date;
  durationHours: number;
  date: Date;
  breakDuration?: number;
  tasksCompleted?: number;
  productivity?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkHistoryResponse {
  employeeId: string;
  period: string;
  totalSessions: number;
  totalHours: string;
  averageDaily: string;
  averagePercentage: string;
  sessions: WorkSessionResponse[];
}

export interface ProductivityReportResponse {
  employeeId: string;
  period: string;
  presentDays: number;
  expectedDays: number;
  attendanceRate: string;
  totalHours: string;
  averageDaily: string;
  tasksCompleted: number;
  averageProductivity: string;
  sessions: WorkSessionResponse[];
}

export interface DailyStatsResponse {
  date: string;
  totalSessions: number;
  totalHours: string;
  averageHours: string;
  totalTasksCompleted: number;
  averageProductivity: string;
}

export interface DepartmentPerformanceResponse {
  department: string;
  period: string;
  totalEmployees: number;
  onlineNow: number;
  totalSessions: number;
  totalHours: string;
  averageHours: string;
  employees: Array<{
    employeeId: string;
    email: string;
    sessions: number;
    hours: string;
  }>;
}

export interface AttendanceReportResponse {
  id: string;
  employeeId: string;
  email: string;
  department: string;
  date: Date;
  presentDays: number;
  absentDays: number;
  totalHours: number;
  attendanceRate: number;
  monthYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminActivityLogResponse {
  id: string;
  action: string;
  submitterId: string;
  employeeId?: string;
  email?: string;
  department?: string;
  details: string;
  timestamp: Date;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  submitter?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface DepartmentStatsResponse {
  department: string;
  totalEmployees: number;
  onlineNow: number;
  totalHours: string;
  averageHours: string;
}

export interface SuperAdminDashboardResponse {
  realtime: {
    onlineEmployees: number;
    offlineEmployees: number;
    totalEmployees: number;
  };
  today: {
    logins: number;
    totalHours: string;
    averageHours: string;
  };
  departmentStats: DepartmentStatsResponse[];
  topPerformers: Array<{
    employeeId: string;
    email: string;
    totalHours: string;
  }>;
  recentActivity: AdminActivityLogResponse[];
}

export interface EmployeeSummaryResponse {
  employeeId: string;
  currentSession: EmployeeTrackingResponse | null;
  todayHours: string;
  monthHours: string;
}

export interface OnlineEmployeesResponse {
  employeeId: string;
  email: string;
  department: string;
  position?: string;
  status: TrackingStatus;
  loginTime: Date;
  onlineFor: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    phone?: string;
  };
}

// ==================== CONTENT TYPES ====================

export interface CreateContentDTO {
  title: string;
  description?: string;
  type: string;
  slug: string;
  content: string;
  published?: boolean;
}

export interface UpdateContentDTO {
  title?: string;
  description?: string;
  content?: string;
  published?: boolean;
}

// ==================== CONTACT TYPES ====================

export interface ContactSubmissionDTO {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}