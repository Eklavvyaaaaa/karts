export type TrackPoint = {
  position: [number, number, number]
  rotation: number
}

export type CheckpointDefinition = TrackPoint & {
  id: string
  order: number
  size: [number, number]
}

export type TrackConfig = {
  id: string
  name: string
  difficulty: number
  visualTheme: 'valley' | 'city'
  checkpoints: CheckpointDefinition[]
  finishLine: TrackPoint & { size: [number, number] }
  respawnPoints: TrackPoint[]
  startGrid: TrackPoint[]
  itemSpawnPoints: Array<TrackPoint & { id: string; respawnSeconds: number }>
  shortcuts: TrackPoint[]
}

export const NEON_CIRCUIT: TrackConfig = {
  id: 'track_01',
  name: 'Neon Circuit',
  difficulty: 1,
  visualTheme: 'valley',
  startGrid: [
    { position: [-2.2, 1.1, 23], rotation: 0 },
    { position: [2.2, 1.1, 23], rotation: 0 },
    { position: [-2.2, 1.1, 20], rotation: 0 },
    { position: [2.2, 1.1, 20], rotation: 0 },
  ],
  respawnPoints: [
    { position: [0, 1.1, 23], rotation: 0 },
    { position: [0, 1.1, -20], rotation: Math.PI },
    { position: [17, 1.1, -2], rotation: Math.PI / 2 },
    { position: [0, 1.1, 18], rotation: 0 },
  ],
  checkpoints: [
    { id: 'checkpoint_0', order: 0, position: [0, 0.9, -21], rotation: 0, size: [36, 1.2] },
    { id: 'checkpoint_1', order: 1, position: [18, 0.9, -2], rotation: Math.PI / 2, size: [44, 1.2] },
    { id: 'checkpoint_2', order: 2, position: [0, 0.9, 19], rotation: 0, size: [36, 1.2] },
  ],
  finishLine: { position: [0, 0.9, 26], rotation: 0, size: [36, 1.2] },
  itemSpawnPoints: [
    { id: 'valley-item-1', position: [-8, 0.75, 10], rotation: 0, respawnSeconds: 6 },
    { id: 'valley-item-2', position: [8, 0.75, -10], rotation: 0, respawnSeconds: 6 },
  ],
  shortcuts: [{ position: [14, 0.2, 12], rotation: Math.PI / 4 }],
}

export const NEON_CITY: TrackConfig = {
  id: 'track_02',
  name: 'Neon City',
  difficulty: 2,
  visualTheme: 'city',
  startGrid: [{ position: [0, 1.1, 23], rotation: 0 }],
  respawnPoints: [
    { position: [0, 1.1, 23], rotation: 0 },
    { position: [17, 1.1, -8], rotation: Math.PI / 2 },
    { position: [-17, 1.1, 8], rotation: -Math.PI / 2 },
  ],
  checkpoints: [
    { id: 'city-checkpoint-0', order: 0, position: [0, 0.9, -21], rotation: 0, size: [36, 1.2] },
    { id: 'city-checkpoint-1', order: 1, position: [18, 0.9, -4], rotation: Math.PI / 2, size: [42, 1.2] },
    { id: 'city-checkpoint-2', order: 2, position: [-18, 0.9, 7], rotation: Math.PI / 2, size: [42, 1.2] },
  ],
  finishLine: { position: [0, 0.9, 26], rotation: 0, size: [36, 1.2] },
  itemSpawnPoints: [
    { id: 'city-item-1', position: [-10, 0.75, 13], rotation: 0, respawnSeconds: 6 },
    { id: 'city-item-2', position: [10, 0.75, -13], rotation: 0, respawnSeconds: 6 },
  ],
  shortcuts: [{ position: [-13, 0.2, -16], rotation: -Math.PI / 4 }],
}

export const TRACKS = [NEON_CIRCUIT, NEON_CITY]
