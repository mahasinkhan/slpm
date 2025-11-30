
// components/EmployeeCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employeeId: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  profileImage?: string;
  location?: string;
  manager?: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employeeId: string) => void;
  onDelete?: (employeeId: string) => void;
  onViewDetails?: (employeeId: string) => void;
  showActions?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onViewDetails,
  showActions = true
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
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

  const getInitials = () => {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(employee.id);
    } else {
      navigate(`/admin/employees/${employee.id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden">
      {/* Header with Profile */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <button onClick={handleViewDetails} className="flex-shrink-0">
            {employee.profileImage ? (
              <img
                src={employee.profileImage}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm">
                {getInitials()}
              </div>
            )}
          </button>

          {/* Employee Info */}
          <div className="flex-1 min-w-0">
            <button
              onClick={handleViewDetails}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition text-left"
            >
              {employee.firstName} {employee.lastName}
            </button>
            <p className="text-sm text-gray-600 mt-1">{employee.position}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1).replace('-', ' ')}
              </span>
              <span className="text-xs text-gray-500">ID: {employee.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-gray-400">📧</span>
            <a href={`mailto:${employee.email}`} className="hover:text-blue-600 transition truncate">
              {employee.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-gray-400">📱</span>
            <a href={`tel:${employee.phone}`} className="hover:text-blue-600 transition">
              {employee.phone}
            </a>
          </div>
        </div>

        {/* Department & Location */}
        <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span>🏢</span>
            <span>{employee.department}</span>
          </div>
          {employee.location && (
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{employee.location}</span>
            </div>
          )}
        </div>

        {/* Manager & Join Date */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
          {employee.manager && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reports to:</span>
              <span className="font-medium text-gray-900">{employee.manager}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Joined:</span>
            <span className="font-medium text-gray-900">{formatDate(employee.joinDate)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            View Profile
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(employee.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(employee.id)}
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

export default EmployeeCard;