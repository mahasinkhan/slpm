import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Eye,
  MousePointer,
  Clock,
  Zap,
  Server,
  Database,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const RealtimeAnalytics = () => {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [timeRange, setTimeRange] = useState('1h')

  // Real-time data state
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 1247,
    pageViews: 15842,
    revenue: 45678,
    conversionRate: 3.24,
    avgSessionDuration: 425,
    bounceRate: 42.8,
    newUsers: 234,
    returningUsers: 1013
  })

  // Simulate real-time updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setRealtimeData(prev => ({
          activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 20 - 10)),
          pageViews: prev.pageViews + Math.floor(Math.random() * 50),
          revenue: prev.revenue + Math.floor(Math.random() * 500 - 200),
          conversionRate: Math.max(1, Math.min(10, prev.conversionRate + (Math.random() * 0.2 - 0.1))),
          avgSessionDuration: Math.max(60, prev.avgSessionDuration + Math.floor(Math.random() * 10 - 5)),
          bounceRate: Math.max(20, Math.min(70, prev.bounceRate + (Math.random() * 2 - 1))),
          newUsers: Math.max(0, prev.newUsers + Math.floor(Math.random() * 5 - 2)),
          returningUsers: Math.max(0, prev.returningUsers + Math.floor(Math.random() * 8 - 4))
        }))
        setLastUpdated(new Date())
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Traffic data (last hour)
  const [trafficData, setTrafficData] = useState([
    { time: '00:00', visitors: 145, pageviews: 420 },
    { time: '00:05', visitors: 158, pageviews: 445 },
    { time: '00:10', visitors: 172, pageviews: 478 },
    { time: '00:15', visitors: 165, pageviews: 461 },
    { time: '00:20', visitors: 189, pageviews: 512 },
    { time: '00:25', visitors: 201, pageviews: 548 },
    { time: '00:30', visitors: 195, pageviews: 532 },
    { time: '00:35', visitors: 178, pageviews: 495 },
    { time: '00:40', visitors: 186, pageviews: 518 },
    { time: '00:45', visitors: 198, pageviews: 542 },
    { time: '00:50', visitors: 212, pageviews: 578 },
    { time: '00:55', visitors: 205, pageviews: 561 }
  ])

  // Device breakdown
  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 38, color: '#10b981' },
    { name: 'Tablet', value: 17, color: '#f59e0b' }
  ]

  // Geographic data
  const geoData = [
    { country: 'United Kingdom', users: 542, percentage: 43.5 },
    { country: 'United States', users: 318, percentage: 25.5 },
    { country: 'Germany', users: 156, percentage: 12.5 },
    { country: 'France', users: 124, percentage: 9.9 },
    { country: 'Others', users: 107, percentage: 8.6 }
  ]

  // Top pages
  const topPages = [
    { path: '/dashboard', views: 2845, avgTime: '3:24', bounceRate: 32.5 },
    { path: '/products', views: 2156, avgTime: '4:12', bounceRate: 28.3 },
    { path: '/about', views: 1842, avgTime: '2:45', bounceRate: 45.2 },
    { path: '/contact', views: 1567, avgTime: '1:58', bounceRate: 52.8 },
    { path: '/blog', views: 1234, avgTime: '5:32', bounceRate: 24.1 }
  ]

  // Real-time events
  const [realtimeEvents, setRealtimeEvents] = useState([
    { id: 1, type: 'pageview', user: 'User from London', page: '/products', time: '2s ago' },
    { id: 2, type: 'conversion', user: 'User from New York', action: 'Purchase completed', time: '5s ago' },
    { id: 3, type: 'signup', user: 'User from Berlin', action: 'New account created', time: '8s ago' },
    { id: 4, type: 'pageview', user: 'User from Paris', page: '/dashboard', time: '12s ago' },
    { id: 5, type: 'pageview', user: 'User from Tokyo', page: '/about', time: '15s ago' }
  ])

  const stats = [
    {
      label: 'Active Users',
      value: realtimeData.activeUsers.toLocaleString(),
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: 'up',
      realtime: true
    },
    {
      label: 'Page Views',
      value: realtimeData.pageViews.toLocaleString(),
      change: '+8.3%',
      icon: Eye,
      color: 'from-green-500 to-green-600',
      trend: 'up',
      realtime: true
    },
    {
      label: 'Revenue',
      value: `Â£${(realtimeData.revenue / 1000).toFixed(1)}K`,
      change: '+15.7%',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      trend: 'up',
      realtime: true
    },
    {
      label: 'Conversion Rate',
      value: `${realtimeData.conversionRate.toFixed(2)}%`,
      change: '+0.4%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      trend: 'up',
      realtime: true
    }
  ]

  const getEventIcon = (type) => {
    switch (type) {
      case 'pageview': return Eye
      case 'conversion': return ShoppingCart
      case 'signup': return Users
      default: return Activity
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'pageview': return 'bg-blue-100 text-blue-700'
      case 'conversion': return 'bg-green-100 text-green-700'
      case 'signup': return 'bg-purple-100 text-purple-700'
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
              <Activity className="mr-3 text-green-600" size={36} />
              Real-Time Analytics
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

      {/* Real-time Stats */}
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
            {stat.realtime && (
              <div className="absolute top-3 right-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
              </div>
            )}

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

            {stat.realtime && (
              <div className="mt-2 flex items-center space-x-1 text-xs text-green-600">
                <Zap size={12} />
                <span>Live</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Traffic Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-2 text-blue-600" size={28} />
            Live Traffic Flow
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Page Views</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="pageviews" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Monitor className="mr-2 text-purple-600" size={24} />
            Device Breakdown
          </h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {deviceData.map((device, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: device.color }} />
                  <span className="text-sm font-semibold text-gray-900">{device.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{device.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Globe className="mr-2 text-green-600" size={24} />
            Top Locations
          </h2>
          <div className="space-y-4">
            {geoData.map((location, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{location.country}</span>
                  <span className="text-sm font-bold text-gray-900">{location.users}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${location.percentage}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="mr-2 text-orange-600" size={24} />
            Live Events
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {realtimeEvents.map((event, idx) => {
              const EventIcon = getEventIcon(event.type)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                    <EventIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{event.user}</p>
                    <p className="text-xs text-gray-600">{event.page || event.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Eye className="mr-2 text-blue-600" size={28} />
          Top Pages
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Page</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Views</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Avg Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Bounce Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topPages.map((page, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{page.path}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{page.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{page.avgTime}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      page.bounceRate < 30 ? 'bg-green-100 text-green-700' :
                      page.bounceRate < 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {page.bounceRate}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default RealtimeAnalytics