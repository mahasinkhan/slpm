
// components/JobCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  status: 'draft' | 'active' | 'closed';
  isPublished: boolean;
  applicationsCount: number;
  createdAt: string;
  salary?: {
    min: string;
    max: string;
    currency: string;
  };
}

interface JobCardProps {
  job: Job;
  onEdit?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  onTogglePublish?: (jobId: string, currentStatus: boolean) => void;
  showActions?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  onTogglePublish,
  showActions = true
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <button
              onClick={() => navigate(`/admin/jobs/${job.id}`)}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition text-left"
            >
              {job.title}
            </button>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              {job.isPublished && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  🌐 Published
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span>🏢</span>
            <span>{job.department}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>💼</span>
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>📊</span>
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        {job.salary && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Salary Range</p>
            <p className="text-base font-semibold text-gray-900">
              {job.salary.currency === 'GBP' && '£'}
              {job.salary.currency === 'USD' && '$'}
              {job.salary.currency === 'EUR' && '€'}
              {parseInt(job.salary.min).toLocaleString()} - {parseInt(job.salary.max).toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span>📨</span>
              <span className="font-semibold text-blue-600">{job.applicationsCount}</span>
              <span className="text-gray-500">applications</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/jobs/${job.id}`)}
            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            View
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(job.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition"
            >
              Edit
            </button>
          )}
          {onTogglePublish && (
            <button
              onClick={() => onTogglePublish(job.id, job.isPublished)}
              className="flex-1 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition"
            >
              {job.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(job.id)}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;