import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Camera, Globe2, Images, Map } from "lucide-react";
import { EarthScene } from "../earth/EarthScene";
import { TripCard } from "./TripCard";
import { AlbumGallery } from "./AlbumGallery";
import { trips, type Trip } from "../../data/trips";
import { updateScrollState } from "../../lib/scrollState";

gsap.registerPlugin(ScrollTrigger);

function coordinateLabel(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(4)} ${value >= 0 ? positive : negative}`;
}

export function PhotographySection() {
  const hasTrips = trips.length > 0;
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const focusTimeoutRef = useRef<number | null>(null);
  const lastScrollUiStateRef = useRef({
    currentTripIndex: 0,
    scrollProgress: 0,
    activeTripId: trips[0]?.id ?? null,
  });

  const [activeTrip, setActiveTrip] = useState<Trip | null>(trips[0] ?? null);
  const [focusedTripId, setFocusedTripId] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [earthLoaded, setEarthLoaded] = useState(false);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const focusedTripIdRef = useRef(focusedTripId);
  const isGalleryOpenRef = useRef(isGalleryOpen);

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

  const isZoomedIn = hasTrips && (focusedTripId !== null || scrollProgress < 0.22 || scrollProgress > 0.78);

  useEffect(() => {
    focusedTripIdRef.current = focusedTripId;
  }, [focusedTripId]);

  useEffect(() => {
    isGalleryOpenRef.current = isGalleryOpen;
  }, [isGalleryOpen]);

  useEffect(() => {
    if (!sectionRef.current || !hasTrips) return;

    ScrollTrigger.defaults({ markers: false });
    scrollTriggerRef.current?.kill();
    let resizeFrame = 0;

    const totalTrips = trips.length;
    const segmentCount = Math.max(totalTrips - 1, 1);

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.25,
      onUpdate: (self) => {
        const progress = self.progress;
        updateScrollState(progress, segmentCount);

        const exactSegment = progress * segmentCount;
        const segmentIndex = Math.floor(exactSegment);
        const clampedIndex = Math.min(segmentIndex, segmentCount - 1);
        const segmentProgress = exactSegment - clampedIndex;
        const activeIndex =
          segmentProgress < 0.5 ? clampedIndex : Math.min(clampedIndex + 1, totalTrips - 1);

        const nextUiState = {
          currentTripIndex: clampedIndex,
          scrollProgress: segmentProgress,
          activeTripId: trips[activeIndex]?.id ?? null,
        };
        const previousUiState = lastScrollUiStateRef.current;

        if (
          previousUiState.currentTripIndex !== nextUiState.currentTripIndex ||
          Math.abs(previousUiState.scrollProgress - nextUiState.scrollProgress) > 0.04
        ) {
          setCurrentTripIndex(nextUiState.currentTripIndex);
          setScrollProgress(nextUiState.scrollProgress);
        }

        if (
          !focusedTripIdRef.current &&
          !isGalleryOpenRef.current &&
          previousUiState.activeTripId !== nextUiState.activeTripId
        ) {
          setActiveTrip(trips[activeIndex]);
        }

        lastScrollUiStateRef.current = nextUiState;
      },
    });

    const handleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, [hasTrips]);

  useEffect(() => {
    if (!cardsContainerRef.current || focusedTripId) return;

    const container = cardsContainerRef.current;
    const activeCard = container.querySelector<HTMLElement>(`[data-trip-index="${currentTripIndex}"]`);
    activeCard?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentTripIndex, focusedTripId]);

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
      setFocusedTripId(tripId);
      setActiveTrip(trip);

      const tripIndex = trips.findIndex((item) => item.id === tripId);
      if (sectionRef.current && tripIndex >= 0) {
        const scrollableDistance = sectionRef.current.offsetHeight - window.innerHeight;
        const targetProgress = tripIndex === 0 ? 0 : (tripIndex - 0.45) / Math.max(trips.length - 1, 1);
        const targetScroll = sectionRef.current.offsetTop + scrollableDistance * Math.max(0, targetProgress);

        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }

      focusTimeoutRef.current = window.setTimeout(() => {
        setFocusedTripId(null);
        focusTimeoutRef.current = null;
      }, 2500);
    },
    [clearFocusTimeout]
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

  const sectionHeight = hasTrips ? `${120 + trips.length * 120}vh` : "100vh";

  return (
    <section ref={sectionRef} id="photography" className="relative bg-background" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden border-b border-line">
        <div className="absolute inset-0 z-0">
          <EarthScene
            activeTrip={activeTrip}
            isOverview={!focusedTripId}
            currentTripIndex={currentTripIndex}
            scrollProgress={scrollProgress}
            visibleLabelId={visibleLabelId}
            onTripSelect={handleTripSelect}
            onLoad={() => setEarthLoaded(true)}
          />
        </div>

        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,var(--color-background)_0%,rgba(8,10,9,0.9)_28%,rgba(8,10,9,0.18)_70%,rgba(8,10,9,0.68)_100%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <div className="relative z-20 mx-auto flex h-full max-w-site px-5 py-14 md:px-8 md:py-16">
          <aside className="flex h-full w-full max-w-[31rem] flex-col border-r border-line pr-0 md:pr-8">
            <div className="shrink-0 border-b border-line pb-5">
              <div className="mb-4 flex items-center gap-3 text-accent">
                <Camera className="h-5 w-5" />
                <p className="eyebrow">Photography archive</p>
              </div>
              <h2 className="max-w-[10ch] text-3xl font-semibold leading-tight text-primary md:text-4xl">
                Explore the world through my lens.
              </h2>
              <p className="mt-4 max-w-[42ch] text-sm leading-6 text-secondary">
                Scroll to move the camera, or choose a destination to open the
                album archive tied to that place.
              </p>

              <div className="mt-5 grid grid-cols-3 divide-x divide-line border-y border-line py-4">
                <div>
                  <p className="mono-tabular text-2xl text-primary">{trips.length}</p>
                  <p className="mt-1 text-xs text-tertiary">destinations</p>
                </div>
                <div className="pl-5">
                  <p className="mono-tabular text-2xl text-primary">{totals.frames}</p>
                  <p className="mt-1 text-xs text-tertiary">frames</p>
                </div>
                <div className="pl-5">
                  <p className="mono-tabular text-2xl text-primary">{totals.albums}</p>
                  <p className="mt-1 text-xs text-tertiary">albums</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs uppercase text-tertiary">
              <span>Destinations</span>
              <span className="text-accent">Scroll route</span>
            </div>

            <div
              ref={cardsContainerRef}
              className="trip-scroll mt-4 flex-1 overflow-y-auto overscroll-contain pr-3"
              onWheelCapture={(event) => event.stopPropagation()}
              onTouchMoveCapture={(event) => event.stopPropagation()}
            >
              <div className="divide-y divide-line">
                {hasTrips ? (
                  trips.map((trip, index) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      isActive={trip.id === activeTrip?.id}
                      isFocused={trip.id === focusedTripId}
                      index={index}
                      onClick={() => handleTripSelect(trip.id)}
                      progress={trip.id === activeTrip?.id ? scrollProgress : 0}
                    />
                  ))
                ) : (
                  <div className="glass-panel-soft p-6 text-sm leading-7 text-secondary">
                    Run the Instagram sync to populate this archive with local
                    photography.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex shrink-0 items-center gap-3 border-t border-line pt-4 text-sm text-secondary">
              <Map className="h-4 w-4 text-accent" />
              <span>Each pin is a chapter.</span>
            </div>

            {activeTrip && (
              <button
                type="button"
                onClick={handleGalleryOpen}
                className="glass-panel focus-ring mt-3 flex shrink-0 items-center justify-between gap-4 p-4 text-left transition duration-300 active:translate-y-px md:hidden"
              >
                <span>
                  <span className="block text-sm font-medium text-primary">Open {activeTrip.name} album</span>
                  <span className="mt-1 block text-xs text-tertiary">
                    {activeTrip.albums.length} album{activeTrip.albums.length === 1 ? "" : "s"}
                  </span>
                </span>
                <Images className="h-4 w-4 shrink-0 text-accent" />
              </button>
            )}
          </aside>

          <div className="hidden flex-1 items-end justify-end pb-14 md:flex">
            {activeTrip && (
              <button
                type="button"
                onClick={handleGalleryOpen}
                className="glass-panel focus-ring group w-[min(30rem,42vw)] p-5 text-left transition duration-500"
                style={{
                  opacity: hasTrips && isZoomedIn && !isGalleryOpen ? 1 : 0,
                  transform:
                    hasTrips && isZoomedIn && !isGalleryOpen
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(1.5rem, 0, 0)",
                  pointerEvents: hasTrips && isZoomedIn && !isGalleryOpen ? "auto" : "none",
                }}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="mono-tabular text-sm text-accent">
                      {String(currentTripIndex + 1).padStart(2, "0")} / {activeTrip.name}
                    </p>
                    <p className="mt-2 text-xs text-tertiary">
                      {coordinateLabel(activeTrip.coordinates.lat, "N", "S")},{" "}
                      {coordinateLabel(activeTrip.coordinates.lng, "E", "W")}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {activeTrip.albums.slice(0, 3).map((album, index) => (
                    <div key={album.id} className={index === 0 ? "col-span-2 row-span-2" : ""}>
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="aspect-square h-full w-full border border-line object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <span className="inline-flex items-center gap-2 text-sm text-primary">
                    <Images className="h-4 w-4 text-accent" />
                    View album
                  </span>
                  <span className="text-xs text-tertiary">
                    {activeTrip.albums.length} album{activeTrip.albums.length === 1 ? "" : "s"}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 text-tertiary lg:flex">
          <Globe2 className="h-5 w-5 text-accent" />
          <div className="h-28 w-px bg-line" />
          <span className="mono-tabular text-xs">
            {String(currentTripIndex + 1).padStart(2, "0")} / {String(trips.length).padStart(2, "0")}
          </span>
        </div>

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
