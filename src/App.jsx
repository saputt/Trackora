import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'
import { refreshUserSession } from './services/authService'

// Pages
import LandingPage from './pages/landing/index'
import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'
import DashboardPage from './pages/dashboard/index'
import VehiclesPage from './pages/vehicles/index'
import VehicleDetailPage from './pages/vehicles/detail'
import NewReportPage from './pages/vehicles/new-report'
import SettingsPage from './pages/settings/index'
import AlertsPage from './pages/alerts'

function ProtectedRoute({ children }) {
  const { isAuthenticated, authResolved } = useAuthStore()

  // Tunggu proses restore session selesai dulu
  if (!authResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <div className="w-8 h-8 border-4 border-[#3A6B1C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { setAuthSession, clearAuthSession } = useAuthStore()

  // Restore session dari refresh token (cookie HttpOnly) saat pertama kali load
  useEffect(() => {
    refreshUserSession()
      .then((auth) => setAuthSession(auth))
      .catch(() => clearAuthSession())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
        <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleDetailPage /></ProtectedRoute>} />
        <Route path="/vehicles/:id/report" element={<ProtectedRoute><NewReportPage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
