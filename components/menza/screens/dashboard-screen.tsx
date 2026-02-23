'use client'

import { useAppStore } from '@/lib/store'
import { dashboardData } from '@/lib/data'
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  Leaf,
  BarChart3,
  Mail,
} from 'lucide-react'

function BarChart({ data, maxValue, colorFn }: {
  data: { label: string; value: number }[]
  maxValue: number
  colorFn?: (value: number) => string
}) {
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((item, i) => {
        const height = (item.value / maxValue) * 100
        const color = colorFn ? colorFn(item.value) : '#49b867'
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[9px] font-medium text-[#6e6e6e]">{item.value}</span>
            <div className="w-full rounded-t-md" style={{ height: `${height}%`, backgroundColor: color, minHeight: 4 }} />
            <span className="text-[9px] text-[#afafaf]">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function DashboardScreen() {
  const { goBack } = useAppStore()

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-[#252525] px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={goBack} className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#ffffff]/10 transition-colors" aria-label="Natrag">
            <ArrowLeft size={22} className="text-[#ffffff]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#ffffff] tracking-tight">ANALITIKA</h1>
            <p className="text-xs text-[#ffffff]/50">B2B Dashboard</p>
          </div>
          <BarChart3 size={20} className="text-[#49b867]" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#ffffff]/10 rounded-xl p-3 text-center">
            <Users size={16} className="text-[#49b867] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#ffffff]">2,260</p>
            <p className="text-[9px] text-[#ffffff]/50">Tjedni posjetitelji</p>
          </div>
          <div className="bg-[#ffffff]/10 rounded-xl p-3 text-center">
            <TrendingUp size={16} className="text-[#fda913] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#ffffff]">{dashboardData.satisfactionRate}</p>
            <p className="text-[9px] text-[#ffffff]/50">Zadovoljstvo</p>
          </div>
          <div className="bg-[#ffffff]/10 rounded-xl p-3 text-center">
            <Leaf size={16} className="text-[#49b867] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#ffffff]">{dashboardData.weeklyWaste}%</p>
            <p className="text-[9px] text-[#ffffff]/50">Otpad hrane</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-5 pb-6 -mt-2">
        {/* Daily visitors */}
        <section className="bg-background rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-[#252525] mb-3">Dnevni posjetitelji</h3>
          <BarChart
            data={dashboardData.dailyVisitors.map(d => ({ label: d.day, value: d.count }))}
            maxValue={500}
            colorFn={(v) => v > 400 ? '#49b867' : v > 300 ? '#49b867' : '#49b867'}
          />
        </section>

        {/* Peak hours */}
        <section className="bg-background rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-[#252525] mb-3">Vrhunac guzve po satima</h3>
          <BarChart
            data={dashboardData.peakHours.map(d => ({ label: `${d.hour}h`, value: d.level }))}
            maxValue={100}
            colorFn={(v) => v > 75 ? '#ef2723' : v > 45 ? '#f68620' : '#49b867'}
          />
        </section>

        {/* Top meals */}
        <section className="bg-background rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-[#252525] mb-3">Najpopularnija jela</h3>
          <div className="flex flex-col gap-2.5">
            {dashboardData.topMeals.map((meal, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-[#fda913]/15 text-[#fda913]' : 'bg-[#f3f3f3] text-[#6e6e6e]'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#252525]">{meal.name}</span>
                    <span className="text-[10px] text-[#6e6e6e]">{meal.orders} narudzbi</span>
                  </div>
                  <div className="h-1.5 bg-[#f3f3f3] rounded-full overflow-hidden">
                    <div className="h-full bg-[#49b867] rounded-full" style={{ width: `${(meal.orders / 160) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue */}
        <section className="bg-background rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-[#252525] mb-2">Tjedni prihod</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#252525]">{dashboardData.weeklyRevenue.toLocaleString()}</span>
            <span className="text-sm text-[#6e6e6e]">&euro;</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-[#49b867]" />
            <span className="text-xs text-[#49b867] font-medium">+8.3% od proslog tjedna</span>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#252525] rounded-xl p-5 flex flex-col items-center text-center">
          <Award size={28} className="text-[#fda913] mb-2" />
          <h3 className="text-[#ffffff] font-bold text-sm mb-1">Zainteresirani ste?</h3>
          <p className="text-[#ffffff]/60 text-xs mb-4 leading-relaxed">
            Kontaktirajte nas za puni pristup analitickom dashboardu za vasu instituciju.
          </p>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#49b867] rounded-xl text-[#ffffff] font-semibold text-sm active:scale-95 transition-transform">
            <Mail size={16} />
            Kontaktirajte nas
          </button>
        </div>
      </div>
    </div>
  )
}
