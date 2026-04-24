import {
  mockVehicles,
  mockMaintenanceHistory,
  mockDashboardSummary,
  mockIssueTrend,
  mockComponentDistribution,
  mockHealthOverview,
  mockAlerts,
} from './mockData'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ─── Dashboard ───────────────────────────────────────────
export const getDashboardSummary = async () => {
  await delay(300)
  return mockDashboardSummary
}

export const getDashboardCharts = async () => {
  await delay(400)
  return {
    issueTrend: mockIssueTrend,
    componentDistribution: mockComponentDistribution,
    healthOverview: mockHealthOverview,
  }
}

// ─── Vehicles ────────────────────────────────────────────
export const getVehicles = async (filters = {}) => {
  await delay(350)
  let vehicles = [...mockVehicles]

  if (filters.status && filters.status !== 'all') {
    vehicles = vehicles.filter((v) => v.status === filters.status)
  }
  if (filters.type && filters.type !== 'all') {
    vehicles = vehicles.filter((v) => v.type === filters.type)
  }
  if (filters.risk && filters.risk !== 'all') {
    vehicles = vehicles.filter((v) => v.downtimeRisk === filters.risk)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    vehicles = vehicles.filter(
      (v) =>
        v.vehicleCode.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
    )
  }

  return vehicles
}

export const getVehicleById = async (id) => {
  await delay(300)
  const vehicle = mockVehicles.find((v) => v.id === id)
  if (!vehicle) throw new Error('Kendaraan tidak ditemukan')
  const history = mockMaintenanceHistory
    .filter((h) => h.vehicleId === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  return { ...vehicle, maintenanceHistory: history }
}

// ─── Maintenance Reports ──────────────────────────────────
export const createMaintenanceReport = async (data) => {
  await delay(600)
  const newReport = {
    id: `mh${Date.now()}`,
    ...data,
    date: new Date().toISOString().split('T')[0],
    technician: 'Teknisi Demo',
  }

  // Mutate mock data in-memory (dummy update)
  const vehicleIdx = mockVehicles.findIndex((v) => v.id === data.vehicleId)
  if (vehicleIdx !== -1) {
    mockVehicles[vehicleIdx].issueCount += 1
    mockVehicles[vehicleIdx].lastMaintenanceDate = newReport.date

    // Adjust health score dummy logic
    const severityPenalty = { low: 2, medium: 5, high: 10, critical: 20 }
    const penalty = severityPenalty[data.severity] || 5
    mockVehicles[vehicleIdx].healthScore = Math.max(
      0,
      mockVehicles[vehicleIdx].healthScore - penalty
    )

    // Update status based on new health
    const hs = mockVehicles[vehicleIdx].healthScore
    mockVehicles[vehicleIdx].status = hs >= 80 ? 'healthy' : hs >= 60 ? 'warning' : 'critical'
  }

  mockMaintenanceHistory.unshift(newReport)
  return newReport
}

// ─── Alerts ──────────────────────────────────────────────
export const getAlerts = async () => {
  await delay(300)
  return mockAlerts
}
