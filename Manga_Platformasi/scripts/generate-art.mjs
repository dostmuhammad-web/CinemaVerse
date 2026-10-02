import { mkdir, readdir, writeFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MANGA, coverFor, bannerFor, COVER_DIR, BANNER_DIR } from '../src/data/manga.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const COVER_OUT = resolve(ROOT, 'public/media/covers')
const BANNER_OUT = resolve(ROOT, 'public/media/banners')

const COVER_W = 760
const COVER_H = 1140
const BANNER_W = 1920
const BANNER_H = 860

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

/* ------------------------------------------------------------------ */
/* colour                                                              */
/* ------------------------------------------------------------------ */

const hsl = (h, s, l, a = 1) =>
  a >= 1 ? `hsl(${h} ${s}% ${l}%)` : `hsl(${h} ${s}% ${l}% / ${a})`

const GENRE_HUES = {
  Action: 18,
  Adventure: 205,
  Fantasy: 275,
  'Sci-Fi': 198,
  Drama: 225,
  Psychological: 258,
  Romance: 335,
  Comedy: 45,
  'Slice of Life': 160,
  Mystery: 212,
  Horror: 350,
  Supernatural: 288,
  Historical: 30,
  Music: 320,
  Sports: 100,
  Cyberpunk: 315,
  School: 195,
  Thriller: 205,
  Political: 215,
  Folklore: 165,
  Food: 35,
}

function buildPalette(manga) {
  const seed = hashString(manga.id)
  const rng = mulberry32(seed)

  const genreWeights = manga.genres.map((g) => GENRE_HUES[g] ?? 200)
  const genreHue = genreWeights[0] ?? 200
  const spread = manga.genres.length > 1 ? (genreWeights[1] ?? genreHue + 60) : genreHue + 55

  const baseHue = (genreHue + rng() * 26 - 13 + 360) % 360
  const compHue = (baseHue + 180 + (rng() - 0.5) * 90 + 360) % 360
  const warmHue = (baseHue + 320 + rng() * 40) % 360

  const dark = manga.genres.includes('Horror') || manga.genres.includes('Psychological')
  const bright = manga.genres.includes('Comedy') || manga.genres.includes('Slice of Life')

  const skyTopL = dark ? 8 : 14
  const skyMidL = dark ? 16 : bright ? 46 : 34
  const skyBotL = dark ? 24 : bright ? 68 : 52

  const discHue = (warmHue + rng() * 20) % 360

  return {
    rng,
    seed,
    baseHue,
    compHue,
    warmHue,
    spread,
    dark,
    bright,
    sky: [
      hsl(baseHue, dark ? 55 : 70, skyTopL),
      hsl((baseHue + 12) % 360, dark ? 48 : 66, skyMidL),
      hsl(warmHue, dark ? 42 : 78, skyBotL),
      hsl(discHue, 92, Math.min(92, skyBotL + 22)),
    ],
    disc: hsl(discHue, 96, bright ? 80 : 86),
    discGlow: hsl(discHue, 100, 70, 0.55),
    rays: hsl(discHue, 100, 88, 0.14),
    far: hsl(baseHue, 42, dark ? 16 : 26),
    mid: hsl(compHue, 40, dark ? 10 : 16),
    near: hsl(compHue, 46, dark ? 6 : 9),
    fore: hsl((compHue + 10) % 360, 50, 4),
    accent: hsl((warmHue + 12) % 360, 92, 66),
    accent2: hsl((compHue + 30) % 360, 88, 70),
    text: '#ffffff',
  }
}

/* ------------------------------------------------------------------ */
/* silhouettes                                                         */
/* ------------------------------------------------------------------ */

function mountainPath(rng, w, baseY, height, roughness, steps) {
  const pts = []
  for (let i = 0; i <= steps; i += 1) {
    const x = (w / steps) * i
    const t = i / steps
    const bell = Math.sin(t * Math.PI)
    const y =
      baseY -
      height * bell * (0.55 + rng() * 0.45) -
      (i === 0 || i === steps ? 0 : (rng() - 0.5) * height * roughness)
    pts.push([x, y])
  }
  let d = `M -20 ${baseY + 400} L -20 ${pts[0][1].toFixed(1)}`
  pts.forEach(([x, y], i) => {
    if (i === 0) d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
    else {
      const [px, py] = pts[i - 1]
      const cx = (px + x) / 2
      d += ` Q ${cx.toFixed(1)} ${(Math.min(py, y) + (rng() - 0.5) * height * 0.12).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
    }
  })
  d += ` L ${w + 20} ${baseY + 400} Z`
  return d
}

function skylinePath(rng, w, baseY, height, opts = {}) {
  const minH = height * (opts.min ?? 0.28)
  let d = `M -30 ${baseY + 400} L -30 ${baseY}`
  let x = -30
  const blocks = []
  while (x < w + 30) {
    const bw = 18 + rng() * (opts.wide ? 74 : 46)
    const bh = minH + rng() * (height - minH)
    blocks.push({ x, w: bw, h: bh })
    d += ` L ${x.toFixed(1)} ${(baseY - bh).toFixed(1)} L ${(x + bw).toFixed(1)} ${(baseY - bh).toFixed(1)}`
    x += bw + (rng() * 8 - 2)
  }
  d += ` L ${w + 30} ${baseY + 400} Z`
  return { d, blocks }
}

function windows(rng, blocks, baseY, colour) {
  const out = []
  blocks.forEach((b) => {
    const cols = Math.max(1, Math.floor(b.w / 13))
    const rows = Math.max(1, Math.floor(b.h / 18))
    for (let c = 0; c < cols; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        if (rng() > 0.24) continue
        const wx = b.x + 5 + c * 13
        const wy = baseY - b.h + 8 + r * 18
        if (wx + 4 > b.x + b.w - 2 || wy + 5 > baseY - 2) continue
        out.push(
          `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3.6" height="5.4" rx="1" fill="${colour}" opacity="${(0.25 + rng() * 0.55).toFixed(2)}"/>`,
        )
      }
    }
  })
  return out.join('')
}

