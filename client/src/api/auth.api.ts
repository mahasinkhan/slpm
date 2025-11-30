// src/api/auth.api.ts

import api from './axios.config'
import { ApiResponse } from '../types/api.types'

interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
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
  role: string
}

interface RegisterAdminData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  department?: string
  position?: string
  location?: string
  salary?: number
}

interface RegisterEmployeeData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  department: string
  position: string
  location?: string
  salary?: number
}

interface ChangePasswordData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export const authAPI = {
  // Login
  login: async (data: LoginData) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data)
    return response.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get<ApiResponse<LoginResponse['user']>>('/auth/profile')
    return response.data
  },

  // Get current user (verify token)
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<LoginResponse['user']>>('/auth/me')
    return response.data
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/change-password', data)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/logout')
    return response.data
  },

  // Register Admin (SUPERADMIN only)
  registerAdmin: async (data: RegisterAdminData) => {
    const response = await api.post<ApiResponse<LoginResponse['user'] & { tempPassword: string }>>(
      '/auth/register-admin',
      data
    )
    return response.data
  },

  // Register Employee (SUPERADMIN or ADMIN)
  registerEmployee: async (data: RegisterEmployeeData) => {
    const response = await api.post<ApiResponse<LoginResponse['user'] & { tempPassword: string }>>(
      '/auth/register-employee',
      data
    )
    return response.data
  }
}