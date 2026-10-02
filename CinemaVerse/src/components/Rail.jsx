import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '../lib/router.jsx'
import { Icon } from './Icons.jsx'
import MovieCard from './MovieCard.jsx'
import { RailSkeleton } from './States.jsx'

/**
 * Horizontally scrolling shelf. Arrows appear on hover on pointer devices and are
 * always available on touch, where the track simply snaps.
 */
export default function Rail({ title, subtitle, to, movies = [], loading = false, size = 'grid', seeAll = true }) {
  const track = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const node = track.current
    if (!node) return
    const { scrollLeft, scrollWidth, clientWidth } = node
    setEdges({
      start: scrollLeft <= 4,
      end: scrollLeft + clientWidth >= scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    measure()
    const node = track.current
    if (!node) return undefined

    node.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      node.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure, movies.length])

  const nudge = (direction) => {
    const node = track.current
    if (!node) return
    const distance = Math.max(node.clientWidth * 0.82, 240)
    node.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  return (
    <section className="rail" aria-label={title}>
      <header className="rail__head">
        <div>
          <h2 className="rail__title">{title}</h2>
          {subtitle ? <p className="rail__subtitle">{subtitle}</p> : null}
        </div>
        <div className="rail__tools">
          <button
            type="button"
            className="rail__arrow"
            onClick={() => nudge(-1)}
            disabled={edges.start}
            aria-label={`Scroll ${title} left`}
          >
            <Icon name="chevronLeft" size={18} />
          </button>
          <button
            type="button"
            className="rail__arrow"
            onClick={() => nudge(1)}
            disabled={edges.end}
            aria-label={`Scroll ${title} right`}
          >
            <Icon name="chevronRight" size={18} />
          </button>
          {seeAll && to ? (
            <Link className="rail__all" to={to}>
              See all
              <Icon name="arrowRight" size={16} />
            </Link>
          ) : null}
        </div>
      </header>

      {loading ? (
        <RailSkeleton />
      ) : (
        <div className="rail__wrap">
          <div className={`rail__fade rail__fade--start ${edges.start ? 'is-hidden' : ''}`.trim()} aria-hidden="true" />
          <div className="rail__track" ref={track}>
            {movies.map((movie, index) => (
              <div className="rail__item" key={movie.id}>
                <MovieCard movie={movie} size={size} priority={index < 4} rank={index + 1} />
              </div>
            ))}
          </div>
          <div className={`rail__fade rail__fade--end ${edges.end ? 'is-hidden' : ''}`.trim()} aria-hidden="true" />
        </div>
      )}
    </section>
  )
}