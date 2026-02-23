export interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  workingHours: {
    label: string
    times: string
  }[]
  rating: number
  reviewCount: number
  crowdLevel: 'low' | 'medium' | 'high'
  imageUrl: string
  crowdPredictions: { time: string; level: number }[]
  crowdPattern: { peakTime: string; quietTime: string }
  crowdTrend: 'rising' | 'falling' | 'stable'
}

export interface Meal {
  id: string
  restaurantId: string
  name: string
  price: number
  fullPrice: number
  category: 'lunch' | 'dinner'
  description: string
  allergens: number[]
  rating: number
  reviewCount: number
  imageUrl: string
  nutrition: {
    calories: number
    carbs: string
    fats: string
    protein: string
  }
  isVegetarian: boolean
  trendScore?: number
  /** Sponsored Meal of the Day: mealId in rotation for sponsored slot */
  sponsoredUntil?: number
}

export interface Promotion {
  id: string
  restaurantId: string
  title: string
  description: string
  imageUrl?: string
  ctaLabel?: string
  ctaUrl?: string
  validFrom: number
  validTo: number
  city?: string
}

export interface EventPromotion {
  id: string
  name: string
  message: string
  startDate: number
  endDate: number
  city?: string
  campusId?: string
  deepLink?: string
}

export interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requiredPoints: number
}

export interface FriendActivity {
  id: string
  name: string
  action: string
  mealName: string
  restaurantName: string
  time: string
  avatar: string
}

export const badges: Badge[] = [
  { id: 'b1', name: 'Brucos', description: 'Napravio si prvi korak!', icon: 'GraduationCap', requiredPoints: 0 },
  { id: 'b2', name: 'Crowd Reporter', description: 'Prijavi guzvu 5 puta', icon: 'Radio', requiredPoints: 25 },
  { id: 'b3', name: 'Recenzent', description: 'Napiši 10 recenzija', icon: 'MessageSquare', requiredPoints: 100 },
  { id: 'b4', name: 'Gurman', description: 'Probaj 20 razlicitih jela', icon: 'ChefHat', requiredPoints: 200 },
  { id: 'b5', name: 'Redoviti Gost', description: 'Koristi aplikaciju 30 dana', icon: 'Calendar', requiredPoints: 300 },
  { id: 'b6', name: 'Magistar Menze', description: 'Sakupi 500 bodova', icon: 'Award', requiredPoints: 500 },
]

export const friendActivities: FriendActivity[] = [
  { id: 'f1', name: 'Ivan K.', action: 'jeo je', mealName: 'Peceni krumpir', restaurantName: 'Restoran Radic', time: 'Prije 15 min', avatar: 'I' },
  { id: 'f2', name: 'Petra M.', action: 'ocijenila je', mealName: 'Lignje na buzaru', restaurantName: 'Restoran Radic', time: 'Prije 30 min', avatar: 'P' },
  { id: 'f3', name: 'Luka B.', action: 'prijavio guzvu u', mealName: '', restaurantName: 'Restoran Borongaj', time: 'Prije 1 sat', avatar: 'L' },
  { id: 'f4', name: 'Ana S.', action: 'dodala u favorite', mealName: 'Piletina na zaru', restaurantName: 'Restoran Savska', time: 'Prije 2 sata', avatar: 'A' },
]

export const premiumFeatures = [
  { id: 'pf1', name: 'Predikcija guzvi', description: 'Pogledaj prognozu guzve za slijedeca 3 sata', icon: 'BarChart3' },
  { id: 'pf2', name: 'Pametne obavijesti', description: 'Dobij obavijest kad je najbolje vrijeme za rucak', icon: 'Bell' },
  { id: 'pf3', name: 'Planer obroka', description: 'Planiraj obroke za cijeli tjedan unaprijed', icon: 'CalendarDays' },
  { id: 'pf4', name: 'Praćenje prehrane', description: 'Prati kalorije i nutrijente svakog dana', icon: 'Heart' },
  { id: 'pf5', name: 'Praćenje budžeta', description: 'Pregledaj koliko trosiš mjesecno u menzama', icon: 'Wallet' },
]

