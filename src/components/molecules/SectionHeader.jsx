export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-base font-semibold text-[#1A1A18] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#A09D98] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
