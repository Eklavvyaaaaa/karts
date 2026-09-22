import { ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import type { PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import { useGameStore } from '../../state/gameStore'
import { WorldEnvironment } from '../effects/WorldEnvironment'
import { KartEffects } from '../kart/KartEffects'
import { Kart } from '../kart/Kart'
import { KartController } from '../kart/KartController'
import { ARCADE_KART_CONFIG } from '../kart/KartConfig'
import { Track } from '../track/Track'
import { NEON_CIRCUIT } from '../track/TrackConfig'
import { RaceManager } from '../race/RaceManager'
import type { PlayerManager } from '../networking/PlayerManager'

export type KartView = {
  body: React.RefObject<RapierRigidBody | null>
  controller: KartController
}

type KartRegistry = Map<string, KartView>

function RaceRuntime({ raceManager, controller, bodyRef }: { raceManager: RaceManager; controller: KartController; bodyRef: React.RefObject<RapierRigidBody | null> }) {
  const lastResetToken = useRef(-1)
  const respawnAvailableAt = useRef(0)

  useFrame(() => {
    const now = performance.now()
    raceManager.update(now)
    const body = bodyRef.current
    if (!body) return
    const snapshot = raceManager.getSnapshot()
    if (snapshot.resetToken !== lastResetToken.current) {
      const spawn = NEON_CIRCUIT.startGrid[0]
      controller.respawn(body, spawn.position, spawn.rotation)
      lastResetToken.current = snapshot.resetToken
      respawnAvailableAt.current = now + 350
    }
    const translation = body.translation()
    const outsideTrack = translation.y < -6 || Math.abs(translation.x) > 58 || Math.abs(translation.z) > 58
    if (raceManager.getState() === 'RACING' && outsideTrack && now >= respawnAvailableAt.current) {
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
      setPerformance({ fps: Math.round(frames.current / elapsed.current), drawCalls: gl.info.render.calls, triangles: gl.info.render.triangles, physics: 'online' })
      elapsed.current = 0
      frames.current = 0
    }
  })
  return null
}

function SplitScreenRenderer({ playerIds, registry }: { playerIds: string[]; registry: React.MutableRefObject<KartRegistry> }) {
  const { gl, scene } = useThree()
  const cameras = useRef(new Map<string, ThreePerspectiveCamera>())
  const desired = useRef(new THREE.Vector3())
  const focus = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())
  const velocity = useRef(new THREE.Vector3())
  const rotation = useRef(new THREE.Quaternion())
  const forward = useRef(new THREE.Vector3(0, 0, -1))
  const drawingBuffer = useRef(new THREE.Vector2())

  useFrame((_, delta) => {
    const count = Math.max(1, Math.min(playerIds.length, 4))
    const columns = count === 1 ? 1 : 2
    const rows = count <= 2 ? 1 : 2
    gl.getDrawingBufferSize(drawingBuffer.current)
    const bufferWidth = drawingBuffer.current.x
    const bufferHeight = drawingBuffer.current.y
    gl.setScissorTest(true)
    gl.setClearColor('#172328', 1)
    gl.clear(true, true, true)

    playerIds.slice(0, 4).forEach((playerId, index) => {
      const view = registry.current.get(playerId)
      if (!view?.body.current) return
      let camera = cameras.current.get(playerId)
      if (!camera) {
        camera = new THREE.PerspectiveCamera(52, 1, 0.1, 250)
        cameras.current.set(playerId, camera)
      }
      const body = view.body.current
      const position = body.translation()
      const bodyRotation = body.rotation()
      focus.current.set(position.x, position.y, position.z)
      rotation.current.set(bodyRotation.x, bodyRotation.y, bodyRotation.z, bodyRotation.w)
      forward.current.set(0, 0, -1).applyQuaternion(rotation.current).normalize()
      const bodyVelocity = body.linvel()
      velocity.current.set(bodyVelocity.x, 0, bodyVelocity.z)
      desired.current.copy(focus.current).addScaledVector(forward.current, -10.5)
      desired.current.y += 6.3
      desired.current.addScaledVector(velocity.current, -0.1)
      camera.position.lerp(desired.current, 1 - Math.pow(0.001, delta))
      lookAt.current.copy(focus.current).addScaledVector(velocity.current, 0.24)
      lookAt.current.y += 0.8
      camera.lookAt(lookAt.current)
      camera.fov = THREE.MathUtils.lerp(camera.fov, 52 + Math.min(velocity.current.length() / 25, 1) * 5, 0.08)
      const viewportWidth = bufferWidth / columns
      const viewportHeight = bufferHeight / rows
      camera.aspect = viewportWidth / viewportHeight
      camera.updateProjectionMatrix()

      const column = index % columns
      const row = Math.floor(index / columns)
      const viewportY = bufferHeight - (row + 1) * viewportHeight
      gl.setViewport(column * viewportWidth, viewportY, viewportWidth, viewportHeight)
      gl.setScissor(column * viewportWidth, viewportY, viewportWidth, viewportHeight)
      gl.render(scene, camera)
    })
    gl.setScissorTest(false)
  }, 1)
  return null
}

function SingleScreenCamera({ registry }: { registry: React.MutableRefObject<KartRegistry> }) {
  const { camera } = useThree()
  const focus = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())
  const velocity = useRef(new THREE.Vector3())
  const rotation = useRef(new THREE.Quaternion())
  const forward = useRef(new THREE.Vector3(0, 0, -1))

  useFrame((_, delta) => {
    const view = registry.current.get('p1')
    const body = view?.body.current
    if (!body) return
    const position = body.translation()
    const bodyRotation = body.rotation()
    focus.current.set(position.x, position.y, position.z)
    rotation.current.set(bodyRotation.x, bodyRotation.y, bodyRotation.z, bodyRotation.w)
    forward.current.set(0, 0, -1).applyQuaternion(rotation.current).normalize()
    const bodyVelocity = body.linvel()
    velocity.current.set(bodyVelocity.x, 0, bodyVelocity.z)
    desired.current.copy(focus.current).addScaledVector(forward.current, -10.5)
    desired.current.y += 6.3
    desired.current.addScaledVector(velocity.current, -0.1)
    camera.position.lerp(desired.current, 1 - Math.pow(0.001, delta))
    lookAt.current.copy(focus.current).addScaledVector(velocity.current, 0.24)
    lookAt.current.y += 0.8
    camera.lookAt(lookAt.current)
    const perspective = camera as ThreePerspectiveCamera
    perspective.fov = THREE.MathUtils.lerp(perspective.fov, 52 + Math.min(velocity.current.length() / 25, 1) * 5, 0.08)
    perspective.updateProjectionMatrix()
  })
  return null
}

