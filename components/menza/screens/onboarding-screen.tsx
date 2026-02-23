'use client'

import { useMemo, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { restaurants, allergensList } from '@/lib/data'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Leaf,
  Shield,
  Heart,
  Wallet,
  Bell,
  Radio,
} from 'lucide-react'

const steps = [
  { id: 'diet', title: 'Preferencije prehrane' },
  { id: 'favorites', title: 'Omiljeni restorani' },
  { id: 'budget', title: 'Budžet' },
  { id: 'notifications', title: 'Obavijesti' },
  { id: 'crowd', title: 'Prijava gužve' },
] as const

type StepId = (typeof steps)[number]['id']

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {steps.map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-[#49b867]' : 'w-1.5 bg-[#e3e3e3]'}`}
        />
      ))}
    </div>
  )
}

export function OnboardingScreen() {
  const {
    goBack,
    navigate,
    selectedCity,
    favoriteRestaurants,
    toggleFavoriteRestaurant,
    isVegetarianFilter,
    setVegetarianFilter,
    excludedAllergens,
    toggleAllergenExclusion,
    budgetMax,
    setBudgetMax,
    notificationsEnabled,
    setNotificationsEnabled,
    completeOnboarding,
  } = useAppStore()

  const [stepIndex, setStepIndex] = useState(0)
  const step = steps[stepIndex]

  const cityRestaurants = useMemo(() => restaurants.filter((r) => r.city === selectedCity), [selectedCity])

  const next = () => {
    if (stepIndex >= steps.length - 1) {
      completeOnboarding()
      navigate('home')
      return
    }
    setStepIndex((s) => Math.min(steps.length - 1, s + 1))
  }

  const back = () => {
    if (stepIndex === 0) {
      goBack()
      return
    }
    setStepIndex((s) => Math.max(0, s - 1))
  }

  const skipAll = () => {
    completeOnboarding()
    navigate('home')
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[#e3e3e3]">
        <div className="flex items-center gap-3">
          <button
            onClick={back}
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
            aria-label="Natrag"
          >
            <ArrowLeft size={22} className="text-[#252525]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#252525] line-clamp-1">Postavke za tebe</h1>
            <p className="text-[10px] text-[#6e6e6e]">Korak {stepIndex + 1} / {steps.length} · {step.title}</p>
          </div>
          <button onClick={skipAll} className="text-xs font-semibold text-[#6e6e6e] px-2 py-1 rounded-md active:bg-[#f3f3f3]">
            Preskoči
          </button>
        </div>
        <div className="mt-3">
          <StepDots current={stepIndex} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5">
        {step.id === 'diet' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#f3f3f3]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf size={18} className="text-[#49b867]" />
                  <div>
                    <p className="text-sm font-semibold text-[#252525]">Vegetarijanska preporuka</p>
                    <p className="text-[11px] text-[#6e6e6e]">Filtriraj i istakni vege opcije</p>
                  </div>
                </div>
                <button
                  onClick={() => setVegetarianFilter(!isVegetarianFilter)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isVegetarianFilter ? 'bg-[#49b867]' : 'bg-[#e3e3e3]'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm transition-transform ${isVegetarianFilter ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#e3e3e3]">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-[#f68620]" />
                <div>
                  <p className="text-sm font-semibold text-[#252525]">Alergeni za isključiti</p>
                  <p className="text-[11px] text-[#6e6e6e]">Sakrij jela koja sadrže odabrane alergene</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {allergensList.slice(0, 8).map((a) => {
                  const checked = excludedAllergens.includes(a.id)
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleAllergenExclusion(a.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-colors ${
                        checked ? 'border-[#49b867]/30 bg-[#49b867]/5' : 'border-[#e3e3e3]'
                      }`}
                    >
                      <span className="text-xs text-[#252525]">{a.id}. {a.name}</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${checked ? 'bg-[#49b867] text-white' : 'bg-[#f3f3f3] text-[#afafaf]'}`}>
                        <Check size={12} />
                      </span>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => navigate('allergens')}
                className="mt-3 w-full py-2.5 rounded-xl bg-[#f3f3f3] text-xs font-semibold text-[#6e6e6e]"
              >
                Prikaži sve alergene
              </button>
            </div>
          </div>
        )}

        {step.id === 'favorites' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#f3f3f3]">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#ef2723]" />
                <div>
                  <p className="text-sm font-semibold text-[#252525]">Odaberi omiljene restorane</p>
                  <p className="text-[11px] text-[#6e6e6e]">Za brži pristup i bolje preporuke</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {cityRestaurants.map((r) => {
                const isFav = favoriteRestaurants.includes(r.id)
                return (
                  <button
                    key={r.id}
                    onClick={() => toggleFavoriteRestaurant(r.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      isFav ? 'border-[#49b867]/30 bg-[#49b867]/5' : 'border-[#e3e3e3]'
                    }`}
                  >
                    <img src={r.imageUrl} alt={r.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" crossOrigin="anonymous" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-[#252525] line-clamp-1">{r.name}</p>
                      <p className="text-[10px] text-[#6e6e6e] line-clamp-1">{r.address}</p>
                    </div>
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center ${isFav ? 'bg-[#49b867] text-white' : 'bg-[#f3f3f3] text-[#afafaf]'}`}>
                      <Heart size={14} className={isFav ? 'fill-white' : ''} />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step.id === 'budget' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#f3f3f3]">
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-[#2b7a83]" />
                <div>
                  <p className="text-sm font-semibold text-[#252525]">Postavi maksimalnu cijenu obroka</p>
                  <p className="text-[11px] text-[#6e6e6e]">Pomoći će preporukama (U budžetu)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[null, 1.5, 2.0, 2.5, 3.0, 3.5].map((v, idx) => {
                const active = (budgetMax ?? null) === v
                const label = v == null ? 'Bez limita' : `Do ${v.toFixed(2)} €`
                return (
                  <button
                    key={idx}
                    onClick={() => setBudgetMax(v)}
                    className={`py-3 rounded-2xl border text-sm font-semibold transition-colors ${
                      active ? 'border-[#49b867]/30 bg-[#49b867]/5 text-[#076639]' : 'border-[#e3e3e3] text-[#252525]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <div className="p-4 rounded-2xl border border-[#e3e3e3]">
              <p className="text-xs text-[#6e6e6e]">
                Trenutno: <span className="font-semibold text-[#252525]">{budgetMax == null ? 'Bez limita' : `${budgetMax.toFixed(2)} €`}</span>
              </p>
            </div>
          </div>
        )}

        {step.id === 'notifications' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#f3f3f3]">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-[#fda913]" />
                <div>
                  <p className="text-sm font-semibold text-[#252525]">Uključi obavijesti</p>
                  <p className="text-[11px] text-[#6e6e6e]">Npr. “Tvoj favorit je prazan sada”</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#e3e3e3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#252525]">Smart obavijesti</p>
                  <p className="text-[11px] text-[#6e6e6e]">Možeš isključiti bilo kada u profilu</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-[#49b867]' : 'bg-[#e3e3e3]'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm transition-transform ${notificationsEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step.id === 'crowd' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#49b867]/10">
              <div className="flex items-center gap-2">
                <Radio size={18} className="text-[#49b867]" />
                <div>
                  <p className="text-sm font-semibold text-[#252525]">Prijavi gužvu u 2 sekunde</p>
                  <p className="text-[11px] text-[#6e6e6e]">Tvoja prijava pomaže svima — i donosi bodove</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#e3e3e3]">
              <p className="text-xs text-[#252525] font-semibold mb-2">Kako radi:</p>
              <ol className="text-xs text-[#6e6e6e] list-decimal pl-5 space-y-1">
                <li>Otvori ekran <span className="font-semibold text-[#252525]">Gužve</span></li>
                <li>Na restoranu klikni <span className="font-semibold text-[#252525]">Slobodno / Umjereno / Gužva</span></li>
                <li>Dobićeš <span className="font-semibold text-[#49b867]">+5 bodova</span></li>
              </ol>
              <button
                onClick={() => navigate('crowd')}
                className="mt-4 w-full py-3 rounded-2xl bg-[#49b867] text-[#ffffff] font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                Isprobaj odmah
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#f3f3f3]">
              <p className="text-[11px] text-[#6e6e6e]">
                Tip: Prati oznaku <span className="font-semibold text-[#252525]">Pouzdanost</span> i <span className="font-semibold text-[#252525]">Ažurirano</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-[#e3e3e3] bg-background">
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl bg-[#49b867] text-[#ffffff] font-semibold text-base tracking-wide active:scale-[0.98] transition-transform shadow-lg shadow-[#49b867]/20 flex items-center justify-center gap-2"
        >
          {stepIndex === steps.length - 1 ? 'Završi' : 'Nastavi'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
