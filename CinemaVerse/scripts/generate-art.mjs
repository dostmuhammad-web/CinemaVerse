/**
 * Generates one poster and one backdrop per catalogue film.
 *
 *   node scripts/generate-art.mjs            # all films
 *   node scripts/generate-art.mjs 40         # first 40 films (preview)
 *   node scripts/generate-art.mjs slug-name  # one film, by slug
 *
 * Art is derived deterministically from the film's slug, so `npm run catalog`
 * followed by `npm run art` always reproduces the same artwork, and every file
 * is written under that film's own slug. The poster carries the film's title in
 * the artwork itself, which makes an accidental poster/film mismatch visible
 * instead of silent.
 */

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MOVIES } from '../src/data/movies.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const POSTER_DIR = resolve(ROOT, 'public/media/posters')
const BACKDROP_DIR = resolve(ROOT, 'public/media/backdrops')

const POSTER_W = 600
const POSTER_H = 900
const BACKDROP_W = 1600
const BACKDROP_H = 900

const THIS_YEAR = 2026

/* ------------------------------------------------------------------ */
/* deterministic randomness                                            */
/* ------------------------------------------------------------------ */

function hashString(value) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const r1 = (value) => Math.round(value * 10) / 10
const hsl = (h, s, l, a = 1) =>
  a >= 1 ? `hsl(${r1(h)} ${r1(s)}% ${r1(l)}%)` : `hsl(${r1(h)} ${r1(s)}% ${r1(l)}% / ${r1(a)})`

/* ------------------------------------------------------------------ */
/* palette                                                             */
/* ------------------------------------------------------------------ */

const GENRE_HUES = {
  Action: 12, Adventure: 200, Animation: 320, Biography: 34, Comedy: 48,
  Crime: 205, Documentary: 172, Drama: 216, Family: 38, Fantasy: 276,
  History: 28, Horror: 348, Music: 300, Mystery: 258, Romance: 336,
  'Sci-Fi': 188, Thriller: 214, War: 32, Western: 24,
}

/** Extra scene variety per film, so two dramas never share a composition. */
const SCENES = {
  Action: ['ridges', 'skyline', 'rain'],
  Adventure: ['ridges', 'waves', 'ridges'],
  Animation: ['bloom', 'bloom', 'stage'],
  Biography: ['interior', 'ridges', 'interior'],
  Comedy: ['stage', 'bloom', 'stage'],
  Crime: ['rain', 'skyline', 'fog'],
  Documentary: ['interior', 'waves', 'ridges'],
  Drama: ['interior', 'waves', 'interior'],
  Family: ['bloom', 'stage', 'waves'],
  Fantasy: ['forest', 'space', 'forest'],
  History: ['ridges', 'interior', 'ridges'],
  Horror: ['fog', 'forest', 'fog'],
  Music: ['stage', 'stage', 'bloom'],
  Mystery: ['fog', 'rain', 'forest'],
  Romance: ['bloom', 'waves', 'bloom'],
  'Sci-Fi': ['space', 'grid', 'space'],
  Thriller: ['rain', 'skyline', 'fog'],
  War: ['ridges', 'skyline', 'rain'],
  Western: ['dunes', 'dunes', 'ridges'],
}

function buildPalette(movie, scene) {
  const rng = mulberry32(hashString(`${movie.slug}|palette`))
  const genreHue = GENRE_HUES[movie.genres[0]] ?? 210
  const baseHue = (genreHue + rng() * 40 - 20 + 360) % 360
  const compHue = (baseHue + 172 + (rng() - 0.5) * 70 + 360) % 360
  const warmHue = (baseHue + 318 + rng() * 36) % 360

  // Older prints desaturate and warm up; new ones stay cooler and punchier.
  const age = Math.min(1, Math.max(0, (THIS_YEAR - movie.year) / 62))
  const sat = 62 - age * 30 + rng() * 12
  const dark = ['Horror', 'Crime', 'Thriller', 'War', 'Mystery'].includes(movie.genres[0])
  const bright = ['Comedy', 'Family', 'Animation', 'Romance'].includes(movie.genres[0])

  const night = scene === 'space' || scene === 'interior' || dark || rng() > 0.5

  return {
    rng,
    baseHue,
    compHue,
    warmHue,
    night,
    sky: night
      ? [hsl(baseHue, sat * 0.7, 6), hsl((baseHue + 16) % 360, sat * 0.8, 13), hsl(warmHue, sat * 0.9, night ? 22 : 46)]
      : [hsl(baseHue, sat, 24), hsl((baseHue + 20) % 360, sat * 0.9, bright ? 62 : 42), hsl(warmHue, sat, bright ? 80 : 58)],
    disc: hsl(warmHue, 96, bright ? 88 : 78),
    comp: hsl(compHue, sat, night ? 26 : 38),
    warm: hsl(warmHue, 90, night ? 52 : 64),
    glow: hsl(warmHue, 100, 62, 0.42),
    far: hsl(compHue, sat * 0.7, night ? 15 : 30),
    mid: hsl(compHue, sat * 0.8, night ? 10 : 18),
    near: hsl((compHue + 8) % 360, sat * 0.9, night ? 6 : 10),
    fore: hsl((compHue + 14) % 360, sat, night ? 3 : 5),
    accent: hsl(warmHue, 92, night ? 62 : 52),
    ink: '#ffffff',
  }
}

/* ------------------------------------------------------------------ */
/* small svg helpers                                                   */
/* ------------------------------------------------------------------ */

const xml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Smooth polyline across a set of peaks, closed to the bottom of the frame. */
function ridge(rng, w, baseY, height, roughness, steps) {
  const pts = []
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const bell = Math.sin(t * Math.PI)
    const y =
      baseY -
      height * bell * (0.5 + rng() * 0.5) -
      (i === 0 || i === steps ? 0 : (rng() - 0.5) * height * roughness)
    pts.push([r1((w / steps) * i), r1(y)])
  }
  let d = `M-10 ${r1(baseY + 600)}L-10 ${pts[0][1]}`
  pts.forEach(([x, y], i) => {
    if (i === 0) d += `L${x} ${y}`
    else {
      const [px, py] = pts[i - 1]
      d += `Q${r1((px + x) / 2)} ${r1(Math.min(py, y) - height * 0.06)} ${x} ${y}`
    }
  })
  return `${d}L${r1(w + 10)} ${r1(baseY + 600)}Z`
}

/** Stepped city skyline with a few lit windows. */
function skyline(rng, w, baseY, height) {
  let d = `M-10 ${r1(baseY + 600)}L-10 ${r1(baseY)}`
  let x = -10
  let windows = ''
  while (x < w + 10) {
    const bw = 26 + rng() * 74
    const bh = height * (0.28 + rng() * 0.72)
    const top = r1(baseY - bh)
    d += `L${r1(x)} ${top}L${r1(x + bw)} ${top}`
    if (bh > height * 0.45) {
      const cols = Math.max(1, Math.floor(bw / 17))
      const rows = Math.max(1, Math.floor(bh / 22))
      for (let c = 0; c < cols; c += 1) {
        for (let rr = 0; rr < rows; rr += 1) {
          if (rng() > 0.72) continue
          const wx = r1(x + 6 + c * 17)
          const wy = r1(top + 9 + rr * 22)
          windows += `M${wx} ${wy}h5v7h-5z`
        }
      }
    }
    x += bw + 3 + rng() * 12
  }
  d += `L${r1(w + 10)} ${r1(baseY + 600)}Z`
  return { shape: d, windows }
}

function stars(rng, count, w, top, bottom) {
  let out = ''
  for (let i = 0; i < count; i += 1) {
    const x = r1(rng() * w)
    const y = r1(top + rng() * (bottom - top))
    const r = r1(0.7 + rng() * 1.5)
    out += `M${x} ${y}m-${r} 0a${r} ${r} 0 1 0 ${r1(r * 2)} 0a${r} ${r} 0 1 0-${r1(r * 2)} 0`
  }
  return out
}

/* ------------------------------------------------------------------ */
/* scenes — normalised (0..1) coordinates, scaled per frame            */
/* ------------------------------------------------------------------ */

/**
 * Every scene returns { far, mid, near, fore, glow } — each a ready-to-use SVG
 * fragment string for that depth. Keeping them separate lets the poster crop
 * and the backdrop crop share a composition without looking identical.
 */
