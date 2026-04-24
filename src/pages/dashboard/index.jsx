import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Truck, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp,
  ArrowRight, Plus, Bell
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import DashboardLayout from '../../components/templates/DashboardLayout'
import StatCard from '../../components/molecules/StatCard'
import Card from '../../components/atoms/Card'
import SectionHeader from '../../components/molecules/SectionHeader'
import { StatusBadge, RiskBadge } from '../../components/molecules/StatusBadge'
import { getDashboardSummary, getDashboardCharts, getVehicles } from '../../services/vehicleService'
import { formatDate, formatRelativeDate } from '../../utils/formatters'
import { getHealthScoreBar } from '../../utils/healthScore'
import Button from '../../components/atoms/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

function HealthBar({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${getHealthScoreBar(score)}`}
        />
      </div>
      <span className="text-xs font-semibold text-[#1A1A18] w-8 text-right tabular-nums">{score}</span>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()

  const { data: summary, isLoading: sumLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
  })

  const { data: charts, isLoading: chartsLoading } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: getDashboardCharts,
  })

  const { data: vehicles, isLoading: vLoading } = useQuery({
    queryKey: ['vehicles', {}],
    queryFn: () => getVehicles({}),
  })

  const priorityVehicles = vehicles
    ?.filter((v) => v.status === 'critical' || v.downtimeRisk === 'high')
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 5) || []

  // Neutral, elegant chart colors replacing primary colors
  const COLORS = ['#3A6B1C', '#C45D1A', '#9B2C2C', '#6B6860', '#D4C9A8']

  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Welcome Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-[28px] font-bold text-[#1A1A18] tracking-tight">Selamat Datang, Budi 👋</h2>
              <p className="text-[#6B6860] mt-1 text-sm bg-white border border-[#E8E6E1] inline-flex rounded-full px-3 py-1 shadow-sm">
                Dashboard Statistik — {formatDate(new Date().toISOString())}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/vehicles')} icon={<Truck className="h-4 w-4" />}>
                Kelola Armada
              </Button>
              <Button onClick={() => navigate('/vehicles/new-report')} icon={<Plus className="h-4 w-4" />}>
                Laporan
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Grid Array */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column (Main Stats & Charts based on Oppo device layout) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Stat row: 4 cards replacing 6 crowded ones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                <StatCard title="Total Kendaraan" value={summary?.totalVehicles ?? '—'} icon={<Truck className="h-4 w-4" />} color="blue" />
              </motion.div>
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                <StatCard title="Kondisi Sehat" value={summary?.healthy ?? '—'} icon={<CheckCircle className="h-4 w-4" />} color="green" />
              </motion.div>
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                <StatCard title="Butuh Perhatian" value={(summary?.warning || 0) + (summary?.critical || 0)} icon={<AlertTriangle className="h-4 w-4" />} color="yellow" />
              </motion.div>
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                <StatCard title="Risiko Tinggi" value={summary?.highRisk ?? '—'} icon={<TrendingUp className="h-4 w-4" />} color="red" trend={-2} />
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Health Overview Pie Chart inside a minimal container */}
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                <Card className="h-full flex flex-col justify-between" padding="lg">
                  <SectionHeader title="Distribusi Kondisi" subtitle="Skor kesehatan rata-rata armada" />
                  <div className="flex-1 flex flex-col justify-center">
                    {chartsLoading ? (
                      <div className="h-48 animate-pulse bg-[#F7F6F3] rounded-xl" />
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={charts?.healthOverview || []}
                            cx="50%" cy="50%"
                            innerRadius={65} outerRadius={85}
                            dataKey="value"
                            paddingAngle={5}
                            stroke="none"
                          >
                            {charts?.healthOverview?.map((entry, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E6E1', boxShadow: '0 4px 16px rgba(26,26,24,0.06)' }} />
                          <Legend iconType="circle" iconSize={8} align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Issue Trend Area Chart */}
              <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
                <Card className="h-full" padding="lg">
                  <SectionHeader title="Tren Pemeliharaan" subtitle="6 bulan riwayat" />
                  <div className="flex-1 pt-4">
                    {chartsLoading ? (
                      <div className="h-48 animate-pulse bg-[#F7F6F3] rounded-xl" />
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={charts?.issueTrend || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="issueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C45D1A" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#C45D1A" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3A6B1C" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#3A6B1C" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6860' }} axisLine={false} tickLine={false} dy={10} />
                          <YAxis tick={{ fontSize: 11, fill: '#6B6860' }} axisLine={false} tickLine={false} dx={-10} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E6E1', boxShadow: '0 4px 16px rgba(26,26,24,0.06)' }} />
                          <Area type="monotone" dataKey="issues" name="Isu" stroke="#C45D1A" strokeWidth={2} fill="url(#issueGrad)" dot={{ r: 3, fill: '#C45D1A', strokeWidth: 2, stroke: '#fff' }} />
                          <Area type="monotone" dataKey="maintenance" name="Maint." stroke="#3A6B1C" strokeWidth={2} fill="url(#maintGrad)" dot={{ r: 3, fill: '#3A6B1C', strokeWidth: 2, stroke: '#fff' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Component Distribution Bar */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
              <Card padding="lg">
                <SectionHeader title="Titik Kerusakan Armada" subtitle="Komponen paling sering mengalami masalah" />
                <div className="pt-2">
                  {chartsLoading ? (
                    <div className="h-60 animate-pulse bg-[#F7F6F3] rounded-xl" />
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={charts?.componentDistribution || []} margin={{ left: -20, right: 0, top: 10, bottom: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                        <XAxis dataKey="component" tick={{ fontSize: 11, fill: '#6B6860' }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis type="number" tick={{ fontSize: 11, fill: '#6B6860' }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip cursor={{ fill: '#F7F6F3' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8E6E1', boxShadow: '0 4px 16px rgba(26,26,24,0.06)' }} />
                        <Bar dataKey="count" name="Jumlah Insiden" fill="#E8E6E1" radius={[4, 4, 0, 0]}>
                           {charts?.componentDistribution?.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 0 ? '#3A6B1C' : index === 1 ? '#D4C9A8' : '#F0EDE8'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column (Sidebar style actions & priority) */}
          <div className="space-y-6">
            
            {/* Quick Actions Restrained */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
              <Card padding="md" className="bg-[#3A6B1C] border-[#2D5016]">
                <h3 className="text-white font-semibold mb-4 text-[15px]">Tindakan Cepat</h3>
                <div className="space-y-2">
                  <button onClick={() => navigate('/vehicles/new-report')} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left group border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg"><Plus className="w-4 h-4 text-white" /></div>
                      <div>
                        <span className="block text-sm font-medium text-white">Inspeksi Baru</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                  </button>
                  <button onClick={() => navigate('/alerts')} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left group border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg"><Bell className="w-4 h-4 text-white" /></div>
                      <div>
                        <span className="block text-sm font-medium text-white">Periksa Notifikasi</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Areas To Address */}
            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
              <Card padding="md">
                <SectionHeader
                  title="Fokus Perhatian"
                  action={
                    <Button variant="ghost" size="xs" onClick={() => navigate('/vehicles')}>
                      Semua <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  }
                />
                <div className="space-y-3">
                  {vLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-14 bg-[#F7F6F3] rounded-xl animate-pulse" />
                    ))
                  ) : priorityVehicles.length === 0 ? (
                    <div className="py-8 text-center bg-[#EEF7EE] rounded-xl border border-[#C4DFB0]">
                      <CheckCircle className="w-6 h-6 text-[#3D7A3A] mx-auto mb-2" />
                      <p className="text-sm font-medium text-[#3D7A3A]">Semua Normal</p>
                    </div>
                  ) : (
                    priorityVehicles.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => navigate(`/vehicles/${v.id}`)}
                        className="p-3 rounded-xl border border-[#E8E6E1] hover:bg-[#F7F6F3] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#9B2C2C]" />
                            <p className="text-sm font-semibold text-[#1A1A18]">{v.vehicleCode}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#B45309]">{v.healthScore} Skor</span>
                        </div>
                        <HealthBar score={v.healthScore} />
                        <div className="flex justify-between items-center mt-3 text-xs">
                          <RiskBadge risk={v.downtimeRisk} />
                          <span className="text-[#A09D98]">{formatDate(v.nextMaintenanceDate)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
