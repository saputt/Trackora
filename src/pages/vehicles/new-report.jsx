import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, Truck, AlertTriangle, CheckCircle, Info,
  Upload, Send, ArrowLeft
} from 'lucide-react'
import DashboardLayout from '../../components/templates/DashboardLayout'
import Card from '../../components/atoms/Card'
import Button from '../../components/atoms/Button'
import Select from '../../components/atoms/Select'
import TextArea from '../../components/atoms/TextArea'
import SectionHeader from '../../components/molecules/SectionHeader'
import { StatusBadge } from '../../components/molecules/StatusBadge'
import { getVehicleById, getVehicles, createMaintenanceReport } from '../../services/vehicleService'
import { COMPONENTS, getIssuesForComponent, isValidIssueForComponent, SEVERITY_OPTIONS, COMPONENT_ISSUE_MAP } from '../../utils/componentIssueMap'
import { formatDate } from '../../utils/formatters'
import { getHealthScoreBar } from '../../utils/healthScore'

export default function NewReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id),
    enabled: !!id,
  })

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles', {}],
    queryFn: () => getVehicles({}),
  })

  const [form, setForm] = useState({
    vehicleId: id || '',
    component: '',
    issue: '',
    severity: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [validationWarning, setValidationWarning] = useState('')
  const [success, setSuccess] = useState(false)
  const [createdReport, setCreatedReport] = useState(null)

  // Update vehicleId if id param changes
  useEffect(() => {
    if (id) setForm((f) => ({ ...f, vehicleId: id }))
  }, [id])

  // Reset issue when component changes
  useEffect(() => {
    setForm((f) => ({ ...f, issue: '' }))
    setValidationWarning('')
  }, [form.component])

  // Smart validation warning
  const handleIssueChange = (e) => {
    const issue = e.target.value
    setForm((f) => ({ ...f, issue }))
    if (form.component && issue) {
      if (!isValidIssueForComponent(form.component, issue)) {
        setValidationWarning(`⚠️ "${issue}" bukan isu yang valid untuk komponen "${form.component}". Harap pilih isu yang sesuai.`)
      } else {
        setValidationWarning('')
      }
    }
  }

  const validate = () => {
    const e = {}
    if (!form.vehicleId) e.vehicleId = 'Pilih kendaraan'
    if (!form.component) e.component = 'Pilih komponen'
    if (!form.issue) e.issue = 'Pilih isu'
    if (!form.severity) e.severity = 'Pilih severity'
    if (form.component && form.issue && !isValidIssueForComponent(form.component, form.issue)) {
      e.issue = `"${form.issue}" tidak valid untuk komponen "${form.component}"`
    }
    return e
  }

  const mutation = useMutation({
    mutationFn: createMaintenanceReport,
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', form.vehicleId] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] })
      setCreatedReport(report)
      setSuccess(true)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    mutation.mutate(form)
  }

  const issueOptions = form.component
    ? getIssuesForComponent(form.component).map((i) => ({ value: i, label: i }))
    : []

  const vehicleOptions = vehicles.map((v) => ({ value: v.id, label: `${v.vehicleCode} — ${v.name}` }))

  const selectedVehicle = vehicle || vehicles.find((v) => v.id === form.vehicleId)

  // Success screen
  if (success && createdReport) {
    return (
      <DashboardLayout title="Laporan Berhasil Dibuat">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-[#C4DFB0] shadow-lg shadow-[#3A6B1C]/5 p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-[#EEF5E8] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-[#3A6B1C]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#1A1A18] mb-2 tracking-tight">Laporan Berhasil Dibuat!</h2>
            <p className="text-[#6B6860] mb-6">
              Laporan maintenance untuk <strong>{selectedVehicle?.vehicleCode}</strong> telah berhasil disimpan.
              Health score dan status kendaraan telah diperbarui.
            </p>
            <div className="bg-[#F7F6F3] rounded-2xl p-4 mb-8 text-left space-y-2 border border-[#E8E6E1]">
              <div className="flex justify-between text-sm">
                <span className="text-[#A09D98]">Komponen</span>
                <span className="font-medium text-[#1A1A18]">{createdReport.component}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A09D98]">Isu</span>
                <span className="font-medium text-[#1A1A18]">{createdReport.issue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A09D98]">Severity</span>
                <span className="font-medium text-[#1A1A18] capitalize">{createdReport.severity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A09D98]">Tanggal</span>
                <span className="font-medium text-[#1A1A18]">{formatDate(createdReport.date)}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/vehicles')}
              >
                Kembali ke Daftar
              </Button>
              <Button
                onClick={() => navigate(`/vehicles/${form.vehicleId}`)}
              >
                Lihat Detail Kendaraan
              </Button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Buat Laporan Maintenance">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#A09D98]">
          <Link to="/vehicles" className="hover:text-[#1A1A18] transition-colors">Armada</Link>
          {selectedVehicle && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to={`/vehicles/${selectedVehicle.id}`} className="hover:text-[#1A1A18] transition-colors">{selectedVehicle.vehicleCode}</Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#1A1A18] bg-white border border-[#E8E6E1] px-2 py-0.5 rounded-md shadow-sm tracking-tight">Inspeksi</span>
        </div>

        <div>
          <h2 className="text-[28px] font-bold text-[#1A1A18] tracking-tight">Input Inspeksi Manual</h2>
          <p className="text-[#6B6860] text-sm mt-0.5">Catat temuan anomali atau kerusakan di lapangan untuk analisis lebih lanjut.</p>
        </div>

        {/* Vehicle Mini Card */}
        {selectedVehicle && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-[#1A1A18] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3A6B1C] rounded-full blur-[60px] opacity-30 -mr-10 -mt-10 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold tracking-tight">{selectedVehicle.vehicleCode}</span>
                    <StatusBadge status={selectedVehicle.status} />
                  </div>
                  <p className="text-sm text-[#A09D98]">{selectedVehicle.name} · {selectedVehicle.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#A09D98] font-semibold uppercase tracking-widest">Health</p>
                  <p className="text-[28px] font-black tracking-tighter tabular-nums leading-none mt-1">{selectedVehicle.healthScore}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <SectionHeader title="Detail Laporan" subtitle="Semua field bertanda * wajib diisi" />
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Vehicle (if no id param) */}
                {!id && (
                  <Select
                    label="Kendaraan"
                    options={vehicleOptions}
                    placeholder="Pilih kendaraan..."
                    value={form.vehicleId}
                    onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                    error={errors.vehicleId}
                    required
                  />
                )}

                {/* Component */}
                <Select
                  label="Komponen"
                  options={COMPONENTS.map((c) => ({ value: c, label: c }))}
                  placeholder="Pilih komponen kendaraan..."
                  value={form.component}
                  onChange={(e) => setForm({ ...form, component: e.target.value })}
                  error={errors.component}
                  hint="Pilih komponen yang bermasalah terlebih dahulu"
                  required
                />

                {/* Issue — depends on component */}
                <div>
                  <Select
                    label="Isu / Kerusakan"
                    options={issueOptions}
                    placeholder={form.component ? 'Pilih isu yang sesuai...' : 'Pilih komponen dahulu...'}
                    value={form.issue}
                    onChange={handleIssueChange}
                    error={errors.issue}
                    disabled={!form.component}
                    hint={form.component ? `Menampilkan isu valid untuk komponen "${form.component}"` : undefined}
                    required
                  />

                  {/* Smart Validation Warning */}
                  <AnimatePresence>
                    {validationWarning && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-3 bg-[#FEF3E2] border border-[#FCD49A] rounded-xl flex items-start gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-[#B45309] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#92400E] font-medium leading-relaxed">{validationWarning}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Severity */}
                <Select
                  label="Tingkat Keparahan (Severity)"
                  options={SEVERITY_OPTIONS}
                  placeholder="Pilih severity..."
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  error={errors.severity}
                  required
                />

                {/* Notes */}
                <TextArea
                  label="Catatan / Deskripsi"
                  placeholder="Jelaskan kondisi kerusakan secara detail, kapan pertama kali terdeteksi, kondisi saat terjadi, dll."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={4}
                  hint="Opsional, namun sangat membantu analisis"
                />

                {/* Upload Placeholder */}
                <div>
                  <label className="text-sm font-medium text-[#1A1A18] block mb-1.5">Foto Dokumentasi (Opsional)</label>
                  <div className="border-2 border-dashed border-[#E8E6E1] rounded-xl p-8 text-center hover:border-[#3A6B1C] hover:bg-[#EEF5E8] transition-colors cursor-pointer group">
                    <Upload className="h-6 w-6 text-[#A09D98] group-hover:text-[#3A6B1C] mx-auto mb-2 transition-colors" />
                    <p className="text-sm text-[#6B6860] font-medium">Klik atau drag & drop gambar</p>
                    <p className="text-xs text-[#A09D98] mt-1">PNG, JPG hingga 10MB</p>
                  </div>
                </div>

                {/* Error summary */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl">
                    <p className="text-sm font-medium text-[#9B2C2C] mb-2">Harap perbaiki kesalahan berikut:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.values(errors).map((err, i) => (
                        <li key={i} className="text-sm text-[#9B2C2C] leading-snug">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#E8E6E1]">
                  <Button variant="secondary" type="button" onClick={() => navigate(-1)} icon={<ArrowLeft className="h-4 w-4" />}>
                    Kembali
                  </Button>
                  <Button type="submit" loading={mutation.isPending} icon={<Send className="h-4 w-4" />} className="flex-1 sm:flex-none">
                    {mutation.isPending ? 'Menyimpan...' : 'Simpan Laporan'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Helper Panel */}
          <div className="space-y-4">
            {/* Valid issues for selected component */}
            {form.component && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="bg-[#EEF5E8] border-[#C4DFB0]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-[#3A6B1C]" />
                    <p className="text-sm font-semibold text-[#2D5016]">Isu Valid untuk {form.component}</p>
                  </div>
                  <div className="space-y-1.5 focus-within:ring-0">
                    {getIssuesForComponent(form.component).map((issue) => (
                      <div key={issue}
                        onClick={() => { setForm((f) => ({ ...f, issue })); setValidationWarning('') }}
                        className={`flex items-start gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${form.issue === issue ? 'bg-white shadow-sm border border-[#C4DFB0] text-[#1A1A18] font-bold' : 'hover:bg-white/50 text-[#3A6B1C]'}`}
                      >
                        <CheckCircle className={`h-4 w-4 shrink-0 mt-0.5 ${form.issue === issue ? 'text-[#3A6B1C]' : 'opacity-50'}`} />
                        <span className="leading-snug">{issue}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Severity guide */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-[#C45D1A]" />
                <p className="text-sm font-semibold text-[#1A1A18]">Panduan Severity</p>
              </div>
              <div className="space-y-3">
                {[
                  { level: 'Rendah', color: 'bg-[#F7F6F3] text-[#6B6860]', desc: 'Tidak mengganggu operasional' },
                  { level: 'Sedang', color: 'bg-[#FEF3C7] text-[#B45309]', desc: 'Perlu perhatian (1 mgg)' },
                  { level: 'Tinggi', color: 'bg-[#FFF4ED] text-[#C45D1A]', desc: 'Perlu penanganan segera' },
                  { level: 'Kritis', color: 'bg-[#FEF2F2] text-[#9B2C2C]', desc: 'Bahaya, stop operasi' },
                ].map((s) => (
                  <div key={s.level} className="flex flex-col gap-1 border-b border-[#E8E6E1] pb-2 last:border-0 last:pb-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md self-start ${s.color}`}>{s.level}</span>
                    <p className="text-xs text-[#6B6860] leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reminder */}
            <Card className="bg-[#FEF3E2] border-[#FCD49A]">
              <p className="text-xs text-[#92400E] leading-relaxed font-medium">
                <strong>Penting:</strong> Akurasi data di lapangan secara langsung melatih model engine kami dalam menentukan prediksi maintenance berikutnya.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
