// pages/admin/components/AdminSidebar.tsx - RESPONSIVE VERSION
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ChevronDown, 
  LayoutDashboard, Briefcase, FileText, Users, 
  Calendar, Settings, LogOut, Plus, Globe, 
  FileEdit, Star, X, Building2, Clock 
} from 'lucide-react';

interface AdminSidebarProps {
  onNavigate?: () => void; // Close sidebar on mobile after navigation
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState(['jobs']);
  
  const [adminUser] = useState({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@slbrothers.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    isOnline: true
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => 
      prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close mobile sidebar after navigation
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/login');
      if (onNavigate) onNavigate();
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      color: 'blue',
      subItems: []
    },
    {
      id: 'jobs',
      label: 'Job Management',
      icon: Briefcase,
      path: '/admin/jobs',
      color: 'purple',
      subItems: [
        { label: 'All Jobs', path: '/admin/jobs', icon: FileText },
        { label: 'Create New Job', path: '/admin/jobs/create', icon: Plus },
        { label: 'Published Jobs', path: '/admin/jobs/published', icon: Globe },
        { label: 'Draft Jobs', path: '/admin/jobs/drafts', icon: FileEdit }
      ]
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      path: '/admin/applications',
      color: 'green',
      subItems: [
        { label: 'All Applications', path: '/admin/applications', icon: FileText },
        { label: 'New Applications', path: '/admin/applications/new', icon: Plus },
        { label: 'Shortlisted', path: '/admin/applications/shortlisted', icon: Star },
        { label: 'Rejected', path: '/admin/applications/rejected', icon: X }
      ]
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      path: '/admin/employees',
      color: 'orange',
      subItems: [
        { label: 'All Employees', path: '/admin/employees', icon: Users },
        { label: 'Register Employee', path: '/admin/employees/register', icon: Plus },
        { label: 'Departments', path: '/admin/employees/departments', icon: Building2 }
      ]
    },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: Calendar,
      path: '/admin/interviews',
      color: 'pink',
      subItems: [
        { label: 'All Interviews', path: '/admin/interviews', icon: Calendar },
        { label: 'Schedule Interview', path: '/admin/interviews/schedule', icon: Plus },
        { label: 'Upcoming', path: '/admin/interviews/upcoming', icon: Clock }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'gray',
      subItems: []
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, string> = {
      blue: isActive 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700',
      purple: isActive 
        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-200' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700',
      green: isActive 
        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700',
      orange: isActive 
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700',
      pink: isActive 
        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 hover:text-pink-700',
      gray: isActive 
        ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md shadow-gray-200' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-800',
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      pink: 'text-pink-600',
      gray: 'text-gray-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen transition-all duration-300 flex flex-col shadow-lg`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SL</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">SL Brothers</h2>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <span className="text-white font-bold text-lg">SL</span>
            </div>
          )}
          
          {/* Only show collapse button on desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all hidden lg:block ${collapsed ? 'mx-auto' : ''}`}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {!collapsed && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">Main Menu</p>
          </div>
        )}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const itemActive = isActive(item.path) && item.subItems.length === 0;
            
            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => {
                    if (item.subItems.length > 0) {
                      toggleMenu(item.id);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    getColorClasses(item.color, itemActive)
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${itemActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 group-hover:bg-white'} transition-colors`}>
                      <Icon className={`w-5 h-5 ${itemActive ? 'text-white' : getIconColorClass(item.color)}`} />
                    </div>
                    {!collapsed && (
                      <span className="font-semibold text-sm">{item.label}</span>
                    )}
                  </div>
                  {!collapsed && item.subItems.length > 0 && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openMenus.includes(item.id) ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Sub Menu Items */}
                {!collapsed && item.subItems.length > 0 && openMenus.includes(item.id) && (
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const subActive = isActive(subItem.path);
                      
                      return (
                        <button
                          key={subItem.path}
                          onClick={() => handleNavigation(subItem.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm group ${
                            subActive 
                              ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 font-semibold shadow-sm' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 ${subActive ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-600'}`} />
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {!collapsed ? (
          <div className="mb-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                {adminUser.avatar ? (
                  <img 
                    src={adminUser.avatar} 
                    alt={adminUser.name}
                    className="w-11 h-11 rounded-xl object-cover shadow-lg border-2 border-white"
                  />
                ) : (
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                    {adminUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                {adminUser.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{adminUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{adminUser.role}</p>
              </div>
              <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
            </div>
            <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 truncate">{adminUser.email}</p>
            </div>
          </div>
        ) : (
          <div className="mb-3 flex justify-center">
            <div className="relative group">
              {adminUser.avatar ? (
                <img 
                  src={adminUser.avatar} 
                  alt={adminUser.name}
                  className="w-11 h-11 rounded-xl object-cover shadow-lg cursor-pointer hover:shadow-xl transition-shadow border-2 border-white"
                />
              ) : (
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  {adminUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              {adminUser.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Logout'}
        </button>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center lg:hidden"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;