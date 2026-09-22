import { Box, Cylinder } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import type { KartController } from './KartController'

export function KartVisuals({ bodyRef, controller }: { bodyRef: React.RefObject<RapierRigidBody | null>; controller: KartController }) {
  const visualRef = useRef<THREE.Group>(null)
  const frontLeft = useRef<THREE.Group>(null)
  const frontRight = useRef<THREE.Group>(null)
  const wheelSpin = useRef(0)
  const lastSpeed = useRef(0)

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!body || !visualRef.current) return
    const state = controller.getState()
    const velocity = body.linvel()
    const speed = Math.hypot(velocity.x, velocity.z)
    const steer = state.steering
    wheelSpin.current += speed * delta * 1.8
    lastSpeed.current = THREE.MathUtils.lerp(lastSpeed.current, speed, 0.12)
    visualRef.current.rotation.x = THREE.MathUtils.lerp(visualRef.current.rotation.x, (state.speed > 1 ? -0.035 : 0.02) + (state.boosting ? -0.025 : 0), 0.12)
    visualRef.current.rotation.z = THREE.MathUtils.lerp(visualRef.current.rotation.z, steer * 0.07, 0.12)

    for (const wheel of [frontLeft.current, frontRight.current]) {
      if (wheel) wheel.rotation.y = THREE.MathUtils.lerp(wheel.rotation.y, steer * 0.18, 0.14)
    }
    for (const wheel of [frontLeft.current, frontRight.current]) {
      if (wheel) wheel.children[0].rotation.x = wheelSpin.current
    }
  })

  return (
    <group ref={visualRef}>
      <Box args={[1.55, 0.42, 2.35]} position={[0, 0.1, 0]} castShadow>
        <meshStandardMaterial color="#e45c4b" roughness={0.45} metalness={0.2} />
      </Box>
      <Box args={[1.05, 0.42, 0.92]} position={[0, 0.48, 0.1]} castShadow>
        <meshStandardMaterial color="#f6c85f" roughness={0.5} />
      </Box>
      <Box args={[1.15, 0.08, 0.18]} position={[0, 0.78, -0.32]} castShadow>
        <meshStandardMaterial color="#202d35" roughness={0.35} metalness={0.6} />
      </Box>
      <WheelGroup ref={frontLeft} position={[-0.78, -0.18, -0.72]} />
      <WheelGroup ref={frontRight} position={[0.78, -0.18, -0.72]} />
      <WheelGroup position={[-0.78, -0.18, 0.72]} />
      <WheelGroup position={[0.78, -0.18, 0.72]} />
    </group>
  )
}

const WheelGroup = ({ position, ref }: { position: [number, number, number]; ref?: React.Ref<THREE.Group> }) => (
  <group ref={ref} position={position}>
    <group>
      <Cylinder args={[0.3, 0.3, 0.2, 16]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#182229" roughness={0.9} />
      </Cylinder>
    </group>
  </group>
)
