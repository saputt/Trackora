import { useState } from 'react'
import { Bell, Search, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store'
import { Link } from 'react-router-dom'

export default function Topbar({ title }) {
  const { user } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-[#E8E6E1] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-semibold text-[#1A1A18]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-xl text-[#A09D98] hover:bg-[#F7F6F3] hover:text-[#6B6860] transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D97706] rounded-full border border-white" />
        </Link>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F7F6F3] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#EEF5E8] text-[#3D6B1E] flex items-center justify-center text-xs font-bold border border-[#C4DFB0]">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-[#1A1A18] hidden sm:block">{user?.name || 'User'}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#A09D98]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-[#E8E6E1] shadow-lg shadow-[#1A1A18]/5 py-1 z-50">
              <div className="px-3 py-2 border-b border-[#E8E6E1]">
                <p className="text-xs font-semibold text-[#1A1A18]">{user?.name}</p>
                <p className="text-xs text-[#A09D98]">{user?.email}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="block px-3 py-2 text-sm text-[#6B6860] hover:bg-[#F7F6F3]"
              >
                Profil & Pengaturan
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
