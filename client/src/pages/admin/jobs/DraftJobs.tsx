// jobs/DraftJobs.tsx - INTEGRATED WITH BACKEND API
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import AdminHeader from '../components/AdminHeader';
import { jobApi, Job } from '../../../services/jobApi';

const DraftJobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'completion'>('recent');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchDraftJobs();
  }, []);

  const fetchDraftJobs = async () => {
    try {
      setLoading(true);
      const response = await jobApi.getJobs({
        status: 'DRAFT',
        page: 1,
        limit: 100,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching draft jobs:', error);
      alert('Failed to load draft jobs');
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
        case 'completion':
          return b.completionPercentage - a.completionPercentage;
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const departments = Array.from(new Set(jobs.map(job => job.department)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleDelete = async (jobId: string) => {
    try {
      await jobApi.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      setShowDeleteModal(false);
      setJobToDelete(null);
      alert('Draft job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleActivate = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.completionPercentage < 100) {
      alert('Please complete all required fields before activating this job.');
      return;
    }

    try {
      await jobApi.updateStatus(jobId, 'ACTIVE');
      setJobs(jobs.filter(job => job.id !== jobId)); // Remove from drafts
      alert('Job activated successfully!');
    } catch (error) {
      console.error('Error activating job:', error);
      alert('Failed to activate job');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading draft jobs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Draft Jobs"
        subtitle="Incomplete job postings that need your attention"
        actionButton={{
          label: 'Create New Job',
          onClick: () => navigate('/admin/jobs/create'),
          icon: '➕',
          variant: 'primary'
        }}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Drafts</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">{jobs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Nearly Complete</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {jobs.filter(j => j.completionPercentage >= 80).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Needs Work</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {jobs.filter(j => j.completionPercentage < 50).length}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Complete Your Draft Jobs</h3>
              <p className="text-sm text-yellow-800">
                Draft jobs are not visible to candidates. Complete all required fields and activate them to start receiving applications.
              </p>
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
                placeholder="Search drafts..."
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
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recently Updated</option>
                <option value="completion">Completion %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-gray-500 mb-2">No draft jobs found</p>
            <p className="text-gray-400 mb-6">All your jobs are complete and active!</p>
            <button
              onClick={() => navigate('/admin/jobs/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Create New Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <button
                        onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition text-left mb-2"
                      >
                        {job.title}
                      </button>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>🏢 {job.department}</span>
                        <span>📍 {job.location}</span>
                        <span>💼 {job.employmentType}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getCompletionColor(job.completionPercentage)}`}>
                        {job.completionPercentage}% Complete
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Updated {formatDate(job.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Completion Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          job.completionPercentage >= 80 ? 'bg-green-500' :
                          job.completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${job.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Missing Fields */}
                  {job.missingFields && job.missingFields.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-orange-900 mb-2">
                        ⚠️ Missing Required Fields:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.missingFields.map((field, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Continue Editing
                    </button>
                    {job.completionPercentage === 100 && (
                      <button
                        onClick={() => handleActivate(job.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Activate Job
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/admin/jobs/${job.id}`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => {
                        setJobToDelete(job.id);
                        setShowDeleteModal(true);
                      }}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Draft Job?</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete this draft job. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => jobToDelete && handleDelete(jobToDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DraftJobs;