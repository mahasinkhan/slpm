import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  LogIn,
  LogOut,
  User,
  Calendar,
  BarChart3,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Loader
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const API_BASE_URL = 'http://localhost:5000/api/tracking'

const EmployeeTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [activeView, setActiveView] = useState('all')

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch online employees
  const fetchOnlineEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/online-employees`)
      const data = await response.json()
      
      if (data.success) {
        setEmployees(data.data)
      } else {
        setError(data.error || 'Failed to fetch employees')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and refresh every 5 seconds
  useEffect(() => {
    fetchOnlineEmployees()
    const interval = setInterval(fetchOnlineEmployees, 5000)
    return () => clearInterval(interval)
  }, [])

  // Login employee
  const handleLogin = async (employee) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId || `EMP${employee.id}`,
          email: employee.email,
          department: employee.department,
          position: employee.position,
          location: employee.location
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchOnlineEmployees()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Login failed')
      console.error('Login error:', err)
    }
  }

  // Logout employee
  const handleLogout = async (employee) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId || `EMP${employee.id}`,
          email: employee.email
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchOnlineEmployees()
      } else {
        setError(data.error || 'Logout failed')
      }
    } catch (err) {
      setError('Logout failed')
      console.error('Logout error:', err)
    }
  }

  // Get work duration
  const getWorkDuration = (employee) => {
    if (!employee.loginTime) return '0h'
    const loginTime = new Date(employee.loginTime)
    const hours = (new Date() - loginTime) / 3600000
    return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`
  }

  // Get daily stats
  const getDailyStats = () => {
    return employees.map(emp => ({
      name: emp.user?.firstName || emp.email.split('@')[0],
      hoursWorked: emp.workDurationHours || 0
    }))
  }

  // Get weekly stats
  const getWeeklyStats = () => {
    return employees.map(emp => ({
      name: emp.user?.firstName || emp.email.split('@')[0],
      hours: emp.workDurationHours || 0
    }))
  }

  const onlineCount = employees.filter(e => e.status === 'ONLINE').length
  const offlineCount = employees.length - onlineCount

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Clock className="text-blue-600" size={32} />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Employee Work Tracker</h1>
          </div>
          <div className="text-right">
            <p className="text-blue-600 text-2xl font-bold">{currentTime.toLocaleTimeString('en-GB')}</p>
            <p className="text-gray-600 text-sm">{currentTime.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <p className="text-gray-600">Monitor employee login/logout and work hours</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Currently Online</p>
              <p className="text-3xl font-bold">{onlineCount}</p>
            </div>
            <LogIn size={32} className="text-green-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Offline</p>
              <p className="text-3xl font-bold">{offlineCount}</p>
            </div>
            <LogOut size={32} className="text-orange-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Employees</p>
              <p className="text-3xl font-bold">{employees.length}</p>
            </div>
            <Briefcase size={32} className="text-blue-100" />
          </div>
        </motion.div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'online', 'stats'].map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeView === view
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* All Employees View */}
      {activeView === 'all' && (
        <div className="space-y-4">
          {employees.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border-2 border-gray-200 shadow-sm">
              <AlertCircle size={40} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No employees found</p>
            </div>
          ) : (
            employees.map((emp, idx) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${emp.status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      <h3 className="text-xl font-bold text-gray-900">{emp.email}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        emp.status === 'ONLINE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {emp.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{emp.department} • {emp.position || 'Employee'}</p>

                    {emp.status === 'ONLINE' && emp.loginTime && (
                      <div className="flex gap-6 text-sm">
                        <div>
                          <p className="text-gray-600">Login Time</p>
                          <p className="text-green-600 font-semibold">{new Date(emp.loginTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="text-blue-600 font-semibold">{getWorkDuration(emp)}</p>
                        </div>
                      </div>
                    )}

                    {emp.status === 'OFFLINE' && emp.logoutTime && (
                      <div className="flex gap-6 text-sm">
                        <div>
                          <p className="text-gray-600">Last Logout</p>
                          <p className="text-orange-600 font-semibold">{new Date(emp.logoutTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedEmployee(selectedEmployee?.id === emp.id ? null : emp)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      {selectedEmployee?.id === emp.id ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {emp.status === 'ONLINE' ? (
                      <button
                        onClick={() => handleLogout(emp)}
                        className="px-6 py-2 rounded-lg font-bold transition-all bg-red-600 hover:bg-red-700 text-white"
                      >
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLogin(emp)}
                        className="px-6 py-2 rounded-lg font-bold transition-all bg-green-600 hover:bg-green-700 text-white"
                      >
                        Login
                      </button>
                    )}
                  </div>
                </div>

                {/* Employee Details */}
                {selectedEmployee?.id === emp.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t-2 border-gray-200"
                  >
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h5 className="text-sm text-gray-700 font-semibold mb-3">SESSION INFORMATION</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="text-gray-900 font-medium">{emp.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Department:</span>
                            <span className="text-gray-900 font-medium">{emp.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="text-gray-900 font-medium">{emp.status}</span>
                          </div>
                          {emp.location && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="text-gray-900 font-medium">{emp.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h5 className="text-sm text-gray-700 font-semibold mb-3">TIMING</h5>
                        <div className="space-y-2 text-sm">
                          {emp.loginTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Login:</span>
                              <span className="text-gray-900 font-medium">{new Date(emp.loginTime).toLocaleString('en-GB')}</span>
                            </div>
                          )}
                          {emp.logoutTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Logout:</span>
                              <span className="text-gray-900 font-medium">{new Date(emp.logoutTime).toLocaleString('en-GB')}</span>
                            </div>
                          )}
                          {emp.workDurationHours && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="text-gray-900 font-medium">{emp.workDurationHours.toFixed(2)}h</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Online Only View */}
      {activeView === 'online' && (
        <div className="space-y-4">
          {employees.filter(e => e.status === 'ONLINE').length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border-2 border-gray-200 shadow-sm">
              <AlertCircle size={40} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No employees currently online</p>
            </div>
          ) : (
            employees.filter(e => e.status === 'ONLINE').map((emp, idx) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-green-50 rounded-xl p-6 border-2 border-green-200 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{emp.email}</h3>
                    <p className="text-green-700 font-semibold">{getWorkDuration(emp)} • Online</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Since</p>
                    <p className="text-green-700 font-bold">{new Date(emp.loginTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Stats View */}
      {activeView === 'stats' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Today's Work Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getDailyStats()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #d1d5db' }} />
                  <Bar dataKey="hoursWorked" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Work Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getWeeklyStats()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #d1d5db' }} />
                  <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default EmployeeTracker