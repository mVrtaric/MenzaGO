'use client'

import { useAppStore } from '@/lib/store'
import { meals, reviews } from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import { ArrowLeft, Star } from 'lucide-react'
import { useState } from 'react'

export function ReviewsListScreen() {
  const { selectedMealId, goBack, navigate } = useAppStore()
  const [activeTab, setActiveTab] = useState<'popular' | 'newest' | 'mine'>('popular')

  const meal = meals.find((m) => m.id === selectedMealId)
  if (!meal) return null

  const tabs = [
    { key: 'popular' as const, label: 'Popularno' },
    { key: 'newest' as const, label: 'Najnovije' },
    { key: 'mine' as const, label: 'Moje recenzije' },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Hero */}
      <div className="relative h-48 bg-[#e3e3e3] flex-shrink-0">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 to-transparent" />

        <div className="absolute top-4 left-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
            aria-label="Natrag"
          >
            <ArrowLeft size={20} className="text-[#252525]" />
          </button>
        </div>

        <div className="absolute bottom-4 left-5 right-5">
          <span className="inline-block px-3 py-1 rounded-full bg-[#49b867] text-[#ffffff] text-xs font-semibold mb-2">
            RECENZIJE
          </span>
        </div>
      </div>

      {/* Meal info */}
      <div className="px-5 py-4 border-b border-[#e3e3e3]">
        <h1 className="text-lg font-bold text-[#252525] mb-1">{meal.name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#252525]">{meal.rating}</span>
          <StarRating rating={meal.rating} size={14} />
          <span className="text-xs text-[#6e6e6e]">({meal.reviewCount} recenzija)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-3 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-[#49b867]/10 text-[#49b867]'
                : 'text-[#6e6e6e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-3">
        <div className="flex flex-col gap-4">
          {activeTab === 'mine' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-[#6e6e6e] mb-3">Nemate jos recenzija za ovo jelo.</p>
              <button
                onClick={() => navigate('review-meal')}
                className="px-5 py-2.5 rounded-xl bg-[#49b867] text-[#ffffff] text-sm font-semibold active:scale-[0.98] transition-transform"
              >
                Ostavi recenziju
              </button>
            </div>
          ) : (
            reviews.map((review, index) => (
              <div
                key={review.id}
                className="pb-4 border-b border-[#f3f3f3] last:border-0 fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#49b867]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#49b867]">
                        {review.userName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#252525]">{review.userName}</span>
                  </div>
                  <span className="text-xs text-[#afafaf]">
                    {new Date(review.date).toLocaleDateString('hr-HR')}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating
                          ? 'fill-[#fda913] text-[#fda913]'
                          : 'text-[#e3e3e3]'
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-[#252525] leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-6 pt-2">
        <button
          onClick={() => navigate('review-meal')}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[#49b867] text-sm font-semibold text-[#49b867] active:bg-[#49b867]/5 transition-colors"
        >
          <Star size={15} />
          Ocijeni jelo
        </button>
      </div>
    </div>
  )
}
