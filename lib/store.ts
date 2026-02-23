import { create } from 'zustand'
import type { CrowdLevel, CrowdReport } from '@/lib/crowd'
import { getReportsInWindow, getUserTrustWeight, crowdLevelToScore, computeWeightedCrowdScore } from '@/lib/crowd'

export type Screen =
  | 'welcome'
  | 'login'
  | 'register'
  | 'home'
  | 'restaurants'
  | 'restaurant-detail'
  | 'daily-menu'
  | 'meal-detail'
  | 'review-restaurant'
  | 'review-meal'
  | 'favorites'
  | 'allergens'
  | 'reviews'
  | 'crowd'
  | 'profile'
  | 'premium'
  | 'dashboard'

interface AppState {
  currentScreen: Screen
  previousScreen: Screen | null
  screenHistory: Screen[]
  selectedRestaurantId: string | null
  selectedMealId: string | null
  selectedCity: string
  favoriteRestaurants: string[]
  favoriteMeals: string[]
  sidebarOpen: boolean
  isLoggedIn: boolean
  userName: string

  // Gamification
  points: number
  earnedBadges: string[]
  crowdReports: number
  reviewsCount: number

  // Premium
  isPremium: boolean

  // Dietary
  isVegetarianFilter: boolean
  excludedAllergens: number[]
  budgetMax: number | null

  // Budget tracking
  monthlySpent: number

  // Crowd trust layer
  crowdReportsByRestaurant: Record<string, CrowdReport[]>
  crowdAnomalyUntilByRestaurant: Record<string, number | undefined>
  verifiedCrowdByRestaurant: Record<string, boolean>

  // Recommendation learning
  improveRecommendations: boolean
  totalMealInteractions: number
  vegetarianMealInteractions: number
  mealInteractionCounts: Record<string, number>
  restaurantInteractionCounts: Record<string, number>

  // Actions
  navigate: (screen: Screen) => void
  goBack: () => void
  selectRestaurant: (id: string) => void
  selectMeal: (id: string) => void
  setCity: (city: string) => void
  toggleFavoriteRestaurant: (id: string) => void
  toggleFavoriteMeal: (id: string) => void
  setSidebarOpen: (open: boolean) => void
  login: (name: string) => void
  logout: () => void
  addPoints: (amount: number) => void
  reportCrowd: (restaurantId: string, level: CrowdLevel) => void
  submitReview: () => void
  togglePremium: () => void
  setVegetarianFilter: (v: boolean) => void
  toggleAllergenExclusion: (id: number) => void
  setBudgetMax: (max: number | null) => void
  addSpending: (amount: number) => void
  earnBadge: (id: string) => void
  setImproveRecommendations: (enabled: boolean) => void
  trackMealInteraction: (input: { mealId: string; restaurantId: string; isVegetarian: boolean }) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: 'welcome',
  previousScreen: null,
  screenHistory: [],
  selectedRestaurantId: null,
  selectedMealId: null,
  selectedCity: 'Zagreb',
  favoriteRestaurants: ['1', '3'],
  favoriteMeals: ['m3', 'm4'],
  sidebarOpen: false,
  isLoggedIn: false,
  userName: '',

  // Gamification
  points: 135,
  earnedBadges: ['b1', 'b2'],
  crowdReports: 8,
  reviewsCount: 4,

  // Premium
  isPremium: false,

  // Dietary
  isVegetarianFilter: false,
  excludedAllergens: [],
  budgetMax: null,

  // Budget
  monthlySpent: 42.60,

  // Crowd trust layer
  crowdReportsByRestaurant: {},
  crowdAnomalyUntilByRestaurant: {},
  verifiedCrowdByRestaurant: {},

  // Recommendation learning
  improveRecommendations: true,
  totalMealInteractions: 0,
  vegetarianMealInteractions: 0,
  mealInteractionCounts: {},
  restaurantInteractionCounts: {},

  navigate: (screen) =>
    set((state) => ({
      currentScreen: screen,
      previousScreen: state.currentScreen,
      screenHistory: [...state.screenHistory, state.currentScreen],
    })),

  goBack: () =>
    set((state) => {
      const history = [...state.screenHistory]
      const prev = history.pop() || 'home'
      return {
        currentScreen: prev,
        previousScreen: null,
        screenHistory: history,
      }
    }),

  selectRestaurant: (id) => set({ selectedRestaurantId: id }),

  selectMeal: (id) => set({ selectedMealId: id }),

