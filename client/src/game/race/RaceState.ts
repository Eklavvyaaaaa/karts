export type RaceState = 'LOBBY' | 'COUNTDOWN' | 'RACING' | 'FINISHED' | 'RESULTS'

export type RaceProgress = {
  playerId: string
  currentLap: number
  checkpointIndex: number
  progress: number
  finished: boolean
  finishTime: number | null
}

export type RaceSnapshot = {
  state: RaceState
  countdown: number
  countdownLabel: string | null
  currentLap: number
  totalLaps: number
  position: number
  totalPlayers: number
  progress: RaceProgress
  lapTimes: number[]
  bestLap: number | null
  totalTime: number
  resetToken: number
}
