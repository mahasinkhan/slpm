// prisma/seed.ts - Complete SLB Brothers Seed with All Data INCLUDING JOBS
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Delete existing data in correct order (with error handling)
  try {
    await prisma.jobView.deleteMany();
    await prisma.jobApplication.deleteMany();
    await prisma.job.deleteMany();
    console.log('✅ Deleted existing job data');
  } catch (error) {
    console.log('ℹ️  No existing job data to delete');
  }

  try {
    await prisma.approvalHistory.deleteMany();
    await prisma.approvalComment.deleteMany();
    await prisma.approval.deleteMany();
    console.log('✅ Deleted existing approval data');
  } catch (error) {
    console.log('ℹ️  No existing approval data to delete (tables may not exist yet)');
  }

  try {
    await prisma.employeeTermination.deleteMany();
    await prisma.employee.deleteMany();
    console.log('✅ Deleted existing employee data');
  } catch (error) {
    console.log('ℹ️  No existing employee data to delete');
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

  try {
    await prisma.division.deleteMany();
    console.log('✅ Deleted existing division data');
  } catch (error) {
    console.log('ℹ️  No existing division data to delete');
  }

  // ==================== CREATE DIVISIONS ====================
  
  const divisions = [
    { 
      name: 'Technology', 
      sicCode: '5112', 
      description: 'Software & IT Services',
      active: true 
    },
    { 
      name: 'Marketing', 
      sicCode: '7319', 
      description: 'Marketing & Advertising',
      active: true 
    },
    { 
      name: 'Finance', 
      sicCode: '6211', 
      description: 'Financial Services',
      active: true 
    },
    { 
      name: 'Human Resources', 
      sicCode: '8742', 
      description: 'HR Management',
      active: true 
    },
    { 
      name: 'Operations', 
      sicCode: '8741', 
      description: 'Operations Management',
      active: true 
    },
    { 
      name: 'AI & Software', 
      sicCode: '5112', 
      description: 'Artificial Intelligence & Software Development',
      active: true 
    },
  ];

  for (const division of divisions) {
    await prisma.division.create({ data: division });
  }
  console.log('✅ Divisions created');

  // ==================== CREATE SUPER ADMIN ====================
  
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

  // ==================== CREATE ADMIN USER ====================
  
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
      avatar: 'https://i.pravatar.cc/150?img=3',
      createdBy: superAdmin.id
    }
  });
  console.log('✅ Admin created:', admin.email);

  // Create Employee record for Admin
  await prisma.employee.create({
    data: {
      userId: admin.id,
      employeeId: 'EMP001001',
      department: 'Technology',
      position: 'System Administrator',
      location: 'London, UK',
      joinDate: new Date('2024-01-15'),
      status: 'ACTIVE',
      salary: 65000,
      hiredById: superAdmin.id,
      hiredAt: new Date('2024-01-15'),
      performanceRating: 4.5,
      attendanceRate: 98.5,
    }
  });
  console.log('✅ Admin employee record created');

  // ==================== CREATE EMPLOYEE USERS ====================
  
  const employeePassword = await bcrypt.hash('employee123', 12);
  
  // Employee 1: Sarah Johnson
  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.j@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005825',
      avatar: 'https://i.pravatar.cc/150?img=1',
      createdBy: admin.id
    }
  });

  await prisma.employee.create({
    data: {
      userId: sarah.id,
      employeeId: 'EMP001002',
      department: 'Marketing',
      position: 'Marketing Manager',
      location: 'Manchester, UK',
      joinDate: new Date('2024-02-01'),
      status: 'ACTIVE',
      salary: 48000,
      hiredById: admin.id,
      hiredAt: new Date('2024-02-01'),
      performanceRating: 4.2,
      attendanceRate: 96.8,
    }
  });

  // Employee 2: James Brown
  const james = await prisma.user.create({
    data: {
      email: 'james.b@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'James',
      lastName: 'Brown',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005826',
      avatar: 'https://i.pravatar.cc/150?img=7',
      createdBy: admin.id
    }
  });

  await prisma.employee.create({
    data: {
      userId: james.id,
      employeeId: 'EMP001003',
      department: 'Technology',
      position: 'Senior Developer',
      location: 'London, UK',
      joinDate: new Date('2024-03-15'),
      status: 'ACTIVE',
      salary: 55000,
      hiredById: admin.id,
      hiredAt: new Date('2024-03-15'),
      performanceRating: 4.7,
      attendanceRate: 99.2,
    }
  });

  // Employee 3: Lisa Anderson
  const lisa = await prisma.user.create({
    data: {
      email: 'lisa.a@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005827',
      avatar: 'https://i.pravatar.cc/150?img=9',
      createdBy: admin.id
    }
  });

  await prisma.employee.create({
    data: {
      userId: lisa.id,
      employeeId: 'EMP001004',
      department: 'Marketing',
      position: 'Content Strategist',
      location: 'Birmingham, UK',
      joinDate: new Date('2024-04-01'),
      status: 'ACTIVE',
      salary: 42000,
      hiredById: admin.id,
      hiredAt: new Date('2024-04-01'),
      performanceRating: 4.0,
      attendanceRate: 95.5,
    }
  });

  // Employee 4: David Martinez
  const david = await prisma.user.create({
    data: {
      email: 'david.m@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'David',
      lastName: 'Martinez',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005828',
      avatar: 'https://i.pravatar.cc/150?img=11',
      createdBy: admin.id
    }
  });

  await prisma.employee.create({
    data: {
      userId: david.id,
      employeeId: 'EMP001005',
      department: 'Operations',
      position: 'Operations Coordinator',
      location: 'Leeds, UK',
      joinDate: new Date('2024-05-10'),
      status: 'ACTIVE',
      salary: 38000,
      hiredById: admin.id,
      hiredAt: new Date('2024-05-10'),
      performanceRating: 4.3,
      attendanceRate: 97.1,
    }
  });

  // Employee 5: Emma Wilson
  const emma = await prisma.user.create({
    data: {
      email: 'emma.w@slbrothers.co.uk',
      password: employeePassword,
      firstName: 'Emma',
      lastName: 'Wilson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      phone: '+44 7405 005829',
      avatar: 'https://i.pravatar.cc/150?img=5',
      createdBy: admin.id
    }
  });

  await prisma.employee.create({
    data: {
      userId: emma.id,
      employeeId: 'EMP001006',
      department: 'AI & Software',
      position: 'AI Research Analyst',
      location: 'London, UK',
      joinDate: new Date('2024-06-01'),
      status: 'ACTIVE',
      salary: 52000,
      hiredById: admin.id,
      hiredAt: new Date('2024-06-01'),
      performanceRating: 4.6,
      attendanceRate: 98.0,
    }
  });

  console.log('✅ Employee users and records created');

  // ==================== CREATE SAMPLE APPROVALS ====================
  
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

  // ==================== CREATE SAMPLE INTERVIEW ====================
  
  const interview = await prisma.interview.create({
    data: {
      candidateId: emma.id,
      interviewerId: admin.id,
      position: 'Software Developer',
      division: 'AI & Software',
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Initial technical interview for AI research position'
    }
  });
  console.log('✅ Sample interview created');

  // ==================== CREATE AUDIT LOGS ====================
  
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: 'CREATE_ADMIN',
      entity: 'User',
      entityId: admin.id,
      changes: `Created admin account: ${admin.email}`,
      createdAt: new Date('2024-01-15'),
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE_EMPLOYEE',
      entity: 'User',
      entityId: sarah.id,
      changes: `Created employee account: ${sarah.email} (EMP001002)`,
      createdAt: new Date('2024-02-01'),
    }
  });

  console.log('✅ Audit logs created');

  // ==================== CREATE SAMPLE JOBS ====================
  
  console.log('\n💼 Creating job postings...');
  
  const jobs = [
    {
      title: 'Senior Frontend Developer',
      department: 'Technology',
      location: 'London, UK / Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryMin: 60000,
      salaryMax: 80000,
      salaryCurrency: 'GBP',
      description: 'We are looking for an experienced Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining our web applications using modern technologies and best practices. This role offers the opportunity to work on challenging projects while mentoring junior developers.',
      responsibilities: [
        'Lead the development of complex frontend features and applications',
        'Collaborate with designers and backend developers to implement user interfaces',
        'Mentor junior developers and conduct code reviews',
        'Optimize application performance and ensure cross-browser compatibility',
        'Participate in technical planning and architecture decisions',
        'Write clean, maintainable, and well-documented code',
      ],
      requirements: [
        '5+ years of experience in frontend development',
        'Expert knowledge of React, TypeScript, and modern JavaScript',
        'Strong understanding of HTML5, CSS3, and responsive design',
        'Experience with state management (Redux, MobX, or similar)',
        'Familiarity with testing frameworks (Jest, React Testing Library)',
        'Excellent problem-solving and communication skills',
        'Experience with Git and CI/CD pipelines',
      ],
      benefits: [
        'Competitive salary and equity package',
        'Flexible working hours and remote work options',
        '25 days annual leave plus bank holidays',
        'Private health insurance for you and your family',
        '£2,000 annual learning and development budget',
        'Modern office in Central London with great amenities',
        'Regular team events and social activities',
        'Pension scheme with company contribution',
      ],
      skills: [
        'React',
        'TypeScript',
        'JavaScript',
        'HTML5',
        'CSS3',
        'Redux',
        'Next.js',
        'Git',
        'REST APIs',
        'GraphQL',
      ],
      status: 'ACTIVE' as const,
      isPublished: true,
      applicationDeadline: new Date('2025-03-15'),
      publishedAt: new Date('2025-01-15'),
      completionPercentage: 100,
      missingFields: [],
      slug: 'senior-frontend-developer',
      metaTitle: 'Senior Frontend Developer - Join Our Team',
      metaDescription: 'Exciting opportunity for a Senior Frontend Developer to join our innovative team in London.',
      viewsCount: 234,
      applicationsCount: 3,
      createdById: admin.id,
    },
    {
      title: 'Product Designer',
      department: 'Marketing',
      location: 'London, UK',
      employmentType: 'Full-time',
      experienceLevel: 'Mid-level',
      salaryMin: 45000,
      salaryMax: 65000,
      salaryCurrency: 'GBP',
      description: 'We\'re seeking a talented Product Designer to help shape the future of our digital products. You\'ll work closely with product managers and engineers to create intuitive, beautiful user experiences that delight our customers.',
      responsibilities: [
        'Design end-to-end user experiences for web and mobile applications',
        'Create wireframes, prototypes, and high-fidelity mockups',
        'Conduct user research and usability testing',
        'Collaborate with cross-functional teams throughout the product lifecycle',
        'Maintain and evolve our design system',
        'Present design concepts and iterate based on feedback',
      ],
      requirements: [
        '3+ years of experience in product design or UX/UI design',
        'Strong portfolio demonstrating user-centered design process',
        'Proficiency in Figma, Sketch, or similar design tools',
        'Understanding of HTML/CSS and design systems',
        'Experience conducting user research and usability testing',
        'Excellent communication and presentation skills',
      ],
      benefits: [
        'Competitive salary based on experience',
        'Flexible working arrangements',
        '25 days holiday plus bank holidays',
        'Private healthcare',
        'Professional development opportunities',
        'Modern design tools and equipment',
        'Collaborative and creative work environment',
      ],
      skills: [
        'Figma',
        'Sketch',
        'Adobe Creative Suite',
        'Prototyping',
        'User Research',
        'Wireframing',
        'UI Design',
        'UX Design',
      ],
      status: 'ACTIVE' as const,
      isPublished: true,
      applicationDeadline: new Date('2025-03-20'),
      publishedAt: new Date('2025-01-20'),
      completionPercentage: 100,
      missingFields: [],
      slug: 'product-designer',
      metaTitle: 'Product Designer - Shape Amazing User Experiences',
      metaDescription: 'Join our design team and create beautiful, user-centered products.',
      viewsCount: 156,
      applicationsCount: 2,
      createdById: admin.id,
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Manchester, UK',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryMin: 50000,
      salaryMax: 70000,
      salaryCurrency: 'GBP',
      description: 'We\'re looking for an experienced Marketing Manager to lead our marketing initiatives and drive growth. This is a strategic role where you\'ll develop and execute comprehensive marketing campaigns across multiple channels.',
      responsibilities: [
        'Develop and execute marketing strategies to drive brand awareness',
        'Manage multi-channel marketing campaigns (digital, social, email, events)',
        'Lead and mentor a team of marketing professionals',
        'Analyze campaign performance and optimize based on data insights',
      ],
      requirements: [
        '5+ years of marketing experience with 2+ years in management',
        'Proven track record of successful campaign execution',
        'Strong analytical and strategic thinking skills',
        'Experience with marketing automation and CRM tools',
      ],
      benefits: [
        'Competitive salary with performance bonus',
        'Flexible working options',
        '25 days annual leave',
        'Health insurance',
        'Professional development budget',
      ],
      skills: [
        'Digital Marketing',
        'SEO/SEM',
        'Content Marketing',
        'Social Media',
        'Analytics',
        'Leadership',
      ],
      status: 'DRAFT' as const,
      isPublished: false,
      applicationDeadline: new Date('2025-04-01'),
      completionPercentage: 75,
      missingFields: ['Requirements need more detail'],
      slug: 'marketing-manager',
      viewsCount: 0,
      applicationsCount: 0,
      createdById: admin.id,
    },
    {
      title: 'Backend Engineer',
      department: 'Technology',
      location: 'Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Mid-level',
      salaryMin: 55000,
      salaryMax: 75000,
      salaryCurrency: 'GBP',
      description: 'Join our backend team to build scalable, high-performance APIs and services. You\'ll work with cutting-edge technologies and contribute to the core infrastructure that powers our platform.',
      responsibilities: [
        'Design and implement RESTful APIs and microservices',
        'Write clean, efficient, and well-tested code',
        'Optimize database queries and application performance',
        'Collaborate with frontend developers on API design',
        'Participate in code reviews and technical discussions',
        'Monitor and maintain production systems',
      ],
      requirements: [
        '3+ years of backend development experience',
        'Strong knowledge of Node.js, Python, or Go',
        'Experience with PostgreSQL or MySQL',
        'Understanding of RESTful API design principles',
        'Familiarity with Docker and Kubernetes',
        'Experience with AWS or other cloud platforms',
      ],
      benefits: [
        'Fully remote position',
        'Competitive salary',
        '30 days annual leave',
        'Home office setup allowance',
        'Learning and development budget',
        'Quarterly team meetups',
      ],
      skills: [
        'Node.js',
        'Python',
        'PostgreSQL',
        'Redis',
        'Docker',
        'AWS',
        'REST APIs',
        'Microservices',
      ],
      status: 'ACTIVE' as const,
      isPublished: true,
      applicationDeadline: new Date('2025-03-10'),
      publishedAt: new Date('2025-01-10'),
      completionPercentage: 100,
      missingFields: [],
      slug: 'backend-engineer',
      viewsCount: 189,
      applicationsCount: 1,
      createdById: admin.id,
    },
    {
      title: 'DevOps Engineer',
      department: 'Technology',
      location: 'Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryMin: 65000,
      salaryMax: 85000,
      salaryCurrency: 'GBP',
      description: 'We\'re seeking a Senior DevOps Engineer to help us scale our infrastructure and improve our deployment processes. You\'ll be responsible for building and maintaining our cloud infrastructure, CI/CD pipelines, and ensuring system reliability.',
      responsibilities: [
        'Manage and optimize cloud infrastructure (AWS)',
        'Build and maintain CI/CD pipelines',
        'Implement monitoring and alerting systems',
        'Ensure security best practices across all systems',
      ],
      requirements: [
        '5+ years of DevOps/Infrastructure experience',
        'Expert knowledge of AWS services',
        'Experience with Kubernetes and Docker',
        'Strong scripting skills (Python, Bash)',
      ],
      benefits: [
        'Remote-first culture',
        'Competitive salary and equity',
        '28 days holiday',
        'Latest tools and equipment',
      ],
      skills: [
        'AWS',
        'Kubernetes',
        'Docker',
        'Terraform',
        'Jenkins',
        'Python',
        'Bash',
        'Monitoring',
      ],
      status: 'DRAFT' as const,
      isPublished: false,
      applicationDeadline: new Date('2025-03-30'),
      completionPercentage: 90,
      missingFields: ['Benefits section incomplete'],
      slug: 'devops-engineer',
      viewsCount: 0,
      applicationsCount: 0,
      createdById: admin.id,
    },
    {
      title: 'AI Research Scientist',
      department: 'AI & Software',
      location: 'London, UK',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryMin: 70000,
      salaryMax: 95000,
      salaryCurrency: 'GBP',
      description: 'Join our AI research team to work on cutting-edge machine learning and artificial intelligence projects. You\'ll conduct research, develop new algorithms, and apply state-of-the-art AI techniques to real-world problems.',
      responsibilities: [
        'Conduct research in machine learning and artificial intelligence',
        'Develop and implement novel AI algorithms',
        'Publish research findings in top-tier conferences',
        'Collaborate with engineering teams to deploy AI models',
        'Stay current with latest AI research and trends',
      ],
      requirements: [
        'PhD or Masters in Computer Science, AI, or related field',
        '3+ years of experience in AI/ML research',
        'Strong programming skills in Python and ML frameworks',
        'Publications in top AI conferences (NeurIPS, ICML, etc)',
        'Deep understanding of neural networks and deep learning',
        'Experience with PyTorch or TensorFlow',
      ],
      benefits: [
        'Competitive salary and equity',
        'Research budget for conferences and equipment',
        'Flexible working hours',
        '30 days annual leave',
        'Collaborative research environment',
        'Access to high-performance computing resources',
      ],
      skills: [
        'Python',
        'PyTorch',
        'TensorFlow',
        'Machine Learning',
        'Deep Learning',
        'NLP',
        'Computer Vision',
        'Research',
      ],
      status: 'ACTIVE' as const,
      isPublished: true,
      applicationDeadline: new Date('2025-04-15'),
      publishedAt: new Date('2025-01-25'),
      completionPercentage: 100,
      missingFields: [],
      slug: 'ai-research-scientist',
      metaTitle: 'AI Research Scientist - Pioneer the Future of AI',
      metaDescription: 'Join our AI research team and work on cutting-edge machine learning projects.',
      viewsCount: 312,
      applicationsCount: 0,
      createdById: superAdmin.id,
    },
  ];

  const createdJobs = [];
  for (const jobData of jobs) {
    const job = await prisma.job.create({ data: jobData });
    createdJobs.push(job);
    console.log(`✅ Created job: ${job.title} (${job.status})`);
  }

  // ==================== CREATE SAMPLE APPLICATIONS ====================
  
  console.log('\n📝 Creating job applications...');
  
  const applications = [
    {
      jobId: createdJobs[0].id, // Senior Frontend Developer
      candidateName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+44 7700 900123',
      location: 'London, UK',
      coverLetter: 'I am excited to apply for the Senior Frontend Developer position at SL Brothers. With over 6 years of experience in React and TypeScript, I have led the development of several high-impact web applications. I am particularly drawn to your company\'s focus on innovation and would love to contribute to your team\'s success.',
      resumeUrl: '/uploads/resumes/john-smith-cv.pdf',
      portfolioUrl: 'https://johnsmith.dev',
      linkedinUrl: 'https://linkedin.com/in/johnsmith',
      githubUrl: 'https://github.com/johnsmith',
      yearsExperience: 6,
      currentCompany: 'Tech Corp Ltd',
      currentTitle: 'Frontend Developer',
      expectedSalary: '70000',
      noticePeriod: '1 month',
      status: 'NEW' as const,
      source: 'Company Website',
      appliedAt: new Date('2025-01-22T10:30:00Z'),
    },
    {
      jobId: createdJobs[0].id, // Senior Frontend Developer
      candidateName: 'Sarah Johnson',
      email: 'sarah.johnson.dev@email.com',
      phone: '+44 7700 900456',
      location: 'Manchester, UK',
      coverLetter: 'As a passionate frontend developer with 7 years of experience, I am thrilled about the opportunity to join SL Brothers. I specialize in building performant React applications and have a strong background in modern web technologies. Your commitment to code quality and mentorship aligns perfectly with my values.',
      resumeUrl: '/uploads/resumes/sarah-johnson-cv.pdf',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnsondev',
      githubUrl: 'https://github.com/sarahj',
      yearsExperience: 7,
      currentCompany: 'Digital Agency UK',
      currentTitle: 'Senior Frontend Developer',
      expectedSalary: '75000',
      noticePeriod: '2 months',
      status: 'REVIEWING' as const,
      source: 'LinkedIn',
      rating: 4,
      appliedAt: new Date('2025-01-21T15:20:00Z'),
      reviewedAt: new Date('2025-01-23T10:00:00Z'),
      reviewedById: admin.id,
      internalNotes: 'Strong portfolio and excellent references. Schedule for technical interview.',
    },
    {
      jobId: createdJobs[0].id, // Senior Frontend Developer
      candidateName: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+44 7700 900789',
      location: 'Remote',
      coverLetter: 'I am writing to express my interest in the Senior Frontend Developer role at SL Brothers. With extensive experience in React, TypeScript, and modern frontend architectures, I am confident I can contribute significantly to your projects. I have led teams, mentored junior developers, and delivered complex applications on time and within budget.',
      resumeUrl: '/uploads/resumes/michael-brown-cv.pdf',
      portfolioUrl: 'https://michaelbrown.io',
      linkedinUrl: 'https://linkedin.com/in/michaelbrown',
      githubUrl: 'https://github.com/mbrown',
      websiteUrl: 'https://michaelbrown.dev',
      yearsExperience: 8,
      currentCompany: 'Startup Inc',
      currentTitle: 'Lead Frontend Engineer',
      expectedSalary: '80000',
      noticePeriod: '3 months',
      status: 'SHORTLISTED' as const,
      source: 'Company Website',
      rating: 5,
      appliedAt: new Date('2025-01-20T09:45:00Z'),
      reviewedAt: new Date('2025-01-22T14:30:00Z'),
      reviewedById: admin.id,
      internalNotes: 'Excellent portfolio. Strong technical skills. Top candidate - schedule interview ASAP.',
      tags: ['Top Candidate', 'Remote OK', 'Leadership Experience'],
    },
    {
      jobId: createdJobs[1].id, // Product Designer
      candidateName: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+44 7700 900321',
      location: 'London, UK',
      coverLetter: 'I am excited to apply for the Product Designer position at SL Brothers. My background in user-centered design and my passion for creating intuitive interfaces make me a perfect fit for this role. I have 4 years of experience designing successful products used by thousands of users daily.',
      resumeUrl: '/uploads/resumes/emily-davis-cv.pdf',
      portfolioUrl: 'https://emilydavis.design',
      linkedinUrl: 'https://linkedin.com/in/emilydavis',
      yearsExperience: 4,
      currentCompany: 'Creative Studio',
      currentTitle: 'UX/UI Designer',
      expectedSalary: '55000',
      noticePeriod: '1 month',
      status: 'NEW' as const,
      source: 'Company Website',
      appliedAt: new Date('2025-01-24T11:15:00Z'),
    },
    {
      jobId: createdJobs[1].id, // Product Designer
      candidateName: 'Oliver Thompson',
      email: 'oliver.thompson@email.com',
      phone: '+44 7700 900654',
      location: 'Birmingham, UK',
      coverLetter: 'I would love to join SL Brothers as a Product Designer. With 5 years of experience in UX/UI design, I have a proven track record of creating engaging user experiences. I am proficient in Figma and have conducted extensive user research to inform design decisions.',
      resumeUrl: '/uploads/resumes/oliver-thompson-cv.pdf',
      portfolioUrl: 'https://oliverthompson.com',
      linkedinUrl: 'https://linkedin.com/in/olivert',
      yearsExperience: 5,
      currentCompany: 'Design Agency',
      currentTitle: 'Senior UX Designer',
      expectedSalary: '60000',
      noticePeriod: '2 months',
      status: 'REVIEWING' as const,
      source: 'Indeed',
      rating: 3,
      appliedAt: new Date('2025-01-23T16:45:00Z'),
      reviewedAt: new Date('2025-01-25T09:30:00Z'),
      reviewedById: sarah.id,
      internalNotes: 'Good portfolio but needs more mobile design experience.',
    },
    {
      jobId: createdJobs[3].id, // Backend Engineer
      candidateName: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+44 7700 900987',
      location: 'Remote',
      coverLetter: 'I am applying for the Backend Engineer position at SL Brothers. With 5 years of experience building scalable APIs and microservices using Node.js and PostgreSQL, I am confident in my ability to contribute to your backend infrastructure. I have experience with AWS, Docker, and implementing best practices for code quality.',
      resumeUrl: '/uploads/resumes/david-wilson-cv.pdf',
      githubUrl: 'https://github.com/davidw',
      linkedinUrl: 'https://linkedin.com/in/davidwilson',
      yearsExperience: 5,
      currentCompany: 'Cloud Services Ltd',
      currentTitle: 'Backend Developer',
      expectedSalary: '65000',
      noticePeriod: '1 month',
      status: 'NEW' as const,
      source: 'LinkedIn',
      appliedAt: new Date('2025-01-25T13:20:00Z'),
    },
  ];

  for (const appData of applications) {
    await prisma.jobApplication.create({ data: appData });
  }
  console.log('✅ Sample job applications created');

  // ==================== CREATE JOB VIEWS ====================
  
  console.log('\n👀 Creating job view tracking data...');
  
  // Add some view tracking data for active jobs
  for (let i = 0; i < 50; i++) {
    await prisma.jobView.create({
      data: {
        jobId: createdJobs[0].id, // Senior Frontend Developer
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        country: 'United Kingdom',
        city: ['London', 'Manchester', 'Birmingham'][Math.floor(Math.random() * 3)],
        device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
        viewedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('✅ Job view tracking data created');

  // ==================== SUMMARY ====================
  
  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('═══════════════════════════════════════════════════════');
  console.log('Super Admin: superadmin@slbrothers.co.uk / superadmin123');
  console.log('Admin:       michael.c@slbrothers.co.uk / admin123');
  console.log('Employee:    sarah.j@slbrothers.co.uk / employee123');
  console.log('\nOther Employees (all use password: employee123):');
  console.log('- james.b@slbrothers.co.uk   (Senior Developer)');
  console.log('- lisa.a@slbrothers.co.uk    (Content Strategist)');
  console.log('- david.m@slbrothers.co.uk   (Operations Coordinator)');
  console.log('- emma.w@slbrothers.co.uk    (AI Research Analyst)');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📊 Database Summary:');
  console.log('- 1 Superadmin');
  console.log('- 1 Admin (with employee record)');
  console.log('- 5 Employees (with employee records)');
  console.log('- 6 Divisions');
  console.log('- 10 Sample Approvals (8 approved/rejected, 2 pending)');
  console.log('- 1 Scheduled Interview');
  console.log('- 2 Audit Log entries');
  console.log('- 6 Job Postings (4 active/published, 2 drafts)');
  console.log('- 6 Job Applications (across 3 jobs)');
  console.log('- 50 Job View tracking records');
  console.log('\n⚠️  IMPORTANT: Change all default passwords in production!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });