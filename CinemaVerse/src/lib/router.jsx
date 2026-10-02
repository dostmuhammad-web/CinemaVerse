import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

const BASE = '#'

/* ------------------------------------------------------------------ */
/* location                                                            */
/* ------------------------------------------------------------------ */

function readHash() {
  if (typeof window === 'undefined') return '/'
  const raw = window.location.hash.slice(1)
  if (!raw) return '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

function subscribe(onChange) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function parseRoute(hash) {
  const [rawPath, rawQuery = ''] = hash.split('?')
  const path = rawPath.replace(/\/+$/, '') || '/'
  const segments = path.split('/').filter(Boolean).map(decodeURIComponent)
  const query = {}
  new URLSearchParams(rawQuery).forEach((value, key) => {
    if (key in query) {
      query[key] = Array.isArray(query[key]) ? [...query[key], value] : [query[key], value]
    } else {
      query[key] = value
    }
  })
  return { path, segments, query, hash }
}

const LocationContext = createContext({ path: '/', segments: [], query: {}, hash: '/' })

export function RouterProvider({ children }) {
  const hash = useSyncExternalStore(subscribe, readHash, () => '/')
  const location = useMemo(() => parseRoute(hash), [hash])
  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
}

export function useRouter() {
  const location = useContext(LocationContext)

  const navigate = useCallback((to, options = {}) => {
    const target = to.startsWith('#') ? to.slice(1) : to
    const next = `${BASE}${target}`
    if (options.replace) {
      window.history.replaceState(null, '', next)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      return
    }
    if (window.location.hash === next) {
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      return
    }
    window.location.hash = next
  }, [])

  const setQuery = useCallback(
    (patch, options = {}) => {
      const params = new URLSearchParams(location.hash.split('?')[1] ?? '')
      Object.entries(patch).forEach(([key, value]) => {
        params.delete(key)
        if (value === undefined || value === null || value === '') return
        if (Array.isArray(value)) value.forEach((entry) => entry !== '' && params.append(key, entry))
        else params.set(key, value)
      })
      const qs = params.toString()
      navigate(qs ? `${location.path}?${qs}` : location.path, options)
    },
    [location.hash, location.path, navigate],
  )

  return { ...location, navigate, setQuery }
}

/**
 * Named access to the current path: `useParams('/movie/:slug')` → `{ slug }`.
 * Values arrive already decoded by parseRoute.
 */
export function useParams(pattern) {
  const { segments } = useRouter()
  const params = useMemo(() => {
    const names = pattern.split('/').filter(Boolean)
    const result = {}
    names.forEach((name, index) => {
      if (name.startsWith(':')) result[name.slice(1)] = segments[index] ?? ''
    })
    return result
  }, [pattern, segments])
  return params
}

export function Link({ to, children, className, onClick, ...rest }) {
  const { navigate } = useRouter()
  const target = to.startsWith('/') ? to : `/${to}`

  const handleClick = (event) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return
    event.preventDefault()
    navigate(target)
  }

  return (
    <a href={`${BASE}${target}`} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* behaviour hooks                                                     */
/* ------------------------------------------------------------------ */

/** Scrolls to top when the pathname changes; query-only changes keep position. */
export function ScrollToTop() {
  const { path } = useRouter()
  const previous = useRef(path)
  useEffect(() => {
    if (previous.current !== path) {
      window.scrollTo({ top: 0 })
      previous.current = path
    }
  }, [path])
  return null
}

export function useDebounced(value, delay = 140) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

/** Locks body scroll while `locked` is true (mobile nav, modals). */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

/**
 * Tracks a media query. Used for layout switching and to reduce the poster
 * width the browser has to fetch on small screens.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/**
 * True once the element has scrolled near the viewport — drives lazy image
 * loading and the infinite-scroll sentinel.
 */
export function useNearViewport(ref, { rootMargin = '400px 0px', once = true } = {}) {
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')
  const seen = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (typeof IntersectionObserver === 'undefined') return undefined
    if (seen.current && once) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setNear(true)
          seen.current = true
          if (once) observer.disconnect()
        } else if (!once) {
          setNear(false)
        }
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, rootMargin, once])

  return near
}

/** Ticks every `ms` while `active`, for the hero slider. */
export function useInterval(callback, ms, active = true) {
  const saved = useRef(callback)
  useEffect(() => {
    saved.current = callback
  }, [callback])
  useEffect(() => {
    if (!active || ms <= 0) return undefined
    const id = window.setInterval(() => saved.current(), ms)
    return () => window.clearInterval(id)
  }, [ms, active])
}