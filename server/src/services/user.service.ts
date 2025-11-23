// src/services/user.service.ts
import prismaProxy from '../config/database';
import { UpdateUserDTO } from '../types';
import bcrypt from 'bcryptjs';
import { Role, EmploymentStatus } from '@prisma/client';

class UserService {
  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prismaProxy.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prismaProxy.user.count()
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUserById(userId: string) {
    const user = await prismaProxy.user.findUnique({
      where: { id: userId },
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
        createdBy: true,
        employee: {
          select: {
            id: true,
            employeeId: true,
            department: true,
            position: true,
            joinDate: true,
            salary: true,
            status: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: Role;
  }) {
    const { email, password, firstName, lastName, phone, role } = data;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Email, password, firstName, and lastName are required');
    }

    // Check if user already exists
    const existingUser = await prismaProxy.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
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
        status: EmploymentStatus.INACTIVE
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

    return newUser;
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    // Check if user exists
    const existingUser = await prismaProxy.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // If email is being updated, check if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const emailTaken = await prismaProxy.user.findUnique({
        where: { email: data.email }
      });

      if (emailTaken) {
        throw new Error('Email already in use');
      }
    }

    const user = await prismaProxy.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });

    return user;
  }

  async deleteUser(userId: string) {
    // Check if user exists
    const existingUser = await prismaProxy.user.findUnique({
      where: { id: userId },
      include: {
        employee: true
      }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Prevent deleting SUPERADMIN
    if (existingUser.role === Role.SUPERADMIN) {
      throw new Error('Cannot delete SUPERADMIN user');
    }

    await prismaProxy.user.delete({
      where: { id: userId }
    });

    return { message: 'User deleted successfully' };
  }

  async getUserStats() {
    const [
      total,
      active,
      inactive,
      suspended,
      terminated,
      superadmins,
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

    return {
      total,
      active,
      inactive,
      suspended,
      terminated,
      superadmins,
      admins,
      employees
    };
  }

  async hireEmployee(userId: string) {
    // Check if user exists
    const user = await prismaProxy.user.findUnique({
      where: { id: userId },
      include: { employee: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if already hired
    if (user.employee) {
      throw new Error('User is already hired as an employee');
    }

    // Generate employee ID
    const employeeCount = await prismaProxy.employee.count();
    const employeeId = `EMP${String(employeeCount + 1).padStart(5, '0')}`;

    // Create employee record and update user status in transaction
    const result = await prismaProxy.$transaction(async (tx) => {
      // Create employee record
      await tx.employee.create({
        data: {
          userId: user.id,
          employeeId,
          department: 'General',
          position: 'Employee',
          joinDate: new Date(),
          status: EmploymentStatus.ACTIVE
        }
      });

      // Update user status to ACTIVE
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { 
          status: EmploymentStatus.ACTIVE,
          role: user.role === Role.SUPERADMIN || user.role === Role.ADMIN 
            ? user.role 
            : Role.EMPLOYEE
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          employee: {
            select: {
              id: true,
              employeeId: true,
              department: true,
              position: true,
              joinDate: true,
              status: true
            }
          }
        }
      });

      return updatedUser;
    });

    return result;
  }

  async fireEmployee(userId: string) {
    // Check if user exists and has employee record
    const user = await prismaProxy.user.findUnique({
      where: { id: userId },
      include: { 
        employee: {
          include: {
            termination: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.employee) {
      throw new Error('User is not an employee');
    }

    if (user.employee.termination) {
      throw new Error('Employee is already terminated');
    }

    // Create termination record and update statuses
    const result = await prismaProxy.$transaction(async (tx) => {
      // Create termination record
      await tx.employeeTermination.create({
        data: {
          employeeId: user.employee!.id,
          reason: 'Terminated by admin',
          terminatedAt: new Date(),
          terminatedBy: userId
        }
      });

      // Update employee status
      await tx.employee.update({
        where: { id: user.employee!.id },
        data: { status: EmploymentStatus.TERMINATED }
      });

      // Update user status
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { status: EmploymentStatus.TERMINATED },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          employee: {
            select: {
              id: true,
              employeeId: true,
              department: true,
              position: true,
              status: true,
              termination: true
            }
          }
        }
      });

      return updatedUser;
    });

    return result;
  }
}

export default new UserService();