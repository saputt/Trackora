import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import AuthLayout from '../../components/templates/AuthLayout'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import Select from '../../components/atoms/Select'
import { useAuthStore } from '../../store'
import { registerUser } from '../../services/authService'

const roles = [
  { value: 'technician', label: 'Technician / Operator' },
  { value: 'supervisor', label: 'Supervisor Maintenance' },
  { value: 'admin', label: 'Administrator' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuthSession } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Nama lengkap diwajibkan'
    if (!form.email) e.email = 'Email profesional diwajibkan'
    if (!form.role) e.role = 'Role harus dipilih'
    if (!form.password || form.password.length < 8) e.password = 'Kredensial tidak memenuhi syarat (min. 8 karakter)'
    if (form.password !== form.confirm) e.confirm = 'Konfirmasi sandi tidak sesuai'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const auth = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password,
      })
      setAuthSession(auth)
      navigate('/dashboard')
    } catch (err) {
      setErrors({
        submit: err?.message || 'Pendaftaran gagal. Silakan coba lagi.',
      })
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <AuthLayout>
      <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_8px_30px_rgba(26,26,24,0.04)] p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A18] tracking-tight">Pendaftaran Akses</h2>
          <p className="text-sm text-[#6B6860] mt-1.5">Ajukan pembuatan akun untuk organisasi Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nama Lengkap"
            placeholder="Sesuai identitas KTP/ID"
            icon={<User className="h-4 w-4" />}
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            required
            className="bg-[#F7F6F3]"
          />
          <Input
            label="Email Profesional"
            type="email"
            placeholder="nama@domain.com"
            icon={<Mail className="h-4 w-4" />}
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            required
            className="bg-[#F7F6F3]"
          />
          <Select
            label="Role Organisasi"
            options={roles}
            placeholder="Pilih peran..."
            value={form.role}
            onChange={set('role')}
            error={errors.role}
            required
            className="bg-[#F7F6F3]"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sandi Akses"
              type={showPass ? 'text' : 'password'}
               placeholder="Min. 8 char"
              icon={<Lock className="h-4 w-4" />}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              required
              className="bg-[#F7F6F3]"
            />
            <Input
              label="Konfirmasi"
              type={showPass ? 'text' : 'password'}
              placeholder="Ulangi"
              icon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-[#1A1A18] transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              required
              className="bg-[#F7F6F3]"
            />
          </div>

          <Button type="submit" size="xl" loading={loading} className="w-full mt-4">
            Ajukan Pendaftaran
          </Button>
          {errors.submit && (
            <p className="text-sm text-[#9B2C2C] bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl px-3 py-2">
              {errors.submit}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-[#6B6860] mt-8">
          Sudah memiliki kredensial?{' '}
          <Link to="/login" className="text-[#3A6B1C] font-semibold hover:text-[#2D5016] transition-colors">
            Akses sistem
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
