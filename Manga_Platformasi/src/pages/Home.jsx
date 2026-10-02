import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '../lib/router.jsx'
import MangaImage from '../components/MangaImage.jsx'
import { EmptyState, MangaGrid, MangaRail, SectionHeader, StatCard } from '../components/Layout.jsx'
import { IconBookmark, IconChevronLeft, IconChevronRight, IconHeart, IconPlay, IconStar } from '../components/icons.jsx'
import { useLibrary } from '../lib/library.jsx'
import { editorPicks, genreSlugs, newThisYear, popularManga, topRatedManga, trendingManga } from '../lib/catalog.js'
import { MANGA } from '../data/manga.js'
import { formatCompact, formatDate } from '../lib/format.js'
import { getManga } from '../data/manga.js'

const HERO_IDS = [
  'void-star-requiem',
  'azure-blade-senki',
  'ember-court',
  'kitchen-of-the-last-witch',
  'neon-samurai-2077',
  'thousand-crowns-requiem',
]

export default function Home() {
  const heroes = useMemo(() => HERO_IDS.map(getManga).filter(Boolean), [])
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const {
    isFavorite,
    toggleFavorite,
    isReading,
    toggleReading,
    progress,
    history,
    settings,
  } = useLibrary()

  useEffect(() => {
    if (paused) return undefined
    timer.current = window.setInterval(() => setSlide((s) => (s + 1) % heroes.length), 7000)
    return () => window.clearInterval(timer.current)
  }, [paused, heroes.length])

  const continueReading = useMemo(
    () =>
      history
        .slice()
        .sort((a, b) => (progress[b.id]?.stamp ?? b.stamp) - (progress[a.id]?.stamp ?? a.stamp))
        .map((entry) => ({ entry, manga: getManga(entry.id) }))
        .filter((item) => item.manga)
        .slice(0, 8),
    [history, progress],
  )

  const active = heroes[slide]
  const totalViews = MANGA.reduce((sum, m) => sum + m.views, 0)
  const totalChapters = MANGA.reduce((sum, m) => sum + m.chapterCount, 0)

  return (
    <div className="page home">
      <section
        className="hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="hero__bg" key={`bg-${active.id}`}>
          <MangaImage manga={active} variant="banner" priority />
        </div>
        <div className="hero__scrim" />
        <div className="hero__inner">
          <div className="hero__content" key={`copy-${active.id}`}>
            <span className="hero__eyebrow">
              <IconStar filled size={14} />
              #{slide + 1} Trending this week
            </span>
            <h1 className="hero__title">{active.title}</h1>
            <p className="hero__alt">{active.alternativeTitles.slice(0, 2).join(' · ')}</p>
            <div className="hero__meta">
              <span className="hero__rating">
                <IconStar filled size={15} />
                {active.rating.toFixed(2)}
              </span>
              <span>{active.status}</span>
              <span>{active.year}</span>
              <span>{active.chapterCount} chapters</span>
              <span>{formatCompact(active.views)} views</span>
            </div>
            <p className="hero__desc">{active.description}</p>
            <ul className="hero__genres">
              {active.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
            <div className="hero__actions">
              <Link to={`/manga/${active.id}`} className="btn btn--primary">
                <IconPlay size={16} />
                Start reading
              </Link>
              <button
                type="button"
                className={`btn btn--ghost ${isFavorite(active.id) ? 'is-on' : ''}`}
                onClick={() => toggleFavorite(active.id)}
              >
                <IconHeart filled={isFavorite(active.id)} size={16} />
                {isFavorite(active.id) ? 'Favorited' : 'Favorite'}
              </button>
              <button
                type="button"
                className={`btn btn--ghost ${isReading(active.id) ? 'is-on' : ''}`}
                onClick={() => toggleReading(active.id)}
              >
                <IconBookmark filled={isReading(active.id)} size={16} />
                {isReading(active.id) ? 'In list' : 'Reading list'}
              </button>
            </div>
            <p className="hero__update">
              Latest: <b>Chapter {active.latestChapterNumber}</b> · {formatDate(active.latestUpdate)}
            </p>
          </div>

          <div className="hero__stack" aria-hidden="true">
            {heroes.map((manga, i) => (
              <div
                key={manga.id}
                className={`hero__thumb ${i === slide ? 'is-active' : ''}`}
                style={{ '--i': i, '--n': heroes.length }}
              >
                <MangaImage manga={manga} variant="cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="hero__nav">
          <button type="button" onClick={() => setSlide((s) => (s - 1 + heroes.length) % heroes.length)} aria-label="Previous featured">
            <IconChevronLeft size={20} />
          </button>
          <div className="hero__dots">
            {heroes.map((manga, i) => (
              <button
                key={manga.id}
                type="button"
                className={i === slide ? 'is-active' : ''}
                onClick={() => setSlide(i)}
                aria-label={`Show ${manga.title}`}
              >
                <span />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setSlide((s) => (s + 1) % heroes.length)} aria-label="Next featured">
            <IconChevronRight size={20} />
          </button>
        </div>
      </section>

      <section className="statstrip">
        <StatCard label="Titles in catalogue" value={MANGA.length} hint="across every genre" />
        <StatCard label="Chapters indexed" value={formatCompact(totalChapters)} hint="full chapter lists" />
        <StatCard label="Combined views" value={formatCompact(totalViews)} hint="lifetime reads" />
        <StatCard label="Top score" value={topRatedManga(1)[0]?.rating.toFixed(2) ?? '—'} hint={topRatedManga(1)[0]?.title ?? ''} tone="brand" />
      </section>

      {continueReading.length ? (
        <section className="section">
          <SectionHeader
            eyebrow="Pick up where you left off"
            title="Continue reading"
            subtitle="Progress is saved on this device"
            to="/history"
          />
          <div className="contgrid">
            {continueReading.map(({ manga, entry }) => {
              const prog = progress[manga.id]
              return (
                <Link key={manga.id} to={`/manga/${manga.id}`} className="cont">
                  <MangaImage manga={manga} variant="cover" />
                  <div className="cont__body">
                    <h3>{manga.title}</h3>
                    <p>
                      Chapter {prog?.chapter ?? entry.chapter} of {manga.chapterCount}
                    </p>
                    <div className="bar">
                      <span style={{ width: `${prog?.percent ?? 3}%` }} />
                    </div>
                    <small>{prog?.percent ?? 0}% read</small>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ) : null}

      <MangaRail
        eyebrow="Most read"
        title="Popular now"
        subtitle="Ranked by total views across the catalogue"
        to="/popular"
        items={popularManga().map(getManga).slice(0, 18)}
      />

      <section className="section">
        <SectionHeader
          eyebrow="Just updated"
          title="Latest chapters"
          subtitle="Newest releases, updated daily"
          to="/latest"
          action={
            <Link to="/latest" className="linkmore">
              See all latest
              <span aria-hidden="true">→</span>
            </Link>
          }
        />
        <MangaGrid
          items={trendingManga(10).map(getManga)}
          emptyNode={
            <EmptyState title="Nothing new yet" message="Check back soon for fresh chapters." />
          }
        />
      </section>

      <MangaRail
        eyebrow="Critics' corner"
        title="Highest rated"
        subtitle="Community score, sorted by rating"
        to="/rankings"
        items={topRatedManga(18)}
      />

      <section className="section">
        <SectionHeader
          eyebrow="Explore"
          title="Browse by genre"
          subtitle="Jump into a mood, a trope, or a decade"
          to="/genres"
        />
        <div className="genreboard">
          {genreSlugs()
            .slice(0, 10)
            .map((genre) => (
              <Link key={genre.name} to={`/genres/${genre.slug}`} className="genreboard__card">
                {genre.top ? (
                  <div className="genreboard__art">
                    <MangaImage manga={genre.top} variant="banner" />
                  </div>
                ) : null}
                <div className="genreboard__overlay" />
                <div className="genreboard__copy">
                  <h3>{genre.name}</h3>
                  <p>{genre.count} series</p>
                </div>
                {genre.top ? <span className="genreboard__peek">{genre.top.title}</span> : null}
              </Link>
            ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Fresh ink" title="New this season" subtitle="Recently licensed series" to="/manga" />
        <MangaGrid items={newThisYear(10)} />
      </section>

      <MangaRail
        eyebrow="Hand-picked"
        title="Editor's selection"
        subtitle="High scores weighted by community reach"
        to="/rankings"
        items={editorPicks(18)}
      />

      {!settings.hideFinished ? (
        <section className="section">
          <SectionHeader eyebrow="Finish strong" title="Completed series" subtitle="Read from start to finish" to="/manga?status=Completed" />
          <MangaGrid items={MANGA.filter((m) => m.status === 'Completed').slice(0, 10)} />
        </section>
      ) : null}
    </div>
  )
}