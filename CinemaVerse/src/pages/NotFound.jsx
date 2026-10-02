import { Link } from '../lib/router.jsx'
import { TRENDING } from '../lib/catalog.js'
import MovieGrid from '../components/MovieGrid.jsx'
import { Icon } from '../components/Icons.jsx'

const LINKS = [
  { to: '/movies', label: 'All films', icon: 'grid' },
  { to: '/trending', label: 'Trending', icon: 'trending' },
  { to: '/genres', label: 'Genres', icon: 'list' },
  { to: '/countries', label: 'Countries', icon: 'globe' },
  { to: '/search', label: 'Search', icon: 'search' },
]

export default function NotFound() {
  return (
    <div className="notfound page">
      <span className="notfound__code">404</span>
      <h1>This page is not in the catalogue</h1>
      <p>
        The address you followed does not match any route. The films are all still here — 1,040 of them, from 1961 to
        2026.
      </p>

      <div className="btnrow">
        <Link className="btn btn--primary" to="/">
          <Icon name="home" size={18} />
          Back home
        </Link>
        <Link className="btn btn--outline" to="/movies">
          <Icon name="grid" size={18} />
          Browse all films
        </Link>
      </div>

      <div className="chips chips--wrap notfound__links">
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="pill">
            <Icon name={link.icon} size={14} />
            {link.label}
          </Link>
        ))}
      </div>

      <section className="notfound__rail">
        <h2>Trending, in case you need a starting point</h2>
        <MovieGrid movies={TRENDING.slice(0, 6)} />
      </section>
    </div>
  )
}
