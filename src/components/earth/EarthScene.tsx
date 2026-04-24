import { useState, useCallback, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, useProgress } from "@react-three/drei";
import { Earth } from "./Earth";
import { Atmosphere } from "./Atmosphere";
import { LocationMarkers } from "./LocationMarkers";
import { RouteArcs } from "./RouteArcs";
import { CameraController } from "./CameraController";
import { trips, type Trip } from "../../data/trips";

interface EarthSceneProps {
  activeTrip?: Trip | null;
  isOverview?: boolean;
  currentTripIndex?: number;
  scrollProgress?: number;
  visibleLabelId?: string | null;
  onTripSelect?: (tripId: string) => void;
  onLoad?: () => void;
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

function Scene({
  activeTrip,
  isOverview = true,
  currentTripIndex = 0,
  onTripSelect,
  onLoad,
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
      />
    </>
  );
}

export function EarthScene({
  activeTrip,
  isOverview,
  currentTripIndex,
  onTripSelect,
  onLoad,
}: EarthSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const deviceDpr =
    typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 1.1);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  return (
    <div className="relative w-full h-full">
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
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene
            activeTrip={activeTrip}
            isOverview={isOverview}
            currentTripIndex={currentTripIndex}
            onTripSelect={onTripSelect}
            onLoad={handleLoad}
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
