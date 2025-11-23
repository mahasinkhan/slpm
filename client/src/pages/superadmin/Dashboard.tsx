import React, { useState, useMemo } from 'react';
import { 
  Settings, Users, BarChart3, Shield, Activity, HardHat, 
  Menu, X, LogOut, ChevronRight, Moon, Sun, Monitor,
  TrendingUp, DollarSign, UserPlus, ShoppingCart,
  Eye, Clock, Zap, AlertCircle, Newspaper, BookOpen, Video,
  Globe, ExternalLink, Home, ArrowLeft
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Import User Management Pages
import UserManagement from './Users/UserManagement';
import UserDetails from './Users/UserDetails';
import UserActivity from './Users/UserActivity';

// Import Analytics Pages
import RealtimeAnalytics from './Analytics/RealtimeAnalytics';
import Reports from './Analytics/Reports';
import SystemMetrics from './Analytics/SystemMetrics';
import VisitorTracking from './Analytics/VisitorTracking';
import VisitorDetails from './Analytics/VisitorDetails';

// Import Security Pages
import AuditLogs from './Security/AuditLogs';
import SecuritySettings from './Security/SecuritySettings';
import AccessControl from './Security/AccessControl';

// Import System Pages
import SystemHealth from './System/SystemHealth';
import DatabaseManagement from './System/DatabaseManagement';
import APIMonitor from './System/APIMonitor';

// Import Approvals Pages
import PendingApprovals from './Approvals/PendingApprovals';
import ApprovalHistory from './Approvals/ApprovalHistory';

// Import Settings Pages
import GlobalSettings from './Settings/GlobalSettings';
import Integrations from './Settings/Integrations';

// Import News & Media Pages
import NewsManagement from './Media/NewsManagement';
import BlogPosts from './Media/BlogPosts';
import MediaLibrary from './Media/MediaLibrary';
import CMSManagement from './Media/CMSManagement';

// --- TYPE DEFINITIONS ---

type Theme = 'light' | 'dark';

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path: string;
  children?: NavItem[];
}

type RouteKey =
  | 'Dashboard'
  | 'UserManagement'
  | 'UserDetails'
  | 'UserActivity'
  | 'RealtimeAnalytics'
  | 'SystemMetrics'
  | 'Reports'
  | 'VisitorTracking'
  | 'VisitorDetailsPage'
  | 'AuditLogs'
  | 'SecuritySettings'
  | 'AccessControl'
  | 'SystemHealth'
  | 'DatabaseManagement'
  | 'APIMonitor'
  | 'PendingApprovals'
  | 'ApprovalHistory'
  | 'GlobalSettings'
  | 'Integrations'
  | 'NewsManagement'
  | 'BlogPosts'
  | 'MediaLibrary'
  | 'CMSManagement';

