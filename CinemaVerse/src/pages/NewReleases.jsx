import CatalogueView from '../components/CatalogueView.jsx'
import { NEW_RELEASES } from '../lib/catalog.js'

export default function NewReleases() {
  return (
    <CatalogueView
      movies={NEW_RELEASES}
      eyebrow="Recent"
      title="New releases"
      description="The newest entries first, including limited releases, theatrical runs and titles still listed as upcoming."
    />
  )
}