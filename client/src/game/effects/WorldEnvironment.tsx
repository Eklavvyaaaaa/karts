import { Environment, Sky } from '@react-three/drei'

export function WorldEnvironment() {
  return (
    <>
      <Sky distance={450000} sunPosition={[30, 18, -20]} turbidity={8} rayleigh={2.2} />
      <Environment preset="park" background={false} environmentIntensity={0.5} />
      <color attach="background" args={['#93b8c4']} />
      <fog attach="fog" args={['#93b8c4', 55, 180]} />
    </>
  )
}
