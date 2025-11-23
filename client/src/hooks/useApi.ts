// src/hooks/useApi.ts
// Custom React Hooks for API data fetching and mutations

import { useState, useEffect, useCallback } from 'react';
import { api, User, ApiResponse } from '../services/api';

//  Generic API Hook 
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    
    setLoading(false);
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Users Hook 
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await api.getUsers();
    
    if (response.success && response.data) {
      setUsers(response.data);
    } else {
      setError(response.error || 'Failed to fetch users');
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Mutation functions
  const updateUser = async (id: string, data: Partial<User>) => {
    const response = await api.updateUser(id, data);
    if (response.success) {
      await fetchUsers();
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteUser = async (id: string) => {
    const response = await api.deleteUser(id);
    if (response.success) {
      await fetchUsers();
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateUserStatus = async (id: string, status: User['status']) => {
    const response = await api.updateUserStatus(id, status);
    if (response.success) {
      await fetchUsers();
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateUserRole = async (id: string, role: User['role']) => {
    const response = await api.updateUser(id, { role: role });
    if (response.success) {
      await fetchUsers();
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUser,
    deleteUser,
    updateUserStatus,
    updateUserRole
  };
}

//  Single User Hook 
export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      
      const response = await api.getUser(userId);
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.error || 'Failed to fetch user');
      }
      
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}

//  User Statistics Hook 
export function useUserStats() {
  const { users, loading, error } = useUsers();

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    inactive: users.filter(u => u.status === 'INACTIVE').length,
    suspended: users.filter(u => u.status === 'SUSPENDED').length,
    terminated: users.filter(u => u.status === 'TERMINATED').length,
    superadmins: users.filter(u => u.role === 'SUPERADMIN').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    employees: users.filter(u => u.role === 'EMPLOYEE').length,
  };

  return { stats, loading, error };
}

// Filtered Users Hook 
export function useFilteredUsers(filters: {
  searchQuery?: string;
  role?: string;
  status?: string;
}) {
  const { users, loading, error, ...rest } = useUsers();

  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.searchQuery || 
      user.firstName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesRole = !filters.role || filters.role === 'all' || user.role === filters.role;
    const matchesStatus = !filters.status || filters.status === 'all' || user.status === filters.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return {
    users: filteredUsers,
    allUsers: users,
    loading,
    error,
    ...rest
  };
}

//  Async Operation Hook 
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = async <T,>(
    operation: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await operation();
      
      if (response.success && response.data) {
        setSuccess(true);
        if (onSuccess) onSuccess(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Operation failed');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { loading, error, success, execute, reset };
}

//Example Usage in Component

/*
// Example 1: Simple user list
function UserList() {
  const { users, loading, error, refetch } = useUsers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {users.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}

// Example 2: User stats
function StatsWidget() {
  const { stats, loading } = useUserStats();

  if (loading) return <div>Loading stats...</div>;

  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Active: {stats.active}</p>
      <p>Admins: {stats.admins}</p>
    </div>
  );
}

// Example 3: Filtered users
function FilteredUserList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');

  const { users, loading, updateUserStatus } = useFilteredUsers({
    searchQuery,
    role,
    status
  });

  const handleSuspend = async (userId: string) => {
    const result = await updateUserStatus(userId, 'SUSPENDED');
    if (result.success) {
      alert('User suspended');
    }
  };

  return (
    <div>
      <input 
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      {users.map(user => (
        <div key={user.id}>
          {user.email}
          <button onClick={() => handleSuspend(user.id)}>Suspend</button>
        </div>
      ))}
    </div>
  );
}

// Example 4: Async operations with loading/error states
function CreateUserForm() {
  const { loading, error, success, execute } = useAsyncOperation();

  const handleSubmit = async () => {
    await execute(
      () => api.register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      }),
      (user) => {
        console.log('User created:', user);
      }
    );
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>User created!</p>}
    </div>
  );
}
*/