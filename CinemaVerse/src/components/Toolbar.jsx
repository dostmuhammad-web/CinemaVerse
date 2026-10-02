import { SORTS } from '../lib/catalog.js'
import { Icon } from './Icons.jsx'

/**
 * Results toolbar: result count, sort select, pagination/infinite toggle and a
 * mobile filter trigger.
 */
export default function Toolbar({
  total,
  shown,
  sort,
  onSortChange,
  mode,
  onModeChange,
  onOpenFilters,
  activeCount,
  children,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <button type="button" className="btn btn--ghost btn--sm toolbar__filters" onClick={onOpenFilters}>
          <Icon name="filter" size={16} />
          Filters
          {activeCount > 0 ? <span className="toolbar__badge">{activeCount}</span> : null}
        </button>
        <p className="toolbar__count">
          <strong>{total.toLocaleString('en-US')}</strong> {total === 1 ? 'film' : 'films'}
          {shown < total ? <span className="toolbar__shown"> · showing {shown.toLocaleString('en-US')}</span> : null}
        </p>
      </div>

      <div className="toolbar__right">
        {children}
        <div className="segmented" role="group" aria-label="Result layout">
          <button
            type="button"
            className={mode === 'page' ? 'is-active' : ''}
            onClick={() => onModeChange('page')}
            aria-pressed={mode === 'page'}
            title="Paginated grid"
          >
            <Icon name="grid" size={16} />
            <span>Pages</span>
          </button>
          <button
            type="button"
            className={mode === 'infinite' ? 'is-active' : ''}
            onClick={() => onModeChange('infinite')}
            aria-pressed={mode === 'infinite'}
            title="Infinite scroll"
          >
            <Icon name="list" size={16} />
            <span>Scroll</span>
          </button>
        </div>

        <label className="select">
          <span className="sr-only">Sort by</span>
          <Icon name="sort" size={16} />
          <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
            {SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}