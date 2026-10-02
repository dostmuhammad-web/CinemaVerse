import { MANGA } from '../data/manga.js'

const normalise = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .trim()

export const SUGGESTION_POOL = MANGA.flatMap((manga) => [
  manga.title,
  ...manga.alternativeTitles,
  manga.author,
  ...manga.genres,
]).filter((value, index, all) => value && all.indexOf(value) === index)

const INDEX = new Map()
MANGA.forEach((manga) => {
  const record = {
    manga,
    title: normalise(manga.title),
    alternatives: manga.alternativeTitles.map(normalise),
    author: normalise(manga.author),
    artist: normalise(manga.artist),
    genres: manga.genres.map(normalise),
    status: normalise(manga.status),
    year: String(manga.year),
    description: normalise(manga.description),
  }
  INDEX.set(manga.id, record)
})

export const SUGGESTIONS = SUGGESTION_POOL.map(normalise).sort()

export function scoreRecord(record, term) {
  let score = 0
  const matched = []

  if (record.title === term) {
    score += 120
    matched.push('title')
  } else if (record.title.startsWith(term)) {
    score += 90
    matched.push('title')
  } else if (record.title.includes(term)) {
    score += 68
    matched.push('title')
  }

  record.alternatives.forEach((alt) => {
    if (alt === term) {
      score += 105
      matched.push('title')
    } else if (alt.includes(term)) {
      score += 58
      matched.push('title')
    }
  })

  if (record.author.includes(term)) {
    score += 42
    matched.push('author')
  }
  if (record.artist.includes(term)) {
    score += 36
    matched.push('artist')
  }
  if (record.genres.some((genre) => genre.includes(term))) {
    score += 30
    matched.push('genre')
  }
  if (record.status.includes(term)) {
    score += 22
    matched.push('status')
  }
  if (record.year.includes(term)) {
    score += 18
    matched.push('year')
  }
  if (record.description.includes(term)) {
    score += 8
    matched.push('description')
  }

  score += record.manga.rating * 2
  score += Math.log10(record.manga.views) * 4

  return { score, matched: [...new Set(matched)] }
}

export function searchManga(rawQuery, { limit = Infinity } = {}) {
  const term = normalise(rawQuery)
  if (term.length < 1) return []

  const words = term.split(/\s+/).filter(Boolean)
  const results = []

  MANGA.forEach((manga) => {
    const record = INDEX.get(manga.id)
    let total = 0
    const fields = new Set()
    let matchedWords = 0

    words.forEach((word) => {
      const { score, matched } = scoreRecord(record, word)
      if (score > 0) {
        matchedWords += 1
        total += score
        matched.forEach((field) => fields.add(field))
      }
    })

    if (matchedWords === 0) return
    if (words.length > 1 && matchedWords < words.length) {
      total *= matchedWords / words.length
    }

    results.push({ manga, score: total, fields: [...fields] })
  })

  results.sort((a, b) => b.score - a.score || a.manga.title.localeCompare(b.manga.title))
  return typeof limit === 'number' ? results.slice(0, limit) : results
}

/** Suggestion dropdown: titles + alt titles + authors + genres, ranked. */
export function suggest(rawQuery, limit = 8) {
  const term = normalise(rawQuery)
  if (!term) return []

  const buckets = new Map()

  const push = (label, type, id, boost) => {
    const key = `${type}:${label}`
    if (buckets.has(key)) return
    buckets.set(key, { label, type, id, boost })
  }

  MANGA.forEach((manga) => {
    if (normalise(manga.title).startsWith(term)) push(manga.title, 'Manga', manga.id, 100)
    else if (normalise(manga.title).includes(term)) push(manga.title, 'Manga', manga.id, 70)
    manga.alternativeTitles.forEach((alt) => {
      if (normalise(alt).startsWith(term)) push(alt, 'Alt title', manga.id, 88)
      else if (normalise(alt).includes(term)) push(alt, 'Alt title', manga.id, 60)
    })
    if (normalise(manga.author).startsWith(term)) push(manga.author, 'Author', manga.id, 74)
    if (normalise(manga.artist).startsWith(term)) push(manga.artist, 'Artist', manga.id, 52)
    manga.genres.forEach((genre) => {
      if (normalise(genre).startsWith(term)) push(genre, 'Genre', genre, 64)
    })
  })

  return Array.from(buckets.values())
    .sort((a, b) => b.boost - a.boost || a.label.localeCompare(b.label))
    .slice(0, limit)
}