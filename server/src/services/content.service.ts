// ==================== UPDATED CONTENT SERVICE ====================
// File: server/src/services/content.service.ts

import prisma from '../config/database';
import { ContentType, ContentStatus, Prisma } from '@prisma/client';

interface CreateContentDTO {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  type?: ContentType;
  status?: ContentStatus;
  featured?: boolean;
  featuredImage?: string;
  categoryId?: string;
  publishedAt?: Date;
  scheduledAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  readTime?: number;
  tags?: string[];
}

interface UpdateContentDTO {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  type?: ContentType;
  status?: ContentStatus;
  featured?: boolean;
  featuredImage?: string;
  categoryId?: string;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  readTime?: number;
  tags?: string[];
}

interface ContentQueryParams {
  page?: number;
  limit?: number;
  status?: ContentStatus;
  type?: ContentType;
  search?: string;
  categoryId?: string;
  authorId?: string;
  featured?: boolean;
}

class ContentService {
  // Generate unique slug
  private async generateSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.content.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  // Create content
  async createContent(data: CreateContentDTO, authorId: string) {
    const { tags, ...contentData } = data;

    // Generate slug if not provided
    let slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure slug is unique
    slug = await this.generateSlug(slug);

    // Auto-set publishedAt if status is PUBLISHED and publishedAt is not set
    const publishedAt = data.status === 'PUBLISHED' && !data.publishedAt 
      ? new Date() 
      : data.publishedAt;

    const content = await prisma.content.create({
      data: {
        ...contentData,
        slug,
        publishedAt,
        authorId,
        type: data.type || 'NEWS', // Default to NEWS
        status: data.status || 'DRAFT', // Default to DRAFT
        tags: tags && tags.length > 0 ? {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            },
          })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            commentsList: true,
            contentLikes: true,
            contentShares: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: authorId,
        action: 'CREATE',
        entity: 'content',
        entityId: content.id,
        changes: JSON.stringify({ 
          title: content.title, 
          type: content.type, 
          status: content.status 
        }),
      },
    });

    return content;
  }

  // Get all content with filters
  async getAllContent(params: ContentQueryParams = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      search,
      categoryId,
      authorId,
      featured,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ContentWhereInput = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (featured !== undefined) where.featured = featured;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
          _count: {
            select: {
              commentsList: true,
              contentLikes: true,
              contentShares: true,
            },
          },
        },
      }),
      prisma.content.count({ where }),
    ]);

    return {
      content,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get content by ID
  async getContentById(id: string) {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        category: true,
        tags: true,
        media: true,
        commentsList: {
          where: { approved: true },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            commentsList: true,
            contentLikes: true,
            contentShares: true,
          },
        },
      },
    });

    if (!content) {
      throw new Error('Content not found');
    }

    return content;
  }

  // Get content by slug
  async getContentBySlug(slug: string) {
    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
        media: true,
        commentsList: {
          where: { approved: true },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            commentsList: true,
            contentLikes: true,
            contentShares: true,
          },
        },
      },
    });

    if (!content) {
      throw new Error('Content not found');
    }

    return content;
  }

  // Update content
  async updateContent(id: string, data: UpdateContentDTO, userId: string) {
    const { tags, ...contentData } = data;

    // Check if content exists
    const existingContent = await prisma.content.findUnique({ where: { id } });
    if (!existingContent) {
      throw new Error('Content not found');
    }

    // If slug is being updated, ensure it's unique
    if (data.slug && data.slug !== existingContent.slug) {
      const slugExists = await prisma.content.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (slugExists) {
        throw new Error('Slug already exists');
      }
    }

    // Auto-set publishedAt if status changes to PUBLISHED
    let updateData: any = { ...contentData };
    if (data.status === 'PUBLISHED' && existingContent.status !== 'PUBLISHED' && !data.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const content = await prisma.content.update({
      where: { id },
      data: {
        ...updateData,
        tags: tags ? {
          set: [],
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            },
          })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE',
        entity: 'content',
        entityId: id,
        changes: JSON.stringify(data),
      },
    });

    return content;
  }

  // Delete content
  async deleteContent(id: string, userId: string) {
    const content = await prisma.content.findUnique({ where: { id } });

    if (!content) {
      throw new Error('Content not found');
    }

    await prisma.content.delete({ where: { id } });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE',
        entity: 'content',
        entityId: id,
        changes: JSON.stringify({ title: content.title }),
      },
    });

    return { message: 'Content deleted successfully' };
  }

  // Increment views
  async incrementViews(id: string) {
    await prisma.content.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return { message: 'View count incremented' };
  }

  // Like content
  async likeContent(contentId: string, userId: string) {
    const existingLike = await prisma.contentLike.findUnique({
      where: {
        contentId_userId: { contentId, userId },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.contentLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.content.update({
          where: { id: contentId },
          data: { likes: { decrement: 1 } },
        }),
      ]);

      return { liked: false, message: 'Content unliked' };
    } else {
      // Like
      await prisma.$transaction([
        prisma.contentLike.create({
          data: { contentId, userId },
        }),
        prisma.content.update({
          where: { id: contentId },
          data: { likes: { increment: 1 } },
        }),
      ]);

      return { liked: true, message: 'Content liked' };
    }
  }

  // Share content
  async shareContent(contentId: string, platform: string, ipAddress?: string, userAgent?: string) {
    await prisma.$transaction([
      prisma.contentShare.create({
        data: {
          contentId,
          platform,
          ipAddress,
          userAgent,
        },
      }),
      prisma.content.update({
        where: { id: contentId },
        data: { shares: { increment: 1 } },
      }),
    ]);

    return { message: 'Content shared successfully' };
  }

  // Get analytics/stats
  async getStats(authorId?: string) {
    const where: Prisma.ContentWhereInput = authorId ? { authorId } : {};

    const [
      total,
      published,
      draft,
      scheduled,
      review,
      archived,
      totalViews,
      totalLikes,
      totalShares,
      totalComments,
    ] = await Promise.all([
      prisma.content.count({ where }),
      prisma.content.count({ where: { ...where, status: 'PUBLISHED' } }),
      prisma.content.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.content.count({ where: { ...where, status: 'SCHEDULED' } }),
      prisma.content.count({ where: { ...where, status: 'REVIEW' } }),
      prisma.content.count({ where: { ...where, status: 'ARCHIVED' } }),
      prisma.content.aggregate({
        where,
        _sum: { views: true },
      }),
      prisma.content.aggregate({
        where,
        _sum: { likes: true },
      }),
      prisma.content.aggregate({
        where,
        _sum: { shares: true },
      }),
      prisma.content.aggregate({
        where,
        _sum: { comments: true },
      }),
    ]);

    // Calculate engagement rate
    const totalEngagements = (totalLikes._sum.likes || 0) + 
                             (totalComments._sum.comments || 0) + 
                             (totalShares._sum.shares || 0);
    const engagementRate = totalViews._sum.views 
      ? ((totalEngagements / totalViews._sum.views) * 100).toFixed(2)
      : '0.00';

    return {
      total,
      byStatus: {
        published,
        draft,
        scheduled,
        review,
        archived,
      },
      analytics: {
        totalViews: totalViews._sum.views || 0,
        totalLikes: totalLikes._sum.likes || 0,
        totalShares: totalShares._sum.shares || 0,
        totalComments: totalComments._sum.comments || 0,
        engagementRate: parseFloat(engagementRate),
      },
    };
  }

  // Get trending content
  async getTrendingContent(limit: number = 5) {
    const content = await prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
      },
      take: limit,
      orderBy: [
        { views: 'desc' },
        { likes: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return content;
  }

  // Get related content
  async getRelatedContent(contentId: string, limit: number = 3) {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { tags: true, category: true },
    });

    if (!content) {
      throw new Error('Content not found');
    }

    const tagIds = content.tags.map(tag => tag.id);

    const related = await prisma.content.findMany({
      where: {
        AND: [
          { id: { not: contentId } },
          { status: 'PUBLISHED' },
          {
            OR: [
              { categoryId: content.categoryId },
              { tags: { some: { id: { in: tagIds } } } },
            ],
          },
        ],
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return related;
  }
}

export default new ContentService();


