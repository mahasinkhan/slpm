import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Users,
  Database,
  Settings,
  Key,
  Terminal,
  FileText,
  Clock,
  Calendar,
  User,
  Activity,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react'

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [selectedLog, setSelectedLog] = useState(null)

  // Mock audit log data (in production, fetch from database)
  const auditLogs = [
    {
      id: 1,
      timestamp: '2025-11-11 14:23:45',
      type: 'authentication',
      severity: 'high',
      action: 'Failed Login Attempt',
      user: 'admin@slbrothers.co.uk',
      userId: 'U-1234',
      ip: '192.168.1.100',
      location: 'London, UK',
      device: 'Chrome on Windows',
      details: 'Invalid password entered (3rd attempt)',
      status: 'blocked'
    },
    {
      id: 2,
      timestamp: '2025-11-11 14:20:12',
      type: 'permission',
      severity: 'critical',
      action: 'Permission Escalation',
      user: 'john.smith@slbrothers.co.uk',
      userId: 'U-5678',
      ip: '192.168.1.105',
      location: 'Manchester, UK',
      device: 'Firefox on Mac',
      details: 'User granted SUPERADMIN role by SuperAdmin',
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2025-11-11 14:15:33',
      type: 'data',
      severity: 'medium',
      action: 'Database Query',
      user: 'system',
      userId: 'SYSTEM',
      ip: '127.0.0.1',
      location: 'Server',
      device: 'Internal',
      details: 'Bulk export of user data (250 records)',
      status: 'success'
    },
    {
      id: 4,
      timestamp: '2025-11-11 14:10:28',
      type: 'system',
      severity: 'low',
      action: 'Configuration Change',
      user: 'admin@slbrothers.co.uk',
      userId: 'U-1234',
      ip: '192.168.1.100',
      location: 'London, UK',
      device: 'Chrome on Windows',
      details: 'Updated system timeout settings from 30m to 60m',
      status: 'success'
    },
    {
      id: 5,
      timestamp: '2025-11-11 14:05:19',
      type: 'access',
      severity: 'medium',
      action: 'Unauthorized Access Attempt',
      user: 'unknown',
      userId: 'N/A',
      ip: '45.33.22.11',
      location: 'Unknown',
      device: 'Bot/Crawler',
      details: 'Attempted to access /admin/users without authentication',
      status: 'blocked'
    },
    {
      id: 6,
      timestamp: '2025-11-11 14:00:45',
      type: 'authentication',
      severity: 'low',
      action: 'Successful Login',
      user: 'sarah.johnson@slbrothers.co.uk',
      userId: 'U-9012',
      ip: '192.168.1.110',
      location: 'Birmingham, UK',
      device: 'Safari on iPhone',
      details: 'User logged in successfully with 2FA',
      status: 'success'
    },
    {
      id: 7,
      timestamp: '2025-11-11 13:55:22',
      type: 'data',
      severity: 'critical',
      action: 'Data Deletion',
      user: 'admin@slbrothers.co.uk',
      userId: 'U-1234',
      ip: '192.168.1.100',
      location: 'London, UK',
      device: 'Chrome on Windows',
      details: 'Permanently deleted 5 user accounts',
      status: 'success'
    },
    {
      id: 8,
      timestamp: '2025-11-11 13:50:11',
      type: 'api',
      severity: 'medium',
      action: 'API Rate Limit Exceeded',
      user: 'api_client_123',
      userId: 'API-123',
      ip: '203.0.113.5',
      location: 'External',
      device: 'API Client',
      details: 'Rate limit exceeded: 1000 requests in 5 minutes',
      status: 'blocked'
    }
  ]

  const stats = [
    {
      label: 'Total Events',
      value: '12,450',
      change: '+234',
      icon: Activity,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Critical Alerts',
      value: '23',
      change: '+5',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600'
    },
    {
      label: 'Failed Logins',
      value: '156',
      change: '-12',
      icon: XCircle,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Blocked IPs',
      value: '48',
      change: '+8',
      icon: Shield,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || log.type === filterType
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity
    return matchesSearch && matchesType && matchesSeverity
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'authentication': return Lock
      case 'permission': return Key
      case 'data': return Database
      case 'system': return Settings
      case 'access': return Shield
      case 'api': return Terminal
      default: return FileText
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-green-600" size={20} />
      case 'blocked': return <XCircle className="text-red-600" size={20} />
      case 'failed': return <AlertCircle className="text-orange-600" size={20} />
      default: return <Info className="text-blue-600" size={20} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 flex items-center">
              <Shield className="mr-3 text-red-600" size={36} />
              Audit Logs
            </h1>
            <p className="text-gray-600">Complete system activity tracking and security monitoring</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              <RefreshCw size={20} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-sm font-bold text-green-600">
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="authentication">Authentication</option>
            <option value="permission">Permission</option>
            <option value="data">Data</option>
            <option value="system">System</option>
            <option value="access">Access</option>
            <option value="api">API</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center space-x-2 mt-4">
          <Calendar size={20} className="text-gray-600" />
          <div className="flex space-x-2">
            {['today', '7days', '30days', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Audit Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredLogs.map((log, index) => {
                  const TypeIcon = getTypeIcon(log.type)
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-gray-900 font-medium">{log.timestamp}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <TypeIcon size={18} className="text-blue-600" />
                          <span className="text-sm font-medium text-gray-900 capitalize">{log.type}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-sm">{log.action}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{log.details}</p>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{log.user}</p>
                          <p className="text-xs text-gray-500">{log.ip} â€¢ {log.location}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusIcon(log.status)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold">No audit logs found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {auditLogs.length} logs
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLog(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Log ID</p>
                    <p className="font-bold text-gray-900">#{selectedLog.id}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Timestamp</p>
                    <p className="font-bold text-gray-900">{selectedLog.timestamp}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Type</p>
                    <p className="font-bold text-gray-900 capitalize">{selectedLog.type}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Severity</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-blue-900 font-semibold mb-2">Action</p>
                  <p className="text-blue-800 font-bold text-lg">{selectedLog.action}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Details</p>
                  <p className="text-gray-900">{selectedLog.details}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">User</p>
                    <p className="font-bold text-gray-900">{selectedLog.user}</p>
                    <p className="text-xs text-gray-500">{selectedLog.userId}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">IP Address</p>
                    <p className="font-bold text-gray-900">{selectedLog.ip}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-bold text-gray-900">{selectedLog.location}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Device</p>
                    <p className="font-bold text-gray-900">{selectedLog.device}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                    Export Details
                  </button>
                  <button className="flex-1 border-2 border-red-600 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50">
                    Flag as Suspicious
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuditLogs