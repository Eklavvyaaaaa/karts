import type { RaceConfig } from './RaceConfig'
import type { RaceProgress, RaceSnapshot, RaceState } from './RaceState'

export class RaceManager {
  private readonly config: RaceConfig
  private readonly checkpointCount: number
  private readonly onChange?: (snapshot: RaceSnapshot) => void
  private state: RaceState = 'LOBBY'
  private countdownEndsAt = 0
  private goUntil = 0
  private raceStartedAt = 0
  private lapStartedAt = 0
  private lastEmitAt = 0
  private lastCheckpoint = -1
  private currentLap = 1
  private lapTimes: number[] = []
  private bestLap: number | null = null
  private totalTime = 0
  private finishTime: number | null = null
  private countdownLabel: string | null = null
  private countdown = 0
  private resetToken = 0

  constructor(config: RaceConfig, checkpointCount: number, onChange?: (snapshot: RaceSnapshot) => void) {
    this.config = config
    this.checkpointCount = checkpointCount
    this.onChange = onChange
    this.emit(0, true)
  }

  startCountdown(now: number) {
    if (this.state !== 'LOBBY' && this.state !== 'RESULTS') return false
    this.state = 'COUNTDOWN'
    this.countdownEndsAt = now + this.config.countdownDuration * 1000
    this.countdown = Math.ceil(this.config.countdownDuration)
    this.countdownLabel = null
    this.currentLap = 1
    this.lastCheckpoint = -1
    this.lapTimes = []
    this.bestLap = null
    this.totalTime = 0
    this.finishTime = null
    this.resetToken += 1
    this.emit(now, true)
    return true
  }

  update(now: number) {
    if (this.state === 'COUNTDOWN') {
      const remaining = Math.max(0, (this.countdownEndsAt - now) / 1000)
      this.countdown = Math.ceil(remaining)
      if (remaining <= 0) {
        this.state = 'RACING'
        this.countdown = 0
        this.raceStartedAt = now
        this.lapStartedAt = now
        this.countdownLabel = 'GO!'
        this.goUntil = now + 700
        this.emit(now, true)
      } else {
        this.emit(now)
      }
      return
    }

    if (this.state === 'RACING') {
      this.totalTime = (now - this.raceStartedAt) / 1000
      if (this.totalTime >= this.config.raceTimeLimit) {
        this.finishTime = this.totalTime
        this.state = 'FINISHED'
        this.countdownLabel = null
        this.emit(now, true)
        return
      }
      if (this.countdownLabel && now >= this.goUntil) this.countdownLabel = null
      this.emit(now)
    }
  }

  acceptCheckpoint(checkpointIndex: number, now: number) {
    if (this.state !== 'RACING' || checkpointIndex !== this.lastCheckpoint + 1) return false
    this.lastCheckpoint = checkpointIndex
    this.emit(now, true)
    return true
  }

  acceptFinish(now: number) {
    if (this.state !== 'RACING' || this.lastCheckpoint !== this.checkpointCount - 1) return false
    const lapTime = (now - this.lapStartedAt) / 1000
    this.lapTimes = [...this.lapTimes, lapTime]
    this.bestLap = this.bestLap === null ? lapTime : Math.min(this.bestLap, lapTime)
    this.totalTime = (now - this.raceStartedAt) / 1000
    if (this.currentLap >= this.config.totalLaps) {
      this.finishTime = this.totalTime
      this.state = 'FINISHED'
      this.countdownLabel = null
    } else {
      this.currentLap += 1
      this.lastCheckpoint = -1
      this.lapStartedAt = now
    }
    this.emit(now, true)
    return true
  }

  showResults(now: number) {
    if (this.state !== 'FINISHED') return false
    this.state = 'RESULTS'
    this.emit(now, true)
    return true
  }

  backToLobby(now: number) {
    this.state = 'LOBBY'
    this.countdownLabel = null
    this.emit(now, true)
  }

  getState() {
    return this.state
  }

  getLastCheckpoint() {
    return this.lastCheckpoint
  }

  getSnapshot(): RaceSnapshot {
    const progress: RaceProgress = {
      playerId: 'p1',
      currentLap: this.currentLap,
      checkpointIndex: this.lastCheckpoint,
      progress: this.checkpointCount ? (this.lastCheckpoint + 1) / this.checkpointCount : 0,
      finished: this.state === 'FINISHED' || this.state === 'RESULTS',
      finishTime: this.finishTime,
    }
    return {
      state: this.state,
      countdown: this.countdown,
      countdownLabel: this.countdownLabel,
      currentLap: this.currentLap,
      totalLaps: this.config.totalLaps,
      position: 1,
      totalPlayers: 1,
      progress,
      lapTimes: [...this.lapTimes],
      bestLap: this.bestLap,
      totalTime: this.totalTime,
      resetToken: this.resetToken,
    }
  }

  private emit(now: number, force = false) {
    if (!force && now - this.lastEmitAt < 80) return
    this.lastEmitAt = now
    this.onChange?.(this.getSnapshot())
  }
}
