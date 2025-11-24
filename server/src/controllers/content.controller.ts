// ==================== FIXED CONTENT CONTROLLER ====================
// File: server/src/controllers/content.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { validateContent } from '../validators/content.validator';

const prisma = new PrismaClient();

export class ContentController {
  // Helper function to calculate read time
  private calculateReadTime(text: string): string {
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  }

  // Helper to generate unique slug
  private async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await prisma.content.findUnique({ 
        where: { slug },
        select: { id: true }
      });
      
      if (!existing || existing.id === excludeId) {
        break;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  // Get all published content for public view
  async getPublicContent(req: Request, res: Response): Promise<void> {
    try {
      const { type, category, featured, limit = 50, offset = 0 } = req.query;

      const where: any = {
        status: 'PUBLISHED'
      };

      if (type) {
        if (Array.isArray(type)) {
          where.type = { in: type };
        } else {
          where.type = type;
        }
      }

      if (category && category !== 'all') {
        where.categoryId = category;
      }

      if (featured === 'true') {
        where.featured = true;
      }

      const content = await prisma.content.findMany({
        where,
        orderBy: {
          publishedAt: 'desc'
        },
        take: Number(limit),
        skip: Number(offset),
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              avatar: true
            }
          },
          category: true,
          tags: true,
          media: true,
          _count: {
            select: {
              commentsList: true,
              contentLikes: true,
              contentShares: true
            }
          }
        }
      });