function LocalKart({ playerId, index, playerManager, registry, raceManager, onPrimaryState }: { playerId: string; index: number; playerManager: PlayerManager; registry: React.MutableRefObject<KartRegistry>; raceManager: RaceManager; onPrimaryState: (state: ReturnType<KartController['getState']>) => void }) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const [controller] = useState(() => new KartController(ARCADE_KART_CONFIG, (state) => { if (playerId === 'p1') onPrimaryState(state) }))
  registry.current.set(playerId, { body: bodyRef, controller })
  const spawn = NEON_CIRCUIT.startGrid[index] ?? NEON_CIRCUIT.startGrid[0]
  return (
    <>
      <Kart bodyRef={bodyRef} controller={controller} phoneInput={playerManager.getInput(playerId)} keyboardEnabled={playerId === 'p1'} spawnPosition={spawn.position} />
      <KartEffects bodyRef={bodyRef} controller={controller} />
      {index === 0 && <RaceRuntime raceManager={raceManager} controller={controller} bodyRef={bodyRef} />}
    </>
  )
}

export function GameScene({ raceManager, playerManager, playerIds }: { raceManager: RaceManager; playerManager: PlayerManager; playerIds: string[] }) {
  const setKart = useGameStore((state) => state.setKart)
  const registry = useRef<KartRegistry>(new Map())
  const splitScreen = playerIds.length > 1
  return (
    <Canvas shadows={!splitScreen} dpr={splitScreen ? 1 : [1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance', autoClear: !splitScreen }}>
      {!splitScreen && <PerspectiveCamera makeDefault fov={52} position={[0, 7, 22]} near={0.1} far={250} />}
      <WorldEnvironment />
      <ambientLight intensity={1.2} color="#dbe8e4" />
      <directionalLight castShadow={!splitScreen} position={[18, 28, 8]} intensity={2.8} color="#fff1ce" shadow-mapSize={[1024, 1024]} shadow-camera-left={-45} shadow-camera-right={45} shadow-camera-top={45} shadow-camera-bottom={-45} />
      <Physics gravity={[0, -9.81, 0]}>
        <Track config={NEON_CIRCUIT} onCheckpoint={(index) => raceManager.acceptCheckpoint(index, performance.now())} onFinish={() => raceManager.acceptFinish(performance.now())} />
        {playerIds.slice(0, 4).map((playerId, index) => <LocalKart key={playerId} playerId={playerId} index={index} playerManager={playerManager} registry={registry} raceManager={raceManager} onPrimaryState={(state) => setKart({ speed: state.speed, grounded: state.grounded, drifting: state.drifting, boosting: state.boosting, boostCooldown: state.boostCooldown })} />)}
      </Physics>
      {!splitScreen && <ContactShadows position={[0, 0.02, 0]} opacity={0.35} scale={70} blur={2.5} far={12} />}
      {splitScreen ? <SplitScreenRenderer playerIds={playerIds} registry={registry} /> : <SingleScreenCamera registry={registry} />}
      <PerformanceSampler />
    </Canvas>
  )
}
