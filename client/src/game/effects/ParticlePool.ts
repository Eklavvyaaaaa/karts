export class ParticlePool<T> {
  private index = 0
  private readonly items: T[]

  constructor(items: T[]) {
    this.items = items
  }

  acquire() {
    const item = this.items[this.index]
    this.index = (this.index + 1) % this.items.length
    return item
  }
}
