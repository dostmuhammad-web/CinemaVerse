import { useMemo, useState } from 'react'
import { Link } from '../lib/router.jsx'
import { EmptyState, MangaGrid, SectionHeader, StatCard } from '../components/Layout.jsx'
import MangaImage from '../components/MangaImage.jsx'
import {
  IconBookmark,
  IconCheck,
  IconClock,
  IconHeart,
  IconHistory,
  IconCalendar,
  IconTrash,
} from '../components/icons.jsx'
import { getManga } from '../data/manga.js'
import { formatDate, formatNumber, timeAgo } from '../lib/format.js'
import { useLibrary } from '../lib/library.jsx'

function LibraryHeader({ eyebrow, title, sub, count, onClear, clearLabel = 'Clear all' }) {
  return (
    <header className="pagehead">
      <div>
        <span className="pagehead__eyebrow">{eyebrow}</span>
        <h1 className="pagehead__title">{title}</h1>
        <p className="pagehead__sub">{sub}</p>
      </div>
      <div className="pagehead__tools">
        {count > 0 ? (
          <button type="button" className="btn btn--ghost btn--danger" onClick={onClear}>
            <IconTrash size={15} />
            {clearLabel}
          </button>
        ) : null}
      </div>
    </header>
  )
}

/* ----------------------------- Favorites ----------------------------- */

