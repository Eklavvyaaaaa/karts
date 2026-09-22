export type KartConfig = {
  maxSpeed: number
  reverseSpeed: number
  acceleration: number
  brakingForce: number
  friction: number
  traction: number
  driftTraction: number
  driftStrength: number
  steeringStrength: number
  driftSteeringMultiplier: number
  boostMultiplier: number
  boostDuration: number
  boostCooldown: number
  gravity: number
  airControl: number
  groundHeight: number
}

export const ARCADE_KART_CONFIG: KartConfig = {
  maxSpeed: 25,
  reverseSpeed: 8,
  acceleration: 30,
  brakingForce: 38,
  friction: 5.5,
  traction: 9,
  driftTraction: 2.2,
  driftStrength: 1.15,
  steeringStrength: 2.8,
  driftSteeringMultiplier: 1.55,
  boostMultiplier: 1.65,
  boostDuration: 1.25,
  boostCooldown: 3.2,
  gravity: 9.81,
  airControl: 0.35,
  groundHeight: 1.1,
}
