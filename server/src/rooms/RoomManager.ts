import crypto from 'node:crypto'
import type { PlayerState, RoomState } from '../../../shared/types.js'
import type { RoomStore } from '../stores/InMemoryRoomStore.js'

export class RoomManager {
  constructor(private readonly store: RoomStore, private readonly defaultMaxPlayers = 8) {}

  createRoom(host: PlayerState, trackId: string) {
    const room: RoomState = { roomId: this.createCode(), hostId: host.playerId, maxPlayers: this.defaultMaxPlayers, trackId, players: [host] }
    this.store.save(room)
    return room
  }

  joinRoom(roomId: string, player: PlayerState) {
    const room = this.store.get(roomId)
    if (!room || room.players.length >= room.maxPlayers || room.players.some((candidate) => candidate.playerId === player.playerId)) return null
    room.players = [...room.players, player]
    this.store.save(room)
    return room
  }

  leaveRoom(roomId: string, playerId: string) {
    const room = this.store.get(roomId)
    if (!room) return null
    room.players = room.players.filter((player) => player.playerId !== playerId)
    if (room.players.length === 0) this.store.delete(roomId)
    else this.store.save(room)
    return room
  }

  findRoom() { return this.store.list().find((room) => room.players.length < room.maxPlayers) ?? null }

  private createCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase()
  }
}
