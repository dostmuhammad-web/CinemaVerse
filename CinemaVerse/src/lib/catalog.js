/**
 * Catalogue indexes.
 *
 * Everything the UI needs to slice 1000+ films is derived once at module load
 * and memoised here, so pages never re-filter the raw array on render and
 * facet counts stay stable.
 */

import { MOVIES } from '../data/movies.js'
import { COUNTRY_BY_NAME } from '../data/taxonomy.js'

/** Re-exported so pages only ever import from this module. */
export { MOVIES }

export const MOVIES_BY_ID = new Map(MOVIES.map((movie) => [movie.id, movie]))
export const MOVIES_BY_SLUG = new Map(MOVIES.map((movie) => [movie.slug, movie]))
export const MOVIE_COUNT = MOVIES.length

/** Accepts either a slug or an id. */
export function getMovie(key) {
  if (!key) return undefined
  return MOVIES_BY_SLUG.get(key) ?? MOVIES_BY_ID.get(key)
}

export const YEARS = MOVIES.reduce(
  (acc, movie) => {
    acc.min = Math.min(acc.min, movie.year)
    acc.max = Math.max(acc.max, movie.year)
    return acc
  },
  { min: Infinity, max: -Infinity },
)

export const RATINGS = MOVIES.reduce(
  (acc, movie) => {
    acc.min = Math.min(acc.min, movie.rating)
    acc.max = Math.max(acc.max, movie.rating)
    return acc
  },
  { min: Infinity, max: -Infinity },
)

export const DURATIONS = MOVIES.reduce(
  (acc, movie) => {
    acc.min = Math.min(acc.min, movie.duration)
    acc.max = Math.max(acc.max, movie.duration)
    return acc
  },
  { min: Infinity, max: -Infinity },
)

/* ------------------------------------------------------------------ */
/* facet helpers                                                       */
/* ------------------------------------------------------------------ */

/** Counts + a bucket of films for each distinct value of a multi-valued field. */
function buildFacet(valuesOf) {
  const buckets = new Map()
  MOVIES.forEach((movie) => {
    valuesOf(movie).forEach((value) => {
      let bucket = buckets.get(value)
      if (!bucket) {
        bucket = { value, count: 0, movies: [] }
        buckets.set(value, bucket)
      }
      bucket.count += 1
      bucket.movies.push(movie)
    })
  })
  return buckets
}

const genreBuckets = buildFacet((movie) => movie.genres)
const countryBuckets = buildFacet((movie) => [movie.country])
const languageBuckets = buildFacet((movie) => [movie.language])
const directorBuckets = buildFacet((movie) => [movie.director])

const decadeBuckets = buildFacet((movie) => [`${Math.floor(movie.year / 10) * 10}s`])

const toList = (buckets) =>
  [...buckets.values()].sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))

export const GENRES = toList(genreBuckets)
export const COUNTRIES = toList(countryBuckets)
export const LANGUAGES = toList(languageBuckets)
export const DIRECTORS = toList(directorBuckets)
export const DECADES = toList(decadeBuckets).sort((a, b) => Number(a.value) - Number(b.value))

export const GENRE_NAMES = GENRES.map((genre) => genre.value)
export const COUNTRY_NAMES = COUNTRIES.map((country) => country.value)
export const LANGUAGE_NAMES = LANGUAGES.map((language) => language.value)

/** Region + primary language per country, from the generated taxonomy file. */
export const COUNTRY_META = new Map(
  COUNTRIES.map((country) => [
    country.value,
    {
      language: COUNTRY_BY_NAME.get(country.value)?.language ?? '',
      region: COUNTRY_BY_NAME.get(country.value)?.region ?? 'Other',
    },
  ]),
)

export const regionOf = (country) => COUNTRY_META.get(country)?.region ?? 'Other'

/** Countries grouped into regions, largest catalogue first inside each region. */
export function countriesByRegion() {
  const groups = new Map()
  COUNTRIES.forEach((country) => {
    const region = regionOf(country.value)
    if (!groups.has(region)) groups.set(region, [])
    groups.get(region).push(country)
  })
  return groups
}

