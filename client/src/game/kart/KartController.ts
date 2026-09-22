import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import type { InputState } from '../input/InputState'
import type { KartConfig } from './KartConfig'

export type KartMotionState = {
  speed: number
  steering: number
  grounded: boolean
  drifting: boolean
  boosting: boolean
  boostCooldown: number
  cameraShake: number
}

export class KartController {
  private readonly config: KartConfig
  private readonly onState?: (state: KartMotionState) => void
  private readonly state: KartMotionState = {
    speed: 0,
    steering: 0,
    grounded: true,
    drifting: false,
    boosting: false,
    boostCooldown: 0,
    cameraShake: 0,
  }

  private previousBoost = false
  private boostTime = 0
  private lastReport = 0
  private readonly rotation = new THREE.Quaternion()
  private readonly forward = new THREE.Vector3(0, 0, -1)
  private readonly lateral = new THREE.Vector3()

  constructor(config: KartConfig, onState?: (state: KartMotionState) => void) {
    this.config = config
    this.onState = onState
  }

  update(body: RapierRigidBody, input: InputState, delta: number, elapsed: number) {
    const safeDelta = Math.min(delta, 1 / 20)
    const translation = body.translation()
    const velocity = body.linvel()
    const grounded = translation.y <= this.config.groundHeight + 0.14 && velocity.y <= 1.4
    const steer = Math.max(-1, Math.min(1, Number.isFinite(input.steering) ? input.steering : Number(input.right) - Number(input.left)))
    const horizontalSpeed = Math.hypot(velocity.x, velocity.z)
    const drifting = grounded && input.drift && Math.abs(steer) > 0 && horizontalSpeed > 4

    this.state.grounded = grounded
    this.state.steering = steer
    this.state.drifting = drifting
    this.state.boostCooldown = Math.max(0, this.state.boostCooldown - safeDelta)
    this.state.cameraShake = Math.max(0, this.state.cameraShake - safeDelta * 2.4)

    if (input.boost && !this.previousBoost && this.state.boostCooldown <= 0) {
      this.boostTime = this.config.boostDuration
      this.state.boostCooldown = this.config.boostCooldown
      this.state.cameraShake = 0.22
    }
    this.previousBoost = input.boost
    this.boostTime = Math.max(0, this.boostTime - safeDelta)
    this.state.boosting = this.boostTime > 0

    body.rotation()
    const rotation = body.rotation()
    this.rotation.set(rotation.x, rotation.y, rotation.z, rotation.w)
    this.forward.set(0, 0, -1).applyQuaternion(this.rotation).normalize()
    this.lateral.set(-this.forward.z, 0, this.forward.x)

    const forwardSpeed = velocity.x * this.forward.x + velocity.z * this.forward.z
    const sideSpeed = velocity.x * this.lateral.x + velocity.z * this.lateral.z
    const targetSpeed = this.state.boosting ? this.config.maxSpeed * this.config.boostMultiplier : this.config.maxSpeed
    const throttle = input.accelerate ? 1 : 0
    const reverse = input.brake && !input.accelerate
    const maxAllowed = reverse ? this.config.reverseSpeed : targetSpeed
    const acceleration = reverse ? -this.config.acceleration * 0.62 : this.config.acceleration
    const mass = body.mass()

    if (grounded) {
      const driveForce = throttle || reverse ? acceleration * mass * safeDelta : -Math.sign(forwardSpeed) * this.config.friction * mass * safeDelta
      body.applyImpulse({ x: this.forward.x * driveForce, y: 0, z: this.forward.z * driveForce }, true)
      const traction = drifting ? this.config.driftTraction : this.config.traction
      body.applyImpulse({ x: -this.lateral.x * sideSpeed * traction * mass * safeDelta, y: 0, z: -this.lateral.z * sideSpeed * traction * mass * safeDelta }, true)

      const steeringRatio = Math.min(1, horizontalSpeed / 5)
      const speedResponse = THREE.MathUtils.lerp(1.35, 0.72, steeringRatio)
      const turnRate = steer * this.config.steeringStrength * speedResponse * (drifting ? this.config.driftSteeringMultiplier : 1)
      body.setAngvel({ x: 0, y: turnRate * (0.35 + Math.min(horizontalSpeed / maxAllowed, 1)), z: 0 }, true)
    } else {
      body.applyImpulse({ x: 0, y: -this.config.gravity * mass * safeDelta * 0.12, z: 0 }, true)
      if (steer) body.setAngvel({ x: 0, y: steer * this.config.airControl, z: 0 }, true)
    }

    const nextVelocity = body.linvel()
    const nextForwardSpeed = nextVelocity.x * this.forward.x + nextVelocity.z * this.forward.z
    const clampedSpeed = Math.min(Math.abs(nextForwardSpeed), maxAllowed)
    if (Math.abs(nextForwardSpeed) > maxAllowed) {
      const correction = clampedSpeed / Math.abs(nextForwardSpeed)
      body.setLinvel({ x: nextVelocity.x * correction, y: nextVelocity.y, z: nextVelocity.z * correction }, true)
    }

    this.state.speed = Math.hypot(body.linvel().x, body.linvel().z)
    if (elapsed - this.lastReport > 0.1) {
      this.onState?.({ ...this.state })
      this.lastReport = elapsed
    }
  }

  getState() {
    return this.state
  }

  respawn(body: RapierRigidBody, position: [number, number, number], rotation = 0) {
    body.setTranslation({ x: position[0], y: position[1], z: position[2] }, true)
    body.setRotation({ x: 0, y: Math.sin(rotation / 2), z: 0, w: Math.cos(rotation / 2) }, true)
    body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    body.setAngvel({ x: 0, y: 0, z: 0 }, true)
    this.boostTime = 0
    this.state.speed = 0
    this.state.steering = 0
    this.state.drifting = false
    this.state.boosting = false
    this.state.cameraShake = 0.12
  }
}
