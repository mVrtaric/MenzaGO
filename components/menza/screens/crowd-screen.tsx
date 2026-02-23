'use client'

import { useAppStore } from '@/lib/store'
import { restaurants as allRestaurants } from '@/lib/data'
import { CrowdBadge } from '@/components/menza/screens/restaurants-screen'
import { CrowdHeatmap } from '@/components/menza/crowd-heatmap'
import { CrowdCompareDialog, type CompareRestaurant } from '@/components/menza/crowd-compare-dialog'
import { computeConfidence, computeWeightedCrowdScore, formatTimeAgo } from '@/lib/crowd'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Lock,
  Clock,
  Radio,
  CheckCircle,
  AlertTriangle,
  BadgeCheck,
  Map,
  List,
} from 'lucide-react'
import { useMemo, useState } from 'react'

function CrowdChart({ predictions, isPremium }: { predictions: { time: string; level: number }[]; isPremium: boolean }) {
  const maxLevel = 100
  return (
    <div className="relative">
      {!isPremium && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
          <Lock size={20} className="text-[#afafaf] mb-2" />
          <p className="text-xs font-medium text-[#6e6e6e]">Premium znacajka</p>
          <button
            onClick={() => useAppStore.getState().navigate('premium')}
            className="mt-2 px-4 py-1.5 rounded-full bg-[#49b867] text-[#ffffff] text-xs font-semibold"
          >
            Otključaj
          </button>
        </div>
      )}
      <div className="flex items-end gap-1.5 h-24">
        {predictions.map((p, i) => {
          const height = (p.level / maxLevel) * 100
          const color = p.level > 75 ? '#ef2723' : p.level > 45 ? '#f68620' : '#49b867'
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{ height: `${height}%`, backgroundColor: color, minHeight: 4 }}
              />
              <span className="text-[9px] text-[#afafaf]">{p.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ConfidenceChip({ label, count }: { label: 'Niska' | 'Srednja' | 'Visoka'; count: number }) {
  const styles =
    label === 'Visoka'
      ? 'bg-[#49b867]/10 text-[#49b867]'
      : label === 'Srednja'
        ? 'bg-[#f68620]/10 text-[#f68620]'
        : 'bg-[#ef2723]/10 text-[#ef2723]'

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${styles}`}>
      {label} · {count}
    </span>
  )
}

export function CrowdScreen() {
  const { goBack, navigate, selectRestaurant, isPremium, reportCrowd, selectedCity } = useAppStore()
  const crowdReportsByRestaurant = useAppStore((s) => s.crowdReportsByRestaurant)
  const anomalyUntilByRestaurant = useAppStore((s) => s.crowdAnomalyUntilByRestaurant)
  const verifiedByRestaurant = useAppStore((s) => s.verifiedCrowdByRestaurant)

  const [reportedId, setReportedId] = useState<string | null>(null)
  const [showReportSuccess, setShowReportSuccess] = useState(false)
  const [view, setView] = useState<'list' | 'map'>('list')

  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const cityRestaurants = allRestaurants.filter((r) => r.city === selectedCity)

  const enrichedRestaurants = useMemo(() => {
    const now = Date.now()
    return cityRestaurants.map((r) => {
      const reports = crowdReportsByRestaurant[r.id] ?? []
      const effective = computeWeightedCrowdScore({ reports, fallbackLevel: r.crowdLevel, now })
      const confidence = computeConfidence({ reports, now })
      const anomalyUntil = anomalyUntilByRestaurant[r.id]
      const anomalyActive = typeof anomalyUntil === 'number' && anomalyUntil > now
      return {
        ...r,
        effectiveCrowdLevel: effective.level,
        lastUpdateText: formatTimeAgo(confidence.lastUpdateAt, now),
        confidenceLabel: confidence.label,
        reportCount24h: confidence.reportCount24h,
        anomalyActive,
        verified: Boolean(verifiedByRestaurant[r.id]),
      }
    })
  }, [cityRestaurants, crowdReportsByRestaurant, anomalyUntilByRestaurant, verifiedByRestaurant])

  const compareRestaurants: [CompareRestaurant, CompareRestaurant] | null = useMemo(() => {
    if (compareIds.length !== 2) return null
    const a = enrichedRestaurants.find((r) => r.id === compareIds[0])
    const b = enrichedRestaurants.find((r) => r.id === compareIds[1])
    if (!a || !b) return null

    const toCompare = (r: typeof enrichedRestaurants[number]): CompareRestaurant => ({
      id: r.id,
      name: r.name,
      address: r.address,
      rating: r.rating,
      reviewCount: r.reviewCount,
      crowdPattern: r.crowdPattern,
      crowdTrend: r.crowdTrend,
      effectiveCrowdLevel: r.effectiveCrowdLevel,
      confidenceLabel: r.confidenceLabel,
      reportCount24h: r.reportCount24h,
      lastUpdateText: r.lastUpdateText,
    })

    return [toCompare(a), toCompare(b)]
  }, [compareIds, enrichedRestaurants])

  const toggleCompare = (restaurantId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(restaurantId)) return prev.filter((id) => id !== restaurantId)
      if (prev.length >= 2) return [prev[1], restaurantId]
      return [...prev, restaurantId]
    })
  }

  const openDetails = (restaurantId: string) => {
    selectRestaurant(restaurantId)
    navigate('restaurant-detail')
  }

  const trendIcon = (trend: 'rising' | 'falling' | 'stable') => {
    if (trend === 'rising') return <TrendingUp size={14} className="text-[#ef2723]" />
    if (trend === 'falling') return <TrendingDown size={14} className="text-[#49b867]" />
    return <Minus size={14} className="text-[#f68620]" />
  }

  const trendText = (trend: 'rising' | 'falling' | 'stable') => {
    if (trend === 'rising') return 'Raste'
    if (trend === 'falling') return 'Pada'
    return 'Stabilno'
  }

  const handleReport = (restaurantId: string, level: 'low' | 'medium' | 'high') => {
    setReportedId(restaurantId)
    reportCrowd(restaurantId, level)
    setShowReportSuccess(true)
    setTimeout(() => {
      setShowReportSuccess(false)
      setReportedId(null)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-background px-5 pt-4 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
            aria-label="Natrag"
          >
            <ArrowLeft size={22} className="text-[#252525]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#252525] tracking-tight">GUZVE</h1>
            <p className="text-xs text-[#6e6e6e]">Status u realnom vremenu</p>
          </div>
          <Radio size={20} className="text-[#49b867] animate-pulse" />
        </div>

        {/* View toggle + compare */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                view === 'list' ? 'bg-[#49b867] text-white' : 'bg-[#f3f3f3] text-[#6e6e6e]'
              }`}
            >
              <List size={14} />
              Lista
            </button>
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                view === 'map' ? 'bg-[#49b867] text-white' : 'bg-[#f3f3f3] text-[#6e6e6e]'
              }`}
            >
              <Map size={14} />
              Mapa
            </button>
          </div>

          <button
            onClick={() => setCompareOpen(true)}
            disabled={compareIds.length !== 2}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              compareIds.length === 2 ? 'bg-[#252525] text-white' : 'bg-[#f3f3f3] text-[#afafaf]'
            }`}
          >
            Usporedi ({compareIds.length}/2)
          </button>
        </div>
      </div>

      {/* Success toast */}
      {showReportSuccess && (
        <div className="mx-5 mt-2 mb-0 px-4 py-3 bg-[#49b867] rounded-xl flex items-center gap-2 fade-in">
          <CheckCircle size={16} className="text-[#ffffff]" />
          <span className="text-sm font-medium text-[#ffffff]">Hvala! Dobio si +5 bodova</span>
        </div>
      )}

      {/* Compare dialog */}
      <CrowdCompareDialog
        open={compareOpen}
        onOpenChange={setCompareOpen}
        restaurants={compareRestaurants}
        onClear={() => {
          setCompareIds([])
          setCompareOpen(false)
        }}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-6">
        {view === 'map' ? (
          <CrowdHeatmap
            city={selectedCity}
            restaurants={enrichedRestaurants.map((r) => ({
              id: r.id,
              name: r.name,
              address: r.address,
              imageUrl: r.imageUrl,
              crowdLevel: r.crowdLevel,
              effectiveCrowdLevel: r.effectiveCrowdLevel,
              crowdPredictions: r.crowdPredictions,
              confidenceLabel: r.confidenceLabel,
              reportCount24h: r.reportCount24h,
              lastUpdateText: r.lastUpdateText,
            }))}
            isPremium={isPremium}
            onOpenDetails={openDetails}
            onToggleCompare={(id) => {
              toggleCompare(id)
            }}
            selectedCompareIds={compareIds}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {enrichedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-background rounded-2xl overflow-hidden">
                {/* Restaurant header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    selectRestaurant(restaurant.id)
                    navigate('restaurant-detail')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      selectRestaurant(restaurant.id)
                      navigate('restaurant-detail')
                    }
                  }}
                  className="flex items-center gap-3 p-4 pb-3 cursor-pointer active:bg-[#f3f3f3]/50 transition-colors"
                >
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#252525] text-sm line-clamp-1">{restaurant.name}</h3>
                      {restaurant.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#49b867]/10 text-[#49b867] text-[10px] font-semibold">
                          <BadgeCheck size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <CrowdBadge level={restaurant.effectiveCrowdLevel} />
                      <div className="flex items-center gap-1">
                        {trendIcon(restaurant.crowdTrend)}
                        <span className="text-[10px] text-[#6e6e6e]">{trendText(restaurant.crowdTrend)}</span>
                      </div>
                      <ConfidenceChip label={restaurant.confidenceLabel} count={restaurant.reportCount24h} />
                      {restaurant.anomalyActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#ef2723]/10 text-[#ef2723] text-[10px] font-semibold">
                          <AlertTriangle size={12} />
                          Spike
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={11} className="text-[#afafaf]" />
                      <span className="text-[10px] text-[#afafaf]">Ažurirano: {restaurant.lastUpdateText}</span>
                    </div>
                  </div>
                </div>

                {/* Quick compare action */}
                <div className="px-4 -mt-1 pb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCompare(restaurant.id)
                    }}
                    className={`px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors ${
                      compareIds.includes(restaurant.id)
                        ? 'bg-[#49b867]/10 text-[#076639]'
                        : 'bg-[#f3f3f3] text-[#6e6e6e]'
                    }`}
                  >
                    {compareIds.includes(restaurant.id) ? 'Odabran za usporedbu' : 'Usporedi'}
                  </button>
                </div>

                {/* Prediction chart */}
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Clock size={11} className="text-[#afafaf]" />
                    <span className="text-[10px] text-[#afafaf]">Prognoza za danas</span>
                  </div>
                  <CrowdChart predictions={restaurant.crowdPredictions} isPremium={isPremium} />
                </div>

                {/* Pattern info */}
                <div className="px-4 pb-3 pt-1">
                  <p className="text-[10px] text-[#6e6e6e]">
                    Obicno najguzva u <span className="font-semibold text-[#252525]">{restaurant.crowdPattern.peakTime}</span>,
                    prazno od <span className="font-semibold text-[#49b867]">{restaurant.crowdPattern.quietTime}</span>
                  </p>
                </div>

                {/* Report crowd */}
                <div className="px-4 pb-4 pt-1 border-t border-[#f3f3f3]">
                  <p className="text-[10px] text-[#6e6e6e] mb-2">Prijavi trenutno stanje:</p>
                  {reportedId === restaurant.id ? (
                    <div className="flex items-center gap-2 py-2">
                      <CheckCircle size={14} className="text-[#49b867]" />
                      <span className="text-xs text-[#49b867] font-medium">Prijavljeno!</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReport(restaurant.id, 'low')
                        }}
                        className="flex-1 py-2 rounded-lg bg-[#49b867]/10 text-[#49b867] text-[11px] font-semibold active:scale-95 transition-transform"
                      >
                        Slobodno
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReport(restaurant.id, 'medium')
                        }}
                        className="flex-1 py-2 rounded-lg bg-[#f68620]/10 text-[#f68620] text-[11px] font-semibold active:scale-95 transition-transform"
                      >
                        Umjereno
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReport(restaurant.id, 'high')
                        }}
                        className="flex-1 py-2 rounded-lg bg-[#ef2723]/10 text-[#ef2723] text-[11px] font-semibold active:scale-95 transition-transform"
                      >
                        Guzva
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}