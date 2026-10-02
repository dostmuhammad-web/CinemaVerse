import React from 'react'
import { Icon } from './Icons.jsx'

/* ------------------------------------------------------------------ */
/* loading placeholders                                                */
/* ------------------------------------------------------------------ */

export function CardSkeleton() {
  return (
    <div className="card card--skeleton" aria-hidden="true">
      <div className="card__poster shimmer" />
      <div className="card__body">
        <div className="shimmer skeleton-line" style={{ width: '86%' }} />
        <div className="shimmer skeleton-line" style={{ width: '54%', height: 10 }} />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 12, className = '' }) {
  return (
    <div className={`grid grid--cards ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="hero hero--skeleton" aria-hidden="true">
      <div className="hero__media">
        <div className="shimmer hero__shimmer" />
      </div>
      <div className="hero__content page">
        <div className="shimmer skeleton-line" style={{ width: 220, height: 14 }} />
        <div className="shimmer skeleton-line" style={{ width: '58%', height: 46 }} />
        <div className="shimmer skeleton-line" style={{ width: '44%', height: 46 }} />
        <div className="shimmer skeleton-line" style={{ width: '70%' }} />
        <div className="hero__buttons">
          <div className="shimmer" style={{ width: 148, height: 44 }} />
          <div className="shimmer" style={{ width: 168, height: 44 }} />
        </div>
      </div>
    </section>
  )
}

export function RailSkeleton({ count = 6 }) {
  return (
    <div className="rail__track" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="rail__item" key={index}>
          <CardSkeleton />
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="detail" aria-hidden="true">
      <div className="detail__hero shimmer" />
      <div className="page detail__grid">
        <div className="detail__poster shimmer" />
        <div className="detail__copy">
          <div className="shimmer skeleton-line" style={{ width: '60%', height: 38 }} />
          <div className="shimmer skeleton-line" style={{ width: '30%' }} />
          <div className="shimmer skeleton-line" style={{ width: '100%' }} />
          <div className="shimmer skeleton-line" style={{ width: '94%' }} />
          <div className="shimmer skeleton-line" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* empty + error states                                                */
/* ------------------------------------------------------------------ */

export function EmptyState({ icon = 'search', title, body, action, compact = false }) {
  return (
    <div className={`empty ${compact ? 'empty--compact' : ''}`.trim()}>
      <span className="empty__icon">
        <Icon name={icon} size={compact ? 22 : 30} />
      </span>
      <h3 className="empty__title">{title}</h3>
      {body ? <p className="empty__body">{body}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', body, onRetry }) {
  return (
    <div className="empty empty--error" role="alert">
      <span className="empty__icon">
        <Icon name="info" size={30} />
      </span>
      <h3 className="empty__title">{title}</h3>
      {body ? <p className="empty__body">{body}</p> : null}
      {onRetry ? (
        <div className="empty__action">
          <button type="button" className="btn btn--ghost" onClick={onRetry}>
            <Icon name="reset" size={18} />
            Try again
          </button>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Catches render errors anywhere below it so one broken page cannot take the
 * whole catalogue down.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Kept in the console for debugging; no external reporting in a static demo.
    console.error('CinemaVerse render error:', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page">
          <ErrorState
            title="This section failed to render"
            body={String(this.state.error?.message || this.state.error)}
            onRetry={() => this.setState({ error: null })}
          />
        </div>
      )
    }
    return this.props.children
  }
}