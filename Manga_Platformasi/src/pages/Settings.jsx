import { useState } from 'react'
import { Link } from '../lib/router.jsx'
import { EmptyState, SectionHeader, StatCard } from '../components/Layout.jsx'
import {
  IconBookmark,
  IconCheck,
  IconDownload,
  IconHeart,
  IconHistory,
  IconInfo,
  IconSliders,
  IconTrash,
} from '../components/icons.jsx'
import { useLibrary } from '../lib/library.jsx'
import { formatNumber } from '../lib/format.js'
import { MANGA } from '../data/manga.js'

const THEMES = [
  { value: 'noir', label: 'Noir', hint: 'Deep black with violet glow' },
  { value: 'midnight', label: 'Midnight', hint: 'Blue-leaning dark' },
  { value: 'amoled', label: 'AMOLED', hint: 'Pure black, maximum contrast' },
]

const ACCENTS = [
  { value: 'violet', label: 'Violet' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'amber', label: 'Amber' },
  { value: 'lime', label: 'Lime' },
]

const DENSITIES = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
]

const SORTS = [
  { value: 'latest', label: 'Latest chapter' },
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
]

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__track" aria-hidden="true">
        <i />
      </span>
      <span className="toggle__copy">
        <b>{label}</b>
        {hint ? <em>{hint}</em> : null}
      </span>
    </label>
  )
}

