import { Box } from '@react-three/drei'
import type { TrackPoint } from './TrackConfig'

export function StartGrid({ positions }: { positions: TrackPoint[] }) {
  return (
    <group>
      {positions.map((grid, index) => (
        <group key={index} position={grid.position} rotation={[0, grid.rotation, 0]}>
          <Box args={[2.4, 0.025, 1.1]} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={index === 0 ? '#f2c84b' : '#b8c2bf'} roughness={0.8} />
          </Box>
          <mesh position={[0, 0.08, -0.44]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.65, 0.3]} />
            <meshBasicMaterial color="#172328" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
