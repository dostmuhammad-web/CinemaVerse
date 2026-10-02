import { useMemo, useState } from 'react'
import { Link } from '../lib/router.jsx'
import { useLibrary } from '../lib/library.jsx'
import { SORTS, moviesInGenre, sortMovies } from '../lib/catalog.js'
import MovieGrid from '../components/MovieGrid.jsx'
import Rail from '../components/Rail.jsx'
import { Icon } from '../components/Icons.jsx'
import { EmptyState } from '../components/States.jsx'
import { formatCount, formatDuration, formatRating } from '../lib/format.js'

const SORT_DEFAULT = 'newest'

/** The user's saved films, sorted locally and persisted in localStorage. */
export default function Watchlist() {
  const { watched, clearWatchlist, stats } = useLibrary()
  const [sort, setSort] = useState(SORT_DEFAULT)
  const [confirmClear, setConfirmClear] = useState(false)

  const sorted = useMemo(() => sortMovies(watched, sort), [watched, sort])

  const topPick = useMemo(
    () => (watched.length ? watched.slice().sort((a, b) => b.rating - a.rating)[0] : null),
    [watched],
  )

  /** Best genre you have saved, minus what is already on the list. */
  const recommendations = useMemo(() => {
    const best = stats.topGenres[0]?.genre
    if (!best) return { genre: null, movies: [] }
    const saved = new Set(watched.map((movie) => movie.id))
    const movies = moviesInGenre(best)
      .filter((movie) => !saved.has(movie.id))
      .sort((a, b) => b.rating - a.rating || b.votes - a.votes)
      .slice(0, 18)
    return { genre: best, movies }
  }, [stats.topGenres, watched])

  if (!watched.length) {
    return (
      <div className="page">
        <EmptyState
          icon="bookmark"
          title="Your watchlist is empty"
          body="Save films from any card, poster or detail page and they will be collected here — stored in this browser only."
          action={
            <div className="btnrow">
              <Link className="btn btn--primary" to="/movies">
                <Icon name="grid" size={18} />
                Browse the catalogue
              </Link>
              <Link className="btn btn--outline" to="/trending">
                <Icon name="trending" size={18} />
                See what is trending
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="saved">
      <header className="page-head">
        <div className="page-head__inner page">
          <p className="page-head__eyebrow">Your library</p>
          <h1 className="page-head__title">Watchlist</h1>
          <p className="page-head__description">
            {formatCount(stats.watchlist)} saved {stats.watchlist === 1 ? 'film' : 'films'} ·{' '}
            {formatDuration(stats.watchedRuntime)} of runtime · average score {formatRating(stats.averageRating)}. Saved
            in this browser’s local storage.
          </p>
          <div className="page-head__tools">
            <label className="select">
              <Icon name="sort" size={16} />
              <span>Sort</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                {SORTS.filter((option) => option.id !== 'relevance').map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {confirmClear ? (
              <span className="confirm">
                <span>Remove all {watched.length}?</span>
                <button type="button" className="btn btn--ghost" onClick={clearWatchlist}>
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
                Clear watchlist
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="page saved__body">
        {stats.topGenres.length ? (
          <section className="saved__summary">
            <div className="statbox statbox--row">
              <h3>Most saved genres</h3>
              <div className="chips chips--wrap">
                {stats.topGenres.map((entry) => (
                  <Link key={entry.genre} to={`/genre/${encodeURIComponent(entry.genre)}`} className="pill">
                    {entry.genre}
                    <span className="pill__count">{entry.count}</span>
                  </Link>
                ))}
              </div>
            </div>
            {topPick ? (
              <div className="statbox statbox--row">
                <h3>Highest rated in your list</h3>
                <p>
                  <Link to={`/movie/${topPick.slug}`}>
                    <strong>{topPick.title}</strong> · {formatRating(topPick.rating)}
                  </Link>
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

        <MovieGrid movies={sorted} priorityCount={8} />

        {watched.length > 6 ? (
          <p className="fineprint">
            <Icon name="info" size={15} />
            Tip: a saved film you have already opened also appears in your{' '}
            <Link to="/history">history</Link>.
          </p>
        ) : null}
      </div>

      {recommendations.length ? (
        <Rail
          title="More in the genres you saved"
          subtitle={`Films tagged ${recommendations.genre} that are not in your list yet`}
          to={`/genre/${encodeURIComponent(recommendations.genre)}`}
          movies={recommendations.movies}
        />
      ) : null}
    </div>
  )
}
