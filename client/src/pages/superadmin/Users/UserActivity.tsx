import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Users, Eye, Clock, MapPin, Search, Download,
    LogIn, LogOut, Settings, ShoppingCart, CreditCard, Mail, Share2, Edit,
    Trash2, Plus, Loader2, AlertCircle, CheckCircle, XCircle, Bell,
    BarChart3, RefreshCw, Flag, MessageSquare, FileDown, TrendingUp,
    Shield, Cpu, Zap, TrendingDown, Clock3, Info, ChevronDown
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface User {
    name: string;
    email: string;
    avatar: string;
}

interface ActivityDetails {
    [key: string]: any;
}

interface Activity {
    id: number;
    user: User;
    action: string;
    type: string;
    description: string;
    timestamp: string;
    ip: string;
    location: string;
    device: string;
    priority: string;
    details?: ActivityDetails;
}

interface Comment {
    id: number;
    text: string;
    timestamp: string;
    author: string;
}

interface Notification {
    id: number;
    message: string;
    type: string;
    timestamp: string;
}

interface Stats {
    activeUsers: number;
    actionsToday: number;
    pageViews: number;
    avgSession: string;
    conversionRate: number;
    bounceRate: number;
    flaggedIncidents: number;
    newSignups: number;
}

interface ActivityData {
    activities: Activity[];
    stats: Stats;
    flagged: Set<number>;
    comments: { [key: number]: Comment[] };
    notifications: Notification[];
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    change?: string;
    index: number;
    isNegative?: boolean;
}

interface NewActivity {
    userName: string;
    userEmail: string;
    action: string;
    type: string;
    description: string;
    location: string;
    device: string;
    priority: string;
}

interface AddActivityModalProps {
    show: boolean;
    onClose: () => void;
    newActivity: NewActivity;
    setNewActivity: React.Dispatch<React.SetStateAction<NewActivity>>;
    onSubmit: () => void;
}

interface SelectedActivity extends Activity {
    isFlagged: boolean;
    comments: Comment[];
}

interface ActivityDetailModalProps {
    activity: SelectedActivity | null;
    onClose: () => void;
    onDelete: (activityId: number) => Promise<void>;
    onToggleFlag: (activityId: number) => Promise<void>;
    onAddComment: (activityId: number) => Promise<void>;
    comments: Comment[];
    newComment: string;
    setNewComment: React.Dispatch<React.SetStateAction<string>>;
}

interface ActivityRowProps {
    activity: Activity;
    isFlagged: boolean;
    onClick: (activity: Activity) => void;
}

interface NotificationToastProps {
    notification: Notification;
    onDismiss: (id: number) => void;
}

// --- Custom Hook for Local Storage ---
const useActivityStorage = (storageKey: string, initialDataFactory: () => ActivityData) => {
    const [data, setData] = useState<ActivityData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(() => {
        setIsLoading(true);
        try {
            const existingData = localStorage.getItem(storageKey);
            if (existingData) {
                const parsedData = JSON.parse(existingData);
                parsedData.flagged = new Set(parsedData.flagged || []);
                setData(parsedData);
            } else {
                const initialData = initialDataFactory();
                localStorage.setItem(storageKey, JSON.stringify({
                    ...initialData,
                    flagged: Array.from(initialData.flagged || new Set())
                }));
                setData(initialData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setData(initialDataFactory());
        } finally {
            setIsLoading(false);
        }
    }, [storageKey, initialDataFactory]);

    const saveData = useCallback((updates: Partial<ActivityData>) => {
        setData(prevData => {
            const updatedData = { ...(prevData || initialDataFactory()), ...updates };
            const dataToStore = { ...updatedData };
            dataToStore.flagged = Array.from(updatedData.flagged || new Set()) as any;

            try {
                localStorage.setItem(storageKey, JSON.stringify(dataToStore));
            } catch (error) {
                console.error('Error saving data:', error);
            }
            
            return { ...updatedData, flagged: new Set(updatedData.flagged || []) };
        });
    }, [storageKey, initialDataFactory]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { data, isLoading, saveData, refreshData: loadData };
};

// --- Utility Functions ---
const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    return past.toLocaleDateString('en-GB');
};

const getActionIcon = (action: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
        logged_in: LogIn, logged_out: LogOut, created_order: ShoppingCart,
        updated_profile: Edit, deleted_document: Trash2, sent_email: Mail,
        changed_settings: Settings, viewed_report: Eye, payment_processed: CreditCard,
        shared_content: Share2, api_call: Cpu, security_alert: Shield,
        downloaded_data: FileDown, system_error: AlertCircle
    };
    return icons[action] || Activity;
};

const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
        authentication: 'bg-blue-100 text-blue-700 border-blue-300',
        transaction: 'bg-green-100 text-green-700 border-green-300',
        profile: 'bg-purple-100 text-purple-700 border-purple-300',
        content: 'bg-orange-100 text-orange-700 border-orange-300',
        communication: 'bg-pink-100 text-pink-700 border-pink-300',
        system: 'bg-red-100 text-red-700 border-red-300',
        analytics: 'bg-teal-100 text-teal-700 border-teal-300',
        security: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
};

