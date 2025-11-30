import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
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

// Admin Pages - Job Management
import JobList from './pages/admin/jobs/JobList'
import CreateJob from './pages/admin/jobs/CreateJob'
import JobDetails from './pages/admin/jobs/JobDetails'
import EditJob from './pages/admin/jobs/EditJob'
import PublishJob from './pages/admin/jobs/PublishJob'
import PublishedJobs from './pages/admin/jobs/PublishJob'
import DraftJobs from './pages/admin/jobs/DraftJobs'

// Admin Pages - Application Management
import ApplicationsList from './pages/admin/applications/ApplicationsList'
import ApplicationDetails from './pages/admin/applications/ApplicationDetails'
import ReviewApplication from './pages/admin/applications/ReviewApplication'

// Super Admin Pages - Dashboard (Single Import - handles all internal routing)
import SuperAdminDashboard from './pages/superadmin/Dashboard'

// ==================== EMPLOYEE PORTAL IMPORTS ====================
import EmployeeLayout from './pages/employee/EmployeeLayout'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'

// Employee - Attendance
import CheckInOut from './pages/employee/attendance/CheckInOut'
import MyAttendance from './pages/employee/attendance/MyAttendance'

// Employee - Leaves
import MyLeaves from './pages/employee/leaves/MyLeaves'
import ApplyLeave from './pages/employee/leaves/ApplyLeave'
import LeaveHistory from './pages/employee/leaves/LeaveHistory'

// Employee - Tasks
import MyTasks from './pages/employee/tasks/MyTasks'
import TaskDetails from './pages/employee/tasks/TaskDetails'

// Employee - Payroll
import MyPayslips from './pages/employee/payroll/MyPayslips'
import SalaryDetails from './pages/employee/payroll/SalaryDetails'

// Employee - Documents
import MyDocuments from './pages/employee/documents/MyDocuments'
import ViewDocument from './pages/employee/documents/ViewDocument'

// Employee - Profile
import MyProfile from './pages/employee/profile/MyProfile'
import EditProfile from './pages/employee/profile/EditProfile'

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  switch (user.role) {
    case 'SUPERADMIN':
      return <Navigate to="/superadmin" replace />
    case 'ADMIN':
      return <Navigate to="/admin" replace />
    case 'EMPLOYEE':
      return <Navigate to="/employee/dashboard" replace />
    default:
      return <Navigate to="/" replace />
  }
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ==================== DASHBOARD REDIRECT ROUTE ==================== */}
        {/* This catches any /dashboard redirects and sends to correct location */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN', 'SUPERADMIN']}>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* ==================== PUBLIC ROUTES (with Layout) ==================== */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/divisions" element={<Divisions />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ==================== ADMIN ROUTES (No public layout - has own AdminLayout) ==================== */}
        
        {/* Admin - Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin - Interviews */}
        <Route
          path="/admin/interviews"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <AdminInterviews />
            </ProtectedRoute>
          }
        />

        {/* Admin - Job Management */}
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <JobList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/create"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/published"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <PublishedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/drafts"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <DraftJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/publish/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <PublishJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin - Application Management */}
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <ApplicationsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/new"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <ApplicationsList filterStatus="NEW" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/shortlisted"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <ApplicationsList filterStatus="SHORTLISTED" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/rejected"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <ApplicationsList filterStatus="REJECTED" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/:id/review"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <ReviewApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
              <ApplicationDetails />
            </ProtectedRoute>
          }
        />

        {/* ==================== SUPERADMIN ROUTES (No layout - Self-contained) ==================== */}
        {/* 
          IMPORTANT: SuperAdmin Dashboard handles its own internal routing.
          All /superadmin/* routes render the same component which manages navigation internally.
        */}
        <Route
          path="/superadmin/*"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================== EMPLOYEE PORTAL ROUTES (Has own EmployeeLayout) ==================== */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN', 'SUPERADMIN']}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          {/* Employee Dashboard */}
          <Route index element={<EmployeeDashboard />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />

          {/* Employee Attendance */}
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="attendance/checkin" element={<CheckInOut />} />

          {/* Employee Leaves */}
          <Route path="leaves" element={<MyLeaves />} />
          <Route path="leaves/apply" element={<ApplyLeave />} />
          <Route path="leaves/history" element={<LeaveHistory />} />

          {/* Employee Tasks */}
          <Route path="tasks" element={<MyTasks />} />
          <Route path="tasks/:id" element={<TaskDetails />} />

          {/* Employee Payroll */}
          <Route path="payroll" element={<MyPayslips />} />
          <Route path="payroll/:id" element={<SalaryDetails />} />

          {/* Employee Documents */}
          <Route path="documents" element={<MyDocuments />} />
          <Route path="documents/:id" element={<ViewDocument />} />

          {/* Employee Profile */}
          <Route path="profile" element={<MyProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
        </Route>
      </Routes>
      
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