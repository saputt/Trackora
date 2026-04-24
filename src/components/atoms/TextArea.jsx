import { forwardRef } from 'react'
import { clsx } from 'clsx'

const TextArea = forwardRef(function TextArea({ label, error, hint, className = '', rows = 4, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A18]">
          {label}
          {props.required && <span className="text-[#9B2C2C] ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A18] placeholder-[#A09D98] transition-all duration-150 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-[#3A6B1C]/30 focus:border-[#3A6B1C]',
          error
            ? 'border-[#FCA5A5] bg-[#FEF2F2]'
            : 'border-[#E8E6E1] hover:border-[#D4D0C8]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#9B2C2C]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#A09D98]">{hint}</p>}
    </div>
  )
})

export default TextArea
