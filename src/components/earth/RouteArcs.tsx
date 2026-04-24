import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "../../lib/utils";
import type { Trip } from "../../data/trips";

interface RouteArcsProps {
  trips: Trip[];
  radius?: number;
  activeIndex?: number;
}

function buildArc(from: Trip, to: Trip, radius: number) {
  const startPoint = latLngToVector3(from.coordinates.lat, from.coordinates.lng, radius * 1.035);
  const endPoint = latLngToVector3(to.coordinates.lat, to.coordinates.lng, radius * 1.035);
  const start = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);
  const end = new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z);
  const midpoint = start.clone().add(end).normalize().multiplyScalar(radius * 1.55);
  const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);

  return curve.getPoints(36);
}

export function RouteArcs({ trips, radius = 2, activeIndex = 0 }: RouteArcsProps) {
  const arcs = useMemo(
    () =>
      trips.slice(0, -1).map((trip, index) => ({
        id: `${trip.id}-${trips[index + 1].id}`,
        points: buildArc(trip, trips[index + 1], radius),
        isActive: index === activeIndex,
      })),
    [activeIndex, radius, trips]
  );

  return (
    <group>
      {arcs.map((arc) => (
        <Line
          key={arc.id}
          points={arc.points}
          color={arc.isActive ? "#6ee7d8" : "#3b8f86"}
          transparent
          opacity={arc.isActive ? 0.92 : 0.58}
          lineWidth={arc.isActive ? 1.7 : 1.05}
          depthTest={false}
          renderOrder={4}
        />
      ))}
    </group>
  );
}
