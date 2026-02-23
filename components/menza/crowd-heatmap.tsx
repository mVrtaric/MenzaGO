'use client'

import { useMemo, useState } from 'react'
import { getPositionForRestaurant } from '@/lib/city-map'
import { cn } from '@/lib/utils'
import { scoreToCrowdLevel, type CrowdLevel } from '@/lib/crowd'
import { Slider } from '@/components/ui/slider'
import { Lock, Crown, MapPin, ArrowRightLeft } from 'lucide-react'

export type HeatmapRestaurant = {
  id: string
  name: string
  address: string
  imageUrl: string
  crowdLevel: CrowdLevel
  effectiveCrowdLevel: CrowdLevel
  crowdPredictions: { time: string; level: number }[]
  confidenceLabel: 'Niska' | 'Srednja' | 'Visoka'
  reportCount24h: number
  lastUpdateText: string
}

function levelColor(level: CrowdLevel) {
  if (level === 'high') return { dot: 'bg-[#ef2723]', ring: 'ring-[#ef2723]/25' }
  if (level === 'medium') return { dot: 'bg-[#f68620]', ring: 'ring-[#f68620]/25' }
  return { dot: 'bg-[#49b867]', ring: 'ring-[#49b867]/25' }
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-[#6e6e6e]">
      {([
        { label: 'Slobodno', level: 'low' as const },
        { label: 'Umjereno', level: 'medium' as const },
        { label: 'Gužva', level: 'high' as const },
      ] as const).map((i) => {
        const c = levelColor(i.level)
        return (
          <div key={i.level} className="flex items-center gap-1.5">
            <span className={cn('w-2.5 h-2.5 rounded-full', c.dot)} />
            <span>{i.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function CrowdHeatmap({
  city,
  restaurants,
  isPremium,
  onOpenDetails,
  onToggleCompare,
  selectedCompareIds,
}: {
  city: string
  restaurants: HeatmapRestaurant[]
  isPremium: boolean
  onOpenDetails: (restaurantId: string) => void
  onToggleCompare: (restaurantId: string) => void
  selectedCompareIds: string[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(restaurants[0]?.id ?? null)
  const [timeIndex, setTimeIndex] = useState(0)

  const selected = useMemo(() => restaurants.find((r) => r.id === selectedId) ?? null, [restaurants, selectedId])

  const maxPredictionIndex = Math.max(0, (selected?.crowdPredictions.length ?? 1) - 1)

  const shownTimeLabel = selected?.crowdPredictions[Math.min(timeIndex, maxPredictionIndex)]?.time ?? 'Sada'

  const markerLevels = useMemo(() => {
    const byId: Record<string, CrowdLevel> = {}
    for (const r of restaurants) {
      if (timeIndex === 0) {
        byId[r.id] = r.effectiveCrowdLevel
        continue
      }

      // Forecast mode: premium gated.
      if (!isPremium) {
        byId[r.id] = r.effectiveCrowdLevel
        continue
      }

      const p = r.crowdPredictions[Math.min(timeIndex, r.crowdPredictions.length - 1)]
      byId[r.id] = scoreToCrowdLevel(p?.level ?? 50)
    }
    return byId
  }, [restaurants, timeIndex, isPremium])

  return (
    <div className="bg-background rounded-2xl overflow-hidden border border-[#e3e3e3]">
      <div className="p-4 border-b border-[#f3f3f3]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#252525]">Mapa gužvi</p>
            <p className="text-[10px] text-[#6e6e6e] flex items-center gap-1">
              <MapPin size={11} className="text-[#49b867]" />
              {city} · {timeIndex === 0 ? 'Sada' : `Prognoza ${shownTimeLabel}`}
            </p>
          </div>
          <Legend />
        </div>

        <div className="mt-4 relative">
          {!isPremium && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
              <Lock size={18} className="text-[#afafaf]" />
              <p className="text-xs font-semibold text-[#6e6e6e] mt-1">Prognoza je Premium</p>
              <p className="text-[10px] text-[#afafaf]">Slider je zaključan</p>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] text-[#6e6e6e] font-medium">Vrijeme</p>
            <p className="text-[10px] text-[#252525] font-semibold">{timeIndex === 0 ? 'Sada' : shownTimeLabel}</p>
          </div>
          <div className={cn('mt-2', !isPremium ? 'pointer-events-none opacity-60' : '')}>
            <Slider
              value={[timeIndex]}
              min={0}
              max={Math.max(0, Math.max(...restaurants.map((r) => r.crowdPredictions.length - 1)))}
              step={1}
              onValueChange={(v) => setTimeIndex(v[0] ?? 0)}
            />
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="relative h-[260px] bg-[#f3f3f3]">
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage:
            'radial-gradient(circle at 25% 30%, rgba(73,184,103,0.20), transparent 45%), radial-gradient(circle at 65% 55%, rgba(246,134,32,0.18), transparent 45%), radial-gradient(circle at 55% 80%, rgba(239,39,35,0.14), transparent 45%)',
        }} />

        {restaurants.map((r, idx) => {
          const pos = getPositionForRestaurant({ city, restaurantId: r.id, index: idx, total: restaurants.length })
          const level = markerLevels[r.id] ?? r.effectiveCrowdLevel
          const c = levelColor(level)
          const isSelected = r.id === selectedId
          const inCompare = selectedCompareIds.includes(r.id)

          return (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-8 transition-all',
                c.ring,
                isSelected ? 'scale-110 ring-10' : 'hover:scale-105',
              )}
              style={{ left: `${pos.xPct}%`, top: `${pos.yPct}%` }}
              aria-label={r.name}
            >
              <span className={cn('w-3.5 h-3.5 rounded-full block', c.dot)} />
              {inCompare && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#252525] text-white text-[9px] font-bold flex items-center justify-center">
                  2
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected panel */}
      {selected && (
        <div className="p-4 border-t border-[#f3f3f3]">
          <div className="flex items-start gap-3">
            <img src={selected.imageUrl} alt={selected.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" crossOrigin="anonymous" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#252525] line-clamp-1">{selected.name}</p>
              <p className="text-[10px] text-[#6e6e6e] line-clamp-1">{selected.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#6e6e6e]">
                  Pouzdanost: <span className="font-semibold text-[#252525]">{selected.confidenceLabel} · {selected.reportCount24h}</span>
                </span>
                <span className="text-[10px] text-[#afafaf]">Ažurirano: {selected.lastUpdateText}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => onOpenDetails(selected.id)}
              className="py-3 rounded-2xl bg-[#49b867] text-white text-sm font-semibold active:scale-[0.98] transition-transform"
            >
              Detalji
            </button>
            <button
              onClick={() => onToggleCompare(selected.id)}
              className={cn(
                'py-3 rounded-2xl border text-sm font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2',
                selectedCompareIds.includes(selected.id)
                  ? 'border-[#49b867]/30 bg-[#49b867]/5 text-[#076639]'
                  : 'border-[#e3e3e3] bg-background text-[#252525]',
              )}
            >
              <ArrowRightLeft size={16} className={selectedCompareIds.includes(selected.id) ? 'text-[#49b867]' : 'text-[#6e6e6e]'} />
              Usporedi
            </button>
          </div>

          {!isPremium && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-2xl bg-[#fda913]/10">
              <Crown size={16} className="text-[#fda913]" />
              <p className="text-[11px] text-[#6e6e6e]">
                Otključaj prognozu na mapi u Premiumu.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
