// src/services/auth.service.ts - Enhanced with debugging
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { RegisterDTO, LoginDTO } from '../types';
import { generateToken } from '../utils/jwt.util';
import { sendEmail, welcomeEmail } from '../utils/email';
import { Role } from '@prisma/client';

interface RegisterAdminDTO extends RegisterDTO {
  department?: string;
  position?: string;
  location?: string;
  salary?: number;
}

interface RegisterEmployeeDTO extends RegisterDTO {
  department: string;
  position: string;
  location?: string;
  salary?: number;
}

class AuthService {
  // Generate Employee ID
  private async generateEmployeeId(): Promise<string> {
    const lastEmployee = await prisma.employee.findFirst({
      orderBy: { employeeId: 'desc' },
      select: { employeeId: true }
    });

    if (!lastEmployee) {
      return 'EMP001001';
    }

    const lastId = parseInt(lastEmployee.employeeId.replace('EMP', ''));
    const newId = lastId + 1;
    return `EMP${String(newId).padStart(6, '0')}`;
  }

  // Generate temporary password
  private generateTempPassword(): string {
    return Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
  }

  // EXISTING REGISTER METHOD (Keep for backward compatibility if needed)
  async register(data: RegisterDTO, createdBy?: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'EMPLOYEE',
        status: 'INACTIVE',
        createdBy
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    return user;
  }

