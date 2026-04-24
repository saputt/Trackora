import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#EEF5E8] rounded-full opacity-70 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#FEF3E2] rounded-full opacity-60 blur-[100px]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 justify-center mb-8"
        >
          <div className="w-10 h-10 bg-[#3A6B1C] rounded-xl shadow-lg shadow-[#3A6B1C]/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#1A1A18] tracking-tight">FleetSense</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
