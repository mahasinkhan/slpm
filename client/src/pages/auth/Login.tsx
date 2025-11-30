// src/pages/auth/Login.tsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      await login(email, password)
      setSuccess('Login successful! Redirecting...')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    }
  }

  const fillDemoCredentials = (role: 'superadmin' | 'admin' | 'employee') => {
    const credentials = {
      superadmin: { email: 'superadmin@slbrothers.co.uk', password: 'superadmin123' },
      admin: { email: 'michael.c@slbrothers.co.uk', password: 'admin123' },
      employee: { email: 'sarah.j@slbrothers.co.uk', password: 'employee123' }
    }
    setEmail(credentials[role].email)
    setPassword(credentials[role].password)
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" 
            alt="Modern office workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/90 via-[#003366]/70 to-[#002244]/90" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-center max-w-lg"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
              <span className="text-[#003366] font-black text-4xl tracking-wider">SLB</span>
            </motion.div>

            <h1 className="text-5xl font-black mb-4 leading-tight">
              SL Brothers
            </h1>
            <p className="text-xl text-[#C0C0C0] mb-8 italic">
              Empowering Progress Together
            </p>

            <div className="space-y-4 text-left">
              {[
                'Secure Staff Portal Access',
                'Real-time Collaboration',
                'Advanced Analytics',
                'Project Management'
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-[#C0C0C0] rounded-full" />
                  <span className="text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
            {/* Logo for Mobile */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#004488] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-white font-black text-2xl tracking-wider">SLB</span>
              </div>
              <h1 className="text-xl font-bold text-[#003366] mb-1">SL Brothers</h1>
              <p className="text-sm text-[#C0C0C0] italic">Empowering Progress Together</p>
            </div>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#003366] mb-2">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                SL Brothers Ltd Staff Portal
              </p>
            </div>

            {/* Alert Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
                >
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3"
                >
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-green-700">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#003366] focus:outline-none transition-colors text-gray-900 text-sm sm:text-base"
                    placeholder="your.email@slbrothers.co.uk"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#003366] focus:outline-none transition-colors text-gray-900 text-sm sm:text-base"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-xs sm:text-sm font-semibold text-[#003366] hover:text-[#004488]">
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#003366] to-[#004488] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-100">
              <p className="text-xs sm:text-sm font-bold text-[#003366] mb-2.5 sm:mb-3 flex items-center space-x-2">
                <Sparkles size={14} className="sm:w-4 sm:h-4" />
                <span>Quick Demo Access:</span>
              </p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { role: 'superadmin', label: 'Super Admin', shortLabel: 'Super', color: 'from-purple-500 to-purple-600' },
                  { role: 'admin', label: 'Admin', shortLabel: 'Admin', color: 'from-blue-500 to-blue-600' },
                  { role: 'employee', label: 'Employee', shortLabel: 'Staff', color: 'from-green-500 to-green-600' }
                ].map((demo) => (
                  <motion.button
                    key={demo.role}
                    type="button"
                    onClick={() => fillDemoCredentials(demo.role as 'superadmin' | 'admin' | 'employee')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r ${demo.color} text-white text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg hover:shadow-md transition-all`}
                  >
                    <span className="hidden sm:inline">{demo.label}</span>
                    <span className="sm:hidden">{demo.shortLabel}</span>
                  </motion.button>
                ))}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-2 sm:mt-3 text-center">
                Click any role to auto-fill credentials
              </p>
            </div>

            {/* Sign Up Link */}
            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{' '}
                <button type="button" className="font-semibold text-[#003366] hover:text-[#004488]">
                  Request Access
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login