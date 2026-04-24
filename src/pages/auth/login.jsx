import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthLayout from '../../components/templates/AuthLayout'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import { useAuthStore } from '../../store'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setLoading(true)
    setError('')
    // Dummy auth — accept any credential
    await new Promise((r) => setTimeout(r, 800))
    login({
      name: form.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: form.email,
      role: 'Supervisor',
    })
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_8px_30px_rgba(26,26,24,0.04)] p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A18] tracking-tight">Selamat Datang</h2>
          <p className="text-sm text-[#6B6860] mt-1.5">Masuk ke dashboard manajemen operasional Anda.</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#9B2C2C]">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email Profesional"
            type="email"
            placeholder="nama@perusahaan.com"
            icon={<Mail className="h-4 w-4" />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-[#F7F6F3] border-[#E8E6E1]"
          />

          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Masukkan password"
            icon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-[#1A1A18] transition-colors">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="bg-[#F7F6F3] border-[#E8E6E1]"
          />

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="w-4 h-4 rounded border-[#D4D0C8] text-[#3A6B1C] focus:ring-[#3A6B1C] focus:ring-offset-1"
              />
              <span className="text-sm text-[#6B6860] group-hover:text-[#1A1A18] transition-colors">Ingat sesi saya</span>
            </label>
            <button type="button" className="text-sm text-[#3A6B1C] hover:text-[#2D5016] font-medium transition-colors">
              Lupa sandi?
            </button>
          </div>

          <Button type="submit" size="xl" loading={loading} className="w-full mt-2">
            Masuk ke Sistem
          </Button>
        </form>

        <p className="text-center text-sm text-[#6B6860] mt-8">
          Belum terdaftar?{' '}
          <Link to="/register" className="text-[#3A6B1C] font-semibold hover:text-[#2D5016] transition-colors">
            Hubungi Admin
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-8 p-3 bg-[#EEF5E8] rounded-xl border border-[#C4DFB0] text-center">
          <p className="text-xs text-[#3D6B1E] font-medium">💡 Demo Platform: gunakan sembarang email & sandi untuk login.</p>
        </div>
      </div>
    </AuthLayout>
  )
}
