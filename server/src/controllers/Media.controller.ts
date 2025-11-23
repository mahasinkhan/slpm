import { Response } from 'express';
import { AuthRequest } from '../types';
import { PrismaClient, MediaType } from '@prisma/client';
import cloudinary from '../config/cloudinary.config';
import { Readable } from 'stream';
import axios from 'axios';

const prisma = new PrismaClient();

// Helper function to determine media type from file
const getMediaType = (mimetype: string, filename: string): MediaType => {
  // Check mimetype first
  if (mimetype.startsWith('image/')) return MediaType.IMAGE;
  if (mimetype.startsWith('video/')) return MediaType.VIDEO;
  if (mimetype.startsWith('audio/')) return MediaType.AUDIO;
  
  // Check by file extension for documents
  const ext = filename.toLowerCase().split('.').pop();
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
  
  if (ext && documentExtensions.includes(ext)) {
    return MediaType.DOCUMENT;
  }
  
  // Default to DOCUMENT for other file types
  return MediaType.DOCUMENT;
};

// Helper function to determine Cloudinary folder
const getCloudinaryFolder = (mediaType: MediaType): string => {
  const folderMap = {
    [MediaType.IMAGE]: 'media/images',
    [MediaType.VIDEO]: 'media/videos',
    [MediaType.AUDIO]: 'media/audio',
    [MediaType.DOCUMENT]: 'media/documents'
  };
  return folderMap[mediaType];
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Helper function to determine content type
const getContentType = (mediaType: MediaType, fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  // Map based on file extension
  const extensionMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'flac': 'audio/flac',
  };

  return extension && extensionMap[extension] 
    ? extensionMap[extension] 
    : 'application/octet-stream';
};

// Upload media to Cloudinary and save to database
export const uploadMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file provided'
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { folder = 'root', description, tags, isPublic } = req.body;

    // Determine media type
    const mediaType = getMediaType(req.file.mimetype, req.file.originalname);
    
    // Determine Cloudinary folder
    const cloudinaryFolder = getCloudinaryFolder(mediaType);

    // Convert buffer to stream
    const stream = Readable.from(req.file.buffer);

    // Upload configuration based on media type
    const uploadOptions: any = {
      folder: cloudinaryFolder,
      resource_type: 'auto',
      public_id: `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, '')}`,
    };

    // Add transformation for images
    if (mediaType === MediaType.IMAGE) {
      uploadOptions.transformation = [
        { width: 1920, height: 1920, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ];
    }

    // Upload to Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    // Prepare data for database
    const fileSize = formatFileSize(req.file.size);
    const dimensions = (result.width && result.height) 
      ? `${result.width}x${result.height}` 
      : null;
    const duration = result.duration ? Math.round(result.duration) : null;

    // Generate thumbnail for videos
    let thumbnailUrl = null;
    if (mediaType === MediaType.VIDEO && result.public_id) {
      thumbnailUrl = cloudinary.url(result.public_id, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 400, crop: 'scale' },
          { quality: 'auto' }
        ]
      });
    }

    // Parse tags if provided
    let tagArray: string[] = [];
    if (tags) {
      if (typeof tags === 'string') {
        tagArray = tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      } else if (Array.isArray(tags)) {
        tagArray = tags;
      }
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        title: req.file.originalname,
        description: description || null,
        type: mediaType,
        url: result.secure_url,
        thumbnailUrl,
        size: fileSize,
        duration,
        dimensions,
        folder: folder || 'root',
        public: isPublic === 'true' || isPublic === true,
        uploadedById: req.user.id,
        ...(tagArray.length > 0 && {
          tags: {
            connectOrCreate: tagArray.map(tag => ({
              where: { name: tag },
              create: { name: tag }
            }))
          }
        })
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        tags: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: media
    });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload media'
    });
  }
};

