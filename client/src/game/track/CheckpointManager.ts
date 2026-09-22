export class CheckpointManager {
  private lastCheckpoint = -1
  private readonly checkpointCount: number

  constructor(checkpointCount: number) {
    this.checkpointCount = checkpointCount
  }

  accept(checkpointIndex: number) {
    if (checkpointIndex !== this.lastCheckpoint + 1) return false
    this.lastCheckpoint = checkpointIndex
    return true
  }

  reset() {
    this.lastCheckpoint = -1
  }

  getLastCheckpoint() {
    return this.lastCheckpoint
  }

  isReadyForFinish() {
    return this.lastCheckpoint === this.checkpointCount - 1
  }
}
