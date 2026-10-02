import { useEffect, useMemo, useState } from 'react'
import { Link } from '../lib/router.jsx'
import MangaImage from '../components/MangaImage.jsx'
import { StatusPill } from '../components/MangaCard.jsx'
import { EmptyState, MangaRail, SectionHeader } from '../components/Layout.jsx'
import {
  IconBookmark,
  IconBook,
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconEye,
  IconHeart,
  IconHistory,
  IconPlay,
  IconStar,
  IconTag,
  IconUser,
} from '../components/icons.jsx'
import { getManga, MANGA } from '../data/manga.js'
import { formatCompact, formatDate, formatNumber, pad } from '../lib/format.js'
import { useLibrary } from '../lib/library.jsx'
import { byGenre, popularManga } from '../lib/catalog.js'

const CHAPTER_PAGE = 50

export default function MangaDetails({ id }) {
  const manga = getManga(id)
  const { recordVisit, isFavorite, toggleFavorite, isReading, toggleReading, isCompleted, toggleCompleted, progress, markProgress } =
    useLibrary()
  const [readerChapter, setReaderChapter] = useState(null)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState('desc')
  const [showAlt, setShowAlt] = useState(false)

  /* one history entry per opened title */
  useEffect(() => {
    if (manga) recordVisit(manga.id, 1)
  }, [manga, recordVisit])

  const chapters = useMemo(() => {
    if (!manga) return []
    return order === 'asc' ? manga.chapters : [...manga.chapters].reverse()
  }, [manga, order])

  const related = useMemo(() => {
    if (!manga) return []
    const scored = MANGA.filter((m) => m.id !== manga.id).map((m) => ({
      manga: m,
      score: m.genres.filter((g) => manga.genres.includes(g)).length * 10 + m.rating,
    }))
    return scored
      .sort((a, b) => b.score - a.score || b.manga.views - a.manga.views)
      .slice(0, 14)
      .map((s) => s.manga)
  }, [manga])

  if (!manga) {
    return (
      <div className="page">
        <EmptyState
          title="Series not found"
          message="This title is not in the catalogue."
          action={
            <Link to="/manga" className="btn btn--primary">
              Back to catalogue
            </Link>
          }
        />
      </div>
    )
  }

  const favourite = isFavorite(manga.id)
  const reading = isReading(manga.id)
  const done = isCompleted(manga.id)
  const prog = progress[manga.id]
  const totalPages = Math.ceil(manga.chapterCount / CHAPTER_PAGE)
  const currentPage = Math.min(page, totalPages)
  const slice = chapters.slice((currentPage - 1) * CHAPTER_PAGE, currentPage * CHAPTER_PAGE)

  const startReading = (chapterNumber) => {
    const chapter = manga.chapters.find((c) => c.number === chapterNumber)
    recordVisit(manga.id, chapterNumber)
    markProgress(manga.id, chapterNumber, manga.chapterCount)
    if (!reading) toggleReading(manga.id)
    setReaderChapter(chapter)
  }

  return (
    <div className="page detail">
      <nav className="crumbs">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/manga">Manga</Link>
        <span aria-hidden="true">/</span>
        {manga.genres.slice(0, 1).map((genre) => (
          <span key={genre}>
            <Link to={`/genres/${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{genre}</Link>
            <span aria-hidden="true">/</span>
          </span>
        ))}
        <span className="crumbs__now">{manga.title}</span>
      </nav>

      <section className="detail__hero">
        <div className="detail__banner" data-manga-id={manga.id}>
          <MangaImage manga={manga} variant="banner" priority />
          <div className="detail__bannerFade" />
        </div>

        <div className="detail__body">
          <div className="detail__cover">
            <MangaImage manga={manga} variant="cover" priority imgClassName="detail__coverImg" />
            <div className="detail__coverBadges">
              <span className="tagpill tagpill--rating">
                <IconStar filled size={13} />
                {manga.rating.toFixed(2)}
              </span>
              <span className="tagpill">{manga.type}</span>
            </div>
          </div>

          <div className="detail__info">
            <div className="detail__titleRow">
              <h1 className="detail__title">{manga.title}</h1>
              <button
                type="button"
                className="altToggle"
                onClick={() => setShowAlt((v) => !v)}
                aria-expanded={showAlt}
              >
                <IconTag size={14} />
                {showAlt ? 'Hide titles' : 'Alt titles'}
              </button>
            </div>

            {showAlt ? (
              <ul className="detail__alts">
                {manga.alternativeTitles.map((alt) => (
                  <li key={alt}>{alt}</li>
                ))}
              </ul>
            ) : (
              <p className="detail__alt">Also known as {manga.alternativeTitles[1] ?? manga.alternativeTitles[0]}</p>
            )}

            <div className="detail__badges">
              <StatusPill status={manga.status} />
              <span className="badge">
                <IconCalendar size={14} />
                {manga.year}
              </span>
              <span className="badge">
                <IconBook size={14} />
                {manga.chapterCount} chapters
              </span>
              {manga.licensed ? <span className="badge">Licensed</span> : null}
            </div>

            <div className="detail__people">
              <div>
                <span>
                  <IconUser size={14} /> Author
                </span>
                <Link to={`/manga?author=${encodeURIComponent(manga.author)}`}>{manga.author}</Link>
              </div>
              <div>
                <span>Artist</span>
                <Link to={`/manga?artist=${encodeURIComponent(manga.artist)}`}>{manga.artist}</Link>
              </div>
              <div>
                <span>Publisher</span>
                <b>{manga.publisher}</b>
              </div>
            </div>

            <div className="detail__stats">
              <div className="scorering" style={{ '--p': manga.scorePercent }}>
                <span>{manga.rating.toFixed(2)}</span>
              </div>
              <dl>
                <div>
                  <dt>Popularity</dt>
                  <dd>#{popularManga().indexOf(manga.id) + 1}</dd>
                </div>
                <div>
                  <dt>Views</dt>
                  <dd>{formatCompact(manga.views)}</dd>
                </div>
                <div>
                  <dt>Scores</dt>
                  <dd>{formatCompact(manga.scoreCount)}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatDate(manga.latestUpdate)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="detail__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={() => startReading(prog?.chapter ?? 1)}>
              <IconPlay size={17} />
              {prog ? `Continue ch. ${prog.chapter}` : 'Start reading'}
            </button>
            <button type="button" className="btn btn--primary btn--lg btn--outline" onClick={() => startReading(manga.latestChapterNumber)}>
              Latest chapter
            </button>
            <div className="detail__actionRow">
              <button
                type="button"
                className={`btn btn--ghost ${favourite ? 'is-on is-heart' : ''}`}
                onClick={() => toggleFavorite(manga.id)}
                aria-pressed={favourite}
              >
                <IconHeart filled={favourite} size={16} />
                {favourite ? 'Favorited' : 'Favorite'}
              </button>
              <button
                type="button"
                className={`btn btn--ghost ${reading ? 'is-on' : ''}`}
                onClick={() => toggleReading(manga.id)}
                aria-pressed={reading}
              >
                <IconBookmark filled={reading} size={16} />
                {reading ? 'In reading list' : 'Add to list'}
              </button>
              <button
                type="button"
                className={`btn btn--ghost ${done ? 'is-on is-done' : ''}`}
                onClick={() => toggleCompleted(manga.id)}
                aria-pressed={done}
              >
                <IconCheck size={16} />
                {done ? 'Completed' : 'Mark done'}
              </button>
            </div>
            {prog ? (
              <div className="detail__progress">
                <div className="bar">
                  <span style={{ width: `${prog.percent}%` }} />
                </div>
                <small>
                  Chapter {prog.chapter} of {manga.chapterCount} · {prog.percent}%
                </small>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="detail__genres">
        <h2>Genres</h2>
        <div className="chipwrap">
          {manga.genres.map((genre) => (
            <Link
              key={genre}
              className="chip chip--lg"
              to={`/genres/${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      <section className="detail__about">
        <h2>Synopsis</h2>
        <p>{manga.description}</p>
      </section>

      <section className="detail__chapters" id="chapters">
        <SectionHeader
          eyebrow="Chapters"
          title={`${formatNumber(manga.chapterCount)} chapters`}
          subtitle={`Newest update ${formatDate(manga.latestUpdate)}`}
          action={
            <div className="chapters__tools">
              <button type="button" className="pillbtn" onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}>
                {order === 'asc' ? 'Oldest first' : 'Newest first'}
              </button>
              <div className="seg seg--sm">
                {[1, ...Array.from({ length: totalPages }, (_, i) => i + 1)].filter(
                  (v, i, a) => a.indexOf(v) === i,
                )
                  .slice(0, 8)
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={n === currentPage ? 'is-active' : ''}
                      onClick={() => setPage(n)}
                    >
                      {n === 1 ? 'All' : n}
                    </button>
                  ))}
              </div>
            </div>
          }
        />

        <ul className="chapters">
          {slice.map((chapter) => (
            <li key={chapter.number} className={prog?.chapter === chapter.number ? 'is-current' : ''}>
              <button type="button" className="chapters__row" onClick={() => startReading(chapter.number)}>
                <span className="chapters__num">{pad(chapter.number, 3)}</span>
                <span className="chapters__info">
                  <b>{chapter.title}</b>
                  <em>
                    {chapter.pages} pages · {formatCompact(chapter.views)} reads
                  </em>
                </span>
                <span className="chapters__date">
                  {chapter.isNew ? <i>NEW</i> : null}
                  {formatDate(chapter.date)}
                </span>
                <span className="chapters__go">
                  <IconPlay size={14} />
                </span>
              </button>
            </li>
          ))}
        </ul>

        {totalPages > 1 ? (
          <nav className="pager" aria-label="Chapter pages">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              <IconChevronLeft size={15} /> Prev
            </button>
            <div className="pager__pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === currentPage ? 'is-active' : ''}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
              Next <IconChevronRight size={15} />
            </button>
          </nav>
        ) : null}
      </section>

      <MangaRail eyebrow="If you like this" title="Related series" items={related} />

      {manga.genres.slice(0, 2).map((genre) => (
        <MangaRail
          key={genre}
          eyebrow="More in this genre"
          title={genre}
          items={byGenre(genre, 14)}
          to={`/genres/${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        />
      ))}

      {readerChapter ? (
        <ReaderModal
          manga={manga}
          chapter={readerChapter}
          onClose={() => setReaderChapter(null)}
          onNavigate={(dir) => {
            const idx = manga.chapters.findIndex((c) => c.number === readerChapter.number)
            const next = manga.chapters[idx + dir]
            if (!next) return
            recordVisit(manga.id, next.number)
            markProgress(manga.id, next.number, manga.chapterCount)
            setReaderChapter(next)
          }}
        />
      ) : null}
    </div>
  )
}

function ReaderModal({ manga, chapter, onClose, onNavigate }) {
  const idx = manga.chapters.findIndex((c) => c.number === chapter.number)
  const pages = Array.from({ length: Math.min(chapter.pages, 6) }, (_, i) => i)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNavigate(1)
      if (event.key === 'ArrowLeft') onNavigate(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('has-modal')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('has-modal')
    }
  }, [onClose, onNavigate])

  return (
    <div className="reader" role="dialog" aria-modal="true" aria-label={`${manga.title} chapter ${chapter.number}`}>
      <div className="reader__bar">
        <Link to={`/manga/${manga.id}`} className="reader__back" onClick={onClose}>
          <IconClose size={18} />
        </Link>
        <div className="reader__title">
          <b>{manga.title}</b>
          <span>
            Chapter {chapter.number} · {chapter.title}
          </span>
        </div>
        <div className="reader__pager">
          <button type="button" onClick={() => onNavigate(-1)} disabled={idx <= 0}>
            <IconChevronLeft size={16} />
          </button>
          <span>
            {chapter.number} / {manga.chapterCount}
          </span>
          <button type="button" onClick={() => onNavigate(1)} disabled={idx >= manga.chapters.length - 1}>
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="reader__stage">
        {pages.map((p) => (
          <figure key={p} className="reader__page">
            <MangaImage manga={manga} variant="banner" imgClassName="reader__img" />
            <figcaption>
              {manga.title} · Chapter {chapter.number} · page {p + 1} of {chapter.pages}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="reader__foot">
        <p>
          <IconEye size={15} /> {formatCompact(chapter.views)} reads · {chapter.pages} pages · updated{' '}
          {formatDate(chapter.date)}
        </p>
        <div>
          <button type="button" className="btn btn--ghost" onClick={() => onNavigate(-1)} disabled={idx <= 0}>
            <IconChevronLeft size={15} /> Previous
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onNavigate(1)}
            disabled={idx >= manga.chapters.length - 1}
          >
            Next chapter <IconChevronRight size={15} />
          </button>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            <IconHistory size={15} /> Save & exit
          </button>
        </div>
      </div>
    </div>
  )
}