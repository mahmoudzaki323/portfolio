import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { Earth } from "./Earth";
import { Atmosphere } from "./Atmosphere";
import { LocationMarkers } from "./LocationMarkers";
import { RouteArcs } from "./RouteArcs";
import { CameraController } from "./CameraController";
import { latLngToVector3 } from "../../lib/utils";
import { trips, type Trip } from "../../data/trips";

interface TripSelectOptions {
  keepManualControl?: boolean;
  anchor?: {
    x: number;
    y: number;
  };
  anchorMode?: "point" | "marker";
}

interface EarthSceneProps {
  activeTrip?: Trip | null;
  isOverview?: boolean;
  currentTripIndex?: number;
  scrollProgress?: number;
  visibleLabelId?: string | null;
  onTripSelect?: (tripId: string, options?: TripSelectOptions) => void;
  onActiveTripAnchorChange?: (anchor: { x: number; y: number }) => void;
  onLoad?: () => void;
  isManualControlActive?: boolean;
  onManualControlStart?: () => void;
  onManualControlEnd?: () => void;
  manualControlsEnabled?: boolean;
  manualControlMode?: "free" | "horizontal";
  selectTripsWhileDragging?: boolean;
  holdFocus?: boolean;
  freeExploreMode?: boolean;
  focusKey?: number;
  focusDistanceMultiplier?: number;
  focusElevationMultiplier?: number;
}

function Loader({ onLoad }: { onLoad?: () => void }) {
  const { loaded } = useProgress();

  useEffect(() => {
    if (loaded && onLoad) {
      const timer = setTimeout(onLoad, 200);
      return () => clearTimeout(timer);
    }
  }, [loaded, onLoad]);

  return null;
}

function ActiveTripScreenAnchor({
  trip,
  radius,
  onActiveTripAnchorChange,
}: {
  trip?: Trip | null;
  radius: number;
  onActiveTripAnchorChange?: (anchor: { x: number; y: number }) => void;
}) {
  const { camera, gl } = useThree();
  const lastAnchorRef = useRef<{ x: number; y: number; tripId: string } | null>(null);

  useEffect(() => {
    lastAnchorRef.current = null;
  }, [trip?.id]);

  useFrame(() => {
    if (!trip || !onActiveTripAnchorChange) return;

    const markerPoint = latLngToVector3(
      trip.coordinates.lat,
      trip.coordinates.lng,
      radius * 1.04
    );
    const projected = new THREE.Vector3(markerPoint.x, markerPoint.y, markerPoint.z).project(camera);

    if (projected.z < -1 || projected.z > 1) return;

    const bounds = gl.domElement.getBoundingClientRect();
    const x = bounds.left + (projected.x * 0.5 + 0.5) * bounds.width;
    const y = bounds.top + (-projected.y * 0.5 + 0.5) * bounds.height;

    if (x < 12 || x > window.innerWidth - 12 || y < 12 || y > window.innerHeight - 12) {
      return;
    }

    const lastAnchor = lastAnchorRef.current;
    if (
      lastAnchor &&
      lastAnchor.tripId === trip.id &&
      Math.abs(lastAnchor.x - x) < 1 &&
      Math.abs(lastAnchor.y - y) < 1
    ) {
      return;
    }

    lastAnchorRef.current = { x, y, tripId: trip.id };
    onActiveTripAnchorChange({ x, y });
  });

  return null;
}

