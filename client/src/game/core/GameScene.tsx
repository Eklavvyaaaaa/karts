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
import { NEON_CIRCUIT } from '../track/TrackConfig'
import { RaceManager } from '../race/RaceManager'

function RaceRuntime({ raceManager, controller, bodyRef }: { raceManager: RaceManager; controller: KartController; bodyRef: React.RefObject<import('@react-three/rapier').RapierRigidBody | null> }) {
  const lastResetToken = useRef(-1)
  const respawnAvailableAt = useRef(0)

  useFrame(() => {
    const now = performance.now()
    raceManager.update(now)
    const body = bodyRef.current
    const snapshot = raceManager.getSnapshot()
    if (!body) return

    if (snapshot.resetToken !== lastResetToken.current) {
      const spawn = NEON_CIRCUIT.startGrid[0]
      controller.respawn(body, spawn.position, spawn.rotation)
      lastResetToken.current = snapshot.resetToken
      respawnAvailableAt.current = now + 350
    }

    const translation = body.translation()
    const outsideTrack = translation.y < -6 || Math.abs(translation.x) > 58 || Math.abs(translation.z) > 58
    if (raceManager.getState() === 'RACING' && NEON_CIRCUIT.respawnPoints.length && outsideTrack && now >= respawnAvailableAt.current) {
      const pointIndex = Math.min(Math.max(raceManager.getLastCheckpoint() + 1, 0), NEON_CIRCUIT.respawnPoints.length - 1)
      const point = NEON_CIRCUIT.respawnPoints[pointIndex]
      controller.respawn(body, point.position, point.rotation)
      respawnAvailableAt.current = now + 800
    }
  })

  return null
}

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

export function GameScene({ raceManager }: { raceManager: RaceManager }) {
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
        <Track
          config={NEON_CIRCUIT}
          onCheckpoint={(index) => raceManager.acceptCheckpoint(index, performance.now())}
          onFinish={() => raceManager.acceptFinish(performance.now())}
        />
        <group ref={kartTarget}>
          <Kart bodyRef={kartBody} controller={kartController} spawnPosition={NEON_CIRCUIT.startGrid[0].position} />
        </group>
      </Physics>
      <KartEffects bodyRef={kartBody} controller={kartController} />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.35} scale={70} blur={2.5} far={12} />
      <ThirdPersonCamera bodyRef={kartBody} controller={kartController} />
      <RaceRuntime raceManager={raceManager} controller={kartController} bodyRef={kartBody} />
      <PerformanceSampler />
    </Canvas>
  )
}
