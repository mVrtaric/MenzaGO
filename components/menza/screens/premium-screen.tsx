'use client'

import { useAppStore } from '@/lib/store'
import { premiumFeatures } from '@/lib/data'
import {
  ArrowLeft,
  Crown,
  Check,
  BarChart3,
  Bell,
  CalendarDays,
  Heart,
  Wallet,
  Sparkles,
  Zap,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  BarChart3, Bell, CalendarDays, Heart, Wallet,
}

export function PremiumScreen() {
  const { goBack, isPremium, togglePremium, navigate } = useAppStore()

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-background px-5 pt-4 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#f3f3f3] transition-colors" aria-label="Natrag">
            <ArrowLeft size={22} className="text-[#252525]" />
          </button>
          <h1 className="text-lg font-bold text-[#252525] tracking-tight">PREMIUM</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[#49b867] to-[#076639] rounded-2xl p-6 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#ffffff]/5 -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#ffffff]/5 translate-y-6 -translate-x-6" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={28} className="text-[#fda913]" />
              <h2 className="text-xl font-bold text-[#ffffff]">MenzaGO Pro</h2>
            </div>

            {isPremium ? (
              <div className="flex items-center gap-2 mb-4">
                <Check size={18} className="text-[#fda913]" />
                <span className="text-[#ffffff] font-medium text-sm">Premium je aktivan!</span>
              </div>
            ) : (
              <>
                <p className="text-[#ffffff]/80 text-sm mb-4 leading-relaxed">
                  Otključaj napredne znacajke za pametnije upravljanje studentskim obrocima.
                </p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-[#ffffff]">1.99</span>
                  <span className="text-[#ffffff]/70 text-sm">&euro;/mjesec</span>
                </div>
              </>
            )}

            <button
              onClick={togglePremium}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide active:scale-[0.98] transition-transform ${
                isPremium
                  ? 'bg-[#ffffff]/20 text-[#ffffff]'
                  : 'bg-[#ffffff] text-[#49b867] shadow-lg'
              }`}
            >
              {isPremium ? 'Deaktiviraj Premium' : 'Aktiviraj Premium'}
            </button>
          </div>
        </div>

        {/* Features List */}
        <h3 className="text-sm font-bold text-[#252525] mb-3">Sto dobijes:</h3>
        <div className="flex flex-col gap-3 mb-6">
          {premiumFeatures.map((feature, idx) => {
            const IconComp = iconMap[feature.icon] || Sparkles
            const isPlanner = feature.id === 'pf3'
            const isClickable = isPremium && isPlanner
            return (
              <div
                key={feature.id}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={isClickable ? () => navigate('meal-planner') : undefined}
                onKeyDown={isClickable ? (e) => e.key === 'Enter' && navigate('meal-planner') : undefined}
                className={`bg-background rounded-xl p-4 flex items-start gap-3.5 fade-in ${isClickable ? 'active:scale-[0.99] transition-transform cursor-pointer' : ''}`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#49b867]/10 flex items-center justify-center shrink-0">
                  <IconComp size={20} className="text-[#49b867]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#252525] text-sm">{feature.name}</h4>
                  <p className="text-xs text-[#6e6e6e] mt-0.5 leading-relaxed">{feature.description}</p>
                </div>
                {isPremium && <Check size={18} className="text-[#49b867] shrink-0 mt-1" />}
              </div>
            )
          })}
        </div>

        {/* Comparison */}
        <div className="bg-background rounded-xl overflow-hidden mb-4">
          <div className="grid grid-cols-3 text-center">
            <div className="p-3 border-b border-r border-[#e3e3e3]">
              <span className="text-[10px] font-medium text-[#6e6e6e]">Znacajka</span>
            </div>
            <div className="p-3 border-b border-r border-[#e3e3e3]">
              <span className="text-[10px] font-medium text-[#6e6e6e]">Besplatno</span>
            </div>
            <div className="p-3 border-b border-[#e3e3e3] bg-[#49b867]/5">
              <span className="text-[10px] font-bold text-[#49b867]">Pro</span>
            </div>
          </div>
          {[
            { feature: 'Pregled menija', free: true, pro: true },
            { feature: 'Recenzije', free: true, pro: true },
            { feature: 'Favoriti', free: true, pro: true },
            { feature: 'Predikcije guzve', free: false, pro: true },
            { feature: 'Pametne obavijesti', free: false, pro: true },
            { feature: 'Planer obroka', free: false, pro: true },
            { feature: 'Praćenje budzeta', free: false, pro: true },
          ].map((row, idx) => (
            <div key={idx} className="grid grid-cols-3 text-center border-b border-[#f3f3f3] last:border-0">
              <div className="p-2.5 border-r border-[#f3f3f3] text-left">
                <span className="text-[10px] text-[#252525]">{row.feature}</span>
              </div>
              <div className="p-2.5 border-r border-[#f3f3f3] flex items-center justify-center">
                {row.free ? <Check size={14} className="text-[#49b867]" /> : <span className="text-[#afafaf]">-</span>}
              </div>
              <div className="p-2.5 bg-[#49b867]/5 flex items-center justify-center">
                <Check size={14} className="text-[#49b867]" />
              </div>
            </div>
          ))}
        </div>

        {/* Student-friendly note */}
        <div className="flex items-start gap-2 p-3 bg-[#fda913]/10 rounded-xl">
          <Zap size={16} className="text-[#fda913] flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#6e6e6e] leading-relaxed">
            <span className="font-semibold text-[#252525]">Studentski prijateljska cijena.</span> Manje od jednog kockasti sendvica mjesecno za sve premium znacajke!
          </p>
        </div>
      </div>
    </div>
  )
}
