import type { InputState } from '../input/InputState'
import { PhoneInput } from '../input/PhoneInput'
import type { PlayerConnectionState, PlayerState } from '../../../../shared/types'

export type ManagedPlayer = PlayerState & { input: InputState; lastInputAt: number }

export class PlayerManager {
  private readonly players = new Map<string, ManagedPlayer>()
  private readonly phoneInputs = new Map<string, PhoneInput>()
  private readonly maxPlayers: number

  constructor(maxPlayers = 4) {
    this.maxPlayers = maxPlayers
  }

  addPlayer(player: Omit<PlayerState, 'playerNumber'>) {
    if (this.players.has(player.playerId)) return this.players.get(player.playerId)!
    if (this.players.size >= this.maxPlayers) return null
    const managed: ManagedPlayer = { ...player, playerNumber: this.players.size + 1, input: emptyInput(), lastInputAt: 0 }
    this.players.set(player.playerId, managed)
    this.phoneInputs.set(player.playerId, new PhoneInput())
    return managed
  }

  removePlayer(playerId: string) { return this.players.delete(playerId) }
  setReady(playerId: string, ready: boolean) { const player = this.players.get(playerId); if (player) player.ready = ready }
  setConnection(playerId: string, connection: PlayerConnectionState) { const player = this.players.get(playerId); if (player) player.connection = connection }

  applyInput(playerId: string, input: InputState, now: number) {
    const player = this.players.get(playerId)
    if (!player) return false
    player.input = { ...input, steering: Math.max(-1, Math.min(1, input.steering)) }
    this.phoneInputs.get(playerId)?.apply(input)
    player.lastInputAt = now
    return true
  }

  get(playerId: string) { return this.players.get(playerId) }
  getInput(playerId: string) {
    let input = this.phoneInputs.get(playerId)
    if (!input) { input = new PhoneInput(); this.phoneInputs.set(playerId, input) }
    return input
  }
  list() { return [...this.players.values()] }
  get count() { return this.players.size }
}

function emptyInput(): InputState {
  return { accelerate: false, brake: false, left: false, right: false, drift: false, boost: false, item: false, steering: 0 }
}
