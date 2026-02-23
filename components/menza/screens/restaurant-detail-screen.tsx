'use client'

import { useAppStore } from '@/lib/store'
import { restaurants } from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import {
  ArrowLeft,
  Heart,
  MapPin,
  Clock,
  Star,
  MessageSquare,
  UtensilsCrossed,
} from 'lucide-react'

export function RestaurantDetailScreen() {
  const {
    selectedRestaurantId,
    navigate,
    goBack,
    favoriteRestaurants,
    toggleFavoriteRestaurant,
  } = useAppStore()

  const restaurant = restaurants.find((r) => r.id === selectedRestaurantId)
  if (!restaurant) return null

  const isFav = favoriteRestaurants.includes(restaurant.id)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Hero Image */}
      <div className="relative h-56 bg-[#e3e3e3] flex-shrink-0">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 to-transparent" />

        {/* Nav buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center active:bg-background transition-colors"
            aria-label="Natrag"
          >
            <ArrowLeft size={20} className="text-[#252525]" />
          </button>
          <button
            onClick={() => toggleFavoriteRestaurant(restaurant.id)}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center active:bg-background transition-colors"
            aria-label={isFav ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
          >
            <Heart
              size={20}
              className={isFav ? 'fill-[#ef2723] text-[#ef2723]' : 'text-[#252525]'}
            />
          </button>
        </div>

        {/* Restaurant Name Overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <h1 className="text-xl font-bold text-[#ffffff] leading-tight text-balance">
            {restaurant.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Rating bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e3e3e3]">
          <div className="flex items-center gap-1.5">
            <Star size={18} className="fill-[#fda913] text-[#fda913]" />
            <span className="text-lg font-bold text-[#252525]">{restaurant.rating}</span>
          </div>
          <span className="text-sm text-[#6e6e6e]">{restaurant.reviewCount} recenzija</span>
        </div>

        {/* Info Cards */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#49b867]/10 flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-[#49b867]" />
            </div>
            <div>
              <p className="text-xs text-[#6e6e6e] mb-0.5">Adresa</p>
              <p className="text-sm font-medium text-[#252525]">{restaurant.address}</p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fda913]/10 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-[#fda913]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#6e6e6e] mb-1.5">Radno vrijeme</p>
              {restaurant.workingHours.map((wh, i) => (
                <div key={i} className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#6e6e6e]">{wh.label}</span>
                  <span className="text-sm font-medium text-[#252525]">{wh.times}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('review-restaurant')}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[#e3e3e3] text-sm font-semibold text-[#252525] active:bg-[#f3f3f3] transition-colors"
          >
            <MessageSquare size={16} className="text-[#49b867]" />
            Ostavi recenziju
          </button>
          <button
            onClick={() => navigate('daily-menu')}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#49b867] text-sm font-semibold text-[#ffffff] active:scale-[0.98] transition-transform shadow-lg shadow-[#49b867]/25"
          >
            <UtensilsCrossed size={16} />
            Dnevni meni
          </button>
        </div>
      </div>
    </div>
  )
}
