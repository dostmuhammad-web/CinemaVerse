import { useMemo } from 'react'
import { Link, useParams } from '../lib/router.jsx'
import CatalogueView from '../components/CatalogueView.jsx'
import { COUNTRIES, COUNTRY_META, moviesInCountry } from '../lib/catalog.js'
import { formatCount, formatRating } from '../lib/format.js'
import { Icon } from '../components/Icons.jsx'
import { EmptyState } from '../components/States.jsx'

/** One country in full — `/country/:country`. */
export default function CountryDetail() {
  const { country: raw = '' } = useParams('/country/:country')
  const name = raw.trim()

  const country = useMemo(
    () => COUNTRIES.find((entry) => entry.value.toLowerCase() === name.toLowerCase()),
    [name],
  )

  const movies = useMemo(() => (country ? moviesInCountry(country.value) : []), [country])
  const best = useMemo(
    () => movies.slice().sort((a, b) => b.rating - a.rating || b.votes - a.votes)[0],
    [movies],
  )
  const meta = country ? COUNTRY_META.get(country.value) : null
  const locked = useMemo(() => (country ? { facet: 'countries', value: country.value } : null), [country])

  const neighbours = useMemo(
    () =>
      COUNTRIES.filter((entry) => entry.value !== country?.value)
        .slice()
        .sort((a, b) => b.count - a.count)
        .slice(0, 12),
    [country],
  )

  if (!country) {
    return (
      <div className="page page--narrow">
        <EmptyState
          icon="globe"
          title={`No country called “${name}”`}
          body="That country is not in the catalogue. Pick one of the listed countries to keep browsing."
          action={
            <Link className="btn btn--primary" to="/countries">
              Browse all countries
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <CatalogueView
      movies={movies}
      eyebrow={meta?.region ?? 'Country'}
      title={country.value}
      description={`${formatCount(country.count)} films produced in ${country.value}${
        meta?.language ? ` · original language ${meta.language}` : ''
      }${best ? ` · highest rated ${best.title} (${formatRating(best.rating)})` : ''}.`}
      locked={locked}
      emptyTitle={`No ${country.value} films match these filters`}
      headerExtra={
        <div className="chips chips--wrap">
          <span className="chips__label">
            <Icon name="globe" size={15} />
            Jump to another country
          </span>
          {neighbours.map((entry) => (
            <Link key={entry.value} to={`/country/${encodeURIComponent(entry.value)}`} className="pill">
              {entry.value}
              <span className="pill__count">{entry.count}</span>
            </Link>
          ))}
        </div>
      }
    />
  )
}