export const allergensList = [
  { id: 1, name: 'Žitarice koje sadrže gluten i proizvodi od njih' },
  { id: 2, name: 'Rakovi i proizvodi od rakova' },
  { id: 3, name: 'Jaja i proizvodi od jaja' },
  { id: 4, name: 'Riba i proizvodi od ribe' },
  { id: 5, name: 'Kikiriki i proizvodi od kikirikija' },
  { id: 6, name: 'Soja i proizvodi od soje' },
  { id: 7, name: 'Mlijeko i proizvodi od mlijeka' },
  { id: 8, name: 'Orasasti plodovi' },
  { id: 9, name: 'Celer i proizvodi od celera' },
  { id: 10, name: 'Gorusica i proizvodi od gorusice' },
  { id: 11, name: 'Sjemenke sezama i proizvodi od sezama' },
  { id: 12, name: 'Sumporni dioksid i sulfiti' },
  { id: 13, name: 'Lupina i proizvodi od lupine' },
  { id: 14, name: 'Mekusci i proizvodi od mekusaca' },
]

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Restoran Savska',
    address: 'Savska cesta 25, 10000, Zagreb',
    city: 'Zagreb',
    workingHours: [
      { label: 'Pon - Pet', times: '09:00 - 15:00' },
      { label: 'Sub', times: '09:00 - 14:00' },
    ],
    rating: 4.2,
    reviewCount: 128,
    crowdLevel: 'low',
    imageUrl: '/images/restaurant-savska.jpg',
    crowdPredictions: [
      { time: '11:00', level: 30 }, { time: '11:30', level: 45 },
      { time: '12:00', level: 75 }, { time: '12:30', level: 90 },
      { time: '13:00', level: 65 }, { time: '13:30', level: 40 },
      { time: '14:00', level: 20 },
    ],
    crowdPattern: { peakTime: '12:30', quietTime: '14:00' },
    crowdTrend: 'rising',
  },
  {
    id: '2',
    name: 'Restoran Borongaj',
    address: 'Borongajska cesta, 10000, Zagreb',
    city: 'Zagreb',
    workingHours: [
      { label: 'Pon - Pet', times: '07:30 - 16:00' },
    ],
    rating: 3.8,
    reviewCount: 95,
    crowdLevel: 'medium',
    imageUrl: '/images/restaurant-borongaj.jpg',
    crowdPredictions: [
      { time: '11:00', level: 40 }, { time: '11:30', level: 55 },
      { time: '12:00', level: 80 }, { time: '12:30', level: 95 },
      { time: '13:00', level: 70 }, { time: '13:30', level: 50 },
      { time: '14:00', level: 30 },
    ],
    crowdPattern: { peakTime: '12:30', quietTime: '14:30' },
    crowdTrend: 'stable',
  },
  {
    id: '3',
    name: 'Restoran TTF',
    address: 'Prilaz baruna Filipovica 28, 10000, Zagreb',
    city: 'Zagreb',
    workingHours: [
      { label: 'Pon - Pet', times: '08:00 - 14:30' },
    ],
    rating: 4.5,
    reviewCount: 210,
    crowdLevel: 'low',
    imageUrl: '/images/restaurant-ttf.jpg',
    crowdPredictions: [
      { time: '11:00', level: 25 }, { time: '11:30', level: 35 },
      { time: '12:00', level: 60 }, { time: '12:30', level: 70 },
      { time: '13:00', level: 45 }, { time: '13:30', level: 25 },
      { time: '14:00', level: 10 },
    ],
    crowdPattern: { peakTime: '12:30', quietTime: '13:30' },
    crowdTrend: 'falling',
  },
  {
    id: '4',
    name: 'Restoran u Studentskom domu Stjepan Radic',
    address: 'Jarunska ul. 2, 10000, Zagreb',
    city: 'Zagreb',
    workingHours: [
      { label: 'Pon - Pet', times: '07:00 - 20:00' },
      { label: 'Sub', times: '08:00 - 16:00' },
      { label: 'Ned', times: '10:00 - 15:00' },
    ],
    rating: 4.0,
    reviewCount: 302,
    crowdLevel: 'high',
    imageUrl: '/images/restaurant-radic.jpg',
    crowdPredictions: [
      { time: '11:00', level: 50 }, { time: '11:30', level: 70 },
      { time: '12:00', level: 95 }, { time: '12:30', level: 100 },
      { time: '13:00', level: 85 }, { time: '13:30', level: 60 },
      { time: '14:00', level: 35 },
    ],
    crowdPattern: { peakTime: '12:00', quietTime: '14:30' },
    crowdTrend: 'rising',
  },
  {
    id: '5',
    name: 'Restoran SC',
    address: 'Savska cesta 25, 10000, Zagreb',
    city: 'Zagreb',
    workingHours: [
      { label: 'Pon - Pet', times: '11:00 - 16:00' },
    ],
    rating: 3.5,
    reviewCount: 67,
    crowdLevel: 'medium',
    imageUrl: '/images/restaurant-sc.jpg',
    crowdPredictions: [
      { time: '11:00', level: 20 }, { time: '11:30', level: 40 },
      { time: '12:00', level: 65 }, { time: '12:30', level: 80 },
      { time: '13:00', level: 60 }, { time: '13:30', level: 35 },
      { time: '14:00', level: 15 },
    ],
    crowdPattern: { peakTime: '12:30', quietTime: '15:00' },
    crowdTrend: 'falling',
  },
]

