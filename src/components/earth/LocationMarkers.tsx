import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "../../lib/utils";
import type { Trip } from "../../data/trips";

interface LocationMarkerProps {
  trip: Trip;
  radius: number;
  isActive: boolean;
  showLabel: boolean;
  onClick: () => void;
}

function LocationMarker({ trip, radius, isActive, showLabel, onClick }: LocationMarkerProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Position on sphere surface with slight offset to prevent z-fighting
  const position = useMemo(() => {
    const pos = latLngToVector3(trip.coordinates.lat, trip.coordinates.lng, radius * 1.01);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [trip.coordinates, radius]);

  // Pulse animation for active marker
  useFrame((state) => {
    if (pulseRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  const markerSize = isActive ? 0.08 : 0.05;
  const color = new THREE.Color(trip.color);

  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      {/* Click area */}
      <mesh
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
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Outer pulse ring when active */}
      {isActive && (
        <mesh ref={pulseRef}>
          <ringGeometry args={[markerSize * 1.2, markerSize * 1.8, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Main marker dot */}
      <mesh>
        <circleGeometry args={[markerSize, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Inner white dot */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[markerSize * 0.4, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Label - shows when camera is close (based on scroll) */}
      <Html
        distanceFactor={6}
        position={[0, 0.25, 0]}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          opacity: showLabel ? 1 : 0,
          transform: showLabel ? "scale(1) translateY(0)" : "scale(0.8) translateY(10px)",
        }}
      >
        <div
          ref={labelRef}
          className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap"
          style={{
            backgroundColor: `${trip.color}90`,
            color: "#ffffff",
            backdropFilter: "blur(8px)",
            boxShadow: `0 4px 20px ${trip.color}60`,
          }}
        >
          {trip.name}
        </div>
      </Html>
    </Billboard>
  );
}

interface LocationMarkersProps {
  trips: Trip[];
  radius?: number;
  activeTripId?: string | null;
  visibleLabelId?: string | null;
  currentTripIndex?: number;
  scrollProgress?: number;
  onTripSelect?: (tripId: string) => void;
}

export function LocationMarkers({
  trips,
  radius = 2,
  activeTripId,
  visibleLabelId,
  currentTripIndex = 0,
  scrollProgress = 0,
  onTripSelect,
}: LocationMarkersProps) {
  const handleMarkerClick = useCallback(
    (tripId: string) => {
      onTripSelect?.(tripId);
    },
    [onTripSelect]
  );

  // Determine which markers should show their labels
  const shouldShowLabel = useCallback((trip: Trip, index: number): boolean => {
    // If explicit visibleLabelId is provided, use that
    if (visibleLabelId !== undefined) {
      return trip.id === visibleLabelId;
    }
    
    // Fallback logic based on current trip index and scroll
    // Show label for current location when zoomed in
    if (index === currentTripIndex && scrollProgress < 0.25) {
      return true;
    }
    // Show label for next location when approaching it
    if (index === currentTripIndex + 1 && scrollProgress > 0.75) {
      return true;
    }
    return false;
  }, [visibleLabelId, currentTripIndex, scrollProgress]);

  return (
    <group>
      {trips.map((trip, index) => (
        <LocationMarker
          key={trip.id}
          trip={trip}
          radius={radius}
          isActive={trip.id === activeTripId}
          showLabel={shouldShowLabel(trip, index)}
          onClick={() => handleMarkerClick(trip.id)}
        />
      ))}
    </group>
  );
}
