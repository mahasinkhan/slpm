import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

class TagService {
  // Get all tags
  async getAllTags() {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { content: true, media: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return tags;
  }

  // Get popular tags
  async getPopularTags(limit = 10) {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { content: true }
        }
      },
      orderBy: {
        content: {
          _count: 'desc'
        }
      },
      take: limit
    });

    return tags;
  }

  // Get tag by slug
  async getTag(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { content: true, media: true }
        }
      }
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    return tag;
  }

  // Create tag
  async createTag(name: string, color?: string) {
    const slug = slugify(name, { lower: true, strict: true });

    const tag = await prisma.tag.create({
      data: { name, slug, color }
    });

    return tag;
  }

  // Update tag
  async updateTag(id: string, name?: string, color?: string) {
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }
    if (color !== undefined) updateData.color = color;

    const tag = await prisma.tag.update({
      where: { id },
      data: updateData
    });

    return tag;
  }

  // Delete tag
  async deleteTag(id: string) {
    await prisma.tag.delete({
      where: { id }
    });

    return { message: 'Tag deleted successfully' };
  }
}

export default new TagService();