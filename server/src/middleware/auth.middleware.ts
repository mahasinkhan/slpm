// server/src/middleware/auth.middleware.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt.util';
import { Role } from '@prisma/client';

/**
 * Authenticate user with JWT token
 * Usage: router.get('/protected', authenticateToken, handler)
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

/**
 * Verify user has SuperAdmin role
 * Usage: router.get('/admin', authenticateToken, verifySuperAdmin, handler)
 */
export const verifySuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== Role.SUPERADMIN) {
    res.status(403).json({
      success: false,
      message: 'Access denied. SuperAdmin privileges required'
    });
    return;
  }

  next();
};

/**
 * Authorize specific roles
 * Usage: router.get('/resource', authenticateToken, authorize([Role.ADMIN, Role.SUPERADMIN]), handler)
 */
export const authorize = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export default { authenticateToken, verifySuperAdmin, authorize };