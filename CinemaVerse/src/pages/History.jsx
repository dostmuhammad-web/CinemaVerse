import { useMemo, useState } from 'react'
import { Link } from '../lib/router.jsx'
import { useLibrary } from '../lib/library.jsx'
import SmartImage from '../components/SmartImage.jsx'
import { Icon } from '../components/Icons.jsx'
import { EmptyState } from '../components/States.jsx'
import { formatCount, formatDuration, formatRating, joinList, plural } from '../lib/format.js'

const relative = (timestamp) => {
  if (!timestamp) return '—'
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Recently opened films, most recent first, with per-entry removal. */
export default function History() {
  const { historyMovies, removeFromHistory, clearHistory, isWatchlisted, toggleWatchlist } = useLibrary()
  const [confirmClear, setConfirmClear] = useState(false)

  const totals = useMemo(() => {
    const runtime = historyMovies.reduce((sum, movie) => sum + movie.duration, 0)
    const genreTally = new Map()
    historyMovies.forEach((movie) => movie.genres.forEach((genre) => genreTally.set(genre, (genreTally.get(genre) ?? 0) + 1)))
    const genres = [...genreTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { runtime, genres }
  }, [historyMovies])

  if (!historyMovies.length) {
    return (
      <div className="page">
        <EmptyState
          icon="history"
          title="No films opened yet"
          body="Every film page you visit is listed here, newest first, so you can pick up where you left off."
          action={
            <Link className="btn btn--primary" to="/movies">
              <Icon name="grid" size={18} />
              Find something to open
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="history">
      <header className="page-head">
        <div className="page-head__inner page">
          <p className="page-head__eyebrow">Your library</p>
          <h1 className="page-head__title">Viewing history</h1>
          <p className="page-head__description">
            {plural(historyMovies.length, 'film')} opened · {formatDuration(totals.runtime)} of runtime
            {totals.genres.length ? ` · mostly ${joinList(totals.genres.map(([genre]) => genre), 2)}` : ''}.
          </p>
          <div className="page-head__tools">
            {confirmClear ? (
              <span className="confirm">
                <span>Clear all history?</span>
                <button type="button" className="btn btn--ghost" onClick={clearHistory}>
                  <Icon name="trash" size={16} />
                  Yes, clear
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setConfirmClear(false)}>
                  Keep
                </button>
              </span>
            ) : (
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmClear(true)}>
                <Icon name="trash" size={16} />
                Clear history
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="page history__body">
        <ol className="timeline">
          {historyMovies.map((movie) => (
            <li className="timeline__row" key={movie.id}>
              <span className="timeline__when">{relative(movie.visitedAt)}</span>

              <Link to={`/movie/${movie.slug}`} className="timeline__main">
                <SmartImage src={movie.poster} alt="" ratio="2 / 3" width={120} className="timeline__poster" />
                <span className="timeline__text">
                  <span className="timeline__title">{movie.title}</span>
                  <span className="timeline__meta">
                    {movie.year} · {formatRating(movie.rating)} · {formatDuration(movie.duration)} · {movie.country}
                  </span>
                  <span className="timeline__genres">{movie.genres.join(' / ')}</span>
                </span>
              </Link>

              <span className="timeline__tools">
                <button
                  type="button"
                  className="iconlink"
                  onClick={() => toggleWatchlist(movie)}
                  aria-label={isWatchlisted(movie) ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
                  title={isWatchlisted(movie) ? 'In watchlist' : 'Add to watchlist'}
                >
                  <Icon name={isWatchlisted(movie) ? 'bookmarkFilled' : 'bookmark'} size={18} />
                </button>
                <button
                  type="button"
                  className="iconlink"
                  onClick={() => removeFromHistory(movie)}
                  aria-label={`Remove ${movie.title} from history`}
                  title="Remove from history"
                >
                  <Icon name="close" size={18} />
                </button>
              </span>
            </li>
          ))}
        </ol>

        {totals.genres.length ? (
          <section className="history__summary">
            <div className="statbox statbox--row">
              <h3>Genres you open most</h3>
              <div className="chips chips--wrap">
                {totals.genres.map(([genre, count]) => (
                  <Link key={genre} to={`/genre/${encodeURIComponent(genre)}`} className="pill">
                    {genre}
                    <span className="pill__count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="statbox statbox--row">
              <h3>Runtime so far</h3>
              <p>
                <strong>{formatDuration(totals.runtime)}</strong> across {formatCount(historyMovies.length)} films.
              </p>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
