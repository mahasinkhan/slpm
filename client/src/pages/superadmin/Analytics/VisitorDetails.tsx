// pages/superadmin/Analytics/VisitorDetails.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Monitor,
  Smartphone,
  Clock,
  Eye,
  MousePointer,
  FileText,
  Calendar,
  Activity,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Visitor {
  id: string;
  visitorId: string;
  type: string;
  status: string;
  email?: string;
  name?: string;
  phone?: string;
  company?: string;
  position?: string;
  ipAddress: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  device?: string;
  os?: string;
  browser?: string;
  browserVersion?: string;
  screenResolution?: string;
  userAgent: string;
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  totalPageViews: number;
  totalTimeSpent: number;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pagesVisited: string[];
  leadScore: number;
  isQualified: boolean;
  sessions: Session[];
  pageViews: PageView[];
  events: Event[];
  forms: FormSubmission[];
}

interface Session {
  id: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  isActive: boolean;
  entryPage: string;
  exitPage?: string;
  pageViews: number;
}

interface PageView {
  id: string;
  url: string;
  title?: string;
  path: string;
  timestamp: string;
  timeOnPage?: number;
  scrollDepth?: number;
  clicks: number;
}

interface Event {
  id: string;
  eventType: string;
  eventCategory?: string;
  eventLabel?: string;
  page: string;
  timestamp: string;
}

interface FormSubmission {
  id: string;
  formType: string;
  formName?: string;
  page: string;
  email?: string;
  name?: string;
  phone?: string;
  company?: string;
  message?: string;
  submittedAt: string;
  isProcessed: boolean;
}

