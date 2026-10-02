import { useCallback, useDeferredValue, useMemo } from 'react'
import { Link, useDebounced, useRouter } from '../lib/router.jsx'
import { searchMovies } from '../lib/search.js'
import { GENRES, MOVIES, TOP_RATED, TRENDING } from '../lib/catalog.js'
import MovieGrid from '../components/MovieGrid.jsx'
import { Icon } from '../components/Icons.jsx'
import { EmptyState } from '../components/States.jsx'
import { formatCount } from '../lib/format.js'

const PAGE = 24
const SUGGESTED_TERMS = ['noir', 'space', 'heist', 'revenge', 'island', 'dream', 'war', 'rivalry']

/** Genres and countries present in a result set, biggest first. */
function tally(movies) {
  const genres = new Map()
  const countries = new Map()
  movies.forEach((movie) => {
    movie.genres.forEach((genre) => genres.set(genre, (genres.get(genre) ?? 0) + 1))
    countries.set(movie.country, (countries.get(movie.country) ?? 0) + 1)
  })
  const rank = (map, limit) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
  return { genres: rank(genres, 8), countries: rank(countries, 8) }
}

/**
 * Search across the whole catalogue: titles, original titles, synopses,
 * keywords, directors, cast, genres, countries and languages. The index is
 * built once on the first keystroke, the term is debounced and deferred, so
 * typing stays responsive across 1,040 films.
 */
export default function Search() {
  const { query, setQuery } = useRouter()
  const term = query.q ?? ''
  const debounced = useDebounced(term.trim(), 180)
  const deferred = useDeferredValue(debounced)

  const results = useMemo(() => {
    if (deferred.length < 2) return null
    return searchMovies(deferred)
  }, [deferred])

  const hits = useMemo(() => (results ? results.slice(0, PAGE) : []), [results])
  const counts = useMemo(() => (results ? tally(results) : null), [results])
  const searching = deferred.length >= 2

  const submit = useCallback(
    (value) => {
      const next = String(value ?? '').trim()
      setQuery(next ? { q: next } : {})
    },
    [setQuery],
  )

  return (
    <div className="searchpage">
      <header className="searchpage__head">
        <div className="page page--narrow">
          <p className="page-head__eyebrow">Search</p>
          <h1 className="page-head__title">Find anything in the catalogue</h1>
          <p className="page-head__description">
            {formatCount(MOVIES.length)} films indexed by title, original title, synopsis, keywords, director, cast,
            genre, country and language.
          </p>

          <form
            className="bigsearch"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
            role="search"
          >
            <Icon name="search" size={20} className="bigsearch__icon" />
            <input
              type="search"
              value={term}
              placeholder="Try a title, a director, “heist”, “Japan”, a cast name…"
              aria-label="Search the catalogue"
              onChange={(event) => setQuery(event.target.value ? { q: event.target.value } : {})}
            />
            {term ? (
              <button
                type="button"
                className="bigsearch__clear"
                onClick={() => setQuery({})}
                aria-label="Clear search"
              >
                <Icon name="close" size={16} />
              </button>
            ) : null}
            <button type="submit" className="btn btn--primary bigsearch__go">
              Search
            </button>
          </form>

          <div className="chips chips--wrap searchpage__suggest">
            <span className="chips__label">
              <Icon name="sparkle" size={15} />
              Popular searches
            </span>
            {SUGGESTED_TERMS.map((suggestion) => (
              <button key={suggestion} type="button" className="pill" onClick={() => submit(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="page searchpage__body">
        {!searching ? (
          <>
            <EmptyState
              icon="search"
              title="Type at least two characters"
              body="Results appear as you type — no submit needed. You can also browse by genre or country."
              action={
                <div className="chips chips--wrap">
                  <Link className="pill" to="/movies">
                    All films
                  </Link>
                  <Link className="pill" to="/genres">
                    Genres
                  </Link>
                  <Link className="pill" to="/countries">
                    Countries
                  </Link>
                </div>
              }
            />
            <section className="searchpage__fallback">
              <h2>Popular right now</h2>
              <MovieGrid movies={TRENDING.slice(0, 4)} priorityCount={4} />
            </section>
          </>
        ) : results && results.length ? (
          <>
            <div className="searchpage__summary">
              <h2>
                {formatCount(results.length)} {results.length === 1 ? 'match' : 'matches'} for “{deferred}”
              </h2>
              <p>
                {hits.length < results.length ? `Showing the first ${hits.length}. ` : ''}
                Open a film to see its full page.
              </p>
            </div>

            <MovieGrid movies={hits} priorityCount={6} />

            {counts ? (
              <div className="searchpage__facets">
                <div className="searchpage__facet">
                  <h3>Genres in these results</h3>
                  <div className="chips chips--wrap">
                    {counts.genres.map(([genre, count]) => (
                      <Link key={genre} to={`/movies?genres=${encodeURIComponent(genre)}`} className="pill">
                        {genre}
                        <span className="pill__count">{count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="searchpage__facet">
                  <h3>Countries in these results</h3>
                  <div className="chips chips--wrap">
                    {counts.countries.map(([country, count]) => (
                      <Link key={country} to={`/country/${encodeURIComponent(country)}`} className="pill">
                        {country}
                        <span className="pill__count">{count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState
            icon="search"
            title={`Nothing matches “${deferred}”`}
            body="Try a shorter term, a different spelling, or browse the catalogue by genre instead."
            action={
              <div className="chips chips--wrap">
                {GENRES.slice(0, 6).map((genre) => (
                  <Link key={genre.value} to={`/genre/${encodeURIComponent(genre.value)}`} className="pill">
                    {genre.value}
                  </Link>
                ))}
              </div>
            }
          />
        )}
      </div>

      <section className="page searchpage__fallback">
        <h2>Top rated entries</h2>
        <MovieGrid movies={TOP_RATED.slice(0, 8)} />
      </section>
    </div>
  )
}
