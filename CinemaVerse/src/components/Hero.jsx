import { useCallback, useMemo, useState } from 'react'
import { Link, useInterval, useMediaQuery } from '../lib/router.jsx'
import { useLibrary } from '../lib/library.jsx'
import { formatCount, formatDuration, formatRating, ratingTier } from '../lib/format.js'
import SmartImage from './SmartImage.jsx'
import { Icon } from './Icons.jsx'

const AUTOPLAY_MS = 7200

/**
 * Home hero. Slides between a handful of top-ranked films, pauses on hover and
 * when the user prefers reduced motion, and cross-fades the backdrops.
 */
export default function Hero({ slides = [] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { isWatchlisted, toggleWatchlist, profile } = useLibrary()
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const reduceMotion = systemReduced || profile.reduceMotion
  const total = slides.length

  const go = useCallback(
    (next) => {
      if (!total) return
      setIndex(((next % total) + total) % total)
    },
    [total],
  )

  /* Clamp during render so a shrinking slide list never points past the end. */
  const active = total ? Math.min(index, total - 1) : 0

  useInterval(() => go(active + 1), reduceMotion ? 0 : AUTOPLAY_MS, !paused && total > 1)

  const current = slides[active]
  const saved = current ? isWatchlisted(current.id) : false

  const meta = useMemo(() => {
    if (!current) return []
    return [current.year, formatDuration(current.duration), `${current.country}`, current.language]
  }, [current])

  if (!current) return null

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured films"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero__media">
        {slides.map((slide, slideIndex) => (
          <div className={`hero__frame ${slideIndex === active ? 'is-active' : ''}`.trim()} key={slide.id}>
            <SmartImage
              src={slide.backdrop}
              alt={`${slide.title} backdrop`}
              ratio="16 / 9"
              priority={slideIndex === 0}
              width={1600}
              className="hero__image"
            />
          </div>
        ))}
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
      </div>

      <div className="hero__content page">
        <p className="hero__eyebrow">
          <span className="hero__badge">
            <Icon name="sparkle" size={13} />
            Featured
          </span>
          {current.genres.slice(0, 3).join(' · ')}
        </p>

        <h1 className="hero__title">{current.title}</h1>
        {current.originalTitle !== current.title ? (
          <p className="hero__original">{current.originalTitle}</p>
        ) : null}

        <ul className="hero__meta">
          <li className={`chip chip--rating chip--${ratingTier(current.rating)}`}>
            <Icon name="star" size={13} />
            {formatRating(current.rating)}
          </li>
          {meta.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li className="hero__votes">{formatCount(current.votes)} ratings</li>
        </ul>

        <p className="hero__tagline">{current.tagline}</p>
        <p className="hero__description">{truncate(current.description, 240)}</p>

        <div className="hero__buttons">
          <Link className="btn btn--primary" to={`/movie/${current.slug}`}>
            <Icon name="eye" size={18} />
            View details
          </Link>
          <button
            type="button"
            className={`btn btn--outline ${saved ? 'is-active' : ''}`.trim()}
            onClick={() => toggleWatchlist(current.id)}
            aria-pressed={saved}
          >
            <Icon name={saved ? 'check' : 'plus'} size={18} />
            {saved ? 'In watchlist' : 'Add to watchlist'}
          </button>
          <Link className="btn btn--ghost" to={`/movie/${current.slug}#trailer`}>
            <Icon name="play" size={16} />
            Trailer
          </Link>
        </div>
      </div>

      {total > 1 ? (
        <div className="hero__controls page">
          <button type="button" className="hero__arrow" onClick={() => go(index - 1)} aria-label="Previous film">
            <Icon name="chevronLeft" size={20} />
          </button>
          <div className="hero__dots" role="tablist" aria-label="Choose a featured film">
            {slides.map((slide, slideIndex) => (
              <button
                type="button"
                role="tab"
                key={slide.id}
                aria-selected={slideIndex === index}
                aria-label={`Show ${slide.title}`}
                className={`hero__dot ${slideIndex === active ? 'is-active' : ''}`.trim()}
                onClick={() => go(slideIndex)}
              >
                <span className="hero__dot-fill" style={reduceMotion ? undefined : { animationDuration: `${AUTOPLAY_MS}ms` }} />
              </button>
            ))}
          </div>
          <button type="button" className="hero__arrow" onClick={() => go(index + 1)} aria-label="Next film">
            <Icon name="chevronRight" size={20} />
          </button>
        </div>
      ) : null}
    </section>
  )
}

function truncate(text, limit) {
  if (text.length <= limit) return text
  return `${text.slice(0, text.lastIndexOf(' ', limit))}…`
}