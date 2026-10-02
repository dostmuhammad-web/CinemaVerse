import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useRouter, useScrollLock } from '../lib/router.jsx'
import {
  applyFilters as filterMovies,
  EMPTY_FILTERS,
  filtersFromQuery,
  filtersToQuery,
  INFINITE_STEP,
  PAGE_SIZE,
  paginate,
  resolveSort,
} from '../lib/filters.js'
import { sortMovies } from '../lib/catalog.js'
import FilterPanel from './FilterPanel.jsx'
import Toolbar from './Toolbar.jsx'
import Pagination from './Pagination.jsx'
import { InfiniteGrid, MovieGrid } from './MovieGrid.jsx'
import { EmptyState } from './States.jsx'
import { Icon } from './Icons.jsx'

/** Only the params this view reacts to, so unrelated query edits don't recompute. */
const STATE_KEYS = [
  'genres',
  'countries',
  'languages',
  'decades',
  'durations',
  'minRating',
  'minYear',
  'maxYear',
  'status',
  'sort',
  'page',
  'mode',
]

/**
 * Shared browse engine behind Movies / Trending / Popular / New Releases and the
 * genre and country landing pages.
 *
 * All state lives in the URL, so filters, sort and page are shareable and the
 * back button behaves. Filtering, sorting and pagination are memoised and only
 * rerun when the query actually changes.
 */
