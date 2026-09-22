import { useGameStore } from '../state/gameStore'
import type { RaceManager } from '../game/race/RaceManager'

export function GameHud({ raceManager }: { raceManager: RaceManager }) {
  const race = useGameStore((state) => state.race)
  const kart = useGameStore((state) => state.kart)
  const inRace = race.state === 'RACING' || race.state === 'FINISHED'

  return (
    <>
      <header className="game-hud">
        <div className="brand-lockup">
          <span className="brand-mark">R</span>
          <div><strong>RUSH//LOCAL</strong><small>{race.state === 'LOBBY' ? 'READY ROOM' : 'NEON CIRCUIT 01'}</small></div>
        </div>
        <div className="session-chip"><span className="live-dot" /> {race.state}</div>
        {inRace && <div className="lap-readout"><small>LAP</small><strong>{race.currentLap.toString().padStart(2, '0')} / {race.totalLaps.toString().padStart(2, '0')}</strong></div>}
        {inRace && <div className="position-readout"><small>POSITION</small><strong>{race.position} / {race.totalPlayers}</strong></div>}
      </header>

      {race.state === 'LOBBY' && (
        <section className="race-start-panel" aria-label="Start race">
          <span className="eyebrow">SINGLE PLAYER / {race.totalLaps} LAPS</span>
          <h1>NEON CIRCUIT</h1>
          <p>Clear every checkpoint. Hold the line.</p>
          <button type="button" className="race-action primary-action" onClick={() => raceManager.startCountdown(performance.now())}>START RACE</button>
        </section>
      )}

      {race.state === 'COUNTDOWN' && (
        <div className="race-countdown" aria-live="assertive"><span>{race.countdown}</span><small>GET READY</small></div>
      )}
      {race.countdownLabel && race.state === 'RACING' && <div className="go-flash" aria-live="polite">{race.countdownLabel}</div>}

      {inRace && (
        <div className="race-telemetry">
          <span>SPEED</span><strong>{Math.round(kart.speed * 3.6)}<small> KM/H</small></strong>
          <span className={kart.drifting ? 'telemetry-active' : ''}>DRIFT</span>
          <span className={kart.boosting ? 'telemetry-active' : ''}>BOOST</span>
        </div>
      )}
    </>
  )
}
