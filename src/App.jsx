import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Menu from './components/Menu.jsx'
import GameScreen from './components/GameScreen.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

export default function App() {
  const [screen, setScreen] = useState('menu')
  const [gameKey, setGameKey] = useState(0)

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {screen === 'menu' ? (
          <Menu key="menu" onPlay={() => {
            setGameKey((k) => k + 1)
            setScreen('game')
          }} />
        ) : (
          <GameScreen key={gameKey} onMenu={() => setScreen('menu')} />
        )}
      </AnimatePresence>
    </ErrorBoundary>
  )
}