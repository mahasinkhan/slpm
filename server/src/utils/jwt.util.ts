import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-change-in-production';
console.log("✅ Runtime JWT_SECRET:", process.env.JWT_SECRET);

interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};