import { Response } from 'express';
import { AuthRequest } from '../types';
import { ContentType, ContentStatus } from '@prisma/client';
import blogService from '../services/blog.service';
import categoryService from '../services/category.service';
import tagService from '../services/tag.service';

// ==================== BLOG POSTS ====================

export const createBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
      return;
    }

    // Parse tags
    let tags: string[] = [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        tags = req.body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      } else if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      }
    }

    const blogPost = await blogService.createBlogPost({
      ...req.body,
      tags,
      authorId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blogPost
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create blog post'
    });
  }
};

export const getAllBlogPosts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      status,
      categoryId,
      tag,
      search,
      featured,
      page,
      limit,
      sortBy,
      sortOrder
    } = req.query;

    const result = await blogService.getAllBlogPosts({
      type: type as ContentType,
      status: status as ContentStatus,
      categoryId: categoryId as string,
      tag: tag as string,
      search: search as string,
      featured: featured === 'true',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog posts'
    });
  }
};

export const getBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { identifier } = req.params;

    const blogPost = await blogService.getBlogPost(identifier);

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    
    if (error instanceof Error && error.message === 'Blog post not found') {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog post'
    });
  }
};

export const updateBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Parse tags if provided
    let tags: string[] | undefined;
    if (req.body.tags !== undefined) {
      if (typeof req.body.tags === 'string') {
        tags = req.body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      } else if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      }
    }

    const blogPost = await blogService.updateBlogPost(id, {
      ...req.body,
      tags
    });

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blogPost
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    
    if (error instanceof Error && error.message === 'Blog post not found') {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update blog post'
    });
  }
};

export const deleteBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await blogService.deleteBlogPost(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    
    if (error instanceof Error && error.message === 'Blog post not found') {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post'
    });
  }
};

export const getBlogStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const stats = await blogService.getBlogStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog statistics'
    });
  }
};

export const toggleLike = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { id } = req.params;

    const result = await blogService.toggleLike(id, req.user.id);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like'
    });
  }
};

export const trackShare = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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

    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await blogService.trackShare(id, platform, ipAddress, userAgent);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Track share error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track share'
    });
  }
};

// ==================== CATEGORIES ====================

export const createCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
      return;
    }

    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create category'
    });
  }
};

export const getAllCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { includeInactive } = req.query;

    const categories = await categoryService.getAllCategories(
      includeInactive === 'true'
    );

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories'
    });
  }
};

export const getCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { identifier } = req.params;

    const category = await categoryService.getCategory(identifier);

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    
    if (error instanceof Error && error.message === 'Category not found') {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve category'
    });
  }
};

export const updateCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await categoryService.updateCategory(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete category'
    });
  }
};

// ==================== TAGS ====================

export const getAllTags = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tags = await tagService.getAllTags();

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tags'
    });
  }
};

export const getPopularTags = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { limit } = req.query;

    const tags = await tagService.getPopularTags(
      limit ? parseInt(limit as string) : undefined
    );

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve popular tags'
    });
  }
};

export const getTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const tag = await tagService.getTag(slug);

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Get tag error:', error);
    
    if (error instanceof Error && error.message === 'Tag not found') {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tag'
    });
  }
};

export const createTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, color } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Tag name is required'
      });
      return;
    }

    const tag = await tagService.createTag(name, color);

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tag'
    });
  }
};

export const updateTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await tagService.updateTag(id, name, color);

    res.status(200).json({
      success: true,
      message: 'Tag updated successfully',
      data: tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tag'
    });
  }
};

export const deleteTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await tagService.deleteTag(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tag'
    });
  }
};