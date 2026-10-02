const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

function Icon({ children, size = 20, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      {children}
    </svg>
  )
}

export const IconSearch = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Icon>
)

export const IconClose = (p) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
)

export const IconHeart = ({ filled = false, ...p }) => (
  <Icon {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.2 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z" />
  </Icon>
)

export const IconBookmark = ({ filled = false, ...p }) => (
  <Icon {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M6.5 3.8h11a1 1 0 0 1 1 1v15.4l-6.5-4-6.5 4V4.8a1 1 0 0 1 1-1Z" />
  </Icon>
)

export const IconCheck = (p) => (
  <Icon {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Icon>
)

export const IconHistory = (p) => (
  <Icon {...p}>
    <path d="M3.5 9.5A9 9 0 1 1 3 12" />
    <path d="M3 4.5v5h5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
)

export const IconSettings = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8v2.4M12 18.8v2.4M4.5 12H2.1M21.9 12h-2.4M6.7 6.7 5 5M19 19l-1.7-1.7M6.7 17.3 5 19M19 5l-1.7 1.7" />
  </Icon>
)

export const IconHome = (p) => (
  <Icon {...p}>
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" />
  </Icon>
)

export const IconGrid = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Icon>
)

export const IconFire = (p) => (
  <Icon {...p}>
    <path d="M12 3s5.5 3.6 5.5 8.6A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-9.4C6.5 9.8 9 8 9 8s.4 2 1.6 2.6c0-3 1.4-5.6 1.4-7.6Z" />
  </Icon>
)

export const IconSparkle = (p) => (
  <Icon {...p}>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z" />
    <path d="M18.5 16.5 19 18.5l2 .6-2 .6-.5 2-.5-2-2-.6 2-.6Z" />
  </Icon>
)

export const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Icon>
)

export const IconTrophy = (p) => (
  <Icon {...p}>
    <path d="M8 4h8v4.5a4 4 0 0 1-8 0Z" />
    <path d="M8 5.5H5.2A2.2 2.2 0 0 0 5.2 10H8M16 5.5h2.8A2.2 2.2 0 0 1 18.8 10H16" />
    <path d="M12 12.5V16M9 20h6M10 16h4l.6 4H9.4Z" />
  </Icon>
)

export const IconTag = (p) => (
  <Icon {...p}>
    <path d="M11.5 3.5H20V12l-8.6 8.6a1.4 1.4 0 0 1-2 0L3.9 15a1.4 1.4 0 0 1 0-2Z" />
    <circle cx="16.4" cy="7.6" r="1.3" />
  </Icon>
)

export const IconStar = ({ filled = false, ...p }) => (
  <Icon {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.7l5.4-.8Z" />
  </Icon>
)

export const IconEye = (p) => (
  <Icon {...p}>
    <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </Icon>
)

export const IconBook = (p) => (
  <Icon {...p}>
    <path d="M4 4.5h5.5A2.5 2.5 0 0 1 12 7v13a2 2 0 0 0-2-2H4Z" />
    <path d="M20 4.5h-5.5A2.5 2.5 0 0 0 12 7v13a2 2 0 0 1 2-2h6Z" />
  </Icon>
)

export const IconSliders = (p) => (
  <Icon {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2.2" />
    <circle cx="9" cy="17" r="2.2" />
  </Icon>
)

export const IconChevronLeft = (p) => (
  <Icon {...p}>
    <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
  </Icon>
)

export const IconChevronRight = (p) => (
  <Icon {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Icon>
)

export const IconArrowUp = (p) => (
  <Icon {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Icon>
)

export const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const IconTrash = (p) => (
  <Icon {...p}>
    <path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9L17.5 7" />
    <path d="M10.5 11v6M13.5 11v6" />
  </Icon>
)

export const IconUser = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </Icon>
)

export const IconCalendar = (p) => (
  <Icon {...p}>
    <rect x="4" y="5.5" width="16" height="14" rx="2" />
    <path d="M4 10h16M9 3.5v4M15 3.5v4" />
  </Icon>
)

export const IconList = (p) => (
  <Icon {...p}>
    <path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" />
  </Icon>
)

export const IconLayers = (p) => (
  <Icon {...p}>
    <path d="m12 3.5 8.5 4.4L12 12.3 3.5 7.9Z" />
    <path d="m4 12 8 4.2 8-4.2M4 16.1l8 4.2 8-4.2" />
  </Icon>
)

export const IconInfo = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5M12 7.8h.01" />
  </Icon>
)

export const IconWarning = (p) => (
  <Icon {...p}>
    <path d="M12 4 2.8 20h18.4Z" />
    <path d="M12 10v4.4M12 17.4h.01" />
  </Icon>
)

export const IconDownload = (p) => (
  <Icon {...p}>
    <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 19.5h15" />
  </Icon>
)

export const IconMenu = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
)

export const IconPlay = (p) => (
  <Icon {...p}>
    <path d="M8 5.6 18.5 12 8 18.4Z" fill="currentColor" />
  </Icon>
)

export const IconLogo = ({ size = 32, ...p }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    {...p}
  >
    <defs>
      <linearGradient id="mvLogo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--brand-2)" />
        <stop offset="100%" stopColor="var(--brand-1)" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#mvLogo)" />
    <path d="M12 34V14h5.6l4 7.4 4-7.4H31v20h-4.4V21.6L24 27l-2.6-5.4V34Z" fill="#fff" />
    <circle cx="35.5" cy="31" r="3.4" fill="#fff" opacity="0.92" />
  </svg>
)