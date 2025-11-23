// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import userService from '../services/user.service';
import { EmploymentStatus, Role } from '@prisma/client';
import prismaProxy from '../config/database';
import bcrypt from 'bcryptjs';

export class UserController {
  // Get all users with pagination
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await userService.getAllUsers(page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch users'
      });
    }
  }

  // Get single user by ID
  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const user = await prismaProxy.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new user
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, firstName, lastName, phone, role } = req.body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, firstName, and lastName are required'
        });
      }

      // Check if user already exists
      const existingUser = await prismaProxy.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await prismaProxy.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          role: role || Role.EMPLOYEE,
          status: EmploymentStatus.ACTIVE,
          // @ts-ignore - createdBy will be added via middleware
          createdBy: req.user?.id || null
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error) {
      console.error('Create user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone, email } = req.body;

      // Check if user exists
      const existingUser = await prismaProxy.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // If email is being updated, check if it's already taken
      if (email && email !== existingUser.email) {
        const emailTaken = await prismaProxy.user.findUnique({
          where: { email }
        });

        if (emailTaken) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }

      // Update user
      const updatedUser = await prismaProxy.user.update({
        where: { id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phone !== undefined && { phone }),
          ...(email && { email })
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Update user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update user status
  async updateUserStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      if (!status || !Object.values(EmploymentStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status is required (ACTIVE, INACTIVE, SUSPENDED, TERMINATED)'
        });
      }

      // Check if user exists
      const existingUser = await prismaProxy.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update status
      const updatedUser = await prismaProxy.user.update({
        where: { id },
        data: { status },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User status updated successfully'
      });
    } catch (error) {
      console.error('Update user status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update user role
  async updateUserRole(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (!role || !Object.values(Role).includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Valid role is required (SUPERADMIN, ADMIN, EMPLOYEE)'
        });
      }

      // Check if user exists
      const existingUser = await prismaProxy.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update role
      const updatedUser = await prismaProxy.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User role updated successfully'
      });
    } catch (error) {
      console.error('Update user role error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user role',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await prismaProxy.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent deleting SUPERADMIN (optional security measure)
      if (existingUser.role === Role.SUPERADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete SUPERADMIN user'
        });
      }

      // Delete user
      await prismaProxy.user.delete({
        where: { id }
      });

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Hire employee
  async hireEmployee(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      const result = await userService.hireEmployee(id);
      
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Employee hired successfully'
      });
    } catch (error) {
      console.error('Hire employee error:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to hire employee'
      });
    }
  }

  // Fire employee
  async fireEmployee(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      const result = await userService.fireEmployee(id);
      
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Employee fired successfully'
      });
    } catch (error) {
      console.error('Fire employee error:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fire employee'
      });
    }
  }

  // Get user statistics
  async getUserStats(req: Request, res: Response): Promise<Response> {
    try {
      const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        terminatedUsers,
        superAdmins,
        admins,
        employees
      ] = await Promise.all([
        prismaProxy.user.count(),
        prismaProxy.user.count({ where: { status: EmploymentStatus.ACTIVE } }),
        prismaProxy.user.count({ where: { status: EmploymentStatus.INACTIVE } }),
        prismaProxy.user.count({ where: { status: EmploymentStatus.SUSPENDED } }),
        prismaProxy.user.count({ where: { status: EmploymentStatus.TERMINATED } }),
        prismaProxy.user.count({ where: { role: Role.SUPERADMIN } }),
        prismaProxy.user.count({ where: { role: Role.ADMIN } }),
        prismaProxy.user.count({ where: { role: Role.EMPLOYEE } })
      ]);

      return res.status(200).json({
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          suspended: suspendedUsers,
          terminated: terminatedUsers,
          superadmins: superAdmins,
          admins: admins,
          employees: employees
        },
        message: 'User statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new UserController();