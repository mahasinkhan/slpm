import { Router } from 'express';
import multer from 'multer';
import { authenticateToken, authorize } from '../middleware/auth.middleware'; // ✅ Fixed import
import { Role } from '@prisma/client';
import {
  uploadImage,
  deleteImage,
  getImages
} from '../controllers/cloudinary.controller';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public route - get images
router.get('/', getImages);

// Protected routes - require authentication and admin role
router.post(
  '/upload',
  authenticateToken,
  authorize([Role.ADMIN]),
  upload.single('image'),
  uploadImage
);

router.delete(
  '/:publicId',
  authenticateToken,
  authorize([Role.ADMIN]),
  deleteImage
);

export default router;