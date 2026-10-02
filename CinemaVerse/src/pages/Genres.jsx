import { useMemo } from 'react'
import { Link } from '../lib/router.jsx'
import { GENRES, MOVIES, POPULAR, TOP_RATED, moviesInGenre } from '../lib/catalog.js'
import SmartImage from '../components/SmartImage.jsx'
import { Icon } from '../components/Icons.jsx'
import { formatCount, formatRating } from '../lib/format.js'
import { EmptyState } from '../components/States.jsx'

/** A genre tile: an art sample, the count, and a one-line taste summary. */
function GenreTile({ genre }) {
  const films = moviesInGenre(genre.value)
  const top = useMemo(() => TOP_RATED.find((movie) => movie.genres.includes(genre.value)), [genre.value])
  const lead = useMemo(() => POPULAR.find((movie) => movie.genres.includes(genre.value)), [genre.value])

  return (
    <article className="gentile">
      <Link to={`/genre/${encodeURIComponent(genre.value)}`} className="gentile__link">
        <div className="gentile__art">
          {films.slice(0, 4).map((movie, index) => (
            <SmartImage
              key={movie.id}
              src={movie.poster}
              alt=""
              ratio="2 / 3"
              width={220}
              className="gentile__poster"
              priority={index < 4}
            />
          ))}
          <div className="gentile__veil" aria-hidden="true" />
        </div>
        <div className="gentile__body">
          <h2 className="gentile__title">{genre.value}</h2>
          <p className="gentile__count">
            {formatCount(genre.count)} films · {Math.round((genre.count / 1040) * 100)}% of the catalogue
          </p>
          {lead ? (
            <p className="gentile__hint">
              <Icon name="star" size={13} />
              Top pick: <strong>{top?.title ?? lead.title}</strong> ({formatRating(top?.rating ?? lead.rating)})
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  )
}

export default function Genres() {
  if (!GENRES.length) {
    return (
      <div className="page">
        <EmptyState title="No genres yet" body="The catalogue is empty." />
      </div>
    )
  }

  return (
    <div className="taxonomy">
      <header className="page-head">
        <div className="page-head__inner page">
          <p className="page-head__eyebrow">Browse by genre</p>
          <h1 className="page-head__title">{GENRES.length} genres</h1>
          <p className="page-head__description">
            Every genre in the catalogue, sized by how many films carry it. Each tile previews four of that genre’s
            posters and links to a filtered catalogue you can keep narrowing.
          </p>
        </div>
      </header>

      <div className="page taxonomy__grid">
        {GENRES.map((genre) => (
          <GenreTile key={genre.value} genre={genre} />
        ))}
      </div>

      <section className="page taxonomy__extra">
        <div className="taxonomy__extra-head">
          <h2>Multi-genre entries</h2>
          <p>Most films in the catalogue carry a second genre — these combinations are the most common.</p>
        </div>
        <div className="chips chips--wrap">
          {comboCounts().map((combo) => (
            <Link
              key={combo.label}
              to={`/movies?genres=${encodeURIComponent(combo.parts.join(','))}`}
              className="pill"
            >
              {combo.label}
              <span className="pill__count">{combo.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function comboCounts() {
  const tally = new Map()
  MOVIES.forEach((movie) => {
    const key = movie.genres.slice().sort().join('+')
    tally.set(key, (tally.get(key) ?? 0) + 1)
  })
  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([key, count]) => ({ label: key.split('+').join(' + '), parts: key.split('+'), count }))
}