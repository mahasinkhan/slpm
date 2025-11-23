// src/routes/contact.routes.ts
import { Router } from 'express';
import contactController from '../controllers/contact.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/roleCheck.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public route - anyone can submit contact form
router.post('/', (req, res) => contactController.createContact(req, res));

// Protected routes - Admin and SuperAdmin only
router.get(
  '/',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  (req, res) => contactController.getAllContacts(req, res)
);

router.get(
  '/:id',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  (req, res) => contactController.getContactById(req, res)
);

router.patch(
  '/:id/respond',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  (req, res) => contactController.markAsResponded(req, res)
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(Role.SUPERADMIN),
  (req, res) => contactController.deleteContact(req, res)
);

export default router;