import { useMemo } from 'react'
import { Link } from '../lib/router.jsx'
import Hero from '../components/Hero.jsx'
import Rail from '../components/Rail.jsx'
import { Icon } from '../components/Icons.jsx'
import { useLibrary } from '../lib/library.jsx'
import {
  CATALOGUE_STATS,
  DECADES,
  GENRES,
  MOVIES,
  NEW_RELEASES,
  POPULAR,
  TOP_RATED,
  TRENDING,
  moviesInGenre,
  relatedMovies,
} from '../lib/catalog.js'
import { formatCount } from '../lib/format.js'

const FEATURED = TRENDING.slice(0, 5)
const HIGHLIGHT_GENRES = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Animation']
const SHELF_SIZE = 18

export default function Home() {
  const { watched } = useLibrary()

  const genreShelves = useMemo(
    () =>
      HIGHLIGHT_GENRES.map((genre) => ({
        genre,
        movies: moviesInGenre(genre).slice(0, SHELF_SIZE),
        total: moviesInGenre(genre).length,
      })).filter((shelf) => shelf.movies.length >= 4),
    [],
  )

  const becauseYouWatched = useMemo(() => {
    const seed = watched[0]
    if (!seed) return null
    return { seed, movies: relatedMovies(seed, SHELF_SIZE) }
  }, [watched])

  return (
    <>
      <Hero slides={FEATURED} />

      <div className="home page">
        <section className="statstrip" aria-label="Catalogue at a glance">
          {[
            { icon: 'film', value: CATALOGUE_STATS.films.toLocaleString('en-US'), label: 'films catalogued' },
            { icon: 'grid', value: String(CATALOGUE_STATS.genres), label: 'genres' },
            { icon: 'globe', value: String(CATALOGUE_STATS.countries), label: 'countries' },
            { icon: 'list', value: String(CATALOGUE_STATS.languages), label: 'languages' },
            { icon: 'calendar', value: CATALOGUE_STATS.years, label: 'release years' },
          ].map((stat) => (
            <div className="statstrip__item" key={stat.label}>
              <Icon name={stat.icon} size={18} />
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="decades" aria-label="Browse by decade">
          <h2 className="decades__title">Browse by decade</h2>
          <div className="decades__list">
            {[...DECADES].reverse().map((decade) => (
              <Link
                key={decade.value}
                to={`/movies?decades=${encodeURIComponent(decade.value)}&sort=newest`}
                className="pill pill--lg"
              >
                {decade.value}
                <span className="pill__count">{decade.count}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="home">
        <Rail
          title="Trending now"
          subtitle="What the catalogue is moving toward this week"
          to="/trending"
          movies={TRENDING.slice(0, SHELF_SIZE)}
        />
        <Rail
          title="Most popular"
          subtitle="Ranked by audience volume across all ratings"
          to="/popular"
          movies={POPULAR.slice(0, SHELF_SIZE)}
        />
        <Rail
          title="Top rated"
          subtitle="Highest scores, weighted by how many people voted"
          to="/movies?sort=rating"
          movies={TOP_RATED.slice(0, SHELF_SIZE)}
        />
        <Rail
          title="New releases"
          subtitle={`Fresh from ${NEW_RELEASES[0]?.year ?? 'this year'} back`}
          to="/new-releases"
          movies={NEW_RELEASES.slice(0, SHELF_SIZE)}
        />

        {becauseYouWatched ? (
          <Rail
            title={`More like ${becauseYouWatched.seed.title}`}
            subtitle={`Because it is in your watchlist · directed by ${becauseYouWatched.seed.director}`}
            to={`/movies?genres=${encodeURIComponent(becauseYouWatched.seed.genres[0])}`}
            movies={becauseYouWatched.movies}
          />
        ) : null}

        {genreShelves.map((shelf) => (
          <Rail
            key={shelf.genre}
            title={shelf.genre}
            subtitle={`${formatCount(shelf.total)} films · ${shelf.total > SHELF_SIZE ? `showing ${SHELF_SIZE}` : 'all of them'}`}
            to={`/genre/${encodeURIComponent(shelf.genre)}`}
            movies={shelf.movies}
          />
        ))}
      </div>

      <section className="home-cta page">
        <div className="home-cta__card">
          <h2>Every film in one catalogue</h2>
          <p>
            Filter {CATALOGUE_STATS.films.toLocaleString('en-US')} entries by genre, decade, rating, runtime, country and
            language — then sort five different ways. Everything runs locally in your browser.
          </p>
          <div className="home-cta__actions">
            <Link className="btn btn--primary" to="/movies">
              <Icon name="grid" size={18} />
              Browse all films
            </Link>
            <Link className="btn btn--outline" to="/genres">
              <Icon name="list" size={18} />
              Explore genres
            </Link>
          </div>
        </div>
        <div className="home-cta__card home-cta__card--muted">
          <h2>Start with a genre</h2>
          <div className="chips chips--wrap">
            {GENRES.slice(0, 10).map((genre) => (
              <Link key={genre.value} to={`/genre/${encodeURIComponent(genre.value)}`} className="pill">
                {genre.value}
                <span className="pill__count">{genre.count}</span>
              </Link>
            ))}
          </div>
          <Link className="linklike" to="/genres">
            All {GENRES.length} genres
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>
      </section>

      <section className="home page">
        <p className="fineprint">
          <Icon name="info" size={15} />
          CinemaVerse is a catalogue interface. All {MOVIES.length.toLocaleString('en-US')} films, credits and synopses
          are fictional reference data; no streaming, downloads or playback are included.
        </p>
      </section>
    </>
  )
}