import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlbumGallery } from "./AlbumGallery";
import { PhotographyDesktopExperience } from "./PhotographyDesktopExperience";
import { PhotographyMobileExperience } from "./PhotographyMobileExperience";
import { trips, type Trip } from "../../data/trips";

const MOBILE_QUERY = "(max-width: 767px)";

function getIsMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

export function PhotographySection() {
  const hasTrips = trips.length > 0;
  const isMobile = useIsMobileViewport();
  const sectionRef = useRef<HTMLElement>(null);
  const desktopRouteRailRef = useRef<HTMLDivElement>(null);
  const mobileRailRef = useRef<HTMLDivElement>(null);
  const focusTimeoutRef = useRef<number | null>(null);

  const [activeTrip, setActiveTrip] = useState<Trip | null>(trips[0] ?? null);
  const [focusedTripId, setFocusedTripId] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [earthLoaded, setEarthLoaded] = useState(false);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cameraFocusKey, setCameraFocusKey] = useState(0);
  const [isManualGlobeControlActive, setIsManualGlobeControlActiveState] = useState(false);
  const manualGlobeControlRef = useRef(false);

  const setIsManualGlobeControlActive = useCallback((value: boolean) => {
    if (manualGlobeControlRef.current === value) return;
    manualGlobeControlRef.current = value;
    setIsManualGlobeControlActiveState(value);
  }, []);

  const handleManualGlobeControlStart = useCallback(() => {
    setIsManualGlobeControlActive(true);
  }, [setIsManualGlobeControlActive]);

  const handleManualGlobeControlEnd = useCallback(() => {
    setIsManualGlobeControlActive(false);
  }, [setIsManualGlobeControlActive]);

  const totals = useMemo(() => {
    const albums = trips.reduce((sum, trip) => sum + trip.albums.length, 0);
    const frames = trips.reduce(
      (sum, trip) => sum + trip.albums.reduce((albumSum, album) => albumSum + album.photos.length, 0),
      0
    );

    return { albums, frames };
  }, []);

  const visibleLabelId = useMemo(() => {
    if (!hasTrips) return null;
    if (scrollProgress < 0.22) return trips[currentTripIndex]?.id || null;
    if (scrollProgress > 0.78) {
      const nextIndex = Math.min(currentTripIndex + 1, trips.length - 1);
      return trips[nextIndex]?.id || null;
    }
    return null;
  }, [hasTrips, scrollProgress, currentTripIndex]);

  useEffect(() => {
    const alignPhotographyHash = () => {
      if (window.location.hash !== "#photography" || !sectionRef.current) return;
      sectionRef.current.scrollIntoView({ block: "start" });
    };

    const alignTimeout = window.setTimeout(alignPhotographyHash, 120);
    window.addEventListener("hashchange", alignPhotographyHash);

    return () => {
      window.clearTimeout(alignTimeout);
      window.removeEventListener("hashchange", alignPhotographyHash);
    };
  }, []);

  useEffect(() => {
    const selectedTripIndex = activeTrip
      ? trips.findIndex((trip) => trip.id === activeTrip.id)
      : currentTripIndex;
    const targetTripIndex = selectedTripIndex >= 0 ? selectedTripIndex : currentTripIndex;

    if (isMobile) {
      const activeRailItem = mobileRailRef.current?.querySelector<HTMLElement>(
        `[data-mobile-trip-index="${targetTripIndex}"]`
      );
      activeRailItem?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      return;
    }

    if (!desktopRouteRailRef.current) return;

    const container = desktopRouteRailRef.current;
    const activeRouteItem = container.querySelector<HTMLElement>(
      `[data-desktop-trip-index="${targetTripIndex}"]`
    );
    if (!activeRouteItem) return;

    const containerRect = container.getBoundingClientRect();
    const activeRouteItemRect = activeRouteItem.getBoundingClientRect();
    const targetLeft =
      container.scrollLeft +
      activeRouteItemRect.left -
      containerRect.left -
      (container.clientWidth - activeRouteItemRect.width) / 2;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    container.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScrollLeft)),
      behavior: "smooth",
    });
  }, [activeTrip, currentTripIndex, focusedTripId, isMobile]);

  const clearFocusTimeout = useCallback(() => {
    if (focusTimeoutRef.current !== null) {
      window.clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }
  }, []);

  const handleTripSelect = useCallback(
    (tripId: string) => {
      const trip = trips.find((item) => item.id === tripId);
      if (!trip) return;

      clearFocusTimeout();
      setIsManualGlobeControlActive(false);
      setFocusedTripId(tripId);
      setActiveTrip(trip);
      setCameraFocusKey((key) => key + 1);

      const tripIndex = trips.findIndex((item) => item.id === tripId);
      if (tripIndex >= 0) {
        setCurrentTripIndex(tripIndex);
        setScrollProgress(0);
      }

      if (isMobile) {
        return;
      }

      focusTimeoutRef.current = window.setTimeout(() => {
        setFocusedTripId(null);
        focusTimeoutRef.current = null;
      }, 2500);
    },
    [clearFocusTimeout, isMobile, setIsManualGlobeControlActive]
  );

  const handleGalleryOpen = useCallback(() => {
    if (activeTrip) {
      clearFocusTimeout();
      setFocusedTripId(activeTrip.id);
    }
    setIsGalleryOpen(true);
  }, [activeTrip, clearFocusTimeout]);

  const handleGalleryClose = useCallback(() => {
    setIsGalleryOpen(false);
    clearFocusTimeout();
    setFocusedTripId(null);
  }, [clearFocusTimeout]);

  useEffect(() => () => clearFocusTimeout(), [clearFocusTimeout]);

  const sectionHeight = "100vh";
  const activeTripIndex = Math.max(
    0,
    activeTrip ? trips.findIndex((trip) => trip.id === activeTrip.id) : currentTripIndex
  );
  const activeFrameCount =
    activeTrip?.albums.reduce((sum, album) => sum + album.photos.length, 0) ?? 0;
  const canGoPrevious = activeTripIndex > 0;
  const canGoNext = activeTripIndex < trips.length - 1;

  const handleTripStep = useCallback(
    (direction: -1 | 1) => {
      if (!hasTrips) return;

      const nextIndex = Math.min(trips.length - 1, Math.max(0, activeTripIndex + direction));
      const nextTrip = trips[nextIndex];
      if (nextTrip) {
        handleTripSelect(nextTrip.id);
      }
    },
    [activeTripIndex, handleTripSelect, hasTrips]
  );

  return (
    <section
      ref={sectionRef}
      id="photography"
      className="relative scroll-mt-24 bg-background md:scroll-mt-0"
      style={!isMobile ? { height: sectionHeight } : undefined}
    >
      <div
        className={`overflow-hidden border-b border-line ${
          isMobile ? "relative min-h-[calc(100svh-6rem)]" : "sticky top-0 h-[100dvh]"
        }`}
      >
        {isMobile ? (
          <PhotographyMobileExperience
            hasTrips={hasTrips}
            totals={totals}
            activeTrip={activeTrip}
            activeTripIndex={activeTripIndex}
            activeFrameCount={activeFrameCount}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            mobileRailRef={mobileRailRef}
            onTripSelect={handleTripSelect}
            onPreviousDestination={() => handleTripStep(-1)}
            onNextDestination={() => handleTripStep(1)}
            onOpenGallery={handleGalleryOpen}
            onEarthLoad={() => setEarthLoaded(true)}
          />
        ) : (
          <PhotographyDesktopExperience
            hasTrips={hasTrips}
            totals={totals}
            activeTrip={activeTrip}
            currentTripIndex={currentTripIndex}
            scrollProgress={scrollProgress}
            cameraFocusKey={cameraFocusKey}
            desktopRouteRailRef={desktopRouteRailRef}
            visibleLabelId={visibleLabelId}
            isManualGlobeControlActive={isManualGlobeControlActive}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            onEarthLoad={() => setEarthLoaded(true)}
            onManualGlobeControlStart={handleManualGlobeControlStart}
            onManualGlobeControlEnd={handleManualGlobeControlEnd}
            onTripSelect={handleTripSelect}
            onPreviousDestination={() => handleTripStep(-1)}
            onNextDestination={() => handleTripStep(1)}
            onGalleryOpen={handleGalleryOpen}
          />
        )}

        {!earthLoaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90">
            <div className="w-full max-w-sm px-6 text-center">
              <p className="eyebrow text-accent">Loading globe</p>
              <div className="mt-5 h-px overflow-hidden bg-line">
                <div className="h-full animate-shimmer bg-accent" />
              </div>
              <p className="mt-5 text-sm text-secondary">Preparing destinations and map texture.</p>
            </div>
          </div>
        )}

        {activeTrip && (
          <AlbumGallery
            key={activeTrip.id}
            trip={activeTrip}
            isOpen={isGalleryOpen}
            onClose={handleGalleryClose}
          />
        )}
      </div>
    </section>
  );
}
