export type CrowdLevel = 'low' | 'medium' | 'high'

export interface CrowdReport {
  at: number // epoch ms
  level: CrowdLevel
  weight: number
}

export function getUserTrustWeight(input: {
  points: number
  crowdReports: number
  reviewsCount: number
  isPremium: boolean
}) {
  // Small, predictable weighting (1.0–2.0) based on activity.
  const activity = input.crowdReports * 0.03 + input.reviewsCount * 0.05 + input.points * 0.001
  const premiumBoost = input.isPremium ? 0.15 : 0
  const w = 1 + activity + premiumBoost
  return Math.max(1, Math.min(2, Number(w.toFixed(2))))
}

export function crowdLevelToScore(level: CrowdLevel) {
  // Scores are intentionally spaced to make spikes detectable.
  if (level === 'low') return 20
  if (level === 'medium') return 60
  return 90
}

export function scoreToCrowdLevel(score: number): CrowdLevel {
  if (score >= 75) return 'high'
  if (score >= 45) return 'medium'
  return 'low'
}

export function computeWeightedCrowdScore(params: {
  reports: CrowdReport[]
  fallbackLevel: CrowdLevel
  now?: number
}) {
  const now = params.now ?? Date.now()
  // Prefer fresher reports via mild time-decay (last 2h matter more).
  const twoHoursMs = 2 * 60 * 60 * 1000

  if (!params.reports.length) {
    const score = crowdLevelToScore(params.fallbackLevel)
    return { score, level: params.fallbackLevel, lastUpdateAt: null as number | null }
  }

  let sumW = 0
  let sum = 0
  let lastUpdateAt = 0

  for (const r of params.reports) {
    lastUpdateAt = Math.max(lastUpdateAt, r.at)
    const age = Math.max(0, now - r.at)
    const freshness = 0.6 + 0.4 * Math.max(0, 1 - age / twoHoursMs) // 0.6..1.0
    const w = r.weight * freshness
    sumW += w
    sum += crowdLevelToScore(r.level) * w
  }

  const score = sumW > 0 ? sum / sumW : crowdLevelToScore(params.fallbackLevel)
  return { score, level: scoreToCrowdLevel(score), lastUpdateAt }
}

export function getReportsInWindow(reports: CrowdReport[], now: number, windowMs: number) {
  const start = now - windowMs
  return reports.filter((r) => r.at >= start && r.at <= now)
}

export function computeConfidence(params: {
  reports: CrowdReport[]
  now?: number
}) {
  const now = params.now ?? Date.now()
  const reports24h = getReportsInWindow(params.reports, now, 24 * 60 * 60 * 1000)
  const lastUpdateAt = params.reports.length ? Math.max(...params.reports.map((r) => r.at)) : null
  const ageMin = lastUpdateAt ? (now - lastUpdateAt) / 60000 : null

  const count = reports24h.length

  let label: 'Niska' | 'Srednja' | 'Visoka' = 'Niska'
  if (count >= 20 && ageMin !== null && ageMin <= 60) label = 'Visoka'
  else if (count >= 8 && ageMin !== null && ageMin <= 180) label = 'Srednja'

  return {
    label,
    reportCount24h: count,
    lastUpdateAt,
  }
}

export function formatTimeAgo(at: number | null, now?: number) {
  if (!at) return 'Nema prijava'
  const n = now ?? Date.now()
  const diffMs = Math.max(0, n - at)
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Upravo sada'
  if (mins < 60) return `Prije ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Prije ${hours} h`
  const days = Math.floor(hours / 24)
  return `Prije ${days} d`
}
