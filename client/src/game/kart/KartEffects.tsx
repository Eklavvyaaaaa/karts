import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import type { KartController } from './KartController'

const MARK_POOL_SIZE = 24
const PARTICLE_POOL_SIZE = 10

export function KartEffects({ bodyRef, controller }: { bodyRef: React.RefObject<RapierRigidBody | null>; controller: KartController }) {
  const marks = useRef<(THREE.Mesh | null)[]>([])
  const particles = useRef<(THREE.Mesh | null)[]>([])
  const markIndex = useRef(0)
  const markTimer = useRef(0)
  const particleTime = useRef(0)
  const rotation = useRef(new THREE.Quaternion())
  const forward = useRef(new THREE.Vector3(0, 0, -1))
  const markPosition = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!body) return
    const state = controller.getState()
    const position = body.translation()
    const bodyRotation = body.rotation()
    rotation.current.set(bodyRotation.x, bodyRotation.y, bodyRotation.z, bodyRotation.w)
    forward.current.set(0, 0, -1).applyQuaternion(rotation.current)
    markTimer.current -= delta
    particleTime.current += delta

    if (state.drifting && markTimer.current <= 0) {
      markTimer.current = 0.065
      const mark = marks.current[markIndex.current]
      if (mark) {
        mark.visible = true
        markPosition.current.set(position.x + (markIndex.current % 2 ? 0.58 : -0.58), 0.035, position.z + 0.58)
        markPosition.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(forward.current.x, forward.current.z))
        mark.position.copy(markPosition.current)
        mark.rotation.y = Math.atan2(forward.current.x, forward.current.z)
        mark.scale.setScalar(0.85)
      }
      markIndex.current = (markIndex.current + 1) % MARK_POOL_SIZE
    }

    particles.current.forEach((particle, index) => {
      if (!particle) return
      const phase = particleTime.current * 5 + index
      const distance = state.boosting ? 1.45 : 0.75
      particle.visible = state.boosting || (state.drifting && index < 4)
      particle.position.set(position.x - forward.current.x * distance + Math.sin(phase) * 0.28, position.y + 0.15 + Math.abs(Math.sin(phase)) * 0.24, position.z - forward.current.z * distance + Math.cos(phase) * 0.28)
      particle.scale.setScalar((state.boosting ? 0.12 : 0.08) + Math.abs(Math.sin(phase)) * 0.07)
    })
  })

  return (
    <group>
      {Array.from({ length: MARK_POOL_SIZE }, (_, index) => (
        <mesh key={`mark-${index}`} ref={(mesh) => { marks.current[index] = mesh }} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.32, 1.05]} />
          <meshBasicMaterial color="#111a1c" transparent opacity={0.42} depthWrite={false} />
        </mesh>
      ))}
      {Array.from({ length: PARTICLE_POOL_SIZE }, (_, index) => (
        <mesh key={`particle-${index}`} ref={(mesh) => { particles.current[index] = mesh }} visible={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color={index % 2 ? '#f2c84b' : '#fff1bd'} transparent opacity={0.78} />
        </mesh>
      ))}
    </group>
  )
}
