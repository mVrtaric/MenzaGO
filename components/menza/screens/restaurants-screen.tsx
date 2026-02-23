'use client'

import { useAppStore } from '@/lib/store'
import { restaurants } from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import {
  Menu,
  MapPin,
  Clock,
  Heart,
  ChevronDown,
  Search,
} from 'lucide-react'
import { useState } from 'react'

export function CrowdBadge({ level, size = 'default' }: { level: 'low' | 'medium' | 'high', size?: 'default' | 'lg' }) {
  const config = {
    low: { label: 'Slobodno', bg: 'bg-[#49b867]', text: 'text-[#ffffff]', dot: 'bg-[#ffffff]', animateDot: true },
    medium: { label: 'Umjereno', bg: 'bg-[#f68620]', text: 'text-[#ffffff]', dot: 'bg-[#ffffff]', animateDot: false },
    high: { label: 'Guzva', bg: 'bg-[#ef2723]', text: 'text-[#ffffff]', dot: 'bg-[#ffffff]', animateDot: false },
  }
  const c = config[level]
  const sizeClasses = size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-full font-semibold ${c.bg} ${c.text} shadow-sm`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} ${c.animateDot ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  )
}

// Restaurant listing with city filter and favorites
export function RestaurantsScreen() {
  const { navigate, selectRestaurant, selectedCity, setCity, setSidebarOpen, favoriteRestaurants, toggleFavoriteRestaurant } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCityPicker, setShowCityPicker] = useState(false)

  const cities = ['Zagreb', 'Split', 'Rijeka', 'Osijek']

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.city === selectedCity &&
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-background px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
            aria-label="Izbornik"
          >
            <Menu size={22} className="text-[#252525]" />
          </button>
          <h1 className="text-lg font-bold text-[#252525] tracking-tight">RESTORANI</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#afafaf]" />
          <input
            type="text"
            placeholder="Pretrazi restorane..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f3f3f3] text-[#252525] text-sm placeholder:text-[#afafaf] focus:outline-none focus:ring-2 focus:ring-[#49b867]/40 transition-shadow"
          />
        </div>

        {/* City Picker */}
        <div className="relative">
          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#f3f3f3] text-sm text-[#252525] font-medium"
          >
            <MapPin size={14} className="text-[#49b867]" />
            {selectedCity}
            <ChevronDown size={14} className="text-[#6e6e6e]" />
          </button>
          {showCityPicker && (
            <div className="absolute top-full left-0 mt-1 bg-background rounded-xl shadow-lg border border-[#e3e3e3] z-10 overflow-hidden">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setCity(city)
                    setShowCityPicker(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#f3f3f3] transition-colors ${
                    city === selectedCity ? 'text-[#49b867] font-semibold bg-[#49b867]/5' : 'text-[#252525]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-6">
        <div className="flex flex-col gap-3">
          {filteredRestaurants.map((restaurant, index) => (
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
              className="bg-background rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform text-left fade-in cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Restaurant Image */}
              <div className="relative h-32 bg-[#e3e3e3]">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavoriteRestaurant(restaurant.id)
                    }}
                    className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                    aria-label={favoriteRestaurants.includes(restaurant.id) ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
                  >
                    <Heart
                      size={16}
                      className={favoriteRestaurants.includes(restaurant.id) ? 'fill-[#ef2723] text-[#ef2723]' : 'text-[#6e6e6e]'}
                    />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#252525] text-sm line-clamp-1 flex-1">
                    {restaurant.name}
                  </h3>
                  <CrowdBadge level={restaurant.crowdLevel} />
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={12} className="text-[#afafaf] flex-shrink-0" />
                  <span className="text-xs text-[#6e6e6e] line-clamp-1">{restaurant.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={restaurant.rating} size={12} />
                    <span className="text-xs font-medium text-[#252525]">{restaurant.rating}</span>
                    <span className="text-xs text-[#afafaf]">({restaurant.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6e6e6e]">
                    <Clock size={12} />
                    <span className="text-xs">{restaurant.workingHours[0].times}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
