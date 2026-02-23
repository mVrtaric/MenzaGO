'use client'

import { Logo } from '@/components/menza/logo'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function LoginScreen() {
  const { navigate, login } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (email && password) {
      login(email.split('@')[0])
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center px-4 pt-4 pb-2">
        <button
          onClick={() => navigate('welcome')}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
          aria-label="Natrag"
        >
          <ArrowLeft size={22} className="text-[#252525]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-8 pt-8">
        <div className="flex justify-center mb-10">
          <Logo size="lg" />
        </div>

        <h2 className="text-2xl font-bold text-[#252525] mb-1">Dobrodosli natrag</h2>
        <p className="text-[#6e6e6e] text-sm mb-8">Prijavite se u svoj racun</p>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#afafaf]" />
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f3f3f3] text-[#252525] text-sm placeholder:text-[#afafaf] focus:outline-none focus:ring-2 focus:ring-[#49b867]/50 transition-shadow"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#afafaf]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#f3f3f3] text-[#252525] text-sm placeholder:text-[#afafaf] focus:outline-none focus:ring-2 focus:ring-[#49b867]/50 transition-shadow"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#afafaf]"
              aria-label={showPassword ? 'Sakrij lozinku' : 'Prikazi lozinku'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="self-end text-sm text-[#49b867] font-medium">
            Zaboravili ste lozinku?
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-4 mt-8 rounded-2xl bg-[#49b867] text-[#ffffff] font-semibold text-base tracking-wide active:scale-[0.98] transition-transform shadow-lg shadow-[#49b867]/25"
        >
          Prijava
        </button>

        <p className="text-center text-sm text-[#6e6e6e] mt-6">
          Nemate racun?{' '}
          <button onClick={() => navigate('register')} className="text-[#49b867] font-semibold">
            Registrirajte se
          </button>
        </p>
      </div>
    </div>
  )
}
