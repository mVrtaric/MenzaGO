'use client'

import { useAppStore } from '@/lib/store'
import { MobileShell } from './mobile-shell'
import { Sidebar } from './sidebar'
import { WelcomeScreen } from './screens/welcome-screen'
import { LoginScreen } from './screens/login-screen'
import { RegisterScreen } from './screens/register-screen'
import { OnboardingScreen } from './screens/onboarding-screen'
import { HomeScreen } from './screens/home-screen'
import { RestaurantsScreen } from './screens/restaurants-screen'
import { RestaurantDetailScreen } from './screens/restaurant-detail-screen'
import { DailyMenuScreen } from './screens/daily-menu-screen'
import { MealDetailScreen } from './screens/meal-detail-screen'
import { ReviewFormScreen } from './screens/review-screen'
import { ReviewsListScreen } from './screens/reviews-list-screen'
import { FavoritesScreen } from './screens/favorites-screen'
import { AllergensScreen } from './screens/allergens-screen'
import { CrowdScreen } from './screens/crowd-screen'
import { ProfileScreen } from './screens/profile-screen'
import { PremiumScreen } from './screens/premium-screen'
import { DashboardScreen } from './screens/dashboard-screen'

export function MenzaApp() {
  const currentScreen = useAppStore((s) => s.currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />
      case 'login':
        return <LoginScreen />
      case 'register':
        return <RegisterScreen />
      case 'onboarding':
        return <OnboardingScreen />
      case 'home':
        return <HomeScreen />
      case 'restaurants':
        return <RestaurantsScreen />
      case 'restaurant-detail':
        return <RestaurantDetailScreen />
      case 'daily-menu':
        return <DailyMenuScreen />
      case 'meal-detail':
        return <MealDetailScreen />
      case 'review-restaurant':
        return <ReviewFormScreen type="restaurant" />
      case 'review-meal':
        return <ReviewFormScreen type="meal" />
      case 'reviews':
        return <ReviewsListScreen />
      case 'favorites':
        return <FavoritesScreen />
      case 'allergens':
        return <AllergensScreen />
      case 'crowd':
        return <CrowdScreen />
      case 'profile':
        return <ProfileScreen />
      case 'premium':
        return <PremiumScreen />
      case 'dashboard':
        return <DashboardScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return (
    <MobileShell>
      <div className="relative h-full flex flex-col overflow-hidden">
        {renderScreen()}
        <Sidebar />
      </div>
    </MobileShell>
  )
}