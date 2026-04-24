import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  padding = 'md',
}) {
  const paddings = {
    none: '',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  return (
    <motion.div
      whileHover={hoverable ? { y: -1, boxShadow: '0 8px 24px rgba(26,26,24,0.09)' } : {}}
      onClick={onClick}
      className={clsx(
        'bg-white border border-[#E8E6E1] rounded-2xl',
        'shadow-[0_1px_3px_rgba(26,26,24,0.06),_0_2px_8px_rgba(26,26,24,0.03)]',
        hoverable && 'cursor-pointer transition-all',
        paddings[padding],
        className
      )}
    >
      {children}
    </motion.div>
  )
}
