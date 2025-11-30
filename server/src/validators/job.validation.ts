// src/validators/job.validation.ts - COMPLETE FIXED VERSION
import { z } from 'zod';

// ==================== JOB VALIDATION SCHEMAS ====================

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    department: z.string().min(2, 'Department is required'),
    location: z.string().min(2, 'Location is required'),
    employmentType: z.string().min(2, 'Employment type is required'),
    experienceLevel: z.string().min(2, 'Experience level is required'),
    
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    salaryCurrency: z.string().default('GBP'),
    
    description: z.string().min(50, 'Description must be at least 50 characters'),
    responsibilities: z.array(z.string()).min(1, 'At least one responsibility is required'),
    requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
    benefits: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    
    applicationDeadline: z.string().datetime().or(z.date()),
    status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED']).default('DRAFT'),
    isPublished: z.boolean().default(false),
    
    slug: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }).refine((data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  }, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salaryMax'],
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    department: z.string().min(2).optional(),
    location: z.string().min(2).optional(),
    employmentType: z.string().min(2).optional(),
    experienceLevel: z.string().min(2).optional(),
    
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    salaryCurrency: z.string().optional(),
    
    description: z.string().min(50).optional(),
    responsibilities: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    
    applicationDeadline: z.string().datetime().or(z.date()).optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED']).optional(),
    isPublished: z.boolean().optional(),
    
    slug: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid job ID'),
  }),
});

export const jobIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid job ID'),
  }),
});

export const publishJobSchema = z.object({
  body: z.object({
    isPublished: z.boolean(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid job ID'),
  }),
});

export const updateJobStatusSchema = z.object({
  body: z.object({
    status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED']),
  }),
  params: z.object({
    id: z.string().uuid('Invalid job ID'),
  }),
});

export const jobQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(val => parseInt(val)),
    limit: z.string().optional().default('10').transform(val => parseInt(val)),
    status: z.string().optional(),
    department: z.string().optional(),
    isPublished: z.string().optional().transform(val => val === 'true'),
    search: z.string().optional(),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// ==================== APPLICATION VALIDATION SCHEMAS ====================

/**
 * FIXED: Application schema with params validation
 * jobId comes from URL params, not body
 */
export const createApplicationSchema = z.object({
  body: z.object({
    candidateName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    location: z.string().optional(),
    
    coverLetter: z.string().max(5000).optional(),
    resumeUrl: z.string().optional(), // Allow any string for resume URLs (Google Drive, Dropbox, etc.)
    portfolioUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    
    yearsExperience: z.number().int().nonnegative().optional(),
    currentCompany: z.string().max(100).optional(),
    currentTitle: z.string().max(100).optional(),
    expectedSalary: z.string().max(50).optional(),
    noticePeriod: z.string().max(50).optional(),
    availability: z.string().max(50).optional(),
    
    questionsAnswers: z.any().optional(), // Allow flexible JSON for custom questions
    source: z.string().optional(),
  }),
  params: z.object({
    jobId: z.string().uuid('Invalid job ID'),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    status: z.enum([
      'NEW',
      'REVIEWING',
      'SHORTLISTED',
      'INTERVIEW_SCHEDULED',
      'INTERVIEWED',
      'OFFER_SENT',
      'HIRED',
      'REJECTED',
      'WITHDRAWN'
    ]).optional(),
    internalNotes: z.string().optional(),
    interviewNotes: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    tags: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid application ID'),
  }),
});

export const applicationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid application ID'),
  }),
});

export const applicationQuerySchema = z.object({
  query: z.object({
    jobId: z.string().uuid().optional(),
    status: z.string().optional(),
    page: z.string().optional().default('1').transform(val => parseInt(val)),
    limit: z.string().optional().default('10').transform(val => parseInt(val)),
    search: z.string().optional(),
    sortBy: z.string().optional().default('appliedAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// ==================== TYPE EXPORTS ====================

export type CreateJobInput = z.infer<typeof createJobSchema>['body'];
export type UpdateJobInput = z.infer<typeof updateJobSchema>['body'];
export type JobQueryInput = z.infer<typeof jobQuerySchema>['query'];

// CreateApplicationInput includes jobId from params
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>['body'] & { 
  jobId: string;
};

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>['body'];
export type ApplicationQueryInput = z.infer<typeof applicationQuerySchema>['query'];