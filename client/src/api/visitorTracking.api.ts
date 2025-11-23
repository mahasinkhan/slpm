// api/visitorTracking.api.ts
// Frontend API service for visitor tracking admin dashboard

import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
// Update this URL based on your environment
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// ==================== TYPE DEFINITIONS ====================

export interface LiveVisitor {
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

export interface StatsSummary {
  liveVisitors: number;
  todayVisitors: number;
  todayPageViews: number;
  todayLeads: number;
  avgTimeOnSite: number;
}

export interface Visitor {
  id: string;
  visitorId: string;
  type: 'ANONYMOUS' | 'IDENTIFIED' | 'REGISTERED' | 'LEAD' | 'CUSTOMER';
  status: 'ACTIVE' | 'IDLE' | 'LEFT' | 'CONVERTED';
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
  sessions?: VisitorSession[];
  pageViews?: PageView[];
  events?: VisitorEvent[];
  forms?: FormSubmission[];
}

export interface VisitorSession {
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

export interface PageView {
  id: string;
  url: string;
  title?: string;
  path: string;
  timestamp: string;
  timeOnPage?: number;
  scrollDepth?: number;
  clicks: number;
}

export interface VisitorEvent {
  id: string;
  eventType: string;
  eventCategory?: string;
  eventLabel?: string;
  page: string;
  timestamp: string;
}

export interface FormSubmission {
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

export interface VisitorAnalytics {
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

export interface VisitorFilters {
  page?: number;
  limit?: number;
  type?: 'ANONYMOUS' | 'IDENTIFIED' | 'REGISTERED' | 'LEAD' | 'CUSTOMER';
  status?: 'ACTIVE' | 'IDLE' | 'LEFT' | 'CONVERTED';
  email?: string;
  country?: string;
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ==================== API SERVICE CLASS ====================

class VisitorTrackingAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/visitor-tracking`,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds
    });

    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== LIVE VISITORS ====================

  /**
   * Get all currently active live visitors
   * @returns Promise with live visitors data
   */
  async getLiveVisitors(): Promise<{
    success: boolean;
    count: number;
    visitors: LiveVisitor[];
    timestamp: string;
  }> {
    const response = await this.api.get('/live');
    return response.data;
  }

  /**
   * Get quick statistics summary
   * @returns Promise with stats summary
   */
  async getStatsSummary(): Promise<{
    success: boolean;
    summary: StatsSummary;
    timestamp: string;
  }> {
    const response = await this.api.get('/stats-summary');
    return response.data;
  }

  // ==================== VISITOR MANAGEMENT ====================

  /**
   * Get all visitors with pagination and filters
   * @param filters - Optional filters for visitors
   * @returns Promise with paginated visitors data
   */
  async getAllVisitors(filters?: VisitorFilters): Promise<{
    success: boolean;
    visitors: Visitor[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    const response = await this.api.get('/visitors', { params: filters });
    return response.data;
  }

  /**
   * Get detailed information about a specific visitor
   * @param visitorId - Unique visitor identifier
   * @returns Promise with visitor details
   */
  async getVisitorById(visitorId: string): Promise<{
    success: boolean;
    visitor: Visitor;
  }> {
    const response = await this.api.get(`/visitors/${visitorId}`);
    return response.data;
  }

  /**
   * Update visitor status manually
   * @param visitorId - Unique visitor identifier
   * @param status - New status value
   * @returns Promise with update result
   */
  async updateVisitorStatus(
    visitorId: string,
    status: 'ACTIVE' | 'IDLE' | 'LEFT' | 'CONVERTED'
  ): Promise<{
    success: boolean;
    message: string;
    visitorId: string;
    newStatus: string;
  }> {
    const response = await this.api.patch(`/visitors/${visitorId}/status`, {
      status
    });
    return response.data;
  }

  /**
   * Delete a visitor and all related data
   * @param visitorId - Unique visitor identifier
   * @returns Promise with deletion result
   */
  async deleteVisitor(visitorId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await this.api.delete(`/visitors/${visitorId}`);
    return response.data;
  }

  // ==================== ANALYTICS ====================

  /**
   * Get visitor analytics for a date range
   * @param startDate - Start date (ISO format)
   * @param endDate - End date (ISO format)
   * @returns Promise with analytics data
   */
  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    success: boolean;
    analytics: VisitorAnalytics;
    period: {
      startDate: string;
      endDate: string;
      days: number;
    };
  }> {
    const response = await this.api.get('/analytics', { params });
    return response.data;
  }

  // ==================== MAINTENANCE ====================

  /**
   * Trigger cleanup of old live visitor records
   * @returns Promise with cleanup result
   */
  async cleanupLiveVisitors(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
  }> {
    const response = await this.api.post('/cleanup');
    return response.data;
  }

  // ==================== EXPORT ====================

  /**
   * Export visitor data to CSV or Excel
   * @param params - Export parameters
   * @returns Promise with file blob
   */
  async exportData(params?: {
    format?: 'csv' | 'excel';
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
  }): Promise<Blob> {
    const response = await this.api.get('/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Helper method to download exported file
   * @param params - Export parameters
   * @param filename - Name for the downloaded file
   */
  async downloadExport(
    params?: {
      format?: 'csv' | 'excel';
      startDate?: string;
      endDate?: string;
      type?: string;
      status?: string;
    },
    filename?: string
  ): Promise<void> {
    try {
      const blob = await this.exportData(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const format = params?.format || 'csv';
      const defaultFilename = `visitors_export_${new Date().toISOString().split('T')[0]}.${format}`;
      link.download = filename || defaultFilename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export download error:', error);
      throw error;
    }
  }

  // ==================== ERROR HANDLING ====================

  /**
   * Handle API errors and return user-friendly messages
   * @param error - Axios error object
   * @returns User-friendly error message
   */
  handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        return error.response.data?.message || 'An error occurred';
      } else if (error.request) {
        // Request made but no response
        return 'Network error. Please check your connection.';
      }
    }
    return 'An unexpected error occurred';
  }
}

// ==================== EXPORT ====================

export default new VisitorTrackingAPI();