import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useRouter, useScrollLock } from '../lib/router.jsx'
import { useLibrary } from '../lib/library.jsx'
import { suggest } from '../lib/search.js'
import { ALL_GENRES } from '../data/manga.js'
import {
  IconBookmark,
  IconClose,
  IconHeart,
  IconHistory,
  IconHome,
  IconLayers,
  IconLogo,
  IconMenu,
  IconSearch,
  IconSettings,
} from './icons.jsx'

const NAV = [
  { to: '/', label: 'Home', icon: IconHome },
  { to: '/manga', label: 'Manga', icon: IconLayers },
  { to: '/popular', label: 'Popular', icon: IconHeart },
  { to: '/latest', label: 'Latest', icon: IconBookmark },
  { to: '/genres', label: 'Genres', icon: IconSearch },
  { to: '/rankings', label: 'Rankings', icon: IconHistory },
]

export default function Header() {
  const { path } = useRouter()
  const { counts } = useLibrary()
  const [menuOpen, setMenuOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [lastPath, setLastPath] = useState(path)

  useScrollLock(menuOpen)

  /* close the mobile sheet on navigation (render-phase update) */
  if (lastPath !== path) {
    setLastPath(path)
    if (menuOpen) setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (to) => (to === '/' ? path === '/' : path.startsWith(to))

  return (
    <>
      <header className={`hdr ${stuck ? 'is-stuck' : ''}`}>
        <div className="hdr__inner">
          <Link to="/" className="brand" aria-label="MangaVerse home">
            <IconLogo size={34} />
            <span className="brand__text">
              <b>MANGA</b>VERSE
            </span>
          </Link>

          <nav className="hdr__nav" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`hdr__link ${isActive(item.to) ? 'is-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hdr__right">
            <SearchBox />
            <Link to="/favorites" className={`hdr__icon ${isActive('/favorites') ? 'is-active' : ''}`}>
              <IconHeart filled={counts.favorites > 0} size={19} />
              {counts.favorites > 0 ? <em>{counts.favorites}</em> : null}
              <span className="sr">Favorites</span>
            </Link>
            <Link to="/reading-list" className={`hdr__icon ${isActive('/reading-list') ? 'is-active' : ''}`}>
              <IconBookmark filled={counts.reading > 0} size={19} />
              {counts.reading > 0 ? <em>{counts.reading}</em> : null}
              <span className="sr">Reading list</span>
            </Link>
            <Link to="/history" className={`hdr__icon ${isActive('/history') ? 'is-active' : ''}`}>
              <IconHistory size={19} />
              {counts.history > 0 ? <em>{counts.history}</em> : null}
              <span className="sr">History</span>
            </Link>
            <Link
              to="/settings"
              className={`hdr__icon hdr__icon--desk ${isActive('/settings') ? 'is-active' : ''}`}
            >
              <IconSettings size={19} />
              <span className="sr">Settings</span>
            </Link>
            <button
              type="button"
              className="hdr__burger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Menu"
            >
              {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`sheet ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        <div className="sheet__panel">
          <nav className="sheet__nav" aria-label="Mobile">
            {NAV.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sheet__link ${isActive(item.to) ? 'is-active' : ''}`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
            <Link to="/favorites" className={`sheet__link ${isActive('/favorites') ? 'is-active' : ''}`}>
              <IconHeart size={18} />
              Favorites
              <em>{counts.favorites}</em>
            </Link>
            <Link
              to="/reading-list"
              className={`sheet__link ${isActive('/reading-list') ? 'is-active' : ''}`}
            >
              <IconBookmark size={18} />
              Reading List
              <em>{counts.reading}</em>
            </Link>
            <Link to="/history" className={`sheet__link ${isActive('/history') ? 'is-active' : ''}`}>
              <IconHistory size={18} />
              History
              <em>{counts.history}</em>
            </Link>
            <Link to="/settings" className={`sheet__link ${isActive('/settings') ? 'is-active' : ''}`}>
              <IconSettings size={18} />
              Settings
            </Link>
          </nav>
          <div className="sheet__genres">
            <span className="sheet__label">Genres</span>
            <div className="sheet__chips">
              {ALL_GENRES.slice(0, 12).map((genre) => (
                <Link key={genre.name} to={`/genres/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="chip chip--sm">
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function SearchBox({ autoFocus = false, initial = '', variant = 'header' }) {
  const { navigate, setQuery } = useRouter()
  const [value, setValue] = useState(initial)
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(-1)
  const [seed, setSeed] = useState(initial)
  const boxRef = useRef(null)

  const results = useMemo(() => suggest(value, 7), [value])

  /* sync the field when the URL query changes (render-phase update) */
  if (seed !== initial) {
    setSeed(initial)
    if (initial !== value) setValue(initial)
    if (open) setOpen(false)
    if (cursor !== -1) setCursor(-1)
  }

  useEffect(() => {
    const onDown = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  const go = (term) => {
    setOpen(false)
    setCursor(-1)
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  const submit = (term) => {
    const trimmed = term.trim()
    if (!trimmed) return
    go(trimmed)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor((c) => Math.min(c + 1, results.length - 1))
      setOpen(true)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor((c) => Math.max(c - 1, -1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const picked = results[cursor]
      submit(picked ? (picked.type === 'Manga' ? picked.label : picked.label) : value)
    } else if (event.key === 'Escape') {
      setOpen(false)
      setCursor(-1)
      if (variant === 'header') setValue('')
    }
  }

  return (
    <div className={`sbox sbox--${variant}`} ref={boxRef}>
      <IconSearch size={18} className="sbox__icon" />
      <input
        className="sbox__input"
        type="search"
        value={value}
        placeholder={variant === 'header' ? 'Search manga, author, genre…' : 'Search MangaVerse'}
        onChange={(e) => {
          setValue(e.target.value)
          setOpen(true)
          setCursor(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        aria-label="Search"
        aria-expanded={open && results.length > 0}
        role="combobox"
        aria-controls={`${variant}-suggestions`}
      />
      {value ? (
        <button
          type="button"
          className="sbox__clear"
          onClick={() => {
            setValue('')
            setQuery({ q: undefined }, { replace: true })
            setOpen(false)
          }}
          aria-label="Clear search"
        >
          <IconClose size={16} />
        </button>
      ) : null}

      {open && results.length > 0 ? (
        <div className="sbox__pop" id={`${variant}-suggestions`} role="listbox">
          <ul>
            {results.map((item, i) => (
              <li key={`${item.type}-${item.label}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === cursor}
                  className={i === cursor ? 'is-cursor' : ''}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => submit(item.label)}
                >
                  <span className={`sbox__kind sbox__kind--${item.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.type}
                  </span>
                  <span className="sbox__label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="sbox__all" onClick={() => submit(value)}>
            See all results for “{value}”
          </button>
        </div>
      ) : null}
    </div>
  )
}