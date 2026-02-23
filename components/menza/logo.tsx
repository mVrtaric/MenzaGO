'use client'

import { UtensilsCrossed } from 'lucide-react'

export function Logo({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
  }

  return (
    <div className="flex items-center gap-1.5">
      <UtensilsCrossed
        size={iconSizes[size]}
        className="text-[#49b867]"
        strokeWidth={2.5}
      />
      <span className={`font-bold tracking-tight ${sizeClasses[size]}`}>
        <span className="text-[#252525]">Menza</span>
        <span className="text-[#49b867]">GO</span>
      </span>
    </div>
  )
}
