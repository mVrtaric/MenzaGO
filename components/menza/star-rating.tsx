'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-0.5" role={interactive ? undefined : 'img'} aria-label={interactive ? undefined : `${rating} od ${maxStars} zvjezdica`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1
        const filled = interactive
          ? starIndex <= (hovered || rating)
          : starIndex <= Math.round(rating)

        if (!interactive) {
          return (
            <span key={i} className="cursor-default" aria-hidden="true">
              <Star
                size={size}
                className={filled ? 'text-[#fda913] fill-[#fda913]' : 'text-[#e3e3e3]'}
              />
            </span>
          )
        }

        return (
          <button
            key={i}
            type="button"
            className="cursor-pointer hover:scale-110 transition-transform"
            onMouseEnter={() => setHovered(starIndex)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onRate?.(starIndex)}
            aria-label={`${starIndex} od ${maxStars} zvjezdica`}
          >
            <Star
              size={size}
              className={filled ? 'text-[#fda913] fill-[#fda913]' : 'text-[#e3e3e3]'}
            />
          </button>
        )
      })}
    </div>
  )
}
