import * as THREE from "three";

interface AtmosphereProps {
  radius?: number;
}

// Minimal atmosphere - just a subtle rim glow, no "bubble" effect
export function Atmosphere({ radius = 2 }: AtmosphereProps) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.015, 64, 64]} />
      <meshBasicMaterial
        color="#4da6ff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
