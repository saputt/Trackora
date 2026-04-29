import { apiGet, apiPost } from '../api/client'

const normalizeArray = (payload) => payload?.data ?? []
const normalizeObject = (payload) => payload?.data ?? null

const buildVehiclesQuery = (filters = {}) => {
  const params = new URLSearchParams()
  const add = (key, value) => {
    if (value === undefined || value === null) return
    const normalized = String(value).trim()
    if (!normalized || normalized === 'all') return
    params.set(key, normalized)
  }

  add('search', filters.search)
  add('status', filters.status)
  add('type', filters.type)
  add('risk', filters.risk)

  const query = params.toString()
  return query ? `/vehicles?${query}` : '/vehicles'
}

// ─── Dashboard ───────────────────────────────────────────
export const getDashboardSummary = async () => {
  const payload = await apiGet('/dashboard/summary')
  return normalizeObject(payload)
}

export const getDashboardCharts = async () => {
  const payload = await apiGet('/dashboard/charts')
  return normalizeObject(payload)
}

// ─── Vehicles ────────────────────────────────────────────
export const getVehicles = async (filters = {}) => {
  const payload = await apiGet(buildVehiclesQuery(filters))
  return normalizeArray(payload)
}

export const getVehicleById = async (id) => {
  const payload = await apiGet(`/vehicles/${id}`)
  return normalizeObject(payload)
}

// ─── Maintenance Reports ──────────────────────────────────
export const createMaintenanceReport = async (data) => {
  const payload = await apiPost('/maintenance', data)
  return normalizeObject(payload)
}

// ─── Alerts ──────────────────────────────────────────────
export const getAlerts = async () => {
  const payload = await apiGet('/alerts')
  return normalizeArray(payload)
}
