import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { X, Search, Truck, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { getVehicles } from '../../services/vehicleService'
import { clsx } from 'clsx'

const statusConfig = {
  healthy: {
    label: 'Sehat',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    className: 'text-[#3A6B1C] bg-[#EEF7EE] border-[#C4DFB0]',
  },
  warning: {
    label: 'Perhatian',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    className: 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]',
  },
  critical: {
    label: 'Kritis',
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: 'text-[#9B2C2C] bg-[#FEF2F2] border-[#FECACA]',
  },
}

function StatusChip({ status }) {
  const cfg = statusConfig[status] || statusConfig.healthy
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium', cfg.className)}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

export default function VehiclePickerModal({ open, onClose }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', {}],
    queryFn: () => getVehicles({}),
    enabled: open,
  })

  // Focus search on open
  useEffect(() => {
    if (open) {
      setSearch('')
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase()
    return (
      v.vehicleCode?.toLowerCase().includes(q) ||
      v.name?.toLowerCase().includes(q) ||
      v.type?.toLowerCase().includes(q) ||
      v.licensePlate?.toLowerCase().includes(q)
    )
  })

  const handleSelect = (vehicle) => {
    onClose()
    navigate(`/vehicles/${vehicle.id}/report`)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-[#E8E6E1] w-full max-w-md pointer-events-auto flex flex-col max-h-[80vh]">
              
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F0EDE8]">
                <div>
                  <h2 className="text-base font-bold text-[#1A1A18]">Pilih Kendaraan</h2>
                  <p className="text-xs text-[#A09D98] mt-0.5">Pilih kendaraan untuk membuat laporan baru</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#A09D98] hover:bg-[#F7F6F3] hover:text-[#1A1A18] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="px-5 py-3 border-b border-[#F0EDE8]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A09D98]" />
                  <input
                    ref={searchRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kode, nama, atau plat nomor..."
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#F7F6F3] border border-[#E8E6E1] rounded-xl placeholder-[#A09D98] text-[#1A1A18] focus:outline-none focus:ring-2 focus:ring-[#3A6B1C]/30 focus:border-[#3A6B1C] transition-all"
                  />
                </div>
              </div>

              {/* Vehicle List */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-[#F7F6F3] animate-pulse" />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <Truck className="w-8 h-8 text-[#D4D0C8] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#6B6860]">Kendaraan tidak ditemukan</p>
                    <p className="text-xs text-[#A09D98] mt-1">Coba dengan kata kunci lain</p>
                  </div>
                ) : (
                  filtered.map((vehicle) => (
                    <motion.button
                      key={vehicle.id}
                      whileHover={{ scale: 1.008 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => handleSelect(vehicle)}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E8E6E1] hover:border-[#3A6B1C]/40 hover:bg-[#F7FBF4] transition-all group text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#F0EDE8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8F2E4] transition-colors">
                          <Truck className="w-4 h-4 text-[#6B6860] group-hover:text-[#3A6B1C]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1A1A18] truncate">{vehicle.vehicleCode}</span>
                            <StatusChip status={vehicle.status} />
                          </div>
                          <p className="text-xs text-[#A09D98] mt-0.5 truncate">
                            {vehicle.licensePlate} · {vehicle.type}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#D4D0C8] group-hover:text-[#3A6B1C] flex-shrink-0 ml-2 transition-colors" />
                    </motion.button>
                  ))
                )}
              </div>

              {/* Footer count */}
              {!isLoading && filtered.length > 0 && (
                <div className="px-5 py-3 border-t border-[#F0EDE8]">
                  <p className="text-xs text-[#A09D98] text-center">
                    {filtered.length} kendaraan {search ? 'ditemukan' : 'tersedia'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
