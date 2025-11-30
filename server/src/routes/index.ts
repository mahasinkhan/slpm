// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import employeeRoutes from './employe.routes';
import interviewRoutes from './interview.routes';
import contentRoutes from './content.routes';
import mediaRoutes from './media.routes';
import contactRoutes from './contact.routes';
import terminationRoutes from './termination.routes';
import cloudinaryRoutes from './cloudinary.routes';
import blogRoutes from './blog.routes';
import approvalRoutes from './approval.routes';
import employeeTrackingRouter from './employee-tracking.router';
import visitorTrackingRoutes from './visitorTracking.routes';

// ==================== JOB MANAGEMENT ROUTES ====================
import adminJobRoutes from './job.routes';              // Admin job management
import applicationRoutes from './application.routes';    // Admin application management
import publicJobRoutes from './public-job.routes';       // Public careers page

const router = Router();

// ==================== MOUNT ALL ROUTES ====================

// Authentication & User Management
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Employee Management
router.use('/employees', employeeRoutes);
router.use('/interviews', interviewRoutes);
router.use('/terminations', terminationRoutes);
router.use('/tracking', employeeTrackingRouter); // Employee Work Tracking

// Content Management
router.use('/content', contentRoutes);
router.use('/blog', blogRoutes);
router.use('/media', mediaRoutes);

// Business Operations
router.use('/approvals', approvalRoutes);
router.use('/contact', contactRoutes);

// Analytics & Tracking
router.use('/visitor-tracking', visitorTrackingRoutes); // Website Visitor Analytics

// ==================== JOB MANAGEMENT ====================
// Admin Routes (Protected)
router.use('/admin/jobs', adminJobRoutes);              // Job posting management
router.use('/admin/applications', applicationRoutes);    // Application management

// Public Routes (No Auth Required)
router.use('/jobs', publicJobRoutes);                    // Public careers page

// File Management
router.use('/cloudinary', cloudinaryRoutes);

export default router;