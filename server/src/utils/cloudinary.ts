import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

/**
 * Upload a file to Cloudinary
 * @param buffer - File buffer
 * @param folder - Folder path in Cloudinary
 * @returns Upload result
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'general'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mp3', 'wav', 'pdf', 'doc', 'docx', 'ppt', 'pptx'],
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as UploadResult);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary
 * @param publicId - Public ID or URL of the file
 * @returns Deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    // Extract public ID from URL if full URL is provided
    if (publicId.includes('cloudinary.com')) {
      const urlParts = publicId.split('/');
      const filename = urlParts[urlParts.length - 1];
      const folderPath = urlParts.slice(7, -1).join('/');
      publicId = folderPath ? `${folderPath}/${filename.split('.')[0]}` : filename.split('.')[0];
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate a thumbnail for a video
 * @param videoUrl - URL of the video
 * @returns Thumbnail URL
 */
export const generateVideoThumbnail = (videoUrl: string): string => {
  const publicId = extractPublicId(videoUrl);
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      {
        width: 400,
        height: 300,
        crop: 'fill',
        gravity: 'center',
        format: 'jpg',
        start_offset: '1',
      },
    ],
  });
};

/**
 * Generate optimized image URL
 * @param imageUrl - Original image URL
 * @param width - Target width
 * @param height - Target height
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  imageUrl: string,
  width?: number,
  height?: number
): string => {
  const publicId = extractPublicId(imageUrl);
  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
  });
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID
 */
const extractPublicId = (url: string): string => {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  const folderPath = urlParts.slice(7, -1).join('/');
  return folderPath ? `${folderPath}/${filename.split('.')[0]}` : filename.split('.')[0];
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  generateVideoThumbnail,
  getOptimizedImageUrl,
};