const bucketOf = (buckets, value) => buckets.get(value)?.movies ?? []
export const moviesInGenre = (genre) => bucketOf(genreBuckets, genre)
export const moviesInCountry = (country) => bucketOf(countryBuckets, country)
export const moviesInLanguage = (language) => bucketOf(languageBuckets, language)
export const moviesInDecade = (decade) => bucketOf(decadeBuckets, decade)
export const moviesByDirector = (director) => bucketOf(directorBuckets, director)

/* ------------------------------------------------------------------ */
/* duration buckets                                                    */
/* ------------------------------------------------------------------ */

export const DURATION_BUCKETS = [
  { id: 'short', label: 'Under 90 min', min: 0, max: 89 },
  { id: 'feature', label: '90–120 min', min: 90, max: 120 },
  { id: 'long', label: '120–150 min', min: 121, max: 150 },
  { id: 'epic', label: 'Over 150 min', min: 151, max: Infinity },
]

export const durationBucketOf = (movie) =>
  DURATION_BUCKETS.find((bucket) => movie.duration >= bucket.min && movie.duration <= bucket.max)

/* ------------------------------------------------------------------ */
/* sorted shelves (computed once)                                       */
/* ------------------------------------------------------------------ */

const byNumber = (key, direction = -1) => (a, b) => (a[key] - b[key]) * direction
const byString = (key) => (a, b) => a[key].localeCompare(b[key])

export const SORTS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Rating' },
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'popularity', label: 'Popularity' },
  { id: 'az', label: 'A–Z' },
]

export const SORT_IDS = SORTS.map((sort) => sort.id)
export const DEFAULT_SORT = 'relevance'

export const TRENDING = [...MOVIES].sort(byNumber('trendingScore'))
export const POPULAR = [...MOVIES].sort(byNumber('popularity'))
export const TOP_RATED = [...MOVIES].sort((a, b) => b.rating - a.rating || b.votes - a.votes)
export const NEW_RELEASES = [...MOVIES].sort((a, b) => b.year - a.year || b.rating - a.rating)
export const CLASSIC = [...MOVIES].sort(byNumber('year', 1))
export const BY_AZ = [...MOVIES].sort(byString('title'))

const sorters = {
  rating: byNumber('rating'),
  newest: byNumber('year'),
  oldest: byNumber('year', 1),
  popularity: byNumber('popularity'),
  az: byString('title'),
}

/** `relevance` keeps the incoming order, which is already shelf-ordered. */
export function sortMovies(movies, sortId) {
  const sorter = sorters[sortId]
  return sorter ? [...movies].sort(sorter) : movies
}

export const shelves = {
  trending: TRENDING,
  popular: POPULAR,
  'top-rated': TOP_RATED,
  'new-releases': NEW_RELEASES,
  all: MOVIES,
}

/* ------------------------------------------------------------------ */
/* related films                                                       */
/* ------------------------------------------------------------------ */

const relatedCache = new Map()

/**
 * Similar films, cached per film. Shared genres dominate, then a shared
 * director, shared cast, the same country and a nearby era.
 */
export function relatedMovies(movie, limit = 12) {
  if (!movie) return []
  const cached = relatedCache.get(movie.id)
  if (cached) return cached.slice(0, limit)

  const castSet = new Set(movie.cast)
  const genres = new Set(movie.genres)
  const decade = Math.floor(movie.year / 10)

  const scored = MOVIES.map((candidate) => {
    if (candidate.id === movie.id) return null
    let score = 0
    for (const genre of candidate.genres) if (genres.has(genre)) score += 30
    if (candidate.director === movie.director) score += 46
    for (const person of candidate.cast) if (castSet.has(person)) score += 22
    if (candidate.country === movie.country) score += 8
    if (candidate.language === movie.language) score += 6
    score += Math.max(0, 6 - Math.abs(Math.floor(candidate.year / 10) - decade)) * 3
    score += candidate.rating * 2
    return { movie: candidate, score }
  })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)

  const result = scored.map((entry) => entry.movie)
  relatedCache.set(movie.id, result)
  return result.slice(0, limit)
}

/* ------------------------------------------------------------------ */
/* stats                                                               */
/* ------------------------------------------------------------------ */

export const CATALOGUE_STATS = {
  films: MOVIE_COUNT,
  genres: GENRES.length,
  countries: COUNTRIES.length,
  languages: LANGUAGES.length,
  posters: MOVIE_COUNT,
  years: `${YEARS.min}–${YEARS.max}`,
}