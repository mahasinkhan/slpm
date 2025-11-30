// src/pages/employee/leaves/MyLeaves.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeStats from '../components/EmployeeStats';
import {
  Calendar,
  Plus,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
} from 'lucide-react';

const MyLeaves: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Leave balance data
  const leaveBalance = [
    { type: 'Casual Leave', total: 12, used: 5, remaining: 7, color: 'blue' },
    { type: 'Sick Leave', total: 10, used: 2, remaining: 8, color: 'green' },
    { type: 'Earned Leave', total: 15, used: 3, remaining: 12, color: 'purple' },
    { type: 'Unpaid Leave', total: '∞', used: 0, remaining: '∞', color: 'gray' },
  ];

  // Leave requests data
  const leaveRequests = [
    {
      id: 1,
      type: 'Casual Leave',
      startDate: '2024-12-25',
      endDate: '2024-12-26',
      days: 2,
      reason: 'Christmas celebration with family',
      status: 'Approved',
      appliedOn: '2024-12-10',
      approvedBy: 'John Manager',
    },
    {
      id: 2,
      type: 'Sick Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-20',
      days: 1,
      reason: 'Medical appointment',
      status: 'Pending',
      appliedOn: '2024-12-15',
      approvedBy: null,
    },
    {
      id: 3,
      type: 'Earned Leave',
      startDate: '2024-11-15',
      endDate: '2024-11-18',
      days: 4,
      reason: 'Family vacation',
      status: 'Approved',
      appliedOn: '2024-11-01',
      approvedBy: 'John Manager',
    },
    {
      id: 4,
      type: 'Casual Leave',
      startDate: '2024-10-10',
      endDate: '2024-10-10',
      days: 1,
      reason: 'Personal work',
      status: 'Rejected',
      appliedOn: '2024-10-08',
      approvedBy: 'John Manager',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            <Clock size={12} /> Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Casual Leave':
        return 'bg-blue-100 text-blue-700';
      case 'Sick Leave':
        return 'bg-green-100 text-green-700';
      case 'Earned Leave':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesStatus = filterStatus === 'all' || request.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = request.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalance.map((leave, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">{leave.type}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">{leave.remaining}</p>
                <p className="text-xs text-gray-500">of {leave.total} remaining</p>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                leave.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                leave.color === 'green' ? 'bg-green-100 text-green-700' :
                leave.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {leave.used} used
              </div>
            </div>
            {/* Progress bar */}
            {typeof leave.total === 'number' && (
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    leave.color === 'blue' ? 'bg-blue-500' :
                    leave.color === 'green' ? 'bg-green-500' :
                    leave.color === 'purple' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}
                  style={{ width: `${((leave.total - (leave.remaining as number)) / leave.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leaves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filter & Apply */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button
              onClick={() => navigate('/employee/leaves/apply')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              <Plus size={18} />
              Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Leave Requests</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Duration
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Days
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Reason
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getLeaveTypeColor(request.type)}`}>
                      {request.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">
                      {new Date(request.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      {request.startDate !== request.endDate && (
                        <> - {new Date(request.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</>
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-gray-800">{request.days}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-600 text-sm max-w-xs truncate">{request.reason}</p>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-4 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Eye size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getLeaveTypeColor(request.type)}`}>
                  {request.type}
                </span>
                {getStatusBadge(request.status)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-800">
                    {new Date(request.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    {request.startDate !== request.endDate && (
                      <> - {new Date(request.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</>
                    )}
                  </span>
                  <span className="text-gray-500">({request.days} days)</span>
                </div>
                <p className="text-sm text-gray-600">{request.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No leave requests found</p>
          </div>
        )}
      </div>

      {/* Floating Apply Button - Mobile */}
      <div className="md:hidden fixed bottom-20 right-6 z-20">
        <button
          onClick={() => navigate('/employee/leaves/apply')}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default MyLeaves;