const getPriorityColor = (priority: string): string => {
    const colors: { [key: string]: string } = {
        critical: 'bg-red-500 text-white border-red-700',
        high: 'bg-orange-400 text-white border-orange-600',
        normal: 'bg-blue-500 text-white border-blue-700',
        low: 'bg-gray-300 text-gray-800 border-gray-400'
    };
    return colors[priority] || colors.normal;
};

const getDefaultStats = (): Stats => ({
    activeUsers: 1247,
    actionsToday: 8945,
    pageViews: 45200,
    avgSession: '12m 34s',
    conversionRate: 3.2,
    bounceRate: 42.5,
    flaggedIncidents: 12,
    newSignups: 45
});

const UK_LOCATIONS = ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Cardiff', 'Edinburgh'];

const generateInitialActivities = (count = 50): Activity[] => {
    const users: User[] = [
        { name: 'Sarah Johnson', email: 'sarah.j@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Michael Chen', email: 'michael.c@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Emma Wilson', email: 'emma.w@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'James Brown', email: 'james.b@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=7' },
        { name: 'Lisa Anderson', email: 'lisa.a@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=9' }
    ];

    const actions = [
        { action: 'logged_in', type: 'authentication', description: 'Logged in successfully', details: { method: '2FA', duration: '0.45s', country: 'UK' } },
        { action: 'created_order', type: 'transaction', description: 'New E-commerce order placed', details: { orderId: 'ORD-' + Math.floor(Math.random() * 10000), amount: 'Â£' + (Math.floor(Math.random() * 500) + 10).toFixed(2), items: Math.floor(Math.random() * 5) + 1 } },
        { action: 'updated_profile', type: 'profile', description: 'Updated billing information', details: { fields: ['address', 'payment_method'], changes: 2 } },
        { action: 'viewed_report', type: 'analytics', description: 'Viewed GDPR compliance report', details: { report: 'GDPR Compliance', duration: '5m 34s', sensitivity: 'High' } },
        { action: 'security_alert', type: 'security', description: 'Suspicious login attempt blocked', details: { threat: 'Brute Force', target: 'login endpoint', outcome: 'Blocked' } },
        { action: 'api_call', type: 'system', description: 'High volume API call to product catalog', details: { endpoint: '/api/v1/products', status: 200, latency: '50ms' } }
    ];

    return Array.from({ length: count }, (_, i) => { 
        const user = users[i % users.length];
        const actionData = actions[Math.floor(Math.random() * actions.length)];
        const location = UK_LOCATIONS[i % UK_LOCATIONS.length];
        const device = ['Chrome on Windows', 'Safari on MacOS', 'Firefox on Linux', 'Mobile App on iOS'][i % 4];
        const priority = ['normal', 'high', 'low', 'critical'][Math.floor(Math.random() * 4)];

        return {
            id: Date.now() + i,
            user: user,
            ...actionData,
            timestamp: new Date(Date.now() - i * 5 * 60000).toISOString(),
            ip: `82.12.1.${100 + i}`,
            location: `${location}, UK`,
            device: device,
            priority: priority,
            details: { ...actionData.details, ...(Math.random() < 0.2 ? { notes: 'Automated high-risk flag triggered.' } : {}) }
        };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const initialDataFactory = (): ActivityData => ({
    activities: generateInitialActivities(50),
    stats: getDefaultStats(),
    flagged: new Set(),
    comments: {},
    notifications: []
});

// --- Debounce Hook ---
const useDebounce = (value: string, delay: number): string => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// --- Sub-Components ---

const StatCard = React.memo<StatCardProps>(({ label, value, icon: Icon, color, change, index, isNegative }) => {
    const TrendIcon = isNegative ? TrendingDown : TrendingUp;
    const trendColor = isNegative ? 'text-red-600' : 'text-green-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl ring-1 ring-gray-100 transition-all cursor-pointer border-t-4"
            style={{ borderColor: color.split('-')[1] }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="text-white" size={24} />
                </div>
                {change && (
                    <span className={`text-xs sm:text-sm font-bold flex items-center ${trendColor}`}>
                        <TrendIcon size={16} className="mr-1" />
                        {change}
                    </span>
                )}
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{value}</h3>
            <p className="text-sm text-gray-600">{label}</p>
        </motion.div>
    );
});

const AddActivityModal = React.memo<AddActivityModalProps>(({ show, onClose, newActivity, setNewActivity, onSubmit }) => {
    if (!show) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewActivity(prev => ({ ...prev, [name]: value }));
    };

    const actionOptions = [
        { value: 'logged_in', label: 'Logged In' },
        { value: 'created_order', label: 'Created Order' },
        { value: 'updated_profile', label: 'Updated Profile' },
        { value: 'security_alert', label: 'Security Alert' },
        { value: 'api_call', label: 'API Call' },
    ];

    const typeOptions = [
        { value: 'authentication', label: 'Authentication' },
        { value: 'transaction', label: 'Transaction' },
        { value: 'profile', label: 'Profile' },
        { value: 'security', label: 'Security' },
        { value: 'system', label: 'System' },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Plus className="mr-2 text-purple-600" /> Manually Add Activity Log
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="userName"
                                value={newActivity.userName}
                                onChange={handleChange}
                                placeholder="User Name"
                                required
                                className="col-span-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                            <input
                                type="email"
                                name="userEmail"
                                value={newActivity.userEmail}
                                onChange={handleChange}
                                placeholder="User Email"
                                required
                                className="col-span-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="relative">
                                <select
                                    name="action"
                                    value={newActivity.action}
                                    onChange={handleChange}
                                    className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white w-full"
                                >
                                    {actionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={newActivity.type}
                                    onChange={handleChange}
                                    className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white w-full"
                                >
                                    {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                        <textarea
                            name="description"
                            value={newActivity.description}
                            onChange={handleChange}
                            placeholder="Activity Description"
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:border-purple-500 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <input
                                type="text"
                                name="location"
                                value={newActivity.location}
                                onChange={handleChange}
                                placeholder="Location"
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                            <div className="relative">
                                <select
                                    name="priority"
                                    value={newActivity.priority}
                                    onChange={handleChange}
                                    className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white w-full"
                                >
                                    <option value="normal">Normal Priority</option>
                                    <option value="high">High Priority</option>
                                    <option value="critical">Critical Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center"
                            >
                                <Plus size={20} className="mr-1" /> Add Activity
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

const ActivityDetailModal = React.memo<ActivityDetailModalProps>(({ activity, onClose, onDelete, onToggleFlag, onAddComment, comments, newComment, setNewComment }) => {
    if (!activity) return null;

    const isFlagged = activity.isFlagged;
    const ActionIcon = getActionIcon(activity.action);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start mb-6 border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                            <ActionIcon className="mr-3 text-blue-600" size={28} />
                            Audit Log Details (ID: {activity.id})
                        </h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">
                            <XCircle size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <p className="text-lg font-semibold text-gray-800">{activity.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getTypeColor(activity.type)}`}>
                                {activity.type.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(activity.priority)} text-white`}>
                                {activity.priority.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1"><Clock size={16} />{formatTimeAgo(activity.timestamp)}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border rounded-xl p-4 bg-gray-50">
                                <h4 className="font-bold mb-2 flex items-center"><Users size={16} className="mr-2" /> User Info</h4>
                                <p className="text-sm"><strong>Name:</strong> {activity.user.name}</p>
                                <p className="text-sm"><strong>Email:</strong> {activity.user.email}</p>
                                <p className="text-sm"><strong>IP Address:</strong> {activity.ip}</p>
                            </div>
                            <div className="border rounded-xl p-4 bg-gray-50">
                                <h4 className="font-bold mb-2 flex items-center"><Eye size={16} className="mr-2" /> Geo/Device</h4>
                                <p className="text-sm"><strong>Location:</strong> {activity.location}</p>
                                <p className="text-sm"><strong>Device:</strong> {activity.device}</p>
                                <p className="text-sm"><strong>Browser:</strong> {activity.device.split(' on ')[0]}</p>
                            </div>
                        </div>

                        {activity.details && Object.keys(activity.details).length > 0 && (
                            <div className="border rounded-xl p-4 bg-yellow-50">
                                <h4 className="font-bold mb-2 text-orange-700 flex items-center"><Eye size={16} className="mr-2" /> Additional Details</h4>
                                {Object.entries(activity.details).map(([key, value]) => (
                                    <p key={key} className="text-sm"><strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong> {String(value)}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => onToggleFlag(activity.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${isFlagged ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                <Flag size={20} />
                                {isFlagged ? 'Unflag' : 'Flag for Review'}
                            </button>
                            <button
                                onClick={() => { if (window.confirm('Are you sure?')) { onDelete(activity.id); } }}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-xl font-semibold hover:bg-red-50 transition-all"
                            >
                                <Trash2 size={20} />
                                Delete Log
                            </button>
                        </div>

                        <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3 flex items-center"><MessageSquare size={20} className="mr-2" /> Audit Comments ({comments.length || 0})</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto p-2 border rounded-xl bg-gray-50">
                            {comments.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>
                            ) : (
                                comments.map((comment, idx) => (
                                    <div key={comment.id || idx} className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                            <span className="font-semibold">{comment.author}</span>
                                            <span>{formatTimeAgo(comment.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-gray-800">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddComment(activity.id); } }}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                            <button
                                onClick={() => onAddComment(activity.id)}
                                disabled={!newComment.trim()}
                                className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

const ActivityRow = React.memo<ActivityRowProps>(({ activity, isFlagged, onClick }) => {
    const ActionIcon = getActionIcon(activity.action);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onClick(activity)}
            className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer ${isFlagged ? 'bg-red-50 hover:bg-red-100 ring-1 ring-red-200' : ''}`}
        >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <ActionIcon size={20} className="text-gray-700" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{activity.user.name}</p>
                <p className="text-sm text-gray-500 truncate">{activity.description}</p>
            </div>

            <div className="flex items-center space-x-3 ml-4 text-xs font-medium text-gray-600">
                <span className={`px-2 py-0.5 rounded-full border ${getTypeColor(activity.type)}`}>
                    {activity.type.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded-full border font-bold text-white ${getPriorityColor(activity.priority)}`}>
                    {activity.priority.toUpperCase()}
                </span>
                <span className="flex items-center whitespace-nowrap">
                    <Clock3 size={14} className="mr-1 text-gray-400" />
                    {formatTimeAgo(activity.timestamp)}
                </span>
                {isFlagged && (
    <span title="Flagged for review">
        <Flag size={18} className="text-red-500 shrink-0" />
    </span>
)}
            </div>
        </motion.div>
    );
});

const NotificationToast = React.memo<NotificationToastProps>(({ notification, onDismiss }) => {
    let Icon = Info;
    let color = 'bg-blue-500';

    switch (notification.type) {
        case 'success':
            Icon = CheckCircle;
            color = 'bg-green-500';
            break;
        case 'error':
            Icon = AlertCircle;
            color = 'bg-red-500';
            break;
        case 'warning':
            Icon = AlertCircle;
            color = 'bg-yellow-500';
            break;
        case 'flagged':
            Icon = Flag;
            color = 'bg-orange-500';
            break;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`p-4 rounded-xl shadow-lg flex items-center max-w-sm w-full pointer-events-auto ring-1 ring-black ring-opacity-5 ${color} text-white`}
        >
            <Icon className="flex-shrink-0 w-6 h-6 mr-3" />
            <div className="flex-1">
                <p className="font-bold text-sm">{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</p>
                <p className="text-sm">{notification.message}</p>
            </div>
            <button onClick={() => onDismiss(notification.id)} className="ml-4 flex-shrink-0 text-white opacity-70 hover:opacity-100 transition-opacity">
                <XCircle size={20} />
            </button>
        </motion.div>
    );
});

// --- Main Component ---
const ActivityDashboard: React.FC = () => {
    const { data, isLoading, saveData, refreshData } = useActivityStorage('activity-dashboard-data-v1', initialDataFactory);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newActivity, setNewActivity] = useState<NewActivity>({
        userName: 'New Auditor',
        userEmail: 'auditor@slbrothers.co.uk',
        action: 'logged_in',
        type: 'authentication',
        description: 'Manual log entry',
        location: 'London, UK',
        device: 'Manual Input',
        priority: 'normal',
    });
    const [selectedActivity, setSelectedActivity] = useState<SelectedActivity | null>(null);
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const ACTIVITIES_PER_PAGE = 10;

    // --- Activity CRUD Operations ---

    const addActivity = useCallback(() => {
        if (!data) return;

        const newLog: Activity = {
            id: Date.now(),
            user: { name: newActivity.userName, email: newActivity.userEmail, avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 20) },
            action: newActivity.action,
            type: newActivity.type,
            description: newActivity.description,
            timestamp: new Date().toISOString(),
            ip: '127.0.0.1 (Manual)',
            location: newActivity.location,
            device: newActivity.device,
            priority: newActivity.priority,
            details: { source: 'Manual Entry' }
        };

        const updatedActivities = [newLog, ...data.activities];
        const updatedStats = {
            ...data.stats,
            actionsToday: data.stats.actionsToday + 1,
        };

        saveData({
            activities: updatedActivities,
            stats: updatedStats,
            notifications: [{ id: Date.now(), message: `New activity log created: ${newLog.description}`, type: 'success', timestamp: new Date().toISOString() }, ...data.notifications]
        });

        setShowAddModal(false);
        setNewActivity(prev => ({ ...prev, description: 'Manual log entry' })); // Reset description
    }, [data, newActivity, saveData]);

    const deleteActivity = useCallback(async (activityId: number) => {
        if (!data) return;

        const updatedActivities = data.activities.filter(a => a.id !== activityId);
        const updatedFlagged = new Set(data.flagged);
        updatedFlagged.delete(activityId);

        saveData({
            activities: updatedActivities,
            flagged: updatedFlagged,
            stats: { ...data.stats, flaggedIncidents: updatedFlagged.size },
            comments: Object.fromEntries(Object.entries(data.comments).filter(([id]) => Number(id) !== activityId)),
            notifications: [{ id: Date.now(), message: `Activity ID ${activityId} permanently deleted.`, type: 'error', timestamp: new Date().toISOString() }, ...data.notifications]
        });

        setSelectedActivity(null);
    }, [data, saveData]);

    const toggleFlag = useCallback(async (activityId: number) => {
        if (!data) return;

        const updatedFlagged = new Set(data.flagged);
        let notificationMessage = '';
        let notificationType: Notification['type'];

        if (updatedFlagged.has(activityId)) {
            updatedFlagged.delete(activityId);
            notificationMessage = `Activity ID ${activityId} unflagged.`;
            notificationType = 'warning';
        } else {
            updatedFlagged.add(activityId);
            notificationMessage = `Activity ID ${activityId} flagged for review.`;
            notificationType = 'flagged';
        }

        saveData({
            flagged: updatedFlagged,
            stats: { ...data.stats, flaggedIncidents: updatedFlagged.size },
            notifications: [{ id: Date.now(), message: notificationMessage, type: notificationType, timestamp: new Date().toISOString() }, ...data.notifications]
        });

        if (selectedActivity && selectedActivity.id === activityId) {
            setSelectedActivity(prev => prev ? { ...prev, isFlagged: !prev.isFlagged } : null);
        }

    }, [data, saveData, selectedActivity]);

    const addComment = useCallback(async (activityId: number) => {
        if (!data || !newComment.trim()) return;

        const newCmt: Comment = {
            id: Date.now(),
            text: newComment,
            timestamp: new Date().toISOString(),
            author: 'System Auditor', // In a real app, this would be the logged-in user
        };

        const updatedComments = {
            ...data.comments,
            [activityId]: [...(data.comments[activityId] || []), newCmt],
        };

        saveData({
            comments: updatedComments,
            notifications: [{ id: Date.now(), message: `New comment added to Activity ID ${activityId}.`, type: 'info', timestamp: new Date().toISOString() }, ...data.notifications]
        });

        setNewComment('');
        if (selectedActivity && selectedActivity.id === activityId) {
            setSelectedActivity(prev => prev ? { ...prev, comments: updatedComments[activityId] } : null);
        }

    }, [data, newComment, saveData, selectedActivity]);

    const dismissNotification = useCallback((id: number) => {
        if (!data) return;
        saveData({ notifications: data.notifications.filter(n => n.id !== id) });
    }, [data, saveData]);

    const openActivityDetails = useCallback((activity: Activity) => {
        if (!data) return;

        const details: SelectedActivity = {
            ...activity,
            isFlagged: data.flagged.has(activity.id),
            comments: data.comments[activity.id] || [],
        };
        setSelectedActivity(details);
        setNewComment('');
    }, [data]);

    // --- Filtering and Pagination Logic ---
    const filteredActivities = useMemo(() => {
        if (!data) return [];

        let filtered = data.activities;

        // 1. Filter by Type
        if (filterType !== 'all') {
            filtered = filtered.filter(activity => activity.type === filterType);
        }

        // 2. Filter by Search Term
        if (debouncedSearchTerm) {
            const lowerCaseSearch = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(activity =>
                activity.user.name.toLowerCase().includes(lowerCaseSearch) ||
                activity.description.toLowerCase().includes(lowerCaseSearch) ||
                activity.type.toLowerCase().includes(lowerCaseSearch) ||
                activity.location.toLowerCase().includes(lowerCaseSearch) ||
                activity.ip.includes(lowerCaseSearch)
            );
        }

        // 3. Sort (already sorted by timestamp on creation/load, keeping this for clarity)
        // filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return filtered;
    }, [data, filterType, debouncedSearchTerm]);

    const paginatedActivities = useMemo(() => {
        const startIndex = (page - 1) * ACTIVITIES_PER_PAGE;
        return filteredActivities.slice(startIndex, startIndex + ACTIVITIES_PER_PAGE);
    }, [filteredActivities, page, ACTIVITIES_PER_PAGE]);

    const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);

    const typeOptions = useMemo(() => {
        if (!data) return [];
        const types = new Set(data.activities.map(a => a.type));
        return [{ value: 'all', label: 'All Types' }, ...Array.from(types).map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))];
    }, [data]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [filterType, debouncedSearchTerm]);


    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader2 size={48} className="animate-spin text-purple-600" />
                <p className="ml-3 text-lg text-gray-700">Loading Dashboard Data...</p>
            </div>
        );
    }

    const statCardsData = [
        { label: 'Active Users (24h)', value: data.stats.activeUsers.toLocaleString(), icon: Users, color: 'bg-blue-500', change: '+5%', isNegative: false },
        { label: 'Actions Today', value: data.stats.actionsToday.toLocaleString(), icon: Activity, color: 'bg-purple-600', change: '+12.5%', isNegative: false },
        { label: 'Flagged Incidents', value: data.stats.flaggedIncidents.toLocaleString(), icon: Flag, color: 'bg-red-500', change: '+2', isNegative: false },
        { label: 'Avg. Session', value: data.stats.avgSession, icon: Clock, color: 'bg-teal-500', change: '-1m', isNegative: true },
        { label: 'Conversion Rate', value: `${data.stats.conversionRate}%`, icon: TrendingUp, color: 'bg-green-500', change: '+0.1%', isNegative: false },
        { label: 'Bounce Rate', value: `${data.stats.bounceRate}%`, icon: TrendingDown, color: 'bg-orange-500', change: '+1.5%', isNegative: true },
        { label: 'New Signups', value: data.stats.newSignups.toLocaleString(), icon: LogIn, color: 'bg-indigo-500', change: '+10%', isNegative: false },
        { label: 'Page Views (24h)', value: data.stats.pageViews.toLocaleString(), icon: Eye, color: 'bg-pink-500', change: '+8%', isNegative: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center">
                    <BarChart3 className="mr-3 text-purple-600" size={36} />
                    Audit & Activity Dashboard
                </h1>
                <p className="text-gray-600">Real-time system health and user activity monitoring. Data stored in LocalStorage.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {statCardsData.map((stat, index) => (
                    <StatCard key={stat.label} {...stat} index={index} />
                ))}
            </div>

            {/* Activity Table Header and Controls */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 ring-1 ring-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
                        <Activity className="mr-2 text-purple-600" size={24} />
                        Recent Activities ({filteredActivities.length})
                    </h2>
                    <div className="flex space-x-3">
                        <motion.button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus size={20} className="mr-1" /> Add Log
                        </motion.button>
                        <motion.button
                            onClick={refreshData}
                            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                            whileHover={{ rotate: 10 }}
                            whileTap={{ scale: 0.95 }}
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} />
                        </motion.button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by user, description, IP or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                    <div className="relative w-full md:w-auto">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white pr-10"
                        >
                            {typeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Activity List */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg mt-6">
                    {paginatedActivities.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            <AlertCircle size={32} className="mx-auto text-yellow-500 mb-2" />
                            <p className="text-lg">No activities found matching your criteria.</p>
                        </div>
                    ) : (
                        paginatedActivities.map(activity => (
                            <ActivityRow
                                key={activity.id}
                                activity={activity}
                                isFlagged={data.flagged.has(activity.id)}
                                onClick={openActivityDetails}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-6">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border rounded-xl bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 font-semibold text-gray-800">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border rounded-xl bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Modals and Notifications */}
            <AddActivityModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                newActivity={newActivity}
                setNewActivity={setNewActivity}
                onSubmit={addActivity}
            />

            <ActivityDetailModal
                activity={selectedActivity}
                onClose={() => setSelectedActivity(null)}
                onDelete={deleteActivity}
                onToggleFlag={toggleFlag}
                onAddComment={addComment}
                comments={selectedActivity?.comments || []}
                newComment={newComment}
                setNewComment={setNewComment}
            />

            {/* Notification Toasts Area */}
            <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
                <AnimatePresence>
                    {data.notifications.slice(0, 5).map(n => (
                        <NotificationToast
                            key={n.id}
                            notification={n}
                            onDismiss={dismissNotification}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ActivityDashboard;