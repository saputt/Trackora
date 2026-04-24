export const getHealthScoreColor = (score) => {
  if (score >= 80) return 'text-[#3D7A3A]' // healthy
  if (score >= 60) return 'text-[#B45309]' // warning
  return 'text-[#9B2C2C]' // critical
}

export const getHealthScoreBg = (score) => {
  if (score >= 80) return 'bg-[#EEF7EE]'
  if (score >= 60) return 'bg-[#FEF3C7]'
  return 'bg-[#FEF2F2]'
}

export const getHealthScoreBorder = (score) => {
  if (score >= 80) return 'border-[#C4DFB0]'
  if (score >= 60) return 'border-[#FCD49A]'
  return 'border-[#FCA5A5]'
}

export const getHealthScoreBar = (score) => {
  if (score >= 80) return 'bg-[#3D7A3A]'
  if (score >= 60) return 'bg-[#B45309]'
  return 'bg-[#9B2C2C]'
}

export const getStatusColor = (status) => {
  const map = {
    healthy: 'text-[#3D7A3A] bg-[#EEF7EE] border-[#C4DFB0]',
    warning: 'text-[#B45309] bg-[#FEF3C7] border-[#FCD49A]',
    critical: 'text-[#9B2C2C] bg-[#FEF2F2] border-[#FCA5A5]',
  }
  return map[status] || 'text-[#6B6860] bg-[#F7F6F3] border-[#E8E6E1]'
}

export const getRiskColor = (risk) => {
  const map = {
    low: 'text-[#3D7A3A] bg-[#EEF7EE] border-[#C4DFB0]',
    medium: 'text-[#B45309] bg-[#FEF3C7] border-[#FCD49A]',
    high: 'text-[#9B2C2C] bg-[#FEF2F2] border-[#FCA5A5]',
  }
  return map[risk] || 'text-[#6B6860] bg-[#F7F6F3] border-[#E8E6E1]'
}

export const getSeverityColor = (severity) => {
  const map = {
    low: 'text-[#6B6860] bg-[#F7F6F3] border-[#E8E6E1]',
    medium: 'text-[#B45309] bg-[#FEF3C7] border-[#FCD49A]',
    high: 'text-[#C45D1A] bg-[#FFF4ED] border-[#FDBA74]',
    critical: 'text-[#9B2C2C] bg-[#FEF2F2] border-[#FCA5A5]',
  }
  return map[severity] || 'text-[#6B6860] bg-[#F7F6F3] border-[#E8E6E1]'
}
