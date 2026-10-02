import { pageWindow } from '../lib/filters.js'
import { Icon } from './Icons.jsx'

/** Numbered pagination with an ellipsis window. */
export default function Pagination({ page, pageCount, onPage, from, to, total }) {
  if (pageCount <= 1) return null
  const window_ = pageWindow(page, pageCount)

  const go = (value) => {
    if (typeof value === 'number' && value >= 1 && value <= pageCount && value !== page) {
      onPage(value)
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__step"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevronLeft" size={18} />
      </button>

      <ul className="pagination__list">
        {window_.map((entry) =>
          typeof entry === 'string' ? (
            <li key={entry} className="pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                className={`pagination__page ${entry === page ? 'is-active' : ''}`.trim()}
                onClick={() => go(entry)}
                aria-current={entry === page ? 'page' : undefined}
                aria-label={`Page ${entry}`}
              >
                {entry}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className="pagination__step"
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <Icon name="chevronRight" size={18} />
      </button>

      <p className="pagination__range">
        {from.toLocaleString('en-US')}–{to.toLocaleString('en-US')} of {total.toLocaleString('en-US')}
      </p>
    </nav>
  )
}