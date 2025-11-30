// server/src/middleware/auth.middleware.ts
// Enhanced version with comprehensive debugging

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
    console.log('\n🔐 ===== AUTH MIDDLEWARE START =====');
    console.log('📍 Route:', req.method, req.path);
    console.log('🕐 Timestamp:', new Date().toISOString());
    
    const authHeader = req.headers.authorization;
    console.log('🔑 Auth Header Present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header found');
      res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });
      return;
    }

    const token = authHeader.substring(7);
    console.log('🎫 Token extracted (first 20 chars):', token.substring(0, 20) + '...');

    try {
      const decoded = verifyToken(token);
      
      console.log('🔓 Token decoded:', {
        hasDecoded: !!decoded,
        userId: decoded?.id,
        email: decoded?.email,
        role: decoded?.role,
        firstName: decoded?.firstName,
        lastName: decoded?.lastName
      });
      
      if (!decoded) {
        console.log('❌ Token verification returned null');
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
        return;
      }

      if (!decoded.id) {
        console.log('❌ Token missing user ID');
        res.status(401).json({
          success: false,
          message: 'Invalid token: missing user ID'
        });
        return;
      }
      
      // Assign decoded token to request
      req.user = decoded;
      
      console.log('✅ Authentication successful');
      console.log('👤 User Info:', {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });
      console.log('🔐 ===== AUTH MIDDLEWARE END =====\n');
      
      next();
    } catch (error: any) {
      console.error('❌ Token verification error:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n')[0]
      });
      
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }
  } catch (error: any) {
    console.error('❌ Auth middleware critical error:', {
      message: error.message,
      stack: error.stack
    });
    
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
  console.log('\n🔒 ===== SUPERADMIN CHECK =====');
  console.log('👤 User:', req.user?.email);
  console.log('🎭 Role:', req.user?.role);
  
  if (!req.user) {
    console.log('❌ No user in request');
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== Role.SUPERADMIN) {
    console.log('❌ Not a SuperAdmin:', req.user.role);
    res.status(403).json({
      success: false,
      message: 'Access denied. SuperAdmin privileges required'
    });
    return;
  }

  console.log('✅ SuperAdmin verified');
  console.log('🔒 ===== SUPERADMIN CHECK END =====\n');
  next();
};

/**
 * Authorize specific roles
 * Usage: router.get('/resource', authenticateToken, authorize([Role.ADMIN, Role.SUPERADMIN]), handler)
 */
export const authorize = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log('\n🔐 ===== ROLE AUTHORIZATION =====');
    console.log('👤 User:', req.user?.email);
    console.log('🎭 User Role:', req.user?.role);
    console.log('✅ Allowed Roles:', allowedRoles);
    
    if (!req.user) {
      console.log('❌ No user in request');
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userRole = req.user.role as Role;
    const isAuthorized = allowedRoles.includes(userRole);
    
    console.log('🔍 Authorization check:', {
      userRole,
      allowedRoles,
      isAuthorized
    });

    if (!isAuthorized) {
      console.log('❌ Access denied for role:', userRole);
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
      return;
    }

    console.log('✅ Authorization successful');
    console.log('🔐 ===== ROLE AUTHORIZATION END =====\n');
    next();
  };
};

export default { authenticateToken, verifySuperAdmin, authorize };