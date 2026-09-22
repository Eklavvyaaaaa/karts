export type ItemKind = 'BOOST' | 'SHIELD' | 'SHOCKWAVE' | 'ROCKET'

export type ItemDefinition = {
  kind: ItemKind
  label: string
  description: string
  cooldown: number
}

export const ITEM_DEFINITIONS: Record<ItemKind, ItemDefinition> = {
  BOOST: { kind: 'BOOST', label: 'Boost', description: 'Burst forward with extra acceleration.', cooldown: 4 },
  SHIELD: { kind: 'SHIELD', label: 'Shield', description: 'Absorb one incoming disruption.', cooldown: 0 },
  SHOCKWAVE: { kind: 'SHOCKWAVE', label: 'Shockwave', description: 'Disrupt nearby racers.', cooldown: 6 },
  ROCKET: { kind: 'ROCKET', label: 'Rocket', description: 'Launch an original tracking projectile.', cooldown: 7 },
}

export type HeldItem = { kind: ItemKind; acquiredAt: number }
