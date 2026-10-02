/**
 * Filtering, sorting and pagination — all pure, so a page can memoise the
 * result of a filter run and only recompute when the query actually changes.
 */

import { DURATIONS, RATINGS, YEARS, durationBucketOf } from './catalog.js'
import { DEFAULT_SORT, SORT_IDS } from './catalog.js'

export const PAGE_SIZE = 24
export const INFINITE_STEP = 24

export const EMPTY_FILTERS = Object.freeze({
  genres: [],
  countries: [],
  languages: [],
  decades: [],
  durations: [],
  minRating: 0,
  minYear: YEARS.min,
  maxYear: YEARS.max,
  status: '',
})

export const RATING_TIERS = [
  { id: 'any', label: 'Any rating', min: 0 },
  { id: 'six', label: '6.0 and up', min: 6 },
  { id: 'seven', label: '7.0 and up', min: 7 },
  { id: 'eight', label: '8.0 and up', min: 8 },
]

export const STATUSES = ['Released', 'Limited', 'In Theaters', 'Upcoming']

export const FILTERS_IN_URL = [
  'genres',
  'countries',
  'languages',
  'decades',
  'durations',
  'minRating',
  'minYear',
  'maxYear',
  'status',
]

/** Reads filter state out of the URL query, tolerating anything. */
export function filtersFromQuery(query) {
  const list = (key) =>
    String(query[key] ?? '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)

  const num = (key, fallback) => {
    const value = Number.parseFloat(query[key])
    return Number.isFinite(value) ? value : fallback
  }

  return {
    genres: list('genres'),
    countries: list('countries'),
    languages: list('languages'),
    decades: list('decades'),
    durations: list('durations'),
    minRating: num('minRating', 0),
    minYear: num('minYear', YEARS.min),
    maxYear: num('maxYear', YEARS.max),
    status: String(query.status ?? ''),
  }
}

export function filtersToQuery(filters) {
  return {
    genres: filters.genres.join(','),
    countries: filters.countries.join(','),
    languages: filters.languages.join(','),
    decades: filters.decades.join(','),
    durations: filters.durations.join(','),
    minRating: filters.minRating > 0 ? String(filters.minRating) : '',
    minYear: filters.minYear > YEARS.min ? String(filters.minYear) : '',
    maxYear: filters.maxYear < YEARS.max ? String(filters.maxYear) : '',
    status: filters.status,
  }
}

export function activeFilterCount(filters) {
  let count = 0
  count += filters.genres.length
  count += filters.countries.length
  count += filters.languages.length
  count += filters.decades.length
  count += filters.durations.length
  count += filters.status ? 1 : 0
  if (filters.minRating > 0) count += 1
  if (filters.minYear > YEARS.min) count += 1
  if (filters.maxYear < YEARS.max) count += 1
  return count
}

export const hasActiveFilters = (filters) => activeFilterCount(filters) > 0

/** Filter values are always AND-ed; values inside one facet are OR-ed. */
function matches(movie, filters) {
  for (const genre of filters.genres) {
    if (!movie.genres.includes(genre)) return false
  }
  for (const country of filters.countries) {
    if (movie.country !== country) return false
  }
  for (const language of filters.languages) {
    if (movie.language !== language) return false
  }
  if (filters.decades.length) {
    const decade = `${Math.floor(movie.year / 10) * 10}s`
    if (!filters.decades.includes(decade)) return false
  }
  if (filters.durations.length) {
    const bucket = durationBucketOf(movie)
    if (!bucket || !filters.durations.includes(bucket.id)) return false
  }
  if (filters.minRating > 0 && movie.rating < filters.minRating) return false
  if (filters.status && movie.status !== filters.status) return false
  return movie.year >= filters.minYear && movie.year <= filters.maxYear
}

export function applyFilters(movies, filters) {
  if (!hasActiveFilters(filters)) return movies
  return movies.filter((movie) => matches(movie, filters))
}

export function resolveSort(value) {
  return SORT_IDS.includes(value) ? value : DEFAULT_SORT
}

/** Adds or removes one value from a multi-select facet. */
export function toggleIn(list, value) {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value]
}

export function paginate(items, page, size = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / size))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * size
  return {
    items: items.slice(start, start + size),
    page: safePage,
    pageCount,
    total: items.length,
    from: items.length ? start + 1 : 0,
    to: Math.min(items.length, start + size),
    hasPrev: safePage > 1,
    hasNext: safePage < pageCount,
  }
}

/** Windowed page numbers with ellipses: 1 … 4 5 6 … 42 */
export function pageWindow(page, pageCount, span = 2) {
  if (pageCount <= 1) return []
  const pages = new Set([1, pageCount])
  for (let offset = 1; offset <= span; offset += 1) {
    if (page - offset >= 1) pages.add(page - offset)
    if (page + offset <= pageCount) pages.add(page + offset)
  }
  const sorted = [...pages].sort((a, b) => a - b)
  const out = []
  let previous = 0
  for (const value of sorted) {
    if (previous && value - previous > 1) out.push(`gap-${value}`)
    out.push(value)
    previous = value
  }
  return out
}

export const YEAR_RANGE = YEARS
export const RATING_RANGE = RATINGS
export const DURATION_RANGE = DURATIONS
export { DURATIONS as DURATION_BOUNDS }