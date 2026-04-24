import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Truck, ChevronRight, ArrowUpDown } from 'lucide-react'
import DashboardLayout from '../../components/templates/DashboardLayout'
import Card from '../../components/atoms/Card'
import SearchInput from '../../components/molecules/SearchInput'
import { StatusBadge, RiskBadge } from '../../components/molecules/StatusBadge'
import Button from '../../components/atoms/Button'
import EmptyState from '../../components/molecules/EmptyState'
import { getVehicles } from '../../services/vehicleService'
import { useVehicleStore } from '../../store'
import { formatDate } from '../../utils/formatters'
import { getHealthScoreBar } from '../../utils/healthScore'

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'healthy', label: 'Sehat' },
  { value: 'warning', label: 'Peringatan' },
  { value: 'critical', label: 'Kritis' },
]

const riskOptions = [
  { value: 'all', label: 'Semua Risiko' },
  { value: 'low', label: 'Rendah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'high', label: 'Tinggi' },
]

const typeOptions = [
  { value: 'all', label: 'Semua Tipe' },
  { value: 'Truk Berat', label: 'Truk Berat' },
  { value: 'Truk Sedang', label: 'Truk Sedang' },
  { value: 'Van Penumpang', label: 'Van Penumpang' },
  { value: 'Mini Bus', label: 'Mini Bus' },
  { value: 'Bus', label: 'Bus' },
  { value: 'Pick Up', label: 'Pick Up' },
]

function HealthBar({ score }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${getHealthScoreBar(score)}`}
        />
      </div>
      <span className="text-xs font-semibold text-[#1A1A18] tabular-nums">{score}</span>
    </div>
  )
}

export default function VehiclesPage() {
  const navigate = useNavigate()
  const { vehicleFilters, setVehicleFilters } = useVehicleStore()
  const [sortField, setSortField] = useState('healthScore')
  const [sortAsc, setSortAsc] = useState(true)

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', vehicleFilters],
    queryFn: () => getVehicles(vehicleFilters),
  })

  const sorted = [...vehicles].sort((a, b) => {
    let av = a[sortField], bv = b[sortField]
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    return sortAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1)
  })

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc)
    else { setSortField(field); setSortAsc(true) }
  }

  return (
    <DashboardLayout title="Operasional Armada">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-[28px] font-bold text-[#1A1A18] tracking-tight">Katalog Kendaraan</h2>
            <p className="text-[#6B6860] mt-1 text-sm">{vehicles.length} unit terdaftar dalam sistem pemantauan.</p>
          </div>
        </div>

        {/* Filters */}
        <Card padding="sm" className="bg-[#FFFFFF]">
          <div className="flex flex-wrap gap-4">
            <SearchInput
              value={vehicleFilters.search}
              onChange={(e) => setVehicleFilters({ search: e.target.value })}
              placeholder="Cari NOPOL, ID, atau model..."
              className="flex-1 min-w-[240px]"
            />
            <select
              value={vehicleFilters.status}
              onChange={(e) => setVehicleFilters({ status: e.target.value })}
              className="border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1A1A18] bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6B1C]/30 focus:border-[#3A6B1C]"
            >
              {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={vehicleFilters.type}
              onChange={(e) => setVehicleFilters({ type: e.target.value })}
              className="border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1A1A18] bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6B1C]/30 focus:border-[#3A6B1C]"
            >
              {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={vehicleFilters.risk}
              onChange={(e) => setVehicleFilters({ risk: e.target.value })}
              className="border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1A1A18] bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6B1C]/30 focus:border-[#3A6B1C]"
            >
              {riskOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {(vehicleFilters.status !== 'all' || vehicleFilters.type !== 'all' || vehicleFilters.risk !== 'all' || vehicleFilters.search) && (
              <Button variant="ghost" size="md" onClick={() => setVehicleFilters({ search: '', status: 'all', type: 'all', risk: 'all' })}>
                Bersihkan
              </Button>
            )}
          </div>
        </Card>

        {/* Executive Table */}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E6E1] bg-[#F7F6F3]">
                  {[
                    { label: 'Identitas', field: 'vehicleCode' },
                    { label: 'Kategori', field: 'type' },
                    { label: 'Indeks Kesehatan', field: 'healthScore' },
                    { label: 'Status Eksekusi', field: 'status' },
                    { label: 'Level Risiko', field: 'downtimeRisk' },
                    { label: 'Validasi Terakhir', field: 'lastMaintenanceDate' },
                    { label: 'Prediksi Servis', field: 'nextMaintenanceDate' },
                    { label: '', field: null },
                  ].map((col) => (
                    <th key={col.label}
                      onClick={() => col.field && toggleSort(col.field)}
                      className={`px-5 py-4 text-xs font-semibold text-[#6B6860] uppercase tracking-wider whitespace-nowrap ${col.field ? 'cursor-pointer hover:text-[#1A1A18] select-none transition-colors' : ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        {col.field && <ArrowUpDown className="h-3 w-3 text-[#A09D98]" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="h-10 bg-[#F7F6F3] rounded-lg animate-pulse" /></td></tr>
                  ))
                ) : sorted.length === 0 ? (
                  <tr><td colSpan={8}>
                    <EmptyState icon={<Truck className="h-8 w-8 text-[#A09D98]" />} title="Tidak ada data" description="Ubah kriteria filter Anda" />
                  </td></tr>
                ) : (
                  sorted.map((v, i) => (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                      className="hover:bg-[#F7F6F3] cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#EEF5E8] rounded-xl flex items-center justify-center border border-[#C4DFB0]">
                            <Truck className="h-5 w-5 text-[#3A6B1C]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1A1A18] tracking-tight">{v.vehicleCode}</p>
                            <p className="text-xs text-[#6B6860] truncate max-w-40 mt-0.5">{v.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#1A1A18] font-medium">{v.type}</td>
                      <td className="px-5 py-4 w-40">
                        <HealthBar score={v.healthScore} />
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={v.status} /></td>
                      <td className="px-5 py-4"><RiskBadge risk={v.downtimeRisk} /></td>
                      <td className="px-5 py-4 text-sm text-[#6B6860] tabular-nums">{formatDate(v.lastMaintenanceDate)}</td>
                      <td className="px-5 py-4 text-sm text-[#6B6860] tabular-nums font-medium">{formatDate(v.nextMaintenanceDate)}</td>
                      <td className="px-5 py-4text-right">
                        <ChevronRight className="h-5 w-5 text-[#A09D98] group-hover:text-[#3A6B1C] transition-colors" />
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
