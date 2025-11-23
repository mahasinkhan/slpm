import { Response } from 'express';
import { AuthRequest } from '../types';
import cloudinary from '../config/cloudinary.config';
import { Readable } from 'stream';

// Upload image to Cloudinary
export const uploadImage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
      return;
    }

    // Convert buffer to stream
    const stream = Readable.from(req.file.buffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sl-brothers',
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.pipe(uploadStream);
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete image from Cloudinary
export const deleteImage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
      return;
    }

    // Decode the public ID (in case it was URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: result
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted',
        data: result
      });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get images from Cloudinary (list resources)
export const getImages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { folder = 'sl-brothers', maxResults = 30 } = req.query;

    // Get resources from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder as string,
      max_results: parseInt(maxResults as string)
    });

    res.status(200).json({
      success: true,
      message: 'Images retrieved successfully',
      data: {
        resources: result.resources,
        total: result.resources.length
      }
    });
  } catch (error) {
    console.error('Cloudinary get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get image details by public ID
export const getImageDetails = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
      return;
    }

    const decodedPublicId = decodeURIComponent(publicId);

    // Get resource details
    const result = await cloudinary.api.resource(decodedPublicId);

    res.status(200).json({
      success: true,
      message: 'Image details retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Cloudinary get image details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve image details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};