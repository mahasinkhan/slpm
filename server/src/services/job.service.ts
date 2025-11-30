// src/services/job.service.ts - FIXED VERSION
import { PrismaClient, Job, JobApplication, JobStatus, ApplicationStatus, Prisma } from '@prisma/client';
import { CreateJobInput, UpdateJobInput, JobQueryInput, CreateApplicationInput, UpdateApplicationInput } from '../validators/job.validation';

const prisma = new PrismaClient();

export class JobService {
  /**
   * Create a new job posting
   */
  async createJob(data: CreateJobInput, createdById: string) {
    // Generate slug if not provided
    const slug = data.slug || this.generateSlug(data.title);
    
    // Check if slug already exists
    const existingJob = await prisma.job.findUnique({ where: { slug } });
    if (existingJob) {
      throw new Error(`Job with slug "${slug}" already exists`);
    }

    // Calculate completion percentage
    const { completionPercentage, missingFields } = this.calculateCompletion(data);

    // Determine if job should be published
    // Use nullish coalescing (??) to properly handle boolean false
    const shouldPublish = data.isPublished ?? false;
    const jobStatus = data.status ?? 'DRAFT';

    console.log('[JobService.createJob] Creating job with:');
    console.log('  - status:', jobStatus);
    console.log('  - isPublished:', shouldPublish);
    console.log('  - completionPercentage:', completionPercentage);

    // If trying to publish, check completion (but allow if explicitly requested)
    // Only enforce 100% completion for publishing via togglePublish endpoint
    // When creating with isPublished=true, we trust the admin's decision

    // Create the job
    const job = await prisma.job.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency || 'GBP',
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        benefits: data.benefits || [],
        skills: data.skills || [],
        // FIXED: Use the values from the request, not hardcoded defaults
        status: jobStatus,
        isPublished: shouldPublish,
        slug,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        completionPercentage,
        missingFields,
        applicationDeadline: new Date(data.applicationDeadline),
        // Set publishedAt if job is being published
        publishedAt: shouldPublish ? new Date() : null,
        createdBy: {
          connect: { id: createdById }
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    console.log('[JobService.createJob] Job created:');
    console.log('  - id:', job.id);
    console.log('  - status:', job.status);
    console.log('  - isPublished:', job.isPublished);

    return job;
  }

  /**
   * Update an existing job
   */
  async updateJob(id: string, data: UpdateJobInput, userId: string) {
    // Check if job exists
    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      throw new Error('Job not found');
    }

    // If slug is being updated, check for conflicts
    if (data.slug && data.slug !== existingJob.slug) {
      const slugExists = await prisma.job.findUnique({ where: { slug: data.slug } });
      if (slugExists) {
        throw new Error(`Job with slug "${data.slug}" already exists`);
      }
    }

    // Merge existing data with updates for completion calculation
    const mergedData = { ...existingJob, ...data };
    const { completionPercentage, missingFields } = this.calculateCompletion(mergedData);

    // Determine publishedAt based on isPublished change
    let publishedAt = existingJob.publishedAt;
    if (data.isPublished === true && !existingJob.isPublished) {
      publishedAt = new Date();
    } else if (data.isPublished === false) {
      publishedAt = null;
    }

    // Update the job
    const job = await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        benefits: data.benefits,
        skills: data.skills,
        status: data.status,
        isPublished: data.isPublished,
        slug: data.slug,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        completionPercentage,
        missingFields,
        publishedAt,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            applications: true,
            jobViews: true,
          },
        },
      },
    });

    return job;
  }

  /**
   * Get all jobs with filters and pagination
   */
  async getJobs(query: JobQueryInput, userId?: string) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      department, 
      isPublished, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (department) {
      where.department = department;
    }

    // Handle isPublished - check for both boolean and string values
    if (isPublished !== undefined && isPublished !== null) {
      // Convert string 'true'/'false' to boolean if needed
      if (typeof isPublished === 'string') {
        where.isPublished = isPublished === 'true';
      } else {
        where.isPublished = isPublished;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    console.log('[JobService.getJobs] Query params:', { page, limit, status, department, isPublished, search, sortBy, sortOrder });
    console.log('[JobService.getJobs] Where clause:', JSON.stringify(where));

    // Get total count
    const total = await prisma.job.count({ where });

    // Get jobs
    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            applications: true,
            jobViews: true,
          },
        },
      },
    });

    console.log('[JobService.getJobs] Found', jobs.length, 'jobs');

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single job by ID
   */
  async getJobById(id: string, includeApplications: boolean = false) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        applications: includeApplications ? {
          select: {
            id: true,
            applicationId: true,
            candidateName: true,
            email: true,
            phone: true,
            status: true,
            appliedAt: true,
            rating: true,
          },
          orderBy: { appliedAt: 'desc' },
        } : false,
        _count: {
          select: {
            applications: true,
            jobViews: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  /**
   * Get job by slug (for public careers page)
   */
  async getJobBySlug(slug: string) {
    const job = await prisma.job.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            applications: true,
            jobViews: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Only return published jobs
    if (!job.isPublished) {
      throw new Error('Job is not published');
    }

    // Increment view count
    await prisma.job.update({
      where: { id: job.id },
      data: { viewsCount: { increment: 1 } },
    });

    return job;
  }

  /**
   * Delete a job
   */
  async deleteJob(id: string) {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new Error('Job not found');
    }

    await prisma.job.delete({ where: { id } });
    return { message: 'Job deleted successfully' };
  }

  /**
   * Publish/Unpublish a job
   */
  async togglePublish(id: string, isPublished: boolean) {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new Error('Job not found');
    }

    // REMOVED: Completion check - allow publishing regardless of completion
    // The admin should be able to publish if they want to
    // if (isPublished && job.completionPercentage < 100) {
    //   throw new Error('Job must be 100% complete before publishing');
    // }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        isPublished,
        // Also set status to ACTIVE when publishing
        status: isPublished ? 'ACTIVE' : job.status,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    console.log('[JobService.togglePublish] Job updated:');
    console.log('  - id:', updatedJob.id);
    console.log('  - isPublished:', updatedJob.isPublished);
    console.log('  - status:', updatedJob.status);

    return updatedJob;
  }

  /**
   * Update job status
   */
  async updateStatus(id: string, status: JobStatus) {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new Error('Job not found');
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status,
        closedAt: status === 'CLOSED' ? new Date() : null,
        // If setting to ACTIVE, also publish
        isPublished: status === 'ACTIVE' ? true : job.isPublished,
        publishedAt: status === 'ACTIVE' && !job.publishedAt ? new Date() : job.publishedAt,
      },
    });

    return updatedJob;
  }

  /**
   * Get jobs dashboard stats
   */
  async getDashboardStats() {
    const [total, active, draft, closed, totalApplications] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.job.count({ where: { status: 'DRAFT' } }),
      prisma.job.count({ where: { status: 'CLOSED' } }),
      prisma.jobApplication.count(),
    ]);

    // Get recent jobs
    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        department: true,
        status: true,
        applicationsCount: true,
        createdAt: true,
      },
    });

    // Get top performing jobs
    const topJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { applicationsCount: 'desc' },
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        title: true,
        department: true,
        applicationsCount: true,
        viewsCount: true,
      },
    });

    return {
      total,
      active,
      draft,
      closed,
      totalApplications,
      recentJobs,
      topJobs,
    };
  }

  /**
   * Track job view
   */
  async trackJobView(jobId: string, data: any) {
    await prisma.jobView.create({
      data: {
        job: {
          connect: { id: jobId }
        },
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      },
    });

    // Increment job view count
    await prisma.job.update({
      where: { id: jobId },
      data: { viewsCount: { increment: 1 } },
    });
  }

  // ==================== APPLICATION METHODS ====================

  /**
   * Create a new job application
   */
  async createApplication(data: CreateApplicationInput) {
    // Check if job exists and is active
    const job = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job) {
      throw new Error('Job not found');
    }

    if (!job.isPublished) {
      throw new Error('Job is not accepting applications');
    }

    if (job.status !== 'ACTIVE') {
      throw new Error('Job is not currently active');
    }

    // Check if deadline has passed
    if (new Date() > job.applicationDeadline) {
      throw new Error('Application deadline has passed');
    }

    // Check for duplicate application (same email for same job)
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId: data.jobId,
        email: data.email,
      },
    });

    if (existingApplication) {
      throw new Error('You have already applied for this position');
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        candidateName: data.candidateName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl,
        portfolioUrl: data.portfolioUrl,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        websiteUrl: data.websiteUrl,
        yearsExperience: data.yearsExperience,
        currentCompany: data.currentCompany,
        currentTitle: data.currentTitle,
        expectedSalary: data.expectedSalary,
        noticePeriod: data.noticePeriod,
        availability: data.availability,
        questionsAnswers: data.questionsAnswers as Prisma.InputJsonValue | undefined,
        source: data.source || 'Company Website',
        status: 'NEW',
        job: {
          connect: { id: data.jobId }
        }
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
      },
    });

    // Increment application count on job
    await prisma.job.update({
      where: { id: data.jobId },
      data: { applicationsCount: { increment: 1 } },
    });

    return application;
  }

  /**
   * Get applications with filters
   */
  async getApplications(query: any) {
    const { jobId, status, page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (jobId) where.jobId = jobId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { candidateName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              department: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get application by ID
   */
  async getApplicationById(id: string) {
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  }

  /**
   * Update application (for admin review)
   */
  async updateApplication(id: string, data: UpdateApplicationInput, reviewedById: string) {
    const application = await prisma.jobApplication.findUnique({ where: { id } });
    if (!application) {
      throw new Error('Application not found');
    }

    const updateData: any = {
      status: data.status,
      internalNotes: data.internalNotes,
      interviewNotes: data.interviewNotes,
      rating: data.rating,
      tags: data.tags,
    };

    // Set review date and reviewer when status changes
    if (data.status && data.status !== application.status) {
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = {
        connect: { id: reviewedById }
      };

      // Set specific dates based on status
      if (data.status === 'INTERVIEWED') {
        updateData.interviewedAt = new Date();
      } else if (data.status === 'HIRED') {
        updateData.hiredAt = new Date();
      } else if (data.status === 'REJECTED') {
        updateData.rejectedAt = new Date();
      }
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: updateData,
      include: {
        job: true,
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedApplication;
  }

  /**
   * Delete application
   */
  async deleteApplication(id: string) {
    const application = await prisma.jobApplication.findUnique({ where: { id } });
    if (!application) {
      throw new Error('Application not found');
    }

    await prisma.jobApplication.delete({ where: { id } });

    // Decrement application count
    await prisma.job.update({
      where: { id: application.jobId },
      data: { applicationsCount: { decrement: 1 } },
    });

    return { message: 'Application deleted successfully' };
  }

  /**
   * Get application statistics
   */
  async getApplicationStats(jobId?: string) {
    const where = jobId ? { jobId } : {};

    const [total, newApps, reviewing, shortlisted, interviewed, hired, rejected] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.count({ where: { ...where, status: 'NEW' } }),
      prisma.jobApplication.count({ where: { ...where, status: 'REVIEWING' } }),
      prisma.jobApplication.count({ where: { ...where, status: 'SHORTLISTED' } }),
      prisma.jobApplication.count({ where: { ...where, status: 'INTERVIEWED' } }),
      prisma.jobApplication.count({ where: { ...where, status: 'HIRED' } }),
      prisma.jobApplication.count({ where: { ...where, status: 'REJECTED' } }),
    ]);

    return {
      total,
      byStatus: {
        new: newApps,
        reviewing,
        shortlisted,
        interviewed,
        hired,
        rejected,
      },
    };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Calculate job completion percentage
   */
  private calculateCompletion(data: any): { completionPercentage: number; missingFields: string[] } {
    const required = {
      'Title': data.title,
      'Department': data.department,
      'Location': data.location,
      'Employment Type': data.employmentType,
      'Experience Level': data.experienceLevel,
      'Description': data.description && data.description.length >= 50,
      'Responsibilities': data.responsibilities && data.responsibilities.length > 0,
      'Requirements': data.requirements && data.requirements.length > 0,
      'Application Deadline': data.applicationDeadline,
    };

    // Make skills and benefits optional for completion
    const optional = {
      'Skills': data.skills && data.skills.length > 0,
      'Benefits': data.benefits && data.benefits.length > 0,
    };

    const missingFields: string[] = [];
    let completedFields = 0;
    const totalRequired = Object.keys(required).length;

    Object.entries(required).forEach(([field, value]) => {
      if (value) {
        completedFields++;
      } else {
        missingFields.push(field);
      }
    });

    // Calculate percentage based on required fields only
    const completionPercentage = Math.round((completedFields / totalRequired) * 100);

    return { completionPercentage, missingFields };
  }
}

export const jobService = new JobService();