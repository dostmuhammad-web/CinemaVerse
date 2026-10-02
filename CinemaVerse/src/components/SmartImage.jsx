import { memo, useRef, useState } from 'react'
import { useNearViewport } from '../lib/router.jsx'
import { Icon } from './Icons.jsx'

/**
 * Image with lazy loading, a shimmering placeholder and a real fallback.
 *
 * `priority` skips the observer (used by the hero, which is above the fold), and
 * `sizes`/`width` let the browser pick a sensible decode size for SVG posters so
 * a grid of 24 cards does not paint 24 full-size rasters.
 */
function SmartImage({
  src,
  alt,
  className = '',
  ratio = '2 / 3',
  priority = false,
  width,
  height = 0,
  label,
}) {
  const holder = useRef(null)
  const inView = useNearViewport(holder, { rootMargin: '500px 0px' })

  /* `state` is derived from the props that gate loading, so a new src or a
     priority change resets it during render instead of through an effect. */
  const idle = !priority && !inView
  const [tracked, setTracked] = useState(() => ({
    src,
    idle,
    state: idle ? 'idle' : 'loading',
  }))

  if (tracked.src !== src || tracked.idle !== idle) {
    setTracked({ src, idle, state: idle ? 'idle' : 'loading' })
  }

  const state = tracked.state
  const patch = (next) =>
    setTracked((current) => ({
      ...current,
      state: typeof next === 'function' ? next(current.state) : next,
    }))

  const failed = state === 'error'

  return (
    <div ref={holder} className={`media ${className}`.trim()} style={{ aspectRatio: ratio }}>
      <div className="media__state" aria-hidden="true" data-state={state} />
      {failed ? (
        <div className="media__fallback" role="img" aria-label={`${alt} — artwork unavailable`}>
          <Icon name="film" size={26} />
          <span>{label || alt}</span>
        </div>
      ) : null}
      {!failed && state !== 'idle' ? (
        <img
          className="media__img"
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width={width}
          height={height || undefined}
          data-state={state}
          onLoad={() => patch('loaded')}
          onError={() => patch('error')}
        />
      ) : null}
    </div>
  )
}

export default memo(SmartImage)