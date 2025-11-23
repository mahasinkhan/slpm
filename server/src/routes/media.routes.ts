import { NextFunction, Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import * as mediaController from '../controllers/Media.controller';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, audio, and documents
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac',
      'application/pdf', 
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/csv'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, audio, and documents are allowed'));
    }
  },
});

// Public routes (no authentication required)
router.get('/', authenticateToken, mediaController.getAllMedia);
router.get('/:id', authenticateToken, mediaController.getMediaById);

// Protected routes - require authentication
router.post(
  '/upload',
  authenticateToken,
  upload.single('files'), // Changed from 'file' to 'files' to match frontend
  mediaController.uploadMedia
);

router.put('/:id', authenticateToken, mediaController.updateMedia);
router.delete('/:id',authenticateToken, mediaController.deleteMedia);

// Track views and downloads
router.post('/:id/view', authenticateToken, mediaController.trackView);
router.post('/:id/download', authenticateToken, mediaController.trackDownload);

// **NEW: Download file endpoint**
router.get('/:id/download', authenticateToken, mediaController.downloadMedia);

export default router;