import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
  PieChart,
  Cloud,
  Shield,
  Globe,
  Terminal
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts'

const SystemMetrics = () => {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedMetric, setSelectedMetric] = useState('all')

  // System metrics state
  const [metrics, setMetrics] = useState({
    cpu: 68,
    memory: 78,
    disk: 45,
    network: 62,
    latency: 24,
    uptime: 99.98
  })

  // Simulate real-time metric updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          cpu: Math.max(10, Math.min(100, prev.cpu + Math.random() * 10 - 5)),
          memory: Math.max(20, Math.min(100, prev.memory + Math.random() * 8 - 4)),
          disk: Math.max(30, Math.min(100, prev.disk + Math.random() * 2 - 1)),
          network: Math.max(5, Math.min(100, prev.network + Math.random() * 15 - 7)),
          latency: Math.max(5, Math.min(100, prev.latency + Math.random() * 8 - 4)),
          uptime: Math.max(95, Math.min(100, prev.uptime + Math.random() * 0.01 - 0.005))
        }))
        setLastUpdated(new Date())
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Historical data for charts
  const [cpuHistory] = useState([
    { time: '00:00', value: 45 },
    { time: '00:15', value: 52 },
    { time: '00:30', value: 48 },
    { time: '00:45', value: 61 },
    { time: '01:00', value: 55 },
    { time: '01:15', value: 67 },
    { time: '01:30', value: 62 },
    { time: '01:45', value: 58 },
    { time: '02:00', value: 68 }
  ])

  const [memoryHistory] = useState([
    { time: '00:00', value: 65 },
    { time: '00:15', value: 68 },
    { time: '00:30', value: 71 },
    { time: '00:45', value: 73 },
    { time: '01:00', value: 75 },
    { time: '01:15', value: 77 },
    { time: '01:30', value: 76 },
    { time: '01:45', value: 79 },
    { time: '02:00', value: 78 }
  ])

  // Server instances
  const servers = [
    {
      id: 'SRV-01',
      name: 'Web Server 1',
      status: 'operational',
      cpu: 45,
      memory: 62,
      uptime: 99.9,
      location: 'London',
      requests: '12.5K/min'
    },
    {
      id: 'SRV-02',
      name: 'Web Server 2',
      status: 'operational',
      cpu: 52,
      memory: 68,
      uptime: 99.8,
      location: 'Manchester',
      requests: '11.2K/min'
    },
    {
      id: 'SRV-03',
      name: 'API Server',
      status: 'warning',
      cpu: 78,
      memory: 85,
      uptime: 98.5,
      location: 'Birmingham',
      requests: '8.9K/min'
    },
    {
      id: 'SRV-04',
      name: 'Database Server',
      status: 'operational',
      cpu: 34,
      memory: 72,
      uptime: 99.99,
      location: 'London',
      requests: '5.4K/min'
    }
  ]

  // Services status
  const services = [
    { name: 'Web Application', status: 'operational', responseTime: '24ms', icon: Globe },
    { name: 'REST API', status: 'operational', responseTime: '18ms', icon: Terminal },
    { name: 'Database', status: 'operational', responseTime: '12ms', icon: Database },
    { name: 'Authentication', status: 'operational', responseTime: '15ms', icon: Shield },
    { name: 'File Storage', status: 'warning', responseTime: '89ms', icon: HardDrive },
    { name: 'Email Service', status: 'operational', responseTime: '45ms', icon: Cloud }
  ]

  // Resource usage stats
  const resourceStats = [
    {
      name: 'CPU',
      value: metrics.cpu,
      max: 100,
      icon: Cpu,
      color: 'from-blue-500 to-blue-600',
      unit: '%'
    },
    {
      name: 'Memory',
      value: metrics.memory,
      max: 100,
      icon: HardDrive,
      color: 'from-green-500 to-green-600',
      unit: '%'
    },
    {
      name: 'Disk',
      value: metrics.disk,
      max: 100,
      icon: Database,
      color: 'from-purple-500 to-purple-600',
      unit: '%'
    },
    {
      name: 'Network',
      value: metrics.network,
      max: 100,
      icon: Wifi,
      color: 'from-orange-500 to-orange-600',
      unit: '%'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-700 border-green-300'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'critical': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return <CheckCircle className="text-green-600" size={20} />
      case 'warning': return <AlertTriangle className="text-yellow-600" size={20} />
      case 'critical': return <XCircle className="text-red-600" size={20} />
      default: return <Activity className="text-gray-600" size={20} />
    }
  }

  const getMetricColor = (value) => {
    if (value < 60) return 'text-green-600'
    if (value < 80) return 'text-yellow-600'
    return 'text-red-600'
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
              <Server className="mr-3 text-blue-600" size={36} />
              System Metrics
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
            <button className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50">
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overall System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CheckCircle size={48} />
            <div>
              <h2 className="text-3xl font-black mb-1">System Operational</h2>
              <p className="text-white/90">All systems running smoothly</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-8 text-center">
            <div>
              <div className="text-4xl font-black">{metrics.uptime.toFixed(2)}%</div>
              <div className="text-sm opacity-90">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-black">{metrics.latency}ms</div>
              <div className="text-sm opacity-90">Latency</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resource Usage Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {resourceStats.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center`}>
                <resource.icon className="text-white" size={20} />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-1 ${getMetricColor(resource.value)}`}>
              {Math.round(resource.value)}{resource.unit}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">{resource.name} Usage</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${resource.value}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full ${
                  resource.value < 60 ? 'bg-green-500' :
                  resource.value < 80 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* CPU Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Cpu className="mr-2 text-blue-600" size={24} />
            CPU Usage History
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="CPU %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Memory Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <HardDrive className="mr-2 text-green-600" size={24} />
            Memory Usage History
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Server Instances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Server className="mr-2 text-purple-600" size={28} />
          Server Instances
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {servers.map((server, idx) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{server.name}</h3>
                  <p className="text-sm text-gray-600">{server.id} â€¢ {server.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(server.status)}`}>
                  {server.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-600">CPU</p>
                  <p className={`text-lg font-bold ${getMetricColor(server.cpu)}`}>{server.cpu}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Memory</p>
                  <p className={`text-lg font-bold ${getMetricColor(server.memory)}`}>{server.memory}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Uptime</p>
                  <p className="text-lg font-bold text-green-600">{server.uptime}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Requests</p>
                  <p className="text-lg font-bold text-blue-600">{server.requests}</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-semibold">
                <Settings size={16} />
                <span>Manage Server</span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Services Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="mr-2 text-orange-600" size={28} />
          Services Health
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <service.icon className="text-gray-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.responseTime}</p>
                </div>
              </div>
              {getStatusIcon(service.status)}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default SystemMetrics