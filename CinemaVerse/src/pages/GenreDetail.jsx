import { useMemo } from 'react'
import { Link, useParams } from '../lib/router.jsx'
import CatalogueView from '../components/CatalogueView.jsx'
import { GENRES, moviesInGenre } from '../lib/catalog.js'
import { formatCount, formatRating } from '../lib/format.js'
import { Icon } from '../components/Icons.jsx'
import { EmptyState } from '../components/States.jsx'

/** One genre in full — `/genre/:genre`. */
export default function GenreDetail() {
  const { genre: raw = '' } = useParams('/genre/:genre')
  const name = raw.trim()

  const genre = useMemo(
    () => GENRES.find((entry) => entry.value.toLowerCase() === name.toLowerCase()),
    [name],
  )

  const movies = useMemo(() => (genre ? moviesInGenre(genre.value) : []), [genre])
  const best = useMemo(
    () => movies.slice().sort((a, b) => b.rating - a.rating || b.votes - a.votes)[0],
    [movies],
  )
  const locked = useMemo(() => (genre ? { facet: 'genres', value: genre.value } : null), [genre])

  const siblings = useMemo(
    () =>
      GENRES.filter((entry) => entry.value !== genre?.value)
        .slice()
        .sort((a, b) => b.count - a.count)
        .slice(0, 12),
    [genre],
  )

  if (!genre) {
    return (
      <div className="page page--narrow">
        <EmptyState
          icon="grid"
          title={`No genre called “${name}”`}
          body="That genre is not part of the catalogue taxonomy. Pick one of the listed genres to keep browsing."
          action={
            <Link className="btn btn--primary" to="/genres">
              Browse all genres
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <CatalogueView
      movies={movies}
      eyebrow="Genre"
      title={genre.value}
      description={`${formatCount(genre.count)} films tagged ${genre.value}${
        best ? ` · highest rated ${best.title} (${formatRating(best.rating)})` : ''
      }. Narrow it further with any filter on the left.`}
      locked={locked}
      emptyTitle={`No ${genre.value} films match these filters`}
      headerExtra={
        <div className="chips chips--wrap">
          <span className="chips__label">
            <Icon name="grid" size={15} />
            Jump to another genre
          </span>
          {siblings.map((sibling) => (
            <Link key={sibling.value} to={`/genre/${encodeURIComponent(sibling.value)}`} className="pill">
              {sibling.value}
              <span className="pill__count">{sibling.count}</span>
            </Link>
          ))}
        </div>
      }
    />
  )
}
