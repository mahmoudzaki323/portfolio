import { useMemo, useCallback } from "react";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "../../lib/utils";
import type { Trip } from "../../data/trips";

interface LocationMarkerProps {
  trip: Trip;
  radius: number;
  isActive: boolean;
  onClick: () => void;
}

function LocationMarker({ trip, radius, isActive, onClick }: LocationMarkerProps) {
  const position = useMemo(() => {
    const pos = latLngToVector3(trip.coordinates.lat, trip.coordinates.lng, radius * 1.01);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [trip.coordinates, radius]);

  const markerSize = isActive ? 0.075 : 0.045;
  const color = new THREE.Color(trip.color);

  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <mesh
        renderOrder={5}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <circleGeometry args={[0.14, 32]} />
        <meshBasicMaterial transparent opacity={0} depthTest={false} />
      </mesh>

      {isActive && (
        <mesh renderOrder={5}>
          <ringGeometry args={[markerSize * 1.55, markerSize * 2.45, 40]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.26}
            depthTest={false}
          />
        </mesh>
      )}

      <mesh renderOrder={5}>
        <circleGeometry args={[markerSize, 28]} />
        <meshBasicMaterial
          color={isActive ? "#6ee7d8" : "#49b8aa"}
          transparent
          opacity={isActive ? 0.95 : 0.74}
          depthTest={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.001]} renderOrder={6}>
        <circleGeometry args={[markerSize * 0.4, 16]} />
        <meshBasicMaterial color="#f2efe7" transparent opacity={0.82} depthTest={false} />
      </mesh>
    </Billboard>
  );
}

interface LocationMarkersProps {
  trips: Trip[];
  radius?: number;
  activeTripId?: string | null;
  onTripSelect?: (tripId: string) => void;
}

export function LocationMarkers({
  trips,
  radius = 2,
  activeTripId,
  onTripSelect,
}: LocationMarkersProps) {
  const handleMarkerClick = useCallback(
    (tripId: string) => {
      onTripSelect?.(tripId);
    },
    [onTripSelect]
  );

  return (
    <group>
      {trips.map((trip) => (
        <LocationMarker
          key={trip.id}
          trip={trip}
          radius={radius}
          isActive={trip.id === activeTripId}
          onClick={() => handleMarkerClick(trip.id)}
        />
      ))}
    </group>
  );
}
