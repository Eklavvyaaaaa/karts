import { useGameStore } from '../state/gameStore'

export function DebugPanel() {
  const debugMode = useGameStore((state) => state.debugMode)
  const performance = useGameStore((state) => state.performance)
  const kart = useGameStore((state) => state.kart)
  const setDebugMode = useGameStore((state) => state.setDebugMode)

  return (
    <aside className={`debug-panel ${debugMode ? 'is-visible' : ''}`} aria-label="Performance diagnostics">
      <div className="debug-heading">
        <span className="status-dot" />
        <span>LOCAL TEST SESSION</span>
      </div>
      <div className="debug-grid">
        <span>FPS</span><strong>{performance.fps || '--'}</strong>
        <span>DRAW CALLS</span><strong>{performance.drawCalls}</strong>
        <span>TRIANGLES</span><strong>{performance.triangles.toLocaleString()}</strong>
        <span>PHYSICS</span><strong className="physics-value">{performance.physics}</strong>
        <span>SPEED</span><strong>{kart.speed.toFixed(1)} m/s</strong>
        <span>STATE</span><strong>{kart.boosting ? 'BOOST' : kart.drifting ? 'DRIFT' : 'RACE'}</strong>
        <span>SURFACE</span><strong>{kart.grounded ? 'GROUNDED' : 'AIRBORNE'}</strong>
      </div>
      <button type="button" className="debug-toggle" onClick={() => setDebugMode(!debugMode)}>
        {debugMode ? 'Hide diagnostics' : 'Show diagnostics'}
      </button>
    </aside>
  )
}
