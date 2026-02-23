'use client'

import { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import {
  meals,
  restaurants,
  getWeekStart,
  getWeekDates,
} from '@/lib/data'
import { StarRating } from '@/components/menza/star-rating'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Crown,
  Leaf,
  Plus,
  Utensils,
  Sun,
  Moon,
} from 'lucide-react'

const DAY_NAMES = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']

function formatDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('hr-HR', { day: 'numeric', month: 'short' })
}

export function MealPlannerScreen() {
  const {
    goBack,
    navigate,
    isPremium,
    selectedCity,
    weeklyMealPlan,
    setWeeklyMealSlot,
    selectMeal,
    selectRestaurant,
  } = useAppStore()

  const [weekOffset, setWeekOffset] = useState(0)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSlot, setPickerSlot] = useState<{ dateKey: string; slot: 'lunch' | 'dinner' } | null>(null)

  const today = useMemo(() => new Date(), [])
  const weekStart = useMemo(() => {
    const monday = getWeekStart(today)
    monday.setDate(monday.getDate() + weekOffset * 7)
    return monday
  }, [today, weekOffset])
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart])

  const cityRestaurantIds = useMemo(() => {
    return new Set(restaurants.filter((r) => r.city === selectedCity).map((r) => r.id))
  }, [selectedCity])
  const cityMeals = useMemo(
    () => meals.filter((m) => cityRestaurantIds.has(m.restaurantId)),
    [cityRestaurantIds]
  )

  const openPicker = (dateKey: string, slot: 'lunch' | 'dinner') => {
    if (!isPremium) return
    setPickerSlot({ dateKey, slot })
    setPickerOpen(true)
  }

  const selectMealForSlot = (mealId: string) => {
    if (!pickerSlot) return
    setWeeklyMealSlot(pickerSlot.dateKey, pickerSlot.slot, mealId)
    setPickerOpen(false)
    setPickerSlot(null)
  }

  const removeMealFromSlot = (dateKey: string, slot: 'lunch' | 'dinner', e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPremium) return
    setWeeklyMealSlot(dateKey, slot, null)
  }

  const pickerMeals = useMemo(() => {
    if (!pickerSlot) return []
    return cityMeals.filter((m) => m.category === pickerSlot.slot)
  }, [cityMeals, pickerSlot])

  const weekLabel = `${formatDateShort(weekDates[0])} - ${formatDateShort(weekDates[6])}`

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3]">
      {/* Header */}
      <div className="bg-[#49b867] px-5 pt-4 pb-5 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-[#ffffff]/10 transition-colors"
            aria-label="Natrag"
          >
            <ArrowLeft size={22} className="text-[#ffffff]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#ffffff] tracking-tight">PLANER OBROKA</h1>
            <p className="text-xs text-[#ffffff]/70">Planiraj obroke za cijeli tjedan</p>
          </div>
          {isPremium && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fda913] text-[#252525] text-[10px] font-bold">
              <Crown size={11} /> PRO
            </span>
          )}
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="w-10 h-10 rounded-xl bg-[#ffffff]/20 flex items-center justify-center active:bg-[#ffffff]/30 transition-colors"
            aria-label="Prethodni tjedan"
          >
            <ChevronLeft size={20} className="text-[#ffffff]" />
          </button>
          <span className="text-sm font-semibold text-[#ffffff] capitalize">{weekLabel}</span>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="w-10 h-10 rounded-xl bg-[#ffffff]/20 flex items-center justify-center active:bg-[#ffffff]/30 transition-colors"
            aria-label="Sljedeći tjedan"
          >
            <ChevronRight size={20} className="text-[#ffffff]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-5 pb-6">
        {!isPremium && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 bg-[#f3f3f3]/95"
            style={{ top: 200 }}
          >
            <div className="bg-background rounded-2xl p-6 text-center shadow-lg border border-[#e3e3e3] max-w-xs">
              <Crown size={40} className="text-[#fda913] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#252525] mb-2">Planer obroka je Premium</h3>
              <p className="text-sm text-[#6e6e6e] mb-4">
                Planiraj obroke za cijeli tjedan unaprijed i nikad više ne razmišljaj što jesti.
              </p>
              <button
                onClick={() => navigate('premium')}
                className="w-full py-3 rounded-xl bg-[#49b867] text-[#ffffff] font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                Otključaj s Premium
              </button>
            </div>
          </div>
        )}

        <div className={!isPremium ? 'opacity-30 pointer-events-none' : ''}>
          <div className="flex flex-col gap-4">
            {weekDates.map((date) => {
              const dateKey = formatDateKey(date)
              const dayPlan = weeklyMealPlan[dateKey] ?? {}
              const lunchMeal = dayPlan.lunch ? meals.find((m) => m.id === dayPlan.lunch) : null
              const dinnerMeal = dayPlan.dinner ? meals.find((m) => m.id === dayPlan.dinner) : null
              const dayName = DAY_NAMES[date.getDay() === 0 ? 6 : date.getDay() - 1]

              return (
                <div
                  key={dateKey}
                  className="bg-background rounded-2xl overflow-hidden border border-[#e3e3e3]"
                >
                  <div className="px-4 py-2.5 bg-[#f3f3f3] border-b border-[#e3e3e3]">
                    <span className="text-sm font-bold text-[#252525]">{dayName}</span>
                    <span className="text-xs text-[#6e6e6e] ml-2">{formatDateShort(date)}</span>
                  </div>

                  <div className="p-3 flex flex-col gap-2">
                    {/* Lunch slot */}
                    <button
                      onClick={() => openPicker(dateKey, 'lunch')}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9f9] border border-[#e3e3e3] text-left active:bg-[#f3f3f3] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#fda913]/15 flex items-center justify-center shrink-0">
                        <Sun size={18} className="text-[#fda913]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#6e6e6e] font-medium mb-0.5">Ručak</p>
                        {lunchMeal ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={lunchMeal.imageUrl}
                              alt={lunchMeal.name}
                              className="w-8 h-8 rounded-lg object-cover"
                              crossOrigin="anonymous"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#252525] truncate">{lunchMeal.name}</p>
                              <p className="text-[10px] text-[#6e6e6e]">
                                {restaurants.find((r) => r.id === lunchMeal.restaurantId)?.name} · {lunchMeal.price.toFixed(2)} €
                              </p>
                            </div>
                            <button
                              onClick={(e) => removeMealFromSlot(dateKey, 'lunch', e)}
                              className="text-[10px] text-[#ef2723] font-medium"
                            >
                              Ukloni
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#afafaf]">
                            <Plus size={14} />
                            <span className="text-xs">Dodaj jelo</span>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Dinner slot */}
                    <button
                      onClick={() => openPicker(dateKey, 'dinner')}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9f9] border border-[#e3e3e3] text-left active:bg-[#f3f3f3] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#2b7a83]/15 flex items-center justify-center shrink-0">
                        <Moon size={18} className="text-[#2b7a83]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#6e6e6e] font-medium mb-0.5">Večera</p>
                        {dinnerMeal ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={dinnerMeal.imageUrl}
                              alt={dinnerMeal.name}
                              className="w-8 h-8 rounded-lg object-cover"
                              crossOrigin="anonymous"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#252525] truncate">{dinnerMeal.name}</p>
                              <p className="text-[10px] text-[#6e6e6e]">
                                {restaurants.find((r) => r.id === dinnerMeal.restaurantId)?.name} · {dinnerMeal.price.toFixed(2)} €
                              </p>
                            </div>
                            <button
                              onClick={(e) => removeMealFromSlot(dateKey, 'dinner', e)}
                              className="text-[10px] text-[#ef2723] font-medium"
                            >
                              Ukloni
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#afafaf]">
                            <Plus size={14} />
                            <span className="text-xs">Dodaj jelo</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Meal picker sheet */}
      <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>
              Odaberi jelo za {pickerSlot?.slot === 'lunch' ? 'ručak' : 'večeru'}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto -mx-6 px-6 pb-6">
            {pickerMeals.length === 0 ? (
              <p className="text-sm text-[#6e6e6e] text-center py-8">
                Nema dostupnih jela za ovaj obrok.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {pickerMeals.map((meal) => {
                  const rest = restaurants.find((r) => r.id === meal.restaurantId)
                  return (
                    <button
                      key={meal.id}
                      onClick={() => selectMealForSlot(meal.id)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9f9] border border-[#e3e3e3] text-left active:bg-[#f3f3f3] transition-colors"
                    >
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        crossOrigin="anonymous"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#252525]">{meal.name}</p>
                        <p className="text-xs text-[#6e6e6e]">{rest?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={meal.rating} size={10} />
                          <span className="text-xs font-bold text-[#49b867]">{meal.price.toFixed(2)} €</span>
                          {meal.isVegetarian && (
                            <span className="flex items-center gap-0.5 text-[#49b867]">
                              <Leaf size={10} />
                              <span className="text-[10px]">Vege</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
