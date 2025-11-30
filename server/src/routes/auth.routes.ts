// src/routes/auth.routes.ts - COMPLETE UPDATED VERSION
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();
const authController = new AuthController();

// ==================== PUBLIC ROUTES ====================
// No authentication required

/**
 * @route   POST /api/auth/login
 * @desc    Login user (all roles)
 * @access  Public
 * @body    { email: string, password: string }
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @route   POST /api/auth/register
 * @desc    Legacy registration endpoint (kept for backward compatibility)
 * @access  Public
 * @body    { email, password, firstName, lastName, phone? }
 * @note    Consider deprecating in favor of role-specific registration
 */
router.post('/register', (req, res) => authController.register(req, res));

// ==================== PROTECTED ROUTES ====================
// Requires valid JWT token (all authenticated users)

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user / Verify token
 * @access  Private (All authenticated users)
 * @returns User profile with employee data
 */
router.get('/me', 
  authenticateToken, 
  (req, res) => authController.getCurrentUser(req, res)
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile (alias for /me)
 * @access  Private (All authenticated users)
 * @returns User profile with employee data
 */
router.get('/profile', 
  authenticateToken, 
  (req, res) => authController.getProfile(req, res)
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private (All authenticated users)
 * @body    { oldPassword: string, newPassword: string, confirmPassword: string }
 */
router.post('/change-password',
  authenticateToken,
  (req, res) => authController.changePassword(req, res)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (creates audit log entry)
 * @access  Private (All authenticated users)
 */
router.post('/logout',
  authenticateToken,
  (req, res) => authController.logout(req, res)
);

// ==================== ADMIN ROUTES ====================
// Requires SUPERADMIN or ADMIN role

/**
 * @route   POST /api/auth/register-employee
 * @desc    Register new employee
 * @access  Private (SUPERADMIN, ADMIN only)
 * @body    { email, firstName, lastName, phone?, department, position, location?, salary? }
 * @note    - Generates temporary password
 *          - Creates employee record with auto-generated ID
 *          - Sends welcome email
 */
router.post('/register-employee',
  authenticateToken,
  authorize([Role.SUPERADMIN, Role.ADMIN]),
  (req, res) => authController.registerEmployee(req, res)
);

// ==================== SUPERADMIN ONLY ROUTES ====================
// Requires SUPERADMIN role

/**
 * @route   POST /api/auth/register-admin
 * @desc    Register new admin
 * @access  Private (SUPERADMIN only)
 * @body    { email, firstName, lastName, phone?, department?, position?, location?, salary? }
 * @note    - Only SUPERADMIN can create ADMIN users
 *          - Generates temporary password
 *          - Creates employee record
 *          - Sends welcome email
 */
router.post('/register-admin',
  authenticateToken,
  authorize([Role.SUPERADMIN]),
  (req, res) => authController.registerAdmin(req, res)
);

export default router;

// ==================== ROUTE SUMMARY ====================
/*

PUBLIC ROUTES (No Auth):
┌─────────────────────────────────────────────────────────┐
│ POST   /api/auth/login              Login                │
│ POST   /api/auth/register           Legacy registration  │
└─────────────────────────────────────────────────────────┘

AUTHENTICATED ROUTES (All Roles):
┌─────────────────────────────────────────────────────────┐
│ GET    /api/auth/me                 Get current user     │
│ GET    /api/auth/profile            Get profile          │
│ POST   /api/auth/change-password    Change password      │
│ POST   /api/auth/logout             Logout               │
└─────────────────────────────────────────────────────────┘

ADMIN ROUTES (SUPERADMIN + ADMIN):
┌─────────────────────────────────────────────────────────┐
│ POST   /api/auth/register-employee  Register employee    │
└─────────────────────────────────────────────────────────┘

SUPERADMIN ONLY ROUTES:
┌─────────────────────────────────────────────────────────┐
│ POST   /api/auth/register-admin     Register admin       │
└─────────────────────────────────────────────────────────┘

USAGE EXAMPLES:
═════════════════════════════════════════════════════════

1. Login (Public):
   POST /api/auth/login
   Body: { "email": "user@example.com", "password": "pass123" }

2. Get Profile (Authenticated):
   GET /api/auth/me
   Headers: { "Authorization": "Bearer <token>" }

3. Register Employee (Admin):
   POST /api/auth/register-employee
   Headers: { "Authorization": "Bearer <admin-token>" }
   Body: {
     "email": "employee@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "phone": "+44 7405 005825",
     "department": "Technology",
     "position": "Developer",
     "location": "London",
     "salary": 45000
   }

4. Register Admin (SuperAdmin only):
   POST /api/auth/register-admin
   Headers: { "Authorization": "Bearer <superadmin-token>" }
   Body: {
     "email": "admin@example.com",
     "firstName": "Jane",
     "lastName": "Smith",
     "phone": "+44 7405 005826",
     "department": "Administration",
     "position": "System Administrator"
   }

5. Change Password (Authenticated):
   POST /api/auth/change-password
   Headers: { "Authorization": "Bearer <token>" }
   Body: {
     "oldPassword": "current123",
     "newPassword": "newpass123",
     "confirmPassword": "newpass123"
   }

*/