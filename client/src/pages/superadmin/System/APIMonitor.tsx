import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Code,
  Terminal,
  Globe,
  Shield,
  Key,
  BarChart3,
  Eye,
  Server
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const APIMonitor = () => {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [timeRange, setTimeRange] = useState('1h')
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)

  // Real-time API metrics
  const [apiMetrics, setApiMetrics] = useState({
    totalRequests: 125847,
    successRate: 99.2,
    avgResponseTime: 245,
    errorsCount: 1006,
    activeConnections: 342,
    throughput: 1250
  })

  // Simulate real-time updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setApiMetrics(prev => ({
          totalRequests: prev.totalRequests + Math.floor(Math.random() * 100 + 50),
          successRate: Math.max(95, Math.min(100, prev.successRate + (Math.random() * 0.2 - 0.1))),
          avgResponseTime: Math.max(50, Math.min(500, prev.avgResponseTime + Math.floor(Math.random() * 40 - 20))),
          errorsCount: prev.errorsCount + Math.floor(Math.random() * 5),
          activeConnections: Math.max(100, Math.min(500, prev.activeConnections + Math.floor(Math.random() * 20 - 10))),
          throughput: Math.max(500, Math.min(2000, prev.throughput + Math.floor(Math.random() * 100 - 50)))
        }))
        setLastUpdated(new Date())
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Response time data
  const responseTimeData = [
    { time: '00:00', api: 180, auth: 45, database: 120 },
    { time: '00:10', api: 220, auth: 52, database: 145 },
    { time: '00:20', api: 195, auth: 48, database: 132 },
    { time: '00:30', api: 245, auth: 56, database: 168 },
    { time: '00:40', api: 210, auth: 50, database: 142 },
    { time: '00:50', api: 235, auth: 54, database: 158 }
  ]

  // Request volume data
  const requestVolumeData = [
    { time: '00:00', requests: 1200, errors: 12 },
    { time: '00:10', requests: 1350, errors: 15 },
    { time: '00:20', requests: 1180, errors: 10 },
    { time: '00:30', requests: 1450, errors: 18 },
    { time: '00:40', requests: 1320, errors: 14 },
    { time: '00:50', requests: 1520, errors: 16 }
  ]

  // API Endpoints
  const endpoints = [
    {
      path: '/api/v1/users',
      method: 'GET',
      status: 'healthy',
      requests: 45230,
      avgResponseTime: 185,
      successRate: 99.8,
      errors: 90,
      lastError: '2 hours ago'
    },
    {
      path: '/api/v1/auth/login',
      method: 'POST',
      status: 'healthy',
      requests: 28450,
      avgResponseTime: 142,
      successRate: 99.5,
      errors: 142,
      lastError: '30 mins ago'
    },
    {
      path: '/api/v1/products',
      method: 'GET',
      status: 'healthy',
      requests: 38920,
      avgResponseTime: 220,
      successRate: 99.9,
      errors: 39,
      lastError: '4 hours ago'
    },
    {
      path: '/api/v1/orders',
      method: 'POST',
      status: 'warning',
      requests: 15680,
      avgResponseTime: 450,
      successRate: 97.2,
      errors: 439,
      lastError: '5 mins ago'
    },
    {
      path: '/api/v1/payments',
      method: 'POST',
      status: 'healthy',
      requests: 12340,
      avgResponseTime: 380,
      successRate: 99.7,
      errors: 37,
      lastError: '1 hour ago'
    },
    {
      path: '/api/v1/analytics',
      method: 'GET',
      status: 'healthy',
      requests: 9870,
      avgResponseTime: 520,
      successRate: 98.9,
      errors: 109,
      lastError: '15 mins ago'
    }
  ]

  // Recent errors
  const recentErrors = [
    {
      id: 1,
      endpoint: '/api/v1/orders',
      method: 'POST',
      statusCode: 500,
      message: 'Internal Server Error: Database connection timeout',
      timestamp: '2 mins ago',
      count: 3
    },
    {
      id: 2,
      endpoint: '/api/v1/auth/login',
      method: 'POST',
      statusCode: 401,
      message: 'Unauthorized: Invalid credentials',
      timestamp: '5 mins ago',
      count: 8
    },
    {
      id: 3,
      endpoint: '/api/v1/products',
      method: 'GET',
      statusCode: 404,
      message: 'Not Found: Product ID does not exist',
      timestamp: '12 mins ago',
      count: 2
    },
    {
      id: 4,
      endpoint: '/api/v1/users',
      method: 'PUT',
      statusCode: 422,
      message: 'Unprocessable Entity: Invalid email format',
      timestamp: '18 mins ago',
      count: 5
    }
  ]

  // Top consumers
  const topConsumers = [
    { client: 'Mobile App v2.3', requests: 45230, percentage: 36 },
    { client: 'Web Dashboard', requests: 32180, percentage: 26 },
    { client: 'Partner Integration', requests: 25640, percentage: 20 },
    { client: 'Admin Portal', requests: 15890, percentage: 13 },
    { client: 'Third-party API', requests: 6907, percentage: 5 }
  ]

  const stats = [
    {
      label: 'Total Requests',
      value: (apiMetrics.totalRequests / 1000).toFixed(1) + 'K',
      change: '+12.5%',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      label: 'Success Rate',
      value: apiMetrics.successRate.toFixed(1) + '%',
      change: '+0.2%',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: 'up'
    },
    {
      label: 'Avg Response',
      value: apiMetrics.avgResponseTime + 'ms',
      change: '-15ms',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      trend: 'down'
    },
    {
      label: 'Active Connections',
      value: apiMetrics.activeConnections,
      change: '+8',
      icon: Globe,
      color: 'from-orange-500 to-orange-600',
      trend: 'up'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700 border-green-300'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'critical': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="text-green-600" size={20} />
      case 'warning': return <AlertTriangle className="text-yellow-600" size={20} />
      case 'critical': return <XCircle className="text-red-600" size={20} />
      default: return <Activity className="text-gray-600" size={20} />
    }
  }

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-700'
      case 'POST': return 'bg-green-100 text-green-700'
      case 'PUT': return 'bg-orange-100 text-orange-700'
      case 'DELETE': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
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
              <Terminal className="mr-3 text-purple-600" size={36} />
              API Monitor
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock size={16} />
              <span className="text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <RefreshCw size={20} className={autoRefresh ? 'animate-spin' : ''} />
              <span>{autoRefresh ? 'Live' : 'Paused'}</span>
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-blue-500 focus:outline-none"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
            <button className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50">
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="absolute top-3 right-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div className={`flex items-center space-x-1 text-xs sm:text-sm font-bold ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{stat.change}</span>
              </div>
            </div>

            <motion.h3
              key={stat.value}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-2xl sm:text-3xl font-black text-gray-900 mb-1"
            >
              {stat.value}
            </motion.h3>
            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Response Time Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="mr-2 text-purple-600" size={24} />
            Response Times
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="api" stroke="#8b5cf6" strokeWidth={2} name="API" />
                <Line type="monotone" dataKey="auth" stroke="#3b82f6" strokeWidth={2} name="Auth" />
                <Line type="monotone" dataKey="database" stroke="#10b981" strokeWidth={2} name="Database" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Request Volume Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="mr-2 text-blue-600" size={24} />
            Request Volume
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Requests" />
                <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Errors" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* API Endpoints Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Code className="mr-2 text-green-600" size={28} />
          API Endpoints
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Endpoint</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Requests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Avg Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Success Rate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {endpoints.map((endpoint, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{endpoint.path}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(endpoint.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(endpoint.status)}`}>
                        {endpoint.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{endpoint.requests.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{endpoint.avgResponseTime}ms</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${
                      endpoint.successRate >= 99 ? 'text-green-600' :
                      endpoint.successRate >= 97 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {endpoint.successRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Errors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <XCircle className="mr-2 text-red-600" size={24} />
            Recent Errors
          </h2>
          <div className="space-y-3">
            {recentErrors.map((error, idx) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(error.method)}`}>
                      {error.method}
                    </span>
                    <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold">
                      {error.statusCode}
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-bold">
                      Ã—{error.count}
                    </span>
                  </div>
                  <span className="text-xs text-red-600">{error.timestamp}</span>
                </div>
                <p className="font-mono text-xs text-red-800 mb-1">{error.endpoint}</p>
                <p className="text-sm text-red-700">{error.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Consumers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Key className="mr-2 text-orange-600" size={24} />
            Top API Consumers
          </h2>
          <div className="space-y-4">
            {topConsumers.map((consumer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{consumer.client}</span>
                  <span className="text-sm font-bold text-gray-900">{consumer.requests.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${consumer.percentage}%` }}
                    transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Endpoint Detail Modal */}
      <AnimatePresence>
        {selectedEndpoint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEndpoint(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Endpoint Details</h2>
                  <p className="font-mono text-sm text-gray-600">{selectedEndpoint.path}</p>
                </div>
                <button
                  onClick={() => setSelectedEndpoint(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-700 mb-1">Total Requests</p>
                  <p className="text-2xl font-black text-blue-900">{selectedEndpoint.requests.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700 mb-1">Success Rate</p>
                  <p className="text-2xl font-black text-green-900">{selectedEndpoint.successRate}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-700 mb-1">Avg Response</p>
                  <p className="text-2xl font-black text-purple-900">{selectedEndpoint.avgResponseTime}ms</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl">
                  <p className="text-sm text-red-700 mb-1">Errors</p>
                  <p className="text-2xl font-black text-red-900">{selectedEndpoint.errors}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEndpoint(null)}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default APIMonitor