import { z } from 'zod';

// Valid application statuses
export const ApplicationStatusEnum = z.enum([
  'NEW',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEWED',
  'OFFER_SENT',
  'HIRED',
  'REJECTED',
  'WITHDRAWN',
]);

// Query parameters for listing applications
export const getApplicationsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  status: ApplicationStatusEnum.optional(),
  jobId: z.string().uuid().optional(),
  department: z.string().optional(),
  minRating: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['appliedAt', 'candidateName', 'status', 'rating']).optional().default('appliedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Update status request
export const updateStatusSchema = z.object({
  status: ApplicationStatusEnum,
});

// Update rating request
export const updateRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

// Add note request
export const addNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000, 'Note is too long'),
});

// Submit review request
export const submitReviewSchema = z.object({
  status: ApplicationStatusEnum,
  rating: z.number().int().min(0).max(5),
  notes: z.string().max(10000).optional().default(''),
  feedback: z.string().max(5000).optional().default(''),
  strengths: z.array(z.string()).optional().default([]),
  weaknesses: z.array(z.string()).optional().default([]),
  recommendation: z.enum(['HIRE', 'REJECT', 'INTERVIEW', 'SHORTLIST', '']).optional().default(''),
});

// Bulk update request
export const bulkUpdateSchema = z.object({
  applicationIds: z.array(z.string().uuid()).min(1, 'At least one application ID is required'),
  status: ApplicationStatusEnum.optional(),
  action: z.string().optional(),
});

// Export query parameters
export const exportQuerySchema = z.object({
  jobId: z.string().uuid().optional(),
  status: ApplicationStatusEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Stats query parameters
export const statsQuerySchema = z.object({
  jobId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Types for use in controllers and services
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;
export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
export type BulkUpdateInput = z.infer<typeof bulkUpdateSchema>;