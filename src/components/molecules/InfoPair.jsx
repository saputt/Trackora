export default function InfoPair({ label, value, className = '' }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value || '—'}</span>
    </div>
  )
}
