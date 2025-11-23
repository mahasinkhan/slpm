import { Router } from 'express';
import employeeController from '../controllers/employee.controller';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get employee statistics (Admin and SuperAdmin)
router.get(
  '/stats',
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  employeeController.getEmployeeStats
);

// Get all employees (Admin and SuperAdmin)
router.get(
  '/',
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  employeeController.getAllEmployees
);

// Get pending approvals (SuperAdmin only)
router.get(
  '/pending',
  authorize([Role.SUPERADMIN]),
  employeeController.getPendingApprovals
);

// Get employee by ID
router.get(
  '/:id',
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  employeeController.getEmployeeById
);

// Approve employee (SuperAdmin only)
router.patch(
  '/:id/approve',
  authorize([Role.SUPERADMIN]),
  employeeController.approveEmployee
);

// Reject employee (SuperAdmin only)
router.delete(
  '/:id/reject',
  authorize([Role.SUPERADMIN]),
  employeeController.rejectEmployee
);

// Update employee status (Admin and SuperAdmin)
router.patch(
  '/:id/status',
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  employeeController.updateEmployeeStatus
);

export default router;