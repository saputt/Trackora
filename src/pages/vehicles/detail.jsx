import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ChevronRight, MapPin, Gauge, Clock, Plus, AlertTriangle,
  CheckCircle, XCircle, TrendingDown, Wrench, Truck
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import DashboardLayout from '../../components/templates/DashboardLayout'
import Card from '../../components/atoms/Card'
import Button from '../../components/atoms/Button'
import { StatusBadge, RiskBadge, SeverityBadge } from '../../components/molecules/StatusBadge'
import SectionHeader from '../../components/molecules/SectionHeader'
import InfoPair from '../../components/molecules/InfoPair'
import { getVehicleById } from '../../services/vehicleService'
import { formatDate, formatMileage, formatRelativeDate } from '../../utils/formatters'
import { getHealthScoreBar, getHealthScoreColor, getHealthScoreBg } from '../../utils/healthScore'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

function HealthGauge({ score }) {
  const color = getHealthScoreColor(score)
  const barColor = getHealthScoreBar(score)
  return (
    <div className="flex flex-col items-center">
      <div className={`text-5xl font-black ${color} mb-1`}>{score}</div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5">Health Score</p>
    </div>
  )
}

export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id),
  })

  if (isLoading) {
    return (
      <DashboardLayout title="Detail Kendaraan">
        <div className="max-w-6xl mx-auto space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      </DashboardLayout>
    )
  }

  if (error || !vehicle) {
    return (
      <DashboardLayout title="Detail Kendaraan">
        <div className="max-w-6xl mx-auto">
          <Card className="text-center py-16">
            <XCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Kendaraan tidak ditemukan</p>
            <Button onClick={() => navigate('/vehicles')} variant="secondary" className="mt-4">Kembali</Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Component issue frequency for chart
  const componentFreq = vehicle.maintenanceHistory.reduce((acc, h) => {
    acc[h.component] = (acc[h.component] || 0) + 1
    return acc
  }, {})
  const componentChartData = Object.entries(componentFreq).map(([component, count]) => ({ component, count }))

  return (
    <DashboardLayout title={`${vehicle.vehicleCode} — Detail`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <Link to="/vehicles" className="hover:text-slate-600 transition-colors">Kendaraan</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-700 font-medium">{vehicle.vehicleCode}</span>
        </div>

        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Truck className="h-7 w-7 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900">{vehicle.vehicleCode}</h1>
                    <StatusBadge status={vehicle.status} />
                    <RiskBadge risk={vehicle.downtimeRisk} />
                  </div>
                  <p className="text-slate-500 mt-1">{vehicle.name} · {vehicle.type}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    {vehicle.location}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate(`/vehicles/${id}/report`)}
                icon={<Plus className="h-4 w-4" />}
                size="md"
                className="shrink-0"
              >
                Laporan Baru
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Overview Cards */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <HealthGauge score={vehicle.healthScore} />
            </Card>
            <Card className="flex flex-col gap-1 justify-center">
              <p className="text-xs text-slate-400">Maintenance Terakhir</p>
              <p className="font-bold text-slate-800">{formatDate(vehicle.lastMaintenanceDate)}</p>
              <p className="text-xs text-slate-400">{formatRelativeDate(vehicle.lastMaintenanceDate)}</p>
            </Card>
            <Card className="flex flex-col gap-1 justify-center">
              <p className="text-xs text-slate-400">Next Maintenance</p>
              <p className="font-bold text-slate-800">{formatDate(vehicle.nextMaintenanceDate)}</p>
              <p className="text-xs text-blue-500 font-medium">Prediksi Sistem</p>
            </Card>
            <Card className="flex flex-col gap-1 justify-center">
              <p className="text-xs text-slate-400">Total Isu Tercatat</p>
              <p className="font-bold text-slate-800 text-3xl">{vehicle.issueCount}</p>
              <p className="text-xs text-slate-400">riwayat laporan</p>
            </Card>
          </div>
        </motion.div>

        {/* Vehicle Info + Recommendation */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <Card>
              <SectionHeader title="Informasi Kendaraan" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                <InfoPair label="Kode Unit" value={vehicle.vehicleCode} />
                <InfoPair label="Nama / Model" value={vehicle.name} />
                <InfoPair label="Tipe" value={vehicle.type} />
                <InfoPair label="Lokasi" value={vehicle.location} />
                <InfoPair label="Jarak Tempuh" value={formatMileage(vehicle.mileage)} />
                <InfoPair label="Jam Operasi" value={`${vehicle.operatingHours?.toLocaleString('id-ID')} jam`} />
              </div>
              {vehicle.repeatedIssues?.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Isu Berulang</p>
                  <div className="flex gap-2 flex-wrap">
                    {vehicle.repeatedIssues.map((issue) => (
                      <span key={issue} className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-xs font-medium rounded-full">
                        ⚠ {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Recommendation */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <Card className={`border ${vehicle.status === 'critical' ? 'border-red-200 bg-red-50' : vehicle.status === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <div className="flex items-start gap-3 mb-4">
                {vehicle.status === 'critical' ? (
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                ) : vehicle.status === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-bold ${vehicle.status === 'critical' ? 'text-red-700' : vehicle.status === 'warning' ? 'text-amber-700' : 'text-emerald-700'}`}>
                    Rekomendasi Sistem
                  </p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${vehicle.status === 'critical' ? 'text-red-600' : vehicle.status === 'warning' ? 'text-amber-700' : 'text-emerald-700'}`}>
                {vehicle.recommendation}
              </p>
              <div className="mt-4 pt-4 border-t border-current/10">
                <p className="text-xs text-slate-500">Prediksi next maintenance:</p>
                <p className={`text-sm font-bold ${vehicle.status === 'critical' ? 'text-red-700' : vehicle.status === 'warning' ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {formatDate(vehicle.nextMaintenanceDate)}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Maintenance History + Chart */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* History Table */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <Card padding="none">
              <div className="p-6 border-b border-slate-100">
                <SectionHeader title="Riwayat Maintenance" subtitle={`${vehicle.maintenanceHistory.length} laporan`} />
              </div>
              <div className="overflow-x-auto">
                {vehicle.maintenanceHistory.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">Belum ada riwayat maintenance.</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        {['Tanggal', 'Komponen', 'Isu', 'Severity', 'Teknisi', 'Tindakan'].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vehicle.maintenanceHistory.map((h, i) => (
                        <motion.tr
                          key={h.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(h.date)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-700">{h.component}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{h.issue}</td>
                          <td className="px-4 py-3"><SeverityBadge severity={h.severity} /></td>
                          <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{h.technician}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 max-w-48 truncate" title={h.actionTaken}>{h.actionTaken}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Issue by Component */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
            <Card>
              <SectionHeader title="Isu per Komponen" subtitle="Frekuensi masalah" />
              {componentChartData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Belum ada data</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={componentChartData} layout="vertical" margin={{ left: 0, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="component" type="category" width={70} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="count" name="Isu" fill="#2563eb" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
