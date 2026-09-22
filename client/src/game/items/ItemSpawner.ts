import type { ItemKind } from './ItemTypes'

export type ItemSpawnPoint = {
  id: string
  position: [number, number, number]
  kind?: ItemKind
  respawnSeconds: number
}

export class ItemSpawner {
  private readonly available = new Map<string, number>()
  private readonly points: ItemSpawnPoint[]

  constructor(points: ItemSpawnPoint[]) {
    this.points = points
    for (const point of points) this.available.set(point.id, 0)
  }

  collect(pointId: string, now: number) {
    const point = this.points.find((candidate) => candidate.id === pointId)
    if (!point || (this.available.get(pointId) ?? 0) > now) return null
    this.available.set(pointId, now + point.respawnSeconds * 1000)
    return point.kind ?? this.randomKind(pointId)
  }

  isAvailable(pointId: string, now: number) {
    return (this.available.get(pointId) ?? 0) <= now
  }

  private randomKind(seed: string): ItemKind {
    const kinds: ItemKind[] = ['BOOST', 'SHIELD', 'SHOCKWAVE', 'ROCKET']
    let hash = 0
    for (const character of seed) hash = (hash * 31 + character.charCodeAt(0)) | 0
    return kinds[Math.abs(hash) % kinds.length]
  }
}
