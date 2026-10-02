import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '../lib/router.jsx'
import { MangaCard } from './MangaCard.jsx'

export function SectionHeader({ eyebrow, title, subtitle, to, action, id }) {
  return (
    <header className="sec__head" id={id}>
      <div className="sec__titles">
        {eyebrow ? <span className="sec__eyebrow">{eyebrow}</span> : null}
        <h2 className="sec__title">{title}</h2>
        {subtitle ? <p className="sec__sub">{subtitle}</p> : null}
      </div>
      {action ??
        (to ? (
          <Link to={to} className="linkmore">
            View all
            <span aria-hidden="true">→</span>
          </Link>
        ) : null)}
    </header>
  )
}

export function MangaGrid({ items, skeletonCount = 0, emptyNode, className = '' }) {
  const skeletons = Array.from({ length: skeletonCount })
  if (!items.length && !skeletonCount) return emptyNode ?? null
  return (
    <div className={`mgrid ${className}`}>
      {items.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
      {skeletons.map((_, i) => (
        <div className="mcard mcard--skeleton" key={`skeleton-${i}`} aria-hidden="true">
          <div className="sk sk--art" />
          <div className="sk sk--line" style={{ width: '78%' }} />
          <div className="sk sk--line" style={{ width: '46%' }} />
          <div className="sk sk--line" style={{ width: '62%' }} />
        </div>
      ))}
    </div>
  )
}

export function MangaRail({ items, to, eyebrow, title, subtitle }) {
  const scroller = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setAtStart(el.scrollLeft <= 6)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 6)
  }, [])

  useEffect(() => {
    update()
    const el = scroller.current
    if (!el) return undefined
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update, items.length])

  const nudge = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.82), behavior: 'smooth' })
  }

  return (
    <section className="rail">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} to={to} />
      <div className="rail__wrap">
        <button
          type="button"
          className="rail__nav rail__nav--prev"
          onClick={() => nudge(-1)}
          disabled={atStart}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className="rail__track" ref={scroller}>
          {items.map((manga) => (
            <MangaCard key={manga.id} manga={manga} compact />
          ))}
        </div>
        <button
          type="button"
          className="rail__nav rail__nav--next"
          onClick={() => nudge(1)}
          disabled={atEnd}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  )
}

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty" role="status">
      <div className="empty__orb" aria-hidden="true">
        {icon ?? '◍'}
      </div>
      <h3 className="empty__title">{title}</h3>
      {message ? <p className="empty__msg">{message}</p> : null}
      {action}
    </div>
  )
}

export function StatCard({ label, value, hint, tone }) {
  return (
    <div className={`stat ${tone ? `stat--${tone}` : ''}`}>
      <span className="stat__label">{label}</span>
      <strong className="stat__value">{value}</strong>
      {hint ? <span className="stat__hint">{hint}</span> : null}
    </div>
  )
}