// middleware/rateLimiter.middleware.ts

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiter for visitor tracking endpoints
 * Higher limit since these are called frequently by tracking scripts
 */
const trackingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: {
    success: false,
    message: 'Too many tracking requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many tracking requests from this IP, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime! / 1000)
    });
  }
});

/**
 * Rate limiter for live visitor updates
 * Very high limit since this is called every 5 seconds
 */
const liveUpdateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150, // 150 requests per minute (allows for multiple visitors per IP)
  message: {
    success: false,
    message: 'Too many live update requests'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

/**
 * Rate limiter for admin API endpoints
 * Standard limit for dashboard queries
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many API requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please wait before making more requests.',
      retryAfter: Math.ceil(req.rateLimit.resetTime! / 1000)
    });
  }
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Your account has been temporarily locked.',
      retryAfter: Math.ceil(req.rateLimit.resetTime! / 1000)
    });
  }
});

/**
 * Rate limiter for webhook endpoints
 * Moderate limit for external integrations
 */
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: 'Webhook rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for form submissions
 * Prevents spam and abuse
 */
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 form submissions per hour
  message: {
    success: false,
    message: 'Too many form submissions, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'You have exceeded the form submission limit. Please try again in an hour.',
      retryAfter: Math.ceil(req.rateLimit.resetTime! / 1000)
    });
  }
});

/**
 * Custom rate limiter based on visitor ID
 * Used for tracking specific visitor behavior
 */
const visitorBasedLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
  keyGenerator: (req: Request) => {
    // Use visitorId from body if available, otherwise fall back to IP
    return req.body.visitorId || req.ip || 'unknown';
  },
  message: {
    success: false,
    message: 'Tracking limit exceeded for this visitor'
  }
});

export const rateLimiter = {
  trackingLimiter,
  liveUpdateLimiter,
  apiLimiter,
  authLimiter,
  webhookLimiter,
  formLimiter,
  visitorBasedLimiter
};