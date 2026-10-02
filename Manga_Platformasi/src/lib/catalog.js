import { ALL_STATUSES, ALL_YEARS, MANGA, ALL_GENRES } from '../data/manga.js'

export const SORTS = [
  { value: 'latest', label: 'Latest chapter' },
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'views', label: 'Most viewed' },
  { value: 'chapters', label: 'Most chapters' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'year', label: 'Newest year' },
]

export const RATING_STEPS = [
  { value: 0, label: 'Any rating' },
  { value: 7, label: '7.0+' },
  { value: 7.5, label: '7.5+' },
  { value: 8, label: '8.0+' },
  { value: 8.5, label: '8.5+' },
  { value: 9, label: '9.0+' },
  { value: 9.2, label: '9.2+' },
]

const toArray = (value) => {
  if (value === undefined || value === null || value === '') return []
  return Array.isArray(value) ? value : [value]
}

export function parseFilters(query) {
  return {
    genres: toArray(query.genre).filter(Boolean),
    status: query.status ?? '',
    year: query.year ? Number(query.year) : 0,
    minRating: query.rating ? Number(query.rating) : 0,
    author: query.author ?? '',
    artist: query.artist ?? '',
    sort: query.sort ?? 'latest',
    q: query.q ?? '',
  }
}

export function serialiseFilters(filters) {
  return {
    genre: filters.genres.length ? filters.genres : undefined,
    status: filters.status || undefined,
    year: filters.year || undefined,
    rating: filters.minRating || undefined,
    author: filters.author || undefined,
    artist: filters.artist || undefined,
    sort: filters.sort !== 'latest' ? filters.sort : undefined,
  }
}

export function activeFilterCount(filters) {
  return (
    filters.genres.length +
    (filters.status ? 1 : 0) +
    (filters.year ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.author ? 1 : 0) +
    (filters.artist ? 1 : 0)
  )
}

const SORTERS = {
  latest: (a, b) => new Date(b.latestUpdate) - new Date(a.latestUpdate) || b.rating - a.rating,
  popular: (a, b) => b.views - a.views,
  rating: (a, b) => b.rating - a.rating || b.views - a.views,
  views: (a, b) => b.views - a.views,
  chapters: (a, b) => b.chapterCount - a.chapterCount,
  title: (a, b) => a.title.localeCompare(b.title),
  year: (a, b) => b.year - a.year || b.rating - a.rating,
}

export function applyFilters(list, filters, options = {}) {
  const { textQuery = '' } = options
  const authorTerm = filters.author.toLowerCase()

  const filtered = list.filter((manga) => {
    if (filters.genres.length && !filters.genres.every((g) => manga.genres.includes(g))) return false
    if (filters.status && manga.status !== filters.status) return false
    if (filters.year && manga.year !== filters.year) return false
    if (filters.minRating && manga.rating < filters.minRating) return false
    if (authorTerm && !manga.author.toLowerCase().includes(authorTerm)) return false
    if (filters.artist && !manga.artist.toLowerCase().includes(filters.artist.toLowerCase()))
      return false
    if (textQuery) {
      const term = textQuery.toLowerCase()
      const hit =
        manga.title.toLowerCase().includes(term) ||
        manga.author.toLowerCase().includes(term) ||
        manga.genres.some((g) => g.toLowerCase().includes(term)) ||
        manga.alternativeTitles.some((t) => t.toLowerCase().includes(term))
      if (!hit) return false
    }
    return true
  })

  const sorter = SORTERS[filters.sort] ?? SORTERS.latest
  return filtered.sort(sorter)
}

export function paginate(list, page, perPage) {
  const total = list.length
  const pages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(Math.max(1, page), pages)
  const start = (current - 1) * perPage
  return {
    total,
    pages,
    page: current,
    perPage,
    items: list.slice(start, start + perPage),
    from: total ? start + 1 : 0,
    to: Math.min(start + perPage, total),
  }
}

export const popularManga = () =>
  [...MANGA].sort((a, b) => b.views - a.views).map((m) => m.id)

export const latestManga = (limit = Infinity) =>
  [...MANGA]
    .sort((a, b) => new Date(b.latestUpdate) - new Date(a.latestUpdate))
    .slice(0, limit)

export const trendingManga = (limit) =>
  [...MANGA].sort((a, b) => b.trending - a.trending).slice(0, limit)

export const topRatedManga = (limit) =>
  [...MANGA].sort((a, b) => b.rating - a.rating || b.scoreCount - a.scoreCount).slice(0, limit)

export const newThisYear = (limit) =>
  [...MANGA]
    .filter((m) => m.year >= new Date().getUTCFullYear() - 1)
    .sort((a, b) => b.year - a.year || b.rating - a.rating)
    .slice(0, limit)

export const editorPicks = (limit) =>
  [...MANGA].sort((a, b) => (b.rating * b.scoreCount) / 1e6 - (a.rating * a.scoreCount) / 1e6).slice(0, limit)

export const byGenre = (genre, limit = Infinity) => {
  const list = MANGA.filter((m) => m.genres.includes(genre)).sort((a, b) => b.views - a.views)
  return typeof limit === 'number' ? list.slice(0, limit) : list
}

export const genreSlugs = () =>
  ALL_GENRES.map((genre) => ({
    ...genre,
    slug: slugify(genre.name),
    top: byGenre(genre.name, 1)[0] ?? null,
  }))

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const genreFromSlug = (slug) => ALL_GENRES.find((genre) => slugify(genre.name) === slug) ?? null

export { ALL_STATUSES, ALL_YEARS, ALL_GENRES }