import { useState, useEffect } from 'react';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types based on your Prisma schema
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth utilities - FIXED: Use 'token' key to match AuthContext
export const getAuthToken = (): string | null => {
  // Use 'token' - same key as AuthContext and axios.config.ts
  const token = localStorage.getItem('token');
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('[Auth] Token retrieved:', token ? `${token.substring(0, 20)}...` : 'NULL');
  }
  
  return token;
};

export const setAuthToken = (token: string): void => {
  // Use 'token' - same key as AuthContext
  localStorage.setItem('token', token);
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('[Auth] Token stored:', token ? `${token.substring(0, 20)}...` : 'NULL');
  }
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
  
  if (import.meta.env.DEV) {
    console.log('[Auth] Token removed');
  }
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Check token before making request
    const token = getAuthToken();
    if (token && isTokenExpired(token)) {
      console.warn('[Auth] Token is expired');
    }

    try {
      if (import.meta.env.DEV) {
        console.log(`[API] ${options.method || 'GET'} ${url}`);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 401) {
          console.error('[API] Unauthorized - Token may be invalid or expired');
          // Clear expired token and redirect to login
          removeAuthToken();
          localStorage.removeItem('user');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }

      // Handle different response formats
      // Some endpoints return { success: true, data: {...} }
      // Some return the data directly
      if (typeof data === 'object' && 'success' in data) {
        return data;
      }
      
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('[API] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Automatically store token on successful login
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
      console.log('[Auth] Login successful, token stored');
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request<User>('/auth/profile');
  }

  async logout() {
    removeAuthToken();
    localStorage.removeItem('user');
  }

  // User endpoints
  async getUsers() {
    return this.request<User[]>('/users');
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async updateUserStatus(id: string, status: User['status']) {
    return this.request<User>(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

// Create singleton instance
export const api = new ApiService(API_BASE_URL);
export default api;

// Custom hooks for data fetching
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const response = await api.getUsers();
    
    if (response.success && response.data) {
      setUsers(response.data);
    } else {
      setError(response.error || 'Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
}

export function useUser(id: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      const response = await api.getUser(id);
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.error || 'Failed to fetch user');
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  return { user, loading, error };
}