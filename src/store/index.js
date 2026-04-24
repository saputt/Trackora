import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
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
