import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GENRES, MOVIES_BY_ID } from './catalog.js'
import { readValue, writeValue, clearAll } from './storage.js'

const HISTORY_LIMIT = 240

const DEFAULT_PROFILE = {
  displayName: 'Guest Curator',
  tagline: 'Browsing the full catalogue',
  favouriteGenres: ['Drama'],
  joinedAt: null,
  reduceMotion: false,
  compactPosters: false,
}

const LibraryContext = createContext(null)

/** Watches a slice of state and mirrors it into localStorage. */
function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = readValue(key, null)
    if (stored == null) return typeof initial === 'function' ? initial() : initial
    return stored
  })

  useEffect(() => {
    writeValue(key, value)
  }, [key, value])

  return [value, setValue]
}

export function LibraryProvider({ children }) {
  const [watchlist, setWatchlist] = usePersistedState('watchlist', [])
  const [history, setHistory] = usePersistedState('history', [])
  const [profile, setProfile] = usePersistedState('profile', DEFAULT_PROFILE)

  const watchlistSet = useMemo(() => new Set(watchlist), [watchlist])

  const isWatchlisted = useCallback((movieOrId) => {
    const id = typeof movieOrId === 'string' ? movieOrId : movieOrId?.id
    return watchlistSet.has(id)
  }, [watchlistSet])

  const toggleWatchlist = useCallback((movieOrId) => {
    const id = typeof movieOrId === 'string' ? movieOrId : movieOrId?.id
    if (!id) return
    setWatchlist((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [id, ...current],
    )
  }, [setWatchlist])

  const clearWatchlist = useCallback(() => setWatchlist([]), [setWatchlist])

  /** Most-recent-first, one entry per film, capped. */
  const recordVisit = useCallback(
    (movieOrId) => {
      const id = typeof movieOrId === 'string' ? movieOrId : movieOrId?.id
      if (!id) return
      setHistory((current) => {
        const rest = current.filter((entry) => entry.id !== id)
        return [{ id, at: Date.now() }, ...rest].slice(0, HISTORY_LIMIT)
      })
    },
    [setHistory],
  )

  const removeFromHistory = useCallback(
    (movieOrId) => {
      const id = typeof movieOrId === 'string' ? movieOrId : movieOrId?.id
      setHistory((current) => current.filter((entry) => entry.id !== id))
    },
    [setHistory],
  )

  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  const updateProfile = useCallback(
    (patch) => setProfile((current) => ({ ...current, ...patch })),
    [setProfile],
  )

  const toggleFavouriteGenre = useCallback(
    (genre) =>
      setProfile((current) => ({
        ...current,
        favouriteGenres: current.favouriteGenres.includes(genre)
          ? current.favouriteGenres.filter((entry) => entry !== genre)
          : [...current.favouriteGenres, genre],
      })),
    [setProfile],
  )

  const resetProfile = useCallback(() => setProfile({ ...DEFAULT_PROFILE, joinedAt: Date.now() }), [setProfile])

  const resetEverything = useCallback(() => {
    setWatchlist([])
    setHistory([])
    setProfile({ ...DEFAULT_PROFILE, joinedAt: Date.now() })
    clearAll()
  }, [setProfile, setWatchlist, setHistory])

  /* Preference toggles have to reach the document, not just React. */
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('reduce-motion', Boolean(profile.reduceMotion))
    root.classList.toggle('compact-posters', Boolean(profile.compactPosters))
  }, [profile.reduceMotion, profile.compactPosters])

  const watched = useMemo(
    () => watchlist.map((id) => MOVIES_BY_ID.get(id)).filter(Boolean),
    [watchlist],
  )

  const historyMovies = useMemo(
    () => history.map((entry) => ({ ...MOVIES_BY_ID.get(entry.id), visitedAt: entry.at })).filter((movie) => movie.id),
    [history],
  )

  const stats = useMemo(() => {
    const tally = new Map()
    let runtime = 0
    let rated = 0

    watched.forEach((movie) => {
      runtime += movie.duration
      rated += movie.rating
      movie.genres.forEach((genre) => tally.set(genre, (tally.get(genre) ?? 0) + 1))
    })

    const genreBreakdown = [...tally.entries()]
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre))

    return {
      watchlist: watched.length,
      watchedRuntime: runtime,
      averageRating: watched.length ? rated / watched.length : 0,
      topGenres: genreBreakdown.slice(0, 4),
      historyCount: history.length,
      genreCoverage: genreBreakdown.length,
      catalogueSize: MOVIES_BY_ID.size,
      favouriteGenres: profile.favouriteGenres,
    }
  }, [watched, history, profile.favouriteGenres])

  const suggestions = useMemo(() => {
    if (!watchlist.length) return []
    const seen = new Set()
    for (const movie of watched) movie.genres.forEach((genre) => seen.add(genre))
    profile.favouriteGenres.forEach((genre) => seen.add(genre))
    return GENRES.filter((genre) => !seen.has(genre.value))
      .slice(0, 5)
      .map((genre) => genre.value)
  }, [watchlist.length, watched, profile.favouriteGenres])

  const value = useMemo(
    () => ({
      watchlist,
      watched,
      history,
      historyMovies,
      profile,
      stats,
      suggestions,
      isWatchlisted,
      toggleWatchlist,
      clearWatchlist,
      recordVisit,
      removeFromHistory,
      clearHistory,
      updateProfile,
      toggleFavouriteGenre,
      resetProfile,
      resetEverything,
    }),
    [
      watchlist,
      watched,
      history,
      historyMovies,
      profile,
      stats,
      suggestions,
      isWatchlisted,
      toggleWatchlist,
      clearWatchlist,
      recordVisit,
      removeFromHistory,
      clearHistory,
      updateProfile,
      toggleFavouriteGenre,
      resetProfile,
      resetEverything,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary must be used inside <LibraryProvider>')
  return context
}

export { DEFAULT_PROFILE }