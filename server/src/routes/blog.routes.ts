// src/routes/blog.routes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/roleCheck.middleware';
import { Role } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==================== HELPER FUNCTIONS ====================

const calculateReadTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.content.findFirst({
      where: {
        slug,
        ...(excludeId && { NOT: { id: excludeId } })
      }
    });
    
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// ==================== PUBLIC ROUTES ====================

// Get blog stats (MUST BE BEFORE /:id ROUTES)
router.get('/posts/stats', async (req, res) => {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      reviewPosts,
      totalViews,
      totalShares,
      avgReadTime
    ] = await Promise.all([
      prisma.content.count({ where: { type: 'NEWS' } }),
      prisma.content.count({ where: { type: 'NEWS', status: 'PUBLISHED' } }),
      prisma.content.count({ where: { type: 'NEWS', status: 'DRAFT' } }),
      prisma.content.count({ where: { type: 'NEWS', status: 'REVIEW' } }),
      prisma.content.aggregate({
        where: { type: 'NEWS' },
        _sum: { views: true }
      }),
      prisma.content.aggregate({
        where: { type: 'NEWS' },
        _sum: { shares: true }
      }),
      prisma.content.aggregate({
        where: { type: 'NEWS', status: 'PUBLISHED' },
        _avg: { readTime: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        total: totalPosts,
        totalPosts,
        publishedPosts,
        draftPosts,
        reviewPosts,
        totalViews: totalViews._sum.views || 0,
        avgReadTime: Math.round(avgReadTime._avg.readTime || 3),
        totalShares: totalShares._sum.shares || 0,
        engagementRate: 0
      }
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json({
      success: true,
      data: tags
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all posts (PUBLIC or ADMIN with filters)
router.get('/posts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const isAuthenticated = !!token;
    
    const { status, categoryId } = req.query;
    
    // Build where clause
    const where: any = { type: 'NEWS' };
    
    // If authenticated, allow filtering by status
    if (isAuthenticated && status) {
      where.status = status;
    } else {
      // Public access - only published
      where.status = 'PUBLISHED';
    }
    
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    const posts = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        },
        category: true,
        tags: true,
        _count: {
          select: {
            commentsList: true,
            contentLikes: true,
            contentShares: true
          }
        }
      }
    });

    // Transform data
    const transformedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(t => t.name),
      comments: post._count.commentsList
    }));

    res.json({
      success: true,
      data: transformedPosts
    });
  } catch (error: any) {
    console.error('Posts error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.content.findFirst({
      where: {
        id,
        type: 'NEWS'
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        },
        category: true,
        tags: true,
        _count: {
          select: {
            commentsList: true,
            contentLikes: true,
            contentShares: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const transformedPost = {
      ...post,
      tags: post.tags.map(t => t.name),
      comments: post._count.commentsList
    };

    res.json({
      success: true,
      data: transformedPost
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== PROTECTED ROUTES ====================

// Create new post
router.post(
  '/posts',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  async (req, res) => {
    try {
      const { title, excerpt, content, categoryId, tags, status, featured, featuredImage } = req.body;
      
      // Validate
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      // Generate slug
      const slug = await generateUniqueSlug(title);

      // Calculate read time
      const readTime = calculateReadTime(content);

      // Determine publish date
      const publishedAt = status === 'PUBLISHED' ? new Date() : null;

      // Create post
      const post = await prisma.content.create({
        data: {
          title,
          slug,
          excerpt: excerpt || null,
          content,
          type: 'NEWS',
          status: status || 'DRAFT',
          featured: featured || false,
          featuredImage: featuredImage || null,
          categoryId: categoryId || null,
          publishedAt,
          readTime,
          authorId: (req as any).user.id,
          tags: tags && tags.length > 0 ? {
            connectOrCreate: tags.map((tagName: string) => ({
              where: { name: tagName },
              create: {
                name: tagName,
                slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
              email: true,
              avatar: true
            }
          },
          category: true,
          tags: true
        }
      });

      // Log audit
      await prisma.auditLog.create({
        data: {
          userId: (req as any).user.id,
          action: 'CREATE',
          entity: 'content',
          entityId: post.id,
          changes: JSON.stringify({ title, status })
        }
      });

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: {
          ...post,
          tags: post.tags.map(t => t.name)
        }
      });
    } catch (error: any) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create post'
      });
    }
  }
);

// Update post
router.put(
  '/posts/:id',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, excerpt, content, categoryId, tags, status, featured, featuredImage } = req.body;

      // Check if exists
      const existing = await prisma.content.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // Calculate read time if content changed
      let readTime = existing.readTime;
      if (content && content !== existing.content) {
        readTime = calculateReadTime(content);
      }

      // Update slug if title changed
      let slug = existing.slug;
      if (title && title !== existing.title) {
        slug = await generateUniqueSlug(title, id);
      }

      // Set published date if status changes to PUBLISHED
      let publishedAt = existing.publishedAt;
      if (status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
        publishedAt = new Date();
      }

      // Update post
      const post = await prisma.content.update({
        where: { id },
        data: {
          title: title || existing.title,
          slug,
          excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
          content: content || existing.content,
          status: status || existing.status,
          featured: featured !== undefined ? featured : existing.featured,
          featuredImage: featuredImage !== undefined ? featuredImage : existing.featuredImage,
          categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
          publishedAt,
          readTime,
          tags: tags ? {
            set: [],
            connectOrCreate: tags.map((tagName: string) => ({
              where: { name: tagName },
              create: {
                name: tagName,
                slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
              email: true,
              avatar: true
            }
          },
          category: true,
          tags: true
        }
      });

      // Log audit
      await prisma.auditLog.create({
        data: {
          userId: (req as any).user.id,
          action: 'UPDATE',
          entity: 'content',
          entityId: id,
          changes: JSON.stringify(req.body)
        }
      });

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: {
          ...post,
          tags: post.tags.map(t => t.name)
        }
      });
    } catch (error: any) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update post'
      });
    }
  }
);

// Delete post
router.delete(
  '/posts/:id',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  async (req, res) => {
    try {
      const { id } = req.params;

      const post = await prisma.content.findUnique({ where: { id } });
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      await prisma.content.delete({ where: { id } });

      // Log audit
      await prisma.auditLog.create({
        data: {
          userId: (req as any).user.id,
          action: 'DELETE',
          entity: 'content',
          entityId: id,
          changes: JSON.stringify({ title: post.title })
        }
      });

      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete post'
      });
    }
  }
);

export default router;