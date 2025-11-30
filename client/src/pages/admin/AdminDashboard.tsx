// pages/admin/AdminDashboard.tsx - IMPROVED DESIGN WITH DATA VALIDATION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminHeader from './components/AdminHeader';
import StatsCard from './components/StatsCard';

interface Stats {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  totalApplications: number;
  newApplications: number;
  underReviewApplications: number;
  shortlistedApplications: number;
  rejectedApplications: number;
  totalEmployees: number;
  upcomingInterviews: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'job' | 'interview' | 'employee';
  title: string;
  description: string;
  time: string;
  icon: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    underReviewApplications: 0,
    shortlistedApplications: 0,
    rejectedApplications: 0,
    totalEmployees: 0,
    upcomingInterviews: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch('/api/admin/dashboard/stats');
      // const data = await response.json();
      
      // Validate data consistency
      // validateStats(data);
      // setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Data validation function to ensure consistency
  const validateStats = (data: Partial<Stats>): Stats => {
    const newApps = data.newApplications || 0;
    const underReview = data.underReviewApplications || 0;
    const shortlisted = data.shortlistedApplications || 0;
    const rejected = data.rejectedApplications || 0;
    
    // Calculate total from sub-categories
    const calculatedTotal = newApps + underReview + shortlisted + rejected;
    
    // Use calculated total to ensure consistency
    return {
      totalJobs: data.totalJobs || 0,
      activeJobs: data.activeJobs || 0,
      draftJobs: data.draftJobs || 0,
      totalApplications: calculatedTotal, // Always calculated, never from API
      newApplications: newApps,
      underReviewApplications: underReview,
      shortlistedApplications: shortlisted,
      rejectedApplications: rejected,
      totalEmployees: data.totalEmployees || 0,
      upcomingInterviews: data.upcomingInterviews || 0
    };
  };

  // Mock data with validation
  useEffect(() => {
    const mockData = {
      totalJobs: 12,
      activeJobs: 8,
      draftJobs: 4,
      newApplications: 24,
      underReviewApplications: 32,
      shortlistedApplications: 18,
      rejectedApplications: 82,
      totalEmployees: 45,
      upcomingInterviews: 7
    };

    // Validate and set stats
    const validatedStats = validateStats(mockData);
    setStats(validatedStats);

    setRecentActivities([
      {
        id: '1',
        type: 'application',
        title: 'New Application',
        description: 'John Smith applied for Senior Frontend Developer',
        time: '5 minutes ago',
        icon: '📨'
      },
      {
        id: '2',
        type: 'job',
        title: 'Job Published',
        description: 'Product Designer position is now live on careers page',
        time: '2 hours ago',
        icon: '🌐'
      },
      {
        id: '3',
        type: 'interview',
        title: 'Interview Scheduled',
        description: 'Interview with Sarah Johnson for Backend Engineer',
        time: '3 hours ago',
        icon: '🎤'
      },
      {
        id: '4',
        type: 'application',
        title: 'Application Shortlisted',
        description: 'Michael Brown moved to shortlist for Marketing Manager',
        time: '5 hours ago',
        icon: '⭐'
      },
      {
        id: '5',
        type: 'employee',
        title: 'New Employee Added',
        description: 'Emma Wilson joined as UX Designer',
        time: '1 day ago',
        icon: '👤'
      }
    ]);

    setLoading(false);
  }, []);

  const quickActions = [
    {
      title: 'Create New Job',
      description: 'Post a new job position',
      icon: '➕',
      color: 'blue' as const,
      link: '/admin/jobs/create'
    },
    {
      title: 'Register Employee',
      description: 'Add a new employee',
      icon: '👤',
      color: 'green' as const,
      link: '/admin/employees/register'
    },
    {
      title: 'Schedule Interview',
      description: 'Book an interview slot',
      icon: '📅',
      color: 'purple' as const,
      link: '/admin/interviews/schedule'
    },
    {
      title: 'View Applications',
      description: 'Review new applications',
      icon: '📋',
      color: 'orange' as const,
      link: '/admin/applications/new'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500 text-blue-600 bg-opacity-10',
      green: 'bg-green-500 text-green-600 bg-opacity-10',
      purple: 'bg-purple-500 text-purple-600 bg-opacity-10',
      orange: 'bg-orange-500 text-orange-600 bg-opacity-10'
    };
    return colors[color] || colors.blue;
  };

