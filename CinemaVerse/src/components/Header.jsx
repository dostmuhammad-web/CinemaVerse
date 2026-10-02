import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useDebounced, useRouter, useScrollLock } from '../lib/router.jsx'
import { useLibrary } from '../lib/library.jsx'
import { suggestMovies } from '../lib/search.js'
import { formatRating } from '../lib/format.js'
import { Icon, Logo } from './Icons.jsx'
import SmartImage from './SmartImage.jsx'

const NAV = [
  { to: '/', label: 'Home', match: (path) => path === '/' },
  { to: '/movies', label: 'Movies', match: (path) => path === '/movies' || path.startsWith('/genre') || path.startsWith('/country') },
  { to: '/trending', label: 'Trending', match: (path) => path === '/trending' },
  { to: '/popular', label: 'Popular', match: (path) => path === '/popular' },
  { to: '/new-releases', label: 'New Releases', match: (path) => path === '/new-releases' },
  { to: '/genres', label: 'Genres', match: (path) => path === '/genres' },
  { to: '/countries', label: 'Countries', match: (path) => path === '/countries' },
  { to: '/watchlist', label: 'My List', match: (path) => path === '/watchlist' || path === '/history' },
]

/** Debounced, instant film + people search with keyboard navigation. */
function SearchBox({ onNavigate }) {
  const { navigate } = useRouter()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState({ term: '', index: -1 })
  const debounced = useDebounced(value, 130)
  const boxRef = useRef(null)

  const suggestions = useMemo(() => {
    if (debounced.trim().length < 2) return null
    const found = suggestMovies(debounced.trim(), 6)
    return Array.isArray(found?.films) ? found : null
  }, [debounced])

  const cursorIndex = cursor.term === debounced ? cursor.index : -1

  const rows = useMemo(() => {
    if (!suggestions) return []
    return [
      ...suggestions.films.map((movie) => ({ kind: 'film', label: movie.title, movie })),
      ...suggestions.people.map((person) => ({ kind: person.kind, label: person.label, movie: person.movie })),
    ]
  }, [suggestions])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const submit = useCallback(
    (term) => {
      const query = (term ?? value).trim()
      if (!query) return
      setOpen(false)
      navigate(`/search?q=${encodeURIComponent(query)}`)
      onNavigate?.()
    },
    [value, navigate, onNavigate],
  )

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (cursorIndex >= 0 && rows[cursorIndex]) {
        const row = rows[cursorIndex]
        setOpen(false)
        navigate(row.kind === 'film' ? `/movie/${row.movie.slug}` : `/search?q=${encodeURIComponent(row.label)}`)
        onNavigate?.()
      } else {
        submit()
      }
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!rows.length) return
      event.preventDefault()
      setCursor((current) => {
        const from = current.term === debounced ? current.index : -1
        const next = event.key === 'ArrowDown' ? from + 1 : from - 1
        const wrapped = next < 0 ? rows.length - 1 : next >= rows.length ? 0 : next
        return { term: debounced, index: wrapped }
      })
    }
  }

  const showPanel = open && debounced.trim().length >= 2

  return (
    <div className="searchbox" ref={boxRef}>
      <form
        className="searchbox__form"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        role="search"
      >
        <Icon name="search" size={17} className="searchbox__icon" />
        <input
          type="search"
          value={value}
          placeholder="Search 1,040 films, people, genres…"
          aria-label="Search the catalogue"
          onChange={(event) => {
            setValue(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {value ? (
          <button type="button" className="searchbox__clear" onClick={() => setValue('')} aria-label="Clear search">
            <Icon name="close" size={15} />
          </button>
        ) : null}
      </form>

      {showPanel ? (
        <div className="suggest">
          {rows.length ? (
            <ul className="suggest__list">
              {rows.map((row, index) => (
                <li key={`${row.kind}-${row.label}-${index}`}>
                  <Link
                    to={row.kind === 'film' ? `/movie/${row.movie.slug}` : `/search?q=${encodeURIComponent(row.label)}`}
                    className={`suggest__row ${cursorIndex === index ? 'is-cursor' : ''}`.trim()}
                    onMouseEnter={() => setCursor({ term: debounced, index })}
                    onClick={() => {
                      setOpen(false)
                      onNavigate?.()
                    }}
                  >
                    {row.kind === 'film' ? (
                      <SmartImage src={row.movie.poster} alt="" ratio="2 / 3" width={40} className="suggest__thumb" />
                    ) : (
                      <span className="suggest__avatar">
                        <Icon name={row.kind === 'director' ? 'film' : 'user'} size={15} />
                      </span>
                    )}
                    <span className="suggest__text">
                      <span className="suggest__label">{row.label}</span>
                      <span className="suggest__hint">
                        {row.kind === 'film'
                          ? `${row.movie.year} · ${row.movie.genres.slice(0, 2).join(', ')}`
                          : row.kind === 'director'
                            ? 'Director'
                            : 'Cast'}
                      </span>
                    </span>
                    {row.kind === 'film' ? (
                      <span className="suggest__rating">{formatRating(row.movie.rating)}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="suggest__empty">
              No film, person or genre matches “{debounced.trim()}”.
            </div>
          )}
          <button type="button" className="suggest__all" onClick={() => submit()}>
            <Icon name="search" size={15} />
            See all results for “{debounced.trim()}”
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function Header() {
  const { path } = useRouter()
  const { watched, history, profile } = useLibrary()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useScrollLock(menuOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initials = useMemo(
    () =>
      profile.displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || 'CV',
    [profile.displayName],
  )

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`.trim()}>
        <div className="header__inner">
          <Link to="/" className="header__logo" aria-label="CinemaVerse home">
            <Logo />
          </Link>

          <nav className="header__nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={`navlink ${item.match(path) ? 'is-active' : ''}`.trim()}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header__tools">
            <SearchBox onNavigate={() => setMenuOpen(false)} />

            <Link className="iconlink iconlink--badge" to="/history" aria-label={`History, ${history.length} entries`}>
              <Icon name="history" size={19} />
              {history.length ? <span className="iconlink__badge">{history.length > 99 ? '99+' : history.length}</span> : null}
            </Link>

            <Link className="iconlink iconlink--badge" to="/watchlist" aria-label={`Watchlist, ${watched.length} films`}>
              <Icon name="bookmark" size={19} />
              {watched.length ? <span className="iconlink__badge">{watched.length > 99 ? '99+' : watched.length}</span> : null}
            </Link>

            <Link className="avatar" to="/profile" aria-label="Your profile" title={profile.displayName}>
              {initials}
            </Link>

            <button
              type="button"
              className="iconlink header__menu"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="mobilemenu" role="dialog" aria-modal="true" aria-label="Menu" onClick={() => setMenuOpen(false)}>
          <div className="mobilemenu__panel" onClick={(event) => event.stopPropagation()}>
            <div className="mobilemenu__head">
              <Logo />
              <button type="button" className="iconlink" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <Icon name="close" size={20} />
              </button>
            </div>
            <nav className="mobilemenu__nav">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`mobilemenu__link ${item.match(path) ? 'is-active' : ''}`.trim()}
                >
                  {item.label}
                  <Icon name="chevronRight" size={16} />
                </Link>
              ))}
            </nav>
            <Link to="/profile" className="mobilemenu__profile" onClick={() => setMenuOpen(false)}>
              <span className="avatar">{initials}</span>
              <span>
                <strong>{profile.displayName}</strong>
                <small>
                  {watched.length} saved · {history.length} in history
                </small>
              </span>
              <Icon name="chevronRight" size={16} />
            </Link>
          </div>
        </div>
      ) : null}
    </>
  )
}