// src/utils/jwt.util.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface JWTPayload {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET is not defined in environment variables!');
  throw new Error('JWT_SECRET must be defined');
}

// Type assertions after validation
const SECRET = JWT_SECRET as string;
const EXPIRY = process.env.JWT_EXPIRY || '7d';

export const generateToken = (payload: JWTPayload): string => {
  try {
    return jwt.sign(payload, SECRET, {
      expiresIn: EXPIRY
    } as SignOptions);
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};