export default function CatalogueView({
  movies,
  eyebrow = 'Catalogue',
  title,
  description,
  defaultSort = 'relevance',
  filtersEnabled = true,
  emptyTitle = 'No films match these filters',
  emptyBody = 'Try removing a facet or widening the year range.',
  headerExtra = null,
  intro = null,
  locked = null,
}) {
  const { query, setQuery } = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const resultsTop = useRef(null)

  const stateKey = `${STATE_KEYS.map((key) => `${key}=${query[key] ?? ''}`).join('&')}&default=${defaultSort}`

  const state = useMemo(() => {
    const rawPage = Number.parseInt(query.page ?? '1', 10)
    return {
      filters: filtersFromQuery(query),
      sort: resolveSort(query.sort || defaultSort),
      page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
      mode: query.mode === 'infinite' ? 'infinite' : 'page',
    }
    // stateKey is a stable signature of exactly the params read above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey])

  const { filters, sort, page: pageNumber, mode } = state
  const lockedValue = locked?.value ?? null
  const lockedFacet = locked?.facet ?? null
  const hideFacets = useMemo(() => (lockedFacet ? [lockedFacet] : []), [lockedFacet])

  const results = useMemo(() => sortMovies(filterMovies(movies, filters), sort), [movies, filters, sort])
  const page = useMemo(() => paginate(results, pageNumber, PAGE_SIZE), [results, pageNumber])

  const baseQuery = useMemo(
    () => ({ ...filtersToQuery(filters), sort, mode }),
    [filters, sort, mode],
  )

  const commitFilters = useCallback((next) => setQuery({ ...filtersToQuery(next), sort, mode, page: '' }), [setQuery, sort, mode])

  const resetFilters = useCallback(() => setQuery({ sort, mode, page: '' }), [setQuery, sort, mode])

  const changeSort = useCallback((value) => setQuery({ ...baseQuery, sort: value, page: '' }), [setQuery, baseQuery])

  const changeMode = useCallback((value) => setQuery({ ...baseQuery, mode: value, page: '' }), [setQuery, baseQuery])

  const changePage = useCallback(
    (value) => {
      setQuery({ ...baseQuery, page: String(value) })
      resultsTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [setQuery, baseQuery],
  )

  useScrollLock(drawerOpen)

  const activeChips = useMemo(
    () => buildChips(filters, commitFilters, locked),
    [filters, commitFilters, locked],
  )
  const empty = results.length === 0

  return (
    <div className="browse">
      <header className="page-head">
        <div className="page-head__inner page">
          <p className="page-head__eyebrow">{eyebrow}</p>
          <h1 className="page-head__title">{title}</h1>
          {description ? <p className="page-head__description">{description}</p> : null}
          {headerExtra}
        </div>
      </header>

      {intro ? <div className="page browse__intro">{intro}</div> : null}

      <div className="browse__body page">
        {filtersEnabled ? (
          <>
            <div className="browse__sidebar">
              <FilterPanel
                filters={filters}
                onChange={commitFilters}
                onReset={resetFilters}
                activeCount={activeChips.length}
                resultCount={results.length}
                hideFacets={hideFacets}
              />
            </div>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <FilterPanel
                filters={filters}
                onChange={commitFilters}
                onReset={resetFilters}
                activeCount={activeChips.length}
                resultCount={results.length}
                hideFacets={hideFacets}
              />
            </Drawer>
          </>
        ) : null}

        <section className="browse__results" ref={resultsTop}>
          <Toolbar
            total={results.length}
            shown={mode === 'infinite' ? results.length : page.items.length}
            sort={sort}
            onSortChange={changeSort}
            mode={mode}
            onModeChange={changeMode}
            onOpenFilters={() => setDrawerOpen(true)}
            activeCount={activeChips.length}
          />

          {activeChips.length || lockedValue ? (
            <div className="active-filters">
              {lockedValue ? (
                <span className="tag tag--locked">
                  <Icon name="filter" size={12} />
                  <span className="tag__label">{lockedValue}</span>
                </span>
              ) : null}
              {activeChips.map((chip) => (
                <button key={chip.key} type="button" className="tag" onClick={chip.remove}>
                  <span className="tag__label">{chip.label}</span>
                  <Icon name="close" size={13} />
                </button>
              ))}
              {activeChips.length ? (
                <button type="button" className="linklike" onClick={resetFilters}>
                  <Icon name="reset" size={15} />
                  Clear all
                </button>
              ) : null}
            </div>
          ) : null}

          {empty ? (
            <EmptyState
              icon="filter"
              title={emptyTitle}
              body={emptyBody}
              action={
                filtersEnabled ? (
                  <button type="button" className="btn btn--primary" onClick={resetFilters}>
                    <Icon name="reset" size={18} />
                    Clear filters
                  </button>
                ) : (
                  <Link className="btn btn--primary" to="/movies">
                    Browse the full catalogue
                  </Link>
                )
              }
            />
          ) : mode === 'infinite' ? (
            <InfiniteGrid movies={results} step={INFINITE_STEP} />
          ) : (
            <>
              <MovieGrid movies={page.items} priorityCount={8} />
              <Pagination
                page={page.page}
                pageCount={page.pageCount}
                onPage={changePage}
                from={page.from}
                to={page.to}
                total={page.total}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function Drawer({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Filters" onClick={onClose}>
      <div className="drawer__backdrop" aria-hidden="true" />
      <div className="drawer__panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="drawer__close" onClick={onClose} aria-label="Close filters">
          <Icon name="close" size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}

const without = (list, value) => list.filter((entry) => entry !== value)

function buildChips(filters, apply, locked = null) {
  const chips = []
  const add = (key, label, next) => chips.push({ key, label, remove: () => apply(next) })

  const lockKey = locked?.facet ? `${locked.facet}:${locked.value}` : null

  filters.genres.forEach((value) => add(`genre:${value}`, value, { ...filters, genres: without(filters.genres, value) }))
  filters.countries.forEach((value) => add(`country:${value}`, value, { ...filters, countries: without(filters.countries, value) }))
  filters.languages.forEach((value) => add(`language:${value}`, value, { ...filters, languages: without(filters.languages, value) }))
  filters.decades.forEach((value) => add(`decade:${value}`, value, { ...filters, decades: without(filters.decades, value) }))
  filters.durations.forEach((value) => add(`duration:${value}`, value, { ...filters, durations: without(filters.durations, value) }))
  if (filters.minRating > 0) add('rating', `${filters.minRating.toFixed(1)}+ rating`, { ...filters, minRating: 0 })
  if (filters.status) add('status', filters.status, { ...filters, status: '' })
  if (filters.minYear > EMPTY_FILTERS.minYear) add('from', `from ${filters.minYear}`, { ...filters, minYear: EMPTY_FILTERS.minYear })
  if (filters.maxYear < EMPTY_FILTERS.maxYear) add('to', `to ${filters.maxYear}`, { ...filters, maxYear: EMPTY_FILTERS.maxYear })

  return lockKey ? chips.filter((chip) => chip.key !== lockKey) : chips
}