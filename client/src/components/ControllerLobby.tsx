import { useEffect, useState } from 'react'
import type { GameSocket, PlayerPresence } from '../game/networking/GameSocket'

export function ControllerLobby({ gameSocket, visible, onPresence }: { gameSocket: GameSocket; visible: boolean; onPresence: (players: PlayerPresence[]) => void }) {
  const [pairing, setPairing] = useState<{ room: string; qr: string } | null>(null)
  const [players, setPlayers] = useState<PlayerPresence[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    gameSocket.setPresenceListener((nextPlayers) => { setPlayers(nextPlayers); onPresence(nextPlayers) })
    gameSocket.connect()
    return () => gameSocket.disconnect()
  }, [gameSocket, onPresence])

  useEffect(() => {
    if (!visible) return
    let mounted = true
    void gameSocket.getPairing().then((result) => { if (mounted) { setPairing(result); gameSocket.register(result.room) } }).catch(() => { if (mounted) setError('START THE CONTROLLER RELAY') })
    return () => { mounted = false }
  }, [gameSocket, visible])

  if (!visible) return null
  return <aside className="controller-lobby" aria-label="Phone controller lobby"><div><span className="eyebrow">LOCAL CONTROLLERS</span><strong>SCAN TO JOIN</strong><small>{error || `ROOM ${pairing?.room || '----'}`}</small></div>{pairing?.qr ? <img src={pairing.qr} alt={`Controller QR code for room ${pairing.room}`} /> : <div className="qr-placeholder">QR</div>}<div className="player-slots">{players.map((player) => <span key={player.playerId} className={player.connected ? 'connected' : ''}>{player.connected ? '●' : '○'} P{player.slot + 1}</span>)}</div></aside>
}