  // Calculate percentages for visual feedback
  const getApplicationPercentage = (count: number) => {
    return stats.totalApplications > 0 
      ? Math.round((count / stats.totalApplications) * 100) 
      : 0;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
        showPublicSiteButton={true}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Enhanced Stats Grid with Better Visual Hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Jobs"
            value={stats.totalJobs}
            subtitle={`${stats.activeJobs} active, ${stats.draftJobs} draft`}
            icon="💼"
            color="blue"
            clickable
            link="/admin/jobs"
          />
          <StatsCard
            title="Applications"
            value={stats.totalApplications}
            subtitle={`${stats.newApplications} new`}
            icon="📨"
            color="green"
            clickable
            link="/admin/applications"
          />
          <StatsCard
            title="Employees"
            value={stats.totalEmployees}
            subtitle="View all"
            icon="👥"
            color="purple"
            clickable
            link="/admin/employees"
          />
          <StatsCard
            title="Interviews"
            value={stats.upcomingInterviews}
            subtitle="upcoming"
            icon="🎤"
            color="orange"
            clickable
            link="/admin/interviews"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.link)}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition text-left active:scale-95"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${getColorClasses(action.color)}`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{action.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{activity.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Overview Sections with Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
          {/* Job Overview - Enhanced */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Job Overview</h2>
            <div className="space-y-4">
              {/* Active Jobs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm sm:text-base text-gray-600">Active Jobs</span>
                  <span className="font-semibold text-green-600 text-base sm:text-lg">{stats.activeJobs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.activeJobs / stats.totalJobs) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Draft Jobs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm sm:text-base text-gray-600">Draft Jobs</span>
                  <span className="font-semibold text-yellow-600 text-base sm:text-lg">{stats.draftJobs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.draftJobs / stats.totalJobs) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-gray-900">Total Openings</span>
                  <span className="font-bold text-blue-600 text-lg sm:text-xl">{stats.totalJobs}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/jobs')}
              className="mt-4 w-full py-2 sm:py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm sm:text-base active:scale-95"
            >
              Manage Jobs
            </button>
          </div>

          {/* Application Pipeline - Enhanced with Progress Visualization */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Application Pipeline</h2>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalApplications}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* New Applications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-600">New</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{getApplicationPercentage(stats.newApplications)}%</span>
                    <span className="font-semibold text-blue-600 text-base sm:text-lg">{stats.newApplications}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getApplicationPercentage(stats.newApplications)}%` }}
                  ></div>
                </div>
              </div>

              {/* Under Review */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-600">Under Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{getApplicationPercentage(stats.underReviewApplications)}%</span>
                    <span className="font-semibold text-yellow-600 text-base sm:text-lg">{stats.underReviewApplications}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getApplicationPercentage(stats.underReviewApplications)}%` }}
                  ></div>
                </div>
              </div>

              {/* Shortlisted */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-600">Shortlisted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{getApplicationPercentage(stats.shortlistedApplications)}%</span>
                    <span className="font-semibold text-green-600 text-base sm:text-lg">{stats.shortlistedApplications}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getApplicationPercentage(stats.shortlistedApplications)}%` }}
                  ></div>
                </div>
              </div>

              {/* Rejected */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-600">Rejected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{getApplicationPercentage(stats.rejectedApplications)}%</span>
                    <span className="font-semibold text-red-600 text-base sm:text-lg">{stats.rejectedApplications}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getApplicationPercentage(stats.rejectedApplications)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/applications')}
              className="mt-4 w-full py-2 sm:py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm sm:text-base active:scale-95"
            >
              Review Applications
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;