export const meals: Meal[] = [
  {
    id: 'm1',
    restaurantId: '4',
    name: 'Krpice sa zeljem',
    price: 1.40,
    fullPrice: 3.50,
    category: 'lunch',
    description: 'Domace krpice sa svjezim zeljem, pripravljene na tradicionalan nacin.',
    allergens: [1, 3, 7],
    rating: 4.1,
    reviewCount: 45,
    imageUrl: '/images/meal-krpice.jpg',
    nutrition: { calories: 320, carbs: '35g', fats: '8g', protein: '12g' },
    isVegetarian: true,
    trendScore: 72,
  },
  {
    id: 'm2',
    restaurantId: '4',
    name: 'Pecena svinjetina',
    price: 1.40,
    fullPrice: 3.50,
    category: 'lunch',
    description: 'Socna pecena svinjetina sa zapecenim krumpirom i umakom od povrca.',
    allergens: [7, 9],
    rating: 4.3,
    reviewCount: 62,
    imageUrl: '/images/meal-svinjetina.jpg',
    nutrition: { calories: 480, carbs: '15g', fats: '22g', protein: '35g' },
    isVegetarian: false,
    trendScore: 65,
  },
  {
    id: 'm3',
    restaurantId: '4',
    name: 'Peceni krumpir',
    price: 2.80,
    fullPrice: 4.00,
    category: 'lunch',
    description: 'Hrskavi peceni krumpir zlatno-smedje boje, zacinjen s maslo sol i biljanim uljem.',
    allergens: [6, 9, 12],
    rating: 5.0,
    reviewCount: 89,
    imageUrl: '/images/meal-krumpir.jpg',
    nutrition: { calories: 220, carbs: '25g', fats: '5g', protein: '2g' },
    isVegetarian: true,
    trendScore: 98,
  },
  {
    id: 'm4',
    restaurantId: '4',
    name: 'Lignje na buzaru',
    price: 3.00,
    fullPrice: 5.50,
    category: 'lunch',
    description: 'Lignje pripremljene na istarski nacin u umaku od rajcice s bijelim vinom.',
    allergens: [1, 4, 14, 7],
    rating: 4.7,
    reviewCount: 112,
    imageUrl: '/images/meal-lignje.jpg',
    nutrition: { calories: 350, carbs: '12g', fats: '8g', protein: '28g' },
    isVegetarian: false,
    trendScore: 91,
  },
  {
    id: 'm5',
    restaurantId: '4',
    name: 'Kroketi',
    price: 1.20,
    fullPrice: 2.50,
    category: 'lunch',
    description: 'Hrskavi kroketi od krumpira, idealni kao prilog ili samostalan obrok.',
    allergens: [1, 3, 7],
    rating: 3.9,
    reviewCount: 34,
    imageUrl: '/images/meal-kroketi.jpg',
    nutrition: { calories: 280, carbs: '30g', fats: '15g', protein: '5g' },
    isVegetarian: true,
    trendScore: 45,
  },
  {
    id: 'm6',
    restaurantId: '1',
    name: 'Piletina na zaru',
    price: 2.50,
    fullPrice: 4.50,
    category: 'lunch',
    description: 'Socna piletina s grila, servirana s povrcem na pari.',
    allergens: [7, 9],
    rating: 4.4,
    reviewCount: 78,
    imageUrl: '/images/meal-piletina.jpg',
    nutrition: { calories: 380, carbs: '8g', fats: '12g', protein: '42g' },
    isVegetarian: false,
    trendScore: 85,
  },
]

// Sponsored Meal of the Day (rotates by day of week)
export function getSponsoredMealOfTheDay(): string {
  const dayIndex = new Date().getDay()
  const sponsoredIds = ['m4', 'm6', 'm3', 'm1', 'm2', 'm5', 'm4']
  return sponsoredIds[dayIndex] ?? 'm4'
}

// Sponsored cafeteria promotions
export const promotions: Promotion[] = [
  {
    id: 'pr1',
    restaurantId: '4',
    title: 'Akcija tjedna',
    description: '-20% na vegetarijanske obroke do petka!',
    imageUrl: '/images/meal-krpice.jpg',
    ctaLabel: 'Pogledaj meni',
    validFrom: Date.now() - 86400000,
    validTo: Date.now() + 4 * 86400000,
    city: 'Zagreb',
  },
  {
    id: 'pr2',
    restaurantId: '1',
    title: 'Novo u ponudi',
    description: 'Svjezi gril - Piletina na zaru s povrcem.',
    ctaLabel: 'Detalji',
    validFrom: Date.now() - 86400000,
    validTo: Date.now() + 30 * 86400000,
    city: 'Zagreb',
  },
  {
    id: 'pr3',
    restaurantId: '3',
    title: 'Studentski popust',
    description: '10% popusta za sve studente s iskaznicom.',
    validFrom: Date.now() - 86400000,
    validTo: Date.now() + 7 * 86400000,
    city: 'Zagreb',
  },
]

