import { Box } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { TrackPoint } from './TrackConfig'

export function FinishLine({ definition, onPlayerEnter }: { definition: TrackPoint & { size: [number, number] }; onPlayerEnter: () => void }) {
  const [width, depth] = definition.size
  return (
    <group position={definition.position} rotation={[0, definition.rotation, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider sensor args={[width / 2, 1.1, depth / 2]} onIntersectionEnter={onPlayerEnter} />
      </RigidBody>
      <Box args={[width, 0.035, depth]} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#f2c84b" emissive="#8f6a14" emissiveIntensity={0.3} />
      </Box>
      <Box args={[0.16, 2.7, 0.16]} position={[-width / 2, 1.35, 0]}>
        <meshStandardMaterial color="#e45c4b" emissive="#702b28" emissiveIntensity={0.25} />
      </Box>
      <Box args={[0.16, 2.7, 0.16]} position={[width / 2, 1.35, 0]}>
        <meshStandardMaterial color="#e45c4b" emissive="#702b28" emissiveIntensity={0.25} />
      </Box>
      <Box args={[width + 0.3, 0.2, 0.2]} position={[0, 2.65, 0]}>
        <meshStandardMaterial color="#f2c84b" emissive="#a77d18" emissiveIntensity={0.25} />
      </Box>
    </group>
  )
}
