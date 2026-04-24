import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const variants = {
  primary: 'bg-[#3A6B1C] text-white hover:bg-[#2D5016] shadow-sm',
  secondary: 'bg-white text-[#1A1A18] border border-[#E8E6E1] hover:bg-[#F7F6F3] hover:border-[#D4D0C8]',
  danger: 'bg-[#9B2C2C] text-white hover:bg-[#7B2222] shadow-sm',
  ghost: 'bg-transparent text-[#6B6860] hover:bg-[#F0EDE8] hover:text-[#1A1A18]',
  success: 'bg-[#2D6A4F] text-white hover:bg-[#245A42] shadow-sm',
  amber: 'bg-[#C45D1A] text-white hover:bg-[#A84D14] shadow-sm',
}

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  xl: 'px-8 py-3.5 text-base rounded-2xl gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.975 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A6B1C] focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}
