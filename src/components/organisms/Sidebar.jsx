import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Truck, Bell, Settings, ChevronLeft, ChevronRight, Zap, LogOut, X
} from 'lucide-react'
import { useUIStore, useAuthStore } from '../../store'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vehicles', icon: Truck, label: 'Kendaraan' },
  { to: '/alerts', icon: Bell, label: 'Alerts & Prediksi' },
  { to: '/settings', icon: Settings, label: 'Pengaturan' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 h-screen sticky top-0 bg-white border-r border-[#E8E6E1] flex flex-col z-30 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#E8E6E1] gap-3 shrink-0">
        <div className="w-8 h-8 bg-[#3D6B1E] rounded-lg shadow-sm flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-[#1A1A18] text-base whitespace-nowrap tracking-tight"
            >
              FleetSense
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-hidden">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                isActive
                  ? 'bg-[#EEF5E8] text-[#3D6B1E]'
                  : 'text-[#6B6860] hover:bg-[#F7F6F3] hover:text-[#1A1A18]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-[#3D6B1E]' : 'text-[#A09D98] group-hover:text-[#6B6860]'}`} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Toggle */}
      <div className="p-2 border-t border-[#E8E6E1] flex flex-col gap-1 shrink-0">
        {/* User avatar */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[#EEF5E8] text-[#3D6B1E] flex items-center justify-center shrink-0 text-xs font-bold border border-[#C4DFB0]">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-xs font-semibold text-[#1A1A18] truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[#A09D98] truncate">{user?.role || 'Technician'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A09D98] hover:text-[#9B2C2C] hover:bg-[#FEF2F2] transition-all duration-150 group"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Keluar
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center p-2 rounded-xl text-[#A09D98] hover:bg-[#F7F6F3] hover:text-[#6B6860] transition-all"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
