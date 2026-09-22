import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import { useInputManager } from '../../hooks/useInputManager'
import { KartController } from './KartController'
import { KartVisuals } from './KartVisuals'

export function Kart({
  bodyRef,
  controller,
}: {
  bodyRef: RefObject<RapierRigidBody | null>
  controller: KartController
}) {
  const inputManager = useInputManager()
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!body) return
    elapsed.current += delta
    controller.update(body, inputManager.read(), delta, elapsed.current)
  })

  return (
    <RigidBody
      ref={bodyRef}
      position={[0, 1.1, 12]}
      colliders="cuboid"
      mass={80}
      friction={0.9}
      restitution={0.05}
      linearDamping={1.2}
      angularDamping={4}
      enabledRotations={[false, true, false]}
    >
      <KartVisuals bodyRef={bodyRef} controller={controller} />
    </RigidBody>
  )
}
