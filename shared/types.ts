export type PlayerConnectionState = 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING'

export type InputState = {
  accelerate: boolean
  brake: boolean
  left: boolean
  right: boolean
  drift: boolean
  boost: boolean
  item: boolean
  steering: number
}

export type PlayerState = {
  playerId: string
  playerNumber: number
  displayName: string
  kartId: string
  color: string
  connection: PlayerConnectionState
  ready: boolean
}

export type RoomState = {
  roomId: string
  hostId: string
  maxPlayers: number
  trackId: string
  players: PlayerState[]
}

export type RaceState = 'LOBBY' | 'COUNTDOWN' | 'RACING' | 'FINISHED' | 'RESULTS'

export type RaceProgress = {
  playerId: string
  currentLap: number
  checkpointIndex: number
  progress: number
  finished: boolean
  finishTime: number | null
}

export type ItemKind = 'BOOST' | 'SHIELD' | 'SHOCKWAVE' | 'ROCKET'
export type ItemState = { itemId: string; kind: ItemKind; ownerId: string | null; active: boolean }

export type ClientMessage =
  | { type: 'JOIN_ROOM'; roomId: string; playerId?: string }
  | { type: 'READY'; ready: boolean }
  | { type: 'INPUT'; sequence: number; steering: number; accelerate: boolean; brake: boolean; drift: boolean; boost: boolean; item: boolean }
  | { type: 'SELECT_KART'; kartId: string }
  | { type: 'SELECT_TRACK'; trackId: string }
  | { type: 'USE_ITEM'; itemId: string }
  | { type: 'LEAVE_ROOM' }

export type ServerMessage =
  | { type: 'ROOM_STATE'; room: RoomState }
  | { type: 'PLAYER_JOINED'; player: PlayerState }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'GAME_START'; trackId: string }
  | { type: 'RACE_STATE'; state: RaceState; progress: RaceProgress[] }
  | { type: 'PLAYER_STATE'; playerId: string; position: [number, number, number]; rotation: [number, number, number, number]; velocity: [number, number, number] }
  | { type: 'ITEM_STATE'; items: ItemState[] }
  | { type: 'RACE_FINISHED'; results: RaceProgress[] }
  | { type: 'ERROR'; code: string; message: string }
