import { io, type Socket } from 'socket.io-client'
import type { InputState } from '../input/InputState'

export type PlayerPresence = { slot: number; connected: boolean; playerId: string }
type RemoteInput = InputState & { playerId: string; sequence: number }

export class GameSocket {
  private readonly socket: Socket
  private readonly onInput: (input: RemoteInput) => void
  private presenceListener: (players: PlayerPresence[]) => void = () => undefined
  private room: string | null = null

  constructor(onInput: (input: RemoteInput) => void) {
    this.onInput = onInput
    const url = import.meta.env.VITE_CONTROLLER_URL || `${window.location.protocol}//${window.location.hostname}:8443`
    this.socket = io(url, { transports: ['websocket', 'polling'], autoConnect: false })
    this.socket.on('connect', () => { if (this.room) this.socket.emit('register', { role: 'game', room: this.room }) })
    this.socket.on('controller-input', (input: RemoteInput) => this.onInput(input))
    this.socket.on('presence', ({ players }: { players: PlayerPresence[] }) => this.presenceListener(players))
  }

  connect() { this.socket.connect() }
  disconnect() { this.socket.disconnect() }
  register(room: string) { this.room = room; if (this.socket.connected) this.socket.emit('register', { role: 'game', room }) }
  setPresenceListener(listener: (players: PlayerPresence[]) => void) { this.presenceListener = listener }
  async getPairing() {
    const url = import.meta.env.VITE_CONTROLLER_URL || `${window.location.protocol}//${window.location.hostname}:8443`
    const response = await fetch(`${url}/api/pairing`)
    if (!response.ok) throw new Error('Controller relay unavailable')
    return response.json() as Promise<{ room: string; url: string; qr: string }>
  }
}