export function Favorites() {
  const { favorites, clearList, progress } = useLibrary()
  const [sort, setSort] = useState('added')

  const list = useMemo(() => {
    const items = favorites.map(getManga).filter(Boolean)
    if (sort === 'rating') return items.sort((a, b) => b.rating - a.rating)
    if (sort === 'popular') return items.sort((a, b) => b.views - a.views)
    if (sort === 'latest') return items.sort((a, b) => new Date(b.latestUpdate) - new Date(a.latestUpdate))
    if (sort === 'title') return items.sort((a, b) => a.title.localeCompare(b.title))
    return items
  }, [favorites, sort])

  const avgRating = list.length ? list.reduce((s, m) => s + m.rating, 0) / list.length : 0
  const totalChapters = list.reduce((s, m) => s + m.chapterCount, 0)

  return (
    <div className="page">
      <LibraryHeader
        eyebrow={
          <span className="inline">
            <IconHeart filled size={14} /> Saved
          </span>
        }
        title="Favorites"
        sub="Titles you heart. Stored in this browser's localStorage."
        count={list.length}
        onClear={() => clearList('favorites')}
      />

      {list.length ? (
        <>
          <section className="statstrip statstrip--tight">
            <StatCard label="Saved titles" value={formatNumber(list.length)} />
            <StatCard label="Average rating" value={avgRating.toFixed(2)} tone="brand" />
            <StatCard label="Chapters waiting" value={formatNumber(totalChapters)} />
            <StatCard
              label="In progress"
              value={formatNumber(list.filter((m) => progress[m.id]).length)}
              hint="started reading"
            />
          </section>

          <section className="section">
            <SectionHeader
              eyebrow={`${formatNumber(list.length)} saved`}
              title="Your shelf"
              action={
                <div className="miniseg">
                  {[
                    ['added', 'Added'],
                    ['rating', 'Rating'],
                    ['popular', 'Popular'],
                    ['latest', 'Latest'],
                    ['title', 'AвЂ“Z'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={sort === value ? 'is-active' : ''}
                      onClick={() => setSort(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              }
            />
            <MangaGrid items={list} />
          </section>
        </>
      ) : (
        <EmptyState
          icon={<IconHeart size={30} />}
          title="No favorites yet"
          message="Tap the heart on any cover to keep it here. Your list survives refreshes and restarts."
          action={
            <Link to="/popular" className="btn btn--primary">
              Find something to love
            </Link>
          }
        />
      )}
    </div>
  )
}

/* --------------------------- Reading list --------------------------- */

export function ReadingList() {
  const { reading, completed, clearList, toggleCompleted, progress, toggleReading } = useLibrary()
  const [tab, setTab] = useState('reading')

  const readingItems = reading.map(getManga).filter(Boolean)
  const completedItems = completed.map(getManga).filter(Boolean)

  const list = tab === 'reading' ? readingItems : completedItems
  const readingChapters = readingItems.reduce((s, m) => s + m.chapterCount, 0)

  return (
    <div className="page">
      <LibraryHeader
        eyebrow={
          <span className="inline">
            <IconBookmark filled size={14} /> Plan
          </span>
        }
        title="Reading list"
        sub="Track what you plan to read and what you have finished."
        count={tab === 'reading' ? readingItems.length : completedItems.length}
        onClear={() => clearList(tab === 'reading' ? 'reading' : 'completed')}
        clearLabel={tab === 'reading' ? 'Clear reading list' : 'Clear completed'}
      />

      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'reading'}
          className={tab === 'reading' ? 'is-active' : ''}
          onClick={() => setTab('reading')}
        >
          <IconBookmark size={16} /> Reading
          <em>{readingItems.length}</em>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'completed'}
          className={tab === 'completed' ? 'is-active' : ''}
          onClick={() => setTab('completed')}
        >
          <IconCheck size={16} /> Completed
          <em>{completedItems.length}</em>
        </button>
      </div>

      {list.length ? (
        <>
          <section className="statstrip statstrip--tight">
            <StatCard
              label={tab === 'reading' ? 'In progress' : 'Finished'}
              value={formatNumber(list.length)}
              tone="brand"
            />
            <StatCard
              label="Total chapters"
              value={formatNumber(list.reduce((s, m) => s + m.chapterCount, 0))}
            />
            <StatCard
              label="Started"
              value={formatNumber(list.filter((m) => progress[m.id]).length)}
              hint="has saved progress"
            />
            <StatCard
              label="Avg rating"
              value={(list.reduce((s, m) => s + m.rating, 0) / list.length).toFixed(2)}
            />
          </section>

          <section className="section">
            <SectionHeader
              eyebrow={tab === 'reading' ? 'Continue later' : 'Finished reading'}
              title={tab === 'reading' ? 'Up next' : 'Completed series'}
              subtitle={
                tab === 'reading'
                  ? `${formatNumber(readingChapters)} chapters in this queue`
                  : 'Marked as done'
              }
            />
            <ul className="queue">
              {list.map((manga) => {
                const prog = progress[manga.id]
                const isDone = completed.includes(manga.id)
                return (
                  <li key={manga.id} className={isDone ? 'is-done' : ''}>
                    <Link to={`/manga/${manga.id}`} className="queue__link">
                      <div className="queue__art">
                        <MangaImage manga={manga} variant="cover" />
                      </div>
                      <div className="queue__body">
                        <h3>{manga.title}</h3>
                        <p>
                          {manga.author} В· {manga.status} В· {manga.chapterCount} chapters
                        </p>
                        {prog ? (
                          <div className="queue__progress">
                            <div className="bar">
                              <span style={{ width: `${prog.percent}%` }} />
                            </div>
                            <small>
                              Chapter {prog.chapter} В· {prog.percent}%
                            </small>
                          </div>
                        ) : (
                          <p className="queue__hint">Not started yet</p>
                        )}
                      </div>
                      <div className="queue__side">
                        <button
                          type="button"
                          className={`pillbtn ${isDone ? 'is-on is-done' : ''}`}
                          onClick={(e) => {
                            e.preventDefault()
                            toggleCompleted(manga.id)
                          }}
                        >
                          <IconCheck size={14} /> {isDone ? 'Completed' : 'Mark done'}
                        </button>
                        <button
                          type="button"
                          className="pillbtn"
                          onClick={(e) => {
                            e.preventDefault()
                            toggleReading(manga.id)
                          }}
                        >
                          <IconTrash size={14} /> Remove
                        </button>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      ) : (
        <EmptyState
          icon={tab === 'reading' ? <IconBookmark size={30} /> : <IconCheck size={30} />}
          title={tab === 'reading' ? 'Reading list is empty' : 'Nothing completed yet'}
          message={
            tab === 'reading'
              ? 'Use the bookmark button on a cover or the details page to queue a series.'
              : 'Mark a title as done once you finish the last chapter.'
          }
          action={
            <Link to="/manga" className="btn btn--primary">
              Browse catalogue
            </Link>
          }
        />
      )}
    </div>
  )
}

/* ------------------------------ History ------------------------------ */

export function History() {
  const { history, clearHistory, progress, counts } = useLibrary()

  const rows = useMemo(
    () =>
      history
        .map((entry) => ({ entry, manga: getManga(entry.id) }))
        .filter((row) => row.manga)
        .sort((a, b) => (progress[b.manga.id]?.stamp ?? b.entry.stamp) - (progress[a.manga.id]?.stamp ?? a.entry.stamp)),
    [history, progress],
  )

  const chaptersRead = history.reduce((sum, row) => sum + (progress[row.manga.id]?.chapter ?? row.entry.chapter), 0)

  return (
    <div className="page">
      <LibraryHeader
        eyebrow={
          <span className="inline">
            <IconHistory size={14} /> Local log
          </span>
        }
        title="Reading history"
        sub="Every series you opened, newest first. Stored locally, never uploaded."
        count={rows.length}
        onClear={clearHistory}
        clearLabel="Clear history"
      />

      {rows.length ? (
        <>
          <section className="statstrip statstrip--tight">
            <StatCard label="Entries" value={formatNumber(rows.length)} tone="brand" />
            <StatCard label="Chapters reached" value={formatNumber(chaptersRead)} />
            <StatCard label="Unique titles" value={formatNumber(counts.favorites + counts.reading)} hint="saved in lists" />
            <StatCard
              label="Deepest read"
              value={formatNumber(Math.max(0, ...rows.map((r) => progress[r.manga.id]?.chapter ?? 0)))}
              hint="highest chapter"
            />
          </section>

          <section className="section">
            <SectionHeader eyebrow="Timeline" title="Recently opened" subtitle="Ordered by last activity" />
            <ol className="timeline">
              {rows.map(({ entry, manga }, i) => {
                const prog = progress[manga.id]
                return (
                  <li key={manga.id} className="timeline__item">
                    <span className="timeline__rail" aria-hidden="true">
                      <i />
                    </span>
                    <Link to={`/manga/${manga.id}`} className="timeline__card">
                      <div className="timeline__art">
                        <MangaImage manga={manga} variant="cover" />
                      </div>
                      <div className="timeline__body">
                        <h3>{manga.title}</h3>
                        <p>
                          {manga.author} В· Ch. {prog?.chapter ?? entry.chapter} of {manga.chapterCount}
                        </p>
                        {prog ? (
                          <div className="queue__progress">
                            <div className="bar">
                              <span style={{ width: `${prog.percent}%` }} />
                            </div>
                            <small>{prog.percent}% complete</small>
                          </div>
                        ) : null}
                      </div>
                      <div className="timeline__meta">
                        <span className="badge">
                          <IconClock size={13} /> {timeAgo(entry.at)}
                        </span>
                        <span className="badge">
                          <IconCalendar size={13} /> {formatDate(entry.at)}
                        </span>
                        <span className="badge">{manga.status}</span>
                      </div>
                    </Link>
                    {i === 0 ? <span className="timeline__badge">Latest</span> : null}
                  </li>
                )
              })}
            </ol>
          </section>
        </>
      ) : (
        <EmptyState
          icon={<IconHistory size={30} />}
          title="No history yet"
          message="Open a series and start a chapter вЂ” it will show up here with your saved progress."
          action={
            <Link to="/popular" className="btn btn--primary">
              Browse popular titles
            </Link>
          }
        />
      )}
    </div>
  )
}