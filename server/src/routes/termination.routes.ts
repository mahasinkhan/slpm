// src/routes/termination.routes.ts
import { Router } from 'express';
import terminationController from '../controllers/termination.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/roleCheck.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Terminate employee - SuperAdmin only
router.post(
  '/',
  checkRole(Role.SUPERADMIN),
  (req, res) => terminationController.terminateEmployee(req, res)
);

// Get all terminations - Admin and SuperAdmin
router.get(
  '/',
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  (req, res) => terminationController.getAllTerminations(req, res)
);

// Get termination by ID - Admin and SuperAdmin
router.get(
  '/:id',
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  (req, res) => terminationController.getTerminationById(req, res)
);

// Delete termination - SuperAdmin only
router.delete(
  '/:id',
  checkRole(Role.SUPERADMIN),
  (req, res) => terminationController.deleteTermination(req, res)
);

export default router;