import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import { useInputManager } from '../../hooks/useInputManager'
import { useGameStore } from '../../state/gameStore'
import { EMPTY_INPUT } from '../input/InputState'
import { KartController } from './KartController'
import { KartVisuals } from './KartVisuals'

export function Kart({
  bodyRef,
  controller,
  spawnPosition,
}: {
  bodyRef: RefObject<RapierRigidBody | null>
  controller: KartController
  spawnPosition: [number, number, number]
}) {
  const inputManager = useInputManager()
  const raceState = useGameStore((state) => state.race.state)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!body) return
    elapsed.current += delta
    controller.update(body, raceState === 'RACING' ? inputManager.read() : EMPTY_INPUT, delta, elapsed.current)
  })

  return (
    <RigidBody
      ref={bodyRef}
      position={spawnPosition}
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
