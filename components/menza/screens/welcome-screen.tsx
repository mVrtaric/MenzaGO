'use client'

import { Logo } from '@/components/menza/logo'
import { useAppStore } from '@/lib/store'
import { UtensilsCrossed, ChevronRight } from 'lucide-react'

export function WelcomeScreen() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-12 right-8 w-24 h-24 rounded-full bg-[#49b867]/10" />
        <div className="absolute bottom-32 left-6 w-16 h-16 rounded-full bg-[#fda913]/10" />
        <div className="absolute top-1/4 left-12 w-8 h-8 rounded-full bg-[#49b867]/5" />

        {/* Logo and tagline */}
        <div className="flex flex-col items-center gap-6 fade-in">
          <div className="w-20 h-20 rounded-2xl bg-[#49b867] flex items-center justify-center shadow-lg shadow-[#49b867]/25">
            <UtensilsCrossed size={40} className="text-[#ffffff]" />
          </div>
          <Logo size="lg" />
          <p className="text-[#6e6e6e] text-center text-base leading-relaxed max-w-[260px]">
            Pronadi studentske restorane, pregledaj menije i ocijeni jela.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-8 pb-12 flex flex-col gap-3">
        <button
          onClick={() => navigate('login')}
          className="w-full py-4 rounded-2xl bg-[#49b867] text-[#ffffff] font-semibold text-base tracking-wide active:scale-[0.98] transition-transform shadow-lg shadow-[#49b867]/25"
        >
          Prijava
        </button>
        <button
          onClick={() => navigate('register')}
          className="w-full py-4 rounded-2xl border-2 border-[#49b867] text-[#49b867] font-semibold text-base tracking-wide active:scale-[0.98] transition-transform"
        >
          Registracija
        </button>
        <button
          onClick={() => {
            useAppStore.getState().login('Gost')
          }}
          className="flex items-center justify-center gap-1 mt-2 text-[#6e6e6e] text-sm"
        >
          Nastavi kao gost
          <ChevronRight size={14} className="text-[#6e6e6e]" />
        </button>
      </div>
    </div>
  )
}
