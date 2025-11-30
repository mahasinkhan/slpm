// src/pages/employee/attendance/MyAttendance.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeStats from '../components/EmployeeStats';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

const MyAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock attendance data
  const attendanceData = [
    { date: '2024-12-15', day: 'Sunday', checkIn: null, checkOut: null, status: 'Weekend', hours: '-' },
    { date: '2024-12-14', day: 'Saturday', checkIn: null, checkOut: null, status: 'Weekend', hours: '-' },
    { date: '2024-12-13', day: 'Friday', checkIn: '09:05 AM', checkOut: '06:15 PM', status: 'Present', hours: '9h 10m' },
    { date: '2024-12-12', day: 'Thursday', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: '9h 0m' },
    { date: '2024-12-11', day: 'Wednesday', checkIn: '09:45 AM', checkOut: '06:30 PM', status: 'Late', hours: '8h 45m' },
    { date: '2024-12-10', day: 'Tuesday', checkIn: '08:55 AM', checkOut: '06:10 PM', status: 'Present', hours: '9h 15m' },
    { date: '2024-12-09', day: 'Monday', checkIn: null, checkOut: null, status: 'Absent', hours: '-' },
    { date: '2024-12-08', day: 'Sunday', checkIn: null, checkOut: null, status: 'Weekend', hours: '-' },
    { date: '2024-12-07', day: 'Saturday', checkIn: null, checkOut: null, status: 'Weekend', hours: '-' },
    { date: '2024-12-06', day: 'Friday', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: '9h 0m' },
    { date: '2024-12-05', day: 'Thursday', checkIn: '09:02 AM', checkOut: '06:05 PM', status: 'Present', hours: '9h 3m' },
    { date: '2024-12-04', day: 'Wednesday', checkIn: '08:58 AM', checkOut: '05:58 PM', status: 'Present', hours: '9h 0m' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle size={12} /> Present
          </span>
        );
      case 'Absent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle size={12} /> Absent
          </span>
        );
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            <AlertCircle size={12} /> Late
          </span>
        );
      case 'Weekend':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            Weekend
          </span>
        );
      case 'Holiday':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
            Holiday
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const filteredData = filterStatus === 'all' 
    ? attendanceData 
    : attendanceData.filter(d => d.status.toLowerCase() === filterStatus.toLowerCase());

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <EmployeeStats variant="attendance" />

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Month Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Calendar size={18} className="text-gray-600" />
              <span className="font-semibold text-gray-800">
                {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Filter & Export */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-800">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{record.day}</td>
                  <td className="px-4 py-4">
                    {record.checkIn ? (
                      <span className="text-green-600 font-medium">{record.checkIn}</span>
                    ) : (
                      <span className="text-gray-400">--:--</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {record.checkOut ? (
                      <span className="text-red-600 font-medium">{record.checkOut}</span>
                    ) : (
                      <span className="text-gray-400">--:--</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-gray-800">{record.hours}</span>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {attendanceData.length} records
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
              2
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Check In Button */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-20">
        <button
          onClick={() => navigate('/employee/attendance/checkin')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center gap-2 font-semibold transition-all hover:scale-105"
        >
          <Clock size={20} />
          Check In/Out
        </button>
      </div>
    </div>
  );
};

export default MyAttendance;