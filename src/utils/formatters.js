export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

export const formatRelativeDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  return formatDate(dateStr)
}

export const formatNumber = (n) => {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString('id-ID')
}

export const formatMileage = (km) => {
  if (!km) return '—'
  return `${km.toLocaleString('id-ID')} km`
}

export const getStatusLabel = (status) => {
  const map = {
    healthy: 'Sehat',
    warning: 'Peringatan',
    critical: 'Kritis',
  }
  return map[status] || status
}

export const getSeverityLabel = (severity) => {
  const map = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    critical: 'Kritis',
  }
  return map[severity] || severity
}

export const getRiskLabel = (risk) => {
  const map = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
  }
  return map[risk] || risk
}
