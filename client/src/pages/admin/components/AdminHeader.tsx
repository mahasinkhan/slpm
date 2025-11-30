// components/AdminHeader.tsx - With Public Site Navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
  };
  backButton?: boolean;
  backPath?: string;
  showPublicSiteButton?: boolean; // New prop to show/hide public site button
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actionButton,
  backButton = false,
  backPath,
  showPublicSiteButton = true // Show by default
}) => {
  const navigate = useNavigate();

  const getButtonClasses = (variant: string = 'primary') => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    return variants[variant as keyof typeof variants] || variants.primary;
  };

  const handlePublicSiteNavigation = () => {
    // Navigate to public home page
    navigate('/');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm flex-wrap">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  {crumb.path ? (
                    <button
                      onClick={() => navigate(crumb.path!)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-600">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Section - Title */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {backButton && (
              <button
                onClick={() => backPath ? navigate(backPath) : navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2 sm:line-clamp-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Public Site Button - Hidden on mobile by default, can be shown */}
            {showPublicSiteButton && (
              <button
                onClick={handlePublicSiteNavigation}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-medium"
                title="Go to Public Site"
              >
                <Home size={18} />
                <span className="hidden lg:inline">Public Site</span>
              </button>
            )}

            {/* Mobile Public Site Button - Icon only */}
            {showPublicSiteButton && (
              <button
                onClick={handlePublicSiteNavigation}
                className="sm:hidden p-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                title="Go to Public Site"
              >
                <Home size={20} />
              </button>
            )}

            {/* Action Button */}
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className={`px-4 sm:px-6 py-2.5 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${getButtonClasses(actionButton.variant)}`}
              >
                {actionButton.icon && <span className="text-lg">{actionButton.icon}</span>}
                <span className="hidden sm:inline">{actionButton.label}</span>
                {/* Show shorter text or icon on mobile */}
                <span className="sm:hidden">{actionButton.icon || actionButton.label.split(' ')[0]}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;