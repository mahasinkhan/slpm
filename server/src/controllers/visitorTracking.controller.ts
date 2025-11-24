// controllers/visitorTracking.controller.ts

import { Request, Response } from 'express';
import visitorTrackingService from '../services/visitorTracking.service';
import { VisitorType, VisitorStatus } from '@prisma/client';
import { AuthRequest } from '../types';

class VisitorTrackingController {
  /**
   * Track visitor - Called by frontend tracking script
   * PUBLIC ROUTE - No authentication required
   */
  async track(req: Request, res: Response): Promise<void> {
    try {
      const {
        visitorId,
        page,
        referrer,
        utmParams,
        email,
        name,
        phone,
        company,
        position,
        screenResolution
      } = req.body;

      // Validate required fields
      if (!visitorId || !page) {
        res.status(400).json({
          success: false,
          message: 'visitorId and page are required'
        });
        return;
      }

      // Extract IP address from request
      const ipAddress = (
        req.ip || 
        req.headers['x-forwarded-for']?.toString().split(',')[0] || 
        req.socket.remoteAddress || 
        'unknown'
      ).trim();
      
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const visitor = await visitorTrackingService.trackVisitor({
        visitorId,
        ipAddress,
        userAgent,
        referrer,
        utmParams,
        page,
        email,
        name,
        phone,
        company,
        position,
        screenResolution
      });

      res.status(200).json({
        success: true,
        message: 'Visitor tracked successfully',
        visitor: {
          id: visitor.id,
          visitorId: visitor.visitorId,
          type: visitor.type,
          status: visitor.status
        }
      });
    } catch (error: any) {
      console.error('Track visitor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track visitor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Track session
   * PUBLIC ROUTE - No authentication required
   */
  async trackSession(req: Request, res: Response): Promise<void> {
    try {
      const { visitorId, sessionId, entryPage, exitPage, endTime, isActive } = req.body;

      // Validate required fields
      if (!visitorId || !sessionId || !entryPage) {
        res.status(400).json({
          success: false,
          message: 'visitorId, sessionId, and entryPage are required'
        });
        return;
      }

      const ipAddress = (
        req.ip || 
        req.headers['x-forwarded-for']?.toString().split(',')[0] || 
        req.socket.remoteAddress || 
        'unknown'
      ).trim();
      
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const session = await visitorTrackingService.trackSession({
        visitorId,
        sessionId,
        ipAddress,
        userAgent,
        entryPage,
        exitPage,
        endTime: endTime ? new Date(endTime) : undefined,
        isActive
      });

      res.status(200).json({
        success: true,
        message: 'Session tracked successfully',
        session: {
          id: session.id,
          sessionId: session.sessionId,
          isActive: session.isActive
        }
      });
    } catch (error: any) {
      console.error('Track session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Track page view
   * PUBLIC ROUTE - No authentication required
   */
  async trackPageView(req: Request, res: Response): Promise<void> {
    try {
      const {
        visitorId,
        url,
        title,
        path,
        referrer,
        timeOnPage,
        scrollDepth,
        clicks
      } = req.body;

      // Validate required fields
      if (!visitorId || !url || !path) {
        res.status(400).json({
          success: false,
          message: 'visitorId, url, and path are required'
        });
        return;
      }

      const pageView = await visitorTrackingService.trackPageView({
        visitorId,
        url,
        title,
        path,
        referrer,
        timeOnPage: timeOnPage ? Number(timeOnPage) : undefined,
        scrollDepth: scrollDepth ? Number(scrollDepth) : undefined,
        clicks: clicks ? Number(clicks) : undefined
      });

      res.status(200).json({
        success: true,
        message: 'Page view tracked successfully',
        pageView: {
          id: pageView.id,
          path: pageView.path
        }
      });
    } catch (error: any) {
      console.error('Track page view error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track page view',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Track event (click, scroll, hover, etc)
   * PUBLIC ROUTE - No authentication required
   */
  async trackEvent(req: Request, res: Response): Promise<void> {
    try {
      const {
        visitorId,
        eventType,
        eventCategory,
        eventLabel,
        eventValue,
        page,
        element
      } = req.body;

      // Validate required fields
      if (!visitorId || !eventType || !page) {
        res.status(400).json({
          success: false,
          message: 'visitorId, eventType, and page are required'
        });
        return;
      }

      const event = await visitorTrackingService.trackEvent({
        visitorId,
        eventType,
        eventCategory,
        eventLabel,
        eventValue,
        page,
        element
      });

      res.status(200).json({
        success: true,
        message: 'Event tracked successfully',
        event: {
          id: event.id,
          eventType: event.eventType
        }
      });
    } catch (error: any) {
      console.error('Track event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track event',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Track form submission
   * PUBLIC ROUTE - No authentication required
   */
  async trackFormSubmission(req: Request, res: Response): Promise<void> {
    try {
      const {
        visitorId,
        formType,
        formName,
        page,
        email,
        name,
        phone,
        company,
        message,
        customFields
      } = req.body;

      // Validate required fields
      if (!visitorId || !formType || !page) {
        res.status(400).json({
          success: false,
          message: 'visitorId, formType, and page are required'
        });
        return;
      }

      const submission = await visitorTrackingService.trackFormSubmission({
        visitorId,
        formType,
        formName,
        page,
        email,
        name,
        phone,
        company,
        message,
        customFields
      });

      res.status(200).json({
        success: true,
        message: 'Form submission tracked successfully',
        submission: {
          id: submission.id,
          formType: submission.formType,
          isProcessed: submission.isProcessed
        }
      });
    } catch (error: any) {
      console.error('Track form submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track form submission',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update live visitor (called every 5 seconds by tracking script)
   * PUBLIC ROUTE - No authentication required
   */
  async updateLiveVisitor(req: Request, res: Response): Promise<void> {
    try {
      const {
        visitorId,
        currentPage,
        pageTitle,
        isActive,
        email,
        name,
        timeOnSite,
        pageViews
      } = req.body;

      // Validate required fields
      if (!visitorId || !currentPage) {
        res.status(400).json({
          success: false,
          message: 'visitorId and currentPage are required'
        });
        return;
      }

      const ipAddress = (
        req.ip || 
        req.headers['x-forwarded-for']?.toString().split(',')[0] || 
        req.socket.remoteAddress || 
        'unknown'
      ).trim();
      
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const liveVisitor = await visitorTrackingService.updateLiveVisitor({
        visitorId,
        currentPage,
        pageTitle,
        isActive: isActive !== undefined ? isActive : true,
        email,
        name,
        ipAddress,
        userAgent,
        timeOnSite: timeOnSite ? Number(timeOnSite) : undefined,
        pageViews: pageViews ? Number(pageViews) : undefined
      });

      res.status(200).json({
        success: true,
        message: 'Live visitor updated successfully',
        liveVisitor: {
          visitorId: liveVisitor.visitorId,
          isActive: liveVisitor.isActive
        }
      });
    } catch (error: any) {
      console.error('Update live visitor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update live visitor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get live visitors (for admin dashboard)
   * PROTECTED ROUTE - Requires authentication (SUPERADMIN/ADMIN)
   */
  async getLiveVisitors(req: AuthRequest, res: Response): Promise<void> {
    try {
      const liveVisitors = await visitorTrackingService.getLiveVisitors();

      res.status(200).json({
        success: true,
        count: liveVisitors.length,
        visitors: liveVisitors,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Get live visitors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get live visitors',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get visitor by ID with full details
   * PROTECTED ROUTE - Requires authentication (SUPERADMIN/ADMIN)
   */
  async getVisitorById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { visitorId } = req.params;

      if (!visitorId) {
        res.status(400).json({
          success: false,
          message: 'visitorId parameter is required'
        });
        return;
      }

      const visitor = await visitorTrackingService.getVisitorById(visitorId);

      if (!visitor) {
        res.status(404).json({
          success: false,
          message: 'Visitor not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        visitor
      });
    } catch (error: any) {
      console.error('Get visitor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get visitor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get all visitors with pagination and filters
   * PROTECTED ROUTE - Requires authentication (SUPERADMIN/ADMIN)
   */
  async getAllVisitors(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        page = '1',
        limit = '20',
        type,
        status,
        email,
        country
      } = req.query;

      // Validate pagination parameters
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      if (isNaN(pageNum) || pageNum < 1) {
        res.status(400).json({
          success: false,
          message: 'Invalid page number'
        });
        return;
      }

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid limit (must be between 1 and 100)'
        });
        return;
      }

      const filters: any = {};
      if (type) filters.type = type as VisitorType;
      if (status) filters.status = status as VisitorStatus;
      if (email) filters.email = email as string;
      if (country) filters.country = country as string;

      const result = await visitorTrackingService.getAllVisitors(
        pageNum,
        limitNum,
        filters
      );

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error: any) {
      console.error('Get all visitors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get visitors',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get visitor analytics
   * PROTECTED ROUTE - Requires authentication (SUPERADMIN/ADMIN)
   */
  async getAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      // Default to last 7 days if no dates provided
      let start = startDate 
        ? new Date(startDate as string) 
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      let end = endDate 
        ? new Date(endDate as string) 
        : new Date();

      // Validate dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)'
        });
        return;
      }

      if (start > end) {
        res.status(400).json({
          success: false,
          message: 'Start date must be before end date'
        });
        return;
      }

      const analytics = await visitorTrackingService.getVisitorAnalytics(start, end);

      res.status(200).json({
        success: true,
        analytics,
        period: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          days: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        }
      });
    } catch (error: any) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update visitor status manually
   * PROTECTED ROUTE - Requires authentication (SUPERADMIN/ADMIN)
   */
  async updateVisitorStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { visitorId } = req.params;
      const { status } = req.body;

      if (!visitorId) {
        res.status(400).json({
          success: false,
          message: 'visitorId parameter is required'
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'status is required in request body'
        });
        return;
      }

      const validStatuses: VisitorStatus[] = ['ACTIVE', 'IDLE', 'LEFT', 'CONVERTED'];
      
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
        return;
      }

      await visitorTrackingService.updateVisitorStatus(visitorId, status as VisitorStatus);

      res.status(200).json({
        success: true,
        message: 'Visitor status updated successfully',
        visitorId,
        newStatus: status
      });
    } catch (error: any) {
      console.error('Update visitor status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update visitor status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Cleanup old live visitors (cron job or manual trigger)
   * PROTECTED ROUTE - Requires authentication (SUPERADMIN only)
   */
  async cleanup(req: AuthRequest, res: Response): Promise<void> {
    try {
      await visitorTrackingService.cleanupLiveVisitors();

      res.status(200).json({
        success: true,
        message: 'Cleanup completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Cleanup error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get visitor statistics summary
   * PROTECTED ROUTE - Requires authentication (SUPERADMIN/ADMIN)
   */
  async getStatsSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const liveVisitors = await visitorTrackingService.getLiveVisitors();
      
      // Get today's analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayAnalytics = await visitorTrackingService.getVisitorAnalytics(today, tomorrow);

      res.status(200).json({
        success: true,
        summary: {
          liveVisitors: liveVisitors.length,
          todayVisitors: todayAnalytics.totalVisitors,
          todayPageViews: todayAnalytics.totalPageViews,
          todayLeads: todayAnalytics.leadsGenerated,
          avgTimeOnSite: todayAnalytics.avgTimeOnSite
        },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Get stats summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics summary',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

export default new VisitorTrackingController();