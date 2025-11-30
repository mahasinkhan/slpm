// src/services/application.service.ts
import { PrismaClient, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface ApplicationFilters {
  status?: string;
  jobId?: string;
  department?: string;
  minRating?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

interface Pagination {
  page: number;
  limit: number;
}

interface Sorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ReviewData {
  status: string;
  rating: number;
  notes: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

class ApplicationService {
  /**
   * Get all applications with filters, pagination, and sorting
   */
  async getApplications(filters: ApplicationFilters, pagination: Pagination, sorting: Sorting) {
    const { page, limit } = pagination;
    const { sortBy, sortOrder } = sorting;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    if (filters.jobId && filters.jobId !== 'all') {
      where.jobId = filters.jobId;
    }

    if (filters.department && filters.department !== 'all') {
      where.job = {
        department: filters.department,
      };
    }

    if (filters.minRating) {
      where.rating = {
        gte: filters.minRating,
      };
    }

    if (filters.startDate && filters.endDate) {
      where.appliedAt = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    } else if (filters.startDate) {
      where.appliedAt = {
        gte: filters.startDate,
      };
    } else if (filters.endDate) {
      where.appliedAt = {
        lte: filters.endDate,
      };
    }

    if (filters.search) {
      where.OR = [
        { candidateName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { applicationId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get applications
    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
            },
          },
        },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    // Transform applications to match frontend interface
    const transformedApplications = applications.map((app) => ({
      id: app.id,
      firstName: app.candidateName.split(' ')[0] || app.candidateName,
      lastName: app.candidateName.split(' ').slice(1).join(' ') || '',
      email: app.email,
      phone: app.phone,
      status: app.status,
      rating: app.rating,
      appliedAt: app.appliedAt.toISOString(),
      job: app.job,
    }));

    return {
      applications: transformedApplications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single application by ID with full details
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
            employmentType: true,
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
    });

    if (!application) {
      return null;
    }

    // Get notes for this application (from internal notes or a separate table)
    const notes = await this.getNotes(id);
    const timeline = await this.getTimeline(id);

    // Transform to match frontend interface
    return {
      id: application.id,
      firstName: application.candidateName.split(' ')[0] || application.candidateName,
      lastName: application.candidateName.split(' ').slice(1).join(' ') || '',
      email: application.email,
      phone: application.phone,
      address: application.location,
      status: application.status,
      rating: application.rating,
      coverLetter: application.coverLetter,
      resume: application.resumeUrl,
      appliedAt: application.appliedAt.toISOString(),
      job: application.job,
      notes,
      timeline,
      portfolioUrl: application.portfolioUrl,
      linkedinUrl: application.linkedinUrl,
      githubUrl: application.githubUrl,
      websiteUrl: application.websiteUrl,
      yearsExperience: application.yearsExperience,
      currentCompany: application.currentCompany,
      currentTitle: application.currentTitle,
      expectedSalary: application.expectedSalary,
      noticePeriod: application.noticePeriod,
      availability: application.availability,
      internalNotes: application.internalNotes,
      interviewNotes: application.interviewNotes,
      tags: application.tags,
      source: application.source,
    };
  }

  /**
   * Update application status
   */
  async updateStatus(id: string, status: string, userId: string) {
    // Get current application for history
    const currentApp = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!currentApp) {
      throw new Error('Application not found');
    }

    const oldStatus = currentApp.status;

    // Update status with appropriate date fields
    const updateData: any = {
      status: status as ApplicationStatus,
      reviewedById: userId,
      reviewedAt: new Date(),
    };

    // Set specific date fields based on status
    switch (status) {
      case 'INTERVIEWED':
        updateData.interviewedAt = new Date();
        break;
      case 'HIRED':
        updateData.hiredAt = new Date();
        break;
      case 'REJECTED':
        updateData.rejectedAt = new Date();
        break;
    }

    const application = await prisma.jobApplication.update({
      where: { id },
      data: updateData,
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

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_APPLICATION_STATUS',
        entity: 'JobApplication',
        entityId: id,
        changes: JSON.stringify({
          oldStatus,
          newStatus: status,
        }),
      },
    });

    return application;
  }

  /**
   * Update application rating
   */
  async updateRating(id: string, rating: number, userId: string) {
    const application = await prisma.jobApplication.update({
      where: { id },
      data: {
        rating,
        reviewedById: userId,
        reviewedAt: new Date(),
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

    return application;
  }

  /**
   * Add a note to an application
   * Since we don't have a separate notes table, we'll append to internalNotes
   * You may want to create a separate ApplicationNote model for better tracking
   */
  async addNote(applicationId: string, content: string, userId: string) {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get current application
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    // Create a structured note entry
    const noteEntry = {
      id: `note-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };

    // Parse existing notes or create new array
    let existingNotes: any[] = [];
    try {
      if (application.internalNotes) {
        // Try to parse as JSON array first
        const parsed = JSON.parse(application.internalNotes);
        if (Array.isArray(parsed)) {
          existingNotes = parsed;
        } else {
          // If it's a string, convert to first note
          existingNotes = [
            {
              id: 'note-legacy',
              content: application.internalNotes,
              createdAt: application.createdAt.toISOString(),
              createdBy: {
                firstName: 'System',
                lastName: '',
              },
            },
          ];
        }
      }
    } catch {
      // If parsing fails, treat as plain text
      if (application.internalNotes) {
        existingNotes = [
          {
            id: 'note-legacy',
            content: application.internalNotes,
            createdAt: application.createdAt.toISOString(),
            createdBy: {
              firstName: 'System',
              lastName: '',
            },
          },
        ];
      }
    }

    // Add new note
    existingNotes.push(noteEntry);

    // Update application
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        internalNotes: JSON.stringify(existingNotes),
      },
    });

    return noteEntry;
  }

  /**
   * Get notes for an application
   */
  async getNotes(applicationId: string) {
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      select: {
        internalNotes: true,
        createdAt: true,
      },
    });

    if (!application || !application.internalNotes) {
      return [];
    }

    try {
      const parsed = JSON.parse(application.internalNotes);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If it's a string, return as single note
      return [
        {
          id: 'note-legacy',
          content: application.internalNotes,
          createdAt: application.createdAt.toISOString(),
          createdBy: {
            firstName: 'System',
            lastName: '',
          },
        },
      ];
    } catch {
      // Plain text note
      return [
        {
          id: 'note-legacy',
          content: application.internalNotes,
          createdAt: application.createdAt.toISOString(),
          createdBy: {
            firstName: 'System',
            lastName: '',
          },
        },
      ];
    }
  }

  /**
   * Submit a complete review
   */
  async submitReview(id: string, reviewData: ReviewData, userId: string) {
    const { status, rating, notes, feedback, strengths, weaknesses, recommendation } = reviewData;

    // Get current notes
    const existingNotes = await this.getNotes(id);

    // Add review notes if provided
    if (notes && notes.trim()) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      });

      existingNotes.push({
        id: `review-${Date.now()}`,
        content: `[REVIEW] ${notes}`,
        createdAt: new Date().toISOString(),
        createdBy: {
          firstName: user?.firstName || 'Unknown',
          lastName: user?.lastName || '',
        },
      });
    }

    // Prepare update data
    const updateData: any = {
      status: status as ApplicationStatus,
      rating,
      reviewedById: userId,
      reviewedAt: new Date(),
      internalNotes: JSON.stringify(existingNotes),
    };

    // Store review details in questionsAnswers field (JSON)
    const reviewDetails = {
      strengths,
      weaknesses,
      recommendation,
      feedback,
      reviewedAt: new Date().toISOString(),
    };
    
    // Merge with existing questionsAnswers if any
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      select: { questionsAnswers: true },
    });

    let existingQA = {};
    if (application?.questionsAnswers) {
      existingQA = application.questionsAnswers as object;
    }

    updateData.questionsAnswers = {
      ...existingQA,
      review: reviewDetails,
    };

    // Set date fields based on status
    switch (status) {
      case 'INTERVIEWED':
        updateData.interviewedAt = new Date();
        break;
      case 'HIRED':
        updateData.hiredAt = new Date();
        break;
      case 'REJECTED':
        updateData.rejectedAt = new Date();
        break;
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: updateData,
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

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SUBMIT_APPLICATION_REVIEW',
        entity: 'JobApplication',
        entityId: id,
        changes: JSON.stringify({
          status,
          rating,
          recommendation,
        }),
      },
    });

    return updatedApplication;
  }

  /**
   * Get timeline/history for an application
   */
  async getTimeline(applicationId: string) {
    // Get audit logs for this application
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        entityId: applicationId,
        entity: 'JobApplication',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    // Get the application for additional timeline info
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      select: {
        appliedAt: true,
        reviewedAt: true,
        interviewedAt: true,
        hiredAt: true,
        rejectedAt: true,
        reviewedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const timeline: any[] = [];

    // Add application submitted event
    if (application) {
      timeline.push({
        id: 'applied',
        action: 'Application Submitted',
        description: 'Candidate submitted their application',
        createdAt: application.appliedAt.toISOString(),
        createdBy: {
          firstName: 'System',
          lastName: '',
        },
      });

      if (application.reviewedAt) {
        timeline.push({
          id: 'reviewed',
          action: 'Application Reviewed',
          description: 'Application was reviewed by HR',
          createdAt: application.reviewedAt.toISOString(),
          createdBy: application.reviewedBy || { firstName: 'HR', lastName: 'Team' },
        });
      }

      if (application.interviewedAt) {
        timeline.push({
          id: 'interviewed',
          action: 'Interview Completed',
          description: 'Candidate completed the interview',
          createdAt: application.interviewedAt.toISOString(),
          createdBy: application.reviewedBy || { firstName: 'HR', lastName: 'Team' },
        });
      }

      if (application.hiredAt) {
        timeline.push({
          id: 'hired',
          action: 'Candidate Hired',
          description: 'Offer accepted and candidate was hired',
          createdAt: application.hiredAt.toISOString(),
          createdBy: application.reviewedBy || { firstName: 'HR', lastName: 'Team' },
        });
      }

      if (application.rejectedAt) {
        timeline.push({
          id: 'rejected',
          action: 'Application Rejected',
          description: 'Application was not successful',
          createdAt: application.rejectedAt.toISOString(),
          createdBy: application.reviewedBy || { firstName: 'HR', lastName: 'Team' },
        });
      }
    }

    // Add audit log events
    for (const log of auditLogs) {
      const user = await prisma.user.findUnique({
        where: { id: log.userId },
        select: { firstName: true, lastName: true },
      });

      let action = log.action;
      let description = '';

      switch (log.action) {
        case 'UPDATE_APPLICATION_STATUS':
          action = 'Status Updated';
          try {
            const changes = JSON.parse(log.changes || '{}');
            description = `Status changed from ${changes.oldStatus} to ${changes.newStatus}`;
          } catch {
            description = 'Application status was updated';
          }
          break;
        case 'SUBMIT_APPLICATION_REVIEW':
          action = 'Review Submitted';
          description = 'A detailed review was submitted';
          break;
        default:
          description = log.changes || '';
      }

      timeline.push({
        id: log.id,
        action,
        description,
        createdAt: log.createdAt.toISOString(),
        createdBy: user || { firstName: 'System', lastName: '' },
      });
    }

    // Sort by date descending
    timeline.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return timeline;
  }

  /**
   * Get application statistics
   */
  async getStats(filters: { jobId?: string; startDate?: Date; endDate?: Date }) {
    const where: any = {};

    if (filters.jobId) {
      where.jobId = filters.jobId;
    }

    if (filters.startDate && filters.endDate) {
      where.appliedAt = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }

    // Get counts by status
    const statusCounts = await prisma.jobApplication.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    // Get total applications
    const totalApplications = await prisma.jobApplication.count({ where });

    // Get applications by source
    const sourceCounts = await prisma.jobApplication.groupBy({
      by: ['source'],
      where,
      _count: {
        source: true,
      },
    });

    // Get average rating
    const avgRating = await prisma.jobApplication.aggregate({
      where: {
        ...where,
        rating: { not: null },
      },
      _avg: {
        rating: true,
      },
    });

    // Get applications per job
    const applicationsByJob = await prisma.jobApplication.groupBy({
      by: ['jobId'],
      where,
      _count: {
        jobId: true,
      },
    });

    // Get job details for each
    const jobIds = applicationsByJob.map((j) => j.jobId);
    const jobs = await prisma.job.findMany({
      where: { id: { in: jobIds } },
      select: { id: true, title: true, department: true },
    });

    const applicationsByJobWithDetails = applicationsByJob.map((item) => {
      const job = jobs.find((j) => j.id === item.jobId);
      return {
        jobId: item.jobId,
        jobTitle: job?.title || 'Unknown',
        department: job?.department || 'Unknown',
        count: item._count.jobId,
      };
    });

    // Calculate conversion rates
    const newCount = statusCounts.find((s) => s.status === 'NEW')?._count.status || 0;
    const hiredCount = statusCounts.find((s) => s.status === 'HIRED')?._count.status || 0;
    const interviewedCount = statusCounts.find((s) => s.status === 'INTERVIEWED')?._count.status || 0;
    const shortlistedCount = statusCounts.find((s) => s.status === 'SHORTLISTED')?._count.status || 0;

    return {
      totalApplications,
      byStatus: Object.fromEntries(statusCounts.map((s) => [s.status, s._count.status])),
      bySource: Object.fromEntries(
        sourceCounts.filter((s) => s.source).map((s) => [s.source || 'Unknown', s._count.source])
      ),
      byJob: applicationsByJobWithDetails,
      averageRating: avgRating._avg.rating || 0,
      conversionRates: {
        applicationToShortlist: totalApplications > 0 ? ((shortlistedCount / totalApplications) * 100).toFixed(1) : 0,
        shortlistToInterview: shortlistedCount > 0 ? ((interviewedCount / shortlistedCount) * 100).toFixed(1) : 0,
        interviewToHire: interviewedCount > 0 ? ((hiredCount / interviewedCount) * 100).toFixed(1) : 0,
        overallHireRate: totalApplications > 0 ? ((hiredCount / totalApplications) * 100).toFixed(1) : 0,
      },
    };
  }

  /**
   * Bulk update applications
   */
  async bulkUpdate(
    applicationIds: string[],
    update: { status?: string; action?: string },
    userId: string
  ) {
    const updateData: any = {};

    if (update.status) {
      updateData.status = update.status as ApplicationStatus;
      updateData.reviewedById = userId;
      updateData.reviewedAt = new Date();

      switch (update.status) {
        case 'REJECTED':
          updateData.rejectedAt = new Date();
          break;
        case 'HIRED':
          updateData.hiredAt = new Date();
          break;
      }
    }

    const result = await prisma.jobApplication.updateMany({
      where: { id: { in: applicationIds } },
      data: updateData,
    });

    // Create audit log for bulk action
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'BULK_UPDATE_APPLICATIONS',
        entity: 'JobApplication',
        entityId: applicationIds.join(','),
        changes: JSON.stringify({
          count: result.count,
          update,
        }),
      },
    });

    return result;
  }

  /**
   * Delete an application
   */
  async deleteApplication(id: string) {
    await prisma.jobApplication.delete({
      where: { id },
    });
  }

  /**
   * Export applications to CSV
   */
  async exportApplications(filters: { jobId?: string; status?: string; startDate?: Date; endDate?: Date }) {
    const where: any = {};

    if (filters.jobId) {
      where.jobId = filters.jobId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate && filters.endDate) {
      where.appliedAt = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    // Generate CSV
    const headers = [
      'Application ID',
      'Candidate Name',
      'Email',
      'Phone',
      'Job Title',
      'Department',
      'Status',
      'Rating',
      'Applied Date',
      'Source',
      'Current Company',
      'Current Title',
      'Years Experience',
      'Expected Salary',
      'Notice Period',
    ];

    const rows = applications.map((app) => [
      app.applicationId,
      app.candidateName,
      app.email,
      app.phone,
      app.job.title,
      app.job.department,
      app.status,
      app.rating || '',
      app.appliedAt.toISOString().split('T')[0],
      app.source || '',
      app.currentCompany || '',
      app.currentTitle || '',
      app.yearsExperience || '',
      app.expectedSalary || '',
      app.noticePeriod || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

    return csvContent;
  }
}

export const applicationService = new ApplicationService();