export default function Settings() {
  const {
    settings,
    updateSetting,
    resetSettings,
    counts,
    storageAvailable,
    exportLibrary,
    clearList,
    clearHistory,
  } = useLibrary()

  const [exported, setExported] = useState('')

  const storageBytes = storageSize()

  const download = () => {
    const blob = new Blob([exportLibrary()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'mangaverse-library.json'
    link.click()
    URL.revokeObjectURL(url)
    setExported('Library exported as mangaverse-library.json')
    window.setTimeout(() => setExported(''), 4000)
  }

  return (
    <div className="page settings">
      <header className="pagehead">
        <div>
          <span className="pagehead__eyebrow">
            <IconSliders size={14} /> Preferences
          </span>
          <h1 className="pagehead__title">Settings</h1>
          <p className="pagehead__sub">
            Everything here is saved in this browser. No account, no server, no tracking.
          </p>
        </div>
        <div className="pagehead__tools">
          <button type="button" className="btn btn--ghost" onClick={resetSettings}>
            Reset to defaults
          </button>
        </div>
      </header>

      <section className="statstrip statstrip--tight">
        <StatCard label="Storage" value={storageAvailable ? 'Ready' : 'Unavailable'} tone="brand" />
        <StatCard label="Approx. size" value={`${storageBytes} KB`} />
        <StatCard label="Favorites" value={formatNumber(counts.favorites)} />
        <StatCard label="Reading list" value={formatNumber(counts.reading)} />
        <StatCard label="Completed" value={formatNumber(counts.completed)} />
        <StatCard label="History" value={formatNumber(counts.history)} />
      </section>

      <div className="settings__layout">
        <section className="card">
          <SectionHeader eyebrow="Look & feel" title="Appearance" />
          <div className="settingrow">
            <span className="settingrow__label">Theme</span>
            <div className="optgrid">
              {THEMES.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  className={`opt ${settings.theme === theme.value ? 'is-on' : ''}`}
                  onClick={() => updateSetting({ theme: theme.value })}
                >
                  <span className={`opt__swatch opt__swatch--${theme.value}`} />
                  <b>{theme.label}</b>
                  <em>{theme.hint}</em>
                </button>
              ))}
            </div>
          </div>

          <div className="settingrow">
            <span className="settingrow__label">Accent colour</span>
            <div className="swatches">
              {ACCENTS.map((accent) => (
                <button
                  key={accent.value}
                  type="button"
                  className={`swatch swatch--${accent.value} ${
                    settings.accent === accent.value ? 'is-on' : ''
                  }`}
                  onClick={() => updateSetting({ accent: accent.value })}
                  aria-label={accent.label}
                  title={accent.label}
                >
                  {settings.accent === accent.value ? <IconCheck size={14} /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="settingrow">
            <span className="settingrow__label">Card density</span>
            <div className="seg seg--wide">
              {DENSITIES.map((density) => (
                <button
                  key={density.value}
                  type="button"
                  className={settings.density === density.value ? 'is-active' : ''}
                  onClick={() => updateSetting({ density: density.value })}
                >
                  {density.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settingrow settingrow--stack">
            <Toggle
              label="Show alternative titles"
              hint="Displays the localised title under each manga name"
              checked={settings.showAltTitles}
              onChange={(v) => updateSetting({ showAltTitles: v })}
            />
            <Toggle
              label="Hover preview"
              hint="Lifts the cover and reveals quick actions on hover"
              checked={settings.hoverPreview}
              onChange={(v) => updateSetting({ hoverPreview: v })}
            />
            <Toggle
              label="Reduce motion"
              hint="Disables carousel autoplay and animated transitions"
              checked={settings.reduceMotion}
              onChange={(v) => updateSetting({ reduceMotion: v })}
            />
            <Toggle
              label="Blur sensitive covers"
              hint="Softens artwork until hovered вЂ” useful in public"
              checked={settings.blurSensitive}
              onChange={(v) => updateSetting({ blurSensitive: v })}
            />
            <Toggle
              label="Hide completed titles on Home"
              hint="Keeps the home page focused on ongoing series"
              checked={settings.hideFinished}
              onChange={(v) => updateSetting({ hideFinished: v })}
            />
          </div>
        </section>

        <section className="card">
          <SectionHeader eyebrow="Catalogue" title="Defaults" />
          <div className="settingrow">
            <span className="settingrow__label">Default sort</span>
            <div className="seg seg--wide">
              {SORTS.map((sort) => (
                <button
                  key={sort.value}
                  type="button"
                  className={settings.defaultSort === sort.value ? 'is-active' : ''}
                  onClick={() => updateSetting({ defaultSort: sort.value })}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
          <div className="settingrow">
            <span className="settingrow__label">Results per page</span>
            <div className="seg seg--wide">
              {[12, 24, 36, 48].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={settings.resultsPerPage === n ? 'is-active' : ''}
                  onClick={() => updateSetting({ resultsPerPage: n })}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card">
          <SectionHeader eyebrow="Data" title="Your library" subtitle="Everything lives in localStorage under the mv.* keys." />
          <div className="librarykeys">
            <div>
              <IconHeart filled size={16} />
              <b>mv.favorites</b>
              <span>{formatNumber(counts.favorites)} ids</span>
            </div>
            <div>
              <IconBookmark filled size={16} />
              <b>mv.reading</b>
              <span>{formatNumber(counts.reading)} ids</span>
            </div>
            <div>
              <IconCheck size={16} />
              <b>mv.completed</b>
              <span>{formatNumber(counts.completed)} ids</span>
            </div>
            <div>
              <IconHistory size={16} />
              <b>mv.history</b>
              <span>{formatNumber(counts.history)} entries</span>
            </div>
          </div>

          <div className="settingrow settingrow--stack">
            <button type="button" className="btn btn--ghost" onClick={download}>
              <IconDownload size={15} />
              Export library as JSON
            </button>
            <div className="dangerrow">
              <button type="button" className="btn btn--ghost btn--danger" onClick={() => clearList('favorites')}>
                <IconTrash size={15} /> Clear favorites
              </button>
              <button type="button" className="btn btn--ghost btn--danger" onClick={() => clearList('reading')}>
                <IconTrash size={15} /> Clear reading list
              </button>
              <button type="button" className="btn btn--ghost btn--danger" onClick={() => clearList('completed')}>
                <IconTrash size={15} /> Clear completed
              </button>
              <button type="button" className="btn btn--ghost btn--danger" onClick={clearHistory}>
                <IconTrash size={15} /> Clear history
              </button>
            </div>
          </div>

          {exported ? <p className="notice">{exported}</p> : null}
        </section>

        <section className="card">
          <SectionHeader eyebrow="About" title="MangaVerse" />
          <p className="about">
            MangaVerse is a front-end catalogue demo. It ships {formatNumber(MANGA.length)} fictional series
            with full chapter lists, and every cover and banner is generated procedurally at build time and
            stored at a path derived from the manga id вЂ” so a title can never display another title's artwork.
          </p>
          <ul className="about__facts">
            <li>
              <IconInfo size={14} />
              <span>
                <b>mangaId в†’ cover</b> /media/covers/&lt;id&gt;.svg
              </span>
            </li>
            <li>
              <IconInfo size={14} />
              <span>
                <b>mangaId в†’ banner</b> /media/banners/&lt;id&gt;.svg
              </span>
            </li>
          </ul>
          <Link to="/manga" className="btn btn--primary">
            Open the catalogue
          </Link>
        </section>
      </div>
    </div>
  )
}

function storageSize() {
  try {
    let total = 0
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith('mv.'))
      .forEach((key) => {
        total += key.length + (window.localStorage.getItem(key)?.length ?? 0)
      })
    return Math.round((total / 1024) * 10) / 10
  } catch {
    return 0
  }
}

export function NotFound() {
  return (
    <div className="page">
      <EmptyState
        title="404 вЂ” page not found"
        message="That route does not exist in the catalogue."
        action={
          <Link to="/" className="btn btn--primary">
            Back home
          </Link>
        }
      />
    </div>
  )
}