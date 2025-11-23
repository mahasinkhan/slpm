// prisma/seed.ts - Updated with Approval System
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Delete existing data in correct order (with error handling)
  try {
    await prisma.approvalHistory.deleteMany();
    await prisma.approvalComment.deleteMany();
    await prisma.approval.deleteMany();
    console.log('✅ Deleted existing approval data');
  } catch (error) {
    console.log('ℹ️  No existing approval data to delete (tables may not exist yet)');
  }

  try {
    await prisma.interview.deleteMany();
    console.log('✅ Deleted existing interview data');
  } catch (error) {
    console.log('ℹ️  No existing interview data to delete');
  }

  try {
    await prisma.content.deleteMany();
    console.log('✅ Deleted existing content data');
  } catch (error) {
    console.log('ℹ️  No existing content data to delete');
  }

  try {
    await prisma.user.deleteMany();
    console.log('✅ Deleted existing user data');
  } catch (error) {
    console.log('ℹ️  No existing user data to delete');
  }

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash('superadmin123', 12);
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@slbrothers.co.uk',
      password: superAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      phone: '+44 7405 005823',
      avatar: 'https://i.pravatar.cc/150?img=68'
    }
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // Create Admin User - Michael Chen
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'michael.c@slbrothers.co.uk',
      password: adminPassword,
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'ADMIN',
      status: 'ACTIVE',
      phone: '+44 7405 005824',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  });
  console.log('✅ Admin created:', admin.email);

  // Create Employee Users
  const employeePassword = await bcrypt.hash('employee123', 12);
  
  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.j@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005825',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  });

  const james = await prisma.user.create({
    data: {
      email: 'james.b@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'James',
      lastName: 'Brown',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005826',
      avatar: 'https://i.pravatar.cc/150?img=7'
    }
  });

  const lisa = await prisma.user.create({
    data: {
      email: 'lisa.a@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005827',
      avatar: 'https://i.pravatar.cc/150?img=9'
    }
  });

  const david = await prisma.user.create({
    data: {
      email: 'david.m@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'David',
      lastName: 'Martinez',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005828',
      avatar: 'https://i.pravatar.cc/150?img=11'
    }
  });

  const emma = await prisma.user.create({
    data: {
      email: 'emma.w@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'Emma',
      lastName: 'Wilson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005829',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  });

  console.log('✅ Employee users created');

  // Create Sample Approvals
  const approvals = [
    {
      approvalId: 'APR-001',
      type: 'EXPENSE_CLAIM',
      title: 'Travel Expenses - Client Meeting',
      description: 'Travel expenses for client meeting in London including train tickets and accommodation',
      amount: '£1,450.00',
      status: 'APPROVED',
      priority: 'MEDIUM',
      submitterId: sarah.id,
      submitterName: `${sarah.firstName} ${sarah.lastName}`,
      submitterEmail: sarah.email,
      submitterAvatar: sarah.avatar,
      approverId: admin.id,
      approverName: `${admin.firstName} ${admin.lastName}`,
      approverEmail: admin.email,
      approverAvatar: admin.avatar,
      notes: 'All receipts verified. Travel to London for client presentation.',
      submittedDate: new Date('2025-11-08'),
      approvedDate: new Date('2025-11-09')
    },
    {
      approvalId: 'APR-002',
      type: 'USER_ACCESS',
      title: 'Grant Admin Access - Emma Wilson',
      description: 'Request to grant admin access for Emma Wilson who has been promoted to team lead',
      status: 'APPROVED',
      priority: 'HIGH',
      submitterId: james.id,
      submitterName: `${james.firstName} ${james.lastName}`,
      submitterEmail: james.email,
      submitterAvatar: james.avatar,
      approverId: superAdmin.id,
      approverName: `${superAdmin.firstName} ${superAdmin.lastName}`,
      approverEmail: superAdmin.email,
      approverAvatar: superAdmin.avatar,
      notes: 'Promoted to team lead position. Requires admin access.',
      submittedDate: new Date('2025-11-07'),
      approvedDate: new Date('2025-11-07')
    },
    {
      approvalId: 'APR-003',
      type: 'CONTENT_PUBLISH',
      title: 'Blog Post: "Future of AI in Business"',
      description: 'Request to publish blog post about AI trends and their impact on business',
      status: 'REJECTED',
      priority: 'LOW',
      submitterId: lisa.id,
      submitterName: `${lisa.firstName} ${lisa.lastName}`,
      submitterEmail: lisa.email,
      submitterAvatar: lisa.avatar,
      approverId: admin.id,
      approverName: `${admin.firstName} ${admin.lastName}`,
      approverEmail: admin.email,
      approverAvatar: admin.avatar,
      notes: 'Content needs revision. Please address the feedback comments.',
      submittedDate: new Date('2025-11-06'),
      approvedDate: new Date('2025-11-08')
    },
    {
      approvalId: 'APR-004',
      type: 'PURCHASE_ORDER',
      title: 'Office Equipment Purchase',
      description: '5 new workstations including monitors, keyboards, and mice for expanding team',
      amount: '£3,200.00',
      status: 'APPROVED',
      priority: 'HIGH',
      submitterId: david.id,
      submitterName: `${david.firstName} ${david.lastName}`,
      submitterEmail: david.email,
      submitterAvatar: david.avatar,
      approverId: sarah.id,
      approverName: `${sarah.firstName} ${sarah.lastName}`,
      approverEmail: sarah.email,
      approverAvatar: sarah.avatar,
      notes: 'Approved for Q4 budget. 5 new workstations for expanding team.',
      submittedDate: new Date('2025-11-05'),
      approvedDate: new Date('2025-11-06')
    },
    {
      approvalId: 'APR-005',
      type: 'LEAVE_REQUEST',
      title: 'Annual Leave - 2 Weeks',
      description: 'Request for 2 weeks annual leave during Christmas period',
      status: 'APPROVED',
      priority: 'MEDIUM',
      submitterId: emma.id,
      submitterName: `${emma.firstName} ${emma.lastName}`,
      submitterEmail: emma.email,
      submitterAvatar: emma.avatar,
      approverId: admin.id,
      approverName: `${admin.firstName} ${admin.lastName}`,
      approverEmail: admin.email,
      approverAvatar: admin.avatar,
      notes: 'Approved for December 20 - January 3.',
      submittedDate: new Date('2025-11-04'),
      approvedDate: new Date('2025-11-05')
    },
    {
      approvalId: 'APR-006',
      type: 'EXPENSE_CLAIM',
      title: 'Software License Renewal',
      description: 'Annual renewal of Adobe Creative Cloud license',
      amount: '£899.00',
      status: 'REJECTED',
      priority: 'LOW',
      submitterId: james.id,
      submitterName: `${james.firstName} ${james.lastName}`,
      submitterEmail: james.email,
      submitterAvatar: james.avatar,
      approverId: superAdmin.id,
      approverName: `${superAdmin.firstName} ${superAdmin.lastName}`,
      approverEmail: superAdmin.email,
      approverAvatar: superAdmin.avatar,
      notes: 'License not due for renewal until Q1 2026.',
      submittedDate: new Date('2025-11-03'),
      approvedDate: new Date('2025-11-04')
    },
    {
      approvalId: 'APR-007',
      type: 'BUDGET_INCREASE',
      title: 'Marketing Budget Increase Request',
      description: 'Request to increase Q4 marketing budget by £15,000 for additional campaigns',
      amount: '£15,000.00',
      status: 'APPROVED',
      priority: 'HIGH',
      submitterId: lisa.id,
      submitterName: `${lisa.firstName} ${lisa.lastName}`,
      submitterEmail: lisa.email,
      submitterAvatar: lisa.avatar,
      approverId: superAdmin.id,
      approverName: `${superAdmin.firstName} ${superAdmin.lastName}`,
      approverEmail: superAdmin.email,
      approverAvatar: superAdmin.avatar,
      notes: 'Approved for Q4 campaign. Strong ROI projection provided.',
      submittedDate: new Date('2025-11-01'),
      approvedDate: new Date('2025-11-02')
    },
    {
      approvalId: 'APR-008',
      type: 'USER_ACCESS',
      title: 'Remove Access - Contractor',
      description: 'Remove system access for contractor whose contract has ended',
      status: 'APPROVED',
      priority: 'HIGH',
      submitterId: sarah.id,
      submitterName: `${sarah.firstName} ${sarah.lastName}`,
      submitterEmail: sarah.email,
      submitterAvatar: sarah.avatar,
      approverId: admin.id,
      approverName: `${admin.firstName} ${admin.lastName}`,
      approverEmail: admin.email,
      approverAvatar: admin.avatar,
      notes: 'Contract ended. All access revoked immediately.',
      submittedDate: new Date('2025-10-30'),
      approvedDate: new Date('2025-10-30')
    },
    {
      approvalId: 'APR-009',
      type: 'TRAINING_REQUEST',
      title: 'AWS Certification Training',
      description: 'Request for AWS Solutions Architect certification training course',
      amount: '£2,500.00',
      status: 'PENDING',
      priority: 'MEDIUM',
      submitterId: david.id,
      submitterName: `${david.firstName} ${david.lastName}`,
      submitterEmail: david.email,
      submitterAvatar: david.avatar,
      notes: 'Training would benefit cloud infrastructure projects.',
      submittedDate: new Date('2025-11-15')
    },
    {
      approvalId: 'APR-010',
      type: 'EQUIPMENT_REQUEST',
      title: 'MacBook Pro M3 for Development',
      description: 'New MacBook Pro M3 Max for iOS development work',
      amount: '£3,499.00',
      status: 'PENDING',
      priority: 'HIGH',
      submitterId: james.id,
      submitterName: `${james.firstName} ${james.lastName}`,
      submitterEmail: james.email,
      submitterAvatar: james.avatar,
      notes: 'Current laptop is 5 years old and struggling with Xcode.',
      submittedDate: new Date('2025-11-18')
    }
  ];

  for (const approval of approvals) {
    const created = await prisma.approval.create({
      data: approval
    });

    // Create history entry
    await prisma.approvalHistory.create({
      data: {
        approvalId: created.id,
        userId: approval.submitterId,
        action: 'CREATED',
        changes: {
          status: 'PENDING',
          createdAt: approval.submittedDate.toISOString()
        }
      }
    });

    // If approved/rejected, create decision history
    if (approval.status !== 'PENDING' && approval.approverId) {
      await prisma.approvalHistory.create({
        data: {
          approvalId: created.id,
          userId: approval.approverId,
          action: approval.status,
          changes: {
            status: approval.status,
            approvedDate: approval.approvedDate?.toISOString(),
            notes: approval.notes
          }
        }
      });
    }
  }

  console.log('✅ Sample approvals created');

  // Create sample interview
  const interview = await prisma.interview.create({
    data: {
      candidateId: emma.id,
      interviewerId: admin.id,
      position: 'Software Developer',
      division: 'AI & Software',
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Initial technical interview'
    }
  });
  console.log('✅ Sample interview created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login Credentials:');
  console.log('Super Admin: superadmin@slbrothers.co.uk / superadmin123');
  console.log('Admin: michael.c@slbrothers.co.uk / admin123');
  console.log('Employee: sarah.j@slbrothers.co.uk / employee123');
  console.log('\nOther users (all use password: employee123):');
  console.log('- james.b@slbrothers.co.uk');
  console.log('- lisa.a@slbrothers.co.uk');
  console.log('- david.m@slbrothers.co.uk');
  console.log('- emma.w@slbrothers.co.uk');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });