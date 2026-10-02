import { useEffect, useState } from 'react'
import { RouterProvider, ScrollToTop, useRouter } from './lib/router.jsx'
import { LibraryProvider } from './lib/library.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { IconArrowUp } from './components/icons.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import { Popular, Latest, Genres, GenreDetail, Rankings } from './pages/Discover.jsx'
import MangaDetails from './pages/MangaDetails.jsx'
import SearchPage from './pages/SearchPage.jsx'
import { Favorites, ReadingList, History } from './pages/Library.jsx'
import Settings, { NotFound } from './pages/Settings.jsx'
import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'

function Routes() {
  const { segments } = useRouter()
  const [head, second] = segments

  switch (head) {
    case undefined:
      return <Home />
    case 'manga':
      return second ? <MangaDetails key={second} id={second} /> : <Browse />
    case 'popular':
      return <Popular />
    case 'latest':
      return <Latest />
    case 'genres':
      return second ? <GenreDetail slug={second} /> : <Genres />
    case 'rankings':
      return <Rankings />
    case 'search':
      return <SearchPage />
    case 'favorites':
      return <Favorites />
    case 'reading-list':
      return <ReadingList />
    case 'history':
      return <History />
    case 'settings':
      return <Settings />
    default:
      return <NotFound />
  }
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`totop ${show ? 'is-show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <IconArrowUp size={18} />
    </button>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <LibraryProvider>
        <ScrollToTop />
        <div className="app">
          <a className="skiplink" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main" className="main">
            <Routes />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </LibraryProvider>
    </RouterProvider>
  )
}