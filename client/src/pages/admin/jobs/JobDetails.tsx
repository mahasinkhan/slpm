// jobs/JobDetails.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salary: {
    min: string;
    max: string;
    currency: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  status: 'draft' | 'active' | 'closed';
  isPublished: boolean;
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  applicationDeadline: string;
}

interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  resumeUrl?: string;
}

const JobDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'applications'>('details');
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
      fetchApplications();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/jobs/${id}`);
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/admin/jobs/${id}/applications`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Mock data for demo
  useEffect(() => {
    const mockJob: Job = {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'London, UK / Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salary: { min: '60000', max: '80000', currency: 'GBP' },
      description: 'We are looking for an experienced Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining our web applications using modern technologies and best practices.',
      responsibilities: [
        'Lead the development of complex frontend features and applications',
        'Collaborate with designers and backend developers to implement user interfaces',
        'Mentor junior developers and conduct code reviews',
        'Optimize application performance and ensure cross-browser compatibility',
        'Participate in technical planning and architecture decisions'
      ],
      requirements: [
        '5+ years of experience in frontend development',
        'Expert knowledge of React, TypeScript, and modern JavaScript',
        'Strong understanding of HTML5, CSS3, and responsive design',
        'Experience with state management (Redux, MobX, or similar)',
        'Familiarity with testing frameworks (Jest, React Testing Library)',
        'Excellent problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Flexible working hours and remote work options',
        '25 days annual leave plus bank holidays',
        'Private health insurance',
        'Learning and development budget',
        'Modern office in Central London',
        'Regular team events and social activities'
      ],
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS3', 'Redux', 'Next.js', 'Git', 'REST APIs'],
      status: 'active',
      isPublished: true,
      applicationsCount: 24,
      viewsCount: 456,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-20T14:30:00Z',
      applicationDeadline: '2025-03-15'
    };

    const mockApplications: Application[] = [
      {
        id: '1',
        candidateName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+44 7700 900123',
        appliedDate: '2025-01-22T10:30:00Z',
        status: 'new',
        resumeUrl: '/resumes/john-smith.pdf'
      },
      {
        id: '2',
        candidateName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+44 7700 900456',
        appliedDate: '2025-01-21T15:20:00Z',
        status: 'reviewing',
        resumeUrl: '/resumes/sarah-johnson.pdf'
      },
      {
        id: '3',
        candidateName: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+44 7700 900789',
        appliedDate: '2025-01-20T09:45:00Z',
        status: 'shortlisted',
        resumeUrl: '/resumes/michael-brown.pdf'
      }
    ];

    setJob(mockJob);
    setApplications(mockApplications);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const togglePublish = async () => {
    if (!job) return;
    
    try {
      await fetch(`/api/admin/jobs/${job.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !job.isPublished })
      });
      
      setJob({ ...job, isPublished: !job.isPublished });
      setShowPublishModal(false);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status');
    }
  };

  const handleStatusChange = async (jobStatus: 'active' | 'draft' | 'closed') => {
    if (!job) return;
    
    try {
      await fetch(`/api/admin/jobs/${job.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: jobStatus })
      });
      
      setJob({ ...job, status: jobStatus });
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Job not found</p>
          <button
            onClick={() => navigate('/admin/jobs')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  ðŸ“ {job.location}
                </span>
                <span className="flex items-center gap-1">
                  ðŸ’¼ {job.employmentType}
                </span>
                <span className="flex items-center gap-1">
                  ðŸ“Š {job.experienceLevel}
                </span>
                <span className="flex items-center gap-1">
                  ðŸ¢ {job.department}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/jobs')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              â† Back
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <button
              onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Edit Job
            </button>
            <button
              onClick={() => setShowPublishModal(true)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                job.isPublished
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {job.isPublished ? 'Unpublish from Careers' : 'Publish to Careers'}
            </button>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Applications</div>
            <div className="text-3xl font-bold text-blue-600">{job.applicationsCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Page Views</div>
            <div className="text-3xl font-bold text-purple-600">{job.viewsCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Application Deadline</div>
            <div className="text-xl font-bold text-gray-900">{formatDate(job.applicationDeadline)}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Published</div>
            <div className={`text-xl font-bold ${job.isPublished ? 'text-green-600' : 'text-gray-400'}`}>
              {job.isPublished ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 font-medium transition flex items-center gap-2 ${
                activeTab === 'applications'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Applications
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                {applications.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' ? (
              <div className="space-y-6">
                {/* Salary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Salary Range</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {job.salary.currency === 'GBP' && 'Â£'}
                      {job.salary.currency === 'USD' && '$'}
                      {job.salary.currency === 'EUR' && 'â‚¬'}
                      {parseInt(job.salary.min).toLocaleString()} - {parseInt(job.salary.max).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Per annum</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">â€¢</span>
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements & Qualifications</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">â€¢</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits & Perks</h3>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">âœ“</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metadata */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 text-gray-900 font-medium">{formatDateTime(job.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="ml-2 text-gray-900 font-medium">{formatDateTime(job.updatedAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Job ID:</span>
                      <span className="ml-2 text-gray-900 font-medium">{job.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 text-gray-900 font-medium capitalize">{job.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No applications yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Applications will appear here once candidates apply for this position
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{app.candidateName}</h4>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApplicationStatusColor(app.status)}`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>ðŸ“§ {app.email}</p>
                              <p>ðŸ“± {app.phone}</p>
                              <p>ðŸ“… Applied: {formatDateTime(app.appliedDate)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/applications/${app.id}`)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                              View Details
                            </button>
                            {app.resumeUrl && (
                              <button
                                onClick={() => window.open(app.resumeUrl, '_blank')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                              >
                                Download CV
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish/Unpublish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {job.isPublished ? 'Unpublish Job?' : 'Publish Job?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {job.isPublished
                ? 'This job will be removed from the public careers page. Existing applications will be preserved.'
                : 'This job will be visible on your public careers page and candidates can apply for it.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={togglePublish}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  job.isPublished
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {job.isPublished ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;