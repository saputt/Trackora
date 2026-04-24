import { clsx } from 'clsx'

export default function Badge({ children, color = 'slate', size = 'md', className = '' }) {
  // Refined, muted palette — no neon colors
  const colors = {
    green:  'bg-[#EEF5E8] text-[#3A6B1C] border-[#C4DFB0]',
    yellow: 'bg-[#FEF3E2] text-[#92400E] border-[#FCD49A]',
    red:    'bg-[#FEF2F2] text-[#9B2C2C] border-[#FCA5A5]',
    orange: 'bg-[#FFF4ED] text-[#C45D1A] border-[#FDBA74]',
    slate:  'bg-[#F7F6F3] text-[#6B6860] border-[#E8E6E1]',
    blue:   'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]', // keep for info
    purple: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
  }
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        colors[color] || colors.slate,
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
