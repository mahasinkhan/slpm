// server/src/services/blog.service.ts
import { PrismaClient, ContentType, ContentStatus, Prisma } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// Helper function to calculate read time
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Helper function to generate excerpt
const generateExcerpt = (content: string, length: number = 150): string => {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return plainText.length > length 
    ? plainText.substring(0, length) + '...' 
    : plainText;
};

// Helper function to generate unique slug
const generateUniqueSlug = async (title: string, existingId?: string): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.content.findFirst({
      where: {
        slug,
        ...(existingId && { NOT: { id: existingId } })
      }
    });

    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export interface CreateBlogPostDto {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  type?: ContentType;
  status?: ContentStatus;
  featured?: boolean;
  categoryId?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  scheduledAt?: string | Date;
  authorId: string;
}

export interface UpdateBlogPostDto {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  type?: ContentType;
  status?: ContentStatus;
  featured?: boolean;
  categoryId?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  scheduledAt?: string | Date;
}

export interface GetBlogPostsQuery {
  type?: ContentType;
  status?: ContentStatus;
  categoryId?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class BlogService {
  // Create blog post
  async createBlogPost(data: CreateBlogPostDto) {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      type = ContentType.BLOG,
      status = ContentStatus.DRAFT,
      featured = false,
      categoryId,
      tags = [],
      metaTitle,
      metaDescription,
      metaKeywords,
      scheduledAt,
      authorId
    } = data;

    // Generate slug
    const slug = await generateUniqueSlug(title);

    // Calculate read time
    const readTime = calculateReadTime(content);

    // Generate excerpt if not provided
    const postExcerpt = excerpt || generateExcerpt(content);

    // Create blog post
    const blogPost = await prisma.content.create({
      data: {
        title,
        slug,
        content,
        excerpt: postExcerpt,
        featuredImage,
        type,
        status,
        featured,
        readTime,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || postExcerpt,
        metaKeywords,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        authorId,
        ...(categoryId && { categoryId }),
        ...(tags.length > 0 && {
          tags: {
            connectOrCreate: tags.map(tag => ({
              where: { name: tag },
              create: { 
                name: tag,
                slug: slugify(tag, { lower: true, strict: true })
              }
            }))
          }
        })
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

    return blogPost;
  }

  // Get all blog posts with filters
  async getAllBlogPosts(query: GetBlogPostsQuery) {
    const {
      type,
      status,
      categoryId,
      tag,
      search,
      featured,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ContentWhereInput = {};

    // Filter by type - IMPORTANT: Accept multiple types for news/blog/articles
    if (type && Object.values(ContentType).includes(type)) {
      where.type = type;
    }
    // If no type specified, show NEWS, BLOG, ARTICLE, and ANNOUNCEMENT
    // This allows the public page to show all content types
    if (!type) {
      where.type = {
        in: [ContentType.NEWS, ContentType.BLOG, ContentType.ARTICLE, ContentType.ANNOUNCEMENT]
      };
    }

    // Filter by status
    if (status && Object.values(ContentStatus).includes(status)) {
      where.status = status;
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by tag
    if (tag) {
      where.tags = {
        some: {
          slug: tag
        }
      };
    }

    // Filter by featured
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Search by title or content
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const total = await prisma.content.count({ where });

    // Get blog posts
    const blogPosts = await prisma.content.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
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

    return {
      posts: blogPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get blog post by ID or slug
  async getBlogPost(identifier: string) {
    const blogPost = await prisma.content.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
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

    if (!blogPost) {
      throw new Error('Blog post not found');
    }

    // Increment views
    await prisma.content.update({
      where: { id: blogPost.id },
      data: { views: { increment: 1 } }
    });

    return blogPost;
  }

  // Update blog post
  async updateBlogPost(id: string, data: UpdateBlogPostDto) {
    // Check if post exists
    const existingPost = await prisma.content.findUnique({
      where: { id }
    });

    if (!existingPost) {
      throw new Error('Blog post not found');
    }

    const updateData: any = {};
    
    if (data.title !== undefined) {
      updateData.title = data.title;
      // Regenerate slug if title changed
      if (data.title !== existingPost.title) {
        updateData.slug = await generateUniqueSlug(data.title, id);
      }
    }
    
    if (data.content !== undefined) {
      updateData.content = data.content;
      updateData.readTime = calculateReadTime(data.content);
      if (!data.excerpt) {
        updateData.excerpt = generateExcerpt(data.content);
      }
    }
    
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
    if (data.metaKeywords !== undefined) updateData.metaKeywords = data.metaKeywords;
    if (data.scheduledAt !== undefined) {
      updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    }
    
    // Handle status change
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === ContentStatus.PUBLISHED && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Handle tags update
    if (data.tags !== undefined) {
      updateData.tags = {
        set: [],
        connectOrCreate: data.tags.map((tag: string) => ({
          where: { name: tag },
          create: { 
            name: tag,
            slug: slugify(tag, { lower: true, strict: true })
          }
        }))
      };
    }

    const blogPost = await prisma.content.update({
      where: { id },
      data: updateData,
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

    return blogPost;
  }

  // Delete blog post
  async deleteBlogPost(id: string) {
    const blogPost = await prisma.content.findUnique({
      where: { id }
    });

    if (!blogPost) {
      throw new Error('Blog post not found');
    }

    await prisma.content.delete({
      where: { id }
    });

    return { message: 'Blog post deleted successfully' };
  }

  // Get blog statistics
  async getBlogStats() {
    // Get stats for all content types (NEWS, BLOG, ARTICLE, ANNOUNCEMENT)
    const contentTypes = [ContentType.NEWS, ContentType.BLOG, ContentType.ARTICLE, ContentType.ANNOUNCEMENT];
    
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      reviewPosts,
      totalViews,
      avgReadTime
    ] = await Promise.all([
      prisma.content.count({ 
        where: { type: { in: contentTypes } } 
      }),
      prisma.content.count({ 
        where: { 
          type: { in: contentTypes },
          status: ContentStatus.PUBLISHED 
        } 
      }),
      prisma.content.count({ 
        where: { 
          type: { in: contentTypes },
          status: ContentStatus.DRAFT 
        } 
      }),
      prisma.content.count({ 
        where: { 
          type: { in: contentTypes },
          status: ContentStatus.REVIEW 
        } 
      }),
      prisma.content.aggregate({ 
        _sum: { views: true },
        where: { type: { in: contentTypes } }
      }),
      prisma.content.aggregate({
        _avg: { readTime: true },
        where: { 
          type: { in: contentTypes },
          status: ContentStatus.PUBLISHED 
        }
      })
    ]);

    // Get engagement metrics
    const engagement = await prisma.content.aggregate({
      _sum: { likes: true, comments: true, shares: true },
      where: { type: { in: contentTypes } }
    });

    const totalEngagements = (engagement._sum.likes || 0) + 
                            (engagement._sum.comments || 0) + 
                            (engagement._sum.shares || 0);
    const engagementRate = totalPosts > 0 
      ? (totalEngagements / totalPosts) * 0.01
      : 0;

    return {
      total: totalPosts,
      totalPosts,
      publishedPosts,
      draftPosts,
      reviewPosts,
      totalViews: totalViews._sum.views || 0,
      avgReadTime: Math.round(avgReadTime._avg.readTime || 3),
      totalShares: engagement._sum.shares || 0,
      engagementRate: parseFloat((engagementRate * 100).toFixed(1))
    };
  }

  // Like/Unlike post
  async toggleLike(postId: string, userId: string) {
    const existingLike = await prisma.contentLike.findUnique({
      where: {
        contentId_userId: {
          contentId: postId,
          userId
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.contentLike.delete({
        where: { id: existingLike.id }
      });

      await prisma.content.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } }
      });

      return { liked: false, message: 'Post unliked' };
    } else {
      // Like
      await prisma.contentLike.create({
        data: {
          contentId: postId,
          userId
        }
      });

      await prisma.content.update({
        where: { id: postId },
        data: { likes: { increment: 1 } }
      });

      return { liked: true, message: 'Post liked' };
    }
  }

  // Track share
  async trackShare(postId: string, platform: string, ipAddress?: string, userAgent?: string) {
    await prisma.contentShare.create({
      data: {
        contentId: postId,
        platform,
        ipAddress,
        userAgent
      }
    });

    await prisma.content.update({
      where: { id: postId },
      data: { shares: { increment: 1 } }
    });

    return { message: 'Share tracked successfully' };
  }
}

export default new BlogService();