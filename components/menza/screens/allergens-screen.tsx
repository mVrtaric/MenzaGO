'use client'

import { useAppStore } from '@/lib/store'
import { allergensList } from '@/lib/data'
import { ArrowLeft, AlertTriangle, Check } from 'lucide-react'

export function AllergensScreen() {
  const { goBack, excludedAllergens, toggleAllergenExclusion } = useAppStore()

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center px-4 pt-4 pb-3 gap-3 border-b border-[#e3e3e3]">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
          aria-label="Natrag"
        >
          <ArrowLeft size={22} className="text-[#252525]" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#252525]">ALERGENI</h1>
          <p className="text-[10px] text-[#6e6e6e]">Odaberi alergene koje želiš isključiti</p>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f57f29]/5 border border-[#f57f29]/20">
          <AlertTriangle size={18} className="text-[#f57f29] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#6e6e6e] leading-relaxed">
            Tvari koje sadrze gluten i proizvodi od njih (EU Direktiva). Provjerite alergene za svako jelo prije narudzbe.
          </p>
        </div>
      </div>

      {/* Allergens List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-8">
        <div className="flex flex-col gap-2">
          {allergensList.map((allergen, index) => {
            const checked = excludedAllergens.includes(allergen.id)
            return (
              <button
                key={allergen.id}
                onClick={() => toggleAllergenExclusion(allergen.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors fade-in ${
                  checked ? 'border-[#49b867]/30 bg-[#49b867]/5' : 'border-[#e3e3e3]'
                }`}
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  checked ? 'bg-[#49b867] text-[#ffffff]' : 'bg-[#f3f3f3] text-[#afafaf]'
                }`}>
                  <Check size={16} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#252525]">{allergen.id}. {allergen.name}</p>
                  {checked && <p className="text-[10px] text-[#6e6e6e] mt-0.5">Isključen</p>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}