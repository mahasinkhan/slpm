import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  User,
  DollarSign,
  FileText,
  Shield,
  Calendar,
  MessageSquare,
  Filter,
  Search,
  ChevronRight,
  Download,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Settings,
  BarChart3,
  Users,
  Zap,
  Send,
  Lock,
  Unlock
} from 'lucide-react'

const ApprovalAdminDashboard = () => {
  const [approvals, setApprovals] = useState([
    {
      id: 'APR-101',
      type: 'EXPENSE_CLAIM',
      title: 'Travel Expenses - Client Meeting London',
      submitter: {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=1',
        department: 'Sales'
      },
      amount: '£2,450.00',
      status: 'PENDING',
      priority: 'HIGH',
      submittedDate: '2025-11-10',
      daysWaiting: 1,
      description: 'Travel and accommodation expenses for 3-day client meeting',
      attachments: 3,
      category: 'Travel',
      metadata: { location: 'London', duration: '3 days' }
    },
    {
      id: 'APR-102',
      type: 'USER_ACCESS',
      title: 'Admin Access Request - Emma Wilson',
      submitter: {
        id: 'user-2',
        name: 'Michael Chen',
        email: 'michael.c@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=3',
        department: 'IT'
      },
      status: 'PENDING',
      priority: 'URGENT',
      submittedDate: '2025-11-09',
      daysWaiting: 2,
      description: 'Grant admin access to Emma Wilson',
      attachments: 1,
      category: 'Security'
    },
    {
      id: 'APR-103',
      type: 'PURCHASE_ORDER',
      title: 'Office Equipment Purchase',
      submitter: {
        id: 'user-3',
        name: 'James Brown',
        email: 'james.b@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=7',
        department: 'Operations'
      },
      amount: '£8,500.00',
      status: 'APPROVED',
      priority: 'HIGH',
      submittedDate: '2025-11-08',
      daysWaiting: 3,
      description: '10 new workstations for expanding team',
      attachments: 4,
      category: 'Procurement'
    },
    {
      id: 'APR-104',
      type: 'BUDGET_INCREASE',
      title: 'Q4 Marketing Budget Increase',
      submitter: {
        id: 'user-4',
        name: 'Lisa Anderson',
        email: 'lisa.a@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=9',
        department: 'Marketing'
      },
      amount: '£25,000.00',
      status: 'REJECTED',
      priority: 'URGENT',
      submittedDate: '2025-11-07',
      daysWaiting: 4,
      description: 'Additional marketing budget for Q4',
      attachments: 5,
      category: 'Finance'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [actionType, setActionType] = useState(null)
  const [actionNotes, setActionNotes] = useState('')
  const [selectedApprovals, setSelectedApprovals] = useState([])
  const [bulkAction, setBulkAction] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [newApprovalForm, setNewApprovalForm] = useState({
    type: 'EXPENSE_CLAIM',
    title: '',
    description: '',
    amount: '',
    priority: 'MEDIUM'
  })

  const stats = [
    {
      label: 'Pending',
      value: approvals.filter(a => a.status === 'PENDING').length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      label: 'Approved',
      value: approvals.filter(a => a.status === 'APPROVED').length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Rejected',
      value: approvals.filter(a => a.status === 'REJECTED').length,
      icon: XCircle,
      color: 'from-red-500 to-red-600'
    },
    {
      label: 'Urgent',
      value: approvals.filter(a => a.priority === 'URGENT').length,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600'
    }
  ]

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = 
      approval.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.submitter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus
    const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority
    const matchesType = filterType === 'all' || approval.type === filterType
    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const handleMakeDecision = (approval, decision) => {
    setSelectedApproval(approval)
    setActionType(decision)
    setActionNotes('')
    setShowActionModal(true)
  }

  const confirmDecision = () => {
    const updated = approvals.map(a => 
      a.id === selectedApproval.id 
        ? { ...a, status: actionType === 'approve' ? 'APPROVED' : 'REJECTED' }
        : a
    )
    setApprovals(updated)
    setShowActionModal(false)
    setSelectedApproval(null)
    setActionType(null)
  }

  const handleEditApproval = (approval) => {
    setEditForm(approval)
    setSelectedApproval(approval)
    setShowEditModal(true)
  }

  const confirmEdit = () => {
    const updated = approvals.map(a => 
      a.id === editForm.id ? editForm : a
    )
    setApprovals(updated)
    setShowEditModal(false)
    setEditForm({})
  }

  const handleDeleteApproval = (id) => {
    setApprovals(approvals.filter(a => a.id !== id))
  }

  const handleCreateApproval = () => {
    const newApproval = {
      id: `APR-${String(approvals.length + 1).padStart(3, '0')}`,
      ...newApprovalForm,
      status: 'PENDING',
      submitter: {
        id: 'superadmin',
        name: 'Super Admin',
        email: 'superadmin@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=68',
        department: 'Admin'
      },
      submittedDate: new Date().toISOString().split('T')[0],
      daysWaiting: 0,
      attachments: 0
    }
    setApprovals([newApproval, ...approvals])
    setShowCreateModal(false)
    setNewApprovalForm({
      type: 'EXPENSE_CLAIM',
      title: '',
      description: '',
      amount: '',
      priority: 'MEDIUM'
    })
  }

  const handleBulkAction = (action) => {
    if (selectedApprovals.length === 0) return
    setBulkAction(action)
    setShowBulkModal(true)
  }

  const confirmBulkAction = () => {
    const updated = approvals.map(a => 
      selectedApprovals.includes(a.id)
        ? { ...a, status: bulkAction === 'approve' ? 'APPROVED' : 'REJECTED' }
        : a
    )
    setApprovals(updated)
    setSelectedApprovals([])
    setShowBulkModal(false)
    setBulkAction(null)
  }

  const toggleApprovalSelection = (id) => {
    setSelectedApprovals(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedApprovals.length === filteredApprovals.length) {
      setSelectedApprovals([])
    } else {
      setSelectedApprovals(filteredApprovals.map(a => a.id))
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-700 border-red-300'
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700'
      case 'REJECTED': return 'bg-red-100 text-red-700'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      EXPENSE_CLAIM: DollarSign,
      USER_ACCESS: Shield,
      CONTENT_PUBLISH: FileText,
      PURCHASE_ORDER: FileText,
      LEAVE_REQUEST: Calendar,
      BUDGET_INCREASE: TrendingUp,
      EQUIPMENT_REQUEST: Zap,
      TRAINING_REQUEST: Users
    }
    return icons[type] || FileText
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center">
              <Lock className="mr-3 text-blue-600" size={40} />
              SuperAdmin Control Panel
            </h1>
            <p className="text-gray-600">Complete approval system management</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              <span>Create Approval</span>
            </button>
            <button className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50">
              <Download size={20} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="EXPENSE_CLAIM">Expense Claim</option>
            <option value="USER_ACCESS">User Access</option>
            <option value="PURCHASE_ORDER">Purchase Order</option>
            <option value="BUDGET_INCREASE">Budget Increase</option>
            <option value="LEAVE_REQUEST">Leave Request</option>
          </select>

          <select
            value={selectedApprovals.length}
            onChange={() => toggleSelectAll()}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value={0}>Select All</option>
          </select>
        </div>

        {selectedApprovals.length > 0 && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleBulkAction('approve')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              <CheckCircle size={18} />
              Approve All ({selectedApprovals.length})
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              <XCircle size={18} />
              Reject All ({selectedApprovals.length})
            </button>
          </div>
        )}
      </motion.div>

      {/* Approvals Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApprovals.length === filteredApprovals.length && filteredApprovals.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Submitter</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Priority</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredApprovals.map((approval) => {
                  const TypeIcon = getTypeIcon(approval.type)
                  return (
                    <motion.tr
                      key={approval.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedApprovals.includes(approval.id)}
                          onChange={() => toggleApprovalSelection(approval.id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{approval.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="text-gray-600" size={18} />
                          <span className="font-semibold text-gray-900">{approval.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={approval.submitter.avatar}
                            alt={approval.submitter.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-700">{approval.submitter.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {approval.amount || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(approval.status)}`}>
                          {approval.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(approval.priority)}`}>
                          {approval.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedApproval(approval)
                              setShowDetailModal(true)
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditApproval(approval)}
                            className="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600 transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteApproval(approval.id)}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold">No approvals found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedApproval && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <span className="text-sm font-bold text-gray-500">{selectedApproval.id}</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedApproval.title}</h2>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedApproval.status)}`}>
                      {selectedApproval.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Priority</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(selectedApproval.priority)}`}>
                      {selectedApproval.priority}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Submitted By</p>
                  <div className="flex items-center gap-3">
                    <img src={selectedApproval.submitter.avatar} alt="" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold">{selectedApproval.submitter.name}</p>
                      <p className="text-sm text-gray-600">{selectedApproval.submitter.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900">{selectedApproval.description}</p>
                </div>

                {selectedApproval.amount && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-2xl font-black text-green-600">{selectedApproval.amount}</p>
                  </div>
                )}

                {selectedApproval.status === 'PENDING' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleMakeDecision(selectedApproval, 'approve')}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleMakeDecision(selectedApproval, 'reject')}
                      className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {actionType === 'approve' ? '✓ Approve' : '✕ Reject'} Approval?
              </h3>
              <p className="text-gray-600 mb-4">{selectedApproval?.id}</p>
              <textarea
                placeholder="Add notes..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:outline-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDecision}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold ${
                    actionType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Approval</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <select
                      value={editForm.priority || 'MEDIUM'}
                      onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={editForm.status || 'PENDING'}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                {editForm.amount && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                    <input
                      type="text"
                      value={editForm.amount || ''}
                      onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmEdit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Approval Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Create New Approval</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={newApprovalForm.type}
                    onChange={(e) => setNewApprovalForm({...newApprovalForm, type: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="EXPENSE_CLAIM">Expense Claim</option>
                    <option value="USER_ACCESS">User Access</option>
                    <option value="PURCHASE_ORDER">Purchase Order</option>
                    <option value="BUDGET_INCREASE">Budget Increase</option>
                    <option value="LEAVE_REQUEST">Leave Request</option>
                    <option value="EQUIPMENT_REQUEST">Equipment Request</option>
                    <option value="TRAINING_REQUEST">Training Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newApprovalForm.title}
                    onChange={(e) => setNewApprovalForm({...newApprovalForm, title: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Approval title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newApprovalForm.description}
                    onChange={(e) => setNewApprovalForm({...newApprovalForm, description: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="Detailed description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <select
                      value={newApprovalForm.priority}
                      onChange={(e) => setNewApprovalForm({...newApprovalForm, priority: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (Optional)</label>
                    <input
                      type="text"
                      value={newApprovalForm.amount}
                      onChange={(e) => setNewApprovalForm({...newApprovalForm, amount: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="£0.00"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateApproval}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                  >
                    Create Approval
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Action Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {bulkAction === 'approve' ? '✓ Approve All' : '✕ Reject All'}
              </h3>
              <p className="text-gray-600 mb-4">
                This will {bulkAction} {selectedApprovals.length} selected approval(s).
              </p>
              <textarea
                placeholder="Add notes (optional)..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:outline-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkAction}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold ${
                    bulkAction === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApprovalAdminDashboard