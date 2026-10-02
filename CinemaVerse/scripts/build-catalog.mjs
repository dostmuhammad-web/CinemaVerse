/**
 * Builds src/data/movies.js — the CinemaVerse catalogue.
 *
 * Every film is a fully-formed object with its own poster and backdrop URL
 * baked in (`/media/posters/<slug>.svg`, `/media/backdrops/<slug>.svg`). Nothing
 * downstream ever pairs an image with a film by array index; the slug is part of
 * the film's identity.
 *
 *   node scripts/build-catalog.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COUNTRIES, GENRES, NATIVE, ROMAN, TITLE_WORDS, splitPool as split } from './data/pools.mjs'
import { MOODS, MOOD_BY_GENRE, MOOD_SLOTS, SKELETONS, CLOSERS, TAGLINES, KEYWORD_MOODS } from './data/synopsis.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const OUT_FILE = resolve(ROOT, 'src/data/movies.js')

const TOTAL = 1040
const FIRST_YEAR = 1958
const LAST_YEAR = 2026

const GENRE_WEIGHTS = {
  Drama: 16, Action: 12, Comedy: 10, Thriller: 9, Adventure: 7, Crime: 7,
  'Sci-Fi': 6, Horror: 6, Romance: 5, Mystery: 4, Fantasy: 4, Animation: 4,
  Family: 3, Documentary: 3, History: 2, War: 2, Biography: 2, Music: 1, Western: 1,
}

const DURATION_BY_GENRE = {
  Documentary: [76, 148],
  Animation: [82, 118],
  Music: [96, 172],
  War: [112, 182],
  History: [104, 168],
  Biography: [92, 158],
  'Sci-Fi': [102, 172],
  Fantasy: [104, 168],
  Action: [92, 158],
  Adventure: [98, 164],
  Western: [88, 152],
  Comedy: [84, 128],
  Horror: [80, 116],
  Romance: [90, 136],
  Thriller: [88, 142],
  Crime: [94, 152],
  Drama: [86, 148],
  Mystery: [86, 138],
  Family: [84, 126],
}

/* ------------------------------------------------------------------ */
/* deterministic randomness                                            */
/* ------------------------------------------------------------------ */

function hashString(value) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rng, list) => list[Math.floor(rng() * list.length) % list.length]

function pickMany(rng, list, count) {
  const pool = [...list]
  const out = []
  for (let i = 0; i < count && pool.length; i += 1) {
    out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0])
  }
  return out
}

function weightedPick(rng, weights) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0)
  let roll = rng() * total
  for (const [key, value] of Object.entries(weights)) {
    roll -= value
    if (roll <= 0) return key
  }
  return Object.keys(weights)[0]
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const round1 = (value) => Math.round(value * 10) / 10

/* ------------------------------------------------------------------ */
/* text                                                                */
/* ------------------------------------------------------------------ */

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function buildTitle(rng, used) {
  const { adjectives, nouns, ing, prepositions, subtitles } = TITLE_WORDS

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const shape = rng()
    let title
    if (shape < 0.16) {
      title = `The ${pick(rng, adjectives)} ${pick(rng, nouns)}`
    } else if (shape < 0.32) {
      title = `${pick(rng, nouns)} ${pick(rng, prepositions)} ${pick(rng, nouns)}`
    } else if (shape < 0.46) {
      title = `The ${pick(rng, nouns)} ${pick(rng, prepositions)} the ${pick(rng, nouns)}`
    } else if (shape < 0.6) {
      title = `${pick(rng, ing)} ${pick(rng, nouns)}`
    } else if (shape < 0.72) {
      title = `${pick(rng, adjectives)} ${pick(rng, nouns)}`
    } else if (shape < 0.82) {
      title = `${pick(rng, nouns)} & ${pick(rng, nouns)}`
    } else if (shape < 0.9) {
      title = `${pick(rng, nouns)}: ${pick(rng, subtitles)}`
    } else if (shape < 0.96) {
      title = `${pick(rng, adjectives)} ${pick(rng, nouns)} ${pick(rng, ROMAN)}`
    } else {
      title = `${pick(rng, nouns)} ${1 + Math.floor(rng() * 9)}`
    }
    const key = title.toLowerCase()
    if (!used.has(key)) {
      used.add(key)
      return title
    }
  }

  // Deterministic escape hatch — keeps the build total-preserving.
  let n = 2
  let title = `${pick(rng, nouns)} ${pick(rng, subtitles)} ${n}`
  while (used.has(title.toLowerCase())) {
    n += 1
    title = `${pick(rng, nouns)} ${pick(rng, subtitles)} ${n}`
  }
  used.add(title.toLowerCase())
  return title
}

function buildOriginalTitle(rng, language, englishTitle) {
  const bank = NATIVE[language]
  if (!bank) return englishTitle

  const nouns = split(bank.nouns)
  const adjs = split(bank.adjs)
  const noun = pick(rng, nouns)
  const other = pick(rng, nouns.filter((entry) => entry !== noun)) ?? noun
  const adj = pick(rng, adjs)

  // CJK titles read naturally as two nouns joined by a possessive particle.
  if (language === 'Japanese') return rng() > 0.5 ? `${noun}の${other}` : `${other}の${adj}${noun}`
  if (language === 'Korean') return rng() > 0.5 ? `${noun}의 ${other}` : `${adj} ${noun}`
  if (language === 'Mandarin') return rng() > 0.5 ? `${noun}的${other}` : `${adj}${noun}`

  const shape = rng()
  if (shape < 0.34) return `${adj} ${noun}`
  if (shape < 0.64) return `${noun} ${adj}`
  if (shape < 0.84) return `${noun} ${pick(rng, ['of', 'in', 'and'])} ${noun === other ? adj : other}`
  return `${adj}${noun}`
}

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)
const lowerFirst = (value) => value.charAt(0).toLowerCase() + value.slice(1)

/**
 * Stitches fragment slots into a sentence. The template owns the punctuation;
 * this only decides capitalisation and refuses to reuse a fragment that has
 * already been spent in the same synopsis.
 */
function renderSentence(template, drawn, spent) {
  const matches = [...template.matchAll(/\{(\w+)\}/g)]
  if (matches.some((match) => spent.has(match[1]))) return null

  let out = ''
  let cursor = 0
  matches.forEach((match) => {
    out += template.slice(cursor, match.index)
    const raw = drawn[match[1]]
    // Capitalise only when the fragment truly opens a sentence — a leading
    // placeholder is not enough, since templates like "By the middle {lead}"
    // start with literal text.
    const sentenceStart = out.trim() === '' || /[.?!]\s*$/.test(out)
    out += sentenceStart ? capitalize(raw) : lowerFirst(raw)
    cursor = match.index + match[0].length
  })
  out += template.slice(cursor)

  matches.forEach((match) => spent.add(match[1]))
  return out.trim()
}

function buildSynopsis(rng, mood) {
  const slots = MOODS[mood]

  // Draw one distinct fragment per slot.
  const drawn = {}
  for (const slot of MOOD_SLOTS) {
    const pool = slots[slot]
    const fresh = pool.filter((entry) => !Object.values(drawn).includes(entry))
    drawn[slot] = pick(rng, fresh.length ? fresh : pool)
  }

  const spent = new Set()
  const shapes = [...pickMany(rng, SKELETONS, SKELETONS.length), pick(rng, CLOSERS)]

  const sentences = []
  for (const shape of shapes) {
    if (sentences.length >= 4) break
    const sentence = renderSentence(shape, drawn, spent)
    if (sentence) sentences.push(sentence)
  }

  return { synopsis: sentences.join(' '), tagline: pick(rng, TAGLINES[mood]) }
}

