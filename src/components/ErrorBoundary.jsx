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
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-3xl font-black text-crimson">SOMETHING EXPLODED</h1>
          <pre className="max-w-xl overflow-auto rounded-lg bg-black/40 p-4 text-left text-sm text-crimson/90">
            {String(this.state.error && this.state.error.stack || String(this.state.error && this.state.error.message))}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border-2 border-neon bg-neon/10 px-6 py-2 font-bold text-neon hover:bg-neon hover:text-ink"
          >
            RELOAD
          </button>
        </div>
      )
    }
    return this.props.children
  }
}