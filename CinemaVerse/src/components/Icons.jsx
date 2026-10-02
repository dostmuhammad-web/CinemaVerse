/**
 * Inline icon set — 24×24 stroke icons so they inherit `currentColor` and stay
 * crisp at any size without shipping an icon font.
 */

const STROKE = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M16.6 16.6 21 21',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  chevronDown: 'M6 9.5l6 6 6-6',
  chevronUp: 'M6 14.5l6-6 6 6',
  chevronLeft: 'M14.5 6 8.5 12l6 6',
  chevronRight: 'M9.5 6l6 6-6 6',
  arrowRight: 'M4.5 12h15M13.5 6l6 6-6 6',
  arrowUp: 'M12 19.5V5M6 11l6-6 6 6',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  star: 'M12 4.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M12 7.8V12l2.8 1.8',
  bookmark: 'M6.5 4h11v16l-5.5-4-5.5 4z',
  film: 'M4 5h16v14H4zM8.5 5v14M15.5 5v14M4 9.5h4.5M4 14.5h4.5M15.5 9.5H20M15.5 14.5H20',
  history: 'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.8v4h4M12 8v4.3l2.8 1.7',
  user: 'M12 12.2a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c1.4-3.6 3.8-5.2 7-5.2s5.6 1.6 7 5.2',
  globe: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17M3.7 12h16.6M12 3.5c2.4 2.4 3.4 5.3 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5.3-3.4-8.5s1-6.1 3.4-8.5',
  filter: 'M4 7.5h8M16 7.5h4M4 16.5h4M12 16.5h8M14 7.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0M10 16.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0',
  grid: 'M4 4.5h6.5V11H4zM13.5 4.5H20V11h-6.5zM4 13h6.5v6.5H4zM13.5 13H20v6.5h-6.5z',
  sort: 'M4 7.5h9M4 12h6.5M4 16.5h4M17 6.5v11M13.8 14.3 17 17.5l3.2-3.2',
  trending: 'M3.5 16.5 9 10.8l3.4 3.4 7.1-7.1M15.5 7.2h4v4',
  award: 'M12 4.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6M9.2 13.2 7.6 20l4.4-2.4 4.4 2.4-1.6-6.8',
  trash: 'M4.5 7h15M9.5 7V4.8h5V7M6.8 7l1 12.2h8.4L17.2 7M10.3 10.5v5.5M13.7 10.5v5.5',
  reset: 'M4.5 12a7.5 7.5 0 1 1 2.2 5.3M4.5 19.2v-4h4',
  info: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M12 11v5.4M12 7.9h.01',
  calendar: 'M4 6.5h16v13H4zM4 10.5h16M9 4v4M15 4v4',
  eye: 'M2.8 12S6.3 6.5 12 6.5 21.2 12 21.2 12 17.7 17.5 12 17.5 2.8 12 2.8 12M12 9.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2',
  list: 'M8.5 6.5h11M8.5 12h11M8.5 17.5h11M4.6 6.5h.01M4.6 12h.01M4.6 17.5h.01',
  sparkle: 'M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1L5 10.5l5.1-1.9zM18.5 15.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z',
  home: 'M4 11.2 12 4.5l8 6.7V20H4z',
  volume: 'M5 9.5h3l4-3.5v12l-4-3.5H5zM16 9.4a3.6 3.6 0 0 1 0 5.2M18.6 7a7 7 0 0 1 0 10',
  bookmarkFilled: 'M6.5 4h11v16l-5.5-4-5.5 4z',
  play: 'M8.5 5.4 18.5 12l-10 6.6z',
}

const FILLED = new Set(['play', 'bookmarkFilled', 'star', 'trending'])

export function Icon({ name, size = 20, className = '', strokeWidth = 1.7, ...rest }) {
  const path = STROKE[name]
  if (!path) return null
  const filled = FILLED.has(name)
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={path} />
    </svg>
  )
}

/** Wordmark used in the header and footer. */
export function Logo({ compact = false }) {
  return (
    <span className={`logo ${compact ? 'logo--compact' : ''}`.trim()}>
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="26" height="26" focusable="false">
          <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity=".45" />
          <path d="M12 9.5 23 16l-11 6.5z" fill="currentColor" />
        </svg>
      </span>
      <span className="logo__text">
        CINEMA<span className="logo__accent">VERSE</span>
      </span>
    </span>
  )
}