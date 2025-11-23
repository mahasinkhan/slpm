import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo } from "react-icons/fi";
import {
    Activity, Users, Eye, Clock, MapPin, Monitor, Globe, Search, Download,
    LogIn, LogOut, Settings, ShoppingCart, CreditCard, Mail, Share2, Edit,
    Trash2, Plus, Loader2, Filter, AlertCircle, CheckCircle, XCircle, Bell,
    BarChart3, Calendar, RefreshCw, Flag, MessageSquare, FileDown, TrendingUp, ChevronDown,
    Shield, Euro, DollarSign, Cpu, Zap, TrendingDown, Clock3,
    Info
} from 'lucide-react';

// --- Custom Hook for Local Storage (Simulated for Browser Environment) ---
// NOTE: Replaced the assumed 'window.storage' with standard localStorage for demonstrability.
const useActivityStorage = (storageKey = 'user-activities-uk', initialDataFactory) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(() => {
        setIsLoading(true);
        try {
            const existingData = localStorage.getItem(storageKey);
            if (existingData) {
                const parsedData = JSON.parse(existingData);
                // Convert flagged array back to a Set
                parsedData.flagged = new Set(parsedData.flagged || []); 
                setData(parsedData);
            } else {
                const initialData = initialDataFactory();
                // Store Set as Array
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

    const saveData = useCallback((updates) => {
        setData(prevData => {
            const updatedData = { ...(prevData || initialDataFactory()), ...updates };
            // Convert Set back to Array for storage
            const dataToStore = { ...updatedData };
            dataToStore.flagged = Array.from(updatedData.flagged || new Set()); 

            try {
                localStorage.setItem(storageKey, JSON.stringify(dataToStore));
            } catch (error) {
                console.error('Error saving data:', error);
            }
            
            // Return local state with the actual data (Set converted back)
            return { ...updatedData, flagged: new Set(updatedData.flagged || []) };
        });
    }, [storageKey, initialDataFactory]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { data, isLoading, saveData, refreshData: loadData };
};

// --- Utility Functions ---
const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    return past.toLocaleDateString('en-GB'); // UK date format
};

const getActionIcon = (action) => {
    const icons = {
        logged_in: LogIn, logged_out: LogOut, created_order: ShoppingCart,
        updated_profile: Edit, deleted_document: Trash2, sent_email: Mail,
        changed_settings: Settings, viewed_report: Eye, payment_processed: CreditCard,
        shared_content: Share2, api_call: Cpu, security_alert: Shield,
        downloaded_data: FileDown, system_error: AlertCircle
    };
    return icons[action] || Activity;
};

const getTypeColor = (type) => {
    const colors = {
        authentication: 'bg-blue-100 text-blue-700 border-blue-300',
        transaction: 'bg-green-100 text-green-700 border-green-300',
        profile: 'bg-purple-100 text-purple-700 border-purple-300',
        content: 'bg-orange-100 text-orange-700 border-orange-300',
        communication: 'bg-pink-100 text-pink-700 border-pink-300',
        system: 'bg-red-100 text-red-700 border-red-300', // System/Error is red
        analytics: 'bg-teal-100 text-teal-700 border-teal-300',
        security: 'bg-yellow-100 text-yellow-700 border-yellow-300' // New Security type
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
};

const getPriorityColor = (priority) => {
    const colors = {
        critical: 'bg-red-500 text-white border-red-700', // Added Critical
        high: 'bg-orange-400 text-white border-orange-600',
        normal: 'bg-blue-500 text-white border-blue-700',
        low: 'bg-gray-300 text-gray-800 border-gray-400'
    };
    return colors[priority] || colors.normal;
};

const getDefaultStats = () => ({
    activeUsers: 1247,
    actionsToday: 8945,
    pageViews: 45200,
    avgSession: '12m 34s',
    conversionRate: 3.2, // UK specific: keep an eye on this metric
    bounceRate: 42.5,
    flaggedIncidents: 12, // New stat
    newSignups: 45 // New stat
});

const UK_LOCATIONS = ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Cardiff', 'Edinburgh'];

const generateInitialActivities = (count = 50) => {
    const users = [
        { name: 'Sarah Johnson', email: 'sarah.j@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Michael Chen', email: 'michael.c@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Emma Wilson', email: 'emma.w@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'James Brown', email: 'james.b@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=7' },
        { name: 'Lisa Anderson', email: 'lisa.a@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=9' }
    ];

    const actions = [
        { action: 'logged_in', type: 'authentication', description: 'Logged in successfully', details: { method: '2FA', duration: '0.45s', country: 'UK' } },
        { action: 'created_order', type: 'transaction', description: 'New E-commerce order placed', details: { orderId: 'ORD-' + Math.floor(Math.random() * 10000), amount: '£' + (Math.floor(Math.random() * 500) + 10).toFixed(2), items: Math.floor(Math.random() * 5) + 1 } },
        { action: 'updated_profile', type: 'profile', description: 'Updated billing information', details: { fields: ['address', 'payment_method'], changes: 2 } },
        { action: 'viewed_report', type: 'analytics', description: 'Viewed GDPR compliance report', details: { report: 'GDPR Compliance', duration: '5m 34s', sensitivity: 'High' } },
        { action: 'security_alert', type: 'security', description: 'Suspicious login attempt blocked', details: { threat: 'Brute Force', target: 'login endpoint', outcome: 'Blocked' } },
        { action: 'api_call', type: 'system', description: 'High volume API call to product catalog', details: { endpoint: '/api/v1/products', status: 200, latency: '50ms' } }
    ];

    return Array.from({ length: count }, (_, i) => { 
        const user = users[i % users.length];
        const actionData = actions[Math.floor(Math.random() * actions.length)]; // Randomize actions better
        const location = UK_LOCATIONS[i % UK_LOCATIONS.length];
        const device = ['Chrome on Windows', 'Safari on MacOS', 'Firefox on Linux', 'Mobile App on iOS'][i % 4];
        const priority = ['normal', 'high', 'low', 'critical'][Math.floor(Math.random() * 4)];

        return {
            id: Date.now() + i,
            user: user,
            ...actionData,
            timestamp: new Date(Date.now() - i * 5 * 60000).toISOString(),
            ip: `82.12.1.${100 + i}`, // Mock UK IP range
            location: `${location}, UK`,
            device: device,
            priority: priority,
            details: { ...actionData.details, ...(Math.random() < 0.2 ? { notes: 'Automated high-risk flag triggered.' } : {}) } // Add mock notes occasionally
        };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const initialDataFactory = () => ({
    activities: generateInitialActivities(50),
    stats: getDefaultStats(),
    flagged: new Set(),
    comments: {},
    notifications: []
});

// --- Debounce Hook (for search input) ---
const useDebounce = (value, delay) => {
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


// --- Sub-Components (Modular and Enhanced) ---

// 1. Stats Card (Enhanced with UK context and trend)
const StatCard = React.memo(({ label, value, icon: Icon, color, change, index }) => {
    const isNegative = change && change.includes('-');
    const TrendIcon = isNegative ? TrendingDown : TrendingUp;
    const trendColor = isNegative ? 'text-red-600' : 'text-green-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl ring-1 ring-gray-100 transition-all cursor-pointer border-t-4"
            style={{ borderColor: color.split('-')[1] }} // Use a subtle border color
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

// 2. Add Activity Modal (Same as original, but styled for coherence)
const AddActivityModal = React.memo(({ show, onClose, newActivity, setNewActivity, onSubmit }) => {
    if (!show) return null;

    const handleChange = (e) => {
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
                            placeholder="Activity Description (e.g., 'Reset password due to security alert')"
                            required
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:border-purple-500 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <input
                                type="text"
                                name="location"
                                value={newActivity.location}
                                onChange={handleChange}
                                placeholder="Location (e.g., London, UK)"
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

// 3. Activity Detail Modal (Enhanced with Flag/Comment features)
const ActivityDetailModal = React.memo(({ activity, onClose, onDelete, onToggleFlag, onAddComment, comments, newComment, setNewComment }) => {
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
                                <h4 className="font-bold mb-2 flex items-center"><Globe size={16} className="mr-2" /> Geo/Device</h4>
                                <p className="text-sm"><strong>Location:</strong> {activity.location}</p>
                                <p className="text-sm"><strong>Device:</strong> {activity.device}</p>
                                <p className="text-sm"><strong>Browser:</strong> {activity.device.split(' on ')[0]}</p>
                            </div>
                        </div>

                        {activity.details && Object.keys(activity.details).length > 0 && (
                            <div className="border rounded-xl p-4 bg-yellow-50">
                                <h4 className="font-bold mb-2 text-orange-700 flex items-center"><Eye size={16} className="mr-2" /> Additional Details</h4>
                                {Object.entries(activity.details).map(([key, value]) => (
                                    <p key={key} className="text-sm"><strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions and Comments */}
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
                                onClick={() => { if (window.confirm('Are you sure you want to delete this activity? This is permanent.')) { onDelete(activity.id); } }}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-xl font-semibold hover:bg-red-50 transition-all"
                            >
                                <Trash2 size={20} />
                                Delete Log
                            </button>
                        </div>

                        <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3 flex items-center"><MessageSquare size={20} className="mr-2" /> Audit Comments ({comments.length || 0})</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto p-2 border rounded-xl bg-gray-50">
                            {comments.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No audit comments yet. Add a note for your team.</p>
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
                                placeholder="Add an internal audit comment..."
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

// 4. Activity Row Item
const ActivityRow = React.memo(({ activity, isFlagged, onClick }) => {
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
                <p className="text-xs text-gray-500 truncate">{activity.description}</p>
            </div>

            <div className="hidden sm:flex flex-col items-start w-32 ml-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                    {activity.type}
                </span>
                <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)} text-white`}>
                    {activity.priority}
                </span>
            </div>

            <div className="hidden md:flex flex-col items-end w-40 ml-4">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin size={12} className="mr-1 text-purple-500" /> {activity.location}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                    <Clock3 size={12} className="mr-1" /> {formatTimeAgo(activity.timestamp)}
                </span>
            </div>

            <div className="ml-4">
                {isFlagged ? (
                    <Flag size={18} className="text-red-500" title="Flagged for Review" />
                ) : (
                    <Eye size={18} className="text-gray-400 hover:text-blue-500" title="View Details" />
                )}
            </div>
        </motion.div>
    );
});

// 5. Notification Toast
const NotificationToast = ({ notification, onDismiss }) => {
    const Icon = notification.type === 'success' ? CheckCircle : notification.type === 'warning' ? AlertCircle : Info;
    const color = notification.type === 'success' ? 'bg-green-500' : notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`flex items-center ${color} text-white text-sm font-bold px-4 py-3 rounded-xl shadow-lg mb-2`}
        >
            <Icon size={20} className="mr-2" />
            <span>{notification.message}</span>
            <button onClick={() => onDismiss(notification.id)} className="ml-4 opacity-75 hover:opacity-100 transition-opacity">
                <XCircle size={18} />
            </button>
        </motion.div>
    );
};

// --- Main Component ---
const UserActivity = () => {
    // State management using the custom hook
    const { 
        data: activityData, 
        isLoading, 
        saveData, 
        refreshData 
    } = useActivityStorage('user-activities-uk', initialDataFactory);

    const activities = activityData?.activities || [];
    const stats = activityData?.stats || getDefaultStats();
    const flaggedActivities = activityData?.flagged || new Set();
    const comments = activityData?.comments || {};
    const notifications = activityData?.notifications || [];

    // Local UI State
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300); 
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [dateRange, setDateRange] = useState('today'); 
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [newComment, setNewComment] = useState('');

    const [newActivity, setNewActivity] = useState({
        userName: '', userEmail: '', action: 'logged_in', type: 'authentication',
        description: '', location: 'London, UK', device: 'Chrome on Windows', priority: 'normal'
    });
    
    // --- Data Handlers (Enhanced) ---

    // Function to generate a realistic mock activity
    const generateMockActivity = useCallback(() => {
        const users = [
            { name: 'Chloe Davies', email: 'chloe.d@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Aiden Taylor', email: 'aiden.t@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=13' },
            { name: 'Bethany White', email: 'bethany.w@slbrothers.co.uk', avatar: 'https://i.pravatar.cc/150?img=15' }
        ];

        const actions = [
            { action: 'logged_in', type: 'authentication', description: 'Successful login', details: { method: 'Standard', country: 'UK' }, priority: 'low' },
            { action: 'created_order', type: 'transaction', description: 'Order completed', details: { amount: '£' + (Math.floor(Math.random() * 200) + 10).toFixed(2) }, priority: 'normal' },
            { action: 'security_alert', type: 'security', description: 'Failed login attempt', details: { threat: 'IP Blacklisted' }, priority: 'high' },
            { action: 'system_error', type: 'system', description: 'Database timeout error', details: { service: 'DB_Prod_UK', code: '504' }, priority: 'critical' },
            { action: 'downloaded_data', type: 'content', description: 'Bulk customer list download', details: { count: 500, type: 'CSV' }, priority: 'high' }
        ];

        const user = users[Math.floor(Math.random() * users.length)];
        const actionData = actions[Math.floor(Math.random() * actions.length)]; 
        const location = UK_LOCATIONS[Math.floor(Math.random() * UK_LOCATIONS.length)];
        const ip = `82.12.1.${Math.floor(Math.random() * 255)}`;

        return {
            id: Date.now(),
            user: user,
            ...actionData,
            timestamp: new Date().toISOString(),
            ip: ip,
            location: `${location}, UK`,
            device: 'Chrome on Windows',
            priority: actionData.priority
        };
    }, []);

    const addNotification = useCallback((message, type) => {
        const notification = { id: Date.now(), message, type, timestamp: new Date().toISOString() };
        // Limit notifications to 10
        const newNotifications = [notification, ...notifications.slice(0, 9)]; 
        saveData({ notifications: newNotifications });
    }, [notifications, saveData]);

    const handleNewActivity = useCallback(async (activity) => {
        const updatedActivities = [activity, ...activities];
        const updatedStats = { ...stats, actionsToday: stats.actionsToday + 1 };

        // Auto-flag critical/high activities and security events
        const isSuspicious = activity.priority === 'critical' || activity.priority === 'high' || activity.type === 'security';
        const newFlagged = new Set(flaggedActivities);
        if (isSuspicious) {
            newFlagged.add(activity.id);
            addNotification(`CRITICAL: ${activity.description} from ${activity.user.name}`, 'critical');
            updatedStats.flaggedIncidents = updatedStats.flaggedIncidents + 1;
        }

        await saveData({ 
            activities: updatedActivities, 
            stats: updatedStats,
            flagged: newFlagged
        });

    }, [activities, stats, flaggedActivities, saveData, addNotification]);

    // --- Mock Real-Time Event Injection (NEW FUNCTIONALITY) ---
    useEffect(() => {
        // Simulates a new activity event every 2-5 seconds
        const intervalId = setInterval(() => {
            if (!isLoading) {
                const mockActivity = generateMockActivity();
                handleNewActivity(mockActivity);
            }
        }, Math.random() * 3000 + 2000); // Between 2 and 5 seconds

        return () => clearInterval(intervalId);
    }, [isLoading, handleNewActivity, generateMockActivity]);


    const addActivity = useCallback(() => {
        const activity = {
            id: Date.now(),
            user: { name: newActivity.userName, email: newActivity.userEmail, avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}` },
            action: newActivity.action, type: newActivity.type, description: newActivity.description,
            timestamp: new Date().toISOString(), ip: `82.12.1.${Math.floor(Math.random() * 255)}`,
            location: newActivity.location, device: newActivity.device, priority: newActivity.priority,
            details: { manual: true }
        };

        handleNewActivity(activity); // Use the new handler
        
        setShowAddModal(false);
        setNewActivity({ // Reset form data
            userName: '', userEmail: '', action: 'logged_in', type: 'authentication',
            description: '', location: 'London, UK', device: 'Chrome on Windows', priority: 'normal'
        });
        addNotification(`New activity (Manual) added: ${activity.description}`, 'info');
    }, [newActivity, handleNewActivity, addNotification]);

    const deleteActivity = useCallback(async (activityId) => {
        const updatedActivities = activities.filter(a => a.id !== activityId);
        const newFlagged = new Set(flaggedActivities);
        const updatedStats = { ...stats };
        
        if (newFlagged.has(activityId)) {
            newFlagged.delete(activityId);
            updatedStats.flaggedIncidents = Math.max(0, updatedStats.flaggedIncidents - 1);
        }

        const updatedComments = { ...comments };
        delete updatedComments[activityId];

        await saveData({ activities: updatedActivities, flagged: newFlagged, comments: updatedComments, stats: updatedStats });
        setSelectedActivity(null);
        addNotification('Activity log deleted successfully', 'info');
    }, [activities, flaggedActivities, comments, stats, saveData, addNotification]);

    const toggleFlag = useCallback(async (activityId) => {
        const newFlagged = new Set(flaggedActivities);
        const updatedStats = { ...stats };
        
        if (newFlagged.has(activityId)) {
            newFlagged.delete(activityId);
            updatedStats.flaggedIncidents = Math.max(0, updatedStats.flaggedIncidents - 1);
            addNotification('Activity unflagged', 'info');
        } else {
            newFlagged.add(activityId);
            updatedStats.flaggedIncidents = updatedStats.flaggedIncidents + 1;
            addNotification('Activity flagged for immediate review', 'warning');
        }
        await saveData({ flagged: newFlagged, stats: updatedStats });
        // Update selected activity if it's the one being viewed
        setSelectedActivity(prev => prev && prev.id === activityId ? { ...prev, isFlagged: newFlagged.has(activityId) } : prev);
    }, [flaggedActivities, stats, saveData, addNotification]);

    const addCommentToActivity = useCallback(async (activityId) => {
        if (!newComment.trim()) return;
        
        const updatedComments = {
            ...comments,
            [activityId]: [
                ...(comments[activityId] || []),
                {
                    id: Date.now(),
                    text: newComment,
                    timestamp: new Date().toISOString(),
                    author: 'Admin'
                }
            ]
        };
        
        await saveData({ comments: updatedComments });
        setNewComment('');
        addNotification('Audit comment added', 'success');
        // Update selected activity to show new comment immediately
        setSelectedActivity(prev => prev && prev.id === activityId ? { ...prev, comments: updatedComments[activityId] } : prev);
    }, [comments, newComment, saveData, addNotification]);
    
    const clearNotifications = useCallback(() => {
        saveData({ notifications: [] });
        setShowNotifications(false);
    }, [saveData]);

    const handleActivitySelect = useCallback((activity) => {
        setSelectedActivity({
            ...activity,
            isFlagged: flaggedActivities.has(activity.id),
            comments: comments[activity.id] || []
        });
        setNewComment(''); // Clear comment input when opening detail
    }, [flaggedActivities, comments]);

    // --- Export Function ---
    const exportData = useCallback((format) => {
        // ... (The original exportData logic remains the same)
        const dataToExport = {
            activities,
            stats,
            flagged: Array.from(flaggedActivities),
            comments,
            exportDate: new Date().toISOString()
        };

        if (format === 'json') {
            const dataStr = JSON.stringify(dataToExport, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `slbrothers-audit-log-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            addNotification('JSON audit log exported', 'success');
        } else if (format === 'csv') {
            const headers = ['ID', 'User', 'Email', 'Action', 'Type', 'Description', 'Timestamp', 'Location', 'Device', 'IP', 'Priority', 'Is_Flagged'];
            const rows = activities.map(a => [
                a.id, a.user.name, a.user.email, a.action, a.type, `"${a.description.replace(/"/g, '""')}"`, // Handle quotes in description
                new Date(a.timestamp).toLocaleString('en-GB'), a.location, a.device, a.ip, a.priority, flaggedActivities.has(a.id) ? 'YES' : 'NO'
            ]);
            
            const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `slbrothers-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            addNotification('CSV audit log exported', 'success');
        }
    }, [activities, stats, flaggedActivities, comments, addNotification]);

    // --- Filtering Logic (Memoized for performance) ---

    const filteredActivities = useMemo(() => {
        return activities.filter(activity => {
            const searchLower = debouncedSearchQuery.toLowerCase();
            const matchesSearch = 
                activity.user.name.toLowerCase().includes(searchLower) ||
                activity.description.toLowerCase().includes(searchLower) ||
                activity.user.email.toLowerCase().includes(searchLower) ||
                activity.ip.includes(searchLower) ||
                activity.location.toLowerCase().includes(searchLower);

            const matchesType = filterType === 'all' || activity.type === filterType;
            const matchesPriority = filterPriority === 'all' || activity.priority === filterPriority;
            
            const activityDate = new Date(activity.timestamp);
            const now = new Date();
            let matchesDate = true;

            if (dateRange !== 'all') {
                const oneDay = 24 * 60 * 60 * 1000;
                let boundary = new Date();
                
                if (dateRange === 'today') {
                    boundary.setHours(0, 0, 0, 0);
                    matchesDate = activityDate >= boundary;
                } else if (dateRange === 'last7') {
                    boundary = new Date(now.getTime() - 7 * oneDay);
                    matchesDate = activityDate >= boundary;
                } else if (dateRange === 'last30') {
                    boundary = new Date(now.getTime() - 30 * oneDay);
                    matchesDate = activityDate >= boundary;
                } else if (dateRange === 'flagged') { // New dedicated filter for flagged
                    matchesDate = flaggedActivities.has(activity.id);
                }
            }
            
            if (dateRange === 'flagged') {
                 // Overrides other filters for a pure "flagged" list
                 return flaggedActivities.has(activity.id);
            }

            return matchesSearch && matchesType && matchesPriority && matchesDate;
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [activities, debouncedSearchQuery, filterType, filterPriority, dateRange, flaggedActivities]);

    // --- Stats Data Structure for Cards (Enhanced) ---
    const statCards = useMemo(() => [
        { 
            label: 'Active Users (UK)', 
            value: stats.activeUsers.toLocaleString(), 
            icon: Users, 
            color: 'bg-blue-500', 
            change: '+5%' 
        },
        { 
            label: 'Actions Today', 
            value: stats.actionsToday.toLocaleString(), 
            icon: Zap, 
            color: 'bg-green-500', 
            change: '+12%' 
        },
        { 
            label: 'Flagged Incidents', 
            value: stats.flaggedIncidents.toLocaleString(), 
            icon: Flag, 
            color: 'bg-red-500', 
            change: '+2', // Absolute change for incidents
            isNegative: true 
        },
        { 
            label: 'Avg. Order Value (GBP)', 
            value: '£' + (Math.random() * 100 + 50).toFixed(2), // Mock AOV for real-time feel
            icon: CreditCard, 
            color: 'bg-purple-500', 
            change: '-1.5%' 
        },
    ], [stats]);

    // --- Simple Analytics Data (for the new view) ---
    const analyticsData = useMemo(() => {
        const typeCounts = activities.reduce((acc, a) => {
            acc[a.type] = (acc[a.type] || 0) + 1;
            return acc;
        }, {});

        const locationCounts = activities.filter(a => a.location).reduce((acc, a) => {
            const city = a.location.split(',')[0].trim();
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});
        
        return { typeCounts, locationCounts };
    }, [activities]);

    // --- JSX Rendering ---

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-purple-600" size={48} />
                <p className="ml-3 text-lg text-gray-700">Loading UK Audit Logs...</p>
            </div>
        );
    }

    // Main Dashboard Layout
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            {/* Notification Toasts Area */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <NotificationToast 
                            key={n.id} 
                            notification={n} 
                            onDismiss={() => saveData({ notifications: notifications.filter(not => not.id !== n.id) })}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Header and Controls */}
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                    <Shield className="mr-3 text-purple-600" size={32} />
                    UK Startup Audit & Real-Time Monitor
                </h1>
                <div className="flex items-center space-x-4">
                    <motion.button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-3 bg-white rounded-xl shadow-lg hover:bg-gray-100 relative"
                        whileTap={{ scale: 0.95 }}
                    >
                        <Bell size={24} className="text-gray-600" />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
                        )}
                    </motion.button>
                    <motion.button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:bg-purple-700 transition-all"
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={20} className="mr-2" /> Add Log
                    </motion.button>
                </div>
            </header>
            
            {/* Notification Dropdown (New Feature) */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-4 mb-8 ring-1 ring-gray-100 max-w-md ml-auto"
                    >
                        <div className="flex justify-between items-center mb-3 border-b pb-2">
                            <h3 className="font-bold text-lg text-gray-800">System Notifications ({notifications.length})</h3>
                            <button onClick={clearNotifications} className="text-xs text-blue-500 hover:text-blue-700">Clear All</button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No new notifications.</p>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} className={`p-2 rounded-lg text-sm ${n.type === 'critical' ? 'bg-red-100' : n.type === 'warning' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                                        <p className="font-medium text-gray-800">{n.message}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(n.timestamp)}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Stats Dashboard */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Key Metrics Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <StatCard key={index} stat={stat} index={index} {...stat} />
                    ))}
                </div>
            </section>

            {/* Main Content Area: Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setShowAnalytics(false)}
                    className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-all ${!showAnalytics ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Activity size={20} className="inline mr-2" /> Real-Time Audit Log
                </button>
                <button
                    onClick={() => setShowAnalytics(true)}
                    className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-all ${showAnalytics ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <BarChart3 size={20} className="inline mr-2" /> Security Analytics
                </button>
            </div>
            
            <AnimatePresence mode="wait">
                {showAnalytics ? (
                    /* --- Analytics View (NEW FUNCTIONALITY) --- */
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl ring-1 ring-gray-100"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <BarChart3 className="mr-2 text-purple-600" /> Key Security & Activity Insights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-4 border rounded-xl shadow-sm">
                                <h3 className="text-xl font-semibold mb-3">Activity Type Distribution</h3>
                                <div className="space-y-2">
                                    {Object.entries(analyticsData.typeCounts).map(([type, count]) => (
                                        <div key={type} className="flex justify-between items-center text-sm">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(type)}`}>
                                                {type.toUpperCase()}
                                            </span>
                                            <span className="font-bold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 border rounded-xl shadow-sm">
                                <h3 className="text-xl font-semibold mb-3">Top UK Locations</h3>
                                <div className="space-y-2">
                                    {Object.entries(analyticsData.locationCounts)
                                        .sort(([, countA], [, countB]) => countB - countA)
                                        .slice(0, 5)
                                        .map(([location, count]) => (
                                            <div key={location} className="flex justify-between items-center text-sm">
                                                <span className="flex items-center text-gray-700"><MapPin size={16} className="mr-2 text-red-400" /> {location}</span>
                                                <span className="font-bold">{count}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-3">Security Summary</h3>
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-sm font-medium text-gray-800">
                                    <span className="font-bold text-red-600">{stats.flaggedIncidents} </span> 
                                    suspicious or high-priority events are currently flagged for review. 
                                    Prioritise review of **Security** and **System** logs.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                ) : (
                    /* --- Audit Log View --- */
                    <motion.div
                        key="audit-log"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Filters and Search (Enhanced) */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl ring-1 ring-gray-100 mb-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center space-x-3 w-full md:w-auto order-1 md:order-1">
                                    <Search size={20} className="text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search User, Email, IP, or Description..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="py-2 focus:outline-none w-full md:w-64 border-b border-gray-200 focus:border-purple-500 transition-colors"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-3 order-3 md:order-2 w-full md:w-auto">
                                    {/* Type Filter */}
                                    <div className="relative">
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="px-4 py-2 border rounded-xl bg-gray-50 appearance-none text-sm font-medium pr-8"
                                        >
                                            <option value="all">All Types</option>
                                            {Object.keys(getTypeColor({})).map(type => (
                                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>
                                    
                                    {/* Priority Filter */}
                                    <div className="relative">
                                        <select
                                            value={filterPriority}
                                            onChange={(e) => setFilterPriority(e.target.value)}
                                            className="px-4 py-2 border rounded-xl bg-gray-50 appearance-none text-sm font-medium pr-8"
                                        >
                                            <option value="all">All Priorities</option>
                                            {['critical', 'high', 'normal', 'low'].map(p => (
                                                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>

                                    {/* Date/Flagged Filter (Enhanced) */}
                                    <div className="relative">
                                        <select
                                            value={dateRange}
                                            onChange={(e) => setDateRange(e.target.value)}
                                            className="px-4 py-2 border rounded-xl bg-gray-50 appearance-none text-sm font-medium pr-8"
                                        >
                                            <option value="today">Today</option>
                                            <option value="last7">Last 7 Days</option>
                                            <option value="last30">Last 30 Days</option>
                                            <option value="all">All Time</option>
                                            <option value="flagged">Flagged Only ({flaggedActivities.size})</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Export & Refresh Buttons */}
                                <div className="flex space-x-3 order-2 md:order-3 w-full md:w-auto justify-end">
                                    <motion.button 
                                        onClick={refreshData}
                                        className="p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-100"
                                        whileTap={{ scale: 0.95 }}
                                        title="Refresh Data"
                                    >
                                        <RefreshCw size={20} className="text-blue-500" />
                                    </motion.button>
                                    <motion.button 
                                        onClick={() => exportData('csv')}
                                        className="flex items-center p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-100 text-sm font-medium text-gray-700"
                                        whileTap={{ scale: 0.95 }}
                                        title="Export as CSV"
                                    >
                                        <FileDown size={20} className="text-green-500 mr-1" /> Export
                                    </motion.button>
                                </div>
                            </div>
                        </div>


                        {/* Activity List */}
                        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b font-bold text-gray-700 hidden sm:flex">
                                <span className="w-14 mr-4"></span> {/* Icon placeholder */}
                                <span className="flex-1">User & Activity</span>
                                <span className="w-32 ml-4">Type/Priority</span>
                                <span className="w-40 ml-4 text-right">Location/Time</span>
                                <span className="w-10 ml-4"></span> {/* Flag placeholder */}
                            </div>
                            
                            <AnimatePresence initial={false}>
                                {filteredActivities.length > 0 ? (
                                    filteredActivities.map((activity) => (
                                        <ActivityRow
                                            key={activity.id}
                                            activity={activity}
                                            isFlagged={flaggedActivities.has(activity.id)}
                                            onClick={handleActivitySelect}
                                        />
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-gray-500">
                                        <AlertCircle size={32} className="mx-auto text-yellow-500 mb-3" />
                                        <p className="font-semibold">No activities found matching your filters.</p>
                                        <p className="text-sm">Try clearing your search or changing the date range.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
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
                onAddComment={addCommentToActivity}
                comments={selectedActivity?.comments || []}
                newComment={newComment}
                setNewComment={setNewComment}
            />
        </div>
    );
};

export default UserActivity;