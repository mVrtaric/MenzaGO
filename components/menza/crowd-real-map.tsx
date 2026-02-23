'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { loadGoogleMaps } from '@/lib/google-maps'
import { getRestaurantLatLng } from '@/lib/restaurant-locations'
import { scoreToCrowdLevel, type CrowdLevel } from '@/lib/crowd'
import { Slider } from '@/components/ui/slider'
import { Lock, Crown, MapPin, ArrowRightLeft } from 'lucide-react'

export type RealMapRestaurant = {
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

function levelColors(level: CrowdLevel) {
  if (level === 'high') return { fill: '#ef2723', stroke: '#ffffff' }
  if (level === 'medium') return { fill: '#f68620', stroke: '#ffffff' }
  return { fill: '#49b867', stroke: '#ffffff' }
}

export function CrowdRealMap({
  apiKey,
  city,
  restaurants,
  isPremium,
  onOpenDetails,
  onToggleCompare,
  selectedCompareIds,
}: {
  apiKey: string
  city: string
  restaurants: RealMapRestaurant[]
  isPremium: boolean
  onOpenDetails: (restaurantId: string) => void
  onToggleCompare: (restaurantId: string) => void
  selectedCompareIds: string[]
}) {
  const mapDivRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  const [selectedId, setSelectedId] = useState<string | null>(restaurants[0]?.id ?? null)
  const [timeIndex, setTimeIndex] = useState(0)

  const withCoords = useMemo(() => {
    return restaurants
      .map((r) => ({ r, ll: getRestaurantLatLng(city, r.id) }))
      .filter((x) => x.ll)
      .map((x) => ({ r: x.r, ll: x.ll! }))
  }, [restaurants, city])

  const selected = useMemo(
    () => restaurants.find((r) => r.id === selectedId) ?? null,
    [restaurants, selectedId],
  )

  const shownTimeLabel = selected?.crowdPredictions[Math.min(timeIndex, (selected?.crowdPredictions.length ?? 1) - 1)]?.time ?? 'Sada'

  const markerLevels = useMemo(() => {
    const byId: Record<string, CrowdLevel> = {}
    for (const r of restaurants) {
      if (timeIndex === 0) {
        byId[r.id] = r.effectiveCrowdLevel
        continue
      }
      if (!isPremium) {
        byId[r.id] = r.effectiveCrowdLevel
        continue
      }
      const p = r.crowdPredictions[Math.min(timeIndex, r.crowdPredictions.length - 1)]
      byId[r.id] = scoreToCrowdLevel(p?.level ?? 50)
    }
    return byId
  }, [restaurants, timeIndex, isPremium])

  // Init map + markers
  useEffect(() => {
    let cancelled = false

    async function init() {
      const maps = await loadGoogleMaps(apiKey)
      if (cancelled) return
      if (!mapDivRef.current) return

      const el = mapDivRef.current

      if (!mapRef.current) {
        // Default center: Zagreb
        const center = { lat: 45.815, lng: 15.981 }
        mapRef.current = new maps.Map(el, {
          center,
          zoom: 12,
          mapTypeId: maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy',
        })
      }

      // Create/update markers
      const bounds = new maps.LatLngBounds()
      for (const { r, ll } of withCoords) {
        bounds.extend(ll)

        if (!markersRef.current[r.id]) {
          const marker = new maps.Marker({
            position: ll,
            map: mapRef.current,
            title: r.name,
          })
          marker.addListener('click', () => setSelectedId(r.id))
          markersRef.current[r.id] = marker
        } else {
          markersRef.current[r.id].setPosition(ll)
          markersRef.current[r.id].setMap(mapRef.current)
        }
      }

      // Hide markers for restaurants without coords (or removed)
      for (const id of Object.keys(markersRef.current)) {
        const exists = withCoords.some((x) => x.r.id === id)
        if (!exists) markersRef.current[id].setMap(null)
      }

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, 42)
      }

      // Trigger resize so tiles render (needed when map was in tab or initially hidden)
      requestAnimationFrame(() => {
        if (!cancelled && mapRef.current) maps.event.trigger(mapRef.current, 'resize')
      })
    }

    init().catch(() => {
      // If map fails, keep UI minimal; CrowdScreen will fallback when key is missing.
    })

    return () => {
      cancelled = true
    }
  }, [apiKey, withCoords])

  // Update marker styling when levels change
  useEffect(() => {
    async function updateIcons() {
      const maps = window.google?.maps
      if (!maps) return
      for (const r of restaurants) {
        const marker = markersRef.current[r.id]
        if (!marker) continue
        const level = markerLevels[r.id] ?? r.effectiveCrowdLevel
        const c = levelColors(level)

        marker.setIcon({
          path: maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: c.fill,
          fillOpacity: 0.9,
          strokeColor: c.stroke,
          strokeWeight: 2,
        })

        // Slight zIndex bias for selection
        marker.setZIndex(r.id === selectedId ? 1000 : 1)
      }
    }

    updateIcons()
  }, [markerLevels, restaurants, selectedId])

  const sliderMax = Math.max(0, Math.max(...restaurants.map((r) => r.crowdPredictions.length - 1)))

  return (
    <div className="bg-background rounded-2xl overflow-hidden border border-[#e3e3e3]">
      <div className="p-4 border-b border-[#f3f3f3]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#252525]">Mapa gužvi (Google)</p>
            <p className="text-[10px] text-[#6e6e6e] flex items-center gap-1">
              <MapPin size={11} className="text-[#49b867]" />
              {city} · {timeIndex === 0 ? 'Sada' : `Prognoza ${shownTimeLabel}`}
            </p>
          </div>
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
              max={sliderMax}
              step={1}
              onValueChange={(v) => setTimeIndex(v[0] ?? 0)}
            />
          </div>
        </div>
      </div>

      {/* Map area - explicit dimensions required for Google Maps tiles */}
      <div className="relative w-full h-[320px] min-h-[320px] bg-[#e5e3df]">
        <div
          ref={mapDivRef}
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: 320 }}
        />
      </div>

      {/* Selected panel */}
      {selected && (
        <div className="p-4 border-t border-[#f3f3f3]">
          <div className="flex items-start gap-3">
            <img
              src={selected.imageUrl}
              alt={selected.name}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
              crossOrigin="anonymous"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#252525] line-clamp-1">{selected.name}</p>
              <p className="text-[10px] text-[#6e6e6e] line-clamp-1">{selected.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#6e6e6e]">
                  Pouzdanost:{' '}
                  <span className="font-semibold text-[#252525]">
                    {selected.confidenceLabel} · {selected.reportCount24h}
                  </span>
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
              <ArrowRightLeft
                size={16}
                className={selectedCompareIds.includes(selected.id) ? 'text-[#49b867]' : 'text-[#6e6e6e]'}
              />
              Usporedi
            </button>
          </div>

          {!isPremium && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-2xl bg-[#fda913]/10">
              <Crown size={16} className="text-[#fda913]" />
              <p className="text-[11px] text-[#6e6e6e]">Otključaj prognozu na mapi u Premiumu.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
