import { useMemo, useState } from 'react'
import { useRouter } from '../lib/router.jsx'
import { MangaGrid } from '../components/Layout.jsx'
import { MangaRow } from '../components/MangaCard.jsx'
import { EmptyState } from '../components/Layout.jsx'
import { IconClose, IconGrid, IconList, IconSearch, IconSliders } from '../components/icons.jsx'
import {
  ALL_STATUSES,
  ALL_YEARS,
  RATING_STEPS,
  SORTS,
  activeFilterCount,
  applyFilters,
  paginate,
  parseFilters,
} from '../lib/catalog.js'
import { ALL_GENRES, MANGA } from '../data/manga.js'
import { formatNumber } from '../lib/format.js'
import { useLibrary } from '../lib/library.jsx'

function SelectField({ label, value, onChange, children, id }) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <span className="field__control">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {children}
        </select>
      </span>
    </label>
  )
}

export default function Browse() {
  const { query, setQuery } = useRouter()
  const { settings } = useLibrary()
  const [text, setText] = useState(query.q ?? '')
  const [panelOpen, setPanelOpen] = useState(false)
  const [view, setView] = useState('grid')

  const filters = parseFilters(query)
  const page = Number(query.page ?? 1)
  const perPage = Number(query.perPage ?? settings.resultsPerPage ?? 24)

  const filtered = useMemo(
    () => applyFilters(MANGA, filters, { textQuery: query.q ?? '' }),
    [filters, query.q],
  )
  const paged = useMemo(() => paginate(filtered, page, perPage), [filtered, page, perPage])
  const activeCount = activeFilterCount(filters)

  const patch = (values, options = {}) => setQuery({ ...values, page: undefined }, options)

  const toggleGenre = (genre) => {
    const next = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre]
    patch({ genre: next })
  }

  const clearAll = () => {
    setText('')
    setQuery({
      genre: undefined,
      status: undefined,
      year: undefined,
      rating: undefined,
      author: undefined,
      artist: undefined,
      sort: undefined,
      q: undefined,
      page: undefined,
      perPage: undefined,
    })
  }

  const authorOptions = useMemo(
    () => Array.from(new Set(MANGA.map((m) => m.author))).sort((a, b) => a.localeCompare(b)),
    [],
  )

  const artistOptions = useMemo(
    () => Array.from(new Set(MANGA.map((m) => m.artist))).sort((a, b) => a.localeCompare(b)),
    [],
  )

  const chips = [
    ...filters.genres.map((g) => ({ key: `g-${g}`, label: g, onRemove: () => toggleGenre(g) })),
    filters.status
      ? { key: 'status', label: filters.status, onRemove: () => patch({ status: undefined }) }
      : null,
    filters.year
      ? { key: 'year', label: String(filters.year), onRemove: () => patch({ year: undefined }) }
      : null,
    filters.minRating
      ? {
          key: 'rating',
          label: `${filters.minRating}+ rating`,
          onRemove: () => patch({ rating: undefined }),
        }
      : null,
    filters.author
      ? { key: 'author', label: filters.author, onRemove: () => patch({ author: undefined }) }
      : null,
    filters.artist
      ? { key: 'artist', label: filters.artist, onRemove: () => patch({ artist: undefined }) }
      : null,
  ].filter(Boolean)

  return (
    <div className="page browse">
      <header className="pagehead">
        <div>
          <span className="pagehead__eyebrow">Catalogue</span>
          <h1 className="pagehead__title">All manga</h1>
          <p className="pagehead__sub">
            {formatNumber(filtered.length)} of {formatNumber(MANGA.length)} titles match your filters.
          </p>
        </div>
        <div className="pagehead__tools">
          <div className="searchrow">
            <IconSearch size={17} />
            <input
              type="search"
              value={text}
              placeholder="Filter by title, author or genreвЂ¦"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') patch({ q: text })
              }}
              aria-label="Filter titles"
            />
            {text ? (
              <button type="button" onClick={() => { setText(''); patch({ q: undefined }) }} aria-label="Clear">
                <IconClose size={15} />
              </button>
            ) : null}
            <button type="button" className="searchrow__go" onClick={() => patch({ q: text })}>
              Search
            </button>
          </div>
          <div className="seg">
            <button
              type="button"
              className={view === 'grid' ? 'is-active' : ''}
              onClick={() => setView('grid')}
              aria-label="Grid view"
            >
              <IconGrid size={17} />
            </button>
            <button
              type="button"
              className={view === 'list' ? 'is-active' : ''}
              onClick={() => setView('list')}
              aria-label="List view"
            >
              <IconList size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="browse__layout">
        <aside className={`filters ${panelOpen ? 'is-open' : ''}`}>
          <div className="filters__head">
            <h2>
              <IconSliders size={17} />
              Filters
            </h2>
            {activeCount > 0 ? (
              <button type="button" className="linkbtn" onClick={clearAll}>
                Reset all
              </button>
            ) : null}
          </div>

          <div className="filters__group">
            <span className="filters__legend">Genre {filters.genres.length > 1 ? `В· ${filters.genres.length}` : ''}</span>
            <div className="chipwrap">
              {ALL_GENRES.map((genre) => {
                const on = filters.genres.includes(genre.name)
                return (
                  <button
                    key={genre.name}
                    type="button"
                    className={`chip chip--toggle ${on ? 'is-on' : ''}`}
                    onClick={() => toggleGenre(genre.name)}
                    aria-pressed={on}
                  >
                    {genre.name}
                    <em>{genre.count}</em>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="filters__group">
            <SelectField
              id="f-status"
              label="Status"
              value={filters.status}
              onChange={(v) => patch({ status: v })}
            >
              <option value="">Any status</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="f-year"
              label="Year"
              value={filters.year ? String(filters.year) : ''}
              onChange={(v) => patch({ year: v })}
            >
              <option value="">Any year</option>
              {ALL_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="f-rating"
              label="Minimum rating"
              value={filters.minRating ? String(filters.minRating) : ''}
              onChange={(v) => patch({ rating: v })}
            >
              {RATING_STEPS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="f-author"
              label="Author"
              value={filters.author}
              onChange={(v) => patch({ author: v })}
            >
              <option value="">Any author</option>
              {authorOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="f-artist"
              label="Artist"
              value={filters.artist}
              onChange={(v) => patch({ artist: v })}
            >
              <option value="">Any artist</option>
              {artistOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </SelectField>

            <SelectField id="f-sort" label="Sort by" value={filters.sort} onChange={(v) => patch({ sort: v })}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="f-per"
              label="Results per page"
              value={String(perPage)}
              onChange={(v) => setQuery({ perPage: v, page: undefined })}
            >
              {[12, 24, 36, 48].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </SelectField>
          </div>
        </aside>

        <div className="browse__main">
          <div className="toolbar">
            <button
              type="button"
              className="toolbar__filter"
              onClick={() => setPanelOpen((v) => !v)}
              aria-expanded={panelOpen}
            >
              <IconSliders size={16} />
              Filters
              {activeCount ? <em>{activeCount}</em> : null}
            </button>
            <div className="toolbar__count">
              Showing <b>{paged.from}вЂ“{paged.to}</b> of <b>{formatNumber(paged.total)}</b>
            </div>
            <label className="toolbar__sort">
              <span>Sort</span>
              <select value={filters.sort} onChange={(e) => patch({ sort: e.target.value })}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {chips.length ? (
            <div className="activechips">
              {chips.map((chip) => (
                <button key={chip.key} type="button" className="chip chip--active" onClick={chip.onRemove}>
                  {chip.label}
                  <IconClose size={13} />
                </button>
              ))}
              <button type="button" className="linkbtn" onClick={clearAll}>
                Clear
              </button>
            </div>
          ) : null}

          {paged.items.length === 0 ? (
            <EmptyState
              title="No titles match these filters"
              message="Try removing a genre, lowering the minimum rating, or clearing the search box."
              action={
                <button type="button" className="btn btn--primary" onClick={clearAll}>
                  Reset filters
                </button>
              }
            />
          ) : view === 'grid' ? (
            <MangaGrid items={paged.items} />
          ) : (
            <div className="mlist">
              {paged.items.map((manga, i) => (
                <MangaRow key={manga.id} manga={manga} index={(paged.page - 1) * perPage + i} />
              ))}
            </div>
          )}

          {paged.pages > 1 ? (
            <nav className="pager" aria-label="Pagination">
              <button
                type="button"
                disabled={paged.page <= 1}
                onClick={() => setQuery({ page: paged.page - 1 })}
              >
                Prev
              </button>
              <div className="pager__pages">
                {Array.from({ length: paged.pages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n === paged.page ? 'is-active' : ''}
                    onClick={() => setQuery({ page: n })}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={paged.page >= paged.pages}
                onClick={() => setQuery({ page: paged.page + 1 })}
              >
                Next
              </button>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  )
}