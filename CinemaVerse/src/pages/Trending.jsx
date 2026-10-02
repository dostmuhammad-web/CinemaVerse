import CatalogueView from '../components/CatalogueView.jsx'
import { TRENDING } from '../lib/catalog.js'

export default function Trending() {
  return (
    <CatalogueView
      movies={TRENDING}
      eyebrow="Momentum"
      title="Trending now"
      description="A weighted blend of audience volume, recency and score — the films the catalogue is moving toward, ranked."
    />
  )
}