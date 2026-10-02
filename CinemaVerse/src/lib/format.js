/* Small presentation helpers shared by every page. */

/** 142 → "2h 22m" · 96 → "1h 36m" */
export function formatDuration(minutes) {
  if (!Number.isFinite(minutes)) return '—'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest}m`
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

/** 1_240_000 → "1.2M" */
export function formatCount(value) {
  if (!Number.isFinite(value)) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(value)
}

export const formatYear = (year) => (Number.isFinite(year) ? String(year) : '—')

export function formatVotes(votes) {
  return `${formatCount(votes)} ratings`
}

/** 8.4 → "high", 6.5 → "mid", anything lower → "low" */
export function ratingTier(rating) {
  if (rating >= 7.8) return 'high'
  if (rating >= 6.3) return 'mid'
  return 'low'
}

export const formatRating = (rating) => (Number.isFinite(rating) ? rating.toFixed(1) : '—')

/** "In Theaters" → "in-theaters", for status chip modifiers. */
export const statusClass = (status) =>
  String(status ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export function plural(count, singular, pluralForm = `${singular}s`) {
  return `${formatCount(count)} ${count === 1 ? singular : pluralForm}`
}

/** "1961 – 2026" style label for a decade bucket. */
export const decadeLabel = (decade) => `${decade}s`

export function joinList(items, max = 3) {
  if (items.length <= max) return items.join(', ')
  return `${items.slice(0, max).join(', ')} +${items.length - max}`
}

/** Search terms a user is most likely to type for a film, best match first. */
export function suggestionTerms(movie) {
  return [movie.title, movie.originalTitle, movie.director, ...movie.cast]
}

export const sleep = (ms) => new Promise((done) => window.setTimeout(done, ms))