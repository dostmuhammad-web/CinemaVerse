/**
 * Instant search over the whole catalogue.
 *
 * The index is built lazily on the first keystroke and then reused: one
 * normalised haystack per film plus a few exact-match sets. Scoring rewards the
 * fields a user is most likely to mean — title first, then original title,
 * people, then facets.
 */

import { MOVIES } from '../data/movies.js'

const normalise = (value) => value.toLowerCase().normalize('NFKD')

let index = null

function buildIndex() {
  const entries = MOVIES.map((movie) => {
    const title = normalise(movie.title)
    const original = normalise(movie.originalTitle)
    const director = normalise(movie.director)
    const cast = movie.cast.map(normalise)
    const genres = movie.genres.map(normalise)
    const country = normalise(movie.country)
    const language = normalise(movie.language)
    const year = String(movie.year)
    const decade = `${Math.floor(movie.year / 10) * 10}s`

    return {
      movie,
      title,
      titleWords: title.split(/[^a-z0-9]+/).filter(Boolean),
      original,
      director,
      cast,
      castSet: new Set(cast),
      genres,
      genreSet: new Set(genres),
      country,
      language,
      year,
      decade,
      keywords: movie.keywords.split(' '),
      haystack: [
        title,
        original,
        director,
        cast.join(' '),
        genres.join(' '),
        country,
        language,
        year,
        decade,
        movie.keywords,
      ].join(' | '),
    }
  })
  return { entries }
}

function getIndex() {
  if (!index) index = buildIndex()
  return index
}

export const tokenize = (query) =>
  normalise(query)
    .split(/[^a-z0-9'’]+/)
    .filter((token) => token.length > 0)

const STARTS_WITH = (haystack, token) => haystack.startsWith(token)
const CONTAINS = (haystack, token) => haystack.includes(token)

/** Scores one entry against every token; returns 0 when a token is missing. */
function scoreEntry(entry, tokens) {
  let score = 0

  for (const token of tokens) {
    let tokenScore = 0

    if (STARTS_WITH(entry.title, token)) tokenScore += 120
    else if (CONTAINS(entry.title, token)) tokenScore += 85
    else if (CONTAINS(entry.titleWords.join(' '), token)) tokenScore += 60

    if (CONTAINS(entry.original, token)) tokenScore += 70

    if (STARTS_WITH(entry.director, token)) tokenScore += 55
    else if (CONTAINS(entry.director, token)) tokenScore += 40

    if (entry.castSet.has(token)) tokenScore += 65
    else if (entry.cast.some((person) => CONTAINS(person, token))) tokenScore += 32

    if (entry.genreSet.has(token)) tokenScore += 30
    if (entry.country === token) tokenScore += 26
    if (entry.language === token) tokenScore += 18
    if (entry.year === token) tokenScore += 24
    if (entry.decade === token) tokenScore += 14
    if (entry.keywords.includes(token)) tokenScore += 12

    if (!tokenScore && CONTAINS(entry.haystack, token)) tokenScore += 8

    if (!tokenScore) return 0
    score += tokenScore
  }

  // Whole-phrase bonus: typing a full title should beat typing a word of it.
  const phrase = tokens.join(' ')
  if (tokens.length > 1) {
    if (entry.title === phrase) score += 180
    else if (STARTS_WITH(entry.title, phrase)) score += 120
    else if (CONTAINS(entry.title, phrase)) score += 60
  }

  // Popular films win ties.
  score += Math.log10(entry.movie.votes + 10) * 2
  return score
}

/**
 * @param {string} query
 * @param {{ limit?: number, genre?: string, country?: string }} options
 */
export function searchMovies(query, { limit = 0, genre = '', country = '' } = {}) {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const { entries } = getIndex()
  const results = []

  for (const entry of entries) {
    if (genre && !entry.genreSet.has(normalise(genre))) continue
    if (country && entry.country !== normalise(country)) continue
    const score = scoreEntry(entry, tokens)
    if (score > 0) results.push({ movie: entry.movie, score })
  }

  results.sort((a, b) => b.score - a.score || a.movie.title.localeCompare(b.movie.title))
  return limit ? results.slice(0, limit).map((entry) => entry.movie) : results.map((entry) => entry.movie)
}

/** Lightweight header suggestions: films first, then people. */
export function suggestMovies(query, limit = 6) {
  const tokens = tokenize(query)
  if (!tokens.length) return { films: [], people: [] }

  const { entries } = getIndex()
  const token = tokens[0]
  const films = []
  const people = new Map()

  // One entry per person: the map key is the normalised name.
  const addPerson = (name, movie, kind) => {
    const key = `${kind}:${normalise(name)}`
    if (!people.has(key)) people.set(key, { label: name, movie, kind })
  }

  for (const entry of entries) {
    if (STARTS_WITH(entry.title, token) || CONTAINS(entry.title, token)) {
      films.push(entry.movie)
    } else if (STARTS_WITH(entry.original, token) || CONTAINS(entry.original, token)) {
      films.push(entry.movie)
    }

    if (CONTAINS(entry.director, token)) addPerson(entry.movie.director, entry.movie, 'director')
    for (const person of entry.cast) {
      if (CONTAINS(person, token)) addPerson(person, entry.movie, 'cast')
    }

    if (films.length >= limit && people.size >= limit) break
  }

  films.sort((a, b) => Number(STARTS_WITH(normalise(b.title), token)) - Number(STARTS_WITH(normalise(a.title), token)))
  return {
    films: films.slice(0, limit),
    people: [...people.values()].slice(0, 3),
  }
}

/** Facet counts for the current query, used by the search results sidebar. */
export function countMatches(query) {
  const results = searchMovies(query)
  const genres = new Map()
  const countries = new Map()
  const years = new Map()

  for (const movie of results) {
    movie.genres.forEach((genre) => genres.set(genre, (genres.get(genre) ?? 0) + 1))
    countries.set(movie.country, (countries.get(movie.country) ?? 0) + 1)
    const decade = `${Math.floor(movie.year / 10) * 10}s`
    years.set(decade, (years.get(decade) ?? 0) + 1)
  }

  return {
    total: results.length,
    genres: [...genres.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })),
    countries: [...countries.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count })),
    decades: [...years.entries()]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([value, count]) => ({ value, count })),
  }
}