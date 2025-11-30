// src/routes/public-job.routes.ts
import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { validate } from '../middleware/validate.middleware';
import { createApplicationSchema } from '../validators/job.validation';

const router = Router();

// ==================== PUBLIC JOB ROUTES ====================

/**
 * @route   GET /api/jobs
 * @desc    Get all published jobs (for public careers page)
 * @access  Public
 */
router.get(
  '/',
  jobController.getPublicJobs.bind(jobController)
);

/**
 * @route   GET /api/jobs/:slug
 * @desc    Get a single published job by slug
 * @access  Public
 */
router.get(
  '/:slug',
  jobController.getPublicJobBySlug.bind(jobController)
);

/**
 * @route   POST /api/jobs/:jobId/apply
 * @desc    Submit a job application
 * @access  Public
 */
router.post(
  '/:jobId/apply',
  validate(createApplicationSchema),
  jobController.createApplication.bind(jobController)
);

export default router;