import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

export interface CreateCategoryDto {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parent?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  parent?: string;
  active?: boolean;
}

class CategoryService {
  // Create category
  async createCategory(data: CreateCategoryDto) {
    const { name, description, icon, color, parent } = data;

    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new Error('Category with this name already exists');
    }

    const category = await prisma.category.create({
      data: { name, slug, description, icon, color, parent },
      include: {
        _count: {
          select: { content: true }
        }
      }
    });

    return category;
  }

  // Get all categories
  async getAllCategories(includeInactive = false) {
    const where = includeInactive ? {} : { active: true };

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { content: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    return categories;
  }

  // Get category by ID or slug
  async getCategory(identifier: string) {
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      },
      include: {
        _count: {
          select: { content: true }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  // Update category
  async updateCategory(id: string, data: UpdateCategoryDto) {
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name, { lower: true, strict: true });
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.parent !== undefined) updateData.parent = data.parent;
    if (data.active !== undefined) updateData.active = data.active;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { content: true }
        }
      }
    });

    return category;
  }

  // Delete category
  async deleteCategory(id: string) {
    // Check if category has posts
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { content: true }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category._count.content > 0) {
      throw new Error('Cannot delete category with existing posts. Please reassign or delete posts first.');
    }

    await prisma.category.delete({
      where: { id }
    });

    return { message: 'Category deleted successfully' };
  }
}

export default new CategoryService();