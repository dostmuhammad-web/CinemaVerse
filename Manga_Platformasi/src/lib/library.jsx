import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEYS = {
  favorites: 'mv.favorites',
  reading: 'mv.reading',
  completed: 'mv.completed',
  history: 'mv.history',
  progress: 'mv.progress',
  settings: 'mv.settings',
}

const HISTORY_LIMIT = 80

export const DEFAULT_SETTINGS = {
  theme: 'noir',
  accent: 'violet',
  density: 'comfortable',
  showAltTitles: true,
  hoverPreview: true,
  reduceMotion: false,
  blurSensitive: false,
  defaultSort: 'latest',
  resultsPerPage: 24,
  hideFinished: false,
}

function read(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable вЂ” state stays in memory for the session */
  }
}

function storageAvailable() {
  try {
    const probe = 'mv.__probe'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

function toggle(list, id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [id, ...list]
}

const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {
  const [favorites, setFavorites] = useState(() => read(KEYS.favorites, []))
  const [reading, setReading] = useState(() => read(KEYS.reading, []))
  const [completed, setCompleted] = useState(() => read(KEYS.completed, []))
  const [history, setHistory] = useState(() => read(KEYS.history, []))
  const [progress, setProgress] = useState(() => read(KEYS.progress, {}))
  const [settings, setSettingsState] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...read(KEYS.settings, {}),
  }))
  const [canPersist] = useState(storageAvailable)

  useEffect(() => {
    if (!canPersist) return
    write(KEYS.favorites, favorites)
  }, [favorites, canPersist])
  useEffect(() => {
    if (!canPersist) return
    write(KEYS.reading, reading)
  }, [reading, canPersist])
  useEffect(() => {
    if (!canPersist) return
    write(KEYS.completed, completed)
  }, [completed, canPersist])
  useEffect(() => {
    if (!canPersist) return
    write(KEYS.history, history)
  }, [history, canPersist])
  useEffect(() => {
    if (!canPersist) return
    write(KEYS.progress, progress)
  }, [progress, canPersist])
  useEffect(() => {
    if (!canPersist) return
    write(KEYS.settings, settings)
  }, [settings, canPersist])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = settings.theme
    root.dataset.accent = settings.accent
    root.dataset.density = settings.density
    root.dataset.motion = settings.reduceMotion ? 'reduced' : 'full'
    root.classList.toggle('alt-titles', settings.showAltTitles)
    root.classList.toggle('hover-preview', settings.hoverPreview)
    root.classList.toggle('blur-sensitive', settings.blurSensitive)
  }, [settings])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])
  const isReading = useCallback((id) => reading.includes(id), [reading])
  const isCompleted = useCallback((id) => completed.includes(id), [completed])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => toggle(prev, id))
  }, [])

  const toggleReading = useCallback((id) => {
    setReading((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      return [id, ...prev.filter((item) => item !== id)]
    })
    setCompleted((prev) => prev.filter((item) => item !== id))
  }, [])

  const toggleCompleted = useCallback((id) => {
    setCompleted((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]
      if (next.includes(id)) setReading((r) => r.filter((item) => item !== id))
      return next
    })
  }, [])

  const removeFromList = useCallback((listName, id) => {
    const setter = { favorites: setFavorites, reading: setReading, completed: setCompleted }[listName]
    setter?.((prev) => prev.filter((item) => item !== id))
  }, [])

  const clearList = useCallback(
    (listName) => {
      const setter = { favorites: setFavorites, reading: setReading, completed: setCompleted }[listName]
      setter?.([])
    },
    [],
  )

  const clearHistory = useCallback(() => setHistory([]), [])

  const recordVisit = useCallback((id, chapter) => {
    setHistory((prev) => {
      const entry = {
        id,
        chapter: chapter ?? 1,
        at: new Date().toISOString().slice(0, 10),
        stamp: Date.now(),
      }
      return [entry, ...prev.filter((item) => item.id !== id)].slice(0, HISTORY_LIMIT)
    })
  }, [])

  const markProgress = useCallback((id, chapter, total) => {
    setProgress((prev) => ({
      ...prev,
      [id]: {
        chapter,
        total,
        percent: total ? Math.min(100, Math.round((chapter / total) * 100)) : 0,
        stamp: Date.now(),
      },
    }))
  }, [])

  const updateSetting = useCallback((patch) => {
    setSettingsState((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetSettings = useCallback(() => setSettingsState(DEFAULT_SETTINGS), [])

  const exportLibrary = useCallback(
    () =>
      JSON.stringify(
        { favorites, reading, completed, history, progress, settings, version: 1 },
        null,
        2,
      ),
    [favorites, reading, completed, history, progress, settings],
  )

  const value = useMemo(
    () => ({
      favorites,
      reading,
      completed,
      history,
      progress,
      settings,
      storageAvailable: canPersist,
      counts: {
        favorites: favorites.length,
        reading: reading.length,
        completed: completed.length,
        history: history.length,
      },
      isFavorite,
      isReading,
      isCompleted,
      toggleFavorite,
      toggleReading,
      toggleCompleted,
      removeFromList,
      clearList,
      clearHistory,
      recordVisit,
      markProgress,
      updateSetting,
      resetSettings,
      exportLibrary,
    }),
    [
      favorites,
      reading,
      completed,
      history,
      progress,
      settings,
      canPersist,
      isFavorite,
      isReading,
      isCompleted,
      toggleFavorite,
      toggleReading,
      toggleCompleted,
      removeFromList,
      clearList,
      clearHistory,
      recordVisit,
      markProgress,
      updateSetting,
      resetSettings,
      exportLibrary,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>')
  return ctx
}