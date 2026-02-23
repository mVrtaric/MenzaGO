export type LatLng = { lat: number; lng: number }

// Real-world coordinates used for Google Maps view.
// Note: some points may be approximate (e.g. large campuses). Adjust as needed.
export const restaurantLocations: Record<string, Record<string, LatLng>> = {
  Zagreb: {
    // Restoran Savska / SC (same address in mock data)
    '1': { lat: 45.80388, lng: 15.96577 },
    '5': { lat: 45.80388, lng: 15.96577 },

    // Borongaj campus
    '2': { lat: 45.81244, lng: 16.04225 },

    // TTF - Prilaz baruna Filipovića 28
    '3': { lat: 45.812104, lng: 15.9373071 },

    // SD Stjepan Radić (campus) - approx
    '4': { lat: 45.785197, lng: 15.947625 },
  },
}

export function getRestaurantLatLng(city: string, restaurantId: string): LatLng | null {
  return restaurantLocations[city]?.[restaurantId] ?? null
}
