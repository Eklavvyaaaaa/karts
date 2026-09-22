import type { TrackPoint } from './TrackConfig'

export type RespawnPoint = TrackPoint & {
  checkpointIndex?: number
}
