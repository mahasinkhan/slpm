// src/pages/employee/components/EmployeeSidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  Calendar,
  FileText,
  DollarSign,
  ClipboardList,
  Settings,
  LogOut,
  X,
  Clock,
  Folder,
  Bell,
  HelpCircle,
  ChevronRight,
  Home,
} from 'lucide-react';

interface EmployeeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const mainMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/employee/dashboard',
      badge: null,
    },
    {
      icon: User,
      label: 'My Profile',
      path: '/employee/profile',
      badge: null,
    },
    {
      icon: Clock,
      label: 'Check In/Out',
      path: '/employee/attendance/checkin',
      badge: null,
    },
    {
      icon: Calendar,
      label: 'My Attendance',
      path: '/employee/attendance',
      badge: null,
    },
    {
      icon: FileText,
      label: 'Leave Requests',
      path: '/employee/leaves',
      badge: '2',
      badgeColor: 'bg-orange-500',
    },
    {
      icon: ClipboardList,
      label: 'My Tasks',
      path: '/employee/tasks',
      badge: '5',
      badgeColor: 'bg-emerald-500',
    },
    {
      icon: DollarSign,
      label: 'Payroll',
      path: '/employee/payroll',
      badge: null,
    },
    {
      icon: Folder,
      label: 'Documents',
      path: '/employee/documents',
      badge: null,
    },
  ];

  const bottomMenuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      path: '/employee/notifications',
      badge: '3',
      badgeColor: 'bg-red-500',
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      path: '/employee/help',
      badge: null,
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/employee/settings',
      badge: null,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/employee/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 lg:w-64 xl:w-72
          bg-white
          border-r border-gray-200
          transition-transform duration-300 ease-in-out
          flex flex-col
          shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-4 lg:p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigation('/employee/dashboard')}
            >
              <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <span className="font-bold text-lg lg:text-xl block leading-tight text-gray-800">
                  SL Brothers
                </span>
                <span className="text-xs text-gray-500">Employee Portal</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close menu"
            >
              <X size={22} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-4 lg:p-5">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-indigo-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Employee ID</span>
                <span className="font-semibold text-gray-800">EMP-2024-001</span>
              </div>
              <div className="flex items-center justify-center mt-2">
                <span className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  Employee Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 lg:px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="mb-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Menu
            </p>
          </div>
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    size={20}
                    className={isActive(item.path) ? 'text-white' : 'text-gray-500'}
                  />
                  <span className="text-sm lg:text-base">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span
                      className={`${item.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive(item.path) && (
                    <ChevronRight size={16} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* Bottom Menu */}
          <div className="mb-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Other
            </p>
          </div>
          <div className="space-y-1">
            {bottomMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    size={20}
                    className={isActive(item.path) ? 'text-white' : 'text-gray-500'}
                  />
                  <span className="text-sm lg:text-base">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`${item.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Quick Actions */}
        <div className="p-3 lg:p-4 border-t border-gray-200 bg-gray-50">
          {/* Go to Main Site */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 mb-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 transition text-sm font-medium text-gray-700 shadow-sm"
          >
            <Home size={18} />
            <span>Go to Main Site</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition font-semibold shadow-md text-white"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Version Info */}
        <div className="px-4 py-2 text-center bg-gray-50">
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;