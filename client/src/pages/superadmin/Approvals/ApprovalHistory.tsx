import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  Download,
  Calendar,
  User,
  FileText,
  DollarSign,
  Shield,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

const ApprovalHistory = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [dateRange, setDateRange] = useState('30days')
  const [loading, setLoading] = useState(true)
  const [approvals, setApprovals] = useState([])
  const [stats, setStats] = useState(null)
  const [approvalsByType, setApprovalsByType] = useState([])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  // Fetch approval statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/approvals/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      if (data.success) {
        setStats(data.data)
        setApprovalsByType(data.data.byType || [])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load statistics')
    }
  }

  // Fetch approval history
  const fetchApprovals = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      let url = `${API_URL}/approvals?dateRange=${dateRange}`
      if (filterStatus !== 'all') url += `&status=${filterStatus.toUpperCase()}`
      if (filterType !== 'all') url += `&type=${filterType.toUpperCase()}`
      if (searchQuery) url += `&search=${searchQuery}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to fetch approvals')

      const data = await response.json()
      
      if (data.success) {
        const transformedApprovals = data.data.map((approval) => ({
          id: approval.approvalId,
          dbId: approval.id,
          type: approval.type,
          title: approval.title,
          submitter: {
            name: approval.submitterName,
            email: approval.submitterEmail,
            avatar: approval.submitterAvatar || 'https://i.pravatar.cc/150?img=1',
            department: approval.submitter?.department || 'N/A'
          },
          approver: approval.approver ? {
            name: approval.approverName,
            email: approval.approverEmail,
            avatar: approval.approverAvatar || 'https://i.pravatar.cc/150?img=68'
          } : null,
          amount: approval.amount,
          status: approval.status,
          submittedDate: new Date(approval.submittedDate).toISOString().split('T')[0],
          approvedDate: approval.approvedDate ? new Date(approval.approvedDate).toISOString().split('T')[0] : null,
          notes: approval.notes,
          priority: approval.priority,
          description: approval.description
        }))

        setApprovals(transformedApprovals)
      }
    } catch (error) {
      console.error('Error fetching approvals:', error)
      toast.error('Failed to load approval history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchApprovals()
  }, [dateRange, filterStatus, filterType, searchQuery])

  const getStatusBadge = (status) => {
    const styles = {
      APPROVED: 'bg-green-100 text-green-700 border-green-300',
      REJECTED: 'bg-red-100 text-red-700 border-red-300',
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      CANCELLED: 'bg-gray-100 text-gray-700 border-gray-300'
    }
    return styles[status] || styles.PENDING
  }

  const getTypeIcon = (type) => {
    const icons = {
      EXPENSE_CLAIM: DollarSign,
      USER_ACCESS: Shield,
      CONTENT_PUBLISH: FileText,
      PURCHASE_ORDER: FileText,
      LEAVE_REQUEST: Calendar,
      BUDGET_INCREASE: TrendingUp,
      EQUIPMENT_REQUEST: FileText,
      TRAINING_REQUEST: FileText
    }
    return icons[type] || FileText
  }

  const getPriorityColor = (priority) => {
    const colors = {
      URGENT: 'text-red-600',
      HIGH: 'text-orange-600',
      MEDIUM: 'text-yellow-600',
      LOW: 'text-blue-600'
    }
    return colors[priority] || colors.MEDIUM
  }

  const statsCards = stats ? [
    {
      label: 'Total Approvals',
      value: stats.total.value,
      change: `+${stats.total.change}`,
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Approved',
      value: stats.approved.value,
      change: `+${stats.approved.change}`,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Rejected',
      value: stats.rejected.value,
      change: `+${stats.rejected.change}`,
      icon: XCircle,
      color: 'from-red-500 to-red-600'
    },
    {
      label: 'Avg Response',
      value: stats.avgResponse.value,
      change: stats.avgResponse.change,
      icon: Clock,
      color: 'from-purple-500 to-purple-600'
    }
  ] : []

  const handleExport = async () => {
    try {
      const csvContent = [
        ['ID', 'Title', 'Type', 'Status', 'Priority', 'Amount', 'Submitted', 'Decided'],
        ...approvals.map(a => [
          a.id,
          a.title,
          a.type,
          a.status,
          a.priority,
          a.amount || '-',
          a.submittedDate,
          a.approvedDate || '-'
        ])
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `approval-history-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Approvals exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export approvals')
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading approval history...</p>
        </div>
      </div>
    )
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
              <CheckCircle className="mr-3 text-green-600" size={36} />
              Approval History
            </h1>
            <p className="text-gray-600">View all approval decisions and their details</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((stat, index) => (
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
                <span className="text-xs sm:text-sm font-bold text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Approvals by Type */}
        {approvalsByType.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="mr-2 text-blue-600" size={24} />
              By Type
            </h2>
            <div className="space-y-4">
              {approvalsByType.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{item.type}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                      className="h-full"
                      style={{
                        backgroundColor: item.color === 'blue' ? '#3b82f6' :
                          item.color === 'green' ? '#10b981' :
                          item.color === 'purple' ? '#a855f7' :
                          item.color === 'orange' ? '#f97316' :
                          item.color === 'pink' ? '#ec4899' :
                          item.color === 'yellow' ? '#eab308' :
                          item.color === 'indigo' ? '#6366f1' :
                          item.color === 'teal' ? '#14b8a6' : '#6b7280'
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search approvals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING">Pending</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none sm:col-span-2"
            >
              <option value="all">All Types</option>
              <option value="EXPENSE_CLAIM">Expense Claims</option>
              <option value="USER_ACCESS">User Access</option>
              <option value="CONTENT_PUBLISH">Content Publish</option>
              <option value="PURCHASE_ORDER">Purchase Orders</option>
              <option value="LEAVE_REQUEST">Leave Requests</option>
              <option value="BUDGET_INCREASE">Budget Increase</option>
              <option value="EQUIPMENT_REQUEST">Equipment Request</option>
              <option value="TRAINING_REQUEST">Training Request</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* Approvals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="mr-2 text-purple-600" size={28} />
          Approval Records
        </h2>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading approvals...</p>
            </div>
          ) : (
            <AnimatePresence>
              {approvals.map((approval, idx) => {
                const TypeIcon = getTypeIcon(approval.type)
                return (
                  <motion.div
                    key={approval.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedApproval(approval)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Left Section */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <TypeIcon className="text-gray-600" size={24} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-500">{approval.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(approval.status)}`}>
                              {approval.status}
                            </span>
                            <AlertCircle className={`${getPriorityColor(approval.priority)}`} size={16} />
                          </div>

                          <h3 className="font-bold text-gray-900 mb-1">{approval.title}</h3>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {approval.submitter.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {approval.submittedDate}
                            </span>
                            {approval.amount && (
                              <span className="flex items-center gap-1 font-semibold text-green-600">
                                <DollarSign size={14} />
                                {approval.amount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3 lg:flex-shrink-0">
                        {approval.approver && (
                          <div className="flex items-center gap-2">
                            <img
                              src={approval.approver.avatar}
                              alt={approval.approver.name}
                              className="w-8 h-8 rounded-full border-2 border-gray-200"
                            />
                            <div className="hidden sm:block">
                              <p className="text-xs text-gray-600">
                                {approval.status === 'APPROVED' ? 'Approved by' : 'Rejected by'}
                              </p>
                              <p className="text-sm font-semibold text-gray-900">{approval.approver.name}</p>
                            </div>
                          </div>
                        )}
                        <ChevronRight className="text-gray-400" size={20} />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>

        {approvals.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold">No approvals found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </motion.div>

      {/* Approval Detail Modal */}
      <AnimatePresence>
        {selectedApproval && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedApproval(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-gray-500">{selectedApproval.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(selectedApproval.status)}`}>
                        {selectedApproval.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApproval.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedApproval(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Submitter & Approver */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-blue-700 mb-3 font-semibold">Submitted By</p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedApproval.submitter.avatar}
                        alt={selectedApproval.submitter.name}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div>
                        <p className="font-bold text-blue-900">{selectedApproval.submitter.name}</p>
                        <p className="text-sm text-blue-700">{selectedApproval.submitter.email}</p>
                        <p className="text-xs text-blue-600">{selectedApproval.submitter.department}</p>
                      </div>
                    </div>
                  </div>

                  {selectedApproval.approver && (
                    <div className={`p-4 rounded-xl border-2 ${
                      selectedApproval.status === 'APPROVED' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <p className={`text-sm mb-3 font-semibold ${
                        selectedApproval.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {selectedApproval.status === 'APPROVED' ? 'Approved By' : 'Rejected By'}
                      </p>
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedApproval.approver.avatar}
                          alt={selectedApproval.approver.name}
                          className="w-12 h-12 rounded-full border-2 border-white"
                        />
                        <div>
                          <p className={`font-bold ${
                            selectedApproval.status === 'APPROVED' ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {selectedApproval.approver.name}
                          </p>
                          <p className={`text-sm ${
                            selectedApproval.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {selectedApproval.approver.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Type</p>
                    <p className="font-bold text-gray-900">{selectedApproval.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Priority</p>
                    <p className={`font-bold ${getPriorityColor(selectedApproval.priority)}`}>
                      {selectedApproval.priority}
                    </p>
                  </div>
                  {selectedApproval.amount && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Amount</p>
                      <p className="font-bold text-green-600">{selectedApproval.amount}</p>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Submitted</p>
                    <p className="font-bold text-gray-900">{selectedApproval.submittedDate}</p>
                  </div>
                  {selectedApproval.approvedDate && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Decision Date</p>
                      <p className="font-bold text-gray-900">{selectedApproval.approvedDate}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {selectedApproval.description && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900">{selectedApproval.description}</p>
                  </div>
                )}

                {/* Notes */}
                {selectedApproval.notes && (
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="text-gray-600" size={20} />
                      <p className="font-semibold text-gray-900">Notes</p>
                    </div>
                    <p className="text-gray-700">{selectedApproval.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedApproval(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Close
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

export default ApprovalHistory