const SCENES_BUILD = {
  ridges: (rng, p, w, h) => ({
    far: `<path d="${ridge(rng, w, h * 0.62, h * 0.3, 0.16, 7)}" fill="${p.far}" opacity=".75"/>`,
    mid: `<path d="${ridge(rng, w, h * 0.74, h * 0.34, 0.2, 9)}" fill="${p.mid}"/>`,
    near: `<path d="${ridge(rng, w, h * 0.88, h * 0.26, 0.22, 11)}" fill="${p.near}"/>`,
    fore: '',
  }),
  dunes: (rng, p, w, h) => ({
    far: `<path d="${ridge(rng, w, h * 0.66, h * 0.12, 0.1, 5)}" fill="${p.far}" opacity=".8"/>`,
    mid: `<path d="${ridge(rng, w, h * 0.8, h * 0.1, 0.08, 4)}" fill="${p.mid}"/>`,
    near: `<path d="${ridge(rng, w, h * 0.95, h * 0.08, 0.06, 4)}" fill="${p.near}"/>`,
    fore: `<path d="${ridge(rng, w, h * 1.05, h * 0.05, 0.04, 3)}" fill="${p.fore}"/>`,
  }),
  waves: (rng, p, w, h) => {
    let stripes = ''
    for (let i = 0; i < 9; i += 1) {
      const y = h * (0.66 + i * 0.04)
      const amp = h * 0.008 * (i + 1)
      const seg = w / 6
      let d = `M-10 ${r1(y)}`
      for (let s = 1; s <= 6; s += 1) {
        d += `Q${r1(seg * (s - 0.5))} ${r1(y + (s % 2 ? -amp : amp) * 2)} ${r1(seg * s)} ${r1(y)}`
      }
      stripes += `<path d="${d}" fill="none" stroke="${p.near}" stroke-width="${r1(1 + i * 0.25)}" opacity="${r1(0.5 - i * 0.04)}"/>`
    }
    return {
      far: `<rect y="${r1(h * 0.62)}" width="${r1(w + 20)}" height="${r1(h * 0.4)}" fill="${p.mid}"/>`,
      mid: stripes,
      near: '',
      fore: '',
    }
  },
  skyline: (rng, p, w, h) => {
    const far = skyline(rng, w, h * 0.78, h * 0.42)
    const near = skyline(rng, w, h * 0.94, h * 0.5)
    return {
      far: `<path d="${far.shape}" fill="${p.far}" opacity=".85"/><path d="${far.windows}" fill="${p.accent}" opacity=".35"/>`,
      mid: '',
      near: `<path d="${near.shape}" fill="${p.near}"/><path d="${near.windows}" fill="${p.accent}" opacity=".5"/>`,
      fore: '',
    }
  },
  space: (rng, p, w, h) => {
    const cx = r1(w * (0.28 + rng() * 0.44))
    const cy = r1(h * (0.46 + rng() * 0.2))
    const pr = r1(h * (0.17 + rng() * 0.14))
    return {
      far: `<g fill="${p.disc}">${stars(rng, 42, w, 0, h * 0.8)}</g>`,
      mid: `<circle cx="${cx}" cy="${cy}" r="${pr}" fill="${p.mid}"/><circle cx="${cx}" cy="${cy}" r="${r1(pr * 0.97)}" fill="${p.comp}" opacity=".9"/><circle cx="${r1(cx - pr * 0.3)}" cy="${r1(cy - pr * 0.24)}" r="${r1(pr * 0.72)}" fill="${p.warm}" opacity=".35"/>`,
      near: `<ellipse cx="${cx}" cy="${r1(cy + pr * 0.28)}" rx="${r1(pr * 1.62)}" ry="${r1(pr * 0.2)}" fill="none" stroke="${p.accent}" stroke-width="2" opacity=".65"/>`,
      fore: `<rect y="${r1(h * 0.86)}" width="${r1(w + 20)}" height="${r1(h * 0.2)}" fill="${p.fore}"/>`,
    }
  },
  grid: (rng, p, w, h) => {
    const horizon = h * 0.56
    let lines = ''
    for (let i = -14; i <= 14; i += 1) {
      const x = w / 2 + i * (w / 16)
      lines += `M${r1(w / 2)} ${r1(horizon)}L${r1(x)} ${r1(h + 20)}`
    }
    for (let i = 1; i <= 12; i += 1) {
      const y = horizon + Math.pow(i / 12, 2.3) * (h - horizon)
      lines += `M-10 ${r1(y)}L${r1(w + 10)} ${r1(y)}`
    }
    return {
      far: '',
      mid: `<path d="${stars(rng, 20, w, 0, horizon)}" fill="${p.disc}" opacity=".7"/><rect y="${r1(horizon)}" width="${r1(w + 20)}" height="${r1(h - horizon)}" fill="${p.fore}"/>`,
      near: `<path d="${lines}" fill="none" stroke="${p.accent}" stroke-width="1.3" opacity=".5"/>`,
      fore: '',
    }
  },
  forest: (rng, p, w, h) => {
    let trees = ''
    const baseY = h * 0.92
    for (let i = 0; i < 16; i += 1) {
      const x = r1((i / 16) * w + rng() * (w / 22) - w / 44)
      const th = h * (0.3 + rng() * 0.42)
      const tw = th * (0.16 + rng() * 0.1)
      trees += `M${x} ${r1(baseY)}L${r1(x - tw)} ${r1(baseY)}L${x} ${r1(baseY - th)}L${r1(x + tw)} ${r1(baseY)}Z`
    }
    return {
      far: '',
      mid: `<path d="${trees}" fill="${p.mid}" opacity=".9"/>`,
      near: `<rect y="${r1(baseY)}" width="${r1(w + 20)}" height="${r1(h - baseY + 20)}" fill="${p.fore}"/>`,
      fore: '',
    }
  },
  fog: (rng, p, w, h) => {
    let banks = ''
    for (let i = 0; i < 6; i += 1) {
      const y = h * (0.58 + i * 0.075)
      const bh = h * (0.03 + rng() * 0.05)
      banks += `<ellipse cx="${r1(w * (0.2 + rng() * 0.6))}" cy="${r1(y)}" rx="${r1(w * (0.24 + rng() * 0.3))}" ry="${r1(bh)}" fill="${p.near}" opacity="${r1(0.45 + rng() * 0.3)}"/>`
    }
    const tx = r1(w * (0.2 + rng() * 0.6))
    const th = h * 0.3
    const tree = `M${tx} ${r1(h * 0.95)}L${tx} ${r1(h * 0.95 - th * 0.55)}M${r1(tx - th * 0.2)} ${r1(h * 0.95 - th * 0.45)}L${tx} ${r1(h * 0.95 - th * 0.75)}L${r1(tx + th * 0.2)} ${r1(h * 0.95 - th * 0.45)}M${r1(tx - th * 0.16)} ${r1(h * 0.95 - th * 0.2)}L${tx} ${r1(h * 0.95 - th * 0.45)}L${r1(tx + th * 0.17)} ${r1(h * 0.95 - th * 0.2)}`
    return {
      far: `<path d="${ridge(rng, w, h * 0.7, h * 0.16, 0.14, 6)}" fill="${p.far}" opacity=".55"/>`,
      mid: banks,
      near: `<path d="${tree}" fill="none" stroke="${p.fore}" stroke-width="${r1(th * 0.045)}" stroke-linecap="round"/>`,
      fore: `<rect y="${r1(h * 0.93)}" width="${r1(w + 20)}" height="${r1(h * 0.1)}" fill="${p.fore}"/>`,
    }
  },
  rain: (rng, p, w, h) => {
    let drops = ''
    for (let i = 0; i < 46; i += 1) {
      const x = r1(rng() * w)
      const y = r1(rng() * h * 0.9)
      const len = h * (0.03 + rng() * 0.07)
      drops += `M${x} ${y}l${r1(-len * 0.16)} ${r1(len)}`
    }
    return {
      far: '',
      mid: `<path d="${skyline(rng, w, h * 0.72, h * 0.34).shape}" fill="${p.far}" opacity=".7"/>`,
      near: `<rect y="${r1(h * 0.7)}" width="${r1(w + 20)}" height="${r1(h * 0.32)}" fill="${p.near}"/><path d="${drops}" fill="none" stroke="${p.disc}" stroke-width="1.2" opacity=".3"/>`,
      fore: `<ellipse cx="${r1(w * (0.3 + rng() * 0.4))}" cy="${r1(h * 0.93)}" rx="${r1(w * 0.22)}" ry="${r1(h * 0.03)}" fill="${p.accent}" opacity=".22"/>`,
    }
  },
  interior: (rng, p, w, h) => {
    const winW = w * (0.3 + rng() * 0.14)
    const winH = h * (0.4 + rng() * 0.14)
    const wx = r1(w * (0.2 + rng() * 0.4))
    const wy = r1(h * 0.16)
    const beams = Array.from({ length: 3 }, (_, i) => {
      const spread = winW * (0.4 + i * 0.22)
      return `<path d="M${wx} ${r1(wy + winH * 0.1)}L${r1(wx + winW)} ${r1(wy + winH * 0.1)}L${r1(wx + winW + spread * 0.5)} ${r1(h)}L${r1(wx - spread * 0.2)} ${r1(h)}Z" fill="${p.disc}" opacity="${r1(0.05 - i * 0.012)}"/>`
    }).join('')
    const fx = r1(w * (0.24 + rng() * 0.5))
    const fh = h * (0.2 + rng() * 0.08)
    return {
      far: '',
      mid: `<rect width="${r1(w + 20)}" height="${r1(h + 20)}" fill="${p.mid}"/>${beams}`,
      near: `<rect x="${wx}" y="${wy}" width="${r1(winW)}" height="${r1(winH)}" fill="${p.sky[0]}"/><rect x="${wx}" y="${wy}" width="${r1(winW)}" height="${r1(winH)}" fill="${p.glow}" opacity=".5"/><path d="M${wx} ${wy}h${r1(winW)}v${r1(winH)}h-${r1(winW)}Z" fill="none" stroke="${p.fore}" stroke-width="7"/><path d="M${wx} ${r1(wy + winH / 2)}h${r1(winW)}M${r1(wx + winW / 2)} ${wy}v${r1(winH)}" stroke="${p.fore}" stroke-width="4"/>`,
      fore: `<path d="M${fx} ${r1(h * 0.96)}q${r1(-fh * 0.09)} ${r1(-fh * 0.5)} ${r1(fh * 0.09)} ${r1(-fh * 0.62)}q${r1(fh * 0.1)} ${r1(fh * 0.12)} ${r1(fh * 0.06)} ${r1(fh * 0.3)}q${r1(-fh * 0.02)} ${r1(fh * 0.2)} ${r1(fh * 0.02)} ${r1(fh * 0.32)}Z" fill="${p.fore}"/>`,
    }
  },
  stage: (rng, p, w, h) => {
    let folds = ''
    for (let i = 0; i < 9; i += 1) {
      const x = r1((i / 9) * w + rng() * 10)
      const fw = r1(w / 9)
      folds += `<path d="M${x} 0L${r1(x + fw)} 0L${r1(x + fw * 0.72)} ${r1(h * 0.82)}L${r1(x + fw * 0.28)} ${r1(h * 0.82)}Z" fill="${p.near}" opacity="${r1(0.3 + rng() * 0.4)}"/>`
    }
    const cx = r1(w * (0.35 + rng() * 0.3))
    return {
      far: '',
      mid: `<rect width="${r1(w + 20)}" height="${r1(h * 0.82)}" fill="${p.mid}"/>${folds}`,
      near: `<path d="M${cx} 0L${r1(cx + w * 0.3)} ${r1(h * 0.86)}L${r1(cx - w * 0.3)} ${r1(h * 0.86)}Z" fill="${p.disc}" opacity=".1"/>`,
      fore: `<ellipse cx="${r1(w / 2)}" cy="${r1(h * 0.86)}" rx="${r1(w * 0.34)}" ry="${r1(h * 0.07)}" fill="${p.accent}" opacity=".2"/><rect y="${r1(h * 0.82)}" width="${r1(w + 20)}" height="${r1(h * 0.2)}" fill="${p.fore}"/>`,
    }
  },
  bloom: (rng, p, w, h) => {
    let shapes = ''
    for (let i = 0; i < 9; i += 1) {
      const cx = r1(rng() * w)
      const cy = r1(h * (0.12 + rng() * 0.62))
      const r = r1(h * (0.05 + rng() * 0.16))
      shapes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${i % 2 ? p.accent : p.disc}" opacity="${r1(0.12 + rng() * 0.22)}"/>`
    }
    return {
      far: '',
      mid: shapes,
      near: `<path d="${ridge(rng, w, h * 0.92, h * 0.16, 0.12, 8)}" fill="${p.near}" opacity=".9"/>`,
      fore: '',
    }
  },
}

