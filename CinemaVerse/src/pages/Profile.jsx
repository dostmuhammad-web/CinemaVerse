import { useMemo, useState } from 'react'
import { Link } from '../lib/router.jsx'
import { useLibrary } from '../lib/library.jsx'
import { GENRES, MOVIES } from '../lib/catalog.js'
import MovieGrid from '../components/MovieGrid.jsx'
import { Icon } from '../components/Icons.jsx'
import { formatCount, formatDuration, formatRating } from '../lib/format.js'

const joined = (value) =>
  Number.isFinite(value) ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

/** Profile: name, favourite genres, display preferences and local data control. */
export default function Profile() {
  const {
    profile,
    stats,
    suggestions,
    watched,
    historyMovies,
    updateProfile,
    toggleFavouriteGenre,
    resetProfile,
    resetEverything,
  } = useLibrary()

  const [name, setName] = useState(profile.displayName)
  const [tagline, setTagline] = useState(profile.tagline)
  const [confirmReset, setConfirmReset] = useState(false)

  const dirty = name !== profile.displayName || tagline !== profile.tagline

  const favouriteFilms = useMemo(() => {
    if (!profile.favouriteGenres.length) return []
    const wanted = new Set(profile.favouriteGenres)
    return watched
      .filter((movie) => movie.genres.some((genre) => wanted.has(genre)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
  }, [profile.favouriteGenres, watched])

  const initials = profile.displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'CV'

  return (
    <div className="profile">
      <header className="profile__hero">
        <div className="page profile__hero-inner">
          <span className="profile__avatar">{initials}</span>
          <div>
            <p className="page-head__eyebrow">Your profile</p>
            <h1 className="page-head__title">{profile.displayName}</h1>
            <p className="page-head__description">
              {profile.tagline} · member since {joined(profile.joinedAt)}
            </p>
          </div>
        </div>
      </header>

      <div className="page profile__grid">
        <section className="card card--panel">
          <h2>Details</h2>
          <p className="fineprint">Stored in this browser only — nothing is uploaded anywhere.</p>

          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault()
              updateProfile({ displayName: name.trim() || 'Guest Curator', tagline: tagline.trim() || 'Browsing the full catalogue' })
            }}
          >
            <label className="field">
              <span>Display name</span>
              <input value={name} maxLength={40} onChange={(event) => setName(event.target.value)} />
            </label>

            <label className="field">
              <span>Tagline</span>
              <input value={tagline} maxLength={80} onChange={(event) => setTagline(event.target.value)} />
            </label>

            <div className="form__actions">
              <button type="submit" className="btn btn--primary" disabled={!dirty}>
                <Icon name="check" size={18} />
                Save details
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={!dirty}
                onClick={() => {
                  setName(profile.displayName)
                  setTagline(profile.tagline)
                }}
              >
                <Icon name="reset" size={16} />
                Undo
              </button>
            </div>
          </form>
        </section>

        <section className="card card--panel">
          <h2>Favourite genres</h2>
          <p className="fineprint">Pick up to a few — they shape your suggestions.</p>
          <div className="chips chips--wrap">
            {GENRES.map((genre) => {
              const active = profile.favouriteGenres.includes(genre.value)
              return (
                <button
                  key={genre.value}
                  type="button"
                  className={`pill ${active ? 'is-active' : ''}`.trim()}
                  onClick={() => toggleFavouriteGenre(genre.value)}
                  aria-pressed={active}
                >
                  {active ? <Icon name="check" size={13} /> : null}
                  {genre.value}
                  <span className="pill__count">{genre.count}</span>
                </button>
              )
            })}
          </div>

          {suggestions.length ? (
            <p className="fineprint fineprint--pad">
              Not covered yet: {suggestions.join(', ')}.
            </p>
          ) : null}
        </section>

        <section className="card card--panel">
          <h2>Library stats</h2>
          <dl className="statbox__list">
            <div>
              <dt>Watchlist</dt>
              <dd>{formatCount(stats.watchlist)}</dd>
            </div>
            <div>
              <dt>History</dt>
              <dd>{formatCount(stats.historyCount)}</dd>
            </div>
            <div>
              <dt>Saved runtime</dt>
              <dd>{formatDuration(stats.watchedRuntime)}</dd>
            </div>
            <div>
              <dt>Average score</dt>
              <dd>{stats.watchlist ? formatRating(stats.averageRating) : '—'}</dd>
            </div>
            <div>
              <dt>Genres covered</dt>
              <dd>
                {stats.genreCoverage} of {GENRES.length}
              </dd>
            </div>
            <div>
              <dt>Catalogue size</dt>
              <dd>{formatCount(MOVIES.length)}</dd>
            </div>
          </dl>
        </section>

        <section className="card card--panel">
          <h2>Display</h2>
          <p className="fineprint">Applied instantly across the whole app.</p>

          <label className="switch">
            <input
              type="checkbox"
              checked={profile.compactPosters}
              onChange={(event) => updateProfile({ compactPosters: event.target.checked })}
            />
            <span className="switch__track" aria-hidden="true">
              <span className="switch__dot" />
            </span>
            <span className="switch__text">
              <strong>Compact posters</strong>
              <small>Smaller cards, more films per screen</small>
            </span>
          </label>

          <label className="switch">
            <input
              type="checkbox"
              checked={profile.reduceMotion}
              onChange={(event) => updateProfile({ reduceMotion: event.target.checked })}
            />
            <span className="switch__track" aria-hidden="true">
              <span className="switch__dot" />
            </span>
            <span className="switch__text">
              <strong>Reduce motion</strong>
              <small>No sliding shelves or fades</small>
            </span>
          </label>
        </section>

        <section className="card card--panel card--panel--wide">
          <h2>Local data</h2>
          <p className="fineprint">
            Everything on this page lives in your browser’s local storage under the <code>cinemaverse:</code> prefix.
            Clearing it removes your watchlist, history and preferences — the catalogue itself is unaffected.
          </p>
          <div className="form__actions">
            <button type="button" className="btn btn--outline" onClick={resetProfile}>
              <Icon name="reset" size={16} />
              Reset profile
            </button>

            {confirmReset ? (
              <span className="confirm">
                <span>Delete {watched.length} saved and {historyMovies.length} history entries?</span>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    resetEverything()
                    setConfirmReset(false)
                  }}
                >
                  <Icon name="trash" size={16} />
                  Delete everything
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </button>
              </span>
            ) : (
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(true)}>
                <Icon name="trash" size={16} />
                Delete all local data
              </button>
            )}
          </div>
        </section>
      </div>

      {favouriteFilms.length ? (
        <section className="page profile__favourites">
          <h2>Your favourites, by genre</h2>
          <MovieGrid movies={favouriteFilms} />
          <Link className="linklike" to="/watchlist">
            Open your watchlist
            <Icon name="arrowRight" size={15} />
          </Link>
        </section>
      ) : null}
    </div>
  )
}
