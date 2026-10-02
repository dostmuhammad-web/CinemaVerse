import { Link } from '../lib/router.jsx'
import { CATALOGUE_STATS, GENRES } from '../lib/catalog.js'
import { Icon, Logo } from './Icons.jsx'

const COLUMNS = [
  {
    title: 'Browse',
    links: [
      { to: '/movies', label: 'All films' },
      { to: '/trending', label: 'Trending now' },
      { to: '/popular', label: 'Most popular' },
      { to: '/new-releases', label: 'New releases' },
      { to: '/movies?sort=rating', label: 'Top rated' },
      { to: '/movies?sort=az', label: 'A–Z index' },
    ],
  },
  {
    title: 'Collections',
    links: GENRES.slice(0, 6).map((genre) => ({ to: `/genre/${encodeURIComponent(genre.value)}`, label: genre.value })),
  },
  {
    title: 'Your space',
    links: [
      { to: '/watchlist', label: 'Watchlist' },
      { to: '/history', label: 'Viewing history' },
      { to: '/profile', label: 'Profile & stats' },
      { to: '/genres', label: 'All genres' },
      { to: '/countries', label: 'All countries' },
      { to: '/search', label: 'Search' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner page">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="footer__pitch">
              A complete film catalogue of {CATALOGUE_STATS.films.toLocaleString('en-US')} entries spanning{' '}
              {CATALOGUE_STATS.years}, {CATALOGUE_STATS.genres} genres, {CATALOGUE_STATS.countries} countries and{' '}
              {CATALOGUE_STATS.languages} languages.
            </p>
            <p className="footer__note">
              <Icon name="info" size={15} />
              CinemaVerse is a catalogue interface demo. Films, credits and synopses are fictional reference data —
              nothing here streams or downloads media.
            </p>
          </div>

          <div className="footer__columns">
            {COLUMNS.map((column) => (
              <div key={column.title} className="footer__column">
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link to={link.to}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__stats">
          {[
            { label: 'Films', value: CATALOGUE_STATS.films.toLocaleString('en-US') },
            { label: 'Posters', value: CATALOGUE_STATS.posters.toLocaleString('en-US') },
            { label: 'Genres', value: CATALOGUE_STATS.genres },
            { label: 'Countries', value: CATALOGUE_STATS.countries },
            { label: 'Languages', value: CATALOGUE_STATS.languages },
            { label: 'Years', value: CATALOGUE_STATS.years },
          ].map((stat) => (
            <div key={stat.label} className="footer__stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="footer__base">
          <p>CinemaVerse — catalogue interface built with React.</p>
          <p>Artwork is generated per film; every poster belongs to exactly one entry.</p>
        </div>
      </div>
    </footer>
  )
}