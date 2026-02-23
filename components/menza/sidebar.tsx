'use client'

import { useAppStore } from '@/lib/store'
import { getLevelForPoints } from '@/lib/data'
import { Logo } from '@/components/menza/logo'
import {
  User,
  Heart,
  UtensilsCrossed,
  AlertTriangle,
  LogOut,
  X,
  Users,
  Crown,
  BarChart3,
  Home,
  Star,
  CalendarDays,
} from 'lucide-react'

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, navigate, isLoggedIn, userName, logout, isPremium, points } = useAppStore()

  if (!sidebarOpen) return null

  const level = getLevelForPoints(points)

  const menuItems = [
    {
      icon: Home,
      label: 'Pocetna',
      action: () => {
        setSidebarOpen(false)
        navigate('home')
      },
    },
    {
      icon: User,
      label: 'Profil',
      action: () => {
        setSidebarOpen(false)
        navigate('profile')
      },
    },
    {
      icon: UtensilsCrossed,
      label: 'Restorani',
      action: () => {
        setSidebarOpen(false)
        navigate('restaurants')
      },
    },
    {
      icon: Heart,
      label: 'Favoriti',
      action: () => {
        setSidebarOpen(false)
        navigate('favorites')
      },
    },
    {
      icon: Users,
      label: 'Guzve',
      action: () => {
        setSidebarOpen(false)
        navigate('crowd')
      },
    },
    {
      icon: AlertTriangle,
      label: 'Alergeni',
      action: () => {
        setSidebarOpen(false)
        navigate('allergens')
      },
    },
  ]

  const premiumItems = [
    {
      icon: Crown,
      label: isPremium ? 'Premium aktivan' : 'Premium',
      badge: isPremium ? 'PRO' : null,
      action: () => {
        setSidebarOpen(false)
        navigate('premium')
      },
    },
    {
      icon: CalendarDays,
      label: 'Planer obroka',
      badge: null,
      action: () => {
        setSidebarOpen(false)
        navigate('meal-planner')
      },
    },
    {
      icon: BarChart3,
      label: 'Analitika (B2B)',
      badge: null,
      action: () => {
        setSidebarOpen(false)
        navigate('dashboard')
      },
    },
  ]

  return (
    <div className="absolute inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#000000]/40 sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-background shadow-2xl sidebar-slide flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-[#e3e3e3]">
          <Logo size="md" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center active:bg-[#f3f3f3] transition-colors"
            aria-label="Zatvori izbornik"
          >
            <X size={20} className="text-[#252525]" />
          </button>
        </div>

        {/* User info */}
        {isLoggedIn && (
          <button
            onClick={() => { setSidebarOpen(false); navigate('profile') }}
            className="px-5 py-4 border-b border-[#e3e3e3] text-left active:bg-[#f3f3f3] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#49b867]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#49b867]">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#252525]">{userName}</p>
                  {isPremium && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#fda913] text-[#252525]">PRO</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-[#6e6e6e]">{level.name}</p>
                  <span className="text-[10px] text-[#afafaf]">{points} bod.</span>
                </div>
              </div>
              <Star size={16} className="text-[#fda913]" />
            </div>
          </button>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left hover:bg-[#f3f3f3] active:bg-[#f3f3f3] transition-colors"
            >
              <item.icon size={20} className="text-[#49b867]" />
              <span className="text-sm font-medium text-[#252525]">{item.label}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="mx-5 my-2 border-t border-[#e3e3e3]" />

          {premiumItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left hover:bg-[#f3f3f3] active:bg-[#f3f3f3] transition-colors"
            >
              <item.icon size={20} className={item.label.includes('Premium') ? 'text-[#fda913]' : 'text-[#6e6e6e]'} />
              <span className="text-sm font-medium text-[#252525] flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#49b867] text-[#ffffff]">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Logout */}
        {isLoggedIn && (
          <div className="px-5 pb-8 pt-2 border-t border-[#e3e3e3]">
            <button
              onClick={() => {
                setSidebarOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-3.5 py-3 text-left"
            >
              <LogOut size={20} className="text-[#ef2723]" />
              <span className="text-sm font-medium text-[#ef2723]">Odjava</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