/* ------------------------------------------------------------------ */
/* poster                                                              */
/* ------------------------------------------------------------------ */

function wrapTitle(title, maxWidth, size) {
  const perChar = size * 0.58
  const maxChars = Math.max(8, Math.floor(maxWidth / perChar))
  const lines = []
  let current = ''
  for (const word of title.toUpperCase().split(/\s+/)) {
    if (!current) current = word
    else if (`${current} ${word}`.length <= maxChars) current = `${current} ${word}`
    else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function posterFor(movie, scene, palette) {
  const w = POSTER_W
  const h = POSTER_H
  const rng = mulberry32(hashString(`${movie.slug}|poster`))
  const parts = SCENES_BUILD[scene](rng, palette, w, h)

  const discX = r1(w * (0.22 + rng() * 0.56))
  const discY = r1(h * (0.2 + rng() * 0.2))
  const discR = r1(w * (0.1 + rng() * 0.1))

  const pad = 44
  const blockH = 232
  let size = 52
  let lines = wrapTitle(movie.title, w - pad * 2, size)
  while ((lines.length > 3 || size > 30) && size > 29) {
    size -= 2
    lines = wrapTitle(movie.title, w - pad * 2, size)
    if (lines.length <= 3 && size <= 34) break
  }
  lines = lines.slice(0, 3)
  const lineH = r1(size * 1.02)
  const textTop = r1(h - blockH - 34 + (3 - lines.length) * lineH * 0.5)

  const meta = `${movie.year}  ·  ${movie.duration} MIN  ·  ${movie.genres[0].toUpperCase()}`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${xml(movie.title)} poster">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${palette.sky
    .map((color, i) => `<stop offset="${i / (palette.sky.length - 1)}" stop-color="${color}"/>`)
    .join('')}</linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${palette.glow}"/><stop offset="1" stop-color="${palette.glow}" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".42" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></radialGradient>
<linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04050a" stop-opacity="0"/><stop offset=".55" stop-color="#04050a" stop-opacity=".72"/><stop offset="1" stop-color="#04050a" stop-opacity=".96"/></linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#sky)"/>
${palette.night ? '' : `<circle cx="${discX}" cy="${discY}" r="${r1(discR * 4.2)}" fill="url(#glow)"/><circle cx="${discX}" cy="${discY}" r="${discR}" fill="${palette.disc}" opacity=".92"/>`}
${parts.far}${parts.mid}${parts.near}${parts.fore}
<rect y="${r1(h - blockH - 84)}" width="${w}" height="${r1(blockH + 84)}" fill="url(#scrim)"/>
<rect width="${w}" height="${h}" fill="url(#vig)"/>
<rect x="18" y="18" width="${w - 36}" height="${h - 36}" fill="none" stroke="${palette.ink}" stroke-opacity=".16"/>
<path d="M18 54V18h36M${w - 54} 18h36v36M18 ${h - 54}v36h36M${w - 54} ${h}h36v-36" fill="none" stroke="${palette.accent}" stroke-opacity=".55" stroke-width="2"/>
${lines
    .map(
      (line, i) =>
        `<text x="${pad}" y="${r1(textTop + i * lineH)}" fill="${palette.ink}" font-family="Verdana,DejaVu Sans,sans-serif" font-size="${size}" font-weight="700" letter-spacing="1.5">${xml(line)}</text>`,
    )
    .join('')}
<path d="M${pad} ${r1(textTop + lines.length * lineH + 6)}h72" stroke="${palette.accent}" stroke-width="2.5"/>
<text x="${pad}" y="${r1(textTop + lines.length * lineH + 30)}" fill="${palette.ink}" fill-opacity=".72" font-family="Verdana,DejaVu Sans,sans-serif" font-size="12.5" letter-spacing="2.6">${xml(meta)}</text>
<text x="${w - pad}" y="${r1(textTop + lines.length * lineH + 30)}" fill="${palette.accent}" fill-opacity=".85" text-anchor="end" font-family="Verdana,DejaVu Sans,sans-serif" font-size="12.5" letter-spacing="4">CINEMAVERSE</text>
</svg>`
}

/* ------------------------------------------------------------------ */
/* backdrop                                                            */
/* ------------------------------------------------------------------ */

function backdropFor(movie, scene, palette) {
  const w = BACKDROP_W
  const h = BACKDROP_H
  // Different stream from the poster: same world, new composition.
  const rng = mulberry32(hashString(`${movie.slug}|backdrop`))
  const parts = SCENES_BUILD[scene](rng, palette, w, h)

  const discX = r1(w * (0.18 + rng() * 0.64))
  const discY = r1(h * (0.3 + rng() * 0.26))
  const discR = r1(h * (0.07 + rng() * 0.1))
  const beams = Array.from({ length: 4 }, (_, i) => {
    const x = r1(rng() * w)
    return `<path d="M${x} 0L${r1(x + h * 0.18)} 0L${r1(x - h * 0.5)} ${h}L${r1(x - h * 0.85)} ${h}Z" fill="${palette.disc}" opacity=".04"/>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${xml(movie.title)} backdrop">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${palette.sky
    .map((color, i) => `<stop offset="${i / (palette.sky.length - 1)}" stop-color="${color}"/>`)
    .join('')}</linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${palette.glow}"/><stop offset="1" stop-color="${palette.glow}" stop-opacity="0"/></radialGradient>
<linearGradient id="vig" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#sky)"/>
<circle cx="${discX}" cy="${discY}" r="${r1(discR * 5)}" fill="url(#glow)"/>
<circle cx="${discX}" cy="${discY}" r="${discR}" fill="${palette.disc}" opacity=".85"/>
${beams}${parts.far}${parts.mid}${parts.near}${parts.fore}
<rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

function pickScene(movie) {
  const rng = mulberry32(hashString(`${movie.slug}|scene`))
  const options = SCENES[movie.genres[0]] ?? ['ridges']
  return options[Math.floor(rng() * options.length) % options.length]
}

function artFor(movie) {
  const scene = pickScene(movie)
  const palette = buildPalette(movie, scene)
  return {
    scene,
    poster: posterFor(movie, scene, palette),
    backdrop: backdropFor(movie, scene, palette),
  }
}

const args = process.argv.slice(2)
const limit = args.length ? Number.parseInt(args[0], 10) : MOVIES.length
const slugFilter = Number.isNaN(limit) ? args[0] : null

const queue = slugFilter ? MOVIES.filter((movie) => movie.slug === slugFilter) : MOVIES.slice(0, limit)
if (!queue.length) {
  console.error(`no film matches "${slugFilter}"`)
  process.exit(1)
}

await rm(POSTER_DIR, { recursive: true, force: true })
await rm(BACKDROP_DIR, { recursive: true, force: true })
await mkdir(POSTER_DIR, { recursive: true })
await mkdir(BACKDROP_DIR, { recursive: true })

const BATCH = 64
let bytes = 0
const sizes = []

for (let i = 0; i < queue.length; i += BATCH) {
  const slice = queue.slice(i, i + BATCH)
  await Promise.all(
    slice.map(async (movie) => {
      const art = artFor(movie)
      await Promise.all([
        writeFile(resolve(POSTER_DIR, `${movie.slug}.svg`), art.poster, 'utf8'),
        writeFile(resolve(BACKDROP_DIR, `${movie.slug}.svg`), art.backdrop, 'utf8'),
      ])
      bytes += Buffer.byteLength(art.poster) + Buffer.byteLength(art.backdrop)
      sizes.push(Buffer.byteLength(art.poster), Buffer.byteLength(art.backdrop))
    }),
  )
}

const posters = await readdir(POSTER_DIR)
const backdrops = await readdir(BACKDROP_DIR)
const expected = queue.map((movie) => `${movie.slug}.svg`)
const missing = expected.filter((name) => !posters.includes(name) || !backdrops.includes(name))

console.log(`artwork written for ${queue.length} film(s)`)
console.log(`  posters   ${posters.length} in public/media/posters`)
console.log(`  backdrops ${backdrops.length} in public/media/backdrops`)
console.log(`  total     ${(bytes / 1024 / 1024).toFixed(2)} MB · avg ${Math.round(bytes / queue.length / 2 / 1024)} KB per file`)
console.log(`  largest   ${Math.round(Math.max(...sizes) / 1024)} KB`)
console.log(`  mismatched filenames ${missing.length}`)