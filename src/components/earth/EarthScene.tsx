import { useState, useCallback, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, useProgress } from "@react-three/drei";
import { Earth } from "./Earth";
import { Atmosphere } from "./Atmosphere";
import { LocationMarkers } from "./LocationMarkers";
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
  currentTripIndex = 0,
  scrollProgress = 0,
  visibleLabelId,
  onTripSelect,
  onLoad,
}: EarthSceneProps) {
  const RADIUS = 2;

  return (
    <>
      <Loader onLoad={onLoad} />

      {/* Lighting - bright and balanced for photorealistic look */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={3}
        color="#fffef0"
      />
      <directionalLight
        position={[-3, -1, -3]}
        intensity={1.2}
        color="#b0c4de"
      />
      <hemisphereLight
        args={["#b0d8ff", "#283040", 0.4]}
      />

      {/* Subtle star background */}
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Earth globe */}
      <Earth radius={RADIUS} rotationSpeed={0.00015} />

      {/* Subtle atmosphere glow */}
      <Atmosphere radius={RADIUS} />

      {/* Location markers */}
      <LocationMarkers
        trips={trips}
        radius={RADIUS}
        activeTripId={activeTrip?.id}
        visibleLabelId={visibleLabelId}
        currentTripIndex={currentTripIndex}
        scrollProgress={scrollProgress}
        onTripSelect={onTripSelect}
      />

      {/* Camera with zoom functionality - reads from global scroll state */}
      <CameraController
        targetTrip={activeTrip}
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
  scrollProgress,
  visibleLabelId,
  onTripSelect,
  onLoad,
}: EarthSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{
          position: [0, 1, 8],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene
            activeTrip={activeTrip}
            isOverview={isOverview}
            currentTripIndex={currentTripIndex}
            scrollProgress={scrollProgress}
            visibleLabelId={visibleLabelId}
            onTripSelect={onTripSelect}
            onLoad={handleLoad}
          />
        </Suspense>
      </Canvas>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-sm text-white/60">Loading Earth...</span>
          </div>
        </div>
      )}
    </div>
  );
}
