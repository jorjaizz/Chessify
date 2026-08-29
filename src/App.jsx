import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Menu from './components/Menu.jsx'
import GameScreen from './components/GameScreen.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

export default function App() {
  const [screen, setScreen] = useState('menu')
  const [mode, setMode] = useState('local')
  const [botLevel, setBotLevel] = useState('regular')
  const [gameKey, setGameKey] = useState(0)

  const start = (m, level) => {
    setMode(m)
    if (level) setBotLevel(level)
    setGameKey((k) => k + 1)
    setScreen('game')
  }

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {screen === 'menu' ? (
          <Menu
            key="menu"
            onPlay={() => start('local')}
            onPlayBot={(level) => start('bot', level)}
          />
        ) : (
          <GameScreen key={gameKey} mode={mode} botLevel={botLevel} onMenu={() => setScreen('menu')} />
        )}
      </AnimatePresence>
    </ErrorBoundary>
  )
}