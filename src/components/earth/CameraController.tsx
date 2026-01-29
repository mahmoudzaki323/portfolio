import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { latLngToVector3 } from "../../lib/utils";
import { getScrollState } from "../../lib/scrollState";
import type { Trip } from "../../data/trips";

interface CameraControllerProps {
  targetTrip?: Trip | null;
  trips?: Trip[];
  radius?: number;
}

// Smooth easing functions
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export function CameraController({
  targetTrip,
  trips = [],
  radius = 2,
}: CameraControllerProps) {
  const { camera } = useThree();

  // Store trips in ref for useFrame access
  const tripsRef = useRef(trips);
  const radiusRef = useRef(radius);
  tripsRef.current = trips;
  radiusRef.current = radius;

  // Smoothed camera state
  const smoothPosition = useRef(new THREE.Vector3(0, 0, 8));
  const smoothLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Target camera state (what we're lerping toward)
  const targetPosition = useRef(new THREE.Vector3(0, 0, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Click-to-zoom state
  const isClickZoomed = useRef(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate camera position for a single location (zoomed in view)
  const getLocationCamera = (trip: Trip, distance: number, elevation: number, r: number) => {
    const surface = latLngToVector3(trip.coordinates.lat, trip.coordinates.lng, r);
    const surfaceVec = new THREE.Vector3(surface.x, surface.y, surface.z);
    const dir = surfaceVec.clone().normalize();
    const pos = dir.clone().multiplyScalar(distance);
    pos.y += elevation;
    return { position: pos, lookAt: surfaceVec };
  };

  // Calculate camera for journey between two locations
  const calculateJourneyCamera = (
    fromTrip: Trip,
    toTrip: Trip,
    progress: number,
    r: number
  ): { position: THREE.Vector3; lookAt: THREE.Vector3 } => {
    // Camera distance bounds
    const ZOOM_IN = r * 2.2;
    const ZOOM_OUT = r * 5.5;
    const ELEVATION_IN = r * 0.3;
    const ELEVATION_OUT = r * 1.0;

    // Animation phases:
    // 0.00 - 0.15: Hold at FROM location (zoomed in)
    // 0.15 - 0.35: Zoom out
    // 0.35 - 0.65: Rotate globe (zoomed out)
    // 0.65 - 0.85: Zoom in to TO location
    // 0.85 - 1.00: Hold at TO location (zoomed in)

    let camDist: number;
    let elevation: number;
    let lookAtT: number;

    // Clamp progress to 0-1 range
    const p = Math.max(0, Math.min(1, progress));

    if (p < 0.15) {
      // Hold at FROM - zoomed in
      camDist = ZOOM_IN;
      elevation = ELEVATION_IN;
      lookAtT = 0;
    } else if (p < 0.35) {
      // Zoom out phase
      const t = (p - 0.15) / 0.2;
      const eased = easeInOutQuart(t);
      camDist = ZOOM_IN + (ZOOM_OUT - ZOOM_IN) * eased;
      elevation = ELEVATION_IN + (ELEVATION_OUT - ELEVATION_IN) * eased;
      lookAtT = eased * 0.15;
    } else if (p < 0.65) {
      // Main rotation phase - zoomed out
      const t = (p - 0.35) / 0.3;
      const eased = easeInOutCubic(t);
      camDist = ZOOM_OUT;
      elevation = ELEVATION_OUT;
      lookAtT = 0.15 + eased * 0.7;
    } else if (p < 0.85) {
      // Zoom in to destination
      const t = (p - 0.65) / 0.2;
      const eased = easeInOutQuart(t);
      camDist = ZOOM_OUT + (ZOOM_IN - ZOOM_OUT) * eased;
      elevation = ELEVATION_OUT + (ELEVATION_IN - ELEVATION_OUT) * eased;
      lookAtT = 0.85 + eased * 0.15;
    } else {
      // Hold at TO - zoomed in
      camDist = ZOOM_IN;
      elevation = ELEVATION_IN;
      lookAtT = 1;
    }

    // Calculate positions on the globe
    const fromPos = latLngToVector3(fromTrip.coordinates.lat, fromTrip.coordinates.lng, r);
    const toPos = latLngToVector3(toTrip.coordinates.lat, toTrip.coordinates.lng, r);
    const fromVec = new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z);
    const toVec = new THREE.Vector3(toPos.x, toPos.y, toPos.z);

    // Interpolate lookAt position
    const lookAt = fromVec.clone().lerp(toVec, lookAtT).normalize().multiplyScalar(r);

    // Position camera along lookAt direction
    const dir = lookAt.clone().normalize();
    const position = dir.clone().multiplyScalar(camDist);
    position.y += elevation;

    return { position, lookAt };
  };

  // Handle click-to-zoom
  useEffect(() => {
    if (!targetTrip) {
      if (isClickZoomed.current && clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      return;
    }

    isClickZoomed.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const { position, lookAt } = getLocationCamera(
      targetTrip,
      radiusRef.current * 2.2,
      radiusRef.current * 0.3,
      radiusRef.current
    );

    gsap.to(smoothPosition.current, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 1.2,
      ease: "power2.inOut",
    });

    gsap.to(smoothLookAt.current, {
      x: lookAt.x,
      y: lookAt.y,
      z: lookAt.z,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        clickTimeoutRef.current = setTimeout(() => {
          isClickZoomed.current = false;
        }, 2000);
      },
    });

    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [targetTrip]);

  // MAIN ANIMATION LOOP
  // Reads directly from global scroll state for immediate updates
  useFrame((_, delta) => {
    if (isClickZoomed.current) {
      camera.position.copy(smoothPosition.current);
      camera.lookAt(smoothLookAt.current);
      return;
    }

    const allTrips = tripsRef.current;
    const r = radiusRef.current;
    if (allTrips.length === 0) return;

    // Read scroll state directly (not from React state)
    const { segmentIndex, segmentProgress } = getScrollState();

    const totalTrips = allTrips.length;
    const lastTripIndex = totalTrips - 1;
    const maxSegmentIndex = totalTrips - 2; // Last valid segment index

    // Calculate target camera position
    if (segmentIndex > maxSegmentIndex || allTrips.length === 1) {
      // At or past last segment - stay zoomed in on final destination
      const lastTrip = allTrips[lastTripIndex];
      if (lastTrip) {
        const cam = getLocationCamera(lastTrip, r * 2.2, r * 0.3, r);
        targetPosition.current.copy(cam.position);
        targetLookAt.current.copy(cam.lookAt);
      }
    } else {
      // Journey between two locations
      const fromTrip = allTrips[segmentIndex];
      const toTrip = allTrips[segmentIndex + 1];

      if (fromTrip && toTrip) {
        const cam = calculateJourneyCamera(fromTrip, toTrip, segmentProgress, r);
        targetPosition.current.copy(cam.position);
        targetLookAt.current.copy(cam.lookAt);
      }
    }

    // Smooth interpolation toward target
    // Using higher lerp factor for more responsive camera
    const lerpFactor = Math.min(1, delta * 10);

    smoothPosition.current.lerp(targetPosition.current, lerpFactor);
    smoothLookAt.current.lerp(targetLookAt.current, lerpFactor);

    // Apply to camera
    camera.position.copy(smoothPosition.current);
    camera.lookAt(smoothLookAt.current);
  });

  return null;
}

export function shouldShowLocationLabel(
  locationIndex: number,
  currentTripIndex: number,
  scrollProgress: number
): boolean {
  if (currentTripIndex === locationIndex && scrollProgress < 0.15) return true;
  if (currentTripIndex === locationIndex - 1 && scrollProgress > 0.85) return true;
  return false;
}