function ManualGlobeControls({
  trips,
  radius,
  onTripSelect,
  onManualControlStart,
  onManualControlEnd,
  mode = "free",
  selectTripsWhileDragging = true,
}: {
  trips: Trip[];
  radius: number;
  onTripSelect?: (tripId: string, options?: TripSelectOptions) => void;
  onManualControlStart?: () => void;
  onManualControlEnd?: () => void;
  mode?: "free" | "horizontal";
  selectTripsWhileDragging?: boolean;
}) {
  const { camera, gl } = useThree();

  useEffect(() => {
    const element = gl.domElement;
    const isHorizontalMode = mode === "horizontal";
    const target = new THREE.Vector3(0, 0, 0);
    const spherical = new THREE.Spherical();
    const start = {
      x: 0,
      y: 0,
      theta: 0,
      phi: 0,
      radius: 0,
      dragging: false,
      pending: false,
      pointerId: -1,
    };
    let lastPickedTripId: string | null = null;
    let lastPickedAnchor: TripSelectOptions["anchor"] | null = null;

    const pickTripAtPointer = (event: PointerEvent) => {
      if (!onTripSelect) return;

      const bounds = element.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      let closestTripId: string | null = null;
      let closestDistance = Infinity;

      trips.forEach((trip) => {
        const markerPoint = latLngToVector3(
          trip.coordinates.lat,
          trip.coordinates.lng,
          radius * 1.01
        );
        const markerPosition = new THREE.Vector3(
          markerPoint.x,
          markerPoint.y,
          markerPoint.z
        );
        const projected = markerPosition.clone().project(camera);

        if (projected.z < -1 || projected.z > 1) return;

        const screenX = (projected.x * 0.5 + 0.5) * bounds.width;
        const screenY = (-projected.y * 0.5 + 0.5) * bounds.height;
        const distance = Math.hypot(screenX - pointerX, screenY - pointerY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestTripId = trip.id;
        }
      });

      if (!closestTripId || closestDistance > 28 || closestTripId === lastPickedTripId) return;

      lastPickedTripId = closestTripId;
      lastPickedAnchor = { x: event.clientX, y: event.clientY };
      onTripSelect(closestTripId, {
        keepManualControl: true,
        anchor: lastPickedAnchor,
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      spherical.setFromVector3(camera.position.clone().sub(target));

      start.x = event.clientX;
      start.y = event.clientY;
      start.theta = spherical.theta;
      start.phi = spherical.phi;
      start.radius = spherical.radius;
      start.pointerId = event.pointerId;
      start.dragging = !isHorizontalMode;
      start.pending = isHorizontalMode;
      lastPickedTripId = null;
      lastPickedAnchor = null;

      if (!isHorizontalMode) {
        onManualControlStart?.();
        element.setPointerCapture(event.pointerId);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (start.pending && event.pointerId === start.pointerId) {
        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < 8) return;

        start.pending = false;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

        start.dragging = true;
        onManualControlStart?.();
        element.setPointerCapture(event.pointerId);
      }

      if (!start.dragging) return;

      const nextTheta = start.theta - (event.clientX - start.x) * 0.006;
      const nextPhi = THREE.MathUtils.clamp(
        start.phi - (isHorizontalMode ? 0 : event.clientY - start.y) * 0.0045,
        0.28,
        Math.PI - 0.28
      );

      spherical.set(start.radius, nextPhi, nextTheta);
      camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(target));
      camera.lookAt(target);
      if (selectTripsWhileDragging) {
        pickTripAtPointer(event);
      }
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (!start.dragging && !start.pending) return;
      start.dragging = false;
      start.pending = false;
      start.pointerId = -1;
      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }
      if (lastPickedTripId) {
        onTripSelect?.(lastPickedTripId, lastPickedAnchor ? { anchor: lastPickedAnchor } : undefined);
      }
      onManualControlEnd?.();
    };

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerEnd);
    element.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerEnd);
      element.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [
    camera,
    gl,
    mode,
    onManualControlEnd,
    onManualControlStart,
    onTripSelect,
    radius,
    selectTripsWhileDragging,
    trips,
  ]);

  return null;
}

