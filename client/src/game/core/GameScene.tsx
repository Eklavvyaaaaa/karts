import { ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../../state/gameStore'
import { ThirdPersonCamera } from '../camera/ThirdPersonCamera'
import { WorldEnvironment } from '../effects/WorldEnvironment'
import { KartEffects } from '../kart/KartEffects'
import { Kart } from '../kart/Kart'
import { KartController } from '../kart/KartController'
import { ARCADE_KART_CONFIG } from '../kart/KartConfig'
import { Track } from '../track/Track'

function PerformanceSampler() {
  const setPerformance = useGameStore((state) => state.setPerformance)
  const elapsed = useRef(0)
  const frames = useRef(0)
  const { gl } = useThree()

  useFrame((_, delta) => {
    elapsed.current += delta
    frames.current += 1
    if (elapsed.current >= 0.5) {
      setPerformance({
        fps: Math.round(frames.current / elapsed.current),
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        physics: 'online',
      })
      elapsed.current = 0
      frames.current = 0
    }
  })
  return null
}

export function GameScene() {
  const setKart = useGameStore((state) => state.setKart)
  const kartBody = useRef<import('@react-three/rapier').RapierRigidBody>(null)
  const kartTarget = useRef<THREE.Object3D>(null)
  const [kartController] = useState(() => new KartController(ARCADE_KART_CONFIG, (state) => {
    setKart({
      speed: state.speed,
      grounded: state.grounded,
      drifting: state.drifting,
      boosting: state.boosting,
      boostCooldown: state.boostCooldown,
    })
  }))

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <PerspectiveCamera makeDefault fov={52} position={[0, 7, 22]} near={0.1} far={250} />
      <WorldEnvironment />
      <ambientLight intensity={1.2} color="#dbe8e4" />
      <directionalLight castShadow position={[18, 28, 8]} intensity={2.8} color="#fff1ce" shadow-mapSize={[2048, 2048]} shadow-camera-left={-45} shadow-camera-right={45} shadow-camera-top={45} shadow-camera-bottom={-45} />
      <Physics gravity={[0, -9.81, 0]}>
        <Track />
        <group ref={kartTarget}>
          <Kart bodyRef={kartBody} controller={kartController} />
        </group>
      </Physics>
      <KartEffects bodyRef={kartBody} controller={kartController} />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.35} scale={70} blur={2.5} far={12} />
      <ThirdPersonCamera target={kartTarget} bodyRef={kartBody} controller={kartController} />
      <PerformanceSampler />
    </Canvas>
  )
}
