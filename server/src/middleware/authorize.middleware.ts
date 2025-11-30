import { Request, Response, NextFunction } from 'express';

/**
 * Authorization middleware to check if user has required role
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You do not have permission to perform this action.',
      });
    }

    next();
  };
};

/**
 * Check if user is the resource owner or has admin privileges
 * @param getResourceOwnerId - Function to extract the owner ID from the request
 */
export const authorizeOwnerOrAdmin = (getResourceOwnerId: (req: Request) => Promise<string | null>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      // Admins and superadmins can access any resource
      if (['ADMIN', 'SUPERADMIN'].includes(req.user.role)) {
        return next();
      }

      // Get the resource owner ID
      const ownerId = await getResourceOwnerId(req);

      if (!ownerId) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
      }

      // Check if user is the owner
      if (req.user.id !== ownerId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only access your own resources.',
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        error: 'Authorization failed',
      });
    }
  };
};