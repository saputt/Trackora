import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder = 'Pilih...', className = '', ...props },
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
        <select
          ref={ref}
          className={clsx(
            'w-full appearance-none bg-white border rounded-xl px-3.5 py-2.5 pr-9 text-sm text-[#1A1A18] transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#3A6B1C]/30 focus:border-[#3A6B1C]',
            error
              ? 'border-[#FCA5A5] bg-[#FEF2F2] text-[#9B2C2C]'
              : 'border-[#E8E6E1] hover:border-[#D4D0C8]',
            props.disabled && 'opacity-50 cursor-not-allowed bg-[#F7F6F3]',
            className
          )}
          {...props}
        >
          <option value="" className="text-[#A09D98]">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09D98] pointer-events-none" />
      </div>
      {error && <p className="text-xs text-[#9B2C2C]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#A09D98]">{hint}</p>}
    </div>
  )
})

export default Select
