// src/pages/employee/components/EmployeeHeader.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown,
  HelpCircle,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface EmployeeHeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  onMenuToggle,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Employee-specific data
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'short', 
    day: 'numeric' 
  });

  const notifications = [
    {
      id: 1,
      title: 'Leave Approved',
      message: 'Your leave request for Dec 25 has been approved',
      time: '5 min ago',
      read: false,
      type: 'success',
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: 'New Task Assigned',
      message: 'You have been assigned a new task by John Doe',
      time: '1 hour ago',
      read: false,
      type: 'info',
      icon: Clock,
    },
    {
      id: 3,
      title: 'Payslip Available',
      message: 'Your November 2024 payslip is now available',
      time: '2 hours ago',
      read: true,
      type: 'info',
      icon: Calendar,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'warning':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'error':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>

            {/* Title & Date Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                  {title || `Hello, ${user?.firstName}!`}
                </h1>
                <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{currentDate}</span>
                  <span className="text-gray-300">•</span>
                  <Clock size={14} className="text-gray-400" />
                  <span>{currentTime}</span>
                </div>
              </div>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <div className="hidden lg:block relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-56 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            {/* Search - Mobile Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Help */}
            <button
              onClick={() => navigate('/employee/help')}
              className="hidden sm:flex p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Help"
              title="Help & Support"
            >
              <HelpCircle size={20} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationDropdownOpen(!notificationDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <Bell size={18} className="text-indigo-600" />
                          Notifications
                        </h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 border ${getNotificationStyle(
                                notification.type
                              )}`}
                            >
                              <notification.icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={() => {
                          navigate('/employee/notifications');
                          setNotificationDropdownOpen(false);
                        }}
                        className="w-full py-2 text-center text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Employee Portal</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 hidden xl:block transition-transform ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                    {/* User Info Card */}
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                      <p className="font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">ID: EMP-2024-001</span>
                        <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                          Employee Portal
                        </span>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/employee/profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <User size={18} className="text-gray-500" />
                        <span className="font-medium">My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/employee/settings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <Settings size={18} className="text-gray-500" />
                        <span className="font-medium">Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/employee/help');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3 sm:hidden"
                      >
                        <HelpCircle size={18} className="text-gray-500" />
                        <span className="font-medium">Help & Support</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <LogOut size={18} />
                        <span className="font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {searchOpen && (
          <div className="lg:hidden mt-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default EmployeeHeader;