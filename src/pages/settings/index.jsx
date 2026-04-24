import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Briefcase, Bell, Shield, Save, Phone } from 'lucide-react'
import DashboardLayout from '../../components/templates/DashboardLayout'
import Card from '../../components/atoms/Card'
import SectionHeader from '../../components/molecules/SectionHeader'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import { useAuthStore } from '../../store'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3A6B1C] ${checked ? 'bg-[#3A6B1C]' : 'bg-[#E8E6E1]'}`}
      >
        <motion.span
          animate={{ x: checked ? 20 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="inline-block h-4 w-4 rounded-full bg-white shadow-sm border border-[#E8E6E1]"
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({
    criticalAlerts: true,
    maintenanceDue: true,
    repeatedIssues: false,
    weeklyReport: true,
    emailNotif: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout title="Pengaturan">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-[28px] font-bold text-[#1A1A18] tracking-tight">Profil & Pengaturan</h2>
          <p className="text-[#6B6860] text-sm mt-0.5">Kelola informasi kredensial dan preferensi sistem Anda</p>
        </div>

        {/* Profile Card */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Card>
            <SectionHeader title="Informasi Profil" />
            <div className="flex items-center gap-5 mb-8">
              <div className="w-[72px] h-[72px] rounded-2xl bg-[#EEF5E8] border border-[#C4DFB0] flex items-center justify-center text-[#3D6B1E] text-2xl font-bold shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-[#1A1A18] text-xl tracking-tight">{user?.name || 'User'}</p>
                <p className="text-sm text-[#A09D98] font-medium">{user?.role || 'Technician'}</p>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#3D7A3A] font-bold uppercase tracking-wider bg-[#EEF7EE] border border-[#C4DFB0] px-3 py-1 rounded-md mt-2">
                  <span className="w-1.5 h-1.5 bg-[#3D7A3A] rounded-full animate-pulse" /> TERVERIFIKASI
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                defaultValue={user?.name || ''}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="Email"
                defaultValue={user?.email || ''}
                icon={<Mail className="h-4 w-4" />}
                type="email"
              />
              <Input
                label="Role / Jabatan"
                defaultValue={user?.role || 'Supervisor'}
                icon={<Briefcase className="h-4 w-4" />}
                readOnly
              />
              <Input
                label="Nomor Telepon"
                placeholder="+62 812 xxxx xxxx"
                icon={<Phone className="h-4 w-4" />}
                type="tel"
              />
            </div>

            <div className="mt-8 pt-5 border-t border-[#E8E6E1] flex justify-end">
              <Button onClick={handleSave} icon={saved ? undefined : <Save className="h-4 w-4" />} variant={saved ? 'success' : 'primary'}>
                {saved ? '✓ Tersimpan' : 'Simpan Perubahan'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Card>
            <SectionHeader title="Notifikasi" subtitle="Atur kapan Anda ingin diberitahu" />
            <Toggle
              label="Alert Kendaraan Kritis"
              desc="Notifikasi segera ketika kendaraan berstatus kritis"
              checked={notifs.criticalAlerts}
              onChange={(v) => setNotifs({ ...notifs, criticalAlerts: v })}
            />
            <Toggle
              label="Maintenance Jatuh Tempo"
              desc="Pengingat ketika jadwal maintenance mendekat"
              checked={notifs.maintenanceDue}
              onChange={(v) => setNotifs({ ...notifs, maintenanceDue: v })}
            />
            <Toggle
              label="Isu Berulang Terdeteksi"
              desc="Notifikasi ketika kendaraan punya isu yang sama berulang"
              checked={notifs.repeatedIssues}
              onChange={(v) => setNotifs({ ...notifs, repeatedIssues: v })}
            />
            <Toggle
              label="Laporan Mingguan"
              desc="Ringkasan kondisi armada setiap Senin pagi"
              checked={notifs.weeklyReport}
              onChange={(v) => setNotifs({ ...notifs, weeklyReport: v })}
            />
            <Toggle
              label="Notifikasi via Email"
              desc="Kirim semua notifikasi ke email Anda"
              checked={notifs.emailNotif}
              onChange={(v) => setNotifs({ ...notifs, emailNotif: v })}
            />
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <Card>
            <SectionHeader title="Keamanan Kredensial" />
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 bg-[#F7F6F3] rounded-xl border border-[#E8E6E1]">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-[#E8E6E1] shadow-sm"><Shield className="h-5 w-5 text-[#6B6860]" /></div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A18]">Kata Sandi</p>
                    <p className="text-xs text-[#A09D98] mt-0.5">Terakhir diubah 30 hari lalu</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Perbarui</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#EEF5E8] rounded-xl border border-[#C4DFB0]">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-[#C4DFB0] shadow-sm"><Shield className="h-5 w-5 text-[#3D6B1E]" /></div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A18]">Autentikasi Dua Faktor</p>
                    <p className="text-xs text-[#3D6B1E] font-medium mt-0.5">Sangat disarankan</p>
                  </div>
                </div>
                <Button variant="primary" size="sm">Aktifkan</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="bg-[#1A1A18] text-white border-none py-4 text-center">
            <span className="text-sm font-medium opacity-80">FleetSense Terminal v2.0.0 — Hackathon Build</span>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
