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
  checkpoints: CheckpointDefinition[]
  finishLine: TrackPoint & { size: [number, number] }
  respawnPoints: TrackPoint[]
  startGrid: TrackPoint[]
}

export const NEON_CIRCUIT: TrackConfig = {
  id: 'track_01',
  name: 'Neon Circuit',
  difficulty: 1,
  startGrid: [{ position: [0, 1.1, 23], rotation: 0 }],
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
}
