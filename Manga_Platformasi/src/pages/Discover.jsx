import { useMemo } from 'react'
import { Link, useRouter } from '../lib/router.jsx'
import { MangaGrid, EmptyState, MangaRail, SectionHeader, StatCard } from '../components/Layout.jsx'
import { MangaRow } from '../components/MangaCard.jsx'
import MangaImage from '../components/MangaImage.jsx'
import { IconFire, IconLayers, IconSparkle, IconStar, IconTrophy } from '../components/icons.jsx'
import { MANGA, getManga } from '../data/manga.js'
import { formatCompact, formatDate, formatNumber } from '../lib/format.js'
import { byGenre, trendingManga } from '../lib/catalog.js'
import { useLibrary } from '../lib/library.jsx'

/* ------------------------------ Popular ------------------------------ */

export function Popular() {
  const { favorites, reading } = useLibrary()
  const sorted = useMemo(() => [...MANGA].sort((a, b) => b.views - a.views), [])
  const totalViews = useMemo(() => sorted.reduce((sum, m) => sum + m.views, 0), [sorted])
  const yours = useMemo(
    () =>
      [...favorites, ...reading]
        .map(getManga)
        .filter(Boolean)
        .sort((a, b) => b.views - a.views),
    [favorites, reading],
  )

  const podium = sorted.slice(0, 3)

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <span className="pagehead__eyebrow">
            <IconFire size={14} /> Most read
          </span>
          <h1 className="pagehead__title">Popular manga</h1>
          <p className="pagehead__sub">
            Every title ordered by lifetime views. {formatNumber(totalViews)} reads tracked.
          </p>
        </div>
      </header>

      <section className="statstrip statstrip--tight">
        <StatCard label="#1 title" value={sorted[0]?.title ?? '—'} hint={`${formatCompact(sorted[0]?.views ?? 0)} views`} tone="brand" />
        <StatCard label="Average rating" value={(MANGA.reduce((s, m) => s + m.rating, 0) / MANGA.length).toFixed(2)} hint="across catalogue" />
        <StatCard label="Ongoing series" value={formatNumber(MANGA.filter((m) => m.status === 'Ongoing').length)} hint="releasing chapters" />
        <StatCard label="From your lists" value={formatNumber(yours.length)} hint="favorites + reading list" />
      </section>

      <section className="podium">
        {podium.map((manga, i) => (
          <Link
            key={manga.id}
            to={`/manga/${manga.id}`}
            className={`podium__card podium__card--${i + 1}`}
          >
            <span className="podium__place">{i + 1}</span>
            <div className="podium__art">
              <MangaImage manga={manga} variant="cover" priority={i < 3} />
            </div>
            <div className="podium__copy">
              <h3>{manga.title}</h3>
              <p>
                {formatCompact(manga.views)} views · {manga.rating.toFixed(2)} rating
              </p>
            </div>
          </Link>
        ))}
      </section>

      <section className="section">
        <SectionHeader eyebrow="All titles" title="Full popularity chart" subtitle="Sorted by total views" />
        <ol className="ranklist">
          {sorted.map((manga, i) => (
            <li key={manga.id}>
              <span className="ranklist__pos">{i + 1}</span>
              <MangaRow manga={manga} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

/* ------------------------------- Latest ------------------------------ */

export function Latest() {
  const grouped = useMemo(() => {
    const sorted = [...MANGA].sort(
      (a, b) => new Date(b.latestUpdate) - new Date(a.latestUpdate),
    )
    const map = new Map()
    sorted.forEach((manga) => {
      const day = manga.latestUpdate
      if (!map.has(day)) map.set(day, [])
      map.get(day).push(manga)
    })
    return Array.from(map.entries()).slice(0, 21)
  }, [])

  const today = grouped[0]?.[1] ?? []

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <span className="pagehead__eyebrow">
            <IconSparkle size={14} /> Fresh chapters
          </span>
          <h1 className="pagehead__title">Latest updates</h1>
          <p className="pagehead__sub">
            {formatNumber(MANGA.length)} series tracked, newest chapter first, grouped by day.
          </p>
        </div>
      </header>

      <section className="section">
        <SectionHeader eyebrow="Today" title={`${today.length} new chapter${today.length === 1 ? '' : 's'}`} subtitle={grouped[0]?.[0] ?? ''} />
        <MangaGrid items={today} />
      </section>

      <section className="section">
        <SectionHeader eyebrow="Archive" title="Previous days" />
        <div className="daylist">
          {grouped.slice(1).map(([day, items]) => (
            <details key={day} className="daylist__group" open={day === grouped[1]?.[0]}>
              <summary>
                <span className="daylist__date">{formatDate(day)}</span>
                <span className="daylist__count">{items.length} titles</span>
              </summary>
              <div className="daylist__items">
                {items.map((manga) => (
                  <Link key={manga.id} to={`/manga/${manga.id}`} className="chapterrow">
                    <span className="chapterrow__num">{manga.latestChapterNumber}</span>
                    <span className="chapterrow__title">
                      <b>{manga.title}</b>
                      <em>{manga.latestChapter.title}</em>
                    </span>
                    <span className="chapterrow__meta">
                      <span className="rating rating--sm">
                        <IconStar filled size={12} />
                        {manga.rating.toFixed(2)}
                      </span>
                      {manga.status}
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ------------------------------- Genres ------------------------------ */

export function Genres() {
  const genres = useMemo(() => {
    const map = new Map()
    MANGA.forEach((manga) => {
      manga.genres.forEach((genre) => {
        if (!map.has(genre)) map.set(genre, [])
        map.get(genre).push(manga)
      })
    })
    return Array.from(map.entries())
      .map(([name, list]) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        count: list.length,
        top: [...list].sort((a, b) => b.rating - a.rating)[0],
        average: list.reduce((s, m) => s + m.rating, 0) / list.length,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [])

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <span className="pagehead__eyebrow">
            <IconLayers size={14} /> Collections
          </span>
          <h1 className="pagehead__title">Genres</h1>
          <p className="pagehead__sub">
            {genres.length} genres covering {MANGA.length} series. Pick one to open the full shelf.
          </p>
        </div>
      </header>

      <div className="genregrid">
        {genres.map((genre) => (
          <Link key={genre.name} to={`/genres/${genre.slug}`} className="genrecard">
            {genre.top ? (
              <div className="genrecard__art">
                <MangaImage manga={genre.top} variant="banner" />
                <div className="genrecard__scrim" />
              </div>
            ) : null}
            <div className="genrecard__body">
              <h2>{genre.name}</h2>
              <p>
                {genre.count} series · avg {genre.average.toFixed(2)}
              </p>
              {genre.top ? <span className="genrecard__peek">{genre.top.title}</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- Genre shelf --------------------------- */

export function GenreDetail({ slug }) {
  const { query, setQuery } = useRouter()
  const genre = useMemo(() => {
    const name = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    const known = Array.from(new Set(MANGA.flatMap((m) => m.genres)))
    const exact = known.find((g) => g.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
    return exact ?? name
  }, [slug])

  const list = useMemo(
    () => byGenre(genre).sort((a, b) => b.rating - a.rating || b.views - a.views),
    [genre],
  )

  if (!list.length) {
    return (
      <div className="page">
        <EmptyState
          title="Genre not found"
          message={`Nothing is tagged “${genre}” yet.`}
          action={
            <Link to="/genres" className="btn btn--primary">
              Browse genres
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <span className="pagehead__eyebrow">
            <IconLayers size={14} /> Genre
          </span>
          <h1 className="pagehead__title">{genre}</h1>
          <p className="pagehead__sub">
            {list.length} series · average rating {(list.reduce((s, m) => s + m.rating, 0) / list.length).toFixed(2)}
          </p>
        </div>
      </header>

      <MangaRail
        eyebrow="Fan favourites"
        title={`Best of ${genre}`}
        items={[...list].sort((a, b) => b.rating - a.rating).slice(0, 14)}
      />

      <section className="section">
        <SectionHeader
          eyebrow="All"
          title={`Every ${genre} title`}
          action={
            <div className="miniseg">
              <button
                type="button"
                className={!query.sort ? 'is-active' : ''}
                onClick={() => setQuery({ sort: undefined })}
              >
                Default
              </button>
              <button
                type="button"
                className={query.sort === 'rating' ? 'is-active' : ''}
                onClick={() => setQuery({ sort: 'rating' })}
              >
                Rating
              </button>
              <button
                type="button"
                className={query.sort === 'popular' ? 'is-active' : ''}
                onClick={() => setQuery({ sort: 'popular' })}
              >
                Popular
              </button>
            </div>
          }
        />
        <MangaGrid
          items={
            query.sort === 'rating'
              ? list
              : query.sort === 'popular'
                ? [...list].sort((a, b) => b.views - a.views)
                : list
          }
        />
      </section>

      {byGenre(genre)
        .flatMap((m) => m.genres)
        .filter((g) => g !== genre)
        .filter((g, i, arr) => arr.indexOf(g) === i)
        .slice(0, 6)
        .map((related) => (
          <MangaRail
            key={related}
            eyebrow="Related"
            title={`More ${related}`}
            items={byGenre(related, 14)}
            to={`/genres/${related.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          />
        ))}
    </div>
  )
}

/* ------------------------------ Rankings ----------------------------- */

const TABS = [
  { value: 'rating', label: 'Top rated', icon: IconStar },
  { value: 'views', label: 'Most viewed', icon: IconEyeIcon },
  { value: 'chapters', label: 'Most chapters', icon: IconLayers },
  { value: 'popular', label: 'Trending', icon: IconTrophy },
]

function IconEyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

export function Rankings() {
  const { query, setQuery } = useRouter()
  const mode = TABS.some((t) => t.value === query.mode) ? query.mode : 'rating'

  const boards = useMemo(
    () => ({
      rating: [...MANGA].sort((a, b) => b.rating - a.rating || b.scoreCount - a.scoreCount),
      views: [...MANGA].sort((a, b) => b.views - a.views),
      chapters: [...MANGA].sort((a, b) => b.chapterCount - a.chapterCount),
      popular: trendingManga(),
    }),
    [],
  )

  const list = boards[mode]
  const top3 = list.slice(0, 3)
  const rest = list.slice(3)

  return (
    <div className="page">
      <header className="pagehead">
        <div>
          <span className="pagehead__eyebrow">
            <IconTrophy size={14} /> Leaderboards
          </span>
          <h1 className="pagehead__title">Rankings</h1>
          <p className="pagehead__sub">Four live boards, recalculated from the catalogue.</p>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={mode === tab.value}
              className={mode === tab.value ? 'is-active' : ''}
              onClick={() => setQuery({ mode: tab.value })}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <section className="podium podium--rank">
        {top3.map((manga, i) => (
          <Link key={manga.id} to={`/manga/${manga.id}`} className={`podium__card podium__card--${i + 1}`}>
            <span className="podium__place">{i + 1}</span>
            <div className="podium__art">
              <MangaImage manga={manga} variant="cover" priority />
            </div>
            <div className="podium__copy">
              <h3>{manga.title}</h3>
              <p>
                {mode === 'rating' && `${manga.rating.toFixed(2)} · ${formatCompact(manga.scoreCount)} scores`}
                {mode === 'views' && `${formatCompact(manga.views)} views`}
                {mode === 'chapters' && `${manga.chapterCount} chapters`}
                {mode === 'popular' && `${formatCompact(manga.trending)} trend score`}
              </p>
            </div>
          </Link>
        ))}
      </section>

      <section className="section">
        <SectionHeader eyebrow={`${rest.length} titles`} title="Full board" />
        <ol className="ranklist">
          {rest.map((manga, i) => (
            <li key={manga.id}>
              <span className="ranklist__pos">{i + 4}</span>
              <MangaRow manga={manga} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}