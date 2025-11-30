// src/controllers/application.controller.ts
import { Request, Response, NextFunction } from 'express';
import { applicationService } from '../services/application.service';

class ApplicationController {
  /**
   * Get all applications with filtering, pagination, and search
   * GET /api/admin/applications
   */
  async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = '1',
        limit = '10',
        status,
        jobId,
        department,
        minRating,
        startDate,
        endDate,
        search,
        sortBy = 'appliedAt',
        sortOrder = 'desc',
      } = req.query;

      const filters = {
        status: status as string,
        jobId: jobId as string,
        department: department as string,
        minRating: minRating ? parseInt(minRating as string) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        search: search as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const sorting = {
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await applicationService.getApplications(filters, pagination, sorting);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get single application by ID
   * GET /api/admin/applications/:id
   */
  async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const application = await applicationService.getApplicationById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found',
        });
      }

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update application status
   * PATCH /api/admin/applications/:id/status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user!.id;

      const application = await applicationService.updateStatus(id, status, userId);

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: application,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update application rating
   * PATCH /api/admin/applications/:id/rating
   */
  async updateRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      const userId = req.user!.id;

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Rating must be between 1 and 5',
        });
      }

      const application = await applicationService.updateRating(id, rating, userId);

      res.status(200).json({
        success: true,
        message: 'Application rating updated successfully',
        data: application,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Add note to application
   * POST /api/admin/applications/:id/notes
   */
  async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user!.id;

      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Note content is required',
        });
      }

      const note = await applicationService.addNote(id, content, userId);

      res.status(201).json({
        success: true,
        message: 'Note added successfully',
        data: note,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get application notes
   * GET /api/admin/applications/:id/notes
   */
  async getNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const notes = await applicationService.getNotes(id);

      res.status(200).json({
        success: true,
        data: notes,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Submit application review
   * POST /api/admin/applications/:id/review
   */
  async submitReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reviewData = req.body;
      const userId = req.user!.id;

      const application = await applicationService.submitReview(id, reviewData, userId);

      res.status(200).json({
        success: true,
        message: 'Review submitted successfully',
        data: application,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get application timeline/history
   * GET /api/admin/applications/:id/timeline
   */
  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const timeline = await applicationService.getTimeline(id);

      res.status(200).json({
        success: true,
        data: timeline,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get application statistics/analytics
   * GET /api/admin/applications/stats/overview
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, startDate, endDate } = req.query;

      const filters = {
        jobId: jobId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };

      const stats = await applicationService.getStats(filters);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Bulk update applications
   * PATCH /api/admin/applications/bulk
   */
  async bulkUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationIds, status, action } = req.body;
      const userId = req.user!.id;

      if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Application IDs are required',
        });
      }

      const result = await applicationService.bulkUpdate(applicationIds, { status, action }, userId);

      res.status(200).json({
        success: true,
        message: `${result.count} applications updated successfully`,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Delete application
   * DELETE /api/admin/applications/:id
   */
  async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await applicationService.deleteApplication(id);

      res.status(200).json({
        success: true,
        message: 'Application deleted successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Export applications to CSV
   * GET /api/admin/applications/export
   */
  async exportApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, status, startDate, endDate } = req.query;

      const filters = {
        jobId: jobId as string,
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };

      const csvData = await applicationService.exportApplications(filters);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
      res.status(200).send(csvData);
    } catch (error: any) {
      next(error);
    }
  }
}

export const applicationController = new ApplicationController();