function buildKeywords(rng, movie, mood) {
  const decade = `${Math.floor(movie.year / 10) * 10}s`
  const directorSurname = movie.director.split(' ').slice(-1)[0]
  const castSurnames = pickMany(rng, movie.cast, 2).map(
    (person) => person.split(' ').slice(-1)[0],
  )

  return [
    ...movie.genres.map((genre) => genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    movie.country.toLowerCase(),
    movie.language.toLowerCase(),
    decade,
    directorSurname.toLowerCase(),
    ...castSurnames.map((name) => name.toLowerCase()),
    ...pickMany(rng, split(KEYWORD_MOODS[mood]), 2),
    rng() > 0.72 ? String(movie.year) : null,
  ]
    .filter(Boolean)
    .join(' ')
}

/* ------------------------------------------------------------------ */
/* build                                                               */
/* ------------------------------------------------------------------ */

function buildMovie(index, usedTitles) {
  const rng = mulberry32(hashString(`cinemaverse::${index}`))
  const country = pick(rng, COUNTRIES)

  const primaryGenre = weightedPick(rng, GENRE_WEIGHTS)
  const genres = [primaryGenre]
  if (rng() > 0.52) {
    const extra = weightedPick(rng, { ...GENRE_WEIGHTS, [primaryGenre]: 0 })
    if (!genres.includes(extra)) genres.push(extra)
    if (rng() > 0.86) {
      const third = weightedPick(rng, { ...GENRE_WEIGHTS, [primaryGenre]: 0, [extra]: 0 })
      if (!genres.includes(third)) genres.push(third)
    }
  }

  const mood = MOOD_BY_GENRE[primaryGenre]
  const title = buildTitle(rng, usedTitles)
  const slug = slugify(title)
  const year = clamp(
    Math.round(FIRST_YEAR + Math.pow(rng(), 0.52) * (LAST_YEAR - FIRST_YEAR)),
    FIRST_YEAR,
    LAST_YEAR,
  )

  const rating = round1(clamp(2.9 + ((rng() + rng() + rng()) / 3) * 7, 2.9, 9.7))
  const votes = Math.round((400 + Math.pow(rng(), 2.35) * 840000) * (0.62 + rating / 9.5))
  const popularity = Math.round(votes * (0.5 + rating / 20))

  const recency = (year - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR)
  const trendingScore = Math.round(
    Math.pow(popularity, 0.58) * (0.55 + recency * 1.15) * (0.7 + rating / 12),
  )

  const [minDur, maxDur] = DURATION_BY_GENRE[primaryGenre] ?? [88, 148]
  const duration = Math.round(minDur + rng() * (maxDur - minDur))

  let status
  if (year >= LAST_YEAR) status = rng() > 0.28 ? 'Upcoming' : 'In Theaters'
  else if (year === LAST_YEAR - 1) status = rng() > 0.3 ? 'In Theaters' : 'Released'
  else if (year === LAST_YEAR - 2) status = rng() > 0.12 ? 'Released' : 'Limited'
  else status = rng() > 0.94 ? 'Limited' : 'Released'

  const first = split(country.first)
  const last = split(country.last)
  const castSize = 3 + Math.floor(rng() * 4)
  const givens = pickMany(rng, first, castSize)
  const surnames = pickMany(rng, last, castSize)
  const cast = givens.map((given, i) => `${given} ${surnames[i % surnames.length]}`)
  const director = `${pick(rng, first)} ${pick(rng, last)}`

  const movie = {
    id: `cv-${String(index + 1).padStart(4, '0')}`,
    slug,
    title,
    originalTitle: buildOriginalTitle(rng, country.language, title),
    year,
    duration,
    genres,
    rating,
    votes,
    popularity,
    trendingScore,
    country: country.name,
    language: country.language,
    status,
    director,
    cast,
  }

  const { synopsis, tagline } = buildSynopsis(rng, mood)
  movie.tagline = tagline
  movie.description = synopsis
  movie.keywords = buildKeywords(rng, movie, mood)
  movie.poster = `/media/posters/${slug}.svg`
  movie.backdrop = `/media/backdrops/${slug}.svg`
  movie.trailer = `https://embed.cinemaverse.app/trailer/${slug}`

  return movie
}

/* ------------------------------------------------------------------ */
/* serialise                                                           */
/* ------------------------------------------------------------------ */

const q = (value) => JSON.stringify(value)

function serialise(movie) {
  const genres = movie.genres.map(q).join(', ')
  const cast = movie.cast.map(q).join(', ')
  return [
    '  {',
    `    id: ${q(movie.id)}, slug: ${q(movie.slug)}, title: ${q(movie.title)},`,
    `    originalTitle: ${q(movie.originalTitle)}, tagline: ${q(movie.tagline)},`,
    `    year: ${movie.year}, duration: ${movie.duration}, rating: ${movie.rating}, votes: ${movie.votes},`,
    `    popularity: ${movie.popularity}, trendingScore: ${movie.trendingScore},`,
    `    country: ${q(movie.country)}, language: ${q(movie.language)}, status: ${q(movie.status)},`,
    `    director: ${q(movie.director)}, genres: [${genres}],`,
    `    cast: [${cast}],`,
    `    poster: ${q(movie.poster)},`,
    `    backdrop: ${q(movie.backdrop)},`,
    `    trailer: ${q(movie.trailer)},`,
    `    keywords: ${q(movie.keywords)},`,
    `    description: ${q(movie.description)},`,
    '  },',
  ].join('\n')
}

function build() {
  const usedTitles = new Set()
  const usedSlugs = new Set()
  const movies = []

  for (let index = 0; movies.length < TOTAL; index += 1) {
    const movie = buildMovie(index, usedTitles)
    if (usedSlugs.has(movie.slug)) continue
    usedSlugs.add(movie.slug)
    movies.push(movie)
  }

  return movies
}

const movies = build()

const header = `/**
 * CINEMAVERSE CATALOGUE — GENERATED FILE. DO NOT EDIT BY HAND.
 * Regenerate with: npm run catalog   (scripts/build-catalog.mjs)
 *
 * ${movies.length} films. Every entry carries its own poster and backdrop URL
 * under \`/media/\`, named after that film's slug, so an image can never be
 * paired with the wrong film. Artwork is produced by \`npm run art\`.
 *
 * NOTE: this is a catalogue-data project. Titles, people and synopses are
 * fictional and no streaming or playback feature is included.
 */

export const MOVIES = [
${movies.map(serialise).join('\n')}
]

export default MOVIES
`

await mkdir(dirname(OUT_FILE), { recursive: true })
await writeFile(OUT_FILE, header, 'utf8')

/* ------------------------------------------------------------------ */
/* taxonomy — country/language/region metadata, kept beside the films */
/* ------------------------------------------------------------------ */

const TAXONOMY_FILE = resolve(ROOT, 'src/data/taxonomy.js')

const taxonomyBody = `/**
 * CINEMAVERSE TAXONOMY — GENERATED FILE. DO NOT EDIT BY HAND.
 * Regenerate with: npm run catalog   (scripts/build-catalog.mjs)
 *
 * Country, language and region metadata for every film in the catalogue.
 */

export const COUNTRIES = [
${COUNTRIES.map(
  (country) => `  { name: ${q(country.name)}, language: ${q(country.language)}, region: ${q(country.region)} },`,
).join('\n')}
]

export const GENRES = ${JSON.stringify(GENRES)}

export const COUNTRY_BY_NAME = new Map(COUNTRIES.map((country) => [country.name, country]))

export default COUNTRIES
`

await writeFile(TAXONOMY_FILE, taxonomyBody, 'utf8')

/* ------------------------------------------------------------------ */
/* report                                                              */
/* ------------------------------------------------------------------ */

const years = movies.map((m) => m.year)
const slugs = new Set(movies.map((m) => m.slug))
const genreCount = new Map()
for (const movie of movies) {
  for (const genre of movie.genres) genreCount.set(genre, (genreCount.get(genre) ?? 0) + 1)
}
const countryCount = new Map()
for (const movie of movies) countryCount.set(movie.country, (countryCount.get(movie.country) ?? 0) + 1)

console.log(`catalogue written → ${OUT_FILE.replace(ROOT, '.')}`)
console.log(`  films            ${movies.length}`)
console.log(`  unique slugs     ${slugs.size}`)
console.log(`  years            ${Math.min(...years)} – ${Math.max(...years)}`)
console.log(`  genres           ${genreCount.size} (${[...genreCount.values()].sort((a, b) => b - a)[0]} most common)`)
console.log(`  countries        ${countryCount.size}`)
console.log(`  languages        ${new Set(movies.map((m) => m.language)).size}`)
console.log(`  cast size        ${Math.min(...movies.map((m) => m.cast.length))}–${Math.max(...movies.map((m) => m.cast.length))}`)
console.log(`  ratings          ${Math.min(...movies.map((m) => m.rating))} – ${Math.max(...movies.map((m) => m.rating))}`)
const missing = movies.filter(
  (m) => !m.poster.includes(m.slug) || !m.backdrop.includes(m.slug) || !m.trailer.includes(m.slug),
)
console.log(`  slug/image mismatches ${missing.length}`)