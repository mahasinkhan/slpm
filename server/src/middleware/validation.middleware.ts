// middleware/validation.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { VisitorStatus } from '@prisma/client';

class ValidationMiddleware {
  /**
   * Validate track visitor request
   */
  track(req: Request, res: Response, next: NextFunction): void {
    const { visitorId, page } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid visitorId is required'
      });
      return;
    }

    if (!page || typeof page !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid page URL is required'
      });
      return;
    }

    // Optional: Validate email format if provided
    if (req.body.email && !this.isValidEmail(req.body.email)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
      return;
    }

    next();
  }

  /**
   * Validate track session request
   */
  trackSession(req: Request, res: Response, next: NextFunction): void {
    const { visitorId, sessionId, entryPage } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid visitorId is required'
      });
      return;
    }

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid sessionId is required'
      });
      return;
    }

    if (!entryPage || typeof entryPage !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid entryPage is required'
      });
      return;
    }

    next();
  }

  /**
   * Validate track page view request
   */
  trackPageView(req: Request, res: Response, next: NextFunction): void {
    const { visitorId, url, path } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid visitorId is required'
      });
      return;
    }

    if (!url || typeof url !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid url is required'
      });
      return;
    }

    if (!path || typeof path !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid path is required'
      });
      return;
    }

    next();
  }

  /**
   * Validate track event request
   */
  trackEvent(req: Request, res: Response, next: NextFunction): void {
    const { visitorId, eventType, page } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid visitorId is required'
      });
      return;
    }

    if (!eventType || typeof eventType !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid eventType is required'
      });
      return;
    }

    if (!page || typeof page !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid page is required'
      });
      return;
    }

    next();
  }

  /**
   * Validate track form submission request
   */
  trackForm(req: Request, res: Response, next: NextFunction): void {
    const { visitorId, formType, page } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid visitorId is required'
      });
      return;
    }

    if (!formType || typeof formType !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid formType is required'
      });
      return;
    }

    if (!page || typeof page !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid page is required'
      });
      return;
    }

    // Validate email if provided
    if (req.body.email && !this.isValidEmail(req.body.email)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
      return;
    }

    next();
  }

  /**
   * Validate update live visitor request
   */
  updateLive(req: Request, res: Response, next: NextFunction): void {
    const { visitorId, currentPage } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid visitorId is required'
      });
      return;
    }

    if (!currentPage || typeof currentPage !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid currentPage is required'
      });
      return;
    }

    next();
  }

  /**
   * Validate update visitor status request
   */
  updateStatus(req: Request, res: Response, next: NextFunction): void {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'status is required'
      });
      return;
    }

    const validStatuses: VisitorStatus[] = ['ACTIVE', 'IDLE', 'LEFT', 'CONVERTED'];
    
    if (!validStatuses.includes(status as VisitorStatus)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
      return;
    }

    next();
  }

  /**
   * Helper: Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Helper: Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Helper: Sanitize string input
   */
  private sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}

export const validateVisitorTracking = new ValidationMiddleware();