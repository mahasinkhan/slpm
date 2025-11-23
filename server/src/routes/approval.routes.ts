// src/routes/approval.routes.ts
import { Router } from 'express';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import * as approvalController from '../controllers/approval.controller';
import { validateApproval, validateDecision } from '../validators/approval.validator';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get approval statistics
router.get('/stats', approvalController.getApprovalStats);

// Get all approvals (with filters)
router.get('/', approvalController.getApprovals);

// Get single approval
router.get('/:id', approvalController.getApprovalById);

// Create new approval
router.post('/', validateApproval, approvalController.createApproval);

// Update approval (only pending ones)
router.patch('/:id', validateApproval, approvalController.updateApproval);

// Make decision on approval (admin only)
router.patch(
  '/:id/decision',
  authorize(['ADMIN', 'SUPERADMIN']),
  validateDecision,
  approvalController.makeDecision
);

// Delete approval
router.delete('/:id', approvalController.deleteApproval);

// Bulk operations (admin only)
router.post(
  '/bulk/approve',
  authorize(['ADMIN', 'SUPERADMIN']),
  approvalController.bulkApprove
);

router.post(
  '/bulk/reject',
  authorize(['ADMIN', 'SUPERADMIN']),
  approvalController.bulkReject
);

export default router;