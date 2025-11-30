// src/pages/employee/dashboard/EmployeeDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../contexts/AuthContext';
import EmployeeStats from './components/EmployeeStats';
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Bell,
  ChevronRight,
  MapPin,
  TrendingUp,
  Gift,
  Users,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(formatTime(new Date()));
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  // Mock data
  const recentActivities = [
    {
      id: 1,
      type: 'leave',
      title: 'Leave Request Approved',
      description: 'Your casual leave for Dec 25 has been approved',
      time: '2 hours ago',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      id: 2,
      type: 'task',
      title: 'New Task Assigned',
      description: 'Complete Q4 sales report by Dec 20',
      time: '5 hours ago',
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      id: 3,
      type: 'payroll',
      title: 'Payslip Generated',
      description: 'November 2024 payslip is now available',
      time: '1 day ago',
      icon: FileText,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      id: 4,
      type: 'attendance',
      title: 'Late Check-in Recorded',
      description: 'Checked in at 10:15 AM on Dec 10',
      time: '2 days ago',
      icon: Clock,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
  ];

  const upcomingHolidays = [
    { id: 1, name: 'Christmas Day', date: 'Dec 25, 2024', day: 'Wednesday' },
    { id: 2, name: 'New Year', date: 'Jan 1, 2025', day: 'Wednesday' },
    { id: 3, name: 'Republic Day', date: 'Jan 26, 2025', day: 'Sunday' },
  ];

  const pendingTasks = [
    { id: 1, title: 'Complete Q4 Report', priority: 'High', dueDate: 'Dec 20' },
    { id: 2, title: 'Team Meeting Prep', priority: 'Medium', dueDate: 'Dec 18' },
    { id: 3, title: 'Update Documentation', priority: 'Low', dueDate: 'Dec 22' },
  ];

  const quickActions = [
    { icon: Clock, label: 'Check In/Out', path: '/employee/attendance/checkin', color: 'bg-blue-600' },
    { icon: Calendar, label: 'Apply Leave', path: '/employee/leaves/apply', color: 'bg-green-600' },
    { icon: FileText, label: 'View Payslip', path: '/employee/payroll', color: 'bg-purple-600' },
    { icon: Briefcase, label: 'My Tasks', path: '/employee/tasks', color: 'bg-orange-600' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              {formatDate(currentTime)}
            </p>
            <div className="flex items-center gap-2 mt-3 text-blue-100">
              <MapPin size={16} />
              <span className="text-sm">SL Brothers Ltd, Main Office</span>
            </div>
          </div>
          
          {/* Check In/Out Widget */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 min-w-[280px]">
            <div className="text-center mb-4">
              <p className="text-4xl font-bold font-mono">{formatTime(currentTime)}</p>
              <p className="text-blue-200 text-sm mt-1">Current Time</p>
            </div>
            
            {isCheckedIn ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <CheckCircle size={18} />
                  <span className="text-sm">Checked in at {checkInTime}</span>
                </div>
                <button
                  onClick={handleCheckOut}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <XCircle size={20} />
                  Check Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Check In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <EmployeeStats variant="dashboard" onStatClick={(type) => {
        if (type === 'attendance') navigate('/employee/attendance');
        if (type === 'tasks') navigate('/employee/tasks');
        if (type === 'salary') navigate('/employee/payroll');
      }} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-[1.02] group"
          >
            <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
              <action.icon className="text-white" size={24} />
            </div>
            <p className="font-semibold text-gray-800 text-sm md:text-base">{action.label}</p>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Recent Activities</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-4">
                  <div className={`${activity.iconBg} p-2.5 rounded-lg flex-shrink-0`}>
                    <activity.icon className={activity.iconColor} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pending Tasks</h2>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                {pendingTasks.length}
              </span>
            </div>
            <div className="p-4 space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/employee/tasks/${task.id}`)}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                </div>
              ))}
              <button
                onClick={() => navigate('/employee/tasks')}
                className="w-full py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1"
              >
                View All Tasks <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Upcoming Holidays</h2>
              <Gift className="text-purple-600" size={20} />
            </div>
            <div className="p-4 space-y-3">
              {upcomingHolidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-purple-600 font-semibold">
                      {holiday.date.split(' ')[0]}
                    </span>
                    <span className="text-lg font-bold text-purple-700">
                      {holiday.date.split(' ')[1].replace(',', '')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{holiday.name}</p>
                    <p className="text-xs text-gray-500">{holiday.day}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members Online */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Team Online</h2>
              <Users className="text-blue-600" size={20} />
            </div>
            <div className="flex -space-x-3">
              {['JD', 'SM', 'AK', 'RP', 'VK'].map((initials, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                >
                  {initials}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white">
                +12
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">17 team members are online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;