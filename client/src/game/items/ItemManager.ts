import type { HeldItem, ItemKind } from './ItemTypes'

export class ItemManager {
  private readonly held = new Map<string, HeldItem>()

  assign(playerId: string, kind: ItemKind, now: number) {
    if (this.held.has(playerId)) return false
    this.held.set(playerId, { kind, acquiredAt: now })
    return true
  }

  consume(playerId: string) {
    const item = this.held.get(playerId)
    if (!item) return null
    this.held.delete(playerId)
    return item
  }

  peek(playerId: string) {
    return this.held.get(playerId) ?? null
  }

  clear(playerId: string) {
    this.held.delete(playerId)
  }
}
