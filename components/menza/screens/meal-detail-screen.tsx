'use client'

import { useAppStore } from '@/lib/store'
import { meals, allergensList } from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import {
  ArrowLeft,
  Heart,
  Star,
  Leaf,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'

export function MealDetailScreen() {
  const {
    selectedMealId,
    goBack,
    navigate,
    favoriteMeals,
    toggleFavoriteMeal,
  } = useAppStore()

  const meal = meals.find((m) => m.id === selectedMealId)
  if (!meal) return null

  const isFav = favoriteMeals.includes(meal.id)
  const mealAllergens = allergensList.filter((a) => meal.allergens.includes(a.id))

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Hero Image */}
      <div className="relative h-64 bg-[#e3e3e3] flex-shrink-0">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/50 to-transparent" />

        {/* Nav */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
            aria-label="Natrag"
          >
            <ArrowLeft size={20} className="text-[#252525]" />
          </button>
          <button
            onClick={() => toggleFavoriteMeal(meal.id)}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
            aria-label={isFav ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
          >
            <Heart
              size={20}
              className={isFav ? 'fill-[#ef2723] text-[#ef2723]' : 'text-[#252525]'}
            />
          </button>
        </div>

        {/* Vege badge */}
        {meal.isVegetarian && (
          <div className="absolute bottom-4 left-5">
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#49b867] text-[#ffffff] text-xs font-semibold shadow-lg">
              <Leaf size={12} />
              Vegetarijansko
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 py-5">
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-xl font-bold text-[#252525] text-balance">{meal.name}</h1>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-[#49b867]">{meal.price.toFixed(2)} &euro;</p>
              <p className="text-xs text-[#afafaf]">({meal.fullPrice.toFixed(2)} &euro; puna cijena)</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="fill-[#fda913] text-[#fda913]" />
            <span className="text-sm font-bold text-[#252525]">{meal.rating}</span>
            <StarRating rating={meal.rating} size={12} />
            <span className="text-xs text-[#6e6e6e]">({meal.reviewCount})</span>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-[#6e6e6e] uppercase tracking-wider mb-2">Opis</h3>
            <p className="text-sm text-[#252525] leading-relaxed">{meal.description}</p>
          </div>

          {/* Allergens */}
          <div className="mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={12} className="text-[#f57f29]" />
              <h3 className="text-xs font-semibold text-[#6e6e6e] uppercase tracking-wider">Alergeni</h3>
            </div>
            <div className="flex flex-col gap-1.5">
              {mealAllergens.map((allergen) => (
                <div key={allergen.id} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f57f29]/10 text-[#f57f29] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {allergen.id}
                  </span>
                  <span className="text-xs text-[#252525]">{allergen.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6e6e6e] uppercase tracking-wider mb-3">Nutritivne vrijednosti</h3>
            <div className="flex gap-3">
              {[
                { label: 'Ugljikohidrati', value: meal.nutrition.carbs, color: 'bg-[#49b867]' },
                { label: 'Masti', value: meal.nutrition.fats, color: 'bg-[#fda913]' },
                { label: 'Proteini', value: meal.nutrition.protein, color: 'bg-[#2b7a83]' },
              ].map((n) => (
                <div key={n.label} className="flex-1 p-3 rounded-xl bg-[#f3f3f3] text-center">
                  <div className={`w-2 h-2 rounded-full ${n.color} mx-auto mb-2`} />
                  <p className="text-sm font-bold text-[#252525]">{n.value}</p>
                  <p className="text-[10px] text-[#6e6e6e] mt-0.5">{n.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-4">
            <button
              onClick={() => navigate('reviews')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[#e3e3e3] text-sm font-semibold text-[#252525] active:bg-[#f3f3f3] transition-colors"
            >
              <MessageSquare size={15} className="text-[#49b867]" />
              Recenzije
            </button>
            <button
              onClick={() => navigate('review-meal')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#49b867] text-sm font-semibold text-[#ffffff] active:scale-[0.98] transition-transform shadow-lg shadow-[#49b867]/25"
            >
              <Star size={15} />
              Ocijeni
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
