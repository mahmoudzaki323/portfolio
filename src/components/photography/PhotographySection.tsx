import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EarthScene } from "../earth/EarthScene";
import { TripCard } from "./TripCard";
import { AlbumGallery } from "./AlbumGallery";
import { trips, type Trip } from "../../data/trips";
import { updateScrollState } from "../../lib/scrollState";
import { Camera, Globe, Compass, Images } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function PhotographySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activeTrip, setActiveTrip] = useState<Trip | null>(trips[0]);
  const [focusedTripId, setFocusedTripId] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [earthLoaded, setEarthLoaded] = useState(false);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Determine which location should show its label based on scroll position
  // Label shows when camera is close to that location (zoomed in phases)
  const visibleLabelId = useMemo(() => {
    // During first 20% of segment: show FROM location (zoomed in)
    if (scrollProgress < 0.2) {
      return trips[currentTripIndex]?.id || null;
    }
    // During last 20% of segment: show TO location (zoomed in)
    if (scrollProgress > 0.8) {
      const nextIndex = Math.min(currentTripIndex + 1, trips.length - 1);
      return trips[nextIndex]?.id || null;
    }
    // During travel (20% - 80%), don't show any label
    return null;
  }, [scrollProgress, currentTripIndex, trips]);

  // Determine if we're "zoomed in" on a city (for UI overlay purposes)
  const isZoomedIn = useMemo(() => {
    return scrollProgress < 0.2 || scrollProgress > 0.8;
  }, [scrollProgress]);

  // Store focusedTripId in ref to avoid recreating ScrollTrigger
  const focusedTripIdRef = useRef(focusedTripId);
  focusedTripIdRef.current = focusedTripId;

  // Setup GSAP ScrollTrigger for precise scroll sync
  useEffect(() => {
    if (!sectionRef.current) return;

    // Kill any existing trigger
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    const totalTrips = trips.length;
    const segmentCount = totalTrips - 1;

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = self.progress;

        // Update global scroll state FIRST (synchronous, for CameraController)
        updateScrollState(progress, segmentCount);

        // Map progress to segment for React state
        const exactSegment = progress * segmentCount;
        const segmentIndex = Math.floor(exactSegment);
        const clampedIndex = Math.min(segmentIndex, segmentCount - 1);
        const segmentProgress = exactSegment - clampedIndex;

        // Update React state (for UI components)
        setCurrentTripIndex(clampedIndex);
        setScrollProgress(segmentProgress);

        // Update active trip (use ref to avoid stale closure)
        if (!focusedTripIdRef.current) {
          const activeIndex = segmentProgress < 0.5 ? clampedIndex : Math.min(clampedIndex + 1, totalTrips - 1);
          setActiveTrip(trips[activeIndex]);
        }
      },
    });

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Scroll sidebar cards to keep active card visible
  useEffect(() => {
    if (!cardsContainerRef.current || focusedTripId) return;

    const container = cardsContainerRef.current;
    const cardHeight = 160;
    const containerHeight = container.clientHeight;
    const targetScroll = currentTripIndex * cardHeight - containerHeight / 2 + cardHeight / 2;

    gsap.to(container, {
      scrollTop: Math.max(0, targetScroll),
      duration: 0.6,
      ease: "power2.out",
    });
  }, [currentTripIndex, focusedTripId]);

  // Click on trip card - fly to that location
  const handleTripSelect = useCallback((tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    setFocusedTripId(tripId);
    setActiveTrip(trip);

    // Scroll page to align with this trip
    const tripIndex = trips.findIndex((t) => t.id === tripId);
    if (sectionRef.current && scrollTriggerRef.current && tripIndex >= 0) {
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      // Scroll to the START of this trip's segment (or beginning for first trip)
      const targetProgress = tripIndex === 0 ? 0 : (tripIndex - 0.5) / (trips.length - 1);
      const targetScroll = sectionRef.current.offsetTop + sectionHeight * Math.max(0, targetProgress);

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }

    // Clear focus after animation
    setTimeout(() => {
      setFocusedTripId(null);
    }, 3000);
  }, []);

  const handleGalleryOpen = useCallback(() => {
    setIsGalleryOpen(true);
  }, []);

  const handleGalleryClose = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  // Total section height: longer scroll for smoother, more cinematic transitions
  // ~180vh per trip ensures unhurried, comfortable journey
  const sectionHeight = `${100 + trips.length * 180}vh`;

  return (
    <section ref={sectionRef} id="photography" className="relative" style={{ height: sectionHeight }}>
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Earth background */}
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

        {/* Dark overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 h-full flex">
          {/* Left panel - Trip cards */}
          <div className="w-full md:w-[480px] h-full flex flex-col p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-6 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <Camera className="w-5 h-5 text-white/70" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
                  Photography
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-2 tracking-tight">
                Through the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                  Lens
                </span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                Scroll to travel the globe or click a destination to explore.
              </p>
            </div>

            {/* Trip cards - scrollable */}
            <div
              ref={cardsContainerRef}
              className="flex-1 overflow-y-auto trip-scroll space-y-3 pr-3 -mr-3"
            >
              {trips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  isActive={trip.id === activeTrip?.id}
                  isFocused={trip.id === focusedTripId}
                  index={index}
                  onClick={() => handleTripSelect(trip.id)}
                  progress={trip.id === activeTrip?.id ? scrollProgress : 0}
                />
              ))}
            </div>

            {/* Footer stats */}
            <div className="mt-6 pt-5 border-t border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white/40">
                  <Globe className="w-4 h-4" />
                  <span className="font-mono">{trips.length} destinations</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Compass className="w-4 h-4" />
                  <span className="font-mono">
                    {trips.reduce((acc, t) => acc + t.albums.length, 0)} albums
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Album preview when zoomed in */}
          <div className="hidden md:flex flex-1 items-center justify-end p-10">
            <div
              className="transition-all duration-700 ease-out"
              style={{
                opacity: isZoomedIn && !isGalleryOpen ? 1 : 0,
                transform: isZoomedIn && !isGalleryOpen ? "translateX(0)" : "translateX(30px)",
                pointerEvents: isZoomedIn && !isGalleryOpen ? "auto" : "none",
              }}
            >
              {activeTrip && (
                <button
                  onClick={handleGalleryOpen}
                  className="group relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${activeTrip.color}20` }}
                    >
                      <Images className="w-6 h-6" style={{ color: activeTrip.color }} />
                    </div>
                    <div>
                      <p className="text-lg font-display font-semibold">{activeTrip.name}</p>
                      <p className="text-sm text-white/40">{activeTrip.albums.length} albums</p>
                    </div>
                  </div>

                  {/* Album thumbnails grid */}
                  <div className="grid grid-cols-2 gap-2 w-64">
                    {activeTrip.albums.slice(0, 4).map((album) => (
                      <div key={album.id} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-white/30 text-center">Click to explore albums</p>
                </button>
              )}
            </div>

            {/* Progress indicator */}
            <div
              className="absolute bottom-10 right-10 text-right pointer-events-none"
              style={{
                opacity: isZoomedIn ? 0.5 : 0.1,
              }}
            >
              <p className="text-[100px] leading-none font-display font-bold text-white/[0.05] tracking-tighter">
                {String(currentTripIndex + 1).padStart(2, "0")}
              </p>
              <p className="text-sm text-white/20 -mt-3 font-mono">
                / {String(trips.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Album Gallery Overlay */}
        {activeTrip && (
          <AlbumGallery
            trip={activeTrip}
            isOpen={isGalleryOpen}
            onClose={handleGalleryClose}
          />
        )}

        {/* Loading indicator */}
        {!earthLoaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-sm text-white/50 font-mono">Initializing 3D Earth...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
