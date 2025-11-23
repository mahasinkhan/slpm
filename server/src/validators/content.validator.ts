// src/validators/content.validator.ts

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface ContentInput {
  title?: string;
  excerpt?: string;
  content?: string;
  type?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  publishNow?: boolean;
  scheduledDate?: string | Date;
  tags?: string[];
}

export function validateContent(data: ContentInput): ValidationResult {
  const errors: string[] = [];

  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required and must be a string');
  } else if (data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  } else if (data.title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }

  // Excerpt validation
  if (data.excerpt !== undefined && data.excerpt !== null) {
    if (typeof data.excerpt !== 'string') {
      errors.push('Excerpt must be a string');
    } else if (data.excerpt.length > 500) {
      errors.push('Excerpt must not exceed 500 characters');
    }
  }

  // Content validation
  if (!data.content || typeof data.content !== 'string') {
    errors.push('Content is required and must be a string');
  } else if (data.content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  }

  // Type validation
  const validTypes = ['article', 'news', 'blog', 'announcement', 'event', 'gallery', 'video'];
  if (!data.type) {
    errors.push('Content type is required');
  } else if (!validTypes.includes(data.type)) {
    errors.push(`Content type must be one of: ${validTypes.join(', ')}`);
  }

  // Category validation
  const validCategories = [
    'general',
    'technology',
    'business',
    'education',
    'health',
    'entertainment',
    'sports',
    'lifestyle',
    'science',
    'politics',
    'culture',
    'travel',
    'food',
    'fashion',
    'finance',
    'real-estate',
    'automotive',
    'environment'
  ];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  // Status validation
  const validStatuses = ['draft', 'published', 'archived', 'scheduled'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Featured validation
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.push('Featured must be a boolean value');
  }

  // PublishNow validation
  if (data.publishNow !== undefined && typeof data.publishNow !== 'boolean') {
    errors.push('PublishNow must be a boolean value');
  }

  // Scheduled date validation
  if (data.scheduledDate) {
    const scheduledDate = new Date(data.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      errors.push('Scheduled date must be a valid date');
    } else if (scheduledDate < new Date()) {
      errors.push('Scheduled date must be in the future');
    }
  }

  // Tags validation
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    } else if (data.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    } else {
      const invalidTags = data.tags.filter(
        tag => typeof tag !== 'string' || tag.trim().length === 0 || tag.length > 30
      );
      if (invalidTags.length > 0) {
        errors.push('Each tag must be a non-empty string with maximum 30 characters');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateContentUpdate(data: Partial<ContentInput>): ValidationResult {
  const errors: string[] = [];

  // Title validation (optional for updates)
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      errors.push('Title must be a string');
    } else if (data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    } else if (data.title.length > 200) {
      errors.push('Title must not exceed 200 characters');
    }
  }

  // Excerpt validation (optional for updates)
  if (data.excerpt !== undefined && data.excerpt !== null) {
    if (typeof data.excerpt !== 'string') {
      errors.push('Excerpt must be a string');
    } else if (data.excerpt.length > 500) {
      errors.push('Excerpt must not exceed 500 characters');
    }
  }

  // Content validation (optional for updates)
  if (data.content !== undefined) {
    if (typeof data.content !== 'string') {
      errors.push('Content must be a string');
    } else if (data.content.trim().length < 10) {
      errors.push('Content must be at least 10 characters long');
    }
  }

  // Type validation (optional for updates)
  const validTypes = ['article', 'news', 'blog', 'announcement', 'event', 'gallery', 'video'];
  if (data.type !== undefined && !validTypes.includes(data.type)) {
    errors.push(`Content type must be one of: ${validTypes.join(', ')}`);
  }

  // Category validation (optional for updates)
  const validCategories = [
    'general',
    'technology',
    'business',
    'education',
    'health',
    'entertainment',
    'sports',
    'lifestyle',
    'science',
    'politics',
    'culture',
    'travel',
    'food',
    'fashion',
    'finance',
    'real-estate',
    'automotive',
    'environment'
  ];
  if (data.category !== undefined && !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  // Status validation (optional for updates)
  const validStatuses = ['draft', 'published', 'archived', 'scheduled'];
  if (data.status !== undefined && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Featured validation (optional for updates)
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.push('Featured must be a boolean value');
  }

  // Scheduled date validation (optional for updates)
  if (data.scheduledDate !== undefined) {
    const scheduledDate = new Date(data.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      errors.push('Scheduled date must be a valid date');
    } else if (scheduledDate < new Date()) {
      errors.push('Scheduled date must be in the future');
    }
  }

  // Tags validation (optional for updates)
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    } else if (data.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    } else {
      const invalidTags = data.tags.filter(
        tag => typeof tag !== 'string' || tag.trim().length === 0 || tag.length > 30
      );
      if (invalidTags.length > 0) {
        errors.push('Each tag must be a non-empty string with maximum 30 characters');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Additional helper validators
export function validateSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 200;
}

export function sanitizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function validateMediaType(mimetype: string): boolean {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'application/pdf'
  ];
  return allowedMimes.includes(mimetype);
}