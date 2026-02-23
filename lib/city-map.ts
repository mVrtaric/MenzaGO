export type CityMapPoint = { xPct: number; yPct: number }

// Simple, hand-tuned marker positions for a "map-like" view.
// Values are percentages within the heatmap container.
export const cityMapPositions: Record<string, Record<string, CityMapPoint>> = {
  Zagreb: {
    '1': { xPct: 28, yPct: 45 }, // Savska
    '2': { xPct: 72, yPct: 40 }, // Borongaj
    '3': { xPct: 44, yPct: 58 }, // TTF
    '4': { xPct: 55, yPct: 70 }, // Radic
    '5': { xPct: 32, yPct: 68 }, // SC
  },
}

export function getPositionForRestaurant(params: {
  city: string
  restaurantId: string
  index: number
  total: number
}): CityMapPoint {
  const byCity = cityMapPositions[params.city]
  const existing = byCity?.[params.restaurantId]
  if (existing) return existing

  // Fallback: place restaurants in a simple grid-ish distribution.
  const cols = Math.max(2, Math.ceil(Math.sqrt(params.total)))
  const row = Math.floor(params.index / cols)
  const col = params.index % cols

  const xPct = 18 + (col / Math.max(1, cols - 1)) * 64
  const rows = Math.ceil(params.total / cols)
  const yPct = 20 + (row / Math.max(1, rows - 1)) * 60

  return { xPct, yPct }
}
