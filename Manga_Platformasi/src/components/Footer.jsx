import { Link } from '../lib/router.jsx'
import { ALL_GENRES, MANGA } from '../data/manga.js'
import { genreSlugs } from '../lib/catalog.js'
import { IconLogo } from './icons.jsx'

const columns = [
  {
    title: 'Browse',
    links: [
      { label: 'All manga', to: '/manga' },
      { label: 'Popular now', to: '/popular' },
      { label: 'Latest chapters', to: '/latest' },
      { label: 'Rankings', to: '/rankings' },
      { label: 'Genres', to: '/genres' },
    ],
  },
  {
    title: 'Library',
    links: [
      { label: 'Favorites', to: '/favorites' },
      { label: 'Reading list', to: '/reading-list' },
      { label: 'History', to: '/history' },
      { label: 'Settings', to: '/settings' },
    ],
  },
]

export default function Footer() {
  const genres = genreSlugs().slice(0, 10)
  const year = 2026

  return (
    <footer className="ftr">
      <div className="ftr__inner">
        <div className="ftr__brand">
          <div className="brand">
            <IconLogo size={38} />
            <span className="brand__text">
              <b>MANGA</b>VERSE
            </span>
          </div>
          <p>
            A curated manga catalogue with {MANGA.length} hand-picked series, chapter lists and reading
            progress that stay on your device.
          </p>
          <div className="ftr__stats">
            <span>
              <b>{MANGA.length}</b> titles
            </span>
            <span>
              <b>{ALL_GENRES.length}</b> genres
            </span>
            <span>
              <b>{MANGA.reduce((sum, m) => sum + m.chapterCount, 0).toLocaleString('en-US')}</b> chapters
            </span>
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} className="ftr__col" aria-label={column.title}>
            <h4>{column.title}</h4>
            {column.links.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <nav className="ftr__col ftr__col--genres" aria-label="Genres">
          <h4>Top genres</h4>
          <div className="ftr__chips">
            {genres.map((genre) => (
              <Link key={genre.name} className="chip chip--sm" to={`/genres/${genre.slug}`}>
                {genre.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="ftr__bottom">
        <p>© {year} MangaVerse. Catalogue demo — artwork is generated per title.</p>
        <p className="ftr__legal">All data is stored locally in your browser.</p>
      </div>
    </footer>
  )
}