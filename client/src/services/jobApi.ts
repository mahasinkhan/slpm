// services/jobApi.ts - Complete Job API Service - FIXED
// Uses the existing api.ts service for authenticated requests

import api from './api';

// ==================== TYPES ====================

export interface Job {
  views: number;
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  applicationDeadline: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  isPublished: boolean;
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  // For draft jobs
  completionPercentage?: number;
  missingFields?: string[];
}

export interface JobFormData {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  applicationDeadline: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  isPublished?: boolean;
}

export interface JobQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  department?: string;
  location?: string;
  isPublished?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Helper function to extract jobs array from various response formats
const extractJobsArray = (data: any): Job[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.jobs && Array.isArray(data.jobs)) return data.jobs;
  if (data.data && Array.isArray(data.data)) return data.data;
  return [];
};

// Helper function to extract single job from response
const extractJob = (data: any): Job | null => {
  if (!data) return null;
  if (data.job) return data.job;
  if (data.data) return data.data;
  return data;
};

// ==================== JOB API SERVICE ====================

export const jobApi = {
  // ==================== GET JOBS ====================
  
  /**
   * Get all jobs with filters (Admin)
   * Endpoint: GET /api/admin/jobs
   */
  getJobs: async (params: JobQueryParams = {}): Promise<{ success: boolean; data: Job[]; error?: string }> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Required parameters with defaults
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('limit', (params.limit || 100).toString());
      
      // Sorting parameters - ALWAYS include these with defaults
      queryParams.append('sortBy', params.sortBy || 'createdAt');
      queryParams.append('sortOrder', params.sortOrder || 'desc');
      
      // Optional status filter - only add if specified and valid
      if (params.status && params.status !== 'all') {
        const validStatuses = ['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED'];
        const upperStatus = params.status.toUpperCase();
        if (validStatuses.includes(upperStatus)) {
          queryParams.append('status', upperStatus);
        }
      }
      
      // Optional filters - only add if they have values
      if (params.department) {
        queryParams.append('department', params.department);
      }
      if (params.location) {
        queryParams.append('location', params.location);
      }
      if (params.isPublished !== undefined) {
        queryParams.append('isPublished', params.isPublished.toString());
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }

      const url = `/admin/jobs?${queryParams.toString()}`;
      console.log('[jobApi.getJobs] Calling API:', url);
      
      const response = await api.request<any>(url);
      
      console.log('[jobApi.getJobs] Raw response:', response);
      
      if (response.success) {
        const jobs = extractJobsArray(response.data);
        console.log('[jobApi.getJobs] Extracted jobs:', jobs.length);
        return { success: true, data: jobs };
      }
      
      console.log('[jobApi.getJobs] Request failed:', response.error);
      return { success: false, data: [], error: response.error };
    } catch (error: any) {
      console.error('[jobApi.getJobs] Exception:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  /**
   * Get a single job by ID (Admin)
   * Endpoint: GET /api/admin/jobs/:id
   */
  getJobById: async (id: string): Promise<{ success: boolean; data: Job | null; error?: string }> => {
    try {
      const response = await api.request<any>(`/admin/jobs/${id}`);
      
      if (response.success) {
        const job = extractJob(response.data);
        return { success: true, data: job };
      }
      
      return { success: false, data: null, error: response.error };
    } catch (error: any) {
      console.error('Error fetching job:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // ==================== CREATE/UPDATE JOBS ====================

  /**
   * Create a new job (Admin)
   * Endpoint: POST /api/admin/jobs
   */
  createJob: async (data: JobFormData): Promise<{ success: boolean; data: Job | null; error?: string }> => {
    try {
      const response = await api.request<any>('/admin/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (response.success) {
        const job = extractJob(response.data);
        return { success: true, data: job };
      }
      
      return { success: false, data: null, error: response.error };
    } catch (error: any) {
      console.error('Error creating job:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  /**
   * Update a job (Admin)
   * Endpoint: PUT /api/admin/jobs/:id
   */
  updateJob: async (id: string, data: Partial<JobFormData>): Promise<{ success: boolean; data: Job | null; error?: string }> => {
    try {
      const response = await api.request<any>(`/admin/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if (response.success) {
        const job = extractJob(response.data);
        return { success: true, data: job };
      }
      
      return { success: false, data: null, error: response.error };
    } catch (error: any) {
      console.error('Error updating job:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  /**
   * Delete a job (Admin)
   * Endpoint: DELETE /api/admin/jobs/:id
   */
  deleteJob: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.request<any>(`/admin/jobs/${id}`, {
        method: 'DELETE',
      });
      
      return { success: response.success, error: response.error };
    } catch (error: any) {
      console.error('Error deleting job:', error);
      return { success: false, error: error.message };
    }
  },

  // ==================== PUBLISH/STATUS ====================

  /**
   * Toggle publish status (Admin)
   * Endpoint: PATCH /api/admin/jobs/:id/publish
   */
  togglePublish: async (id: string, isPublished: boolean): Promise<{ success: boolean; data: Job | null; error?: string }> => {
    try {
      const response = await api.request<any>(`/admin/jobs/${id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished }),
      });
      
      if (response.success) {
        const job = extractJob(response.data);
        return { success: true, data: job };
      }
      
      return { success: false, data: null, error: response.error };
    } catch (error: any) {
      console.error('Error toggling publish status:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  /**
   * Update job status (Admin)
   * Endpoint: PATCH /api/admin/jobs/:id/status
   */
  updateStatus: async (id: string, status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'): Promise<{ success: boolean; data: Job | null; error?: string }> => {
    try {
      const response = await api.request<any>(`/admin/jobs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      
      if (response.success) {
        const job = extractJob(response.data);
        return { success: true, data: job };
      }
      
      return { success: false, data: null, error: response.error };
    } catch (error: any) {
      console.error('Error updating job status:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // ==================== DASHBOARD STATS ====================

  /**
   * Get dashboard statistics (Admin)
   * Endpoint: GET /api/admin/jobs/stats/dashboard
   */
  getDashboardStats: async (): Promise<{ 
    success: boolean; 
    data: {
      totalJobs: number;
      activeJobs: number;
      draftJobs: number;
      closedJobs: number;
      totalApplications: number;
      newApplications: number;
      totalViews: number;
    } | null;
    error?: string;
  }> => {
    try {
      const response = await api.request<any>('/admin/jobs/stats/dashboard');
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      
      return { success: false, data: null, error: response.error };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // ==================== JOB APPLICATIONS ====================

  /**
   * Get applications for a specific job (Admin)
   * Endpoint: GET /api/admin/jobs/:id/applications
   */
  getJobApplications: async (jobId: string): Promise<{ success: boolean; data: any[]; error?: string }> => {
    try {
      const response = await api.request<any>(`/admin/jobs/${jobId}/applications`);
      
      if (response.success) {
        const applications = extractJobsArray(response.data);
        return { success: true, data: applications };
      }
      
      return { success: false, data: [], error: response.error };
    } catch (error: any) {
      console.error('Error fetching job applications:', error);
      return { success: false, data: [], error: error.message };
    }
  },
};

// ==================== PUBLIC JOB API ====================
// These don't require authentication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const publicJobApi = {
  /**
   * Get all published jobs (Public - No Auth)
   * Endpoint: GET /api/jobs
   */
  getPublishedJobs: async (): Promise<Job[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch jobs');
      }
      
      return extractJobsArray(data);
    } catch (error) {
      console.error('Error fetching public jobs:', error);
      return [];
    }
  },

  /**
   * Get a single job by slug (Public - No Auth)
   * Endpoint: GET /api/jobs/:slug
   */
  getJobBySlug: async (slug: string): Promise<Job | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${slug}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch job');
      }
      
      return extractJob(data);
    } catch (error) {
      console.error('Error fetching job by slug:', error);
      return null;
    }
  },

  /**
   * Submit a job application (Public - No Auth)
   * Endpoint: POST /api/jobs/:jobId/apply
   */
  submitApplication: async (jobId: string, applicationData: {
    candidateName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    yearsExperience?: number;
    coverLetter?: string;
    resumeUrl?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }
      
      return { success: true, message: 'Application submitted successfully!' };
    } catch (error: any) {
      console.error('Error submitting application:', error);
      return { success: false, message: error.message || 'Failed to submit application' };
    }
  },
};

export default jobApi;