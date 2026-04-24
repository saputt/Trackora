import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    AlertTriangle, Clock, RefreshCw, ArrowRight, Bell, TrendingUp
} from 'lucide-react'
import DashboardLayout from '../../components/templates/DashboardLayout'
import Card from '../../components/atoms/Card'
import SectionHeader from '../../components/molecules/SectionHeader'
import { RiskBadge } from '../../components/molecules/StatusBadge'
import Badge from '../../components/atoms/Badge'
import Button from '../../components/atoms/Button'
import { getAlerts } from '../../services/vehicleService'
import { formatDate } from '../../utils/formatters'

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

const typeConfig = {
    critical_risk: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 border-red-200', badge: 'red', label: 'Risiko Kritis' },
    maintenance_due: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', badge: 'yellow', label: 'Maintenance Jatuh Tempo' },
    repeated_issue: { icon: RefreshCw, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200', badge: 'orange', label: 'Isu Berulang' },
}

export default function AlertsPage() {
    const navigate = useNavigate()
    const { data: alerts = [], isLoading } = useQuery({
        queryKey: ['alerts'],
        queryFn: getAlerts,
    })

    const critical = alerts.filter((a) => a.riskLevel === 'high')
    const medium = alerts.filter((a) => a.riskLevel === 'medium')

    return (
        <DashboardLayout title="Alerts & Prediksi">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Alerts & Prediksi Maintenance</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Kendaraan yang memerlukan perhatian segera berdasarkan analisis sistem</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Alert Aktif', value: alerts.length, icon: Bell, color: 'blue' },
                        { label: 'Risiko Tinggi', value: critical.length, icon: AlertTriangle, color: 'red' },
                        { label: 'Segera Dijadwalkan', value: medium.length, icon: Clock, color: 'yellow' },
                    ].map((s, i) => (
                        <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                            <Card>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color === 'red' ? 'bg-red-50' : s.color === 'yellow' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                                    <s.icon className={`h-5 w-5 ${s.color === 'red' ? 'text-red-500' : s.color === 'yellow' ? 'text-amber-500' : 'text-blue-500'}`} />
                                </div>
                                <p className="text-sm text-slate-500">{s.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-0.5">{s.value}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Critical Alerts */}
                {critical.length > 0 && (
                    <div>
                        <SectionHeader
                            title={<span className="flex items-center gap-2 text-red-700"><AlertTriangle className="h-5 w-5" /> Risiko Kritis — Tindakan Segera</span>}
                        />
                        <div className="space-y-3">
                            {critical.map((alert, i) => {
                                const cfg = typeConfig[alert.type] || typeConfig.maintenance_due
                                return (
                                    <motion.div key={alert.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                                        <Card className={`border ${cfg.bg}`}>
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                                    <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-bold text-slate-800">{alert.vehicleCode}</span>
                                                        <span className="text-slate-400">·</span>
                                                        <span className="text-sm text-slate-600">{alert.vehicleName}</span>
                                                        <Badge color={cfg.badge}>{cfg.label}</Badge>
                                                        <RiskBadge risk={alert.riskLevel} />
                                                    </div>
                                                    <p className="text-sm text-slate-700 mb-2">{alert.message}</p>
                                                    <div className="bg-white/60 rounded-lg p-2.5 text-sm">
                                                        <span className="font-medium text-slate-700">Rekomendasi: </span>
                                                        <span className="text-slate-600">{alert.recommendation}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-2">
                                                        Prediksi maintenance: <strong>{formatDate(alert.predictedNextMaintenance)}</strong>
                                                        {' '}({alert.daysUntilMaintenance} hari)</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => navigate(`/vehicles/${alert.vehicleId}`)}
                                                    icon={<ArrowRight className="h-3.5 w-3.5" />}
                                                    className="shrink-0"
                                                >
                                                    Detail
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Medium Alerts */}
                {medium.length > 0 && (
                    <div>
                        <SectionHeader
                            title={<span className="flex items-center gap-2 text-amber-700"><Clock className="h-5 w-5" /> Jadwalkan Segera</span>}
                        />
                        <div className="space-y-3">
                            {medium.map((alert, i) => {
                                const cfg = typeConfig[alert.type] || typeConfig.maintenance_due
                                return (
                                    <motion.div key={alert.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                                        <Card className="border border-slate-100 hover:border-amber-200 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                                                    <cfg.icon className="h-4 w-4 text-amber-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                        <span className="font-semibold text-slate-800">{alert.vehicleCode}</span>
                                                        <span className="text-sm text-slate-500">{alert.vehicleName}</span>
                                                        <Badge color="yellow">{cfg.label}</Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-600">{alert.message}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Next maintenance: <strong>{formatDate(alert.predictedNextMaintenance)}</strong>
                                                        {' '}<span className="text-amber-600">({alert.daysUntilMaintenance} hari lagi)</span>
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => navigate(`/vehicles/${alert.vehicleId}`)}
                                                >
                                                    Lihat
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                )}

                {!isLoading && alerts.length === 0 && (
                    <Card className="text-center py-16">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="h-8 w-8 text-emerald-500" />
                        </div>
                        <p className="font-semibold text-slate-700">Tidak ada alert aktif</p>
                        <p className="text-sm text-slate-400 mt-1">Semua kendaraan dalam kondisi yang dipantau dengan baik</p>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}
