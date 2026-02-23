'use client'

import { useAppStore } from '@/lib/store'
import { restaurants, meals } from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

interface ReviewFormProps {
  type: 'restaurant' | 'meal'
}

export function ReviewFormScreen({ type }: ReviewFormProps) {
  const { selectedRestaurantId, selectedMealId, goBack } = useAppStore()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const item =
    type === 'restaurant'
      ? restaurants.find((r) => r.id === selectedRestaurantId)
      : meals.find((m) => m.id === selectedMealId)

  if (!item) return null

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true)
      setTimeout(() => {
        goBack()
      }, 1500)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-[#49b867]/10 flex items-center justify-center mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#49b867" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#252525] mb-2">Hvala!</h2>
        <p className="text-sm text-[#6e6e6e] text-center">Vasa recenzija je uspjesno poslana.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center px-4 pt-4 pb-3 gap-3">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
          aria-label="Natrag"
        >
          <ArrowLeft size={22} className="text-[#252525]" />
        </button>
        <h1 className="text-lg font-bold text-[#252525]">OSTAVI RECENZIJU</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-4">
        <h2 className="text-base font-semibold text-[#252525] mb-2 text-center text-balance">
          {item.name}
        </h2>
        <p className="text-sm text-[#6e6e6e] text-center mb-8">
          {type === 'restaurant'
            ? 'Voljeli bismo znati sto mislite o restoranu'
            : 'Voljeli bismo znati sto mislite o ovom jelu'}
        </p>

        {/* Stars */}
        <div className="flex justify-center mb-8">
          <StarRating rating={rating} size={36} interactive onRate={setRating} />
        </div>

        {/* Comment */}
        <textarea
          placeholder="Ostavite komentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-32 px-4 py-3 rounded-xl bg-[#f3f3f3] text-[#252525] text-sm placeholder:text-[#afafaf] resize-none focus:outline-none focus:ring-2 focus:ring-[#49b867]/50 transition-shadow"
        />
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 flex gap-3">
        <button
          onClick={goBack}
          className="flex-1 py-3.5 rounded-2xl border-2 border-[#e3e3e3] text-sm font-semibold text-[#252525] active:bg-[#f3f3f3] transition-colors"
        >
          Odustani
        </button>
        <button
          onClick={handleSubmit}
          className={`flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
            rating > 0
              ? 'bg-[#49b867] text-[#ffffff] shadow-lg shadow-[#49b867]/25 active:scale-[0.98]'
              : 'bg-[#e3e3e3] text-[#afafaf]'
          }`}
          disabled={rating === 0}
        >
          Posalji
        </button>
      </div>
    </div>
  )
}
