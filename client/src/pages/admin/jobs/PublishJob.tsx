// jobs/PublishedJobs.tsx - INTEGRATED WITH BACKEND API
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import AdminHeader from '../components/AdminHeader';
import { jobApi, Job } from '../../../services/jobApi';

const PublishedJobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'applications'>('recent');

  // Fetch published jobs from API
  useEffect(() => {
    fetchPublishedJobs();
  }, []);

  const fetchPublishedJobs = async () => {
    try {
      setLoading(true);
      
      // Only send required params - backend validation rejects sortBy/sortOrder
      const response = await jobApi.getJobs({
        status: 'ACTIVE',
        page: 1,
        limit: 100
      });

      if (response.success) {
        // Filter only published jobs
        const publishedJobs = response.data.filter(job => job.isPublished === true);
        setJobs(publishedJobs);
      } else {
        console.error('Failed to fetch jobs:', response.error);
      }
    } catch (error) {
      console.error('Error fetching published jobs:', error);
      alert('Failed to load published jobs');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        case 'applications':
          return (b.applicationsCount || 0) - (a.applicationsCount || 0);
        case 'recent':
        default:
          const dateA = new Date(a.publishedAt || a.createdAt).getTime();
          const dateB = new Date(b.publishedAt || b.createdAt).getTime();
          return dateB - dateA;
      }
    });

  const departments = Array.from(new Set(jobs.map(job => job.department).filter(Boolean)));

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatSalary = (job: Job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Competitive';
    
    const currency = job.salaryCurrency === 'GBP' ? '£' : 
                     job.salaryCurrency === 'USD' ? '$' : '€';
    
    if (job.salaryMin && job.salaryMax) {
      return `${currency}${(job.salaryMin / 1000).toFixed(0)}k - ${currency}${(job.salaryMax / 1000).toFixed(0)}k`;
    }
    if (job.salaryMin) return `From ${currency}${(job.salaryMin / 1000).toFixed(0)}k`;
    if (job.salaryMax) return `Up to ${currency}${(job.salaryMax / 1000).toFixed(0)}k`;
    return 'Competitive';
  };

  const handleUnpublish = async (jobId: string) => {
    if (!confirm('Are you sure you want to unpublish this job? It will no longer be visible on the careers page.')) return;
    
    try {
      const response = await jobApi.togglePublish(jobId, false);
      
      if (response.success) {
        // Remove from local state
        setJobs(jobs.filter(job => job.id !== jobId));
        alert('Job unpublished successfully');
      } else {
        alert('Failed to unpublish job: ' + response.error);
      }
    } catch (error) {
      console.error('Error unpublishing job:', error);
      alert('Failed to unpublish job');
    }
  };

  // Calculate stats
  const stats = {
    totalJobs: jobs.length,
    totalViews: jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0),
    totalApplications: jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0),
    avgApplications: jobs.length > 0 
      ? Math.round(jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0) / jobs.length) 
      : 0
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading published jobs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Published Jobs"
        subtitle="Jobs currently live on your careers page"
        actionButton={{
          label: 'Create New Job',
          onClick: () => navigate('/admin/jobs/create'),
          icon: '➕',
          variant: 'primary'
        }}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Published Jobs</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{stats.totalJobs}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Views</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">{stats.totalViews}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Applications</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.totalApplications}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Avg. Applications</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">{stats.avgApplications}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div>
                <h3 className="font-semibold text-gray-900">Public Careers Page</h3>
                <p className="text-sm text-gray-600">These jobs are visible to candidates on your website</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open('/careers', '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                View Careers Page →
              </button>
              <button
                onClick={() => navigate('/admin/jobs')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                All Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'views' | 'applications')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recently Published</option>
                <option value="views">Most Views</option>
                <option value="applications">Most Applications</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🌐</div>
            <p className="text-xl text-gray-500 mb-2">No published jobs found</p>
            <p className="text-gray-400 mb-6">Publish jobs to make them visible on your careers page</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/admin/jobs/create')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Create New Job
              </button>
              <button
                onClick={() => navigate('/admin/jobs/drafts')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                View Drafts
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <button
                        onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition text-left"
                      >
                        {job.title}
                      </button>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>🏢 {job.department}</span>
                        <span>•</span>
                        <span>📍 {job.location}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      🌐 Live
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Views</div>
                      <div className="text-xl font-bold text-blue-600">{job.viewsCount || 0}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Applications</div>
                      <div className="text-xl font-bold text-green-600">{job.applicationsCount || 0}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Employment:</span>
                      <span className="font-medium">{job.employmentType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{job.experienceLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="font-medium">{formatSalary(job)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Published:</span>
                      <span className="font-medium">{formatDate(job.publishedAt || job.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className={`font-medium ${
                        new Date(job.applicationDeadline) < new Date() ? 'text-red-600' : ''
                      }`}>
                        {formatDate(job.applicationDeadline)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => navigate(`/admin/jobs/${job.id}`)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleUnpublish(job.id)}
                      className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      Unpublish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchPublishedJobs}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            🔄 Refresh List
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PublishedJobs;