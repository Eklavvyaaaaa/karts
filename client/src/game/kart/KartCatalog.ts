export type KartVariant = {
  id: string
  name: string
  color: string
  accent: string
  maxSpeed: number
  acceleration: number
  handling: number
}

export const KART_VARIANTS: KartVariant[] = [
  { id: 'sprinter', name: 'Sprinter', color: '#e45c4b', accent: '#f6c85f', maxSpeed: 9, acceleration: 8, handling: 6 },
  { id: 'comet', name: 'Comet', color: '#4f9cc4', accent: '#dcecf1', maxSpeed: 10, acceleration: 6, handling: 5 },
  { id: 'trailblazer', name: 'Trailblazer', color: '#77c18e', accent: '#f2c84b', maxSpeed: 8, acceleration: 7, handling: 9 },
  { id: 'nightshift', name: 'Nightshift', color: '#8d79c9', accent: '#f3a65a', maxSpeed: 8, acceleration: 9, handling: 7 },
]

export function getKartVariant(kartId: string) {
  return KART_VARIANTS.find((kart) => kart.id === kartId) ?? KART_VARIANTS[0]
}
