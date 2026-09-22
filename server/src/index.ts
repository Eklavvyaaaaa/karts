import { InMemoryRoomStore } from './stores/InMemoryRoomStore.js'
import { RoomManager } from './rooms/RoomManager.js'

export const roomStore = new InMemoryRoomStore()
export const roomManager = new RoomManager(roomStore, Number(process.env.MAX_PLAYERS || 8))

// Socket.IO transport and authoritative simulation can be attached here without changing room APIs.
