// server/src/routes/employee-tracking.router.ts
// COPY THIS ENTIRE FILE

import { Router } from 'express';
import { authenticateToken, verifySuperAdmin } from '../middleware/auth.middleware';
import {
  loginEmployee,
  logoutEmployee,
  getOnlineEmployees,
  getWorkHistory,
  getCurrentSession,
  getEmployeeSummary,
  getSuperAdminDashboard,
  getActivityLogs,
  getDepartmentStats,
  getProductivityReport,
  getDepartmentPerformance,
  exportTrackingData
} from '../controllers/employee-tracking.controller';

const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * POST /api/tracking/login
 * Employee login endpoint
 * Body: { employeeId, email, department, position?, location?, ipAddress?, deviceInfo? }
 */
router.post('/login', loginEmployee);

/**
 * POST /api/tracking/logout
 * Employee logout endpoint
 * Body: { employeeId, email }
 */
router.post('/logout', logoutEmployee);

/**
 * GET /api/tracking/online-employees
 * Get all currently online employees
 * Query: department? (optional filter by department)
 */
router.get('/online-employees', getOnlineEmployees);

/**
 * GET /api/tracking/work-history/:employeeId
 * Get employee's work history
 * Query: days? (default: 7)
 */
router.get('/work-history/:employeeId', getWorkHistory);

/**
 * GET /api/tracking/current-session/:employeeId
 * Get employee's current active session
 */
router.get('/current-session/:employeeId', getCurrentSession);

/**
 * GET /api/tracking/employee-summary/:employeeId
 * Get employee summary (current session + today/month hours)
 */
router.get('/employee-summary/:employeeId', getEmployeeSummary);

// ==================== SUPERADMIN PROTECTED ROUTES ====================

/**
 * GET /api/tracking/admin/dashboard
 * SuperAdmin dashboard with real-time statistics
 * Requires: SuperAdmin role
 */
router.get(
  '/admin/dashboard',
  authenticateToken,
  verifySuperAdmin,
  getSuperAdminDashboard
);

/**
 * GET /api/tracking/admin/activity-logs
 * Get activity logs with filters
 * Query: limit? (default: 100), action?, startDate?, endDate?
 * Requires: SuperAdmin role
 */
router.get(
  '/admin/activity-logs',
  authenticateToken,
  verifySuperAdmin,
  getActivityLogs
);

/**
 * GET /api/tracking/admin/department-stats
 * Get department statistics
 * Requires: SuperAdmin role
 */
router.get(
  '/admin/department-stats',
  authenticateToken,
  verifySuperAdmin,
  getDepartmentStats
);

/**
 * GET /api/tracking/admin/productivity/:employeeId
 * Get productivity report for an employee
 * Query: daysBack? (default: 30)
 * Requires: SuperAdmin role
 */
router.get(
  '/admin/productivity/:employeeId',
  authenticateToken,
  verifySuperAdmin,
  getProductivityReport
);

/**
 * GET /api/tracking/admin/department-performance/:department
 * Get performance metrics for a department
 * Query: daysBack? (default: 30)
 * Requires: SuperAdmin role
 */
router.get(
  '/admin/department-performance/:department',
  authenticateToken,
  verifySuperAdmin,
  getDepartmentPerformance
);

/**
 * GET /api/tracking/admin/export
 * Export tracking data as JSON or CSV
 * Query: format? (json|csv, default: json), startDate?, endDate?
 * Requires: SuperAdmin role
 */
router.get(
  '/admin/export',
  authenticateToken,
  verifySuperAdmin,
  exportTrackingData
);

export default router;