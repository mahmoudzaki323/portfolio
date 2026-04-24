import * as THREE from "three";

interface AtmosphereProps {
  radius?: number;
}

// Minimal atmosphere - just a subtle rim glow, no "bubble" effect
export function Atmosphere({ radius = 2 }: AtmosphereProps) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.015, 32, 32]} />
      <meshBasicMaterial
        color="#49b8aa"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
