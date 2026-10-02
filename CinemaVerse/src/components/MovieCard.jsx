import { memo } from 'react'
import { Link } from '../lib/router.jsx'
import { useLibrary } from '../lib/library.jsx'
import { formatDuration, formatRating, ratingTier } from '../lib/format.js'
import SmartImage from './SmartImage.jsx'
import { Icon } from './Icons.jsx'

/**
 * Poster card used by every grid and rail in the app.
 *
 * Memoised on purpose: a page may render 24 of these and a watchlist toggle in
 * one card should not re-render the other 23.
 */
function MovieCard({ movie, rank = 0, priority = false, size = 'grid' }) {
  const { isWatchlisted, toggleWatchlist } = useLibrary()
  const saved = isWatchlisted(movie.id)

  return (
    <article className={`card card--${size}`} data-testid="movie-card">
      <Link className="card__link" to={`/movie/${movie.slug}`} aria-label={`${movie.title} (${movie.year})`}>
        <div className="card__poster">
          <SmartImage
            src={movie.poster}
            alt={`${movie.title} poster`}
            label={movie.title}
            ratio="2 / 3"
            priority={priority}
            width={size === 'compact' ? 200 : 320}
          />
          {rank > 0 ? <span className="card__rank">{rank}</span> : null}
          <span className={`chip chip--rating chip--${ratingTier(movie.rating)}`}>
            <Icon name="star" size={13} />
            {formatRating(movie.rating)}
          </span>
          <span className="card__scrim" aria-hidden="true" />
          <span className="card__hover">
            <span className="card__hover-meta">
              {movie.genres.slice(0, 2).join(' · ')} · {formatDuration(movie.duration)}
            </span>
          </span>
        </div>
        <div className="card__body">
          <h3 className="card__title" title={movie.title}>
            {movie.title}
          </h3>
          <p className="card__meta">
            <span>{movie.year}</span>
            <span className="card__dot" aria-hidden="true" />
            <span>{movie.country}</span>
          </p>
        </div>
      </Link>

      <button
        type="button"
        className={`card__save ${saved ? 'is-saved' : ''}`.trim()}
        onClick={() => toggleWatchlist(movie.id)}
        aria-pressed={saved}
        title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <Icon name={saved ? 'check' : 'plus'} size={16} />
        <span className="sr-only">{saved ? 'Remove' : 'Save'} {movie.title}</span>
      </button>
    </article>
  )
}

export default memo(MovieCard)