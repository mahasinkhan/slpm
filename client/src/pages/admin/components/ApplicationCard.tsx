
// components/ApplicationCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  jobTitle: string;
  jobId: string;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  resumeUrl?: string;
  coverLetter?: string;
  experienceYears?: number;
  currentCompany?: string;
}

interface ApplicationCardProps {
  application: Application;
  onStatusChange?: (applicationId: string, newStatus: Application['status']) => void;
  onViewDetails?: (applicationId: string) => void;
  onDownloadResume?: (resumeUrl: string) => void;
  showActions?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onStatusChange,
  onViewDetails,
  onDownloadResume,
  showActions = true
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(application.id);
    } else {
      navigate(`/admin/applications/${application.id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <button
              onClick={handleViewDetails}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition text-left"
            >
              {application.candidateName}
            </button>
            <button
              onClick={() => navigate(`/admin/jobs/${application.jobId}`)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
            >
              {application.jobTitle}
            </button>
          </div>
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-gray-400">📧</span>
            <a href={`mailto:${application.email}`} className="hover:text-blue-600 transition">
              {application.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-gray-400">📱</span>
            <a href={`tel:${application.phone}`} className="hover:text-blue-600 transition">
              {application.phone}
            </a>
          </div>
        </div>

        {/* Additional Info */}
        {(application.experienceYears || application.currentCompany) && (
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-100">
            {application.experienceYears && (
              <div className="flex items-center gap-1">
                <span>💼</span>
                <span>{application.experienceYears} years experience</span>
              </div>
            )}
            {application.currentCompany && (
              <div className="flex items-center gap-1">
                <span>🏢</span>
                <span>{application.currentCompany}</span>
              </div>
            )}
          </div>
        )}

        {/* Cover Letter Preview */}
        {application.coverLetter && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Cover Letter</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>Applied: {formatDate(application.appliedDate)}</span>
          {application.resumeUrl && (
            <button
              onClick={() => onDownloadResume ? onDownloadResume(application.resumeUrl!) : window.open(application.resumeUrl, '_blank')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              📎 Resume
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewDetails}
              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              View Details
            </button>
            
            {onStatusChange && application.status !== 'shortlisted' && application.status !== 'hired' && (
              <button
                onClick={() => onStatusChange(application.id, 'shortlisted')}
                className="flex-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                ⭐ Shortlist
              </button>
            )}
            
            {onStatusChange && application.status !== 'rejected' && application.status !== 'hired' && (
              <button
                onClick={() => onStatusChange(application.id, 'rejected')}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Status Change */}
          {onStatusChange && application.status === 'shortlisted' && (
            <button
              onClick={() => onStatusChange(application.id, 'hired')}
              className="w-full mt-2 px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              🎉 Mark as Hired
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;