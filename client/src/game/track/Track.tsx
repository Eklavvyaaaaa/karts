import { Box } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

export function Track() {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[150, 150]} />
          <meshStandardMaterial color="#5d8967" roughness={1} />
        </mesh>
        <Box args={[44, 0.8, 1]} position={[0, 0.4, -28]} castShadow receiveShadow><meshStandardMaterial color="#d75b45" roughness={0.7} metalness={0.05} /></Box>
        <Box args={[44, 0.8, 1]} position={[0, 0.4, 28]} castShadow receiveShadow><meshStandardMaterial color="#d75b45" roughness={0.7} metalness={0.05} /></Box>
        <Box args={[1, 0.8, 56]} position={[-22, 0.4, 0]} castShadow receiveShadow><meshStandardMaterial color="#d75b45" roughness={0.7} metalness={0.05} /></Box>
        <Box args={[1, 0.8, 56]} position={[22, 0.4, 0]} castShadow receiveShadow><meshStandardMaterial color="#d75b45" roughness={0.7} metalness={0.05} /></Box>
      </RigidBody>

      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[38, 50]} />
        <meshStandardMaterial color="#303b42" roughness={0.94} />
      </mesh>
      <Box args={[1, 0.12, 50]} position={[-19.2, 0.12, 0]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>
      <Box args={[1, 0.12, 50]} position={[19.2, 0.12, 0]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>
      <Box args={[38, 0.12, 1]} position={[0, 0.12, -25.2]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>
      <Box args={[38, 0.12, 1]} position={[0, 0.12, 25.2]} receiveShadow><meshStandardMaterial color="#f3d36a" roughness={0.8} /></Box>

      {Array.from({ length: 9 }, (_, index) => (
        <Box
          key={index}
          args={[0.18, 0.02, 3.2]}
          position={[0, 0.14, -21 + index * 5.25]}
          rotation={[0, index % 2 === 0 ? 0 : Math.PI, 0]}
          receiveShadow
        ><meshStandardMaterial color={index === 0 ? '#ffffff' : '#b8c2bf'} roughness={0.8} /></Box>
      ))}
    </group>
  )
}
