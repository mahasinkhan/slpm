// src/pages/employee/EmployeeLayout.tsx - Updated with Components
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EmployeeSidebar from './components/EmployeeSidebar';
import EmployeeHeader from './components/EmployeeHeader';

const EmployeeLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) return { title: 'Dashboard', subtitle: 'Overview of your activity' };
    if (path.includes('/profile/edit')) return { title: 'Edit Profile', subtitle: 'Update your information' };
    if (path.includes('/profile')) return { title: 'My Profile', subtitle: 'View your profile details' };
    if (path.includes('/attendance/checkin')) return { title: 'Check In/Out', subtitle: 'Mark your attendance' };
    if (path.includes('/attendance')) return { title: 'My Attendance', subtitle: 'View attendance records' };
    if (path.includes('/leaves/apply')) return { title: 'Apply Leave', subtitle: 'Submit leave request' };
    if (path.includes('/leaves/history')) return { title: 'Leave History', subtitle: 'View past leaves' };
    if (path.includes('/leaves')) return { title: 'Leave Requests', subtitle: 'Manage your leaves' };
    if (path.includes('/tasks/')) return { title: 'Task Details', subtitle: 'View task information' };
    if (path.includes('/tasks')) return { title: 'My Tasks', subtitle: 'Manage your tasks' };
    if (path.includes('/payroll/')) return { title: 'Salary Details', subtitle: 'View payslip details' };
    if (path.includes('/payroll')) return { title: 'Payroll', subtitle: 'View your payslips' };
    if (path.includes('/documents/')) return { title: 'Document Details', subtitle: 'View document' };
    if (path.includes('/documents')) return { title: 'My Documents', subtitle: 'Manage documents' };
    if (path.includes('/settings')) return { title: 'Settings', subtitle: 'Manage preferences' };
    if (path.includes('/notifications')) return { title: 'Notifications', subtitle: 'View all notifications' };
    if (path.includes('/help')) return { title: 'Help & Support', subtitle: 'Get assistance' };
    
    return { title: 'Employee Portal', subtitle: 'Welcome back' };
  };

  const pageInfo = getPageTitle();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <EmployeeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <EmployeeHeader
          onMenuToggle={() => setSidebarOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (Optional) */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

// Mobile Bottom Navigation Component
const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = (path: string) => window.location.href = path;
  
  const navItems = [
    { icon: '🏠', label: 'Home', path: '/employee/dashboard' },
    { icon: '📅', label: 'Attendance', path: '/employee/attendance' },
    { icon: '📝', label: 'Tasks', path: '/employee/tasks' },
    { icon: '👤', label: 'Profile', path: '/employee/profile' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              isActive(item.path)
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default EmployeeLayout;