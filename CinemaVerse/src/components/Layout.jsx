import { useEffect, useState } from 'react'
import { Link, ScrollToTop, useRouter } from '../lib/router.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { Icon } from './Icons.jsx'

/** Floating "back to top" control, appears after the first screenful. */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="totop"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <Icon name="arrowUp" size={18} />
    </button>
  )
}

export default function Layout({ children }) {
  const { path } = useRouter()

  return (
    <div className="app">
      <ScrollToTop />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="main" key={path}>
        {children}
      </main>
      <Footer />
      <BackToTop />
      <p className="legal-strip">
        Catalogue data only · no streaming, downloads or playback ·{' '}
        <Link to="/profile">manage your data</Link>
      </p>
    </div>
  )
}