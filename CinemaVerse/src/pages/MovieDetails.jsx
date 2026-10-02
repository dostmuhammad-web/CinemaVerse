import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from '../lib/router.jsx'
import { MOVIES, getMovie, moviesInGenre, relatedMovies } from '../lib/catalog.js'
import { useLibrary } from '../lib/library.jsx'
import Rail from '../components/Rail.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import TrailerModal from '../components/TrailerModal.jsx'
import SmartImage from '../components/SmartImage.jsx'
import { Icon } from '../components/Icons.jsx'
import { EmptyState } from '../components/States.jsx'
import { formatCount, formatDuration, formatVotes, formatYear, statusClass } from '../lib/format.js'

const SECTIONS = ['Overview', 'Cast & crew', 'Details']

/** Full detail page for one film, plus its related rail. */
export default function MovieDetails() {
  const { slug = '' } = useParams('/movie/:slug')
  const movie = useMemo(() => getMovie(slug), [slug])
  const { isWatchlisted, toggleWatchlist, recordVisit, watched } = useLibrary()
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [section, setSection] = useState('Overview')

  /* Opening another film resets the tabs during render, not in an effect. */
  const [shownSlug, setShownSlug] = useState(slug)
  if (shownSlug !== slug) {
    setShownSlug(slug)
    setSection('Overview')
    setTrailerOpen(false)
  }

  useEffect(() => {
    if (movie) recordVisit(movie)
  }, [movie, recordVisit])

  const sameDirector = useMemo(
    () => (movie ? MOVIES.filter((entry) => entry.director === movie.director && entry.id !== movie.id) : []),
    [movie],
  )

  const neighbours = useMemo(
    () => (movie ? moviesInGenre(movie.genres[0]).filter((entry) => entry.id !== movie.id).slice(0, 12) : []),
    [movie],
  )

  const related = useMemo(() => (movie ? relatedMovies(movie, 18) : []), [movie])
  const inWatchlist = movie ? isWatchlisted(movie) : false
  const savedCount = movie ? watched.filter((entry) => entry.genres.some((genre) => movie.genres.includes(genre))).length : 0

  if (!movie) {
    return (
      <div className="page page--narrow">
        <EmptyState
          icon="search"
          title="That film is not in the catalogue"
          body={`No entry matches the address “${slug}”. It may have been renamed, or the link may be wrong.`}
          action={
            <div className="btnrow">
              <Link className="btn btn--primary" to="/movies">
                <Icon name="grid" size={18} />
                Browse all films
              </Link>
              <Link className="btn btn--outline" to="/search">
                <Icon name="search" size={18} />
                Search instead
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  const score = Math.round(movie.rating * 10)

  return (
    <article className="detail">
      <div className="detail__hero">
        <SmartImage src={movie.backdrop} alt="" ratio="16 / 9" priority className="detail__backdrop" />
        <div className="detail__scrim" aria-hidden="true" />

        <div className="detail__head page">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/movies">Films</Link>
            <Icon name="chevronRight" size={14} />
            <Link to={`/genre/${encodeURIComponent(movie.genres[0])}`}>{movie.genres[0]}</Link>
            <Icon name="chevronRight" size={14} />
            <span aria-current="page">{movie.title}</span>
          </nav>

          <div className="detail__intro">
            <div className="detail__poster">
              <SmartImage src={movie.poster} alt={`${movie.title} poster`} ratio="2 / 3" priority width={420} />
              <div className="detail__score" title={`${movie.rating.toFixed(1)} out of 10`}>
                <svg viewBox="0 0 36 36" aria-hidden="true">
                  <circle className="detail__score-track" cx="18" cy="18" r="15.5" />
                  <circle
                    className="detail__score-fill"
                    cx="18"
                    cy="18"
                    r="15.5"
                    style={{ strokeDashoffset: 97.4 - (97.4 * score) / 100 }}
                  />
                </svg>
                <strong>{movie.rating.toFixed(1)}</strong>
              </div>
            </div>

            <div className="detail__body">
              <div className="detail__badges">
                <span className={`chip chip--${statusClass(movie.status)}`}>{movie.status}</span>
                <span className="chip chip--year">{movie.year}</span>
                {movie.rating >= 8 ? <span className="chip chip--hot">Top rated</span> : null}
                {movie.trendingScore >= 70 ? <span className="chip chip--trend">Trending</span> : null}
              </div>

              <h1 className="detail__title">{movie.title}</h1>
              {movie.originalTitle !== movie.title ? <p className="detail__original">{movie.originalTitle}</p> : null}
              {movie.tagline ? <p className="detail__tagline">“{movie.tagline}”</p> : null}

              <ul className="detail__facts">
                <li>
                  <span>Director</span>
                  <strong>{movie.director}</strong>
                </li>
                <li>
                  <span>Runtime</span>
                  <strong>{formatDuration(movie.duration)}</strong>
                </li>
                <li>
                  <span>Country</span>
                  <strong>
                    <Link to={`/country/${encodeURIComponent(movie.country)}`}>{movie.country}</Link>
                  </strong>
                </li>
                <li>
                  <span>Language</span>
                  <strong>
                    <Link to={`/movies?languages=${encodeURIComponent(movie.language)}`}>{movie.language}</Link>
                  </strong>
                </li>
                <li>
                  <span>Votes</span>
                  <strong>{formatVotes(movie.votes)}</strong>
                </li>
                <li>
                  <span>Popularity</span>
                  <strong>{formatCount(movie.popularity)}</strong>
                </li>
              </ul>

              <div className="detail__genres">
                {movie.genres.map((genre) => (
                  <Link key={genre} to={`/genre/${encodeURIComponent(genre)}`} className="pill">
                    {genre}
                  </Link>
                ))}
              </div>

              <div className="detail__actions">
                <button
                  type="button"
                  className={`btn ${inWatchlist ? 'btn--outline' : 'btn--primary'}`}
                  onClick={() => toggleWatchlist(movie)}
                  aria-pressed={inWatchlist}
                >
                  <Icon name={inWatchlist ? 'check' : 'bookmark'} size={18} />
                  {inWatchlist ? 'In watchlist' : 'Add to watchlist'}
                </button>

                <button type="button" className="btn btn--outline" onClick={() => setTrailerOpen(true)}>
                  <Icon name="play" size={18} />
                  Trailer info
                </button>

                <Link className="btn btn--ghost" to={`/search?q=${encodeURIComponent(movie.director)}`}>
                  <Icon name="user" size={18} />
                  More by {movie.director.split(' ').slice(-1)[0]}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail__tabs page" role="tablist" aria-label="Film sections">
        {SECTIONS.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={section === name}
            className={`detail__tab ${section === name ? 'is-active' : ''}`.trim()}
            onClick={() => setSection(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="detail__content page">
        {section === 'Overview' ? (
          <div className="detail__overview">
            <div>
              <h2>Storyline</h2>
              <p className="detail__synopsis">{movie.description}</p>
              <div className="detail__keywords">
                <h3>Keywords</h3>
                <div className="chips chips--wrap">
                  {movie.keywords.split(' ').map((keyword) => (
                    <Link key={keyword} to={`/search?q=${encodeURIComponent(keyword)}`} className="pill pill--quiet">
                      {keyword}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <aside className="detail__aside">
              <div className="statbox">
                <h3>Catalogue position</h3>
                <dl>
                  <div>
                    <dt>Rating</dt>
                    <dd>{movie.rating.toFixed(1)} / 10</dd>
                  </div>
                  <div>
                    <dt>Votes</dt>
                    <dd>{formatVotes(movie.votes)}</dd>
                  </div>
                  <div>
                    <dt>Trending score</dt>
                    <dd>{Math.round(movie.trendingScore)}</dd>
                  </div>
                  <div>
                    <dt>Released</dt>
                    <dd>{formatYear(movie.year)}</dd>
                  </div>
                </dl>
              </div>
              <p className="detail__note">
                <Icon name="info" size={15} />
                {savedCount > 0
                  ? `${savedCount} ${savedCount === 1 ? 'film in your watchlist shares' : 'films in your watchlist share'} a genre with this one.`
                  : 'Nothing in your watchlist shares a genre with this film yet.'}
              </p>
              <p className="detail__note detail__note--muted">
                <Icon name="info" size={15} />
                Catalogue entry only — no streaming or download is available.
              </p>
            </aside>
          </div>
        ) : null}

        {section === 'Cast & crew' ? (
          <div className="detail__people">
            <div className="person">
              <span className="person__badge person__badge--director">
                <Icon name="film" size={20} />
              </span>
              <div>
                <h3>{movie.director}</h3>
                <p>Director</p>
                <Link className="linklike" to={`/search?q=${encodeURIComponent(movie.director)}`}>
                  Filmography in this catalogue
                  <Icon name="arrowRight" size={15} />
                </Link>
              </div>
            </div>

            <ul className="cast">
              {movie.cast.map((person, index) => (
                <li key={person}>
                  <span className="cast__index">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{person}</h3>
                    <p>
                      {index === 0 ? 'Lead' : index === 1 ? 'Co-lead' : 'Supporting'}
                    </p>
                  </div>
                  <Link className="pill pill--quiet" to={`/search?q=${encodeURIComponent(person)}`}>
                    Search
                  </Link>
                </li>
              ))}
            </ul>

            {sameDirector.length ? (
              <div className="detail__same">
                <h3>Also directed by {movie.director}</h3>
                <MovieGrid movies={sameDirector.slice(0, 6)} />
              </div>
            ) : null}
          </div>
        ) : null}

        {section === 'Details' ? (
          <dl className="spec">
            {[
              ['Title', movie.title],
              ['Original title', movie.originalTitle],
              ['Tagline', movie.tagline],
              ['Year', String(movie.year)],
              ['Release status', movie.status],
              ['Runtime', formatDuration(movie.duration)],
              ['Rating', `${movie.rating.toFixed(1)} / 10 from ${formatVotes(movie.votes)} votes`],
              ['Country', movie.country],
              ['Language', movie.language],
              ['Genres', movie.genres.join(', ')],
              ['Director', movie.director],
              ['Cast', movie.cast.join(', ')],
              ['Keywords', movie.keywords],
              ['Poster file', movie.poster],
              ['Backdrop file', movie.backdrop],
              ['Trailer reference', movie.trailer],
            ].map(([term, value]) => (
              <div className="spec__row" key={term}>
                <dt>{term}</dt>
                <dd>{value || '—'}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {neighbours.length ? (
        <Rail
          title={`More ${movie.genres[0]}`}
          subtitle={`${formatCount(moviesInGenre(movie.genres[0]).length)} films tagged ${movie.genres[0]}`}
          to={`/genre/${encodeURIComponent(movie.genres[0])}`}
          movies={neighbours}
        />
      ) : null}

      {related.length ? (
        <Rail
          title="Related films"
          subtitle="Same director, cast, country or genre"
          to={`/movies?genres=${encodeURIComponent(movie.genres[0])}&sort=rating`}
          movies={related}
        />
      ) : null}

      <TrailerModal movie={movie} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </article>
  )
}
