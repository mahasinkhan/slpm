// src/middleware/roleCheck.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Role } from '@prisma/client';

export const checkRole = (...allowedRoles: Role[]) => {
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
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};