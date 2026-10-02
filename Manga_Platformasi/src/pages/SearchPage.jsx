import { useMemo, useState } from 'react'
import { Link, useRouter } from '../lib/router.jsx'
import { SearchBox } from '../components/Header.jsx'
import { EmptyState, MangaGrid, SectionHeader } from '../components/Layout.jsx'
import { IconSearch, IconStar, IconWarning } from '../components/icons.jsx'
import { searchManga } from '../lib/search.js'
import { MANGA } from '../data/manga.js'
import { formatCompact, formatNumber } from '../lib/format.js'
import { SORTS, applyFilters, parseFilters } from '../lib/catalog.js'
import { useLibrary } from '../lib/library.jsx'

const HOT = ['Action', 'Romance', 'Sci-Fi', 'Ito', 'Kanzaki', 'Wren', 'Cyberpunk', 'Horror']

export default function SearchPage() {
  const { query } = useRouter()
  const { favorites } = useLibrary()
  const term = (query.q ?? '').toString()
  const [sort, setSort] = useState('relevance')

  const results = useMemo(() => searchManga(term), [term])

  const sorted = useMemo(() => {
    if (sort === 'relevance') return results
    const filters = parseFilters({ sort })
    return applyFilters(results.map((r) => r.manga), filters)
  }, [results, sort])

  const grouped = useMemo(() => {
    const buckets = new Map()
    results.forEach(({ manga, fields }) => {
      fields.forEach((field) => {
        if (!buckets.has(field)) buckets.set(field, [])
        buckets.get(field).push(manga)
      })
    })
    return Array.from(buckets.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [results])

  const hasQuery = term.trim().length > 0
  const inFavorites = MANGA.filter((m) => favorites.includes(m.id)).slice(0, 6)

  return (
    <div className="page searchpage">
      <header className="searchhero">
        <span className="pagehead__eyebrow">Instant search</span>
        <h1 className="pagehead__title">Find any series</h1>
        <p className="pagehead__sub">
          Titles, alternative titles, authors, artists and genres are all indexed.
        </p>
        <div className="searchhero__box">
          <SearchBox variant="page" initial={term} autoFocus />
        </div>
        {!hasQuery ? (
          <div className="searchhero__hints">
            <span>Try</span>
            {HOT.map((h) => (
              <Link key={h} className="chip chip--sm" to={`/search?q=${encodeURIComponent(h)}`}>
                {h}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      {!hasQuery ? (
        <>
          <section className="section">
            <SectionHeader
              eyebrow="Get started"
              title="Browse everything"
              subtitle="Or pick one of the shelves below"
            />
            <div className="searchhero__jump">
              <Link to="/manga" className="jumpcard">
                <b>All manga</b>
                <span>{formatNumber(MANGA.length)} titles</span>
              </Link>
              <Link to="/popular" className="jumpcard">
                <b>Popular now</b>
                <span>Most viewed</span>
              </Link>
              <Link to="/latest" className="jumpcard">
                <b>Latest chapters</b>
                <span>Updated daily</span>
              </Link>
              <Link to="/rankings" className="jumpcard">
                <b>Rankings</b>
                <span>Four boards</span>
              </Link>
            </div>
          </section>
          {inFavorites.length ? (
            <section className="section">
              <SectionHeader eyebrow="Saved" title="From your favorites" to="/favorites" />
              <MangaGrid items={inFavorites} />
            </section>
          ) : null}
        </>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<IconWarning size={30} />}
          title={`No results for “${term}”`}
          message="Check the spelling, try an alternative title, a shorter keyword, or browse the genres instead."
          action={
            <div className="empty__actions">
              <Link to="/manga" className="btn btn--primary">
                Browse all manga
              </Link>
              <Link to="/genres" className="btn btn--ghost">
                Browse genres
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <section className="section">
            <SectionHeader
              eyebrow={`${formatNumber(results.length)} match${results.length === 1 ? '' : 'es'}`}
              title={`Results for “${term}”`}
              subtitle="Ranked by field relevance, then by community score"
              action={
                <label className="toolbar__sort">
                  <span>Sort</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="relevance">Best match</option>
                    {SORTS.filter((s) => ['rating', 'popular', 'latest', 'title'].includes(s.value)).map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              }
            />
            <MangaGrid items={sorted} />
          </section>

          <section className="section">
            <SectionHeader eyebrow="Breakdown" title="Where the matches came from" />
            <div className="breakdown">
              {grouped.map(([field, list]) => (
                <div key={field} className="breakdown__row">
                  <span className="breakdown__label">
                    {field === 'alt' ? 'Alternative title' : field}
                  </span>
                  <div className="breakdown__bar">
                    <span style={{ width: `${(list.length / results.length) * 100}%` }} />
                  </div>
                  <span className="breakdown__count">{list.length}</span>
                  <div className="breakdown__faces">
                    {list.slice(0, 5).map((m) => (
                      <Link key={m.id} to={`/manga/${m.id}`} title={m.title}>
                        <img src={m.cover} alt={m.title} loading="lazy" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <SectionHeader eyebrow="Also" title="Top titles overall" to="/popular" />
            <div className="suggestgrid">
              {MANGA.slice(0, 6).map((m) => (
                <Link key={m.id} to={`/manga/${m.id}`} className="suggest">
                  <span className="suggest__rank">
                    <IconStar filled size={13} /> {m.rating.toFixed(2)}
                  </span>
                  <b>{m.title}</b>
                  <em>
                    {formatCompact(m.views)} views · {m.chapterCount} ch
                  </em>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {!hasQuery ? (
        <p className="searchpage__hint">
          <IconSearch size={15} /> Results appear as you type — no need to press enter.
        </p>
      ) : null}
    </div>
  )
}