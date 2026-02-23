'use client'

import { Logo } from '@/components/menza/logo'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, User, Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function RegisterScreen() {
  const { navigate, login } = useAppStore()
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [faculty, setFaculty] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = () => {
    if (name && email && password) {
      login(name)
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
      <div className="flex-1 flex flex-col px-8 pt-4 overflow-y-auto scrollbar-hide">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <h2 className="text-2xl font-bold text-[#252525] mb-1">Kreirajte racun</h2>
        <p className="text-[#6e6e6e] text-sm mb-6">Registrirajte se za pristup svim funkcionalnostima</p>

        <div className="flex flex-col gap-3.5">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#afafaf]" />
            <input
              type="text"
              placeholder="Ime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f3f3f3] text-[#252525] text-sm placeholder:text-[#afafaf] focus:outline-none focus:ring-2 focus:ring-[#49b867]/50 transition-shadow"
            />
          </div>

          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#afafaf]" />
            <input
              type="text"
              placeholder="Prezime"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f3f3f3] text-[#252525] text-sm placeholder:text-[#afafaf] focus:outline-none focus:ring-2 focus:ring-[#49b867]/50 transition-shadow"
            />
          </div>

          <div className="relative">
            <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#afafaf]" />
            <input
              type="text"
              placeholder="Fakultet"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f3f3f3] text-[#252525] text-sm placeholder:text-[#afafaf] focus:outline-none focus:ring-2 focus:ring-[#49b867]/50 transition-shadow"
            />
          </div>

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
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-4 mt-8 mb-6 rounded-2xl bg-[#49b867] text-[#ffffff] font-semibold text-base tracking-wide active:scale-[0.98] transition-transform shadow-lg shadow-[#49b867]/25"
        >
          Registriraj se
        </button>

        <p className="text-center text-sm text-[#6e6e6e] pb-8">
          Vec imate racun?{' '}
          <button onClick={() => navigate('login')} className="text-[#49b867] font-semibold">
            Prijavite se
          </button>
        </p>
      </div>
    </div>
  )
}
