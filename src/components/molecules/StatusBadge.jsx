import Badge from '../atoms/Badge'
import { getStatusColor, getRiskColor, getSeverityColor } from '../../utils/healthScore'
import { getStatusLabel, getRiskLabel, getSeverityLabel } from '../../utils/formatters'

export function StatusBadge({ status }) {
  const colorMap = { healthy: 'green', warning: 'yellow', critical: 'red' }
  return (
    <Badge color={colorMap[status] || 'slate'}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
      {getStatusLabel(status)}
    </Badge>
  )
}

export function RiskBadge({ risk }) {
  const colorMap = { low: 'green', medium: 'yellow', high: 'red' }
  return (
    <Badge color={colorMap[risk] || 'slate'}>
      {getRiskLabel(risk)}
    </Badge>
  )
}

export function SeverityBadge({ severity }) {
  const colorMap = { low: 'slate', medium: 'yellow', high: 'orange', critical: 'red' }
  return (
    <Badge color={colorMap[severity] || 'slate'}>
      {getSeverityLabel(severity)}
    </Badge>
  )
}
