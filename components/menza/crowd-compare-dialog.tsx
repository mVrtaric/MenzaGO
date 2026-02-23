'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CrowdBadge } from '@/components/menza/screens/restaurants-screen'
import { StarRating } from '@/components/menza/star-rating'
import { MapPin, X } from 'lucide-react'

export type CompareRestaurant = {
  id: string
  name: string
  address: string
  rating: number
  reviewCount: number
  crowdPattern: { peakTime: string; quietTime: string }
  crowdTrend: 'rising' | 'falling' | 'stable'
  effectiveCrowdLevel: 'low' | 'medium' | 'high'
  confidenceLabel: 'Niska' | 'Srednja' | 'Visoka'
  reportCount24h: number
  lastUpdateText: string
}

function CompareCard({ r }: { r: CompareRestaurant }) {
  return (
    <div className="rounded-2xl border border-[#e3e3e3] bg-background p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-[#252525] leading-snug">{r.name}</h3>
        <CrowdBadge level={r.effectiveCrowdLevel} />
      </div>

      <div className="flex items-start gap-2 mb-3">
        <MapPin size={14} className="text-[#afafaf] mt-0.5" />
        <p className="text-[11px] text-[#6e6e6e] leading-relaxed">{r.address}</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StarRating rating={r.rating} size={11} />
          <span className="text-xs font-semibold text-[#252525]">{r.rating}</span>
          <span className="text-[10px] text-[#afafaf]">({r.reviewCount})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#f3f3f3] p-2.5">
          <p className="text-[10px] text-[#6e6e6e]">Pouzdanost</p>
          <p className="text-xs font-semibold text-[#252525]">
            {r.confidenceLabel} · {r.reportCount24h}
          </p>
        </div>
        <div className="rounded-xl bg-[#f3f3f3] p-2.5">
          <p className="text-[10px] text-[#6e6e6e]">Zadnje</p>
          <p className="text-xs font-semibold text-[#252525]">{r.lastUpdateText}</p>
        </div>
        <div className="rounded-xl bg-[#f3f3f3] p-2.5">
          <p className="text-[10px] text-[#6e6e6e]">Najveća gužva</p>
          <p className="text-xs font-semibold text-[#252525]">{r.crowdPattern.peakTime}</p>
        </div>
        <div className="rounded-xl bg-[#f3f3f3] p-2.5">
          <p className="text-[10px] text-[#6e6e6e]">Mirno</p>
          <p className="text-xs font-semibold text-[#252525]">{r.crowdPattern.quietTime}</p>
        </div>
      </div>
    </div>
  )
}

export function CrowdCompareDialog({
  open,
  onOpenChange,
  restaurants,
  onClear,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  restaurants: [CompareRestaurant, CompareRestaurant] | null
  onClear: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden">
        <div className="p-5 border-b border-[#e3e3e3] flex items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-base">Usporedba restorana</DialogTitle>
          </DialogHeader>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6e6e6e] px-2.5 py-1.5 rounded-lg bg-[#f3f3f3]"
          >
            <X size={14} />
            Očisti
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 gap-3">
          {restaurants ? (
            <>
              <CompareCard r={restaurants[0]} />
              <CompareCard r={restaurants[1]} />
            </>
          ) : (
            <p className="text-sm text-[#6e6e6e]">Odaberi 2 restorana za usporedbu.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
