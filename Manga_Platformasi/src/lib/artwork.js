import { MANGA_BY_ID, bannerFor, coverFor } from '../data/manga.js'

/**
 * Single source of truth for artwork resolution.
 *
 *   mangaId -> cover: /media/covers/{id}.svg
 *   mangaId -> banner: /media/banners/{id}.svg
 *
 * A path can only ever be produced from the manga's own id, and `null` is
 * returned for unknown ids so a title can never display another title's art.
 */
export function artworkFor(id, variant = 'cover') {
  if (!id || !MANGA_BY_ID[id]) return null
  return variant === 'banner' ? bannerFor(id) : coverFor(id)
}

export function initialsOf(title = '') {
  return (
    title
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0] ?? '')
      .join('')
      .toUpperCase() || '—'
  )
}