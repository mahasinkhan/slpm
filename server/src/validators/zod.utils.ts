// src/validators/zod.utils.ts
import { z } from 'zod';

// Common validation schemas
export const commonSchemas = {
  // UUID validation
  uuid: z.string().uuid({ message: 'Invalid UUID format' }),
  
  // Email validation
  email: z.string()
    .email({ message: 'Invalid email format' })
    .toLowerCase(),
  
  // Phone number validation (UK format)
  phoneUK: z.string()
    .regex(/^(?:(?:\+44\s?|0)(?:\d\s?){10})$/, {
      message: 'Invalid UK phone number format'
    }),
  
  // URL validation
  url: z.string()
    .url({ message: 'Invalid URL format' })
    .optional(),
  
  // Date validation
  isoDate: z.string()
    .datetime({ message: 'Invalid ISO date format' })
    .or(z.date()),
  
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
  }),
  
  // Sort order
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
};

// Query parameter validation helper
export const queryParamSchema = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape).partial();
};

// File upload validation
export const fileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  destination: z.string().optional(),
  filename: z.string().optional(),
  path: z.string().optional(),
  buffer: z.instanceof(Buffer).optional()
});

// Image file validation
export const imageFileSchema = fileSchema.extend({
  mimetype: z.enum([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ])
});

// Document file validation
export const documentFileSchema = fileSchema.extend({
  mimetype: z.enum([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ])
});

// Custom validation helpers
export const zodHelpers = {
  // Non-empty string
  nonEmptyString: (fieldName: string) =>
    z.string()
      .min(1, { message: `${fieldName} cannot be empty` })
      .trim(),
  
  // Optional non-empty string
  optionalNonEmptyString: (fieldName: string) =>
    z.string()
      .min(1, { message: `${fieldName} cannot be empty` })
      .trim()
      .optional()
      .or(z.literal('')),
  
  // String with length constraints
  stringWithLength: (fieldName: string, min: number, max: number) =>
    z.string()
      .min(min, { message: `${fieldName} must be at least ${min} characters` })
      .max(max, { message: `${fieldName} must be at most ${max} characters` })
      .trim(),
  
  // Array with length constraints
  arrayWithLength: <T extends z.ZodTypeAny>(
    schema: T,
    fieldName: string,
    min: number,
    max?: number
  ) => {
    let arraySchema = z.array(schema)
      .min(min, { message: `${fieldName} must have at least ${min} items` });
    
    if (max) {
      arraySchema = arraySchema.max(max, {
        message: `${fieldName} must have at most ${max} items`
      });
    }
    
    return arraySchema;
  },
  
  // Number with range
  numberInRange: (fieldName: string, min: number, max: number) =>
    z.number()
      .min(min, { message: `${fieldName} must be at least ${min}` })
      .max(max, { message: `${fieldName} must be at most ${max}` }),
  
  // Password validation
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
};

// Response type helper
export const createSuccessResponse = <T>(data: T) => ({
  success: true as const,
  data
});

export const createErrorResponse = (error: string, errors?: any[]) => ({
  success: false as const,
  error,
  ...(errors && { errors })
});

// Type guards
export const isZodError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};

// Format Zod errors for API response
export const formatZodErrors = (error: z.ZodError) => {
  return error.issues.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};