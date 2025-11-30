// src/pages/employee/leaves/LeaveHistory.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const LeaveHistory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [filterType, setFilterType] = useState('all');

  const years = ['2024', '2023', '2022'];

  const leaveHistory = [
    {
      id: 1,
      type: 'Casual Leave',
      startDate: '2024-12-25',
      endDate: '2024-12-26',
      days: 2,
      reason: 'Christmas celebration with family',
      status: 'Approved',
      appliedOn: '2024-12-10',
      approvedOn: '2024-12-11',
      approvedBy: 'John Manager',
    },
    {
      id: 2,
      type: 'Earned Leave',
      startDate: '2024-11-15',
      endDate: '2024-11-18',
      days: 4,
      reason: 'Family vacation',
      status: 'Approved',
      appliedOn: '2024-11-01',
      approvedOn: '2024-11-02',
      approvedBy: 'John Manager',
    },
    {
      id: 3,
      type: 'Sick Leave',
      startDate: '2024-10-20',
      endDate: '2024-10-21',
      days: 2,
      reason: 'Fever and cold',
      status: 'Approved',
      appliedOn: '2024-10-20',
      approvedOn: '2024-10-20',
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
      approvedOn: '2024-10-09',
      approvedBy: 'John Manager',
      rejectionReason: 'Critical project deadline',
    },
    {
      id: 5,
      type: 'Casual Leave',
      startDate: '2024-08-15',
      endDate: '2024-08-15',
      days: 1,
      reason: 'Independence Day celebration',
      status: 'Approved',
      appliedOn: '2024-08-10',
      approvedOn: '2024-08-11',
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
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Sick Leave':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Earned Leave':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Calculate yearly statistics
  const yearlyStats = {
    totalTaken: leaveHistory.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.days, 0),
    casual: leaveHistory.filter(l => l.type === 'Casual Leave' && l.status === 'Approved').reduce((sum, l) => sum + l.days, 0),
    sick: leaveHistory.filter(l => l.type === 'Sick Leave' && l.status === 'Approved').reduce((sum, l) => sum + l.days, 0),
    earned: leaveHistory.filter(l => l.type === 'Earned Leave' && l.status === 'Approved').reduce((sum, l) => sum + l.days, 0),
    rejected: leaveHistory.filter(l => l.status === 'Rejected').length,
  };

  const filteredHistory = filterType === 'all' 
    ? leaveHistory 
    : leaveHistory.filter(l => l.type.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/employee/leaves')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leave History</h1>
          <p className="text-gray-600">View your past leave records</p>
        </div>
      </div>

      {/* Yearly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Taken</p>
          <p className="text-2xl font-bold text-gray-800">{yearlyStats.totalTaken}</p>
          <p className="text-xs text-gray-500">days in {selectedYear}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-600">Casual</p>
          <p className="text-2xl font-bold text-blue-700">{yearlyStats.casual}</p>
          <p className="text-xs text-blue-500">days</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600">Sick</p>
          <p className="text-2xl font-bold text-green-700">{yearlyStats.sick}</p>
          <p className="text-xs text-green-500">days</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-sm text-purple-600">Earned</p>
          <p className="text-2xl font-bold text-purple-700">{yearlyStats.earned}</p>
          <p className="text-xs text-purple-500">days</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{yearlyStats.rejected}</p>
          <p className="text-xs text-red-500">requests</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-600" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Filters & Export */}
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="earned">Earned Leave</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((leave) => (
          <div
            key={leave.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLeaveTypeColor(leave.type)}`}>
                    {leave.type}
                  </span>
                  {getStatusBadge(leave.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(leave.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {leave.startDate !== leave.endDate && (
                        <> - {new Date(leave.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                      )}
                      <span className="text-blue-600 ml-2">({leave.days} days)</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="text-gray-800">{leave.reason}</p>
                  </div>
                </div>

                {leave.status === 'Rejected' && leave.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Rejection Reason:</strong> {leave.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500 md:text-right">
                <p>Applied: {new Date(leave.appliedOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                <p>
                  {leave.status === 'Approved' ? 'Approved' : 'Reviewed'}: {new Date(leave.approvedOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </p>
                <p className="text-gray-700 font-medium">by {leave.approvedBy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <ChevronLeft size={18} />
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default LeaveHistory;