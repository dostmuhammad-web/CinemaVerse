import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MovieCard from './MovieCard.jsx'
import { Icon } from './Icons.jsx'
import { GridSkeleton } from './States.jsx'

export function MovieGrid({ movies, priorityCount = 6, skeleton = false, skeletonCount = 12, size = 'grid' }) {
  if (skeleton) return <GridSkeleton count={skeletonCount} />
  if (!movies.length) return null

  return (
    <div className="grid grid--cards" data-testid="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} priority={index < priorityCount} size={size} />
      ))}
    </div>
  )
}

/**
 * Chunked rendering for very long result sets: the grid only ever holds the
 * films already revealed, so 1000+ results never sit in the DOM at once.
 */
export function InfiniteGrid({ movies, step = 24, size = 'grid' }) {
  const sentinel = useRef(null)

  /* A new result set resets the revealed count during render rather than in an
     effect, so the grid never shows a stale chunk for a frame. */
  const [reveal, setReveal] = useState(() => ({ source: movies, count: step, done: false }))

  if (reveal.source !== movies) {
    setReveal({ source: movies, count: step, done: false })
  }

  const { count, done } = reveal
  const setCount = (updater) =>
    setReveal((current) => ({ ...current, count: typeof updater === 'function' ? updater(current.count) : updater }))

  const visible = useMemo(() => movies.slice(0, count), [movies, count])

  const loadMore = useCallback(() => {
    setCount((current) => {
      const next = Math.min(current + step, movies.length)
      if (next === current) setReveal((state) => ({ ...state, done: true }))
      return next
    })
  }, [movies.length, step])

  useEffect(() => {
    const node = sentinel.current
    if (!node || done || count >= movies.length) return undefined
    if (typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [count, done, loadMore, movies.length])

  return (
    <>
      <MovieGrid movies={visible} priorityCount={6} size={size} />
      <div className="infinite" ref={sentinel}>
        {count < movies.length ? (
          <button type="button" className="btn btn--ghost" onClick={loadMore}>
            <Icon name="chevronDown" size={18} />
            Load {Math.min(step, movies.length - count)} more
            <span className="infinite__count">
              {count.toLocaleString('en-US')} / {movies.length.toLocaleString('en-US')}
            </span>
          </button>
        ) : movies.length ? (
          <p className="infinite__end">
            <Icon name="check" size={16} />
            All {movies.length.toLocaleString('en-US')} films loaded
          </p>
        ) : null}
      </div>
    </>
  )
}

export default MovieGrid