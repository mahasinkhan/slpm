// src/api/axios.config.ts
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('Network error:', error.message)
      // Don't show toast for auth check failures
      if (!error.config?.url?.includes('/auth/me') && !error.config?.url?.includes('/auth/profile')) {
        toast.error('Network error. Please check your connection.')
      }
      return Promise.reject(error)
    }

    const status = error.response?.status
    const url = error.config?.url || ''

    // Handle 401 - Unauthorized
    if (status === 401) {
      // CRITICAL: Don't redirect on auth check endpoints
      // Let AuthContext handle these gracefully
      if (url.includes('/auth/me') || url.includes('/auth/profile') || url.includes('/auth/getCurrentUser')) {
        // This is an auth verification request failing
        // Don't redirect - let AuthContext decide what to do
        console.log('Auth verification failed, letting AuthContext handle it')
      } else {
        // This is an actual authenticated request failing
        // Only then should we clear and redirect
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          toast.error('Session expired. Please login again.')
        }
      }
    } 
    // Handle 403 - Forbidden
    else if (status === 403) {
      toast.error('Access denied. Insufficient permissions.')
    } 
    // Handle 500+ - Server errors
    else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    // Handle 404 - Not found (only show for non-auth endpoints)
    else if (status === 404 && !url.includes('/auth/')) {
      toast.error('Resource not found.')
    }

    return Promise.reject(error)
  }
)

export default api