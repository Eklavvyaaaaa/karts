import { useEffect } from 'react'
import { useGameStore } from '../state/gameStore'
import type { RaceManager } from '../game/race/RaceManager'
import { formatRaceTime } from '../utils/formatRaceTime'

export function ResultsScreen({ raceManager }: { raceManager: RaceManager }) {
  const race = useGameStore((state) => state.race)

  useEffect(() => {
    if (race.state !== 'FINISHED') return
    const timer = window.setTimeout(() => raceManager.showResults(performance.now()), 1400)
    return () => window.clearTimeout(timer)
  }, [race.state, raceManager])

  if (race.state === 'FINISHED') {
    return <div className="finish-banner" aria-live="assertive"><span>FINISHED</span><small>RESULTS LOADING</small></div>
  }
  if (race.state !== 'RESULTS') return null

  return (
    <section className="results-screen" aria-label="Race results">
      <span className="eyebrow">NEON CIRCUIT / SESSION COMPLETE</span>
      <h1>RACE RESULTS</h1>
      <div className="result-player"><span>01</span><strong>PLAYER 1</strong><b>🥇</b></div>
      <div className="result-stats">
        <div><small>POSITION</small><strong>{race.position} / {race.totalPlayers}</strong></div>
        <div><small>TOTAL TIME</small><strong>{formatRaceTime(race.progress.finishTime ?? race.totalTime)}</strong></div>
        <div><small>BEST LAP</small><strong>{formatRaceTime(race.bestLap)}</strong></div>
      </div>
      <div className="result-actions">
        <button type="button" className="race-action primary-action" onClick={() => raceManager.startCountdown(performance.now())}>RESTART</button>
        <button type="button" className="race-action secondary-action" onClick={() => raceManager.backToLobby(performance.now())}>BACK TO LOBBY</button>
      </div>
    </section>
  )
}