  // LOGIN - All roles use this
  async login(data: LoginDTO) {
    console.log('\n🔐 ===== LOGIN ATTEMPT =====');
    console.log('📧 Email:', data.email);
    console.log('🕐 Timestamp:', new Date().toISOString());

    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: {
        employee: true
      }
    });

    if (!user) {
      console.log('❌ User not found:', data.email);
      throw new Error('Invalid credentials');
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    });

    // Check if user is active (except for SUPERADMIN and ADMIN)
    if (user.role === 'EMPLOYEE' && user.status !== 'ACTIVE') {
      console.log('❌ Employee account inactive');
      throw new Error('Your account is inactive. Please contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      throw new Error('Invalid credentials');
    }

    console.log('✅ Password verified');

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar
    };

    console.log('🎫 Generating token with payload:', tokenPayload);

    const token = generateToken(tokenPayload);

    console.log('✅ Token generated (first 20 chars):', token.substring(0, 20) + '...');

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        changes: `User ${user.email} logged in`
      }
    });

    console.log('✅ Audit log created');
    console.log('🔐 ===== LOGIN SUCCESS =====\n');

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        employee: user.employee
      },
      role: user.role
    };
  }

  // REGISTER ADMIN - Only Superadmin can do this
  async registerAdmin(data: RegisterAdminDTO, superadminId: string) {
    // Verify superadmin
    const superadmin = await prisma.user.findUnique({
      where: { id: superadminId }
    });

    if (!superadmin || superadmin.role !== 'SUPERADMIN') {
      throw new Error('Only Superadmin can register admins');
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Generate temporary password
    const tempPassword = this.generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Generate employee ID
    const employeeId = await this.generateEmployeeId();

    // Create user with employee record
    const newUser = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdBy: superadminId,
        employee: {
          create: {
            employeeId,
            department: data.department || 'Administration',
            position: data.position || 'System Administrator',
            location: data.location || 'Head Office',
            joinDate: new Date(),
            status: 'ACTIVE',
            salary: data.salary,
            hiredById: superadminId,
            hiredAt: new Date()
          }
        }
      },
      include: {
        employee: true
      }
    });

    // Send invitation email
    try {
      const loginLink = `${process.env.FRONTEND_URL}/login`;
      await sendEmail({
        to: data.email,
        subject: 'Welcome to SL Brothers - Admin Account Created',
        html: welcomeEmail(`${data.firstName} ${data.lastName}`, tempPassword, loginLink)
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't fail registration if email fails
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: superadminId,
        action: 'CREATE_ADMIN',
        entity: 'User',
        entityId: newUser.id,
        changes: `Created admin account: ${data.email} (${employeeId})`
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      tempPassword // Return temp password in response (for testing/display)
    };
  }

  // REGISTER EMPLOYEE - Superadmin OR Admin can do this
  async registerEmployee(data: RegisterEmployeeDTO, creatorId: string) {
    // Verify creator (must be SUPERADMIN or ADMIN)
    const creator = await prisma.user.findUnique({
      where: { id: creatorId }
    });

    if (!creator || !['SUPERADMIN', 'ADMIN'].includes(creator.role)) {
      throw new Error('Only Superadmin or Admin can register employees');
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Validate required fields
    if (!data.department || !data.position) {
      throw new Error('Department and position are required for employees');
    }

    // Generate temporary password
    const tempPassword = this.generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Generate employee ID
    const employeeId = await this.generateEmployeeId();

    // Create user with employee record
    const newUser = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        createdBy: creatorId,
        employee: {
          create: {
            employeeId,
            department: data.department,
            position: data.position,
            location: data.location || 'Office',
            joinDate: new Date(),
            status: 'ACTIVE',
            salary: data.salary,
            hiredById: creatorId,
            hiredAt: new Date()
          }
        }
      },
      include: {
        employee: true
      }
    });

    // Send invitation email
    try {
      const loginLink = `${process.env.FRONTEND_URL}/login`;
      await sendEmail({
        to: data.email,
        subject: 'Welcome to SL Brothers - Employee Account Created',
        html: welcomeEmail(`${data.firstName} ${data.lastName}`, tempPassword, loginLink)
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: creatorId,
        action: 'CREATE_EMPLOYEE',
        entity: 'User',
        entityId: newUser.id,
        changes: `Created employee account: ${data.email} (${employeeId})`
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      tempPassword // Return temp password in response
    };
  }

  // CHANGE PASSWORD
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CHANGE_PASSWORD',
        entity: 'User',
        entityId: userId,
        changes: 'User changed password'
      }
    });

    return { message: 'Password changed successfully' };
  }

  // GET PROFILE - Enhanced with debugging
  async getProfile(userId: string) {
    console.log('\n👤 ===== GET PROFILE =====');
    console.log('🔍 Looking up user ID:', userId);
    console.log('📊 Details:', {
      userId,
      type: typeof userId,
      length: userId?.length,
      isEmpty: !userId,
      isNull: userId === null,
      isUndefined: userId === undefined,
      isString: typeof userId === 'string'
    });

    // Validate userId
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.error('❌ Invalid userId provided');
      throw new Error('Invalid user ID');
    }

    try {
      console.log('📡 Executing Prisma query...');
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          employee: true
        }
      });

      console.log('📊 Query result:', {
        found: !!user,
        userId: userId,
        userEmail: user?.email || 'N/A',
        userRole: user?.role || 'N/A'
      });

      if (!user) {
        console.error('❌ User not found in database');
        console.error('🔍 Searched for ID:', userId);
        
        // Additional debugging - check if user exists with different ID
        const allUsers = await prisma.user.findMany({
          select: { id: true, email: true },
          take: 5
        });
        console.log('📋 Sample user IDs in database:', allUsers.map(u => ({ id: u.id, email: u.email })));
        
        throw new Error('User not found');
      }

      console.log('✅ User profile retrieved successfully');
      console.log('👤 User:', {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      });
      console.log('👤 ===== GET PROFILE END =====\n');
      
      return user;
    } catch (error: any) {
      console.error('❌ Error in getProfile:', {
        message: error.message,
        code: error.code,
        userId: userId
      });
      throw error;
    }
  }

  // LOGOUT (for audit logging)
  async logout(userId: string) {
    console.log('\n🚪 ===== LOGOUT =====');
    console.log('👤 User ID:', userId);
    
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        entity: 'User',
        entityId: userId,
        changes: 'User logged out'
      }
    });

    console.log('✅ Logout audit log created');
    console.log('🚪 ===== LOGOUT END =====\n');

    return { message: 'Logged out successfully' };
  }
}

export default new AuthService();