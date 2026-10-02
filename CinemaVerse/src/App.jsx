import { useMemo } from 'react'
import { RouterProvider, useRouter } from './lib/router.jsx'
import { LibraryProvider } from './lib/library.jsx'
import Layout from './components/Layout.jsx'
import { ErrorBoundary } from './components/States.jsx'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import Trending from './pages/Trending.jsx'
import Popular from './pages/Popular.jsx'
import NewReleases from './pages/NewReleases.jsx'
import Genres from './pages/Genres.jsx'
import Countries from './pages/Countries.jsx'
import GenreDetail from './pages/GenreDetail.jsx'
import CountryDetail from './pages/CountryDetail.jsx'
import Search from './pages/Search.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import Watchlist from './pages/Watchlist.jsx'
import History from './pages/History.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * Route table. `:param` segments match any value, segment counts must agree, so
 * `/genre/action` never falls through to a shorter route and the catch-all only
 * fires when nothing else matched.
 */
const ROUTES = [
  { path: '/', page: <Home /> },
  { path: '/movies', page: <Movies /> },
  { path: '/trending', page: <Trending /> },
  { path: '/popular', page: <Popular /> },
  { path: '/new-releases', page: <NewReleases /> },
  { path: '/genres', page: <Genres /> },
  { path: '/countries', page: <Countries /> },
  { path: '/search', page: <Search /> },
  { path: '/movie/:slug', page: <MovieDetails /> },
  { path: '/genre/:genre', page: <GenreDetail /> },
  { path: '/country/:country', page: <CountryDetail /> },
  { path: '/watchlist', page: <Watchlist /> },
  { path: '/history', page: <History /> },
  { path: '/profile', page: <Profile /> },
]

const matchPath = (pattern, path) => {
  const expected = pattern.split('/').filter(Boolean)
  const actual = path.split('/').filter(Boolean)
  if (expected.length !== actual.length) return false
  return expected.every((segment, index) => segment.startsWith(':') || segment === actual[index])
}

function CurrentPage() {
  const { path } = useRouter()

  return useMemo(() => {
    const route = ROUTES.find((entry) => matchPath(entry.path, path))
    return route ? route.page : <NotFound />
  }, [path])
}

export default function App() {
  return (
    <RouterProvider>
      <LibraryProvider>
        <Layout>
          <ErrorBoundary>
            <CurrentPage />
          </ErrorBoundary>
        </Layout>
      </LibraryProvider>
    </RouterProvider>
  )
}
