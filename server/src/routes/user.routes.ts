import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/roleCheck.middleware';
import { Role } from '@prisma/client';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticateToken);

// IMPORTANT: Specific routes MUST come before parameterized routes
// Otherwise /:id will match /stats and treat "stats" as an ID

// Get user statistics (SUPERADMIN and ADMIN only)
router.get(
  '/stats',
  checkRole(Role.SUPERADMIN, Role.ADMIN),
  (req, res) => userController.getUserStats(req, res)
);

// Get all users (SUPERADMIN and ADMIN only)
router.get(
  '/',
  checkRole(Role.SUPERADMIN, Role.ADMIN),
  (req, res) => userController.getAllUsers(req, res)
);

// Get user by ID (SUPERADMIN and ADMIN only)
router.get(
  '/:id',
  checkRole(Role.SUPERADMIN, Role.ADMIN),
  (req, res) => userController.getUserById(req, res)
);

// Create new user (SUPERADMIN and ADMIN only)
router.post(
  '/',
  checkRole(Role.SUPERADMIN, Role.ADMIN),
  (req, res) => userController.createUser(req, res)
);

// Update user (SUPERADMIN and ADMIN only)
router.put(
  '/:id',
  checkRole(Role.SUPERADMIN, Role.ADMIN),
  (req, res) => userController.updateUser(req, res)
);

// Update user status (SUPERADMIN and ADMIN only)
router.patch(
  '/:id/status',
  checkRole(Role.SUPERADMIN, Role.ADMIN),
  (req, res) => userController.updateUserStatus(req, res)
);

// Update user role (SUPERADMIN only)
router.patch(
  '/:id/role',
  checkRole(Role.SUPERADMIN),
  (req, res) => userController.updateUserRole(req, res)
);

// Hire employee (SUPERADMIN only - after admin approval)
router.patch(
  '/:id/hire',
  checkRole(Role.SUPERADMIN),
  (req, res) => userController.hireEmployee(req, res)
);

// Fire employee (SUPERADMIN only)
router.patch(
  '/:id/fire',
  checkRole(Role.SUPERADMIN),
  (req, res) => userController.fireEmployee(req, res)
);

// Delete user (SUPERADMIN only)
router.delete(
  '/:id',
  checkRole(Role.SUPERADMIN),
  (req, res) => userController.deleteUser(req, res)
);

export default router;