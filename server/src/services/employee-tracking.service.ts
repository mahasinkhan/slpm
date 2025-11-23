// server/src/services/employee-tracking.service.ts

import { PrismaClient, TrackingStatus, Prisma } from '@prisma/client';
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const prisma = new PrismaClient();

export class EmployeeTrackingService {
  
  // ==================== REAL-TIME TRACKING ====================

  /**
   * Get all currently online employees with real-time data
   */
  static async getOnlineEmployees(department?: string) {
    try {
      const onlineEmployees = await prisma.employeeTracking.findMany({
        where: {
          status: 'ONLINE',
          logoutTime: null,
          ...(department && { department })
        },
        orderBy: { loginTime: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              phone: true
            }
          }
        }
      });

      return onlineEmployees.map(emp => ({
        ...emp,
        onlineFor: this.calculateDuration(emp.loginTime)
      }));
    } catch (error) {
      console.error('Error getting online employees:', error);
      throw error;
    }
  }

  /**
   * Get employee current session
   */
  static async getCurrentSession(employeeId: string) {
    try {
      const session = await prisma.employeeTracking.findFirst({
        where: {
          employeeId,
          status: 'ONLINE',
          logoutTime: null
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      if (session) {
        return {
          ...session,
          onlineFor: this.calculateDuration(session.loginTime)
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting current session:', error);
      throw error;
    }
  }

  /**
   * Mark employee as break
   */
  static async markBreak(employeeId: string, breakDuration: number) {
    try {
      const session = await prisma.employeeTracking.findFirst({
        where: {
          employeeId,
          status: 'ONLINE',
          logoutTime: null
        }
      });

      if (!session) {
        throw new Error('No active session found');
      }

      const updated = await prisma.employeeTracking.update({
        where: { id: session.id },
        data: {
          status: 'BREAK'
        }
      });

      return updated;
    } catch (error) {
      console.error('Error marking break:', error);
      throw error;
    }
  }

  /**
   * Resume from break
   */
  static async resumeFromBreak(employeeId: string) {
    try {
      const session = await prisma.employeeTracking.findFirst({
        where: {
          employeeId,
          status: 'BREAK'
        }
      });

      if (!session) {
        throw new Error('No break session found');
      }

      const updated = await prisma.employeeTracking.update({
        where: { id: session.id },
        data: {
          status: 'ONLINE'
        }
      });

      return updated;
    } catch (error) {
      console.error('Error resuming from break:', error);
      throw error;
    }
  }

  // ==================== WORK SESSIONS ====================

  /**
   * Get employee's work sessions for specified number of days
   */
  static async getWorkHistory(employeeId: string, daysBack: number = 7) {
    try {
      const fromDate = subDays(new Date(), daysBack);

      const sessions = await prisma.workSession.findMany({
        where: {
          employeeId,
          date: {
            gte: fromDate
          }
        },
        orderBy: { date: 'desc' }
      });

      const totalHours = sessions.reduce((sum, s) => sum + s.durationHours, 0);
      const averageDaily = sessions.length > 0 ? totalHours / sessions.length : 0;
      const averageDaily8Hours = averageDaily / 8; // percentage of 8-hour workday

      return {
        employeeId,
        period: `Last ${daysBack} days`,
        totalSessions: sessions.length,
        totalHours: totalHours.toFixed(2),
        averageDaily: averageDaily.toFixed(2),
        averagePercentage: (averageDaily8Hours * 100).toFixed(2),
        sessions
      };
    } catch (error) {
      console.error('Error getting work history:', error);
      throw error;
    }
  }

  /**
   * Get all work sessions for date range
   */
  static async getWorkSessionsByDateRange(employeeId: string, startDate: Date, endDate: Date) {
    try {
      const sessions = await prisma.workSession.findMany({
        where: {
          employeeId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'desc' }
      });

      return sessions;
    } catch (error) {
      console.error('Error getting work sessions by date range:', error);
      throw error;
    }
  }

  // ==================== PRODUCTIVITY REPORTS ====================

  /**
   * Get employee productivity report
   */
  static async getProductivityReport(employeeId: string, daysBack: number = 30) {
    try {
      const fromDate = subDays(new Date(), daysBack);

      const sessions = await prisma.workSession.findMany({
        where: {
          employeeId,
          date: {
            gte: fromDate
          }
        },
        orderBy: { date: 'desc' }
      });

      const totalHours = sessions.reduce((sum, s) => sum + s.durationHours, 0);
      const averageDaily = sessions.length > 0 ? totalHours / sessions.length : 0;
      const presentDays = new Set(sessions.map(s => s.date.toDateString())).size;
      const expectedDays = Math.ceil(daysBack / 7) * 5; // Assume 5-day workweek
      const attendanceRate = (presentDays / expectedDays) * 100;

      return {
        employeeId,
        period: `Last ${daysBack} days`,
        presentDays,
        expectedDays,
        attendanceRate: attendanceRate.toFixed(2),
        totalHours: totalHours.toFixed(2),
        averageDaily: averageDaily.toFixed(2),
        tasksCompleted: sessions.reduce((sum, s) => sum + (s.tasksCompleted || 0), 0),
        averageProductivity: sessions.length > 0 
          ? (sessions.reduce((sum, s) => sum + (s.productivity || 0), 0) / sessions.length).toFixed(2)
          : '0.00',
        sessions
      };
    } catch (error) {
      console.error('Error getting productivity report:', error);
      throw error;
    }
  }

  /**
   * Calculate daily statistics for all employees
   */
  static async getDailyStats(date: Date = new Date()) {
    try {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const stats = await prisma.workSession.aggregate({
        where: {
          date: {
            gte: dayStart,
            lte: dayEnd
          }
        },
        _count: true,
        _sum: {
          durationHours: true,
          tasksCompleted: true
        },
        _avg: {
          durationHours: true,
          productivity: true
        }
      });

      return {
        date: date.toDateString(),
        totalSessions: stats._count,
        totalHours: (stats._sum.durationHours || 0).toFixed(2),
        averageHours: (stats._avg.durationHours || 0).toFixed(2),
        totalTasksCompleted: stats._sum.tasksCompleted || 0,
        averageProductivity: (stats._avg.productivity || 0).toFixed(2)
      };
    } catch (error) {
      console.error('Error getting daily stats:', error);
      throw error;
    }
  }

  // ==================== DEPARTMENT ANALYTICS ====================

  /**
   * Get department performance
   */
  static async getDepartmentPerformance(department: string, daysBack: number = 30) {
    try {
      const fromDate = subDays(new Date(), daysBack);

      // Get all employees in department
      const employees = await prisma.employeeTracking.findMany({
        where: { department },
        distinct: ['employeeId'],
        select: { employeeId: true, email: true }
      });

      // Get their work sessions
      const sessions = await prisma.workSession.findMany({
        where: {
          department,
          date: {
            gte: fromDate
          }
        }
      });

      const totalHours = sessions.reduce((sum, s) => sum + s.durationHours, 0);
      const averageHours = sessions.length > 0 ? totalHours / sessions.length : 0;

      return {
        department,
        period: `Last ${daysBack} days`,
        totalEmployees: employees.length,
        onlineNow: (await prisma.employeeTracking.count({
          where: {
            department,
            status: 'ONLINE',
            logoutTime: null
          }
        })),
        totalSessions: sessions.length,
        totalHours: totalHours.toFixed(2),
        averageHours: averageHours.toFixed(2),
        employees: employees.map(emp => ({
          employeeId: emp.employeeId,
          email: emp.email,
          sessions: sessions.filter(s => s.employeeId === emp.employeeId).length,
          hours: sessions
            .filter(s => s.employeeId === emp.employeeId)
            .reduce((sum, s) => sum + s.durationHours, 0)
            .toFixed(2)
        }))
      };
    } catch (error) {
      console.error('Error getting department performance:', error);
      throw error;
    }
  }

  /**
   * Get all departments statistics
   */
  static async getAllDepartmentsStats() {
    try {
      const departments = await prisma.employeeTracking.groupBy({
        by: ['department'],
        _count: true
      });

      const stats = await Promise.all(
        departments.map(async (dept) => {
          const onlineCount = await prisma.employeeTracking.count({
            where: {
              department: dept.department,
              status: 'ONLINE',
              logoutTime: null
            }
          });

          const sessions = await prisma.workSession.aggregate({
            where: {
              department: dept.department
            },
            _sum: {
              durationHours: true
            },
            _avg: {
              durationHours: true
            }
          });

          return {
            department: dept.department,
            totalEmployees: dept._count,
            onlineNow: onlineCount,
            totalHours: (sessions._sum.durationHours || 0).toFixed(2),
            averageHours: (sessions._avg.durationHours || 0).toFixed(2)
          };
        })
      );

      return stats;
    } catch (error) {
      console.error('Error getting all departments stats:', error);
      throw error;
    }
  }

  // ==================== ATTENDANCE & COMPLIANCE ====================

  /**
   * Calculate monthly attendance report
   */
  static async calculateMonthlyAttendance(employeeId: string, month: Date = new Date()) {
    try {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const sessions = await prisma.workSession.findMany({
        where: {
          employeeId,
          date: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });

      const workDays = 22; // Approximate working days per month
      const presentDays = new Set(sessions.map(s => s.date.toDateString())).size;
      const absentDays = workDays - presentDays;
      const totalHours = sessions.reduce((sum, s) => sum + s.durationHours, 0);
      const attendanceRate = (presentDays / workDays) * 100;

      // Create or update attendance report
      const monthYear = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;

      const report = await prisma.attendanceReport.upsert({
        where: {
          employeeId_date: {
            employeeId,
            date: monthStart
          }
        },
        update: {
          presentDays,
          absentDays,
          totalHours,
          attendanceRate
        },
        create: {
          employeeId,
          email: sessions[0]?.email || 'unknown@company.com',
          department: sessions[0]?.department || 'Unknown',
          date: monthStart,
          presentDays,
          absentDays,
          totalHours,
          attendanceRate,
          monthYear
        }
      });

      return report;
    } catch (error) {
      console.error('Error calculating monthly attendance:', error);
      throw error;
    }
  }

  /**
   * Get attendance report for employee
   */
  static async getAttendanceReport(employeeId: string, months: number = 3) {
    try {
      const reports = await prisma.attendanceReport.findMany({
        where: {
          employeeId
        },
        orderBy: { date: 'desc' },
        take: months
      });

      return {
        employeeId,
        months,
        reports
      };
    } catch (error) {
      console.error('Error getting attendance report:', error);
      throw error;
    }
  }

  // ==================== SUPERADMIN ANALYTICS ====================

  /**
   * Get comprehensive dashboard data for SuperAdmin
   */
  static async getSuperAdminDashboard() {
    try {
      const today = startOfDay(new Date());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Real-time stats
      const onlineCount = await prisma.employeeTracking.count({
        where: {
          status: 'ONLINE',
          logoutTime: null
        }
      });

      const offlineCount = await prisma.employeeTracking.count({
        where: {
          status: 'OFFLINE'
        }
      });

      // Today's stats
      const todayLogins = await prisma.workSession.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      const todayHours = await prisma.workSession.aggregate({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        },
        _sum: {
          durationHours: true
        },
        _avg: {
          durationHours: true
        }
      });

      // Department breakdown
      const departmentStats = await this.getAllDepartmentsStats();

      // Recent activity
      const recentActivity = await prisma.adminActivityLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 20,
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

      // Top performers (by hours)
      const topPerformers = await prisma.workSession.groupBy({
        by: ['employeeId', 'email'],
        _sum: {
          durationHours: true
        },
        orderBy: {
          _sum: {
            durationHours: 'desc'
          }
        },
        take: 10
      });

      return {
        realtime: {
          onlineEmployees: onlineCount,
          offlineEmployees: offlineCount,
          totalEmployees: onlineCount + offlineCount
        },
        today: {
          logins: todayLogins,
          totalHours: (todayHours._sum.durationHours || 0).toFixed(2),
          averageHours: (todayHours._avg.durationHours || 0).toFixed(2)
        },
        departmentStats,
        topPerformers: topPerformers.map(p => ({
          employeeId: p.employeeId,
          email: p.email,
          totalHours: (p._sum.durationHours || 0).toFixed(2)
        })),
        recentActivity
      };
    } catch (error) {
      console.error('Error getting superadmin dashboard:', error);
      throw error;
    }
  }

  /**
   * Export tracking data for reports
   */
  static async exportTrackingData(startDate: Date, endDate: Date, format: 'json' | 'csv' = 'json') {
    try {
      const data = await prisma.workSession.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'desc' }
      });

      if (format === 'csv') {
        return this.convertToCSV(data);
      }

      return {
        startDate,
        endDate,
        count: data.length,
        data
      };
    } catch (error) {
      console.error('Error exporting tracking data:', error);
      throw error;
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Calculate duration between two dates
   */
  private static calculateDuration(loginTime: Date): string {
    const now = new Date();
    const diff = now.getTime() - loginTime.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  /**
   * Convert data to CSV format
   */
  private static convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return csv;
  }

  /**
   * Validate employee data
   */
  static validateEmployeeData(data: any): boolean {
    const required = ['employeeId', 'email', 'department'];
    return required.every(field => field in data && data[field]);
  }

  /**
   * Get employee summary
   */
  static async getEmployeeSummary(employeeId: string) {
    try {
      const current = await this.getCurrentSession(employeeId);
      const todayStats = await prisma.workSession.aggregate({
        where: {
          employeeId,
          date: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date())
          }
        },
        _sum: {
          durationHours: true
        }
      });

      const monthStats = await prisma.workSession.aggregate({
        where: {
          employeeId,
          date: {
            gte: startOfMonth(new Date()),
            lte: endOfMonth(new Date())
          }
        },
        _sum: {
          durationHours: true
        }
      });

      return {
        employeeId,
        currentSession: current,
        todayHours: (todayStats._sum.durationHours || 0).toFixed(2),
        monthHours: (monthStats._sum.durationHours || 0).toFixed(2)
      };
    } catch (error) {
      console.error('Error getting employee summary:', error);
      throw error;
    }
  }
}

export default EmployeeTrackingService;