// API client placeholder
// Replace with real API client when backend is ready
// e.g. import axios from 'axios'
// export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}