// --- NAVIGATION DATA ---
const NAV_ITEMS: NavItem[] = [
  { id: 'Dashboard', name: 'Dashboard', icon: Monitor, path: '/dashboard' },
  {
    id: 'Users',
    name: 'User Management',
    icon: Users,
    path: '/users',
    children: [
      { id: 'UserManagement', name: 'All Users', icon: Users, path: '/users/manage' },
      { id: 'UserDetails', name: 'Details Lookup', icon: Users, path: '/users/details' },
      { id: 'UserActivity', name: 'User Activity', icon: Activity, path: '/users/activity' },
    ],
  },
  {
    id: 'Analytics',
    name: 'Analytics & Reporting',
    icon: BarChart3,
    path: '/analytics',
    children: [
      { id: 'RealtimeAnalytics', name: 'Realtime Analytics', icon: BarChart3, path: '/analytics/realtime' },
      { id: 'SystemMetrics', name: 'System Metrics', icon: BarChart3, path: '/analytics/metrics' },
      { id: 'Reports', name: 'Reports', icon: BarChart3, path: '/analytics/reports' },
      { id: 'VisitorTracking', name: 'Visitor Tracking', icon: Globe, path: '/analytics/visitors' },
    ],
  },
  {
    id: 'Security',
    name: 'Security & Access',
    icon: Shield,
    path: '/security',
    children: [
      { id: 'AuditLogs', name: 'Audit Logs', icon: Shield, path: '/security/audit' },
      { id: 'SecuritySettings', name: 'Security Settings', icon: Shield, path: '/security/settings' },
      { id: 'AccessControl', name: 'Access Control', icon: Shield, path: '/security/access' },
    ],
  },
  {
    id: 'Media',
    name: 'News, Blogs & Media',
    icon: Newspaper,
    path: '/media',
    children: [
      { id: 'NewsManagement', name: 'News Management', icon: Newspaper, path: '/media/news' },
      { id: 'BlogPosts', name: 'Blog Posts', icon: BookOpen, path: '/media/blogs' },
      { id: 'MediaLibrary', name: 'Media Library', icon: Video, path: '/media/library' },
      { id: 'CMSManagement', name: 'CMS Management', icon: Settings, path: '/media/cms' },
    ],
  },
  {
    id: 'System',
    name: 'System Health',
    icon: Settings,
    path: '/system',
    children: [
      { id: 'SystemHealth', name: 'System Health', icon: Settings, path: '/system/health' },
      { id: 'DatabaseManagement', name: 'Database Management', icon: Settings, path: '/system/db' },
      { id: 'APIMonitor', name: 'API Monitor', icon: Settings, path: '/system/api' },
    ],
  },
  {
    id: 'Approvals',
    name: 'Approvals',
    icon: Activity,
    path: '/approvals',
    children: [
      { id: 'PendingApprovals', name: 'Pending Approvals', icon: Activity, path: '/approvals/pending' },
      { id: 'ApprovalHistory', name: 'Approval History', icon: Activity, path: '/approvals/history' },
    ],
  },
  {
    id: 'Settings',
    name: 'Configuration',
    icon: HardHat,
    path: '/settings',
    children: [
      { id: 'GlobalSettings', name: 'Global Settings', icon: Settings, path: '/settings/global' },
      { id: 'Integrations', name: 'Integrations', icon: Settings, path: '/settings/integrations' },
    ],
  },
];

