// src/routes/job.routes.ts
import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { Role } from '@prisma/client';
import {
  createJobSchema,
  updateJobSchema,
  jobIdParamSchema,
  publishJobSchema,
  updateJobStatusSchema,
  jobQuerySchema,
} from '../validators/job.validation';

const router = Router();

// ==================== ADMIN JOB ROUTES ====================

/**
 * @route   POST /api/admin/jobs
 * @desc    Create a new job posting
 * @access  Admin only
 */
router.post(
  '/',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(createJobSchema),
  jobController.createJob.bind(jobController)
);

/**
 * @route   GET /api/admin/jobs
 * @desc    Get all jobs with filters
 * @access  Admin only
 */
router.get(
  '/',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(jobQuerySchema),
  jobController.getJobs.bind(jobController)
);

/**
 * @route   GET /api/admin/jobs/stats/dashboard
 * @desc    Get job dashboard statistics
 * @access  Admin only
 */
router.get(
  '/stats/dashboard',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  jobController.getDashboardStats.bind(jobController)
);

/**
 * @route   GET /api/admin/jobs/:id
 * @desc    Get a single job by ID
 * @access  Admin only
 */
router.get(
  '/:id',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(jobIdParamSchema),
  jobController.getJobById.bind(jobController)
);

/**
 * @route   PUT /api/admin/jobs/:id
 * @desc    Update a job posting
 * @access  Admin only
 */
router.put(
  '/:id',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(updateJobSchema),
  jobController.updateJob.bind(jobController)
);

/**
 * @route   DELETE /api/admin/jobs/:id
 * @desc    Delete a job posting
 * @access  Admin only
 */
router.delete(
  '/:id',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(jobIdParamSchema),
  jobController.deleteJob.bind(jobController)
);

/**
 * @route   PATCH /api/admin/jobs/:id/publish
 * @desc    Publish or unpublish a job
 * @access  Admin only
 */
router.patch(
  '/:id/publish',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(publishJobSchema),
  jobController.togglePublish.bind(jobController)
);

/**
 * @route   PATCH /api/admin/jobs/:id/status
 * @desc    Update job status (DRAFT, ACTIVE, CLOSED, ARCHIVED)
 * @access  Admin only
 */
router.patch(
  '/:id/status',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(updateJobStatusSchema),
  jobController.updateStatus.bind(jobController)
);

/**
 * @route   GET /api/admin/jobs/:id/applications
 * @desc    Get all applications for a specific job
 * @access  Admin only
 */
router.get(
  '/:id/applications',
  authenticateToken,
  authorize([Role.ADMIN, Role.SUPERADMIN]),
  validate(jobIdParamSchema),
  jobController.getJobApplications.bind(jobController)
);

export default router;