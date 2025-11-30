import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, UserPlus, UserCheck, UserX, Mail, Phone,
  Calendar, Shield, Lock, Unlock, Edit, Trash2, Eye, XCircle,
  RefreshCw, CheckCircle, AlertCircle, TrendingUp, Loader
} from 'lucide-react';

// NOTE: Using a placeholder API_URL for compilation/example purposes.
// In a real environment, this would be set via environment variables.
const API_URL = 'https://mock-api.com/v1';

// --- Type Definitions ---

interface User {
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

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  terminated: number;
  superadmins: number;
  admins: number;
  employees: number;
}

interface AlertState {
  message: string;
  type: 'alert' | 'confirm' | 'success' | 'error';
  onConfirm?: () => void;
  title?: string;
}

// --- Utility Functions/Components ---

const getAuthToken = () => 'MOCK_AUTH_TOKEN'; // Mock function

const getRoleBadge = (role: User['role']) => {
  const styles = {
    SUPERADMIN: 'bg-red-100 text-red-700 border-red-300',
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-300',
    EMPLOYEE: 'bg-gray-100 text-gray-700 border-gray-300'
  };
  return styles[role] || styles.EMPLOYEE;
};

const getStatusBadge = (status: User['status']) => {
  const styles = {
    ACTIVE: 'bg-green-100 text-green-700 border-green-300',
    INACTIVE: 'bg-gray-100 text-gray-700 border-gray-300',
    SUSPENDED: 'bg-orange-100 text-orange-700 border-orange-300',
    TERMINATED: 'bg-red-100 text-red-700 border-red-300'
  };
  return styles[status] || styles.INACTIVE;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// --- Modals and Panels ---

const AlertModal = ({ alert, onClose }: { alert: AlertState; onClose: () => void; }) => {
  const isConfirm = alert.type === 'confirm';
  const isSuccess = alert.type === 'success';
  const isError = alert.type === 'error';

  let Icon = AlertCircle;
  let iconColor = 'text-blue-500';
  let title = alert.title || (isConfirm ? 'Confirm Action' : isSuccess ? 'Success' : isError ? 'Error' : 'Notification');

  if (isSuccess) {
    Icon = CheckCircle;
    iconColor = 'text-green-500';
  } else if (isError) {
    Icon = XCircle;
    iconColor = 'text-red-500';
  }

  const handleConfirm = () => {
    if (alert.onConfirm) {
      alert.onConfirm();
    }
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={isConfirm ? (e) => e.stopPropagation() : onClose} className="fixed inset-0 bg-black/50 z-[99] flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-sm w-full shadow-2xl">
        <div className="p-6 text-center">
          <Icon className={`w-12 h-12 mx-auto mb-4 ${iconColor}`} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{alert.message}</p>
          <div className="flex gap-3">
            {isConfirm && (
              <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
            )}
            <button onClick={isConfirm ? handleConfirm : onClose} className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all ${isSuccess ? 'bg-green-600 hover:bg-green-700' : isError ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isConfirm ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AddUserModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => Promise<void>; }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'EMPLOYEE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserPlus className="mr-3 text-blue-600" size={28} />
              Add New User
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle size={24} className="text-gray-500"/>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
              <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
              <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="Doe" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="john.doe@example.com" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" minLength={6} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="+1 234 567 8900" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none">
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Superadmin</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center">
              {isSubmitting ? <><Loader className="animate-spin mr-2" size={20} />Creating...</> : <><UserPlus className="mr-2" size={20} />Add User</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const EditUserModal = ({ user, onClose, onSubmit }: { user: User; onClose: () => void; onSubmit: (userId: string, data: any) => Promise<void>; }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || '',
    email: user.email,
    role: user.role,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(user.id, formData);
    setIsSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Edit className="mr-3 text-blue-600" size={28} />
              Edit User: {user.firstName} {user.lastName}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle size={24} className="text-gray-500" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none">
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Superadmin</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center">
              {isSubmitting ? <><Loader className="animate-spin mr-2" size={20} />Updating...</> : <><CheckCircle className="mr-2" size={20} />Update User</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const UserDetailPanel = ({ user, onClose, onEdit, onDelete, onStatusChange }: {
  user: User;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, newStatus: User['status']) => void;
}) => {
  const nextStatusMap: { [key in User['status']]: { status: User['status'], label: string, icon: any } } = {
    ACTIVE: { status: 'SUSPENDED', label: 'Suspend User', icon: Lock },
    INACTIVE: { status: 'ACTIVE', label: 'Activate User', icon: Unlock },
    SUSPENDED: { status: 'ACTIVE', label: 'Activate User', icon: Unlock },
    TERMINATED: { status: 'ACTIVE', label: 'Reactivate User', icon: Unlock },
  };

  const nextStatus = nextStatusMap[user.status];

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-40 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Eye className="mr-2 text-blue-600" size={24} /> User Details
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XCircle size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="text-center py-8 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="mt-3 flex justify-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getRoleBadge(user.role)}`}>{user.role}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(user.status)}`}>{user.status}</span>
          </div>
        </div>

        <div className="py-6 space-y-4">
          <div className="flex items-center space-x-3 text-gray-700">
            <Mail size={18} className="text-blue-500" />
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone size={18} className="text-blue-500" />
              <span className="font-semibold">Phone:</span>
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-3 text-gray-700">
            <Calendar size={18} className="text-blue-500" />
            <span className="font-semibold">Joined:</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Shield size={18} className="text-blue-500" />
            <span className="font-semibold">Role:</span>
            <span>{user.role}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-3">
          <button onClick={() => onEdit(user)} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors">
            <Edit size={20} />
            <span>Edit Information</span>
          </button>

          {nextStatus && (
            <button onClick={() => onStatusChange(user.id, nextStatus.status)} className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-colors ${nextStatus.status === 'ACTIVE' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}>
              <nextStatus.icon size={20} />
              <span>{nextStatus.label}</span>
            </button>
          )}

          <button onClick={() => onDelete(user.id)} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors">
            <Trash2 size={20} />
            <span>Delete User</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Helper function to calculate stats
  const calculateStats = (userList: User[]): UserStats => {
    return {
      total: userList.length,
      active: userList.filter(u => u.status === 'ACTIVE').length,
      inactive: userList.filter(u => u.status === 'INACTIVE').length,
      suspended: userList.filter(u => u.status === 'SUSPENDED').length,
      terminated: userList.filter(u => u.status === 'TERMINATED').length,
      superadmins: userList.filter(u => u.role === 'SUPERADMIN').length,
      admins: userList.filter(u => u.role === 'ADMIN').length,
      employees: userList.filter(u => u.role === 'EMPLOYEE').length,
    };
  };

  const getInitialMockData = (): User[] => [
    { id: '1', email: 'alice@example.com', firstName: 'Alice', lastName: 'Smith', phone: '123-456-7890', role: 'SUPERADMIN', status: 'ACTIVE', createdAt: new Date(Date.now() - 86400000 * 300).toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', email: 'bob@example.com', firstName: 'Bob', lastName: 'Johnson', phone: '987-654-3210', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date(Date.now() - 86400000 * 200).toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Brown', phone: '', role: 'EMPLOYEE', status: 'INACTIVE', createdAt: new Date(Date.now() - 86400000 * 100).toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', email: 'diana@example.com', firstName: 'Diana', lastName: 'Prince', phone: '111-222-3333', role: 'EMPLOYEE', status: 'SUSPENDED', createdAt: new Date(Date.now() - 86400000 * 50).toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', email: 'edward@example.com', firstName: 'Edward', lastName: 'Nygma', phone: '', role: 'ADMIN', status: 'TERMINATED', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: new Date().toISOString() },
    { id: '6', email: 'fiona@example.com', firstName: 'Fiona', lastName: 'Gala', phone: '555-123-4567', role: 'EMPLOYEE', status: 'ACTIVE', createdAt: new Date(Date.now() - 86400000 * 80).toISOString(), updatedAt: new Date().toISOString() },
  ];

  const loadUsersFromStorage = async (): Promise<User[]> => {
    console.log('ðŸ” Loading users from storage...');
    try {
      // Try window.storage first (Claude.ai artifacts)
      if (typeof window.storage !== 'undefined') {
        const result = await window.storage.get('users-data');
        if (result && result.value) {
          const parsed = JSON.parse(result.value);
          console.log('âœ… Loaded users from storage:', parsed.length, 'users', parsed.map(u => u.firstName));
          return parsed;
        }
      } else {
        // Fallback to localStorage for other environments
        const stored = localStorage.getItem('users-data');
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('âœ… Loaded users from localStorage:', parsed.length, 'users', parsed.map(u => u.firstName));
          return parsed;
        }
      }
      console.log('â„¹ï¸ No stored data found');
    } catch (error) {
      console.log('âš ï¸ Storage error:', error);
    }
    const initialData = getInitialMockData();
    console.log('ðŸ“¦ Using initial mock data:', initialData.length, 'users');
    // Save initial data on first load
    await saveUsersToStorage(initialData);
    return initialData;
  };

  const saveUsersToStorage = async (userList: User[]) => {
    try {
      console.log('ðŸ’¾ Saving to storage:', userList.length, 'users', userList.map(u => u.firstName));
      
      // Try window.storage first (Claude.ai artifacts)
      if (typeof window.storage !== 'undefined') {
        await window.storage.set('users-data', JSON.stringify(userList));
        console.log('âœ… Save successful (window.storage)!');
        
        // Verify save
        const verify = await window.storage.get('users-data');
        if (verify && verify.value) {
          const parsed = JSON.parse(verify.value);
          console.log('âœ”ï¸ Verified storage contains:', parsed.length, 'users');
        }
      } else {
        // Fallback to localStorage for other environments
        localStorage.setItem('users-data', JSON.stringify(userList));
        console.log('âœ… Save successful (localStorage)!');
        
        // Verify save
        const verify = localStorage.getItem('users-data');
        if (verify) {
          const parsed = JSON.parse(verify);
          console.log('âœ”ï¸ Verified localStorage contains:', parsed.length, 'users');
        }
      }
    } catch (error) {
      console.error('âŒ Failed to save users to storage:', error);
    }
  };

  const fetchData = async () => {
    const loadedUsers = await loadUsersFromStorage();
    setUsers(loadedUsers);
    setStats(calculateStats(loadedUsers));
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      fetchData(); // Use mock data function for now
    } catch (err) {
      setError('Error connecting to server. Using mock data fallback.');
      fetchData();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setAlert({
      message: 'This will reset all data to the original state. All your changes will be lost. Continue?',
      type: 'confirm',
      title: 'Reset to Default Data',
      onConfirm: async () => {
        try {
          const initialData = getInitialMockData();
          setUsers(initialData);
          setStats(calculateStats(initialData));
          await saveUsersToStorage(initialData);
          setAlert({ message: 'Data reset to defaults successfully.', type: 'success' });
        } catch (err) {
          setAlert({ message: 'Failed to reset data.', type: 'error' });
        }
      }
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- API Handlers using AlertModal ---

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    setAlert({
      message: `Are you sure you want to change user's status to ${newStatus}?`,
      type: 'confirm',
      title: 'Confirm Status Change',
      onConfirm: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          setUsers(prev => {
            const updated = prev.map(u => u.id === userId ? { ...u, status: newStatus } : u);
            setStats(calculateStats(updated));
            saveUsersToStorage(updated);
            return updated;
          });
          setSelectedUser(prev => prev && prev.id === userId ? { ...prev, status: newStatus } : prev);
          
          setAlert({
            message: `User status successfully updated to ${newStatus}.`,
            type: 'success',
          });
        } catch (err) {
          setAlert({ message: 'Failed to update status due to a server error.', type: 'error' });
        }
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    setAlert({
      message: 'This action is irreversible. Are you absolutely sure you want to delete this user?',
      type: 'confirm',
      title: 'Confirm Deletion',
      onConfirm: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));

          setUsers(prev => {
            const updated = prev.filter(u => u.id !== userId);
            setStats(calculateStats(updated));
            saveUsersToStorage(updated);
            return updated;
          });
          setSelectedUser(null);
          
          setAlert({ message: 'User deleted successfully.', type: 'success' });
        } catch (err) {
          setAlert({ message: 'Failed to delete user due to a server error.', type: 'error' });
        }
      }
    });
  };

  const handleAddUser = async (formData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUser: User = { 
        ...formData, 
        id: Date.now().toString(), // Use timestamp for unique ID
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUsers(prev => {
        const updated = [...prev, newUser];
        setStats(calculateStats(updated));
        saveUsersToStorage(updated);
        return updated;
      });
      setShowAddModal(false);
      
      setAlert({ message: `User ${formData.firstName} successfully created.`, type: 'success' });
    } catch (err) {
      setAlert({ message: 'Failed to create user. Please check the provided data.', type: 'error' });
    }
  };

  const handleUpdateUser = async (userId: string, formData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev => {
        const updated = prev.map(u => u.id === userId ? { ...u, ...formData, updatedAt: new Date().toISOString() } : u);
        setStats(calculateStats(updated));
        saveUsersToStorage(updated);
        return updated;
      });
      setSelectedUser(prev => prev && prev.id === userId ? { ...prev, ...formData, updatedAt: new Date().toISOString() } : prev);

      setShowEditModal(false);
      setEditingUser(null);
      
      setAlert({ message: 'User profile successfully updated.', type: 'success' });
    } catch (err) {
      setAlert({ message: 'Failed to update user. Please try again.', type: 'error' });
    }
  };

  // --- Filtering Logic ---

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower) || user.id.includes(searchLower);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const displayStats = stats ? [
    { label: 'Total Users', value: stats.total.toString(), icon: Users, color: 'from-blue-500 to-blue-600', subtext: 'Total across all roles' },
    { label: 'Active Users', value: stats.active.toString(), icon: UserCheck, color: 'from-green-500 to-green-600', subtext: `${Math.round((stats.active / stats.total) * 100) || 0}% of total` },
    { label: 'Suspended', value: stats.suspended.toString(), icon: UserX, color: 'from-orange-500 to-orange-600', subtext: 'Users currently locked' },
    { label: 'Admins/Super', value: (stats.admins + stats.superadmins).toString(), icon: Shield, color: 'from-purple-500 to-purple-600', subtext: 'Management personnel' }
  ] : [];

  // --- Render Sections ---

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center shadow-lg">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Users</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={fetchUsers} className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 flex items-center">
              <Users className="mr-3 text-blue-600" size={36} />
              User Management
            </h1>
            <p className="text-gray-600">Manage all system users - {users.length} total users loaded <span className="text-xs text-blue-600 ml-2">(Storage: {users.length > 6 ? 'Modified âœ“' : 'Default'})</span></p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50">
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button onClick={handleReset} className="flex items-center space-x-2 border-2 border-orange-300 text-orange-600 px-4 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all">
              <XCircle size={20} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              <UserPlus size={20} />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </motion.div>

      {displayStats.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {displayStats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
              <span className="text-xs font-medium text-gray-400 flex items-center"><TrendingUp size={12} className="mr-1" /> {stat.subtext}</span>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all" />
            </div>
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white">
            <option value="all">All Roles</option>
            <option value="SUPERADMIN">Superadmin</option>
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white">
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="TERMINATED">Terminated</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl font-semibold transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Grid</button>
            <button onClick={() => setViewMode('table')} className={`p-3 rounded-xl font-semibold transition-all flex items-center justify-center ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Table</button>
          </div>
        </div>
      </motion.div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredUsers.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredUsers.map((user, idx) => (
              <motion.div key={user.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${user.status === 'ACTIVE' ? 'bg-green-500' : user.status === 'INACTIVE' ? 'bg-gray-400' : user.status === 'SUSPENDED' ? 'bg-orange-500' : 'bg-red-500'}`} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-600 mb-3 truncate">{user.email}</p>
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getRoleBadge(user.role)}`}>{user.role}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(user.status)}`}>{user.status}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 mb-4">
                  <p className="text-xs text-gray-600">Joined: {formatDate(user.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedUser(user)} className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md">
                    <Eye size={16} /><span>View</span>
                  </button>
                  <button onClick={() => { setEditingUser(user); setShowEditModal(true); }} className="px-3 py-2 border-2 border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredUsers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th scope="col" className="relative px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence initial={false}>
                {filteredUsers.map((user) => (
                  <motion.tr key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getRoleBadge(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(user.status)}`}>{user.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => setSelectedUser(user)} className="p-2 text-blue-600 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors" title="View Details"><Eye size={18} /></button>
                        <button onClick={() => { setEditingUser(user); setShowEditModal(true); }} className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors" title="Edit User"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50 transition-colors" title="Delete User"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Modals and Side Panel */}
      <AnimatePresence>
        {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onSubmit={handleAddUser} />}
        {showEditModal && editingUser && <EditUserModal user={editingUser} onClose={() => setShowEditModal(false)} onSubmit={handleUpdateUser} />}
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-30" onClick={() => setSelectedUser(null)} />
            <UserDetailPanel
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onEdit={(user) => { setSelectedUser(null); setEditingUser(user); setShowEditModal(true); }}
              onDelete={handleDeleteUser}
              onStatusChange={(id, status) => { setSelectedUser(null); handleStatusChange(id, status); }}
            />
          </>
        )}
        {alert && <AlertModal alert={alert} onClose={() => setAlert(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;