function Scene({
  activeTrip,
  isOverview = true,
  currentTripIndex = 0,
  onTripSelect,
  onActiveTripAnchorChange,
  onLoad,
  isManualControlActive = false,
  onManualControlStart,
  onManualControlEnd,
  manualControlsEnabled = true,
  manualControlMode = "free",
  selectTripsWhileDragging = true,
  holdFocus = false,
  freeExploreMode = false,
  focusKey = 0,
  focusDistanceMultiplier,
  focusElevationMultiplier,
}: EarthSceneProps) {
  const RADIUS = 2;

  return (
    <>
      <Loader onLoad={onLoad} />

      <ambientLight intensity={0.62} />
      <directionalLight
        position={[4.5, 2.5, 4]}
        intensity={1.8}
        color="#f2efe7"
      />
      <directionalLight
        position={[-3, -1, -3]}
        intensity={0.45}
        color="#49b8aa"
      />
      <hemisphereLight
        args={["#b7f1e8", "#151b1a", 0.22]}
      />

      <Stars
        radius={100}
        depth={50}
        count={360}
        factor={2}
        saturation={0}
        fade
        speed={0.08}
      />

      <Earth radius={RADIUS} />

      <Atmosphere radius={RADIUS} />

      <RouteArcs
        trips={trips}
        radius={RADIUS}
        activeIndex={currentTripIndex}
      />

      <LocationMarkers
        trips={trips}
        radius={RADIUS}
        activeTripId={activeTrip?.id}
        onTripSelect={onTripSelect}
      />

      <CameraController
        targetTrip={isOverview ? null : activeTrip}
        trips={trips}
        radius={RADIUS}
        isManualControlActive={isManualControlActive}
        holdTarget={holdFocus}
        freeExploreMode={freeExploreMode}
        focusKey={focusKey}
        focusDistanceMultiplier={focusDistanceMultiplier}
        focusElevationMultiplier={focusElevationMultiplier}
      />

      <ActiveTripScreenAnchor
        trip={activeTrip}
        radius={RADIUS}
        onActiveTripAnchorChange={onActiveTripAnchorChange}
      />

      {manualControlsEnabled && (
        <ManualGlobeControls
          trips={trips}
          radius={RADIUS}
          onTripSelect={onTripSelect}
          onManualControlStart={onManualControlStart}
          onManualControlEnd={onManualControlEnd}
          mode={manualControlMode}
          selectTripsWhileDragging={selectTripsWhileDragging}
        />
      )}
    </>
  );
}

export function EarthScene({
  activeTrip,
  isOverview,
  currentTripIndex,
  onTripSelect,
  onActiveTripAnchorChange,
  onLoad,
  isManualControlActive,
  onManualControlStart,
  onManualControlEnd,
  manualControlsEnabled,
  manualControlMode,
  selectTripsWhileDragging,
  holdFocus,
  freeExploreMode,
  focusKey,
  focusDistanceMultiplier,
  focusElevationMultiplier,
}: EarthSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const deviceDpr =
    typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 1.1);
  const allowsManualControls = manualControlsEnabled ?? true;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  return (
    <div className="globe-interaction-layer relative h-full w-full">
      <Canvas
        camera={{
          position: [0, 0.8, 9],
          fov: 42,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={deviceDpr}
        performance={{ min: 0.75 }}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          background: "transparent",
          touchAction: allowsManualControls && manualControlMode !== "horizontal" ? "none" : "pan-y",
        }}
      >
        <Suspense fallback={null}>
          <Scene
            activeTrip={activeTrip}
            isOverview={isOverview}
            currentTripIndex={currentTripIndex}
            onTripSelect={onTripSelect}
            onActiveTripAnchorChange={onActiveTripAnchorChange}
            onLoad={handleLoad}
            isManualControlActive={isManualControlActive}
            onManualControlStart={onManualControlStart}
            onManualControlEnd={onManualControlEnd}
            manualControlsEnabled={manualControlsEnabled}
            manualControlMode={manualControlMode}
            selectTripsWhileDragging={selectTripsWhileDragging}
            holdFocus={holdFocus}
            freeExploreMode={freeExploreMode}
            focusKey={focusKey}
            focusDistanceMultiplier={focusDistanceMultiplier}
            focusElevationMultiplier={focusElevationMultiplier}
          />
        </Suspense>
      </Canvas>

      {!isLoaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70">
          <div className="w-full max-w-xs px-6 text-center">
            <span className="eyebrow text-accent">Loading Earth</span>
            <div className="mt-4 h-px overflow-hidden bg-line">
              <div className="h-full animate-shimmer bg-accent" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
