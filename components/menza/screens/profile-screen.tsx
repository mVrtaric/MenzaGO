'use client'

import { useAppStore } from '@/lib/store'
import { badges, getLevelForPoints } from '@/lib/data'
import {
  ArrowLeft,
  Crown,
  Star,
  MessageSquare,
  Radio,
  Award,
  GraduationCap,
  ChefHat,
  Calendar,
  Lock,
  Leaf,
  Shield,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  GraduationCap, Radio, MessageSquare, ChefHat, Calendar, Award,
}

export function ProfileScreen() {
  const {
    goBack, userName, points, earnedBadges, crowdReports, reviewsCount,
    isPremium, navigate, isVegetarianFilter, setVegetarianFilter,
    monthlySpent,
  } = useAppStore()

  const level = getLevelForPoints(points)
  const progress = Math.min(((points - level.min) / (level.max - level.min)) * 100, 100)

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-[#49b867] px-5 pt-4 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={goBack} className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#ffffff]/10 transition-colors" aria-label="Natrag">
            <ArrowLeft size={22} className="text-[#ffffff]" />
          </button>
          <h1 className="text-lg font-bold text-[#ffffff] tracking-tight flex-1">PROFIL</h1>
          {isPremium && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fda913] text-[#252525] text-[10px] font-bold">
              <Crown size={11} /> PRO
            </span>
          )}
        </div>

        {/* Avatar & Level */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#ffffff]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-[#ffffff]">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-[#ffffff] font-bold text-lg">{userName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#ffffff]/80 text-xs font-medium">{level.name}</span>
              <span className="text-[#ffffff]/50 text-[10px]">{points} bodova</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 bg-[#ffffff]/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#fda913] rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-[#ffffff]/50 mt-1">
              Jos {level.max - points} do razine {level.name === 'Doktor' ? 'max' : points >= 200 ? 'Doktor' : points >= 50 ? 'Magistar' : 'Student'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-5 pb-6 -mt-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: Star, label: 'Bodovi', value: points.toString(), color: '#fda913' },
            { icon: Radio, label: 'Prijave', value: crowdReports.toString(), color: '#49b867' },
            { icon: MessageSquare, label: 'Recenzije', value: reviewsCount.toString(), color: '#2b7a83' },
          ].map((stat) => (
            <div key={stat.label} className="bg-background rounded-xl p-3 flex flex-col items-center gap-1.5">
              <stat.icon size={18} style={{ color: stat.color }} />
              <span className="text-lg font-bold text-[#252525]">{stat.value}</span>
              <span className="text-[10px] text-[#6e6e6e]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Budget Tracker */}
        <section className="bg-background rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#252525]">Mjesecna potrosnja</h3>
            {!isPremium && <Lock size={14} className="text-[#afafaf]" />}
          </div>
          {isPremium ? (
            <div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-[#252525]">{monthlySpent.toFixed(2)}</span>
                <span className="text-sm text-[#6e6e6e]">&euro; ovaj mjesec</span>
              </div>
              <div className="h-2 bg-[#f3f3f3] rounded-full overflow-hidden">
                <div className="h-full bg-[#49b867] rounded-full" style={{ width: `${Math.min((monthlySpent / 80) * 100, 100)}%` }} />
              </div>
              <p className="text-[10px] text-[#6e6e6e] mt-1">Procijenjeni budzet: 80.00 &euro;/mj</p>
            </div>
          ) : (
            <button onClick={() => navigate('premium')} className="w-full py-3 rounded-xl bg-[#f3f3f3] text-xs text-[#6e6e6e] font-medium">
              Otključaj s Premium
            </button>
          )}
        </section>

        {/* Badges */}
        <section className="bg-background rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-[#252525] mb-3">Bedževi</h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => {
              const isEarned = earnedBadges.includes(badge.id)
              const IconComp = iconMap[badge.icon] || Award
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    isEarned ? 'border-[#49b867]/30 bg-[#49b867]/5' : 'border-[#e3e3e3] opacity-40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isEarned ? 'bg-[#49b867]/15' : 'bg-[#f3f3f3]'
                  }`}>
                    {isEarned ? (
                      <IconComp size={18} className="text-[#49b867]" />
                    ) : (
                      <Lock size={14} className="text-[#afafaf]" />
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-[#252525] text-center leading-tight">{badge.name}</span>
                  <span className="text-[9px] text-[#afafaf]">{badge.requiredPoints} bod.</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Dietary Preferences */}
        <section className="bg-background rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-[#252525] mb-3">Preferencije prehrane</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-[#49b867]" />
                <span className="text-sm text-[#252525]">Vegetarijanac</span>
              </div>
              <button
                onClick={() => setVegetarianFilter(!isVegetarianFilter)}
                className={`w-11 h-6 rounded-full transition-colors relative ${isVegetarianFilter ? 'bg-[#49b867]' : 'bg-[#e3e3e3]'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm transition-transform ${isVegetarianFilter ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            <button
              onClick={() => navigate('allergens')}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#f68620]" />
                <span className="text-sm text-[#252525]">Alergeni</span>
              </div>
              <span className="text-xs text-[#6e6e6e]">Postavi &rarr;</span>
            </button>
          </div>
        </section>

        {/* Premium CTA */}
        {!isPremium && (
          <button
            onClick={() => navigate('premium')}
            className="w-full p-4 bg-gradient-to-r from-[#49b867] to-[#076639] rounded-xl flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <Crown size={24} className="text-[#fda913]" />
            <div className="flex-1 text-left">
              <h3 className="text-[#ffffff] font-bold text-sm">Nadogradi na Premium</h3>
              <p className="text-[#ffffff]/70 text-xs">Samo 1.99 &euro;/mjesec</p>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