// --- DASHBOARD OVERVIEW COMPONENT ---
const DashboardOverview: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDarkMode = theme === 'dark';

  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12.5%', icon: Users, color: 'from-blue-500 to-blue-600', trend: 'up' },
    { label: 'Active Sessions', value: '1,247', change: '+8.3%', icon: Activity, color: 'from-green-500 to-green-600', trend: 'up' },
    { label: 'Revenue', value: '£45.6K', change: '+15.7%', icon: DollarSign, color: 'from-purple-500 to-purple-600', trend: 'up' },
    { label: 'System Load', value: '68%', change: '-3.2%', icon: Zap, color: 'from-orange-500 to-orange-600', trend: 'down' }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Created new user account', time: '2 minutes ago', type: 'success' },
    { user: 'Jane Smith', action: 'Modified security settings', time: '15 minutes ago', type: 'warning' },
    { user: 'Mike Johnson', action: 'Exported analytics report', time: '1 hour ago', type: 'info' },
    { user: 'Sarah Williams', action: 'Updated database configuration', time: '2 hours ago', type: 'success' },
    { user: 'System', action: 'Automated backup completed', time: '3 hours ago', type: 'info' }
  ];

  const systemAlerts = [
    { message: 'High CPU usage detected on Server 3', severity: 'warning', time: '5 min ago' },
    { message: 'Database backup completed successfully', severity: 'success', time: '1 hour ago' },
    { message: 'New security patch available', severity: 'info', time: '2 hours ago' }
  ];

  const trafficData = [
    { time: '00:00', users: 145 }, { time: '04:00', users: 89 }, { time: '08:00', users: 234 },
    { time: '12:00', users: 567 }, { time: '16:00', users: 489 }, { time: '20:00', users: 312 }, { time: '23:59', users: 198 }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'border-green-500 bg-green-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
        <h1 className="text-3xl font-black mb-2">Welcome Back, Superadmin</h1>
        <p className="text-white/90">Here's what's happening with your system today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
            </div>
            <h3 className={`text-3xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-6 shadow-lg`}>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User Traffic (Last 24 Hours)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="time" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-6 shadow-lg`}>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Alerts</h2>
          <div className="space-y-3">
            {systemAlerts.map((alert, idx) => (
              <div key={idx} className={`p-3 border-l-4 rounded ${isDarkMode ? 'bg-gray-700' : getSeverityColor(alert.severity)}`}>
                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{alert.message}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-6 shadow-lg`}>
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className={`flex items-start justify-between p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  <Activity size={16} />
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.user}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activity.action}</p>
                </div>
              </div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CONTENT RENDERER ---
const ContentRenderer: React.FC<{ currentPage: RouteKey; theme: Theme }> = ({ currentPage, theme }) => {
  if (currentPage === 'Dashboard') return <DashboardOverview theme={theme} />;
  if (currentPage === 'UserManagement') return <UserManagement />;
  if (currentPage === 'UserDetails') return <UserDetails />;
  if (currentPage === 'UserActivity') return <UserActivity />;
  if (currentPage === 'RealtimeAnalytics') return <RealtimeAnalytics />;
  if (currentPage === 'SystemMetrics') return <SystemMetrics />;
  if (currentPage === 'Reports') return <Reports />;
  if (currentPage === 'VisitorTracking') return <VisitorTracking />;
  if (currentPage === 'VisitorDetailsPage') return <VisitorDetails />;
  if (currentPage === 'AuditLogs') return <AuditLogs />;
  if (currentPage === 'SecuritySettings') return <SecuritySettings />;
  if (currentPage === 'AccessControl') return <AccessControl />;
  if (currentPage === 'NewsManagement') return <NewsManagement />;
  if (currentPage === 'BlogPosts') return <BlogPosts />;
  if (currentPage === 'MediaLibrary') return <MediaLibrary />;
  if (currentPage === 'CMSManagement') return <CMSManagement />;
  if (currentPage === 'SystemHealth') return <SystemHealth />;
  if (currentPage === 'DatabaseManagement') return <DatabaseManagement />;
  if (currentPage === 'APIMonitor') return <APIMonitor />;
  if (currentPage === 'PendingApprovals') return <PendingApprovals />;
  if (currentPage === 'ApprovalHistory') return <ApprovalHistory />;
  if (currentPage === 'GlobalSettings') return <GlobalSettings />;
  if (currentPage === 'Integrations') return <Integrations />;
  return <DashboardOverview theme={theme} />;
};

// --- SIDEBAR ITEM COMPONENT ---
interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isCurrentPage: boolean;
  onClick: (id: RouteKey) => void;
  theme: Theme;
  currentPage: RouteKey; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, isCurrentPage, onClick, theme, currentPage }) => {
  const [isOpen, setIsOpen] = useState(isActive);

  React.useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  const handleItemClick = () => {
    if (item.children) {
      setIsOpen(!isOpen);
    } else {
      onClick(item.id as RouteKey);
    }
  };

  const isDarkMode = theme === 'dark';
  const buttonBase = `flex items-center justify-between w-full p-3 my-1 text-sm font-medium transition-all duration-300 rounded-xl`;
  const buttonActive = `bg-blue-600 text-white shadow-xl shadow-blue-500/30 font-semibold`;
  const buttonInactive = isDarkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700';
  const childBase = `flex items-center w-full p-2 text-sm transition-all duration-200 rounded-lg my-1`;
  const childActive = isDarkMode ? 'bg-blue-800/60 text-blue-200 font-semibold border-l-4 border-blue-500' : 'bg-blue-100 text-blue-800 font-semibold';
  const childInactive = isDarkMode ? 'text-gray-400 hover:bg-gray-700/30 hover:text-blue-300' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600';

  return (
    <div className="w-full group">
      <button onClick={handleItemClick} className={`${buttonBase} ${isCurrentPage && !item.children ? buttonActive : buttonInactive}`}>
        <span className="flex items-center">
          <item.icon className={`w-5 h-5 mr-3 ${isCurrentPage && !item.children ? 'text-white' : 'text-blue-400'}`} />
          {item.name}
        </span>
        {item.children && <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'} ${isCurrentPage ? 'text-white' : ''}`} />}
      </button>
      {item.children && (
        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pt-1' : 'max-h-0 opacity-0'}`}>
          <div className={`pl-8 border-l ml-5 pt-1 ${isDarkMode ? 'border-gray-700' : 'border-blue-100'}`}>
            {item.children.map((child) => (
              <button key={child.id} onClick={() => onClick(child.id as RouteKey)} className={`${childBase} ${child.id === currentPage ? childActive : childInactive}`}>
                <div className={`w-1 h-4 mr-3 rounded-full transition-all duration-300 ${child.id === currentPage ? 'bg-blue-500 scale-x-100' : 'bg-gray-300 scale-x-0 group-hover:scale-x-100'}`}></div>
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<RouteKey>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [theme, setTheme] = useState<Theme>('light');
  const [contentKey, setContentKey] = useState(0);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const isDarkMode = theme === 'dark';

  const getCurrentPageTitle = useMemo(() => {
    const findTitle = (items: NavItem[]): string | undefined => {
      for (const item of items) {
        if (item.id === currentPage) return item.name;
        if (item.children) {
          const childTitle = findTitle(item.children);
          if (childTitle) return childTitle;
        }
      }
      return undefined;
    };
    return findTitle(NAV_ITEMS) || 'Dashboard Overview';
  }, [currentPage]);

  const isGroupActive = (groupId: string): boolean => {
    if (groupId === currentPage) return true;
    const group = NAV_ITEMS.find(item => item.id === groupId);
    return group?.children?.some(child => child.id === currentPage) ?? false;
  };
  
  const handleNavigation = (route: RouteKey) => {
    if (route !== currentPage) {
      setCurrentPage(route);
      setContentKey(prev => prev + 1);
    }
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handlePublicSiteNavigation = () => {
    window.location.href = '/?admin_mode=true';
  };

  const handleSignOut = () => {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (confirmSignOut) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('admin_session');
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  const scrollbarStyles = `::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:${isDarkMode?'#4a5568':'#cbd5e1'};border-radius:4px}::-webkit-scrollbar-thumb:hover{background:${isDarkMode?'#6b7280':'#9ca3af'}}::-webkit-scrollbar-track{background:${isDarkMode?'#1f2937':'transparent'}}`;

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <style>{`${scrollbarStyles}@keyframes fade-in-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-up{animation:fade-in-up 0.4s ease-out}`}</style>
      
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0 shadow-2xl transition-transform duration-300 ease-in-out ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white shadow-xl border-r border-gray-100'} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          <div className="p-2 mb-6">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">SL Brothers</h2>
            <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Superadmin Access</p>
          </div>

          <nav className="space-y-1 flex-grow">
            {NAV_ITEMS.map((item) => (
              <SidebarItem key={item.id} item={item} isCurrentPage={item.id === currentPage} isActive={isGroupActive(item.id)} onClick={handleNavigation} theme={theme} currentPage={currentPage} />
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button onClick={handlePublicSiteNavigation} className={`flex items-center w-full p-3 text-sm font-medium transition-all duration-200 rounded-xl ${isDarkMode ? 'text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'}`}>
              <Home className="w-5 h-5 mr-3" />
              Back to Public Site
            </button>

            <button onClick={handleSignOut} className="flex items-center w-full p-3 text-sm font-medium transition-all duration-200 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="flex-grow overflow-y-auto w-full">
        <header className={`sticky top-0 z-10 mb-0 p-4 shadow-lg transition-colors duration-500 flex justify-between items-center ${isDarkMode ? 'bg-gray-800/90 backdrop-blur-md border-b border-gray-700' : 'bg-white/95 backdrop-blur-md border-b border-gray-100'}`}>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{getCurrentPageTitle}</h1>
          <div className="flex items-center space-x-3 lg:space-x-4">
            <button onClick={handlePublicSiteNavigation} className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-800' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'}`}>
              <ArrowLeft size={16} />
              <span>Public Site</span>
            </button>

            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700 ring-gray-700' : 'text-blue-600 hover:bg-blue-50 ring-blue-200'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className={`p-2 rounded-full transition-all duration-300 relative ${isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}>
              <AlertCircle size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105 ring-2 ring-white dark:ring-gray-700">
              SA
            </div>
          </div>
        </header>

        <div className="relative w-full" key={contentKey}>
          <div className="animate-fade-in-up min-h-[calc(100vh-80px)]">
            <ContentRenderer currentPage={currentPage} theme={theme} />
          </div>
        </div>
        
        <footer className={`p-6 text-center text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          &copy; {new Date().getFullYear()} SL Brothers System. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;