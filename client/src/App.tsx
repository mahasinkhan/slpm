import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public Pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Divisions from './pages/public/Divisions'
import Services from './pages/public/Services'
import Projects from './pages/public/Projects'
import News from './pages/public/News'
import Contact from './pages/public/Contact'
import Careers from './pages/public/Careers'

// Auth Pages
import Login from './pages/auth/Login'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminInterviews from './pages/admin/Interviews'
import AdminEmployees from './pages/admin/Employees'

// Super Admin Pages - Dashboard
import SuperAdminDashboard from './pages/superadmin/Dashboard'

// Super Admin Pages - Users
import UserManagement from './pages/superadmin/Users/UserManagement'
import UserDetails from './pages/superadmin/Users/UserDetails'
import UserActivity from './pages/superadmin/Users/UserActivity'

// Super Admin Pages - Analytics
import RealtimeAnalytics from './pages/superadmin/Analytics/RealtimeAnalytics'
import ReportsAnalytics from './pages/superadmin/Analytics/Reports'
import SystemMetrics from './pages/superadmin/Analytics/SystemMetrics'

// Super Admin Pages - Security
import AuditLogs from './pages/superadmin/Security/AuditLogs'
import SecuritySettings from './pages/superadmin/Security/SecuritySettings'
import AccessControl from './pages/superadmin/Security/AccessControl'

// Super Admin Pages - System
import SystemHealth from './pages/superadmin/System/SystemHealth'
import DatabaseManagement from './pages/superadmin/System/DatabaseManagement'
import APIMonitor from './pages/superadmin/System/APIMonitor'

// Super Admin Pages - Media & Content Management
import CMSManagement from './pages/superadmin/Media/CMSManagement'
import MediaLibrary from './pages/superadmin/Media/MediaLibrary'
import NewsManagement from './pages/superadmin/Media/NewsManagement'
import BlogPostsList from './pages/superadmin/Media/BlogPostsList'
import BlogPosts from './pages/superadmin/Media/BlogPosts'

// Super Admin Pages - Approvals
import PendingApprovals from './pages/superadmin/Approvals/PendingApprovals'
import ApprovalHistory from './pages/superadmin/Approvals/ApprovalHistory'

// Super Admin Pages - Settings
import GlobalSettings from './pages/superadmin/Settings/GlobalSettings'
import Integrations from './pages/superadmin/Settings/Integrations'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/divisions" element={<Divisions />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/interviews"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                <AdminInterviews />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                <AdminEmployees />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes - Dashboard */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes - Users */}
          <Route
            path="/superadmin/users"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/users/:id"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/users/activity"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <UserActivity />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes - Analytics */}
          <Route
            path="/superadmin/analytics/realtime"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <RealtimeAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/analytics/reports"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <ReportsAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/analytics/metrics"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <SystemMetrics />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes - Security */}
          <Route
            path="/superadmin/security/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/security/settings"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <SecuritySettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/security/access-control"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <AccessControl />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes - System */}
          <Route
            path="/superadmin/system/health"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <SystemHealth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/system/database"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <DatabaseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/system/api-monitor"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <APIMonitor />
              </ProtectedRoute>
            }
          />
          
          {/* Super Admin Routes - Media & Content Management */}
          <Route
            path="/superadmin/cms"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <CMSManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/media-library"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <MediaLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/news-management"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <NewsManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Blog Posts Routes */}
          <Route
            path="/superadmin/blog-posts"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <BlogPostsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/blog-posts/new"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <BlogPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/blog-posts/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <BlogPosts />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes - Approvals */}
          <Route
            path="/superadmin/approvals/pending"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/approvals/history"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <ApprovalHistory />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes - Settings */}
          <Route
            path="/superadmin/settings/global"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <GlobalSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/settings/integrations"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <Integrations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#003366',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App