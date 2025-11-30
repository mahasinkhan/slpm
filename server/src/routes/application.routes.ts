// src/routes/application.routes.ts
import { Router } from 'express';
import { applicationController } from '../controllers/application.controller';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// ==================== ADMIN APPLICATION ROUTES ====================

/**
 * @route   GET /api/admin/applications
 * @desc    Get all job applications with filters
 * @access  Admin only
 */
router.get(
  '/',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.getApplications.bind(applicationController)
);

/**
 * @route   GET /api/admin/applications/stats/overview
 * @desc    Get application statistics
 * @access  Admin only
 */
router.get(
  '/stats/overview',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.getStats.bind(applicationController)
);

/**
 * @route   GET /api/admin/applications/export
 * @desc    Export applications to CSV
 * @access  Admin only
 */
router.get(
  '/export',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.exportApplications.bind(applicationController)
);

/**
 * @route   PATCH /api/admin/applications/bulk
 * @desc    Bulk update applications
 * @access  Admin only
 */
router.patch(
  '/bulk',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.bulkUpdate.bind(applicationController)
);

/**
 * @route   GET /api/admin/applications/:id
 * @desc    Get a single application by ID
 * @access  Admin only
 */
router.get(
  '/:id',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.getApplicationById.bind(applicationController)
);

/**
 * @route   PUT /api/admin/applications/:id
 * @desc    Update an application (full review)
 * @access  Admin only
 */
router.put(
  '/:id',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.submitReview.bind(applicationController)
);

/**
 * @route   PATCH /api/admin/applications/:id/status
 * @desc    Update application status only
 * @access  Admin only
 */
router.patch(
  '/:id/status',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.updateStatus.bind(applicationController)
);

/**
 * @route   PATCH /api/admin/applications/:id/rating
 * @desc    Update application rating only
 * @access  Admin only
 */
router.patch(
  '/:id/rating',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.updateRating.bind(applicationController)
);

/**
 * @route   POST /api/admin/applications/:id/notes
 * @desc    Add a note to an application
 * @access  Admin only
 */
router.post(
  '/:id/notes',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.addNote.bind(applicationController)
);

/**
 * @route   GET /api/admin/applications/:id/notes
 * @desc    Get all notes for an application
 * @access  Admin only
 */
router.get(
  '/:id/notes',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.getNotes.bind(applicationController)
);

/**
 * @route   POST /api/admin/applications/:id/review
 * @desc    Submit a full review for an application
 * @access  Admin only
 */
router.post(
  '/:id/review',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.submitReview.bind(applicationController)
);

/**
 * @route   GET /api/admin/applications/:id/timeline
 * @desc    Get application timeline/history
 * @access  Admin only
 */
router.get(
  '/:id/timeline',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.getTimeline.bind(applicationController)
);

/**
 * @route   DELETE /api/admin/applications/:id
 * @desc    Delete an application
 * @access  Admin only
 */
router.delete(
  '/:id',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  applicationController.deleteApplication.bind(applicationController)
);

export default router;