// server/src/controllers/tracking.controller.ts

import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import EmployeeTrackingService from '../services/employee-tracking.service';
import { AuthRequest, ApiResponse, EmployeeLoginDTO, EmployeeLogoutDTO } from '../types';

const prisma = new PrismaClient();

/**
 * Login Controller
 * POST /api/tracking/login
 */
export const loginEmployee = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loginData: EmployeeLoginDTO = req.body;

    // Validate required fields
    if (!EmployeeTrackingService.validateEmployeeData(loginData)) {
      res.status(400).json({
        success: false,
        error: 'Employee ID, email, and department are required'
      });
      return;
    }

    const { employeeId, email, department, position, ipAddress, deviceInfo, location } = loginData;

    // Check if already logged in
    const existingSession = await prisma.employeeTracking.findFirst({
      where: {
        employeeId,
        status: 'ONLINE',
        logoutTime: null
      }
    });

    if (existingSession) {
      res.status(400).json({
        success: false,
        error: 'Employee already logged in'
      });
      return;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Create tracking record
    const tracking = await prisma.employeeTracking.create({
      data: {
        userId: user.id,
        employeeId,
        email,
        department,
        position,
        loginTime: new Date(),
        status: 'ONLINE',
        ipAddress,
        deviceInfo,
        location
      }
    });

    // Log activity for SuperAdmin
    await prisma.adminActivityLog.create({
      data: {
        action: 'EMPLOYEE_LOGIN',
        submitterId: user.id,
        employeeId,
        email,
        department,
        details: `${email} (${position || 'Employee'}) logged in from ${location || 'Unknown location'}`,
        status: 'SUCCESS',
        ipAddress
      }
    });

    const response: ApiResponse<any> = {
      success: true,
      message: 'Login recorded successfully',
      data: tracking
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login tracking failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Logout Controller
 * POST /api/tracking/logout
 */
export const logoutEmployee = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const logoutData: EmployeeLogoutDTO = req.body;

    if (!logoutData.employeeId || !logoutData.email) {
      res.status(400).json({
        success: false,
        error: 'Employee ID and email are required'
      });
      return;
    }

    const { employeeId, email } = logoutData;

    // Find active session
    const activeSession = await prisma.employeeTracking.findFirst({
      where: {
        employeeId,
        status: 'ONLINE',
        logoutTime: null
      }
    });

    if (!activeSession) {
      res.status(404).json({
        success: false,
        error: 'No active session found'
      });
      return;
    }

    // Calculate work duration
    const loginTime = new Date(activeSession.loginTime);
    const logoutTime = new Date();
    const durationMs = logoutTime.getTime() - loginTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    // Update tracking record
    const updatedTracking = await prisma.employeeTracking.update({
      where: { id: activeSession.id },
      data: {
        logoutTime: logoutTime,
        status: 'OFFLINE',
        workDurationHours: durationHours
      }
    });

    // Store work session for historical records
    const workSession = await prisma.workSession.create({
      data: {
        userId: activeSession.userId,
        employeeId,
        email,
        department: activeSession.department,
        loginTime,
        logoutTime,
        durationHours,
        date: new Date(loginTime.toDateString())
      }
    });

    // Log activity for SuperAdmin
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      await prisma.adminActivityLog.create({
        data: {
          action: 'EMPLOYEE_LOGOUT',
          submitterId: user.id,
          employeeId,
          email,
          department: activeSession.department,
          details: `${email} logged out. Work duration: ${durationHours.toFixed(2)}h`,
          status: 'SUCCESS',
          ipAddress: activeSession.ipAddress
        }
      });
    }

    const response: ApiResponse<any> = {
      success: true,
      message: 'Logout recorded successfully',
      data: {
        tracking: updatedTracking,
        workSession
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout tracking failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get All Online Employees
 * GET /api/tracking/online-employees
 */
export const getOnlineEmployees = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { department } = req.query;

    const onlineEmployees = await EmployeeTrackingService.getOnlineEmployees(
      department as string | undefined
    );

    const response: ApiResponse<any> = {
      success: true,
      message: `Found ${onlineEmployees.length} online employees`,
      data: onlineEmployees
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch online employees',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get Employee Work History
 * GET /api/tracking/work-history/:employeeId
 */
export const getWorkHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const { days = '7' } = req.query;

    const daysBack = Number(days) || 7;

    const history = await EmployeeTrackingService.getWorkHistory(employeeId, daysBack);

    const response: ApiResponse<any> = {
      success: true,
      data: history
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch work history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get Employee Current Session
 * GET /api/tracking/current-session/:employeeId
 */
export const getCurrentSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const session = await EmployeeTrackingService.getCurrentSession(employeeId);

    const response: ApiResponse<any> = {
      success: true,
      message: session ? 'Session found' : 'No active session',
      data: session
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get Employee Summary
 * GET /api/tracking/employee-summary/:employeeId
 */
export const getEmployeeSummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const summary = await EmployeeTrackingService.getEmployeeSummary(employeeId);

    const response: ApiResponse<any> = {
      success: true,
      data: summary
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ==================== SUPERADMIN CONTROLLERS ====================

/**
 * Get SuperAdmin Dashboard
 * GET /api/tracking/admin/dashboard
 */
export const getSuperAdminDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const dashboard = await EmployeeTrackingService.getSuperAdminDashboard();

    const response: ApiResponse<any> = {
      success: true,
      data: dashboard
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get Activity Logs
 * GET /api/tracking/admin/activity-logs
 */
export const getActivityLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { limit = '100', action, startDate, endDate } = req.query;

    const where: any = {};
    if (action) where.action = action;

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate as string);
      if (endDate) where.timestamp.lte = new Date(endDate as string);
    }

    const logs = await prisma.adminActivityLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: Number(limit),
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const response: ApiResponse<any> = {
      success: true,
      message: `Found ${logs.length} activity logs`,
      data: logs
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity logs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get Department Stats
 * GET /api/tracking/admin/department-stats
 */
export const getDepartmentStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const stats = await EmployeeTrackingService.getAllDepartmentsStats();

    const response: ApiResponse<any> = {
      success: true,
      data: stats
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Department stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch department stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get Productivity Report
 * GET /api/tracking/admin/productivity/:employeeId
 */
export const getProductivityReport = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const { daysBack = '30' } = req.query;

    const report = await EmployeeTrackingService.getProductivityReport(
      employeeId,
      Number(daysBack) || 30
    );

    const response: ApiResponse<any> = {
      success: true,
      data: report
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Productivity report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch productivity report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get Department Performance
 * GET /api/tracking/admin/department-performance/:department
 */
export const getDepartmentPerformance = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { department } = req.params;
    const { daysBack = '30' } = req.query;

    const performance = await EmployeeTrackingService.getDepartmentPerformance(
      department,
      Number(daysBack) || 30
    );

    const response: ApiResponse<any> = {
      success: true,
      data: performance
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Department performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch department performance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Export Tracking Data
 * GET /api/tracking/admin/export
 */
export const exportTrackingData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const data = await EmployeeTrackingService.exportTrackingData(
      start,
      end,
      format as 'json' | 'csv'
    );

    if (format === 'csv' && typeof data === 'string') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="employee-tracking-report.csv"');
      res.send(data);
    } else {
      const response: ApiResponse<any> = {
        success: true,
        data
      };
      res.status(200).json(response);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}