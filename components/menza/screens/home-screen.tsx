'use client'

import { useAppStore } from '@/lib/store'
import { restaurants, meals, friendActivities } from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import { CrowdBadge } from '@/components/menza/screens/restaurants-screen'
import {
  Menu,
  Flame,
  ChevronRight,
  Sparkles,
  MapPin,
  Users,
  Heart,
  Crown,
  TrendingUp,
  Utensils,
} from 'lucide-react'

export function HomeScreen() {
  const { navigate, userName, setSidebarOpen, selectRestaurant, selectMeal, favoriteRestaurants, isPremium, points } = useAppStore()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Dobro jutro'
    if (hour < 18) return 'Dobar dan'
    return 'Dobra vecer'
  }

  const today = new Date().toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long' })

  const trendingMeals = [...meals].sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0)).slice(0, 4)
  const recommendedMeals = meals.filter(m => m.rating >= 4.3).slice(0, 3)
  const favRestaurants = restaurants.filter(r => favoriteRestaurants.includes(r.id)).slice(0, 3)

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-[#49b867] px-5 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#ffffff]/10 transition-colors"
            aria-label="Izbornik"
          >
            <Menu size={22} className="text-[#ffffff]" />
          </button>
          <div className="flex items-center gap-2">
            {isPremium && <Crown size={18} className="text-[#fda913]" />}
            <button
              onClick={() => navigate('profile')}
              className="w-9 h-9 rounded-full bg-[#ffffff]/20 flex items-center justify-center text-[#ffffff] font-semibold text-sm"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        <div className="mb-1">
          <h1 className="text-[#ffffff] text-2xl font-bold">{greeting()}, {userName}!</h1>
          <p className="text-[#ffffff]/70 text-sm mt-1 capitalize">{today}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-4">
          {[
            { icon: Utensils, label: 'Restorani', screen: 'restaurants' as const },
            { icon: Heart, label: 'Favoriti', screen: 'favorites' as const },
            { icon: Users, label: 'Guzve', screen: 'crowd' as const },
            { icon: Crown, label: 'Premium', screen: 'premium' as const },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.screen)}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#ffffff]/15 active:bg-[#ffffff]/25 transition-colors"
            >
              <item.icon size={18} className="text-[#ffffff]" />
              <span className="text-[#ffffff] text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-5 pb-6">

        {/* AI Recommendations */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#49b867]" />
            <h2 className="text-sm font-bold text-[#252525]">Preporuceno za tebe</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
            {recommendedMeals.map((meal) => (
              <div
                key={meal.id}
                role="button"
                tabIndex={0}
                onClick={() => { selectMeal(meal.id); navigate('meal-detail') }}
                onKeyDown={(e) => { if (e.key === 'Enter') { selectMeal(meal.id); navigate('meal-detail') } }}
                className="min-w-[200px] bg-background rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="relative h-24">
                  <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#49b867] text-[#ffffff] text-[10px] font-semibold flex items-center gap-1">
                      <Sparkles size={9} />
                      Za tebe
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-[#252525] text-xs mb-1 line-clamp-1">{meal.name}</h3>
                  <div className="flex items-center justify-between">
                    <StarRating rating={meal.rating} size={10} />
                    <span className="text-sm font-bold text-[#49b867]">{meal.price.toFixed(2)} &euro;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Today */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-[#f68620]" />
              <h2 className="text-sm font-bold text-[#252525]">Trending danas</h2>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {trendingMeals.map((meal, idx) => {
              const rest = restaurants.find(r => r.id === meal.restaurantId)
              return (
                <div
                  key={meal.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => { selectMeal(meal.id); navigate('meal-detail') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { selectMeal(meal.id); navigate('meal-detail') } }}
                  className="flex items-center gap-3 p-3 bg-background rounded-xl active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f3f3f3] flex items-center justify-center flex-shrink-0">
                    <span className={`text-sm font-bold ${idx === 0 ? 'text-[#fda913]' : idx === 1 ? 'text-[#afafaf]' : 'text-[#c87533]'}`}>
                      {idx + 1}
                    </span>
                  </div>
                  <img src={meal.imageUrl} alt={meal.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" crossOrigin="anonymous" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#252525] text-xs line-clamp-1">{meal.name}</h3>
                    <p className="text-[10px] text-[#6e6e6e]">{rest?.name}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <TrendingUp size={12} className="text-[#49b867]" />
                    <span className="text-xs font-semibold text-[#49b867]">{meal.trendScore}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Favorite Restaurants with Crowd */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#252525]">Tvoji restorani</h2>
            <button onClick={() => navigate('restaurants')} className="flex items-center gap-0.5 text-xs text-[#49b867] font-medium">
              Svi <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {favRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                role="button"
                tabIndex={0}
                onClick={() => { selectRestaurant(restaurant.id); navigate('restaurant-detail') }}
                onKeyDown={(e) => { if (e.key === 'Enter') { selectRestaurant(restaurant.id); navigate('restaurant-detail') } }}
                className="flex items-center gap-3 p-3 bg-background rounded-xl active:scale-[0.98] transition-transform cursor-pointer"
              >
                <img src={restaurant.imageUrl} alt={restaurant.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" crossOrigin="anonymous" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#252525] text-xs line-clamp-1">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-[#afafaf]" />
                    <span className="text-[10px] text-[#6e6e6e] line-clamp-1">{restaurant.address}</span>
                  </div>
                </div>
                <CrowdBadge level={restaurant.crowdLevel} />
              </div>
            ))}
          </div>
        </section>

        {/* Friend Activity */}
        <section className="mb-4">
          <h2 className="text-sm font-bold text-[#252525] mb-3">Aktivnost prijatelja</h2>
          <div className="flex flex-col gap-2">
            {friendActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-background rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#49b867]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#49b867]">{activity.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#252525]">
                    <span className="font-semibold">{activity.name}</span>{' '}
                    {activity.action}{' '}
                    {activity.mealName && <span className="font-semibold">{activity.mealName}</span>}
                    {activity.mealName ? ' u ' : ''}
                    <span className="text-[#6e6e6e]">{activity.restaurantName}</span>
                  </p>
                  <span className="text-[10px] text-[#afafaf] mt-0.5">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
