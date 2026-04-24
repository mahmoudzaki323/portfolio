import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const EARTH_TEXTURE = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_LIGHTS_TEXTURE = "https://threejs.org/examples/textures/planets/earth_lights_2048.png";

interface EarthProps {
  radius?: number;
  onLoad?: () => void;
}

export function Earth({ radius = 2, onLoad }: EarthProps) {
  const [texture, lightsTexture] = useTexture([EARTH_TEXTURE, EARTH_LIGHTS_TEXTURE]);

  useEffect(() => {
    if (texture && lightsTexture) {
      onLoad?.();
    }
  }, [texture, lightsTexture, onLoad]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          color="#a7b5ae"
          roughness={0.88}
          metalness={0}
          emissive="#071110"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.002, 48, 48]} />
        <meshBasicMaterial
          map={lightsTexture}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
