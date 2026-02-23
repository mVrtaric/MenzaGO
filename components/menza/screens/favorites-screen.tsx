'use client'

import { useAppStore } from '@/lib/store'
import { restaurants, meals } from '@/lib/data'
import { CrowdBadge } from '@/components/menza/screens/restaurants-screen'
import { StarRating } from '@/components/menza/star-rating'
import { computeWeightedCrowdScore } from '@/lib/crowd'
import { ArrowLeft, MapPin, Heart, Leaf } from 'lucide-react'
import { useMemo, useState } from 'react'

export function FavoritesScreen() {
  const {
    goBack,
    navigate,
    selectRestaurant,
    selectMeal,
    favoriteRestaurants,
    favoriteMeals,
    toggleFavoriteRestaurant,
    toggleFavoriteMeal,
    crowdReportsByRestaurant,
  } = useAppStore()
  const [activeTab, setActiveTab] = useState<'restaurants' | 'meals'>('restaurants')

  const favRestaurants = restaurants.filter((r) => favoriteRestaurants.includes(r.id))

  const effectiveCrowdByRestaurant = useMemo(() => {
    const now = Date.now()
    const map: Record<string, 'low' | 'medium' | 'high'> = {}
    for (const r of favRestaurants) {
      const reports = crowdReportsByRestaurant[r.id] ?? []
      const { level } = computeWeightedCrowdScore({ reports, fallbackLevel: r.crowdLevel, now })
      map[r.id] = level
    }
    return map
  }, [favRestaurants, crowdReportsByRestaurant])
  const favMeals = meals.filter((m) => favoriteMeals.includes(m.id))

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-background px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
            aria-label="Natrag"
          >
            <ArrowLeft size={22} className="text-[#252525]" />
          </button>
          <h1 className="text-lg font-bold text-[#252525]">FAVORITI</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'restaurants'
                ? 'bg-[#49b867] text-[#ffffff] shadow-md shadow-[#49b867]/25'
                : 'bg-[#f3f3f3] text-[#6e6e6e]'
            }`}
          >
            Restorani
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'meals'
                ? 'bg-[#49b867] text-[#ffffff] shadow-md shadow-[#49b867]/25'
                : 'bg-[#f3f3f3] text-[#6e6e6e]'
            }`}
          >
            Jela
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-6">
        {activeTab === 'restaurants' ? (
          favRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart size={40} className="text-[#e3e3e3] mb-3" />
              <p className="text-sm text-[#6e6e6e]">Nemate omiljenih restorana.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {favRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    selectRestaurant(restaurant.id)
                    navigate('restaurant-detail')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      selectRestaurant(restaurant.id)
                      navigate('restaurant-detail')
                    }
                  }}
                  className="bg-background rounded-2xl p-5 active:scale-[0.98] transition-transform text-left fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-[#252525] text-sm flex-1 min-w-0 pr-2">{restaurant.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavoriteRestaurant(restaurant.id)
                          }}
                          className="w-9 h-9 rounded-full bg-[#f3f3f3] flex items-center justify-center shrink-0"
                          aria-label="Ukloni iz favorita"
                        >
                          <Heart size={16} className="fill-[#ef2723] text-[#ef2723]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <CrowdBadge level={effectiveCrowdByRestaurant[restaurant.id] ?? restaurant.crowdLevel} />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={13} className="text-[#afafaf] shrink-0" />
                        <span className="text-xs text-[#6e6e6e] line-clamp-1">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={restaurant.rating} size={12} />
                        <span className="text-xs font-medium text-[#252525]">{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : favMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart size={40} className="text-[#e3e3e3] mb-3" />
            <p className="text-sm text-[#6e6e6e]">Nemate omiljenih jela.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favMeals.map((meal, index) => (
              <div
                key={meal.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  selectMeal(meal.id)
                  navigate('meal-detail')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    selectMeal(meal.id)
                    navigate('meal-detail')
                  }
                }}
                className="bg-background rounded-2xl overflow-hidden active:scale-[0.98] transition-transform text-left fade-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-28 bg-[#e3e3e3]">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  {meal.isVegetarian && (
                    <div className="absolute top-2 left-2">
                      <span className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-[#49b867] text-[#ffffff] text-[10px] font-semibold">
                        <Leaf size={10} />
                        Vege
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[#252525] text-sm mb-1">{meal.name}</h3>
                      <div className="flex items-center gap-2">
                        <StarRating rating={meal.rating} size={11} />
                        <span className="text-xs text-[#6e6e6e]">({meal.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-base font-bold text-[#49b867]">{meal.price.toFixed(2)} &euro;</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavoriteMeal(meal.id)
                        }}
                        className="w-7 h-7 rounded-full bg-[#f3f3f3] flex items-center justify-center"
                        aria-label="Ukloni iz favorita"
                      >
                        <Heart size={12} className="fill-[#ef2723] text-[#ef2723]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
