import { create } from 'zustand'
import { clearAccessToken, setAccessToken } from '../api/client'

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authResolved: false,
  setAuthSession: ({ user, accessToken }) => {
    setAccessToken(accessToken)
    set({ user, accessToken, isAuthenticated: true, authResolved: true })
  },
  clearAuthSession: () => {
    clearAccessToken()
    set({ user: null, accessToken: null, isAuthenticated: false, authResolved: true })
  },
  setAuthResolved: (authResolved) => set({ authResolved }),
  login: (userData) => {
    setAccessToken(userData?.accessToken || null)
    set({
      user: userData?.user || userData,
      accessToken: userData?.accessToken || null,
      isAuthenticated: true,
      authResolved: true,
    })
  },
  logout: () => {
    clearAccessToken()
    set({ user: null, accessToken: null, isAuthenticated: false, authResolved: true })
  },
}))

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

export const useVehicleStore = create((set) => ({
  selectedVehicle: null,
  setSelectedVehicle: (v) => set({ selectedVehicle: v }),

  vehicleFilters: { search: '', status: 'all', type: 'all', risk: 'all' },
  setVehicleFilters: (filters) =>
    set((s) => ({ vehicleFilters: { ...s.vehicleFilters, ...filters } })),
  resetFilters: () =>
    set({ vehicleFilters: { search: '', status: 'all', type: 'all', risk: 'all' } }),
}))

export const useReportStore = create((set) => ({
  draftReport: {},
  setDraftReport: (data) => set((s) => ({ draftReport: { ...s.draftReport, ...data } })),
  clearDraft: () => set({ draftReport: {} }),
}))