function antenna(rng, blocks, baseY, colour) {
  return blocks
    .filter(() => rng() > 0.6)
    .slice(0, 6)
    .map((b) => {
      const cx = b.x + b.w / 2
      const h = 20 + rng() * 46
      return `<rect x="${(cx - 1.2).toFixed(1)}" y="${(baseY - b.h - h).toFixed(1)}" width="2.4" height="${h.toFixed(1)}" fill="${colour}"/><circle cx="${cx.toFixed(1)}" cy="${(baseY - b.h - h).toFixed(1)}" r="2.6" fill="${colour}"/>`
    })
    .join('')
}

function forestPath(rng, w, baseY, height) {
  let d = `M -20 ${baseY + 400} L -20 ${baseY}`
  const trees = Math.round(w / 34)
  for (let i = 0; i <= trees; i += 1) {
    const x = (w / trees) * i
    const th = height * (0.45 + rng() * 0.55)
    const half = 9 + rng() * 10
    const tip = baseY - th
    d += ` L ${(x - half * 0.35).toFixed(1)} ${(baseY - th * 0.32).toFixed(1)} L ${(x - half * 0.5).toFixed(1)} ${(baseY - th * 0.62).toFixed(1)} L ${(x - half).toFixed(1)} ${(baseY - th * 0.78).toFixed(1)} L ${x.toFixed(1)} ${tip.toFixed(1)} L ${(x + half).toFixed(1)} ${(baseY - th * 0.78).toFixed(1)} L ${(x + half * 0.5).toFixed(1)} ${(baseY - th * 0.62).toFixed(1)} L ${(x + half * 0.35).toFixed(1)} ${(baseY - th * 0.32).toFixed(1)}`
  }
  d += ` L ${w + 20} ${baseY + 400} Z`
  return d
}

/* ------------------------------------------------------------------ */
/* character silhouette (bust)                                         */
/* ------------------------------------------------------------------ */

function characterBust(rng, cx, baseY, scale, tone, rim) {
  const r = 46 * scale
  const headCy = baseY - 152 * scale
  const neckTop = headCy + r * 0.86

  const style = Math.floor(rng() * 6)
  const parts = []

  /* shoulders + torso */
  const shoulderW = 96 * scale
  const shoulderY = baseY - 62 * scale
  parts.push(
    `<path d="M ${(cx - shoulderW).toFixed(1)} ${baseY} C ${(cx - shoulderW * 0.92).toFixed(1)} ${(shoulderY + 6 * scale).toFixed(1)}, ${(cx - 34 * scale).toFixed(1)} ${(neckTop + 6 * scale).toFixed(1)}, ${cx.toFixed(1)} ${(neckTop + 4 * scale).toFixed(1)} C ${(cx + 34 * scale).toFixed(1)} ${(neckTop + 6 * scale).toFixed(1)}, ${(cx + shoulderW * 0.92).toFixed(1)} ${(shoulderY + 6 * scale).toFixed(1)}, ${(cx + shoulderW).toFixed(1)} ${baseY} Z" fill="${tone}"/>`,
  )

  /* neck */
  parts.push(
    `<path d="M ${(cx - 15 * scale).toFixed(1)} ${neckTop - 4 * scale} L ${(cx - 17 * scale).toFixed(1)} ${neckTop + 16 * scale} L ${(cx + 17 * scale).toFixed(1)} ${neckTop + 16 * scale} L ${(cx + 15 * scale).toFixed(1)} ${neckTop - 4 * scale} Z" fill="${tone}"/>`,
  )

  /* head */
  parts.push(
    `<path d="M ${(cx - r * 0.86).toFixed(1)} ${headCy.toFixed(1)} C ${(cx - r * 0.9).toFixed(1)} ${(headCy - r * 0.95).toFixed(1)}, ${(cx + r * 0.9).toFixed(1)} ${(headCy - r * 0.95).toFixed(1)}, ${(cx + r * 0.86).toFixed(1)} ${headCy.toFixed(1)} C ${(cx + r * 0.84).toFixed(1)} ${(headCy + r * 0.92).toFixed(1)}, ${(cx + r * 0.4).toFixed(1)} ${(headCy + r * 1.2).toFixed(1)}, ${cx.toFixed(1)} ${(headCy + r * 1.2).toFixed(1)} C ${(cx - r * 0.4).toFixed(1)} ${(headCy + r * 1.2).toFixed(1)}, ${(cx - r * 0.84).toFixed(1)} ${(headCy + r * 0.92).toFixed(1)}, ${(cx - r * 0.86).toFixed(1)} ${headCy.toFixed(1)} Z" fill="${tone}"/>`,
  )

  /* hair */
  const hairTop = headCy - r * 0.98
  if (style === 0) {
    /* short spiky */
    let d = `M ${(cx - r * 0.94).toFixed(1)} ${(headCy - r * 0.1).toFixed(1)}`
    for (let i = 0; i <= 8; i += 1) {
      const t = i / 8
      const x = cx - r * 0.94 + r * 1.88 * t
      const spike = hairTop - r * (0.2 + rng() * 0.42) * (0.4 + Math.sin(t * Math.PI) * 0.8)
      const valley = hairTop + r * 0.3 * Math.sin(t * Math.PI)
      d += ` L ${x.toFixed(1)} ${spike.toFixed(1)} L ${(x + r * 0.1).toFixed(1)} ${valley.toFixed(1)}`
    }
    d += ` L ${(cx + r * 0.94).toFixed(1)} ${(headCy - r * 0.1).toFixed(1)} Z`
    parts.push(`<path d="${d}" fill="${tone}"/>`)
  } else if (style === 1) {
    /* long straight */
    parts.push(
      `<path d="M ${(cx - r * 1.02).toFixed(1)} ${(headCy + r * 1.5).toFixed(1)} L ${(cx - r * 0.98).toFixed(1)} ${(headCy - r * 0.3).toFixed(1)} C ${(cx - r * 0.95).toFixed(1)} ${hairTop.toFixed(1)}, ${(cx + r * 0.95).toFixed(1)} ${hairTop.toFixed(1)}, ${(cx + r * 0.98).toFixed(1)} ${(headCy - r * 0.3).toFixed(1)} L ${(cx + r * 1.02).toFixed(1)} ${(headCy + r * 1.5).toFixed(1)} L ${(cx + r * 0.6).toFixed(1)} ${(headCy + r * 1.3).toFixed(1)} L ${(cx + r * 0.62).toFixed(1)} ${headCy.toFixed(1)} L ${(cx - r * 0.62).toFixed(1)} ${headCy.toFixed(1)} L ${(cx - r * 0.6).toFixed(1)} ${(headCy + r * 1.3).toFixed(1)} Z" fill="${tone}"/>`,
    )
  } else if (style === 2) {
    /* ponytail */
    parts.push(
      `<path d="M ${(cx - r * 0.96).toFixed(1)} ${headCy.toFixed(1)} C ${(cx - r * 0.94).toFixed(1)} ${hairTop.toFixed(1)}, ${(cx + r * 0.94).toFixed(1)} ${hairTop.toFixed(1)}, ${(cx + r * 0.96).toFixed(1)} ${headCy.toFixed(1)} L ${(cx + r * 0.5).toFixed(1)} ${(headCy + r * 0.05).toFixed(1)} C ${(cx + r * 0.2).toFixed(1)} ${(headCy - r * 0.62).toFixed(1)}, ${(cx - r * 0.2).toFixed(1)} ${(headCy - r * 0.62).toFixed(1)}, ${(cx - r * 0.5).toFixed(1)} ${(headCy + r * 0.05).toFixed(1)} Z" fill="${tone}"/>`,
      `<path d="M ${(cx + r * 0.8).toFixed(1)} ${(headCy - r * 0.55).toFixed(1)} C ${(cx + r * 1.7).toFixed(1)} ${(headCy - r * 0.3).toFixed(1)}, ${(cx + r * 1.55).toFixed(1)} ${(headCy + r * 0.9).toFixed(1)}, ${(cx + r * 0.95).toFixed(1)} ${(headCy + r * 1.35).toFixed(1)} Z" fill="${tone}"/>`,
    )
  } else if (style === 3) {
    /* bob with fringe */
    parts.push(
      `<path d="M ${(cx - r * 1.06).toFixed(1)} ${(headCy + r * 0.85).toFixed(1)} C ${(cx - r * 1.1).toFixed(1)} ${(headCy - r * 1.05).toFixed(1)}, ${(cx + r * 1.1).toFixed(1)} ${(headCy - r * 1.05).toFixed(1)}, ${(cx + r * 1.06).toFixed(1)} ${(headCy + r * 0.85).toFixed(1)} L ${(cx + r * 0.58).toFixed(1)} ${(headCy + r * 0.85).toFixed(1)} C ${(cx + r * 0.66).toFixed(1)} ${(headCy - r * 0.2).toFixed(1)}, ${(cx - r * 0.66).toFixed(1)} ${(headCy - r * 0.2).toFixed(1)}, ${(cx - r * 0.58).toFixed(1)} ${(headCy + r * 0.85).toFixed(1)} Z" fill="${tone}"/>`,
    )
  } else if (style === 4) {
    /* hood + cape */
    parts.push(
      `<path d="M ${(cx - r * 1.2).toFixed(1)} ${(headCy + r * 1.15).toFixed(1)} C ${(cx - r * 1.25).toFixed(1)} ${(headCy - r * 1.15).toFixed(1)}, ${(cx + r * 1.25).toFixed(1)} ${(headCy - r * 1.15).toFixed(1)}, ${(cx + r * 1.2).toFixed(1)} ${(headCy + r * 1.15).toFixed(1)} Z" fill="${tone}"/>`,
      `<path d="M ${(cx - r * 1.25).toFixed(1)} ${(headCy + r * 0.2).toFixed(1)} C ${(cx - r * 1.9).toFixed(1)} ${(headCy + r * 0.5).toFixed(1)}, ${(cx - shoulderW * 1.02).toFixed(1)} ${neckTop.toFixed(1)}, ${(cx - shoulderW).toFixed(1)} ${baseY} L ${(cx + shoulderW).toFixed(1)} ${baseY} C ${(cx + shoulderW * 1.02).toFixed(1)} ${neckTop.toFixed(1)}, ${(cx + r * 1.9).toFixed(1)} ${(headCy + r * 0.5).toFixed(1)}, ${(cx + r * 1.25).toFixed(1)} ${(headCy + r * 0.2).toFixed(1)} Z" fill="${tone}"/>`,
    )
  } else {
    /* twin tails */
    parts.push(
      `<path d="M ${(cx - r * 0.98).toFixed(1)} ${headCy.toFixed(1)} C ${(cx - r * 0.96).toFixed(1)} ${hairTop.toFixed(1)}, ${(cx + r * 0.96).toFixed(1)} ${hairTop.toFixed(1)}, ${(cx + r * 0.98).toFixed(1)} ${headCy.toFixed(1)} L ${(cx + r * 0.52).toFixed(1)} ${(headCy + r * 0.1).toFixed(1)} C ${(cx + r * 0.2).toFixed(1)} ${(headCy - r * 0.6).toFixed(1)}, ${(cx - r * 0.2).toFixed(1)} ${(headCy - r * 0.6).toFixed(1)}, ${(cx - r * 0.52).toFixed(1)} ${(headCy + r * 0.1).toFixed(1)} Z" fill="${tone}"/>`,
      `<path d="M ${(cx - r * 0.9).toFixed(1)} ${(headCy - r * 0.35).toFixed(1)} C ${(cx - r * 1.9).toFixed(1)} ${(headCy - r * 0.1).toFixed(1)}, ${(cx - r * 1.7).toFixed(1)} ${(headCy + r * 1.3).toFixed(1)}, ${(cx - r * 1.05).toFixed(1)} ${(headCy + r * 1.5).toFixed(1)} Z" fill="${tone}"/>`,
      `<path d="M ${(cx + r * 0.9).toFixed(1)} ${(headCy - r * 0.35).toFixed(1)} C ${(cx + r * 1.9).toFixed(1)} ${(headCy - r * 0.1).toFixed(1)}, ${(cx + r * 1.7).toFixed(1)} ${(headCy + r * 1.3).toFixed(1)}, ${(cx + r * 1.05).toFixed(1)} ${(headCy + r * 1.5).toFixed(1)} Z" fill="${tone}"/>`,
    )
  }

  /* accessory */
  const acc = rng()
  if (acc > 0.72) {
    parts.push(
      `<circle cx="${(cx - r * 1.05).toFixed(1)}" cy="${(headCy - r * 0.55).toFixed(1)}" r="${(r * 0.2).toFixed(1)}" fill="${tone}"/>`,
      `<circle cx="${(cx + r * 1.05).toFixed(1)}" cy="${(headCy - r * 0.55).toFixed(1)}" r="${(r * 0.2).toFixed(1)}" fill="${tone}"/>`,
    )
  } else if (acc > 0.5) {
    parts.push(
      `<path d="M ${(cx - r * 0.5).toFixed(1)} ${(headCy - r * 1.05).toFixed(1)} l ${(r * 0.34).toFixed(1)} ${(-r * 0.7).toFixed(1)} l ${(r * 0.34).toFixed(1)} ${(r * 0.7).toFixed(1)} Z" fill="${tone}"/>`,
      `<path d="M ${(cx + r * 0.5).toFixed(1)} ${(headCy - r * 1.05).toFixed(1)} l ${(-r * 0.34).toFixed(1)} ${(-r * 0.7).toFixed(1)} l ${(-r * 0.34).toFixed(1)} ${(r * 0.7).toFixed(1)} Z" fill="${tone}"/>`,
    )
  }

  /* collar detail + rim light */
  parts.push(
    `<path d="M ${(cx - 30 * scale).toFixed(1)} ${(neckTop + 2 * scale).toFixed(1)} L ${cx.toFixed(1)} ${(neckTop + 34 * scale).toFixed(1)} L ${(cx + 30 * scale).toFixed(1)} ${(neckTop + 2 * scale).toFixed(1)}" fill="none" stroke="${rim}" stroke-width="${(3 * scale).toFixed(1)}" opacity="0.5" stroke-linecap="round"/>`,
    `<path d="M ${(cx - r * 0.88).toFixed(1)} ${(headCy - r * 0.2).toFixed(1)} C ${(cx - r * 0.9).toFixed(1)} ${(headCy - r * 0.95).toFixed(1)}, ${(cx - r * 0.2).toFixed(1)} ${(headCy - r * 1.06).toFixed(1)}, ${(cx + r * 0.1).toFixed(1)} ${(headCy - r * 1.02).toFixed(1)}" fill="none" stroke="${rim}" stroke-width="${(4.5 * scale).toFixed(1)}" opacity="0.75" stroke-linecap="round"/>`,
  )

  return `<g>${parts.join('')}</g>`
}

/* ------------------------------------------------------------------ */
/* particles                                                           */
/* ------------------------------------------------------------------ */

function particles(rng, w, h, palette, count, kind) {
  const out = []
  for (let i = 0; i < count; i += 1) {
    const x = rng() * w
    const y = rng() * h
    const o = (0.18 + rng() * 0.62).toFixed(2)
    const col = rng() > 0.5 ? palette.accent : palette.accent2
    if (kind === 'petal') {
      const s = 5 + rng() * 11
      const rot = rng() * 360
      out.push(
        `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${s.toFixed(1)}" ry="${(s * 0.44).toFixed(1)}" fill="${col}" opacity="${o}" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`,
      )
    } else if (kind === 'spark') {
      const s = 3 + rng() * 12
      out.push(
        `<path d="M ${x.toFixed(1)} ${(y - s).toFixed(1)} Q ${(x + s * 0.16).toFixed(1)} ${(y - s * 0.16).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x - s * 0.16).toFixed(1)} ${(y + s * 0.16).toFixed(1)} ${x.toFixed(1)} ${(y + s).toFixed(1)} Q ${(x + s * 0.16).toFixed(1)} ${(y + s * 0.16).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x - s * 0.16).toFixed(1)} ${(y - s * 0.16).toFixed(1)} ${x.toFixed(1)} ${(y - s).toFixed(1)} Z" fill="${col}" opacity="${o}"/>`,
      )
    } else if (kind === 'snow') {
      out.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.4 + rng() * 3.6).toFixed(1)}" fill="#ffffff" opacity="${o}"/>`,
      )
    } else if (kind === 'star') {
      const s = 2 + rng() * 5
      out.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(s * 0.4).toFixed(1)}" fill="#ffffff" opacity="${o}"/><path d="M ${x.toFixed(1)} ${(y - s).toFixed(1)} L ${x.toFixed(1)} ${(y + s).toFixed(1)} M ${(x - s).toFixed(1)} ${y.toFixed(1)} L ${(x + s).toFixed(1)} ${y.toFixed(1)}" stroke="#ffffff" stroke-width="0.7" opacity="${o}"/>`,
      )
    } else {
      out.push(
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(0.9 + rng() * 1.2).toFixed(1)}" height="${(14 + rng() * 34).toFixed(1)}" rx="1" fill="#ffffff" opacity="${(0.08 + rng() * 0.22).toFixed(2)}" transform="rotate(${(rng() * 24 - 12).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`,
      )
    }
  }
  return out.join('')
}

function bokeh(rng, w, h, palette, count) {
  const out = []
  for (let i = 0; i < count; i += 1) {
    const r = 12 + rng() * 74
    const x = rng() * w
    const y = rng() * h * 0.85
    out.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${palette.disc}" opacity="${(0.03 + rng() * 0.09).toFixed(3)}"/>`,
    )
  }
  return out.join('')
}

/* ------------------------------------------------------------------ */
/* text helpers                                                        */
/* ------------------------------------------------------------------ */

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function wrapLines(text, maxCharsPerLine, maxLines) {
  const words = String(text).split(/\s+/)
  const lines = []
  let current = ''
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= maxCharsPerLine || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
    }
  })
  if (current) lines.push(current)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[^\w'’-]+$/, '')}…`
    return kept
  }
  return lines
}

/* ------------------------------------------------------------------ */
/* artwork                                                             */
/* ------------------------------------------------------------------ */

function sceneKind(palette) {
  const n = palette.rng()
  if (palette.dark) return n > 0.45 ? 'city' : 'mountains'
  if (n > 0.66) return 'city'
  if (n > 0.33) return 'mountains'
  return 'forest'
}

function particleKind(manga, palette) {
  if (manga.genres.includes('Horror') || manga.genres.includes('Mystery')) return 'star'
  if (manga.genres.includes('Sci-Fi')) return 'star'
  if (manga.genres.includes('Romance')) return 'petal'
  if (manga.genres.includes('Drama') || manga.genres.includes('Historical')) return 'snow'
  if (palette.dark) return 'star'
  if (palette.rng() > 0.5) return 'petal'
  return 'spark'
}

function coverArt(manga) {
  const p = buildPalette(manga)
  const rng = p.rng
  const W = COVER_W
  const H = COVER_H
  const kind = sceneKind(p)
  const pKind = particleKind(manga, p)

  const horizon = H * (0.66 + rng() * 0.08)
  const discX = W * (0.2 + rng() * 0.6)
  const discY = horizon - H * (0.02 + rng() * 0.22)
  const discR = H * (0.09 + rng() * 0.08)

  const layers = []

  layers.push(
    `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0.18" y2="1">
        <stop offset="0%" stop-color="${p.sky[0]}"/>
        <stop offset="38%" stop-color="${p.sky[1]}"/>
        <stop offset="72%" stop-color="${p.sky[2]}"/>
        <stop offset="100%" stop-color="${p.sky[3]}"/>
      </linearGradient>
      <radialGradient id="discglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="${p.disc}" stop-opacity="0.85"/>
        <stop offset="45%" stop-color="${p.discGlow}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${p.discGlow}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.sky[3]}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${p.sky[3]}" stop-opacity="0.85"/>
      </linearGradient>
      <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#05060a" stop-opacity="0"/>
        <stop offset="52%" stop-color="#05060a" stop-opacity="0.62"/>
        <stop offset="100%" stop-color="#05060a" stop-opacity="0.96"/>
      </linearGradient>
      <linearGradient id="topfade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#05060a" stop-opacity="0.62"/>
        <stop offset="100%" stop-color="#05060a" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="vignette" cx="0.5" cy="0.44" r="0.78">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.66"/>
      </radialGradient>
      <pattern id="halftone" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1.4" cy="1.4" r="1.05" fill="#ffffff" fill-opacity="0.055"/>
      </pattern>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${p.seed % 9999}" result="n"/>
        <feColorMatrix in="n" type="saturate" values="0"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.16"/></feComponentTransfer>
      </filter>
      <filter id="softblur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="26"/>
      </filter>
      <clipPath id="frame"><rect width="${W}" height="${H}" rx="0"/></clipPath>
    </defs>`,
  )

  layers.push(`<g clip-path="url(#frame)">`)
  layers.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`)

  /* light rays */
  const rays = []
  for (let i = 0; i < 7; i += 1) {
    const a = -1.5 + rng() * 1.2
    const spread = 0.05 + rng() * 0.12
    const len = H * (0.9 + rng() * 0.7)
    const x1 = discX + Math.cos(a) * 20
    const y1 = discY + Math.sin(a) * 20
    rays.push(
      `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${(x1 + Math.cos(a - spread) * len).toFixed(1)} ${(y1 + Math.sin(a - spread) * len).toFixed(1)} L ${(x1 + Math.cos(a + spread) * len).toFixed(1)} ${(y1 + Math.sin(a + spread) * len).toFixed(1)} Z" fill="${p.rays}"/>`,
    )
  }
  layers.push(`<g>${rays.join('')}</g>`)

  /* sun + glow */
  layers.push(`<circle cx="${discX.toFixed(1)}" cy="${discY.toFixed(1)}" r="${(discR * 5.2).toFixed(1)}" fill="url(#discglow)"/>`)
  layers.push(`<circle cx="${discX.toFixed(1)}" cy="${discY.toFixed(1)}" r="${discR.toFixed(1)}" fill="${p.disc}" opacity="0.96"/>`)

  /* clouds */
  const clouds = []
  for (let i = 0; i < 5; i += 1) {
    const cy = H * (0.14 + rng() * 0.4)
    const cw = W * (0.3 + rng() * 0.6)
    const ch = 12 + rng() * 26
    clouds.push(
      `<ellipse cx="${(rng() * W).toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(cw / 2).toFixed(1)}" ry="${ch.toFixed(1)}" fill="#ffffff" opacity="${(0.05 + rng() * 0.11).toFixed(3)}"/>`,
    )
  }
  layers.push(`<g filter="url(#softblur)">${clouds.join('')}</g>`)

  layers.push(bokeh(rng, W, H, p, 14))

  /* scene layers */
  if (kind === 'mountains') {
    layers.push(`<path d="${mountainPath(rng, W, horizon + 10, H * 0.3, 0.18, 7)}" fill="${p.far}" opacity="0.72"/>`)
    layers.push(`<path d="${mountainPath(rng, W, horizon + H * 0.05, H * 0.22, 0.22, 5)}" fill="${p.mid}" opacity="0.9"/>`)
  } else if (kind === 'city') {
    const far = skylinePath(rng, W, horizon - 6, H * 0.2, { wide: true })
    layers.push(`<path d="${far.d}" fill="${p.far}" opacity="0.68"/>`)
    const mid = skylinePath(rng, W, horizon + H * 0.02, H * 0.24, {})
    layers.push(`<path d="${mid.d}" fill="${p.mid}" opacity="0.92"/>`)
    layers.push(`<g>${windows(rng, mid.blocks, horizon + H * 0.02, p.disc)}</g>`)
    layers.push(`<g>${antenna(rng, mid.blocks, horizon + H * 0.02, p.mid)}</g>`)
  } else {
    layers.push(`<path d="${mountainPath(rng, W, horizon + 6, H * 0.16, 0.14, 6)}" fill="${p.far}" opacity="0.6"/>`)
    layers.push(`<path d="${forestPath(rng, W, horizon + H * 0.03, H * 0.2)}" fill="${p.mid}" opacity="0.9"/>`)
  }

  /* mist band */
  layers.push(`<rect x="0" y="${(horizon - 70).toFixed(1)}" width="${W}" height="180" fill="url(#mist)" opacity="0.55"/>`)

  /* near ground */
  layers.push(`<path d="${mountainPath(rng, W, H * 1.02, H * 0.1, 0.3, 4)}" fill="${p.near}"/>`)

  /* character */
  const charX = W * (0.5 + (rng() - 0.5) * 0.1)
  layers.push(characterBust(rng, charX, H * 1.02, 1.05, '#05060a', p.accent))

  /* foreground particles */
  layers.push(particles(rng, W, H, p, pKind === 'rain' ? 70 : 46, pKind))

  /* texture */
  layers.push(`<rect width="${W}" height="${H}" fill="url(#halftone)"/>`)
  layers.push(`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.5"/>`)
  layers.push(`<rect width="${W}" height="${H}" fill="url(#vignette)"/>`)
  layers.push(`<rect width="${W}" height="${H * 0.24}" fill="url(#topfade)"/>`)

  /* typography */
  const subtitle = manga.alternativeTitles.find((t) => /[\u3040-\u30ff\u4e00-\u9faf]/.test(t)) ?? ''
  const maxChars = Math.max(11, Math.floor(W / 26))
  const titleLines = wrapLines(manga.title, maxChars, 3)
  const fontSize = titleLines.length > 2 ? 50 : titleLines.length > 1 ? 60 : 72
  const blockH = titleLines.length * fontSize * 1.04

  let ty = H - 62 - blockH + fontSize * 0.8
  const type = []

  type.push(
    `<rect x="56" y="${(ty - fontSize * 0.92).toFixed(1)}" width="42" height="3.5" fill="${p.accent}"/>`,
  )
  if (subtitle) {
    type.push(
      `<text x="56" y="${(ty - fontSize * 1.16).toFixed(1)}" font-family="'Yu Gothic','Hiragino Kaku Gothic ProN','Segoe UI',sans-serif" font-size="20" font-weight="600" fill="#ffffff" fill-opacity="0.72" letter-spacing="2">${escapeXml(subtitle)}</text>`,
    )
  }
  titleLines.forEach((line) => {
    type.push(
      `<text x="56" y="${ty.toFixed(1)}" font-family="'Segoe UI',Inter,system-ui,-apple-system,sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff" letter-spacing="-1.6">${escapeXml(line.toUpperCase())}</text>`,
    )
    ty += fontSize * 1.04
  })
  type.push(
    `<text x="56" y="${(H - 34).toFixed(1)}" font-family="'Segoe UI',Inter,system-ui,sans-serif" font-size="16" font-weight="600" fill="#ffffff" fill-opacity="0.66" letter-spacing="1.4">${escapeXml(manga.author.toUpperCase())} · ${manga.year}</text>`,
  )
  type.push(
    `<text x="${W - 56}" y="${(H - 34).toFixed(1)}" text-anchor="end" font-family="'Segoe UI',Inter,system-ui,sans-serif" font-size="15" font-weight="700" fill="#ffffff" fill-opacity="0.5" letter-spacing="1.6">${escapeXml(String(manga.chapterCount).padStart(3, '0'))} CH</text>`,
  )

  layers.push(`<rect x="0" y="${(H * 0.52).toFixed(1)}" width="${W}" height="${(H * 0.48).toFixed(1)}" fill="url(#scrim)"/>`)
  layers.push(`<g>${type.join('')}</g>`)
  layers.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>`)
  layers.push(`</g>`)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escapeXml(manga.title)} cover">${layers.join('')}</svg>`
}

function bannerArt(manga) {
  const p = buildPalette(manga)
  const rng = mulberry32(p.seed ^ 0x9e3779b9)
  const W = BANNER_W
  const H = BANNER_H
  const kind = sceneKind(p)
  const pKind = particleKind(manga, p)

  const horizon = H * (0.68 + rng() * 0.08)
  const discX = W * (0.5 + rng() * 0.28)
  const discY = horizon - H * (0.06 + rng() * 0.2)
  const discR = H * (0.1 + rng() * 0.09)

  const layers = []
  const uid = `b${p.seed.toString(36)}`

  layers.push(
    `<defs>
      <linearGradient id="sky${uid}" x1="0" y1="0" x2="0.12" y2="1">
        <stop offset="0%" stop-color="${p.sky[0]}"/>
        <stop offset="36%" stop-color="${p.sky[1]}"/>
        <stop offset="70%" stop-color="${p.sky[2]}"/>
        <stop offset="100%" stop-color="${p.sky[3]}"/>
      </linearGradient>
      <radialGradient id="glow${uid}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="${p.disc}" stop-opacity="0.8"/>
        <stop offset="48%" stop-color="${p.discGlow}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${p.discGlow}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="left${uid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#05060a" stop-opacity="0.94"/>
        <stop offset="34%" stop-color="#05060a" stop-opacity="0.66"/>
        <stop offset="72%" stop-color="#05060a" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#05060a" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="mist${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.sky[3]}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${p.sky[3]}" stop-opacity="0.8"/>
      </linearGradient>
      <radialGradient id="vig${uid}" cx="0.5" cy="0.48" r="0.8">
        <stop offset="52%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.6"/>
      </radialGradient>
      <pattern id="half${uid}" width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.1" fill="#ffffff" fill-opacity="0.05"/>
      </pattern>
      <filter id="grain${uid}" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${(p.seed % 7777) + 3}"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer>
      </filter>
      <filter id="blur${uid}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="34"/>
      </filter>
      <clipPath id="clip${uid}"><rect width="${W}" height="${H}"/></clipPath>
    </defs>`,
  )

  layers.push(`<g clip-path="url(#clip${uid})">`)
  layers.push(`<rect width="${W}" height="${H}" fill="url(#sky${uid})"/>`)

  const rays = []
  for (let i = 0; i < 8; i += 1) {
    const a = -1.5 + rng() * 1.1
    const spread = 0.04 + rng() * 0.1
    const len = W * (0.5 + rng() * 0.6)
    const x1 = discX + Math.cos(a) * 24
    const y1 = discY + Math.sin(a) * 24
    rays.push(
      `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${(x1 + Math.cos(a - spread) * len).toFixed(1)} ${(y1 + Math.sin(a - spread) * len).toFixed(1)} L ${(x1 + Math.cos(a + spread) * len).toFixed(1)} ${(y1 + Math.sin(a + spread) * len).toFixed(1)} Z" fill="${p.rays}"/>`,
    )
  }
  layers.push(`<g>${rays.join('')}</g>`)

  layers.push(`<circle cx="${discX.toFixed(1)}" cy="${discY.toFixed(1)}" r="${(discR * 5).toFixed(1)}" fill="url(#glow${uid})"/>`)
  layers.push(`<circle cx="${discX.toFixed(1)}" cy="${discY.toFixed(1)}" r="${discR.toFixed(1)}" fill="${p.disc}" opacity="0.95"/>`)

  const clouds = []
  for (let i = 0; i < 7; i += 1) {
    clouds.push(
      `<ellipse cx="${(rng() * W).toFixed(1)}" cy="${(H * (0.1 + rng() * 0.45)).toFixed(1)}" rx="${((W * (0.2 + rng() * 0.4)) / 2).toFixed(1)}" ry="${(14 + rng() * 40).toFixed(1)}" fill="#ffffff" opacity="${(0.04 + rng() * 0.09).toFixed(3)}"/>`,
    )
  }
  layers.push(`<g filter="url(#blur${uid})">${clouds.join('')}</g>`)
  layers.push(bokeh(rng, W, H, p, 18))

  if (kind === 'mountains') {
    layers.push(`<path d="${mountainPath(rng, W, horizon - 4, H * 0.34, 0.16, 9)}" fill="${p.far}" opacity="0.66"/>`)
    layers.push(`<path d="${mountainPath(rng, W, horizon + H * 0.06, H * 0.24, 0.2, 6)}" fill="${p.mid}" opacity="0.92"/>`)
  } else if (kind === 'city') {
    const far = skylinePath(rng, W, horizon - 10, H * 0.24, { wide: true })
    layers.push(`<path d="${far.d}" fill="${p.far}" opacity="0.62"/>`)
    const mid = skylinePath(rng, W, horizon + H * 0.03, H * 0.28, {})
    layers.push(`<path d="${mid.d}" fill="${p.mid}" opacity="0.94"/>`)
    layers.push(`<g>${windows(rng, mid.blocks, horizon + H * 0.03, p.disc)}</g>`)
    layers.push(`<g>${antenna(rng, mid.blocks, horizon + H * 0.03, p.mid)}</g>`)
  } else {
    layers.push(`<path d="${mountainPath(rng, W, horizon - 2, H * 0.2, 0.12, 8)}" fill="${p.far}" opacity="0.58"/>`)
    layers.push(`<path d="${forestPath(rng, W, horizon + H * 0.04, H * 0.26)}" fill="${p.mid}" opacity="0.9"/>`)
  }

  layers.push(`<rect x="0" y="${(horizon - 90).toFixed(1)}" width="${W}" height="200" fill="url(#mist${uid})" opacity="0.5"/>`)
  layers.push(`<path d="${mountainPath(rng, W, H * 1.05, H * 0.12, 0.28, 5)}" fill="${p.near}"/>`)

  const charX = W * (0.68 + rng() * 0.14)
  layers.push(characterBust(rng, charX, H * 1.04, 1.5, '#05060a', p.accent))

  layers.push(particles(rng, W, H, p, 70, pKind))
  layers.push(`<rect width="${W}" height="${H}" fill="url(#half${uid})"/>`)
  layers.push(`<rect width="${W}" height="${H}" filter="url(#grain${uid})" opacity="0.5"/>`)
  layers.push(`<rect width="${W}" height="${H}" fill="url(#vig${uid})"/>`)
  layers.push(`<rect width="${W * 0.72}" height="${H}" fill="url(#left${uid})"/>`)

  const jp = manga.alternativeTitles.find((t) => /[\u3040-\u30ff\u4e00-\u9faf]/.test(t)) ?? ''
  const lines = wrapLines(manga.title, 26, 2)
  const fs = lines.length > 1 ? 78 : 92
  let ty = H / 2 - (lines.length * fs * 1.06) / 2 + fs * 0.72
  const type = []
  type.push(`<rect x="96" y="${(ty - fs * 0.86).toFixed(1)}" width="56" height="4" fill="${p.accent}"/>`)
  if (jp) {
    type.push(
      `<text x="96" y="${(ty - fs * 1.12).toFixed(1)}" font-family="'Yu Gothic','Hiragino Kaku Gothic ProN','Segoe UI',sans-serif" font-size="26" font-weight="600" fill="#ffffff" fill-opacity="0.7" letter-spacing="4">${escapeXml(jp)}</text>`,
    )
  }
  lines.forEach((line) => {
    type.push(
      `<text x="96" y="${ty.toFixed(1)}" font-family="'Segoe UI',Inter,system-ui,sans-serif" font-size="${fs}" font-weight="800" fill="#ffffff" letter-spacing="-2.4">${escapeXml(line)}</text>`,
    )
    ty += fs * 1.06
  })
  type.push(
    `<text x="96" y="${(ty + 34).toFixed(1)}" font-family="'Segoe UI',Inter,system-ui,sans-serif" font-size="21" font-weight="600" fill="#ffffff" fill-opacity="0.62" letter-spacing="2.2">${escapeXml(manga.genres.slice(0, 3).join('  ·  ').toUpperCase())}</text>`,
  )
  layers.push(`<g>${type.join('')}</g>`)
  layers.push(`</g>`)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escapeXml(manga.title)} banner">${layers.join('')}</svg>`
}

/* ------------------------------------------------------------------ */
/* run + verify                                                        */
/* ------------------------------------------------------------------ */

await rm(COVER_OUT, { recursive: true, force: true })
await rm(BANNER_OUT, { recursive: true, force: true })
await mkdir(COVER_OUT, { recursive: true })
await mkdir(BANNER_OUT, { recursive: true })

let bytes = 0
for (const manga of MANGA) {
  const cover = coverArt(manga)
  const banner = bannerArt(manga)
  await writeFile(resolve(ROOT, 'public', coverFor(manga.id).replace(/^\//, '')), cover, 'utf8')
  await writeFile(resolve(ROOT, 'public', bannerFor(manga.id).replace(/^\//, '')), banner, 'utf8')
  bytes += cover.length + banner.length
}

const expectedCovers = MANGA.map((m) => `${m.id}.svg`).sort()
const expectedBanners = MANGA.map((m) => `${m.id}.svg`).sort()
const actualCovers = (await readdir(COVER_OUT)).sort()
const actualBanners = (await readdir(BANNER_OUT)).sort()

const fail = (msg) => {
  console.error(`FAIL  ${msg}`)
  process.exitCode = 1
}

if (JSON.stringify(expectedCovers) !== JSON.stringify(actualCovers)) fail('cover files do not match manga ids 1:1')
if (JSON.stringify(expectedBanners) !== JSON.stringify(actualBanners)) fail('banner files do not match manga ids 1:1')

const ids = MANGA.map((m) => m.id)
if (new Set(ids).size !== ids.length) fail('duplicate manga ids')

const signatures = new Map()
for (const manga of MANGA) {
  const sig = hashString(manga.id)
  if (signatures.has(sig)) fail(`seed collision on ${manga.id}`)
  signatures.set(sig, manga.id)
}

console.log(`generated ${MANGA.length} covers + ${MANGA.length} banners (${(bytes / 1024 / 1024).toFixed(2)} MB)`)
console.log(`mapping verified: mangaId -> ${COVER_DIR}/{id}.svg + ${BANNER_DIR}/{id}.svg`)
if (process.exitCode) console.error('mapping verification failed')
else console.log('OK')