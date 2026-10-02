import { useEffect } from 'react'
import { Link, useScrollLock } from '../lib/router.jsx'
import { Icon } from './Icons.jsx'
import { formatDuration, formatRating, ratingTier } from '../lib/format.js'
import SmartImage from './SmartImage.jsx'

/**
 * Trailer panel.
 *
 * This is a catalogue, not a streaming service: no film media is fetched,
 * decoded or played anywhere in the app. The panel presents the trailer
 * reference the catalogue holds for the film, so the data is visible without
 * pretending there is a video behind it.
 */
export default function TrailerModal({ movie, open, onClose }) {
  useScrollLock(open)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!movie || !open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${movie.title} trailer`} onClick={onClose}>
      <div className="modal__backdrop" aria-hidden="true" />
      <div className="modal__panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close trailer">
          <Icon name="close" size={20} />
        </button>

        <div className="modal__stage">
          <SmartImage src={movie.backdrop} alt={`${movie.title} still`} ratio="16 / 9" width={1280} />
          <span className="modal__stage-overlay" aria-hidden="true" />
          <div className="modal__notice">
            <Icon name="info" size={18} />
            <p>
              <strong>Catalogue entry — no playback.</strong>
              CinemaVerse is a film catalogue project. Titles, credits and synopses
              are fictional reference data and no stream or file is loaded.
            </p>
          </div>
        </div>

        <div className="modal__meta">
          <div>
            <p className="modal__eyebrow">Trailer reference</p>
            <h2 className="modal__title">{movie.title}</h2>
            <p className="modal__sub">
              {movie.originalTitle} · {movie.year} · {formatDuration(movie.duration)} ·{' '}
              {movie.country}
            </p>
          </div>
          <span className={`chip chip--rating chip--${ratingTier(movie.rating)}`}>
            <Icon name="star" size={13} />
            {formatRating(movie.rating)}
          </span>
        </div>

        <dl className="modal__grid">
          <div>
            <dt>Director</dt>
            <dd>{movie.director}</dd>
          </div>
          <div>
            <dt>Genres</dt>
            <dd>{movie.genres.join(', ')}</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>{movie.language}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{movie.status}</dd>
          </div>
        </dl>

        <p className="modal__url">
          <Icon name="globe" size={14} />
          <span>Registered trailer reference</span>
          <code>{movie.trailer}</code>
        </p>

        <div className="modal__actions">
          <Link className="btn btn--primary" to={`/movie/${movie.slug}`} onClick={onClose}>
            <Icon name="eye" size={18} />
            Open film page
          </Link>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}