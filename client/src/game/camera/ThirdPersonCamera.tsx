import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { PerspectiveCamera } from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import type { KartController } from '../kart/KartController'

const CAMERA_DISTANCE = 10.5
const CAMERA_HEIGHT = 6.3
const LOOK_AHEAD = 0.24
const BASE_FOV = 52
const MAX_FOV_BOOST = 7

export function ThirdPersonCamera({
  bodyRef,
  controller,
}: {
  bodyRef: React.RefObject<RapierRigidBody | null>
  controller: KartController
}) {
  const { camera } = useThree()
  const desired = useRef(new THREE.Vector3())
  const focus = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())
  const velocity = useRef(new THREE.Vector3())
  const forward = useRef(new THREE.Vector3(0, 0, -1))
  const rotation = useRef(new THREE.Quaternion())
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!body) return
    elapsed.current += delta
    const bodyPosition = body.translation()
    const bodyRotation = body.rotation()
    focus.current.set(bodyPosition.x, bodyPosition.y, bodyPosition.z)
    rotation.current.set(bodyRotation.x, bodyRotation.y, bodyRotation.z, bodyRotation.w)
    forward.current.set(0, 0, -1).applyQuaternion(rotation.current).normalize()
    const bodyVelocity = body.linvel()
    velocity.current.set(bodyVelocity.x, 0, bodyVelocity.z)
    const speed = velocity.current.length()
    const speedRatio = Math.min(speed / 25, 1)
    desired.current.copy(focus.current).addScaledVector(forward.current, -CAMERA_DISTANCE)
    desired.current.y += CAMERA_HEIGHT
    desired.current.addScaledVector(velocity.current, -0.1)
    const shake = controller.getState().cameraShake
    desired.current.x += Math.sin(elapsed.current * 48) * shake * 0.12
    desired.current.y += Math.cos(elapsed.current * 42) * shake * 0.08
    camera.position.lerp(desired.current, 1 - Math.pow(0.001, delta))

    lookAt.current.copy(focus.current).addScaledVector(velocity.current, LOOK_AHEAD)
    lookAt.current.y += 0.8
    camera.lookAt(lookAt.current)
    const perspective = camera as PerspectiveCamera
    perspective.fov = THREE.MathUtils.lerp(perspective.fov, BASE_FOV + speedRatio * 3 + (controller.getState().boosting ? MAX_FOV_BOOST : 0), 0.08)
    perspective.updateProjectionMatrix()
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, controller.getState().drifting ? -controller.getState().steering * 0.035 : 0, 0.08)
  })

  return null
}
