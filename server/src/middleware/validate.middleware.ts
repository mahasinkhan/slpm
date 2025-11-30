// src/middleware/validate.middleware.ts - FIXED VERSION
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Define the shape of validated data
interface ValidatedData {
  body?: any;
  query?: any;
  params?: any;
}

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as ValidatedData;

      // Replace the original request data with validated data
      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('=== VALIDATION ERROR ===');
        console.error('Request Query:', req.query);
        console.error('Request Body:', req.body);
        console.error('Request Params:', req.params);
        console.error('Zod Errors:', JSON.stringify(error.issues, null, 2));
        console.error('=======================');

        const errors = error.issues.map((err) => {
          // Create error object with proper typing
          const errorObj: {
            field: string;
            message: string;
            received?: any;
          } = {
            field: err.path.join('.'),
            message: err.message,
          };

          // Only add 'received' if it exists (for invalid_type errors)
          if ('received' in err) {
            errorObj.received = (err as any).received;
          }

          return errorObj;
        });

        res.status(400).json({
          success: false,
          message: 'Invalid data provided',
          errors,
        });
        return;
      }
      next(error);
    }
  };
};