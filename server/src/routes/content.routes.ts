// src/routes/content.routes.ts
import { Router } from 'express';
import ContentController from '../controllers/content.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/roleCheck.middleware';
import { Role } from '@prisma/client';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for images
  },
  fileFilter: (req, file, cb) => {
    // Accept images only for content featured images
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed for featured images'));
    }
  }
});

// ==================== PUBLIC ROUTES ====================
// Accessible without authentication

// Get public content (published only)
router.get('/public', (req, res) => ContentController.getPublicContent(req, res));

// Get content by slug
router.get('/slug/:slug', (req, res) => ContentController.getContentBySlug(req, res));

// Get single content by ID
router.get('/:id', (req, res) => ContentController.getContentById(req, res));

// Track content view
router.post('/:id/view', (req, res) => ContentController.trackView(req, res));

// Like/unlike content
router.post('/:id/like', (req, res) => ContentController.likeContent(req, res));

// ==================== PROTECTED ROUTES ====================
// Require authentication and appropriate roles

// Get all content (Admin view with filters)
router.get(
  '/',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  (req, res) => ContentController.getAllContent(req, res)
);

// Create new content
router.post(
  '/',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  upload.single('featuredImage'),
  (req, res) => ContentController.createContent(req, res)
);

// Publish content
router.post(
  '/:id/publish',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  (req, res) => ContentController.publishContent(req, res)
);

// Update content
router.put(
  '/:id',
  authenticateToken,
  checkRole(Role.ADMIN, Role.SUPERADMIN),
  upload.single('featuredImage'),
  (req, res) => ContentController.updateContent(req, res)
);

// Delete content (SUPERADMIN only)
router.delete(
  '/:id',
  authenticateToken,
  checkRole(Role.SUPERADMIN),
  (req, res) => ContentController.deleteContent(req, res)
);

export default router;