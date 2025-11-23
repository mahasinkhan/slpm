// src/services/approval.service.ts
import { PrismaClient, ApprovalStatus, Role } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

interface ApprovalFilters {
  status?: string;
  type?: string;
  priority?: string;
  search?: string;
  dateRange?: string;
  page: number;
  limit: number;
}

export const getApprovalStatistics = async (userId: string, role: Role) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Build where clause based on role
  const whereClause = role === 'EMPLOYEE' ? { submitterId: userId } : {};

  // Total approvals in last 30 days
  const [totalCurrent, totalPrevious] = await Promise.all([
    prisma.approval.count({
      where: {
        ...whereClause,
        submittedDate: { gte: thirtyDaysAgo }
      }
    }),
    prisma.approval.count({
      where: {
        ...whereClause,
        submittedDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    })
  ]);

  // Approved count
  const [approvedCurrent, approvedPrevious] = await Promise.all([
    prisma.approval.count({
      where: {
        ...whereClause,
        status: 'APPROVED',
        approvedDate: { gte: thirtyDaysAgo }
      }
    }),
    prisma.approval.count({
      where: {
        ...whereClause,
        status: 'APPROVED',
        approvedDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    })
  ]);

  // Rejected count
  const [rejectedCurrent, rejectedPrevious] = await Promise.all([
    prisma.approval.count({
      where: {
        ...whereClause,
        status: 'REJECTED',
        approvedDate: { gte: thirtyDaysAgo }
      }
    }),
    prisma.approval.count({
      where: {
        ...whereClause,
        status: 'REJECTED',
        approvedDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    })
  ]);

  // Average response time (in hours)
  const approvedApprovals = await prisma.approval.findMany({
    where: {
      ...whereClause,
      status: { in: ['APPROVED', 'REJECTED'] },
      approvedDate: { not: null }
    },
    select: {
      submittedDate: true,
      approvedDate: true
    }
  });

  let avgResponseTime = 0;
  if (approvedApprovals.length > 0) {
    const totalHours = approvedApprovals.reduce((sum, approval) => {
      if (!approval.approvedDate) return sum;
      const diff = approval.approvedDate.getTime() - approval.submittedDate.getTime();
      return sum + (diff / (1000 * 60 * 60));
    }, 0);
    avgResponseTime = totalHours / approvedApprovals.length;
  }

  // Convert to days
  const avgDays = (avgResponseTime / 24).toFixed(1);

  // Get approvals by type
  const approvalsByType = await prisma.approval.groupBy({
    by: ['type'],
    where: whereClause,
    _count: { id: true }
  });

  const total = approvalsByType.reduce((sum, item) => sum + item._count.id, 0);

  const formattedByType = approvalsByType.map(item => ({
    type: formatApprovalType(item.type),
    count: item._count.id,
    percentage: total > 0 ? Math.round((item._count.id / total) * 100) : 0,
    color: getTypeColor(item.type)
  }));

  return {
    total: {
      value: totalCurrent,
      change: totalCurrent - totalPrevious
    },
    approved: {
      value: approvedCurrent,
      change: approvedCurrent - approvedPrevious
    },
    rejected: {
      value: rejectedCurrent,
      change: rejectedCurrent - rejectedPrevious
    },
    avgResponse: {
      value: `${avgDays} days`,
      change: 0 // Could calculate this from previous period
    },
    byType: formattedByType
  };
};

export const getApprovals = async (userId: string, role: Role, filters: ApprovalFilters) => {
  const { status, type, priority, search, dateRange, page, limit } = filters;

  // Build where clause
  const where: any = {};

  // Role-based filtering
  if (role === 'EMPLOYEE') {
    where.submitterId = userId;
  }

  // Status filter
  if (status && status !== 'all') {
    where.status = status.toUpperCase();
  }

  // Type filter
  if (type && type !== 'all') {
    where.type = type.toUpperCase();
  }

  // Priority filter
  if (priority && priority !== 'all') {
    where.priority = priority.toUpperCase();
  }

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { approvalId: { contains: search, mode: 'insensitive' } },
      { submitterName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Date range filter
  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    where.submittedDate = { gte: startDate };
  }

  // Get total count
  const total = await prisma.approval.count({ where });

  // Get paginated results
  const approvals = await prisma.approval.findMany({
    where,
    orderBy: { submittedDate: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      submitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true
        }
      },
      approver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true
        }
      }
    }
  });

  return { approvals, total };
};

export const getApprovalById = async (id: string, userId: string, role: Role) => {
  const approval = await prisma.approval.findUnique({
    where: { id },
    include: {
      submitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          phone: true
        }
      },
      approver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          phone: true
        }
      },
      comments: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      history: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!approval) {
    return null;
  }

  // Check permissions
  if (role === 'EMPLOYEE' && approval.submitterId !== userId) {
    throw new AppError('You do not have permission to view this approval', 403);
  }

  return approval;
};

