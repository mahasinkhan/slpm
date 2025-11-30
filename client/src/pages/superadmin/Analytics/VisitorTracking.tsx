// pages/superadmin/Analytics/VisitorTracking.tsx
// INTEGRATED WITH REAL API

import React, { useState, useEffect } from 'react';
import {
  Users,
  Globe,
  Clock,
  TrendingUp,
  Monitor,
  Smartphone,
  MapPin,
  Eye,
  RefreshCw,
  Search,
  Download,
  AlertCircle
} from 'lucide-react';
import visitorTrackingAPI from '../../../api/visitorTracking.api';

interface LiveVisitor {
  id: string;
  visitorId: string;
  currentPage: string;
  pageTitle?: string;
  isActive: boolean;
  email?: string;
  name?: string;
  ipAddress: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  lastActivityAt: string;
  sessionStart: string;
  timeOnSite: number;
  pageViews: number;
}

interface StatsSummary {
  liveVisitors: number;
  todayVisitors: number;
  todayPageViews: number;
  todayLeads: number;
  avgTimeOnSite: number;
}

interface Analytics {
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  totalPageViews: number;
  avgTimeOnSite: number;
  formSubmissions: number;
  leadsGenerated: number;
  topPages: { path: string; views: number }[];
  topCountries: { country: string; visitors: number }[];
  topDevices: { device: string; visitors: number }[];
}

const VisitorTracking: React.FC = () => {
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'live' | 'analytics'>('live');

  // Fetch live visitors
  const fetchLiveVisitors = async () => {
    try {
      const response = await visitorTrackingAPI.getLiveVisitors();
      if (response.success) {
        setLiveVisitors(response.visitors);
      }
    } catch (error: any) {
      console.error('Error fetching live visitors:', error);
      setError('Failed to load live visitors');
    }
  };

  // Fetch stats summary
  const fetchStats = async () => {
    try {
      const response = await visitorTrackingAPI.getStatsSummary();
      if (response.success) {
        setStats(response.summary);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics');
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await visitorTrackingAPI.getAnalytics();
      if (response.success) {
        setAnalytics(response.analytics);
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics');
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchLiveVisitors(),
          fetchStats(),
          fetchAnalytics()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLiveVisitors();
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('export-menu');
      const button = event.target as HTMLElement;
      
      if (menu && !menu.contains(button) && !button.closest('button')?.textContent?.includes('Export')) {
        menu.classList.add('hidden');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Manual refresh
  const handleRefresh = async () => {
    setError(null);
    await Promise.all([
      fetchLiveVisitors(),
      fetchStats(),
      fetchAnalytics()
    ]);
  };

  // Export data
  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const blob = await visitorTrackingAPI.exportData({ format });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `visitors_export_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Close dropdown menu
      const menu = document.getElementById('export-menu');
      menu?.classList.add('hidden');
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data. Please try again.');
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  // Filter visitors
  const filteredVisitors = liveVisitors.filter(visitor => {
    const searchLower = searchQuery.toLowerCase();
    return (
      visitor.name?.toLowerCase().includes(searchLower) ||
      visitor.email?.toLowerCase().includes(searchLower) ||
      visitor.country?.toLowerCase().includes(searchLower) ||
      visitor.city?.toLowerCase().includes(searchLower) ||
      visitor.currentPage.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visitor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            Ã—
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking</h1>
            <p className="text-gray-600 mt-1">Real-time website visitor analytics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
            </button>
            
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Now
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  const menu = document.getElementById('export-menu');
                  menu?.classList.toggle('hidden');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <div
                id="export-menu"
                className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden"
              >
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2 border-t"
                >
                  <Download className="w-4 h-4" />
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.liveVisitors}</span>
              </div>
              <p className="text-green-100 font-medium">Live Visitors</p>
              <p className="text-green-200 text-sm mt-1">Active right now</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.todayVisitors}</span>
              </div>
              <p className="text-blue-100 font-medium">Today's Visitors</p>
              <p className="text-blue-200 text-sm mt-1">Unique visitors</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.todayPageViews}</span>
              </div>
              <p className="text-purple-100 font-medium">Page Views</p>
              <p className="text-purple-200 text-sm mt-1">Today</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.todayLeads}</span>
              </div>
              <p className="text-orange-100 font-medium">Leads Generated</p>
              <p className="text-orange-200 text-sm mt-1">Today</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{Math.floor(stats.avgTimeOnSite / 60)}m</span>
              </div>
              <p className="text-pink-100 font-medium">Avg. Time on Site</p>
              <p className="text-pink-200 text-sm mt-1">Today</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('live')}
            className={`px-6 py-4 font-medium ${
              selectedTab === 'live'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Live Visitors ({liveVisitors.length})
          </button>
          <button
            onClick={() => setSelectedTab('analytics')}
            className={`px-6 py-4 font-medium ${
              selectedTab === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline-block mr-2" />
            Analytics
          </button>
        </div>

        {/* Live Visitors Tab */}
        {selectedTab === 'live' && (
          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, location, or page..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Live Visitors List */}
            {filteredVisitors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No live visitors at the moment</p>
                <p className="text-gray-500 text-sm mt-2">Visitors will appear here when they browse your website</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredVisitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {visitor.name ? visitor.name.charAt(0).toUpperCase() : visitor.country?.slice(0, 2) || 'AN'}
                        </div>

                        {/* Visitor Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {visitor.name || visitor.email || 'Anonymous Visitor'}
                            </h3>
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Live
                            </span>
                          </div>

                          {visitor.email && (
                            <p className="text-sm text-gray-600 mb-1">{visitor.email}</p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {visitor.city && visitor.country 
                                ? `${visitor.city}, ${visitor.country}`
                                : visitor.country || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                              {visitor.device === 'Mobile' ? (
                                <Smartphone className="w-4 h-4" />
                              ) : (
                                <Monitor className="w-4 h-4" />
                              )}
                              {visitor.device || 'Desktop'} â€¢ {visitor.browser || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(visitor.timeOnSite)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {visitor.pageViews} pages
                            </span>
                          </div>

                          {/* Current Page */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Currently viewing:</p>
                            <p className="text-sm font-medium text-gray-900">
                              {visitor.pageTitle || visitor.currentPage}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{visitor.currentPage}</p>
                          </div>
                        </div>
                      </div>

                      {/* Last Activity */}
                      <div className="text-right text-sm">
                        <p className="text-gray-500">Last activity</p>
                        <p className="text-gray-900 font-medium">{formatDate(visitor.lastActivityAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && analytics && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Pages */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {analytics.topPages.slice(0, 5).map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate flex-1">{page.path}</span>
                      <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {page.views}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Countries */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
                <div className="space-y-3">
                  {analytics.topCountries.slice(0, 5).map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{country.country}</span>
                      <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        {country.visitors}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
                <div className="space-y-3">
                  {analytics.topDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 flex items-center gap-2">
                        {device.device === 'Mobile' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Monitor className="w-4 h-4" />
                        )}
                        {device.device}
                      </span>
                      <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                        {device.visitors}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Visitors</span>
                    <span className="font-semibold">{analytics.totalVisitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Visitors</span>
                    <span className="font-semibold">{analytics.newVisitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Returning Visitors</span>
                    <span className="font-semibold">{analytics.returningVisitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Form Submissions</span>
                    <span className="font-semibold">{analytics.formSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Leads Generated</span>
                    <span className="font-semibold text-green-600">{analytics.leadsGenerated}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorTracking;