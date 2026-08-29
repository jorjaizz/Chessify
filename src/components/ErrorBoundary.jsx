import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grain-bg flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
          <div className="text-6xl">⚠️</div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-riot">Something exploded</h1>
          <pre className="max-w-xl overflow-auto rounded-sm border-2 border-riot/50 bg-ink-2 p-4 text-left text-sm text-riot/90">
            {String(this.state.error && this.state.error.stack || String(this.state.error && this.state.error.message))}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="rounded-sm border-2 border-volt bg-volt px-6 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-volt"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}