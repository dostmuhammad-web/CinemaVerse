import { memo } from 'react'
import { Link } from '../lib/router.jsx'
import { formatCompact, formatDateShort } from '../lib/format.js'
import MangaImage from './MangaImage.jsx'
import { IconBookmark, IconCheck, IconHeart, IconStar } from './icons.jsx'
import { useLibrary } from '../lib/library.jsx'

export function Rating({ value, count, size = 'md', showCount = true }) {
  const rounded = Math.round(value * 100) / 100
  return (
    <span className={`rating rating--${size}`} title={`${rounded} out of 10`}>
      <IconStar filled size={size === 'sm' ? 13 : 15} className="rating__star" />
      <b>{rounded.toFixed(2)}</b>
      {showCount && count ? <i>{formatCompact(count)}</i> : null}
    </span>
  )
}

export function StatusPill({ status }) {
  return (
    <span className={`pill pill--${status.toLowerCase()}`}>
      <i className="pill__dot" />
      {status}
    </span>
  )
}

function MangaCardBase({ manga, compact = false }) {
  const { isFavorite, toggleFavorite, isReading, toggleReading, isCompleted, toggleCompleted, progress } =
    useLibrary()
  const favourite = isFavorite(manga.id)
  const reading = isReading(manga.id)
  const done = isCompleted(manga.id)
  const prog = progress[manga.id]

  return (
    <article className={`mcard ${compact ? 'mcard--compact' : ''}`} data-manga-id={manga.id}>
      <Link to={`/manga/${manga.id}`} className="mcard__link" aria-label={`${manga.title} details`}>
        <div className="mcard__art">
          <MangaImage manga={manga} variant="cover" priority={manga.index < 6} />
          <div className="mcard__rank" aria-hidden="true">
            {String(manga.index + 1).padStart(2, '0')}
          </div>
          <span className={`pill pill--float pill--${manga.status.toLowerCase()}`}>{manga.status}</span>
          {prog ? (
            <div className="mcard__progress" title={`Chapter ${prog.chapter} of ${prog.total}`}>
              <span style={{ width: `${prog.percent}%` }} />
            </div>
          ) : null}
          <div className="mcard__actions">
            <button
              type="button"
              className={`iconbtn ${favourite ? 'is-on is-heart' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(manga.id)
              }}
              aria-pressed={favourite}
              aria-label={favourite ? 'Remove from favorites' : 'Add to favorites'}
              title={favourite ? 'In favorites' : 'Add to favorites'}
            >
              <IconHeart filled={favourite} size={17} />
            </button>
            <button
              type="button"
              className={`iconbtn ${reading ? 'is-on' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleReading(manga.id)
              }}
              aria-pressed={reading}
              aria-label={reading ? 'Remove from reading list' : 'Add to reading list'}
              title={reading ? 'In reading list' : 'Add to reading list'}
            >
              <IconBookmark filled={reading} size={17} />
            </button>
            <button
              type="button"
              className={`iconbtn ${done ? 'is-on is-done' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleCompleted(manga.id)
              }}
              aria-pressed={done}
              aria-label={done ? 'Mark as not completed' : 'Mark as completed'}
              title={done ? 'Completed' : 'Mark completed'}
            >
              <IconCheck size={17} />
            </button>
          </div>
        </div>

        <div className="mcard__body">
          <h3 className="mcard__title" title={manga.title}>
            {manga.title}
          </h3>
          <p className="mcard__alt">{manga.alternativeTitles[0]}</p>
          <div className="mcard__meta">
            <Rating value={manga.rating} count={manga.scoreCount} size="sm" />
            <span className="mcard__chapter">
              Ch. {manga.latestChapterNumber}
              <em>{formatDateShort(manga.latestUpdate)}</em>
            </span>
          </div>
          <ul className="mcard__genres">
            {manga.genres.slice(0, 3).map((genre) => (
              <li key={genre}>{genre}</li>
            ))}
            {manga.genres.length > 3 ? <li className="more">+{manga.genres.length - 3}</li> : null}
          </ul>
          <p className="mcard__stats">
            <span>{formatCompact(manga.views)} views</span>
            <span>{manga.chapterCount} chapters</span>
            <span>{manga.year}</span>
          </p>
        </div>
      </Link>
    </article>
  )
}

export const MangaCard = memo(MangaCardBase)

function MangaRowBase({ manga, index }) {
  const { isFavorite, toggleFavorite, isReading, toggleReading, progress } = useLibrary()
  const favourite = isFavorite(manga.id)
  const reading = isReading(manga.id)
  const prog = progress[manga.id]

  return (
    <article className="mrow" data-manga-id={manga.id}>
      <Link to={`/manga/${manga.id}`} className="mrow__link">
        {typeof index === 'number' ? <span className="mrow__index">{index + 1}</span> : null}
        <MangaImage manga={manga} variant="cover" className="mrow__art" imgClassName="mrow__img" />
        <div className="mrow__body">
          <h3 className="mrow__title">{manga.title}</h3>
          <p className="mrow__alt">{manga.alternativeTitles.slice(0, 2).join(' · ')}</p>
          <p className="mrow__desc">{manga.description}</p>
          <div className="mrow__tags">
            {manga.genres.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>
        </div>
        <dl className="mrow__facts">
          <div>
            <dt>Rating</dt>
            <dd>{manga.rating.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{manga.status}</dd>
          </div>
          <div>
            <dt>Chapters</dt>
            <dd>{manga.chapterCount}</dd>
          </div>
          <div>
            <dt>Views</dt>
            <dd>{formatCompact(manga.views)}</dd>
          </div>
        </dl>
        <div className="mrow__side">
          <Rating value={manga.rating} count={manga.scoreCount} size="sm" />
          <span className="mrow__chapter">
            Ch. {manga.latestChapterNumber} · {formatDateShort(manga.latestUpdate)}
          </span>
          {prog ? (
            <div className="mcard__progress mcard__progress--wide">
              <span style={{ width: `${prog.percent}%` }} />
            </div>
          ) : null}
          <div className="mrow__buttons">
            <button
              type="button"
              className={`pillbtn ${favourite ? 'is-on is-heart' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite(manga.id)
              }}
            >
              <IconHeart filled={favourite} size={15} /> {favourite ? 'Saved' : 'Favorite'}
            </button>
            <button
              type="button"
              className={`pillbtn ${reading ? 'is-on' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                toggleReading(manga.id)
              }}
            >
              <IconBookmark filled={reading} size={15} /> {reading ? 'In list' : 'Plan'}
            </button>
          </div>
        </div>
      </Link>
    </article>
  )
}

export const MangaRow = memo(MangaRowBase)