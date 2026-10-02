import { useState } from 'react'
import { MANGA_BY_ID } from '../data/manga.js'
import { artworkFor, initialsOf } from '../lib/artwork.js'

export default function MangaImage({
  manga,
  variant = 'cover',
  className = '',
  imgClassName = '',
  width,
  height,
  priority = false,
  alt,
  children,
}) {
  const id = typeof manga === 'string' ? manga : manga?.id
  const src = artworkFor(id, variant)
  const title = typeof manga === 'string' ? MANGA_BY_ID[id]?.title ?? '' : manga?.title ?? ''

  const [state, setState] = useState({ src, loaded: false, failed: false })

  /* reset when the artwork source changes (render-phase update, no effect) */
  if (state.src !== src) setState({ src, loaded: false, failed: false })

  const label = alt ?? `${title} ${variant}`
  const broken = !src || state.failed

  return (
    <div
      className={`mimg mimg--${variant} ${state.loaded ? 'is-loaded' : ''} ${
        broken ? 'is-failed' : ''
      } ${className}`}
      data-manga-id={id ?? 'none'}
      data-variant={variant}
    >
      {broken ? (
        <div className="mimg__fallback" role="img" aria-label={label}>
          <span>{initialsOf(title)}</span>
          <small>{title}</small>
        </div>
      ) : (
        <img
          className={`mimg__el ${imgClassName}`}
          src={src}
          alt={label}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
          onLoad={() => setState((s) => (s.loaded ? s : { ...s, loaded: true }))}
          onError={() => setState((s) => (s.failed ? s : { ...s, failed: true }))}
        />
      )}
      <span className="mimg__veil" />
      {children}
    </div>
  )
}