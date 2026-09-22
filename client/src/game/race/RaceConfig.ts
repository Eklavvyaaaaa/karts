export type RaceConfig = {
  totalLaps: number
  countdownDuration: number
  maxPlayers: number
  raceTimeLimit: number
  respawnEnabled: boolean
  respawnDelay: number
}

export const SINGLE_PLAYER_RACE: RaceConfig = {
  totalLaps: 3,
  countdownDuration: 3,
  maxPlayers: 8,
  raceTimeLimit: 300,
  respawnEnabled: true,
  respawnDelay: 0.8,
}
