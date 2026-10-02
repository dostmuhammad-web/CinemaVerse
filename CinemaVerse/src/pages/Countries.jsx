import { useMemo } from 'react'
import { Link } from '../lib/router.jsx'
import { LANGUAGES, POPULAR, TOP_RATED, countriesByRegion, moviesInCountry } from '../lib/catalog.js'
import SmartImage from '../components/SmartImage.jsx'
import { Icon } from '../components/Icons.jsx'
import { formatCount, formatRating } from '../lib/format.js'

const REGION_ORDER = ['Europe', 'North America', 'Asia', 'South America', 'Oceania', 'Africa', 'Other']

/** Decorative region badge — a two-letter code, not a flag asset. */
const REGION_CODE = {
  Europe: 'EU',
  'North America': 'NA',
  Asia: 'AS',
  'South America': 'SA',
  Oceania: 'OC',
  Africa: 'AF',
  Other: '--',
}

export default function Countries() {
  const groups = countriesByRegion()

  const regions = useMemo(
    () =>
      [...groups.entries()]
        .sort((a, b) => REGION_ORDER.indexOf(a[0]) - REGION_ORDER.indexOf(b[0]))
        .map(([region, countries]) => ({
          region,
          countries,
          total: countries.reduce((sum, country) => sum + country.count, 0),
        })),
    [groups],
  )

  return (
    <div className="taxonomy">
      <header className="page-head">
        <div className="page-head__inner page">
          <p className="page-head__eyebrow">Browse by country</p>
          <h1 className="page-head__title">{regions.reduce((sum, group) => sum + group.countries.length, 0)} countries</h1>
          <p className="page-head__description">
            Production countries as listed in the catalogue, each with its most-watched and best-rated entry. Cast and
            crew names follow the country they belong to.
          </p>
        </div>
      </header>

      <div className="page taxonomy__regions">
        {regions.map((group) => (
          <section className="region" key={group.region}>
            <header className="region__head">
              <span className="region__badge">{REGION_CODE[group.region] ?? '--'}</span>
              <h2>{group.region}</h2>
              <span className="region__count">
                {group.countries.length} {group.countries.length === 1 ? 'country' : 'countries'} ·{' '}
                {formatCount(group.total)} films
              </span>
            </header>

            <div className="region__grid">
              {group.countries.map((country) => {
                const films = moviesInCountry(country.value)
                const popular = POPULAR.find((movie) => movie.country === country.value)
                const rated = TOP_RATED.find((movie) => movie.country === country.value)
                const lead = popular ?? rated ?? films[0]

                return (
                  <article className="country" key={country.value}>
                    <Link to={`/country/${encodeURIComponent(country.value)}`} className="country__link">
                      <div className="country__art">
                        {lead ? <SmartImage src={lead.backdrop} alt="" ratio="16 / 9" width={480} /> : null}
                        <span className="country__overlay" aria-hidden="true" />
                        <span className="country__count">
                          <Icon name="film" size={13} />
                          {formatCount(country.count)}
                        </span>
                      </div>
                      <div className="country__body">
                        <h3>{country.value}</h3>
                        <p className="country__meta">
                          {lead ? `${lead.language} · best ${formatRating(rated?.rating ?? lead.rating)}` : 'No entries'}
                        </p>
                        {popular ? (
                          <p className="country__hint">
                            Most watched <strong>{popular.title}</strong>
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="page taxonomy__extra">
        <div className="taxonomy__extra-head">
          <h2>Original languages</h2>
          <p>
            Every film carries the language of its original release, and non-English films keep their{' '}
            <code>originalTitle</code> alongside the English one.
          </p>
        </div>
        <div className="chips chips--wrap">
          {LANGUAGES.map((language) => (
            <Link key={language.value} to={`/movies?languages=${encodeURIComponent(language.value)}`} className="pill">
              {language.value}
              <span className="pill__count">{language.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}