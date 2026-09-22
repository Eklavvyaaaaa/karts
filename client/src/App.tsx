import './App.css'
import { DebugPanel } from './components/DebugPanel'
import { GameHud } from './components/GameHud'
import { GameScene } from './game/core/GameScene'

function App() {
  return (
    <main className="game-shell">
      <GameScene />
      <GameHud />
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
