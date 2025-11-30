// src/contexts/AuthContext.tsx

import { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/auth.api'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE'
  status: string
  avatar?: string
  employee?: {
    employeeId: string
    department: string
    position: string
    location?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  isAuthenticated: boolean
  isSuperAdmin: boolean
  isAdmin: boolean
  isEmployee: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    // No token - not authenticated
    if (!token) {
      setLoading(false)
      setUser(null)
      return
    }

    // Restore user from localStorage immediately
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log('✅ User restored from localStorage:', parsedUser.email)
      } catch (e) {
        console.error('❌ Error parsing stored user:', e)
        localStorage.removeItem('user')
      }
    }

    try {
      // Verify token with backend
      console.log('🔄 Verifying authentication with backend...')
      const response = await authAPI.getCurrentUser()
      
      if (response.success && response.data) {
        console.log('✅ Backend verification successful:', response.data.email)
        setUser(response.data)
        // Update stored user with fresh data
        localStorage.setItem('user', JSON.stringify(response.data))
      } else {
        console.warn('⚠️ Backend returned success but no data')
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error('❌ Auth check failed:', error.message)
      
      // Check if it's a 401/403 (actual authentication failure)
      const isAuthError = error.response?.status === 401 || error.response?.status === 403
      
      if (isAuthError) {
        console.log('🚫 Authentication failed (401/403) - logging out')
        // Clear everything
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        toast.error('Session expired. Please login again.')
      } else {
        // Network error or other issue - keep user logged in
        console.log('🌐 Network/other error - keeping user logged in with cached data')
        
        // Make sure we have the stored user
        if (storedUser && !user) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            console.log('📦 Using cached user data:', parsedUser.email)
          } catch (e) {
            console.error('❌ Error parsing stored user on retry:', e)
            // If we can't parse stored user, log them out
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
          }
        }
      }
    } finally {
      setLoading(false)
      console.log('✅ Auth check complete')
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log('🔐 Attempting login for:', email)
      const response = await authAPI.login({ email, password })

      if (response.success && response.data) {
        const { token, user: userData, role } = response.data
        
        console.log('✅ Login successful:', userData.email, 'Role:', role)
        
        // Store token and user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        
        toast.success(`Welcome back, ${userData.firstName}!`)
        
        // Navigate based on role
        switch (role) {
          case 'SUPERADMIN':
            console.log('🎯 Navigating to: /superadmin/dashboard')
            navigate('/superadmin/dashboard', { replace: true })
            break
          case 'ADMIN':
            console.log('🎯 Navigating to: /admin/dashboard')
            navigate('/admin/dashboard', { replace: true })
            break
          case 'EMPLOYEE':
            console.log('🎯 Navigating to: /dashboard')
            navigate('/dashboard', { replace: true })
            break
          default:
            console.log('🎯 Navigating to: /')
            navigate('/', { replace: true })
        }
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    console.log('👋 Logging out...')
    try {
      await authAPI.logout()
      console.log('✅ Logout API call successful')
    } catch (error) {
      console.error('⚠️ Logout API error (continuing anyway):', error)
    } finally {
      // Always clear local state and storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      navigate('/login', { replace: true })
      toast.success('Logged out successfully')
      console.log('✅ Logout complete')
    }
  }

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'SUPERADMIN',
        isAdmin: user?.role === 'ADMIN',
        isEmployee: user?.role === 'EMPLOYEE'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}