const VisitorDetails: React.FC = () => {
  const { visitorId } = useParams<{ visitorId: string }>();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'pageviews' | 'events' | 'forms'>('overview');

  useEffect(() => {
    fetchVisitorDetails();
  }, [visitorId]);

  const fetchVisitorDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/visitor-tracking/visitors/${visitorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setVisitor(response.data.visitor);
      }
    } catch (error: any) {
      console.error('Error fetching visitor details:', error);
      toast.error('Failed to load visitor details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      IDLE: 'bg-yellow-100 text-yellow-700',
      LEFT: 'bg-gray-100 text-gray-700',
      CONVERTED: 'bg-blue-100 text-blue-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      ANONYMOUS: 'bg-gray-100 text-gray-700',
      IDENTIFIED: 'bg-blue-100 text-blue-700',
      LEAD: 'bg-purple-100 text-purple-700',
      CUSTOMER: 'bg-green-100 text-green-700'
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-600 mb-4">Visitor not found</p>
        <button
          onClick={() => navigate('/superadmin/analytics/visitors')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Visitors
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/superadmin/analytics/visitors')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Visitors
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {visitor.name ? visitor.name.charAt(0).toUpperCase() : visitor.country?.slice(0, 2) || 'AN'}
              </div>

              {/* Basic Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {visitor.name || visitor.email || 'Anonymous Visitor'}
                </h1>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge(visitor.type)}`}>
                    {visitor.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(visitor.status)}`}>
                    {visitor.status}
                  </span>
                  {visitor.isQualified && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                      Qualified Lead
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {visitor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {visitor.email}
                    </div>
                  )}
                  {visitor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {visitor.phone}
                    </div>
                  )}
                  {visitor.company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {visitor.company}
                    </div>
                  )}
                  {visitor.position && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {visitor.position}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Score */}
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Lead Score</p>
              <div className="text-4xl font-bold text-blue-600">{visitor.leadScore}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">{visitor.totalVisits}</span>
          </div>
          <p className="text-gray-600">Total Visits</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">{visitor.totalPageViews}</span>
          </div>
          <p className="text-gray-600">Page Views</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold">{formatDuration(visitor.totalTimeSpent)}</span>
          </div>
          <p className="text-gray-600">Time Spent</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold">{visitor.forms?.length || 0}</span>
          </div>
          <p className="text-gray-600">Form Submissions</p>
        </div>
      </div>

      {/* Device & Location Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {visitor.device === 'Mobile' ? (
                <Smartphone className="w-5 h-5 text-gray-500" />
              ) : (
                <Monitor className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="text-sm text-gray-600">Device</p>
                <p className="font-medium">{visitor.device || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Browser</p>
                <p className="font-medium">{visitor.browser} {visitor.browserVersion}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Operating System</p>
                <p className="font-medium">{visitor.os || 'Unknown'}</p>
              </div>
            </div>
            {visitor.screenResolution && (
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Screen Resolution</p>
                  <p className="font-medium">{visitor.screenResolution}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Source</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">
                  {visitor.city && visitor.country 
                    ? `${visitor.city}, ${visitor.region}, ${visitor.country}`
                    : visitor.country || 'Unknown'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">IP Address</p>
                <p className="font-medium">{visitor.ipAddress}</p>
              </div>
            </div>
            {visitor.utmSource && (
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">UTM Source</p>
                  <p className="font-medium">{visitor.utmSource}</p>
                </div>
              </div>
            )}
            {visitor.referrer && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Referrer</p>
                  <p className="font-medium text-sm truncate">{visitor.referrer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-medium ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-4 font-medium ${
              activeTab === 'sessions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sessions ({visitor.sessions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('pageviews')}
            className={`px-6 py-4 font-medium ${
              activeTab === 'pageviews'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Page Views ({visitor.pageViews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-4 font-medium ${
              activeTab === 'events'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Events ({visitor.events?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-6 py-4 font-medium ${
              activeTab === 'forms'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Forms ({visitor.forms?.length || 0})
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Visit History</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>First Visit: {formatDate(visitor.firstVisit)}</span>
                  <span>Last Visit: {formatDate(visitor.lastVisit)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pages Visited ({visitor.pagesVisited?.length || 0})</h4>
                <div className="space-y-2">
                  {visitor.pagesVisited?.slice(0, 10).map((page, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{page}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {visitor.sessions?.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {session.isActive ? 'Active' : 'Ended'}
                    </span>
                    <span className="text-sm text-gray-600">{formatDate(session.startTime)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Entry Page</p>
                      <p className="font-medium">{session.entryPage}</p>
                    </div>
                    {session.exitPage && (
                      <div>
                        <p className="text-gray-600">Exit Page</p>
                        <p className="font-medium">{session.exitPage}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium">{formatDuration(session.duration)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Page Views</p>
                      <p className="font-medium">{session.pageViews}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Page Views Tab */}
          {activeTab === 'pageviews' && (
            <div className="space-y-3">
              {visitor.pageViews?.map((pv) => (
                <div key={pv.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{pv.title || pv.path}</p>
                      <p className="text-sm text-gray-500 mt-1">{pv.url}</p>
                    </div>
                    <span className="text-sm text-gray-600">{formatDate(pv.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                    {pv.timeOnPage && (
                      <span>Time: {formatDuration(pv.timeOnPage)}</span>
                    )}
                    {pv.scrollDepth && (
                      <span>Scroll: {pv.scrollDepth}%</span>
                    )}
                    <span>Clicks: {pv.clicks}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {visitor.events?.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {event.eventType}
                      </span>
                      {event.eventCategory && (
                        <span className="ml-2 text-sm text-gray-600">
                          {event.eventCategory}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{formatDate(event.timestamp)}</span>
                  </div>
                  {event.eventLabel && (
                    <p className="text-sm text-gray-700 mt-2">{event.eventLabel}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{event.page}</p>
                </div>
              ))}
            </div>
          )}

          {/* Forms Tab */}
          {activeTab === 'forms' && (
            <div className="space-y-4">
              {visitor.forms?.map((form) => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {form.formType}
                      </span>
                      {form.isProcessed && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Processed
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{formatDate(form.submittedAt)}</span>
                  </div>
                  {form.formName && (
                    <p className="font-medium text-gray-900 mb-2">{form.formName}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    {form.email && (
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium">{form.email}</p>
                      </div>
                    )}
                    {form.name && (
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-medium">{form.name}</p>
                      </div>
                    )}
                    {form.phone && (
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{form.phone}</p>
                      </div>
                    )}
                    {form.company && (
                      <div>
                        <p className="text-gray-600">Company</p>
                        <p className="font-medium">{form.company}</p>
                      </div>
                    )}
                  </div>
                  {form.message && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{form.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorDetails;