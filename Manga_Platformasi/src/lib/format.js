export function formatCompact(value) {
  const n = Number(value) || 0
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Math.round(Number(value) || 0))
}

export function formatViews(value) {
  return formatCompact(value)
}

export function parseISO(iso) {
  const [y, m, d] = String(iso).split('-').map(Number)
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1))
}

export function formatDate(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatDateShort(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  })
}

export function timeAgo(iso) {
  const then = parseISO(iso).getTime()
  const now = Date.UTC(2026, 8, 30)
  const diff = Math.max(0, now - then)
  const minutes = Math.round(diff / 60000)
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(months / 12)}y ago`
}

export function statusTone(status) {
  switch (status) {
    case 'Ongoing':
      return 'live'
    case 'Completed':
      return 'done'
    case 'Finished':
      return 'done'
    case 'Hiatus':
      return 'pause'
    default:
      return 'muted'
  }
}

export function pad(n, len = 2) {
  return String(n).padStart(len, '0')
}

export function pluralize(n, one, many) {
  return `${formatNumber(n)} ${n === 1 ? one : many}`
}