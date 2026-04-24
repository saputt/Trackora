import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(function Input(
  { label, error, hint, className = '', icon, rightIcon, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A18]">
          {label}
          {props.required && <span className="text-[#9B2C2C] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A09D98]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A18] placeholder-[#A09D98] transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#3A6B1C]/30 focus:border-[#3A6B1C]',
            error
              ? 'border-[#FCA5A5] bg-[#FEF2F2]'
              : 'border-[#E8E6E1] hover:border-[#D4D0C8] bg-white',
            icon && 'pl-10',
            rightIcon && 'pr-10',
            props.readOnly && 'bg-[#F7F6F3] text-[#6B6860] cursor-default',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09D98]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#9B2C2C] flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[#A09D98]">{hint}</p>}
    </div>
  )
})

export default Input
