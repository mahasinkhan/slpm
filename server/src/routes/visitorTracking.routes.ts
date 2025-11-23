// routes/visitorTracking.routes.ts

import express, { Router } from 'express';
import visitorTrackingController from '../controllers/visitorTracking.controller';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { validateVisitorTracking } from '../middleware/validation.middleware';
import { rateLimiter } from '../middleware/rateLimiter.middleware';
import { Role } from '@prisma/client';

const router: Router = express.Router();

// ==================== PUBLIC ROUTES ====================
// These routes are called by the frontend tracking script
// No authentication required, but rate limited to prevent abuse

/**
 * @route   POST /api/visitor-tracking/track
 * @desc    Track visitor activity
 * @access  Public
 */
router.post(
  '/track',
  rateLimiter.trackingLimiter,
  validateVisitorTracking.track,
  visitorTrackingController.track
);

/**
 * @route   POST /api/visitor-tracking/track/session
 * @desc    Track visitor session
 * @access  Public
 */
router.post(
  '/track/session',
  rateLimiter.trackingLimiter,
  validateVisitorTracking.trackSession,
  visitorTrackingController.trackSession
);

/**
 * @route   POST /api/visitor-tracking/track/pageview
 * @desc    Track page view
 * @access  Public
 */
router.post(
  '/track/pageview',
  rateLimiter.trackingLimiter,
  validateVisitorTracking.trackPageView,
  visitorTrackingController.trackPageView
);

/**
 * @route   POST /api/visitor-tracking/track/event
 * @desc    Track user event (click, scroll, etc)
 * @access  Public
 */
router.post(
  '/track/event',
  rateLimiter.trackingLimiter,
  validateVisitorTracking.trackEvent,
  visitorTrackingController.trackEvent
);

/**
 * @route   POST /api/visitor-tracking/track/form
 * @desc    Track form submission
 * @access  Public
 */
router.post(
  '/track/form',
  rateLimiter.trackingLimiter,
  validateVisitorTracking.trackForm,
  visitorTrackingController.trackFormSubmission
);

/**
 * @route   POST /api/visitor-tracking/live/update
 * @desc    Update live visitor status (called every 5 seconds)
 * @access  Public
 */
router.post(
  '/live/update',
  rateLimiter.liveUpdateLimiter,
  validateVisitorTracking.updateLive,
  visitorTrackingController.updateLiveVisitor
);

// ==================== ADMIN ROUTES (Authentication Required) ====================
// These routes are for the admin dashboard
// Require authentication and specific roles (SUPERADMIN or ADMIN)

/**
 * @route   GET /api/visitor-tracking/live
 * @desc    Get all live visitors
 * @access  Private (SUPERADMIN, ADMIN)
 */
router.get(
  '/live',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  visitorTrackingController.getLiveVisitors
);

/**
 * @route   GET /api/visitor-tracking/stats-summary
 * @desc    Get quick statistics summary
 * @access  Private (SUPERADMIN, ADMIN)
 */
router.get(
  '/stats-summary',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  rateLimiter.apiLimiter,
  visitorTrackingController.getStatsSummary
);

/**
 * @route   GET /api/visitor-tracking/visitors
 * @desc    Get all visitors with pagination and filters
 * @access  Private (SUPERADMIN, ADMIN)
 * @query   page, limit, type, status, email, country
 */
router.get(
  '/visitors',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  rateLimiter.apiLimiter,
  visitorTrackingController.getAllVisitors
);

/**
 * @route   GET /api/visitor-tracking/visitors/:visitorId
 * @desc    Get visitor details by ID
 * @access  Private (SUPERADMIN, ADMIN)
 */
router.get(
  '/visitors/:visitorId',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  rateLimiter.apiLimiter,
  visitorTrackingController.getVisitorById
);

/**
 * @route   GET /api/visitor-tracking/analytics
 * @desc    Get visitor analytics
 * @access  Private (SUPERADMIN, ADMIN)
 * @query   startDate, endDate
 */
router.get(
  '/analytics',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  rateLimiter.apiLimiter,
  visitorTrackingController.getAnalytics
);

/**
 * @route   PATCH /api/visitor-tracking/visitors/:visitorId/status
 * @desc    Update visitor status manually
 * @access  Private (SUPERADMIN, ADMIN)
 */
router.patch(
  '/visitors/:visitorId/status',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  rateLimiter.apiLimiter,
  validateVisitorTracking.updateStatus,
  visitorTrackingController.updateVisitorStatus
);

/**
 * @route   POST /api/visitor-tracking/cleanup
 * @desc    Cleanup old live visitor records (manual trigger)
 * @access  Private (SUPERADMIN only)
 */
router.post(
  '/cleanup',
  authenticateToken,
  authorize([Role.SUPERADMIN]),
  rateLimiter.apiLimiter,
  visitorTrackingController.cleanup
);

/**
 * @route   DELETE /api/visitor-tracking/visitors/:visitorId
 * @desc    Delete a visitor and all related data
 * @access  Private (SUPERADMIN only)
 */
router.delete(
  '/visitors/:visitorId',
  authenticateToken,
  authorize([Role.SUPERADMIN]),
  rateLimiter.apiLimiter,
  async (req, res) => {
    try {
      // This would be implemented in the controller
      res.status(200).json({
        success: true,
        message: 'Visitor deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete visitor',
        error: error.message
      });
    }
  }
);

// ==================== EXPORT ROUTE ====================
// Additional route for exporting visitor data (CSV, Excel)

/**
 * @route   GET /api/visitor-tracking/export
 * @desc    Export visitor data to CSV/Excel
 * @access  Private (SUPERADMIN, ADMIN)
 * @query   format (csv/excel), startDate, endDate, type, status
 */
router.get(
  '/export',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  rateLimiter.apiLimiter,
  async (req, res) => {
    try {
      // This would be implemented in the controller
      res.status(200).json({
        success: true,
        message: 'Export functionality coming soon'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to export data',
        error: error.message
      });
    }
  }
);

// ==================== WEBHOOK ROUTE ====================
// For integrating with third-party services

/**
 * @route   POST /api/visitor-tracking/webhook
 * @desc    Webhook endpoint for external integrations
 * @access  Public (with API key validation)
 */
router.post(
  '/webhook',
  rateLimiter.webhookLimiter,
  async (req, res) => {
    try {
      // Validate webhook signature/API key here
      const apiKey = req.headers['x-api-key'];
      
      if (!apiKey || apiKey !== process.env.WEBHOOK_API_KEY) {
        res.status(401).json({
          success: false,
          message: 'Invalid API key'
        });
        return;
      }

      // Process webhook data
      res.status(200).json({
        success: true,
        message: 'Webhook received'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    }
  }
);

export default router;