  setCity: (city) => set({ selectedCity: city }),

  toggleFavoriteRestaurant: (id) =>
    set((state) => ({
      favoriteRestaurants: state.favoriteRestaurants.includes(id)
        ? state.favoriteRestaurants.filter((r) => r !== id)
        : [...state.favoriteRestaurants, id],
    })),

  toggleFavoriteMeal: (id) =>
    set((state) => ({
      favoriteMeals: state.favoriteMeals.includes(id)
        ? state.favoriteMeals.filter((m) => m !== id)
        : [...state.favoriteMeals, id],
    })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  login: (name) => set({ isLoggedIn: true, userName: name, currentScreen: 'home', screenHistory: [] }),

  logout: () => set({ isLoggedIn: false, userName: '', currentScreen: 'welcome', screenHistory: [] }),

  addPoints: (amount) => set((state) => ({ points: state.points + amount })),

  reportCrowd: (restaurantId, level) =>
    set((state) => {
      const now = Date.now()
      const trustWeight = getUserTrustWeight({
        points: state.points,
        crowdReports: state.crowdReports,
        reviewsCount: state.reviewsCount,
        isPremium: state.isPremium,
      })

      const prevReports = state.crowdReportsByRestaurant[restaurantId] ?? []
      // Keep the list small by pruning very old items.
      const pruned = prevReports.filter((r) => r.at >= now - 48 * 60 * 60 * 1000)

      const prevScore = pruned.length
        ? computeWeightedCrowdScore({ reports: pruned, fallbackLevel: level, now }).score
        : crowdLevelToScore(level)

      const nextReports: CrowdReport[] = [...pruned, { at: now, level, weight: trustWeight }]

      const window5m = getReportsInWindow(nextReports, now, 5 * 60 * 1000)
      const window24h = getReportsInWindow(nextReports, now, 24 * 60 * 60 * 1000)

      const nextScore = computeWeightedCrowdScore({ reports: nextReports, fallbackLevel: level, now }).score

      const baselinePer5m = window24h.length / 288 // 24h / 5min
      const spikeByVolume = window5m.length >= Math.max(4, Math.ceil(baselinePer5m * 6))
      const spikeByChange = window5m.length >= 3 && Math.abs(nextScore - prevScore) >= 25

      const anomalyUntil =
        spikeByVolume || spikeByChange
          ? now + 15 * 60 * 1000
          : state.crowdAnomalyUntilByRestaurant[restaurantId]

      return {
        crowdReports: state.crowdReports + 1,
        points: state.points + 5,
        crowdReportsByRestaurant: {
          ...state.crowdReportsByRestaurant,
          [restaurantId]: nextReports,
        },
        crowdAnomalyUntilByRestaurant: {
          ...state.crowdAnomalyUntilByRestaurant,
          [restaurantId]: anomalyUntil,
        },
      }
    }),

  submitReview: () =>
    set((state) => ({
      reviewsCount: state.reviewsCount + 1,
      points: state.points + 10,
    })),

  togglePremium: () => set((state) => ({ isPremium: !state.isPremium })),

  setVegetarianFilter: (v) => set({ isVegetarianFilter: v }),

  toggleAllergenExclusion: (id) =>
    set((state) => ({
      excludedAllergens: state.excludedAllergens.includes(id)
        ? state.excludedAllergens.filter((a) => a !== id)
        : [...state.excludedAllergens, id],
    })),

  setBudgetMax: (max) => set({ budgetMax: max }),

  addSpending: (amount) => set((state) => ({ monthlySpent: state.monthlySpent + amount })),

  earnBadge: (id) =>
    set((state) => ({
      earnedBadges: state.earnedBadges.includes(id) ? state.earnedBadges : [...state.earnedBadges, id],
    })),

  setImproveRecommendations: (enabled) => set({ improveRecommendations: enabled }),

  trackMealInteraction: ({ mealId, restaurantId, isVegetarian }) =>
    set((state) => ({
      totalMealInteractions: state.totalMealInteractions + 1,
      vegetarianMealInteractions: state.vegetarianMealInteractions + (isVegetarian ? 1 : 0),
      mealInteractionCounts: {
        ...state.mealInteractionCounts,
        [mealId]: (state.mealInteractionCounts[mealId] ?? 0) + 1,
      },
      restaurantInteractionCounts: {
        ...state.restaurantInteractionCounts,
        [restaurantId]: (state.restaurantInteractionCounts[restaurantId] ?? 0) + 1,
      },
    })),
}))