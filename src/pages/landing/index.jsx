import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, ArrowRight, CheckCircle, TrendingUp, Shield, AlertTriangle,
  FileText, BarChart3, Clock, Menu, X
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A18]/80 backdrop-blur-xl border-b border-[#3A6B1C]/20">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3A6B1C] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(58,107,28,0.5)]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">FleetSense</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Platform', 'Kemampuan', 'Industri'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-[#A09D98] hover:text-white transition-colors tracking-wide">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login"
            className="text-sm font-semibold text-[#A09D98] hover:text-white px-5 py-2.5 rounded-xl transition-all">
            Dashboard Akses
          </Link>
          <Link to="/register"
            className="text-sm font-bold text-white px-6 py-3 rounded-xl bg-[#C45D1A] hover:bg-[#A84D14] transition-all shadow-[0_4px_16px_rgba(196,93,26,0.3)] hover:shadow-[0_4px_24px_rgba(196,93,26,0.5)] transform hover:-translate-y-0.5">
            Minta Demo
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-[#1A1A18] border-t border-white/10 px-6 pb-6">
            <div className="flex flex-col gap-4 pt-6">
              <Link to="/login" className="py-2 text-base text-[#A09D98]">Dashboard Akses</Link>
              <Link to="/register" className="py-2 text-base font-bold text-[#C45D1A]">Minta Demo</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const features = [
  { icon: FileText, title: 'Standar Inspeksi Ketat', desc: 'Sistem validasi hierarkis memfilter laporan sampah, memastikan teknisi lapangan memberikan data yang presisi.' },
  { icon: Clock, title: 'Prediksi Kerusakan Mesin', desc: 'Berdasarkan rekam jejak, algoritma kami mengkalkulasi probabilitas tinggi kerusakan sebelum armada mogok di jalan.' },
  { icon: BarChart3, title: 'Health Score Indeks', desc: 'Setiap aset memiliki skor kesehatan 1-100 real-time, memberi gambaran instan kelayakan jalan armada Anda.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <Navbar />

      {/* Clasto-inspired Editorial Dark Hero */}
      <section className="relative min-h-[95vh] flex items-center justify-center bg-[#1A1A18] overflow-hidden pt-20">
        
        {/* Subtle, premium abstract glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#3A6B1C]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#C45D1A]/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10 w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
              <span className="w-2 h-2 bg-[#3A6B1C] rounded-full shadow-[0_0_10px_#3A6B1C] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#E8E6E1]">Operasional Kelas Enterprise</span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-5xl sm:text-7xl lg:text-[84px] font-bold text-white leading-[1.05] mb-8 tracking-[-0.03em]">
              Kendali Penuh Atas <br />
              <span className="gradient-text-hero">Aset Otomotif Anda.</span>
            </motion.h1>

            <motion.p variants={fadeUp}
              className="text-lg sm:text-xl text-[#A09D98] leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
              Evolusi manajemen armada. FleetSense memadukan pencatatan presisi, validasi algoritma, dan telemetri preventif 
              untuk menekan biaya operasional tak terduga.
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-col sm:flex-row">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#C45D1A] text-white font-bold rounded-xl hover:bg-[#A84D14] transition-all duration-300 text-lg shadow-[0_4px_20px_rgba(196,93,26,0.3)] hover:shadow-[0_8px_30px_rgba(196,93,26,0.4)] transform hover:-translate-y-1"
              >
                Inisiasi Sistem <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#2A2A28] border border-white/10 text-white font-bold rounded-xl hover:bg-[#3A3A38] transition-all duration-300 text-lg"
              >
                Tinjau Dashboard
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Diagonal cut to transition to light mode bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#F7F6F3]" />
      </section>

      {/* Trust & Stats */}
      <section className="py-20 bg-[#F7F6F3] border-b border-[#E8E6E1]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 divide-x divide-[#E8E6E1]/50">
            {[
              { value: '87%', label: 'Reduksi Downtime' },
              { value: '1.2M', label: 'Laporan Tervalidasi' },
              { value: '94%', label: 'Akurasi Prediksi' },
              { value: '3x', label: 'ROI Operasional' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center px-4">
                <p className="text-5xl font-black text-[#1A1A18] mb-2 tracking-tighter">{s.value}</p>
                <p className="text-sm font-bold text-[#A09D98] uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorials / Features */}
      <section id="platform" className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-20 max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1A1A18] mb-6 tracking-tight">Kapasitas Eksekutif.</h2>
              <p className="text-xl text-[#6B6860] leading-relaxed">
                Tinggalkan spreadsheet usang. Platform kami dirancang secara spesifik untuk membedah data telematika dan laporan inspeksi mekanik menjadi insight krusial.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="bg-[#F7F6F3] p-10 rounded-[32px] border border-[#E8E6E1] hover:border-[#D4D0C8] transition-colors group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-[#E8E6E1] group-hover:scale-110 transition-transform duration-500 ease-out">
                    <f.icon className="h-6 w-6 text-[#1A1A18]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A18] mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-base text-[#6B6860] leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-32 bg-[#1A1A18] text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20 max-w-3xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Dashboard Terpusat.</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-[#A09D98] leading-relaxed">
              Pantau seluruh kesehatan armada melalui antarmuka premium yang bebas dari distraksi, dirancang untuk kecepatan eksekusi.
            </motion.p>
          </motion.div>

          {/* Fake Dashboard Premium Mockup */}
          <motion.div variants={fadeUp} className="relative mx-auto rounded-[32px] border border-white/10 bg-[#2A2A28] shadow-2xl p-2 sm:p-4 rotate-2 hover:rotate-0 transition-transform duration-700 ease-out max-w-5xl">
            <div className="bg-[#F7F6F3] rounded-[24px] overflow-hidden flex flex-col h-[500px]">
              {/* Header */}
              <div className="h-16 border-b border-[#E8E6E1] bg-white flex items-center px-6">
                <div className="w-24 h-6 bg-[#E8E6E1] rounded-md" />
              </div>
              {/* Grid */}
              <div className="flex-1 p-6 grid grid-cols-4 gap-6">
                <div className="col-span-1 border border-[#E8E6E1] rounded-xl bg-white p-4 flex flex-col gap-4">
                  <div className="w-full h-10 bg-[#F7F6F3] rounded-lg" />
                  <div className="w-full h-10 bg-[#F7F6F3] rounded-lg" />
                  <div className="w-full h-10 bg-[#F7F6F3] rounded-lg" />
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-6">
                  <div className="col-span-1 bg-[#EEF5E8] border border-[#C4DFB0] rounded-xl p-4 flex flex-col justify-end">
                    <div className="text-3xl font-black text-[#3A6B1C]">98</div>
                  </div>
                  <div className="col-span-2 bg-white border border-[#E8E6E1] rounded-xl shadow-sm p-4">
                    <div className="flex h-full items-end gap-2">
                       {[30, 45, 20, 60, 40, 80, 50].map((h, x) => (
                         <div key={x} style={{ height: `${h}%` }} className="bg-[#3A6B1C] flex-1 rounded-t-md opacity-20" />
                       ))}
                    </div>
                  </div>
                  <div className="col-span-3 bg-white border border-[#E8E6E1] rounded-xl p-4 flex-1">
                    <div className="h-4 w-32 bg-[#E8E6E1] rounded mt-2 mb-4" />
                    <div className="space-y-3">
                      <div className="h-8 bg-[#F7F6F3] rounded-lg w-full" />
                      <div className="h-8 bg-[#F7F6F3] rounded-lg w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#C45D1A] py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Kuasai Kendaraan Anda Hari Ini.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Sistem manajemen armada berstandar enterprise tersedia untuk uji coba tertutup.
            </motion.p>
            <motion.div variants={fadeUp}>
              <button onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#C45D1A] font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg transform hover:-translate-y-1">
                Jadwalkan Konsultasi <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#1A1A18] py-12 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3A6B1C] rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">FleetSense</span>
          </div>
          <p className="text-[#A09D98] text-sm">© 2026 Hak Cipta Dilindungi. Desain Enterprise.</p>
        </div>
      </footer>
    </div>
  )
}
