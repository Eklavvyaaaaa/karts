import './App.css'
import { useState } from 'react'
import { DebugPanel } from './components/DebugPanel'
import { GameHud } from './components/GameHud'
import { ResultsScreen } from './components/ResultsScreen'
import { useGameStore } from './state/gameStore'
import { GameScene } from './game/core/GameScene'
import { RaceManager } from './game/race/RaceManager'
import { SINGLE_PLAYER_RACE } from './game/race/RaceConfig'
import { NEON_CIRCUIT } from './game/track/TrackConfig'

function App() {
  const setRace = useGameStore((state) => state.setRace)
  const [raceManager] = useState(() => new RaceManager(SINGLE_PLAYER_RACE, NEON_CIRCUIT.checkpoints.length, setRace))

  return (
    <main className="game-shell">
      <GameScene raceManager={raceManager} />
      <GameHud raceManager={raceManager} />
      <ResultsScreen raceManager={raceManager} />
      <section className="drive-hint" aria-label="Driving controls">
        <span className="key-cluster"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span>
        <span>DRIVE</span>
      </section>
      <DebugPanel />
      <div className="corner-label">FOUNDATION BUILD <span>v0.1</span></div>
    </main>
  )
}

export default App
