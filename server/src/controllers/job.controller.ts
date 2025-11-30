// src/controllers/job.controller.ts - FIXED VERSION
import { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/job.service';
import { CreateJobInput, UpdateJobInput, CreateApplicationInput, UpdateApplicationInput } from '../validators/job.validation';

export class JobController {
  /**
   * @route   POST /api/admin/jobs
   * @desc    Create a new job posting
   * @access  Admin
   */
  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id; // Non-null assertion - auth middleware ensures user exists
      const data: CreateJobInput = req.body;

      const job = await jobService.createJob(data, userId);

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   PUT /api/admin/jobs/:id
   * @desc    Update a job posting
   * @access  Admin
   */
  async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const data: UpdateJobInput = req.body;

      const job = await jobService.updateJob(id, data, userId);

      res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: job,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/admin/jobs
   * @desc    Get all jobs with filters and pagination
   * @access  Admin
   */
  async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const result = await jobService.getJobs(req.query as any, userId);

      res.status(200).json({
        success: true,
        data: result.jobs,
        pagination: result.pagination,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/admin/jobs/:id
   * @desc    Get a single job by ID
   * @access  Admin
   */
  async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const includeApplications = req.query.includeApplications === 'true';

      const job = await jobService.getJobById(id, includeApplications);

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   DELETE /api/admin/jobs/:id
   * @desc    Delete a job posting
   * @access  Admin
   */
  async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await jobService.deleteJob(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   PATCH /api/admin/jobs/:id/publish
   * @desc    Publish or unpublish a job
   * @access  Admin
   */
  async togglePublish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      const job = await jobService.togglePublish(id, isPublished);

      res.status(200).json({
        success: true,
        message: isPublished ? 'Job published successfully' : 'Job unpublished successfully',
        data: job,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   PATCH /api/admin/jobs/:id/status
   * @desc    Update job status
   * @access  Admin
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const job = await jobService.updateStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Job status updated successfully',
        data: job,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/admin/jobs/stats/dashboard
   * @desc    Get job dashboard statistics
   * @access  Admin
   */
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await jobService.getDashboardStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // ==================== PUBLIC ROUTES ====================

  /**
   * @route   GET /api/jobs
   * @desc    Get published jobs for public careers page
   * @access  Public
   */
  async getPublicJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        ...req.query,
        status: 'ACTIVE',
        isPublished: true,
      };

      const result = await jobService.getJobs(query as any);

      res.status(200).json({
        success: true,
        data: result.jobs,
        pagination: result.pagination,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/jobs/:slug
   * @desc    Get a single published job by slug
   * @access  Public
   */
  async getPublicJobBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const job = await jobService.getJobBySlug(slug);

      // Track the view
      const viewData = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'],
      };

      await jobService.trackJobView(job.id, viewData);

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // ==================== APPLICATION ROUTES ====================

  /**
   * @route   POST /api/jobs/:jobId/apply
   * @desc    Submit a job application (public)
   * @access  Public
   */
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const data: CreateApplicationInput = {
        ...req.body,
        jobId,
      };

      // Add tracking data
      data.source = data.source || 'Company Website';
      (data as any).ipAddress = req.ip || req.socket.remoteAddress;
      (data as any).userAgent = req.headers['user-agent'];

      const application = await jobService.createApplication(data);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: application,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/admin/applications
   * @desc    Get all job applications with filters
   * @access  Admin
   */
  async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await jobService.getApplications(req.query);

      res.status(200).json({
        success: true,
        data: result.applications,
        pagination: result.pagination,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/admin/applications/:id
   * @desc    Get a single application by ID
   * @access  Admin
   */
  async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const application = await jobService.getApplicationById(id);

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   PUT /api/admin/applications/:id
   * @desc    Update an application (review, status change, etc.)
   * @access  Admin
   */
  async updateApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const data: UpdateApplicationInput = req.body;

      const application = await jobService.updateApplication(id, data, userId);

      res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: application,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   DELETE /api/admin/applications/:id
   * @desc    Delete an application
   * @access  Admin
   */
  async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await jobService.deleteApplication(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/admin/applications/stats/overview
   * @desc    Get application statistics
   * @access  Admin
   */
  async getApplicationStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.query;
      const stats = await jobService.getApplicationStats(jobId as string);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @route   GET /api/admin/jobs/:id/applications
   * @desc    Get all applications for a specific job
   * @access  Admin
   */
  async getJobApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const query = { ...req.query, jobId: id };
      
      const result = await jobService.getApplications(query);

      res.status(200).json({
        success: true,
        data: result.applications,
        pagination: result.pagination,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const jobController = new JobController();