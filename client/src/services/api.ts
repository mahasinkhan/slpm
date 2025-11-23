import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Auth utilities
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
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
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
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

// Demo Component showing API integration
export default function ApiDemo() {
  const { users, loading, error, refetch } = useUsers();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('Logging in...');
    
    const response = await api.login(loginEmail, loginPassword);
    
    if (response.success && response.data) {
      setAuthToken(response.data.token);
      setLoginStatus(`✅ Logged in as ${response.data.user.email}`);
      refetch();
    } else {
      setLoginStatus(`❌ ${response.error || 'Login failed'}`);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setLoginStatus('');
    setLoginEmail('');
    setLoginPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8">
          🔌 Backend API Integration Demo
        </h1>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </form>
          {loginStatus && (
            <div className="mt-4 p-4 bg-gray-100 rounded-xl">
              <p className="font-semibold">{loginStatus}</p>
            </div>
          )}
        </div>

        {/* API Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Status</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Base URL:</span> {API_BASE_URL}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Auth Token:</span>{' '}
              {getAuthToken() ? '✅ Present' : '❌ Not set'}
            </p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Users from API</h2>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading users...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 font-semibold">❌ Error: {error}</p>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found</p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'SUPERADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : user.status === 'SUSPENDED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Credentials */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            🔑 Test Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              <span className="font-semibold">Super Admin:</span>{' '}
              superadmin@slbrothers.co.uk / superadmin123
            </p>
            <p className="text-blue-800">
              <span className="font-semibold">Admin:</span>{' '}
              admin@slbrothers.co.uk / admin123
            </p>
            <p className="text-blue-800">
              <span className="font-semibold">Employee:</span>{' '}
              employee@slbrothers.co.uk / employee123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}