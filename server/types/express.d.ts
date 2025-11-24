import { RateLimitInfo } from 'express-rate-limit';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      rateLimit: RateLimitInfo;
      user?: {
        id: string;
        email: string;
        role: Role;
        firstName: any;
        lastName: any;
        avatar: null;
      };
      visitorId?: string;
    }
  }
}

export {};