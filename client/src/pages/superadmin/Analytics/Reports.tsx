import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  Share2,
  Filter,
  Search,
  Plus,
  Clock
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Reports = () => {
  const [dateRange, setDateRange] = useState('this_month')
  const [reportType, setReportType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Revenue data
  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
    { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
    { month: 'Jun', revenue: 67000, expenses: 40000, profit: 27000 }
  ]

  // User growth data
  const userGrowthData = [
    { month: 'Jan', users: 1200, active: 980 },
    { month: 'Feb', users: 1350, active: 1120 },
    { month: 'Mar', users: 1480, active: 1250 },
    { month: 'Apr', users: 1620, active: 1380 },
    { month: 'May', users: 1750, active: 1500 },
    { month: 'Jun', users: 1890, active: 1620 }
  ]

  // Category breakdown
  const categoryData = [
    { name: 'Products', value: 45, color: '#3b82f6' },
    { name: 'Services', value: 30, color: '#10b981' },
    { name: 'Consulting', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 10, color: '#f59e0b' }
  ]

  const stats = [
    {
      label: 'Total Revenue',
      value: 'Â£328K',
      change: '+23.5%',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      trend: 'up'
    },
    {
      label: 'Active Users',
      value: '1,890',
      change: '+12.3%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      label: 'Total Orders',
      value: '456',
      change: '+8.7%',
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      trend: 'up'
    },
    {
      label: 'Avg Order Value',
      value: 'Â£719',
      change: '+5.2%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      trend: 'up'
    }
  ]

  const savedReports = [
    {
      id: 1,
      name: 'Monthly Financial Report',
      type: 'financial',
      lastGenerated: '2 hours ago',
      size: '2.4 MB',
      format: 'PDF',
      views: 145
    },
    {
      id: 2,
      name: 'User Activity Analysis',
      type: 'analytics',
      lastGenerated: '1 day ago',
      size: '1.8 MB',
      format: 'Excel',
      views: 89
    },
    {
      id: 3,
      name: 'Sales Performance Q2',
      type: 'sales',
      lastGenerated: '3 days ago',
      size: '3.2 MB',
      format: 'PDF',
      views: 234
    },
    {
      id: 4,
      name: 'System Health Report',
      type: 'system',
      lastGenerated: '5 days ago',
      size: '890 KB',
      format: 'CSV',
      views: 67
    },
    {
      id: 5,
      name: 'Marketing Campaign Results',
      type: 'marketing',
      lastGenerated: '1 week ago',
      size: '4.1 MB',
      format: 'PDF',
      views: 312
    }
  ]

  const quickReports = [
    { name: 'Revenue Summary', icon: DollarSign, color: 'green' },
    { name: 'User Insights', icon: Users, color: 'blue' },
    { name: 'Sales Overview', icon: ShoppingCart, color: 'purple' },
    { name: 'Traffic Analysis', icon: Activity, color: 'orange' }
  ]

  const getTypeColor = (type) => {
    const colors = {
      financial: 'bg-green-100 text-green-700',
      analytics: 'bg-blue-100 text-blue-700',
      sales: 'bg-purple-100 text-purple-700',
      system: 'bg-orange-100 text-orange-700',
      marketing: 'bg-pink-100 text-pink-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const filteredReports = savedReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = reportType === 'all' || report.type === reportType
    return matchesSearch && matchesType
  })

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
              <FileText className="mr-3 text-blue-600" size={36} />
              Reports & Analytics
            </h1>
            <p className="text-gray-600">Generate and view comprehensive business reports</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50">
              <Calendar size={20} />
              <span className="hidden sm:inline">Date Range</span>
            </button>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg">
              <Plus size={20} />
              <span>New Report</span>
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
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Report Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Reports</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickReports.map((report, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-4 bg-${report.color}-50 border-2 border-${report.color}-200 rounded-xl hover:shadow-lg transition-all`}
            >
              <report.icon className={`text-${report.color}-600 mb-3`} size={32} />
              <p className="font-bold text-gray-900">{report.name}</p>
              <p className="text-sm text-gray-600 mt-1">Generate now</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <DollarSign className="mr-2 text-green-600" size={24} />
            Revenue Analysis
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="mr-2 text-blue-600" size={24} />
            User Growth
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Total Users" />
                <Area type="monotone" dataKey="active" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Revenue by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <PieChart className="mr-2 text-purple-600" size={28} />
          Revenue by Category
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RPieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            {categoryData.map((category, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                  <span className="font-semibold text-gray-900">{category.name}</span>
                </div>
                <span className="font-bold text-gray-900">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Saved Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Saved Reports</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="financial">Financial</option>
              <option value="analytics">Analytics</option>
              <option value="sales">Sales</option>
              <option value="system">System</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredReports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{report.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(report.type)}`}>
                        {report.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {report.lastGenerated}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={14} />
                        {report.size} â€¢ {report.format}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {report.views} views
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                    <Eye size={20} />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                    <Download size={20} />
                  </button>
                  <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Reports