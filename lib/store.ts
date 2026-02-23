import { create } from 'zustand'

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
  reportCrowd: () => void
  submitReview: () => void
  togglePremium: () => void
  setVegetarianFilter: (v: boolean) => void
  toggleAllergenExclusion: (id: number) => void
  setBudgetMax: (max: number | null) => void
  addSpending: (amount: number) => void
  earnBadge: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
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

  selectRestaurant: (id) =>
    set({ selectedRestaurantId: id }),

  selectMeal: (id) =>
    set({ selectedMealId: id }),

  setCity: (city) =>
    set({ selectedCity: city }),

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

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  login: (name) =>
    set({ isLoggedIn: true, userName: name, currentScreen: 'home', screenHistory: [] }),

  logout: () =>
    set({ isLoggedIn: false, userName: '', currentScreen: 'welcome', screenHistory: [] }),

  addPoints: (amount) =>
    set((state) => ({ points: state.points + amount })),

  reportCrowd: () =>
    set((state) => ({
      crowdReports: state.crowdReports + 1,
      points: state.points + 5,
    })),

  submitReview: () =>
    set((state) => ({
      reviewsCount: state.reviewsCount + 1,
      points: state.points + 10,
    })),

  togglePremium: () =>
    set((state) => ({ isPremium: !state.isPremium })),

  setVegetarianFilter: (v) =>
    set({ isVegetarianFilter: v }),

  toggleAllergenExclusion: (id) =>
    set((state) => ({
      excludedAllergens: state.excludedAllergens.includes(id)
        ? state.excludedAllergens.filter((a) => a !== id)
        : [...state.excludedAllergens, id],
    })),

  setBudgetMax: (max) =>
    set({ budgetMax: max }),

  addSpending: (amount) =>
    set((state) => ({ monthlySpent: state.monthlySpent + amount })),

  earnBadge: (id) =>
    set((state) => ({
      earnedBadges: state.earnedBadges.includes(id)
        ? state.earnedBadges
        : [...state.earnedBadges, id],
    })),
}))
