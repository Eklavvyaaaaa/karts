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
import { GameSocket, type PlayerPresence } from './game/networking/GameSocket'
import { PlayerManager } from './game/networking/PlayerManager'
import { ControllerLobby } from './components/ControllerLobby'

type GameMode = 'select' | 'solo' | 'multiplayer'

function App() {
  const [mode, setMode] = useState<GameMode>('select')
  const setRace = useGameStore((state) => state.setRace)
  const raceState = useGameStore((state) => state.race.state)
  const [raceManager] = useState(() => new RaceManager(SINGLE_PLAYER_RACE, NEON_CIRCUIT.checkpoints.length, setRace))
  const [playerManager] = useState(() => new PlayerManager(4))
  const [connectedPlayers, setConnectedPlayers] = useState<PlayerPresence[]>([])
  const [gameSocket] = useState(() => new GameSocket((input) => playerManager.applyInput(input.playerId, input, performance.now())))

  const updatePresence = (nextPlayers: PlayerPresence[]) => {
    setConnectedPlayers(nextPlayers.filter((player) => player.connected))
    for (const player of nextPlayers) {
      if (player.connected && !playerManager.get(player.playerId)) playerManager.addPlayer({ playerId: player.playerId, displayName: `Player ${player.slot + 1}`, kartId: 'sprinter', color: ['#e45c4b', '#4f9cc4', '#77c18e', '#8d79c9'][player.slot], connection: 'CONNECTED', ready: false })
      if (!player.connected) playerManager.setConnection(player.playerId, 'DISCONNECTED')
    }
  }

  const multiplayer = mode === 'multiplayer'
  const playerIds = multiplayer ? ['p1', ...connectedPlayers.filter((player) => player.playerId !== 'p1').map((player) => player.playerId)] : ['p1']

  return (
    <main className="game-shell">
      {mode !== 'select' && <>
        <GameScene raceManager={raceManager} playerManager={playerManager} playerIds={playerIds} />
        <GameHud raceManager={raceManager} />
        <ResultsScreen raceManager={raceManager} />
        {multiplayer && <ControllerLobby gameSocket={gameSocket} visible={raceState === 'LOBBY'} onPresence={updatePresence} />}
        <section className="drive-hint" aria-label="Driving controls">
          <span className="key-cluster"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span>
          <span>DRIVE</span>
        </section>
        <DebugPanel />
        <div className="corner-label">FOUNDATION BUILD <span>v0.1</span></div>
      </>}
      {mode === 'select' && <ModeSelect onSelect={setMode} />}
    </main>
  )
}

function ModeSelect({ onSelect }: { onSelect: (mode: Exclude<GameMode, 'select'>) => void }) {
  return (
    <section className="mode-select" aria-label="Choose game mode">
      <div className="mode-mark">R</div>
      <span className="eyebrow">RUSH//LOCAL</span>
      <h1>KART CHAOS</h1>
      <p>Choose how you want to race.</p>
      <div className="mode-actions">
        <button type="button" className="mode-card" onClick={() => onSelect('solo')}><strong>LOCAL SOLO</strong><small>Keyboard controls / one full-screen camera</small></button>
        <button type="button" className="mode-card mode-card-accent" onClick={() => onSelect('multiplayer')}><strong>LOCAL MULTIPLAYER</strong><small>QR phones / split screen / up to 4 karts</small></button>
      </div>
    </section>
  )
}

export default App
