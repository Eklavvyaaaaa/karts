import { Box } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Checkpoint } from './Checkpoint'
import { FinishLine } from './FinishLine'
import { StartGrid } from './StartGrid'
import type { TrackConfig } from './TrackConfig'

export function Track({ config, onCheckpoint, onFinish }: { config: TrackConfig; onCheckpoint: (index: number) => void; onFinish: () => void }) {
  return (
    <group>
      <TrackCollision />
      <TrackVisuals />
      <ItemSpawnMarkers config={config} />
      <StartGrid positions={config.startGrid} />
      {config.checkpoints.map((checkpoint) => (
        <Checkpoint key={checkpoint.id} definition={checkpoint} onPlayerEnter={() => onCheckpoint(checkpoint.order)} />
      ))}
      <FinishLine definition={config.finishLine} onPlayerEnter={onFinish} />
    </group>
  )
}

function ItemSpawnMarkers({ config }: { config: TrackConfig }) {
  return (
    <group>
      {config.itemSpawnPoints.map((point) => (
        <group key={point.id} position={point.position} rotation={[0, point.rotation, 0]}>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.4, 1.4]} />
            <meshStandardMaterial color="#77c18e" emissive="#2e6f57" emissiveIntensity={0.5} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.65, 0.65, 0.65]} />
            <meshStandardMaterial color="#f2c84b" emissive="#a77d18" emissiveIntensity={0.8} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function TrackCollision() {
  return (
    <RigidBody type="fixed" colliders={false} friction={1}>
      <CuboidCollider args={[75, 0.25, 75]} position={[0, -0.25, 0]} />
      <CuboidCollider args={[22, 0.4, 0.5]} position={[0, 0.4, -28]} />
      <CuboidCollider args={[22, 0.4, 0.5]} position={[0, 0.4, 28]} />
      <CuboidCollider args={[0.5, 0.4, 28]} position={[-22, 0.4, 0]} />
      <CuboidCollider args={[0.5, 0.4, 28]} position={[22, 0.4, 0]} />
    </RigidBody>
  )
}

function TrackVisuals() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#5d8967" roughness={1} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[38, 50]} />
        <meshStandardMaterial color="#303b42" roughness={0.94} />
      </mesh>
      <Barrier position={[0, 0.4, -28]} size={[44, 0.8, 1]} />
      <Barrier position={[0, 0.4, 28]} size={[44, 0.8, 1]} />
      <Barrier position={[-22, 0.4, 0]} size={[1, 0.8, 56]} />
      <Barrier position={[22, 0.4, 0]} size={[1, 0.8, 56]} />
      <Box args={[1, 0.12, 50]} position={[-19.2, 0.12, 0]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>
      <Box args={[1, 0.12, 50]} position={[19.2, 0.12, 0]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>
      <Box args={[38, 0.12, 1]} position={[0, 0.12, -25.2]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>
      <Box args={[38, 0.12, 1]} position={[0, 0.12, 25.2]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>
      {Array.from({ length: 9 }, (_, index) => (
        <Box key={index} args={[0.18, 0.02, 3.2]} position={[0, 0.14, -21 + index * 5.25]} receiveShadow>
          <meshStandardMaterial color={index === 0 ? '#ffffff' : '#b8c2bf'} roughness={0.8} />
        </Box>
      ))}
      {Array.from({ length: 8 }, (_, index) => (
        <group key={`light-${index}`} position={[-20.5, 0, -22 + index * 6.2]}>
          <Box args={[0.12, 2.6, 0.12]} position={[0, 1.3, 0]} castShadow><meshStandardMaterial color="#a9b6ad" metalness={0.5} roughness={0.5} /></Box>
          <Box args={[0.42, 0.18, 0.24]} position={[0.12, 2.55, 0]}><meshStandardMaterial color="#f2c84b" emissive="#a77d18" emissiveIntensity={1.5} /></Box>
        </group>
      ))}
    </group>
  )
}

function Barrier({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <Box args={size} position={position} castShadow receiveShadow>
      <meshStandardMaterial color="#d75b45" roughness={0.7} metalness={0.05} />
    </Box>
  )
}
