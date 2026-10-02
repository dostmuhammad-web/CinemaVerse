import CatalogueView from '../components/CatalogueView.jsx'
import { MOVIES, CATALOGUE_STATS } from '../lib/catalog.js'
import { Icon } from '../components/Icons.jsx'
import { Link } from '../lib/router.jsx'

export default function Movies() {
  return (
    <CatalogueView
      movies={MOVIES}
      eyebrow="Full catalogue"
      title="All films"
      description={`Every entry in the CinemaVerse catalogue — ${CATALOGUE_STATS.films.toLocaleString('en-US')} films, one poster and backdrop each. Filter, sort and page through the lot.`}
      headerExtra={
        <div className="page-head__stats">
          <span>
            <Icon name="film" size={15} />
            {CATALOGUE_STATS.films.toLocaleString('en-US')} films
          </span>
          <span>
            <Icon name="calendar" size={15} />
            {CATALOGUE_STATS.years}
          </span>
          <span>
            <Icon name="grid" size={15} />
            {CATALOGUE_STATS.genres} genres
          </span>
          <span>
            <Icon name="globe" size={15} />
            {CATALOGUE_STATS.countries} countries
          </span>
        </div>
      }
      intro={
        <div className="quicklinks">
          <span className="quicklinks__label">Quick filters</span>
          {[
            { to: '/movies?minRating=8&sort=rating', label: '8.0+ rated' },
            { to: '/movies?minYear=2024&sort=newest', label: '2024 and newer' },
            { to: '/movies?durations=epic', label: 'Over 150 min' },
            { to: '/movies?durations=short', label: 'Under 90 min' },
            { to: '/movies?status=Upcoming', label: 'Upcoming' },
            { to: '/movies?status=In%20Theaters', label: 'In theatres' },
            { to: '/movies?sort=popularity', label: 'Most voted' },
            { to: '/movies?sort=az', label: 'A–Z index' },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="pill">
              {link.label}
            </Link>
          ))}
        </div>
      }
    />
  )
}