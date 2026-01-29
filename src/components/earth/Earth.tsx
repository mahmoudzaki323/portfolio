import { useRef, useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const EARTH_TEXTURE = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

interface EarthProps {
  radius?: number;
  rotationSpeed?: number;
  onLoad?: () => void;
}

export function Earth({ radius = 2, onLoad }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(EARTH_TEXTURE);

  useEffect(() => {
    if (texture) {
      // Ensure proper color space for vibrant colors
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 16;
      onLoad?.();
    }
  }, [texture, onLoad]);

  // The coordinate conversion in latLngToVector3 handles texture alignment
  // No additional rotation needed

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshPhongMaterial
        map={texture}
        shininess={5}
        specular={new THREE.Color(0x333333)}
        // Slight emissive to brighten dark areas
        emissive={new THREE.Color(0x112244)}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}