export const createApproval = async (data: any) => {
  // Generate unique approval ID
  const count = await prisma.approval.count();
  const approvalId = `APR-${String(count + 1).padStart(4, '0')}`;

  const approval = await prisma.approval.create({
    data: {
      approvalId,
      type: data.type,
      title: data.title,
      description: data.description,
      amount: data.amount,
      priority: data.priority || 'MEDIUM',
      submitterId: data.submitterId,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      submitterAvatar: data.submitterAvatar,
      notes: data.notes,
      metadata: data.metadata,
      attachments: data.attachments || [],
      dueDate: data.dueDate
    },
    include: {
      submitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true
        }
      }
    }
  });

  // Create history entry
  await prisma.approvalHistory.create({
    data: {
      approvalId: approval.id,
      userId: data.submitterId,
      action: 'CREATED',
      changes: {
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    }
  });

  return approval;
};

export const updateApproval = async (id: string, userId: string, data: any) => {
  const approval = await prisma.approval.findUnique({
    where: { id }
  });

  if (!approval) {
    throw new AppError('Approval not found', 404);
  }

  // Only submitter can update
  if (approval.submitterId !== userId) {
    throw new AppError('You do not have permission to update this approval', 403);
  }

  // Can only update pending approvals
  if (approval.status !== 'PENDING') {
    throw new AppError('Cannot update approval that has been processed', 400);
  }

  const updated = await prisma.approval.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      amount: data.amount,
      priority: data.priority,
      notes: data.notes,
      metadata: data.metadata,
      attachments: data.attachments,
      dueDate: data.dueDate
    },
    include: {
      submitter: true,
      approver: true
    }
  });

  // Create history entry
  await prisma.approvalHistory.create({
    data: {
      approvalId: id,
      userId,
      action: 'UPDATED',
      oldValue: JSON.stringify(approval),
      newValue: JSON.stringify(updated)
    }
  });

  return updated;
};

export const makeDecision = async (
  id: string,
  decision: 'APPROVED' | 'REJECTED',
  approver: any,
  notes?: string
) => {
  const approval = await prisma.approval.findUnique({
    where: { id }
  });

  if (!approval) {
    throw new AppError('Approval not found', 404);
  }

  if (approval.status !== 'PENDING') {
    throw new AppError('Approval has already been processed', 400);
  }

  const updated = await prisma.approval.update({
    where: { id },
    data: {
      status: decision,
      approverId: approver.id,
      approverName: `${approver.firstName} ${approver.lastName}`,
      approverEmail: approver.email,
      approverAvatar: approver.avatar,
      approvedDate: new Date(),
      notes: notes || approval.notes
    },
    include: {
      submitter: true,
      approver: true
    }
  });

  // Create history entry
  await prisma.approvalHistory.create({
    data: {
      approvalId: id,
      userId: approver.id,
      action: decision,
      changes: {
        status: decision,
        approvedDate: new Date().toISOString(),
        notes
      }
    }
  });

  return updated;
};

export const deleteApproval = async (id: string, userId: string, role: Role) => {
  const approval = await prisma.approval.findUnique({
    where: { id }
  });

  if (!approval) {
    throw new AppError('Approval not found', 404);
  }

  // Only submitter or admin can delete
  if (role === 'EMPLOYEE' && approval.submitterId !== userId) {
    throw new AppError('You do not have permission to delete this approval', 403);
  }

  // Can only delete pending approvals
  if (approval.status !== 'PENDING') {
    throw new AppError('Cannot delete approval that has been processed', 400);
  }

  await prisma.approval.delete({
    where: { id }
  });
};

export const bulkApprove = async (approvalIds: string[], approver: any) => {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const id of approvalIds) {
    try {
      await makeDecision(id, 'APPROVED', approver);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Failed to approve ${id}: ${error}`);
    }
  }

  return results;
};

export const bulkReject = async (approvalIds: string[], approver: any, notes?: string) => {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const id of approvalIds) {
    try {
      await makeDecision(id, 'REJECTED', approver, notes);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Failed to reject ${id}: ${error}`);
    }
  }

  return results;
};

// Helper functions
function formatApprovalType(type: string): string {
  return type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    EXPENSE_CLAIM: 'blue',
    USER_ACCESS: 'green',
    CONTENT_PUBLISH: 'purple',
    PURCHASE_ORDER: 'orange',
    LEAVE_REQUEST: 'pink',
    BUDGET_INCREASE: 'yellow',
    EQUIPMENT_REQUEST: 'indigo',
    TRAINING_REQUEST: 'teal'
  };
  return colors[type] || 'gray';
}