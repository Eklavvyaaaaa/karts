import { Box } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { CheckpointDefinition } from './TrackConfig'

export function Checkpoint({ definition, onPlayerEnter }: { definition: CheckpointDefinition; onPlayerEnter: () => void }) {
  const [width, depth] = definition.size
  return (
    <group position={definition.position} rotation={[0, definition.rotation, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider sensor args={[width / 2, 1.1, depth / 2]} onIntersectionEnter={onPlayerEnter} />
      </RigidBody>
      <Box args={[0.12, 1.8, width]} position={[-width / 2, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#77c18e" emissive="#2e6f57" emissiveIntensity={0.35} />
      </Box>
      <Box args={[0.12, 1.8, width]} position={[width / 2, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#77c18e" emissive="#2e6f57" emissiveIntensity={0.35} />
      </Box>
      <Box args={[0.12, 0.12, width]} position={[0, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#f2c84b" emissive="#a77d18" emissiveIntensity={0.25} />
      </Box>
    </group>
  )
}
