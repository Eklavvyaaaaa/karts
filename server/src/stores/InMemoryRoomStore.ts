import type { RoomState } from '../../../shared/types.js'

export interface RoomStore {
  get(roomId: string): RoomState | undefined
  save(room: RoomState): void
  delete(roomId: string): void
  list(): RoomState[]
}

export class InMemoryRoomStore implements RoomStore {
  private readonly rooms = new Map<string, RoomState>()
  get(roomId: string) { return this.rooms.get(roomId) }
  save(room: RoomState) { this.rooms.set(room.roomId, room) }
  delete(roomId: string) { this.rooms.delete(roomId) }
  list() { return [...this.rooms.values()] }
}
