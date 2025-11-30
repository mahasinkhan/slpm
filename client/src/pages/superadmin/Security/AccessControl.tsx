import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Users,
  Lock,
  Unlock,
  Key,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  Settings,
  Database,
  FileText,
  BarChart3,
  Globe,
  Mail,
  Download
} from 'lucide-react'

const AccessControl = () => {
  const [activeTab, setActiveTab] = useState('roles')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      users: 2,
      color: 'red',
      permissions: { all: true }
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access to most features',
      users: 8,
      color: 'purple',
      permissions: { users: true, content: true, reports: true, settings: true }
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Team management and content oversight',
      users: 15,
      color: 'blue',
      permissions: { users: 'read', content: true, reports: 'read' }
    },
    {
      id: 4,
      name: 'Employee',
      description: 'Standard user access',
      users: 156,
      color: 'green',
      permissions: { content: 'read', reports: 'read' }
    },
    {
      id: 5,
      name: 'Contractor',
      description: 'Limited temporary access',
      users: 23,
      color: 'orange',
      permissions: { content: 'read' }
    }
  ]

  const permissions = [
    {
      category: 'User Management',
      icon: Users,
      modules: [
        { name: 'View Users', key: 'users_view' },
        { name: 'Create Users', key: 'users_create' },
        { name: 'Edit Users', key: 'users_edit' },
        { name: 'Delete Users', key: 'users_delete' },
        { name: 'Manage Roles', key: 'users_roles' }
      ]
    },
    {
      category: 'Content Management',
      icon: FileText,
      modules: [
        { name: 'View Content', key: 'content_view' },
        { name: 'Create Content', key: 'content_create' },
        { name: 'Edit Content', key: 'content_edit' },
        { name: 'Delete Content', key: 'content_delete' },
        { name: 'Publish Content', key: 'content_publish' }
      ]
    },
    {
      category: 'System Settings',
      icon: Settings,
      modules: [
        { name: 'View Settings', key: 'settings_view' },
        { name: 'Modify Settings', key: 'settings_edit' },
        { name: 'Security Settings', key: 'settings_security' },
        { name: 'System Maintenance', key: 'settings_maintenance' }
      ]
    },
    {
      category: 'Reports & Analytics',
      icon: BarChart3,
      modules: [
        { name: 'View Reports', key: 'reports_view' },
        { name: 'Generate Reports', key: 'reports_create' },
        { name: 'Export Data', key: 'reports_export' },
        { name: 'Financial Reports', key: 'reports_financial' }
      ]
    },
    {
      category: 'Database Access',
      icon: Database,
      modules: [
        { name: 'Read Access', key: 'database_read' },
        { name: 'Write Access', key: 'database_write' },
        { name: 'Backup/Restore', key: 'database_backup' },
        { name: 'Direct Query', key: 'database_query' }
      ]
    }
  ]

  const roleAssignments = [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      role: 'Super Admin',
      assignedDate: '2023-01-15',
      assignedBy: 'System',
      status: 'active'
    },
    {
      id: 2,
      user: {
        name: 'Michael Chen',
        email: 'michael.c@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      role: 'Admin',
      assignedDate: '2023-02-20',
      assignedBy: 'Super Admin',
      status: 'active'
    },
    {
      id: 3,
      user: {
        name: 'Emma Wilson',
        email: 'emma.w@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      role: 'Manager',
      assignedDate: '2023-03-10',
      assignedBy: 'Admin',
      status: 'active'
    },
    {
      id: 4,
      user: {
        name: 'James Brown',
        email: 'james.b@slbrothers.co.uk',
        avatar: 'https://i.pravatar.cc/150?img=7'
      },
      role: 'Employee',
      assignedDate: '2023-04-05',
      assignedBy: 'Manager',
      status: 'active'
    }
  ]

  const tabs = [
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'permissions', label: 'Permissions', icon: Key },
    { id: 'assignments', label: 'Assignments', icon: Users }
  ]

  const getRoleColor = (color) => {
    const colors = {
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    }
    return colors[color] || colors.blue
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
              <Shield className="mr-3 text-purple-600" size={36} />
              Access Control
            </h1>
            <p className="text-gray-600">Manage roles, permissions, and user access levels</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50">
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg"
            >
              <Plus size={20} />
              <span>New Role</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedRole(role)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getRoleColor(role.color)} rounded-xl flex items-center justify-center`}>
                    <Shield className="text-white" size={28} />
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit size={18} className="text-gray-600" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Users size={18} className="text-gray-600" />
                    <span className="font-semibold text-gray-900">{role.users} users</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                    View Details â†’
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            {permissions.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <category.icon className="mr-2 text-purple-600" size={28} />
                  {category.category}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Permission</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Super Admin</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Admin</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Manager</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Employee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {category.modules.map((module, midx) => (
                        <tr key={midx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">{module.name}</td>
                          <td className="px-6 py-4 text-center">
                            <CheckCircle className="inline text-green-600" size={20} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <CheckCircle className="inline text-green-600" size={20} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            {midx < 2 ? <CheckCircle className="inline text-green-600" size={20} /> : <XCircle className="inline text-red-600" size={20} />}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {midx === 0 ? <CheckCircle className="inline text-green-600" size={20} /> : <XCircle className="inline text-red-600" size={20} />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Role Assignments</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {roleAssignments.map((assignment, idx) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={assignment.user.avatar}
                        alt={assignment.user.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{assignment.user.name}</h3>
                        <p className="text-sm text-gray-600">{assignment.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold text-purple-600">{assignment.role}</p>
                        <p className="text-xs text-gray-600">Assigned {assignment.assignedDate}</p>
                      </div>

                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Role Details Modal */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRole(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getRoleColor(selectedRole.color)} rounded-xl flex items-center justify-center`}>
                      <Shield className="text-white" size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedRole.name}</h2>
                      <p className="text-gray-600">{selectedRole.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <Users className="text-purple-600 mb-2" size={24} />
                    <p className="text-2xl font-black text-gray-900">{selectedRole.users}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <Key className="text-blue-600 mb-2" size={24} />
                    <p className="text-2xl font-black text-gray-900">
                      {Object.keys(selectedRole.permissions).length}
                    </p>
                    <p className="text-sm text-gray-600">Permissions</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Permissions</h3>
                  {Object.entries(selectedRole.permissions).map(([key, value], idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="font-semibold text-gray-900 capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-green-600">
                        {value === true ? 'Full Access' : value === 'read' ? 'Read Only' : 'No Access'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
                    Edit Role
                  </button>
                  <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
                    Delete Role
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

export default AccessControl