// Get all media
export const getAllMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { 
      type, 
      folder, 
      search,
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};

    // Filter by type
    if (type && Object.values(MediaType).includes(type as MediaType)) {
      where.type = type as MediaType;
    }

    // Filter by folder
    if (folder) {
      where.folder = folder as string;
    }

    // Search by title or description
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const total = await prisma.media.count({ where });

    // Get media
    const media = await prisma.media.findMany({
      where,
      skip,
      take: parseInt(limit as string),
      orderBy: { [sortBy as string]: sortOrder as 'asc' | 'desc' },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        tags: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        media,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      }
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve media'
    });
  }
};

// Get media by ID
export const getMediaById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        tags: true
      }
    });

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Media not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Get media by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve media'
    });
  }
};

// Update media
export const updateMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, folder, public: isPublic, tags } = req.body;

    // Check if media exists
    const existingMedia = await prisma.media.findUnique({
      where: { id }
    });

    if (!existingMedia) {
      res.status(404).json({
        success: false,
        message: 'Media not found'
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (folder !== undefined) updateData.folder = folder;
    if (isPublic !== undefined) updateData.public = isPublic;

    // Handle tags update
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim());
      
      // Disconnect all existing tags and connect new ones
      updateData.tags = {
        set: [], // Clear existing tags
        connectOrCreate: tagArray.map((tag: string) => ({
          where: { name: tag },
          create: { name: tag }
        }))
      };
    }

    const media = await prisma.media.update({
      where: { id },
      data: updateData,
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        tags: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Media updated successfully',
      data: media
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update media'
    });
  }
};

// Delete media
export const deleteMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Get media details
    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Media not found'
      });
      return;
    }

    // Extract public_id from Cloudinary URL
    const urlParts = media.url.split('/');
    const publicIdWithExtension = urlParts.slice(-2).join('/');
    const publicId = publicIdWithExtension.split('.')[0];

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: media.type === MediaType.VIDEO ? 'video' : 'image'
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary delete error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media'
    });
  }
};

// Track media view
export const trackView = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Media not found'
      });
      return;
    }

    // Increment view count
    await prisma.media.update({
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
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track view'
    });
  }
};

// Track media download
export const trackDownload = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Media not found'
      });
      return;
    }

    // Increment download count
    await prisma.media.update({
      where: { id },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Download tracked successfully'
    });
  } catch (error) {
    console.error('Track download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track download'
    });
  }
};

// **NEW: Download media file**
export const downloadMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Get file details from database
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Media not found',
      });
      return;
    }

    // Extract public_id from Cloudinary URL
    // Example URL: https://res.cloudinary.com/xxx/image/upload/v123/media/documents/filename.pdf
    const urlParts = media.url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    // Get everything after 'upload/v123456/'
    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension to get public_id
    const publicId = pathAfterVersion.replace(/\.[^/.]+$/, '');

    console.log('Downloading file:', {
      mediaId: id,
      title: media.title,
      url: media.url,
      publicId: publicId,
      type: media.type
    });

    // Determine resource type for Cloudinary
    let resourceType: 'image' | 'video' | 'raw' = 'raw';
    if (media.type === MediaType.IMAGE) resourceType = 'image';
    else if (media.type === MediaType.VIDEO) resourceType = 'video';

    // Generate signed URL for secure download
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: 'upload',
      sign_url: true,
      secure: true,
    });

    console.log('Signed URL generated:', signedUrl);

    // Fetch the file from Cloudinary
    const response = await axios({
      method: 'get',
      url: signedUrl,
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    });

    // Determine content type
    const contentType = getContentType(media.type, media.title);

    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(media.title)}"`);
    res.setHeader('Content-Length', response.data.length);
    res.setHeader('Cache-Control', 'no-cache');

    // Track download (increment downloads count)
    await prisma.media.update({
      where: { id },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    console.log('File downloaded successfully');

    // Send the file
    res.send(response.data);

  } catch (error: any) {
    console.error('Download error:', error);
    
    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        message: 'File not found in storage',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message,
    });
  }
};