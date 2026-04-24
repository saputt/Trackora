import { motion } from 'framer-motion'
import Card from '../atoms/Card'

// Calm, muted color palette — no bright/electric colors
const schemes = {
  blue:   { dot: 'bg-[#3A6B1C]', label: 'text-[#3A6B1C]', bg: 'bg-[#EEF5E8]' }, // repurposed to green
  green:  { dot: 'bg-[#3D7A3A]', label: 'text-[#3D7A3A]', bg: 'bg-[#EEF7EE]' },
  yellow: { dot: 'bg-[#B45309]', label: 'text-[#B45309]', bg: 'bg-[#FEF3C7]' },
  red:    { dot: 'bg-[#9B2C2C]', label: 'text-[#9B2C2C]', bg: 'bg-[#FEF2F2]' },
  purple: { dot: 'bg-[#6D28D9]', label: 'text-[#6D28D9]', bg: 'bg-[#F5F3FF]' },
  orange: { dot: 'bg-[#C45D1A]', label: 'text-[#C45D1A]', bg: 'bg-[#FFF4ED]' },
}

export default function StatCard({ title, value, icon, color = 'blue', subtitle, trend }) {
  const s = schemes[color] || schemes.blue

  return (
    <Card className="flex flex-col gap-4 group">
      <div className="flex items-start justify-between">
        {/* Icon: small, calm, no heavy gradient */}
        <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
          <span className={s.label}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trend >= 0
              ? 'bg-[#EEF5E8] text-[#3A6B1C]'
              : 'bg-[#FEF2F2] text-[#9B2C2C]'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-[#6B6860] font-medium leading-tight">{title}</p>
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-[#1A1A18] mt-1 tabular-nums"
        >
          {value}
        </motion.p>
        {subtitle && <p className="text-xs text-[#A09D98] mt-0.5">{subtitle}</p>}
      </div>
    </Card>
  )
}
