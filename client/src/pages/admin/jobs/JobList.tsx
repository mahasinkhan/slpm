// jobs/JobList.tsx - INTEGRATED WITH BACKEND API
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import AdminHeader from '../components/AdminHeader';
import { jobApi, Job } from '../../../services/jobApi';

const JobList: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('[JobList] 📥 Fetching jobs from API...');
      
      // Only send page and limit - backend validation rejects other params
      const response = await jobApi.getJobs({
        page: 1,
        limit: 100
      });

      console.log('[JobList] 📊 API Response:', response);

      if (response.success) {
        console.log('[JobList] ✅ Jobs fetched successfully:', response.data.length, 'jobs');
        setJobs(response.data);
      } else {
        console.error('[JobList] ❌ Failed to fetch jobs:', response.error);
        alert('Failed to load jobs: ' + response.error);
      }
    } catch (error) {
      console.error('[JobList] ❌ Error fetching jobs:', error);
      alert('Failed to load jobs. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique departments
  const departments = Array.from(new Set(jobs.map(job => job.department).filter(Boolean)));

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Updated handleDelete with improved feedback and error handling
  const handleDelete = async (jobId: string) => {
    try {
      setDeleting(true);
      console.log('🗑️ Deleting job:', jobId);
      
      const response = await jobApi.deleteJob(jobId);
      
      if (response.success) {
        console.log('✅ Job deleted from database');
        
        // Remove from local state immediately
        setJobs(jobs.filter(job => job.id !== jobId));
        
        // Close modal
        setShowDeleteModal(false);
        setJobToDelete(null);
        
        // Show success message
        alert('Job permanently deleted from database');
        
        // Refresh from database to confirm deletion
        setTimeout(() => {
          fetchJobs();
        }, 500);
      } else {
        console.error('❌ Delete failed:', response.error);
        alert('Failed to delete job: ' + response.error);
      }
    } catch (error: any) {
      console.error('❌ Error deleting job:', error);
      alert(error.response?.data?.message || 'Failed to delete job. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle publish status
  const togglePublish = async (jobId: string, currentStatus: boolean) => {
    try {
      console.log(`${currentStatus ? '📴' : '📢'} Toggling publish status for job:`, jobId);
      
      const response = await jobApi.togglePublish(jobId, !currentStatus);
      
      if (response.success) {
        console.log('✅ Publish status updated');
        
        // Update local state
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, isPublished: !currentStatus } : job
        ));
        
        alert(`Job ${!currentStatus ? 'published' : 'unpublished'} successfully`);
        
        // Refresh to ensure sync with database
        setTimeout(() => {
          fetchJobs();
        }, 500);
      } else {
        console.error('❌ Toggle publish failed:', response.error);
        alert('Failed to update publish status: ' + response.error);
      }
    } catch (error: any) {
      console.error('❌ Error toggling publish status:', error);
      alert(error.response?.data?.message || 'Failed to update publish status. Please try again.');
    }
  };

  // Stats
  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'ACTIVE').length,
    draft: jobs.filter(j => j.status === 'DRAFT').length,
    closed: jobs.filter(j => j.status === 'CLOSED').length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0)
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Job Positions"
        subtitle="Manage all job postings and career opportunities"
        actionButton={{
          label: 'Create New Job',
          onClick: () => navigate('/admin/jobs/create'),
          icon: '➕',
          variant: 'primary'
        }}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Jobs</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.active}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Draft</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.draft}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Closed</div>
            <div className="text-2xl font-bold text-gray-600 mt-1">{stats.closed}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Applications</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{stats.totalApplications}</div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate('/admin/jobs/published')}
            className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 font-medium text-sm transition"
          >
            🌐 Published Jobs ({jobs.filter(j => j.isPublished).length})
          </button>
          <button
            onClick={() => navigate('/admin/jobs/drafts')}
            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 font-medium text-sm transition"
          >
            📝 Drafts ({stats.draft})
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, department, location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
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
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new job</p>
              <button
                onClick={() => navigate('/admin/jobs/create')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create New Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{job.title}</span>
                          <span className="text-xs text-gray-500">{job.experienceLevel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.employmentType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {job.applicationsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublish(job.id, job.isPublished)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition ${
                            job.isPublished 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {job.isPublished ? '✓ Published' : '✗ Unpublished'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/jobs/${job.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                            title="View Details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium transition"
                            title="Edit Job"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setJobToDelete(job.id);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                            title="Delete Job"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition disabled:opacity-50"
          >
            🔄 Refresh List
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Job Position?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be undone and all associated applications will also be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => jobToDelete && handleDelete(jobToDelete)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default JobList;