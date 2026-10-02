import CatalogueView from '../components/CatalogueView.jsx'
import { POPULAR } from '../lib/catalog.js'

export default function Popular() {
  return (
    <CatalogueView
      movies={POPULAR}
      eyebrow="Audience"
      title="Most popular"
      description="Ranked by how many people rated each film and weighted by score — the widest-audience entries in the catalogue."
    />
  )
}