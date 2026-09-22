import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { Object3D, PerspectiveCamera } from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import type { KartController } from '../kart/KartController'

const CAMERA_DISTANCE = 10.5
const CAMERA_HEIGHT = 6.3
const LOOK_AHEAD = 0.24
const BASE_FOV = 52
const MAX_FOV_BOOST = 7

export function ThirdPersonCamera({
  target,
  bodyRef,
  controller,
}: {
  target: React.RefObject<Object3D | null>
  bodyRef: React.RefObject<RapierRigidBody | null>
  controller: KartController
}) {
  const { camera } = useThree()
  const desired = useRef(new THREE.Vector3())
  const focus = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())
  const velocity = useRef(new THREE.Vector3())
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!target.current || !body) return
    elapsed.current += delta
    target.current.getWorldPosition(focus.current)
    const bodyVelocity = body.linvel()
    velocity.current.set(bodyVelocity.x, 0, bodyVelocity.z)
    const speed = velocity.current.length()
    const speedRatio = Math.min(speed / 25, 1)
    desired.current.set(focus.current.x, focus.current.y + CAMERA_HEIGHT, focus.current.z + CAMERA_DISTANCE)
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
