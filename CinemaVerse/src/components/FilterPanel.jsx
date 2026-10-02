import { useMemo, useState } from 'react'
import { Icon } from './Icons.jsx'
import {
  COUNTRIES,
  DECADES,
  DURATION_BUCKETS,
  GENRES,
  LANGUAGES,
  RATINGS,
  YEARS,
} from '../lib/catalog.js'
import { RATING_TIERS, STATUSES, toggleIn } from '../lib/filters.js'

/** Facet group: a collapsible checklist with live counts. */
function Facet({ title, children, defaultOpen = true, count = 0 }) {
  return (
    <details className="facet" open={defaultOpen}>
      <summary className="facet__head">
        <span>{title}</span>
        <span className="facet__meta">
          {count > 0 ? <span className="facet__count">{count}</span> : null}
          <Icon name="chevronDown" size={16} className="facet__chevron" />
        </span>
      </summary>
      <div className="facet__body">{children}</div>
    </details>
  )
}

function Check({ checked, label, count, onChange }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="check__box" aria-hidden="true">
        <Icon name="check" size={12} />
      </span>
      <span className="check__label">{label}</span>
      {Number.isFinite(count) ? <span className="check__count">{count}</span> : null}
    </label>
  )
}

/**
 * Full filter surface: genre, decade, year range, rating, duration, country,
 * language and release status. Values inside a facet are OR-ed; facets are
 * AND-ed together.
 */
export default function FilterPanel({ filters, onChange, onReset, activeCount, resultCount, hideFacets = [] }) {
  const [countryQuery, setCountryQuery] = useState('')
  const hidden = (name) => hideFacets.includes(name)

  const countries = useMemo(() => {
    const needle = countryQuery.trim().toLowerCase()
    const list = needle ? COUNTRIES.filter((country) => country.value.toLowerCase().includes(needle)) : COUNTRIES
    return list.slice(0, 12)
  }, [countryQuery])

  const patch = (key, value) => onChange({ ...filters, [key]: value })
  const toggle = (key, value) => patch(key, toggleIn(filters[key], value))

  return (
    <aside className="filters" aria-label="Filters">
      <header className="filters__head">
        <h2 className="filters__title">
          <Icon name="filter" size={17} />
          Filters
          {activeCount > 0 ? <span className="filters__badge">{activeCount}</span> : null}
        </h2>
        <div className="filters__head-tools">
          {activeCount > 0 ? (
            <button type="button" className="linklike" onClick={onReset}>
              <Icon name="reset" size={15} />
              Reset
            </button>
          ) : null}
        </div>
      </header>

      {activeCount > 0 ? (
        <p className="filters__summary">
          {resultCount} {resultCount === 1 ? 'film matches' : 'films match'} your filters
        </p>
      ) : null}

      {!hidden('genres') ? (
        <Facet title="Genre" count={filters.genres.length}>
          <div className="check-grid">
            {GENRES.map((genre) => (
              <Check
                key={genre.value}
                label={genre.value}
                count={genre.count}
                checked={filters.genres.includes(genre.value)}
                onChange={() => toggle('genres', genre.value)}
              />
            ))}
          </div>
        </Facet>
      ) : null}

      <Facet title="Minimum rating" count={filters.minRating ? 1 : 0}>
        <div className="check-grid">
          {RATING_TIERS.map((tier) => (
            <Check
              key={tier.id}
              label={tier.label}
              count={null}
              checked={filters.minRating === tier.min}
              onChange={() => patch('minRating', filters.minRating === tier.min ? 0 : tier.min)}
            />
          ))}
        </div>
        <p className="facet__note">
          Catalogue range {RATINGS.min.toFixed(1)} – {RATINGS.max.toFixed(1)}
        </p>
      </Facet>

      <Facet title="Year" count={filters.minYear > YEARS.min || filters.maxYear < YEARS.max ? 1 : 0}>
        <div className="range">
          <label className="range__field">
            <span>From</span>
            <input
              type="number"
              inputMode="numeric"
              value={filters.minYear}
              min={YEARS.min}
              max={YEARS.max}
              onChange={(event) => patch('minYear', clampYear(event.target.value, YEARS.min, filters.maxYear))}
            />
          </label>
          <label className="range__field">
            <span>To</span>
            <input
              type="number"
              inputMode="numeric"
              value={filters.maxYear}
              min={filters.minYear}
              max={YEARS.max}
              onChange={(event) => patch('maxYear', clampYear(event.target.value, filters.minYear, YEARS.max))}
            />
          </label>
        </div>
        <div className="chips">
          {DECADES.slice(-5)
            .reverse()
            .map((decade) => (
              <button
                key={decade.value}
                type="button"
                className={`pill ${filters.decades.includes(decade.value) ? 'is-active' : ''}`.trim()}
                onClick={() => toggle('decades', decade.value)}
              >
                {decade.value}
                <span className="pill__count">{decade.count}</span>
              </button>
            ))}
        </div>
      </Facet>

      <Facet title="Duration" count={filters.durations.length}>
        <div className="check-grid">
          {DURATION_BUCKETS.map((bucket) => (
            <Check
              key={bucket.id}
              label={bucket.label}
              count={null}
              checked={filters.durations.includes(bucket.id)}
              onChange={() => toggle('durations', bucket.id)}
            />
          ))}
        </div>
      </Facet>

      {!hidden('countries') ? (
        <Facet title="Country" count={filters.countries.length}>
          <div className="facet__search">
            <Icon name="search" size={15} />
            <input
              type="search"
              value={countryQuery}
              placeholder={`${COUNTRIES.length} countries`}
              onChange={(event) => setCountryQuery(event.target.value)}
              aria-label="Filter the country list"
            />
          </div>
          <div className="check-grid">
            {countries.map((country) => (
              <Check
                key={country.value}
                label={country.value}
                count={country.count}
                checked={filters.countries.includes(country.value)}
                onChange={() => toggle('countries', country.value)}
              />
            ))}
            {!countries.length ? <p className="facet__note">No country matches “{countryQuery}”.</p> : null}
          </div>
        </Facet>
      ) : null}

      <Facet title="Language" count={filters.languages.length} defaultOpen={false}>
        <div className="check-grid">
          {LANGUAGES.map((language) => (
            <Check
              key={language.value}
              label={language.value}
              count={language.count}
              checked={filters.languages.includes(language.value)}
              onChange={() => toggle('languages', language.value)}
            />
          ))}
        </div>
      </Facet>

      <Facet title="Release status" count={filters.status ? 1 : 0} defaultOpen={false}>
        <div className="check-grid">
          {STATUSES.map((status) => (
            <Check
              key={status}
              label={status}
              count={null}
              checked={filters.status === status}
              onChange={() => patch('status', filters.status === status ? '' : status)}
            />
          ))}
        </div>
      </Facet>
    </aside>
  )
}

function clampYear(raw, min, max) {
  const value = Number.parseInt(raw, 10)
  if (!Number.isFinite(value)) return min
  return Math.min(Math.max(value, min), max)
}