      // Transform the data
      const transformedContent = content.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        type: item.type,
        category: item.category,
        tags: item.tags.map(t => t.name),
        status: item.status,
        publishedAt: item.publishedAt,
        featured: item.featured,
        featuredImage: item.featuredImage,
        author: {
          id: item.author.id,
          name: `${item.author.firstName} ${item.author.lastName}`,
          email: item.author.email,
          role: item.author.role,
          avatar: item.author.avatar
        },
        views: item.views,
        likes: item.likes,
        comments: item.comments,
        shares: item.shares,
        readTime: item.readTime,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));

      res.status(200).json({
        success: true,
        data: transformedContent
      });
    } catch (error: any) {
      console.error('Error fetching public content:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch content'
      });
    }
  }

  // Get all content (admin)
  async getAllContent(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { type, status, authorId, featured, search, categoryId } = req.query;

      const where: any = {};

      if (type) where.type = type;
      if (status) where.status = status;
      if (authorId) where.authorId = authorId;
      if (categoryId) where.categoryId = categoryId;
      if (featured !== undefined) where.featured = featured === 'true';

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { excerpt: { contains: search as string, mode: 'insensitive' } },
          { content: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const skip = (page - 1) * limit;

      const [content, total] = await Promise.all([
        prisma.content.findMany({
          where,
          orderBy: {
            createdAt: 'desc'
          },
          take: limit,
          skip,
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true
              }
            },
            category: true,
            tags: true,
            media: true,
            _count: {
              select: {
                commentsList: true,
                contentLikes: true,
                contentShares: true
              }
            }
          }
        }),
        prisma.content.count({ where })
      ]);

      res.status(200).json({
        success: true,
        data: {
          content,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error: any) {
      console.error('Error fetching content:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch content'
      });
    }
  }

  // Get single content by ID
  async getContentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

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
              role: true
            }
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
                  avatar: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              commentsList: true,
              contentLikes: true,
              contentShares: true
            }
          }
        }
      });

      if (!content) {
        res.status(404).json({
          success: false,
          message: 'Content not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error: any) {
      console.error('Error fetching content:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Content not found'
      });
    }
  }

  // Get content by slug
  async getContentBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const content = await prisma.content.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              role: true
            }
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
                  avatar: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              commentsList: true,
              contentLikes: true,
              contentShares: true
            }
          }
        }
      });

      if (!content) {
        res.status(404).json({
          success: false,
          message: 'Content not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error: any) {
      console.error('Error fetching content by slug:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Content not found'
      });
    }
  }

  // Create content
  async createContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validation = validateContent(req.body);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          errors: validation.errors
        });
        return;
      }

      const {
        title,
        excerpt,
        content,
        type,
        categoryId,
        tags,
        status,
        featured,
        publishNow,
        scheduledAt,
        metaTitle,
        metaDescription,
        metaKeywords
      } = req.body;

      // Handle image upload if provided - FIXED: Changed type annotation
      let featuredImage: string | null = null;
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'content');
        featuredImage = uploadResult.secure_url;
      }

      // Generate unique slug
      const baseSlug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      
      const slug = await this.generateUniqueSlug(baseSlug);

      // Determine final status and publish date
      const finalStatus = publishNow ? 'PUBLISHED' : (status || 'DRAFT');
      const publishedAt = publishNow ? new Date() : (finalStatus === 'PUBLISHED' ? new Date() : null);

      // Create content
      const newContent = await prisma.content.create({
        data: {
          title,
          excerpt,
          content,
          type: type || 'NEWS',
          categoryId,
          status: finalStatus,
          featured: featured || false,
          publishedAt,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          featuredImage,
          authorId: req.user!.id,
          slug,
          readTime: parseInt(this.calculateReadTime(content)),
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || excerpt,
          metaKeywords,
          tags: tags && tags.length > 0 ? {
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { 
                name: tag,
                slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              }
            }))
          } : undefined
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              email: true
            }
          },
          category: true,
          tags: true,
          media: true
        }
      });

      // Log activity
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'CREATE',
          entity: 'content',
          entityId: newContent.id,
          changes: JSON.stringify({ title, type, status: finalStatus }),
          ipAddress: req.ip || 'unknown'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Content created successfully',
        data: newContent
      });
    } catch (error: any) {
      console.error('Error creating content:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create content'
      });
    }
  }

  // Update content
  async updateContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if content exists
      const existing = await prisma.content.findUnique({
        where: { id }
      });

      if (!existing) {
        res.status(404).json({
          success: false,
          message: 'Content not found'
        });
        return;
      }

      // Check authorization
      const userRole = req.user?.role;
      if (
        userRole !== 'SUPERADMIN' &&
        userRole !== 'ADMIN' &&
        existing.authorId !== req.user!.id
      ) {
        res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have permission to update this content'
        });
        return;
      }

      // Handle image upload if provided
      if (req.file) {
        // Delete old image if exists
        if (existing.featuredImage) {
          await deleteFromCloudinary(existing.featuredImage);
        }
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'content');
        updates.featuredImage = uploadResult.secure_url;
      }

      // Update slug if title changed
      if (updates.title && updates.title !== existing.title) {
        const baseSlug = updates.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        updates.slug = await this.generateUniqueSlug(baseSlug, id);
      }

      // Auto-set publishedAt if status changes to PUBLISHED
      if (updates.status === 'PUBLISHED' && existing.status !== 'PUBLISHED' && !updates.publishedAt) {
        updates.publishedAt = new Date();
      }

      // Calculate read time if content changed
      if (updates.content) {
        updates.readTime = parseInt(this.calculateReadTime(updates.content));
      }

      // Update content
      const updatedContent = await prisma.content.update({
        where: { id },
        data: {
          ...updates,
          scheduledAt: updates.scheduledAt ? new Date(updates.scheduledAt) : undefined,
          tags: updates.tags ? {
            set: [],
            connectOrCreate: updates.tags.map((tag: string) => ({
              where: { name: tag },
              create: { 
                name: tag,
                slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              }
            }))
          } : undefined
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          category: true,
          tags: true,
          media: true
        }
      });

      // Log activity
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'UPDATE',
          entity: 'content',
          entityId: id,
          changes: JSON.stringify(updates),
          ipAddress: req.ip || 'unknown'
        }
      });

      res.status(200).json({
        success: true,
        message: 'Content updated successfully',
        data: updatedContent
      });
    } catch (error: any) {
      console.error('Error updating content:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update content'
      });
    }
  }

  // Delete content
  async deleteContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const content = await prisma.content.findUnique({
        where: { id }
      });

      if (!content) {
        res.status(404).json({
          success: false,
          message: 'Content not found'
        });
        return;
      }

      // Check authorization - only SUPERADMIN and ADMIN can delete
      const userRole = req.user?.role;
      if (userRole !== 'SUPERADMIN' && userRole !== 'ADMIN') {
        res.status(403).json({
          success: false,
          message: 'Forbidden: Only admins can delete content'
        });
        return;
      }

      // Delete associated image if exists
      if (content.featuredImage) {
        await deleteFromCloudinary(content.featuredImage);
      }

      await prisma.content.delete({
        where: { id }
      });

      // Log activity
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'DELETE',
          entity: 'content',
          entityId: id,
          changes: JSON.stringify({ title: content.title }),
          ipAddress: req.ip || 'unknown'
        }
      });

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting content:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete content'
      });
    }
  }

  // Publish content
  async publishContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const content = await prisma.content.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date()
        },
        include: {
          author: true,
          category: true,
          tags: true
        }
      });

      // Log activity
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'PUBLISH',
          entity: 'content',
          entityId: id,
          changes: JSON.stringify({ status: 'PUBLISHED' }),
          ipAddress: req.ip || 'unknown'
        }
      });

      res.status(200).json({
        success: true,
        message: 'Content published successfully',
        data: content
      });
    } catch (error: any) {
      console.error('Error publishing content:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to publish content'
      });
    }
  }

  // Track content view
  async trackView(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.content.update({
        where: { id },
        data: {
          views: {
            increment: 1
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'View tracked successfully'
      });
    } catch (error: any) {
      console.error('Error tracking view:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to track view'
      });
    }
  }

  // Like/Unlike content
  async likeContent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      // Check if already liked
      const existingLike = await prisma.contentLike.findUnique({
        where: {
          contentId_userId: {
            contentId: id,
            userId
          }
        }
      });

      if (existingLike) {
        // Unlike
        await prisma.$transaction([
          prisma.contentLike.delete({
            where: {
              contentId_userId: {
                contentId: id,
                userId
              }
            }
          }),
          prisma.content.update({
            where: { id },
            data: {
              likes: {
                decrement: 1
              }
            }
          })
        ]);

        res.status(200).json({
          success: true,
          liked: false,
          message: 'Content unliked'
        });
      } else {
        // Like
        await prisma.$transaction([
          prisma.contentLike.create({
            data: {
              contentId: id,
              userId
            }
          }),
          prisma.content.update({
            where: { id },
            data: {
              likes: {
                increment: 1
              }
            }
          })
        ]);

        res.status(200).json({
          success: true,
          liked: true,
          message: 'Content liked'
        });
      }
    } catch (error: any) {
      console.error('Error liking content:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to like content'
      });
    }
  }

  // Share content
  async shareContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { platform } = req.body;

      if (!platform) {
        res.status(400).json({
          success: false,
          message: 'Platform is required'
        });
        return;
      }

      await prisma.$transaction([
        prisma.contentShare.create({
          data: {
            contentId: id,
            platform,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
          }
        }),
        prisma.content.update({
          where: { id },
          data: {
            shares: {
              increment: 1
            }
          }
        })
      ]);

      res.status(200).json({
        success: true,
        message: 'Content shared successfully'
      });
    } catch (error: any) {
      console.error('Error sharing content:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to share content'
      });
    }
  }

  // Get content stats
  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { authorId } = req.query;
      const where: any = authorId ? { authorId: authorId as string } : {};

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
        totalComments
      ] = await Promise.all([
        prisma.content.count({ where }),
        prisma.content.count({ where: { ...where, status: 'PUBLISHED' } }),
        prisma.content.count({ where: { ...where, status: 'DRAFT' } }),
        prisma.content.count({ where: { ...where, status: 'SCHEDULED' } }),
        prisma.content.count({ where: { ...where, status: 'REVIEW' } }),
        prisma.content.count({ where: { ...where, status: 'ARCHIVED' } }),
        prisma.content.aggregate({
          where,
          _sum: { views: true }
        }),
        prisma.content.aggregate({
          where,
          _sum: { likes: true }
        }),
        prisma.content.aggregate({
          where,
          _sum: { shares: true }
        }),
        prisma.content.aggregate({
          where,
          _sum: { comments: true }
        })
      ]);

      const totalEngagements = (totalLikes._sum.likes || 0) + 
                               (totalComments._sum.comments || 0) + 
                               (totalShares._sum.shares || 0);
      const engagementRate = totalViews._sum.views 
        ? ((totalEngagements / totalViews._sum.views) * 100).toFixed(2)
        : '0.00';

      res.status(200).json({
        success: true,
        data: {
          total,
          byStatus: {
            published,
            draft,
            scheduled,
            review,
            archived
          },
          analytics: {
            totalViews: totalViews._sum.views || 0,
            totalLikes: totalLikes._sum.likes || 0,
            totalShares: totalShares._sum.shares || 0,
            totalComments: totalComments._sum.comments || 0,
            engagementRate: parseFloat(engagementRate)
          }
        }
      });
    } catch (error: any) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get stats'
      });
    }
  }

  // Get trending content
  async getTrending(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

      const content = await prisma.content.findMany({
        where: {
          status: 'PUBLISHED'
        },
        take: limit,
        orderBy: [
          { views: 'desc' },
          { likes: 'desc' }
        ],
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          category: true,
          tags: true
        }
      });

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error: any) {
      console.error('Error getting trending:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get trending content'
      });
    }
  }

  // Get related content
  async getRelated(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

      const content = await prisma.content.findUnique({
        where: { id },
        include: { tags: true, category: true }
      });

      if (!content) {
        res.status(404).json({
          success: false,
          message: 'Content not found'
        });
        return;
      }

      const tagIds = content.tags.map(tag => tag.id);

      const related = await prisma.content.findMany({
        where: {
          AND: [
            { id: { not: id } },
            { status: 'PUBLISHED' },
            {
              OR: [
                { categoryId: content.categoryId },
                { tags: { some: { id: { in: tagIds } } } }
              ]
            }
          ]
        },
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          category: true,
          tags: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: related
      });
    } catch (error: any) {
      console.error('Error getting related content:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get related content'
      });
    }
  }
}

export default new ContentController();