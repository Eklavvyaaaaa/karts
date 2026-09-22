export function GameHud() {
  return (
    <header className="game-hud">
      <div className="brand-lockup">
        <span className="brand-mark">R</span>
        <div><strong>RUSH//LOCAL</strong><small>TEST CIRCUIT 01</small></div>
      </div>
      <div className="session-chip"><span className="live-dot" /> LOCAL MODE</div>
      <div className="lap-readout"><small>LAP</small><strong>01 / 03</strong></div>
    </header>
  )
}
