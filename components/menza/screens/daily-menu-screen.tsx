'use client'

import { useAppStore } from '@/lib/store'
import { meals, allergensList } from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import {
  ArrowLeft,
  Heart,
  Leaf,
  AlertTriangle,
} from 'lucide-react'
import { useState } from 'react'

export function DailyMenuScreen() {
  const {
    selectedRestaurantId,
    goBack,
    navigate,
    selectMeal,
    favoriteMeals,
    toggleFavoriteMeal,
  } = useAppStore()
  const [activeTab, setActiveTab] = useState<'lunch' | 'dinner'>('lunch')
  const [showAllergens, setShowAllergens] = useState(false)

  const menuMeals = meals.filter(
    (m) => m.restaurantId === selectedRestaurantId && m.category === activeTab
  )

  if (showAllergens) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center px-4 pt-4 pb-3 gap-3">
          <button
            onClick={() => setShowAllergens(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
            aria-label="Natrag"
          >
            <ArrowLeft size={22} className="text-[#252525]" />
          </button>
          <h1 className="text-lg font-bold text-[#252525]">ALERGENI</h1>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">
          <div className="flex flex-col gap-3">
            {allergensList.map((allergen) => (
              <div key={allergen.id} className="flex items-start gap-3 py-2">
                <span className="w-7 h-7 rounded-full bg-[#49b867]/10 text-[#49b867] text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {allergen.id}
                </span>
                <p className="text-sm text-[#252525] leading-relaxed pt-0.5">
                  {allergen.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
            aria-label="Natrag"
          >
            <ArrowLeft size={22} className="text-[#252525]" />
          </button>
          <h1 className="text-lg font-bold text-[#252525]">DNEVNI MENI</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveTab('lunch')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'lunch'
                ? 'bg-[#49b867] text-[#ffffff] shadow-md shadow-[#49b867]/25'
                : 'bg-[#f3f3f3] text-[#6e6e6e]'
            }`}
          >
            Rucak
          </button>
          <button
            onClick={() => setActiveTab('dinner')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dinner'
                ? 'bg-[#49b867] text-[#ffffff] shadow-md shadow-[#49b867]/25'
                : 'bg-[#f3f3f3] text-[#6e6e6e]'
            }`}
          >
            Vecera
          </button>
        </div>

        {/* Allergen Link */}
        <button
          onClick={() => setShowAllergens(true)}
          className="flex items-center gap-1.5 text-xs text-[#f57f29] font-medium"
        >
          <AlertTriangle size={12} />
          Popis alergena
        </button>
      </div>

      {/* Meal List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">
        {menuMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#6e6e6e] text-sm">Nema dostupnih jela za odabrani obrok.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {menuMeals.map((meal, index) => (
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
                className="bg-background rounded-2xl border border-[#e3e3e3] overflow-hidden active:scale-[0.98] transition-transform text-left fade-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-[#252525] text-sm">{meal.name}</h3>
                        {meal.isVegetarian && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#49b867]/10 text-[#076639]">
                            <Leaf size={10} />
                            <span className="text-[10px] font-medium">Vege</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-xs text-[#6e6e6e]">Alergeni:</span>
                        <span className="text-xs font-medium text-[#f57f29]">
                          {meal.allergens.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={meal.rating} size={11} />
                        <span className="text-xs text-[#6e6e6e]">({meal.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-[#49b867]">{meal.price.toFixed(2)} &euro;</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavoriteMeal(meal.id)
                        }}
                        className="w-8 h-8 rounded-full bg-[#f3f3f3] flex items-center justify-center"
                        aria-label={favoriteMeals.includes(meal.id) ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
                      >
                        <Heart
                          size={14}
                          className={
                            favoriteMeals.includes(meal.id)
                              ? 'fill-[#ef2723] text-[#ef2723]'
                              : 'text-[#afafaf]'
                          }
                        />
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