// Event-based push promotions (student events)
export const eventPromotions: EventPromotion[] = [
  {
    id: 'ev1',
    name: 'Orijentacija 2026',
    message: 'Dobrodosli novi brucosi! Restoran Radic ima posebnu ponudu za vas.',
    startDate: Date.now() - 86400000,
    endDate: Date.now() + 14 * 86400000,
    city: 'Zagreb',
    deepLink: 'restaurant-detail',
  },
  {
    id: 'ev2',
    name: 'Ispitni rok',
    message: 'Prosjeceni radni sat u Restoran TTF tijekom ispitnog roka.',
    startDate: Date.now() - 86400000,
    endDate: Date.now() + 21 * 86400000,
    city: 'Zagreb',
    deepLink: 'restaurant-detail',
  },
]

export function getActiveEventPromotions(city: string): EventPromotion[] {
  const now = Date.now()
  return eventPromotions.filter(
    (e) =>
      e.startDate <= now &&
      e.endDate >= now &&
      (e.city == null || e.city === city)
  )
}

export function getPromotionsForRestaurant(restaurantId: string, city?: string): Promotion[] {
  const now = Date.now()
  return promotions.filter(
    (p) =>
      p.restaurantId === restaurantId &&
      p.validFrom <= now &&
      p.validTo >= now &&
      (p.city == null || p.city === city)
  )
}

export const reviews: Review[] = [
  {
    id: 'r1',
    userName: 'Ana M.',
    rating: 5,
    comment: 'Odlican krumpir! Hrskav izvana, mekan iznutra, taman zacinjen. Svakako bih jela ponovno.',
    date: '2026-02-20',
  },
  {
    id: 'r2',
    userName: 'Marko K.',
    rating: 5,
    comment: 'Odlicno pripremljeno, porcija taman velika, servirano uz glavno jelo. Preporucujem!',
    date: '2026-02-18',
  },
  {
    id: 'r3',
    userName: 'Ivana P.',
    rating: 4,
    comment: 'Jako dobro, ali moglo bi biti malo vise zacinjeno. Ipak, svjeze i ukusno.',
    date: '2026-02-15',
  },
  {
    id: 'r4',
    userName: 'Luka B.',
    rating: 5,
    comment: 'Najbolji obrok u menzi! Uvijek se vracam po ovo jelo.',
    date: '2026-02-10',
  },
]

// Dashboard data for B2B
export const dashboardData = {
  dailyVisitors: [
    { day: 'Pon', count: 420 },
    { day: 'Uto', count: 380 },
    { day: 'Sri', count: 450 },
    { day: 'Cet', count: 395 },
    { day: 'Pet', count: 340 },
    { day: 'Sub', count: 180 },
    { day: 'Ned', count: 95 },
  ],
  peakHours: [
    { hour: '10', level: 15 }, { hour: '11', level: 45 },
    { hour: '12', level: 92 }, { hour: '13', level: 78 },
    { hour: '14', level: 42 }, { hour: '15', level: 18 },
  ],
  topMeals: [
    { name: 'Peceni krumpir', orders: 156 },
    { name: 'Lignje na buzaru', orders: 132 },
    { name: 'Piletina na zaru', orders: 98 },
    { name: 'Krpice sa zeljem', orders: 87 },
    { name: 'Kroketi', orders: 64 },
  ],
  weeklyRevenue: 12450,
  weeklyWaste: 3.2,
  satisfactionRate: 4.3,
}

/** Get Monday of the week for a given date */
export function getWeekStart(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = x.getDate() - day + (day === 0 ? -6 : 1)
  x.setDate(diff)
  return x
}

/** Get 7 dates starting from the given Monday */
export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(weekStart)
    x.setDate(weekStart.getDate() + i)
    return x
  })
}

export function getLevelForPoints(points: number): { name: string; min: number; max: number } {
  if (points >= 500) return { name: 'Doktor', min: 500, max: 999 }
  if (points >= 200) return { name: 'Magistar', min: 200, max: 500 }
  if (points >= 50) return { name: 'Student', min: 50, max: 200 }
  return { name: 'Brucos', min: 0, max: 50 }
}
