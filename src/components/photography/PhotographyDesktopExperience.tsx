import type { RefObject } from "react";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Images,
  MapPin,
  Play,
} from "lucide-react";
import { EarthScene } from "../earth/EarthScene";
import { trips as defaultTrips, type Trip } from "../../data/trips";
import { cn, formatDateRange } from "../../lib/utils";

interface PhotographyTotals {
  albums: number;
  frames: number;
}

interface PhotographyDesktopExperienceProps {
  trips?: Trip[];
  hasTrips: boolean;
  totals: PhotographyTotals;
  activeTrip: Trip | null;
  currentTripIndex: number;
  scrollProgress: number;
  cameraFocusKey: number;
  desktopRouteRailRef: RefObject<HTMLDivElement | null>;
  visibleLabelId?: string | null;
  isManualGlobeControlActive?: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onEarthLoad?: () => void;
  onManualGlobeControlStart?: () => void;
  onManualGlobeControlEnd?: () => void;
  onTripSelect: (tripId: string) => void;
  onPreviousDestination: () => void;
  onNextDestination: () => void;
  onGalleryOpen: () => void;
}

function frameCountForTrip(trip: Trip) {
  return trip.albums.reduce((sum, album) => sum + album.photos.length, 0);
}

function formatRoutePosition(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function PhotographyDesktopExperience({
  trips = defaultTrips,
  hasTrips,
  totals,
  activeTrip,
  currentTripIndex,
  scrollProgress,
  cameraFocusKey,
  desktopRouteRailRef,
  visibleLabelId,
  isManualGlobeControlActive = false,
  canGoPrevious,
  canGoNext,
  onEarthLoad,
  onManualGlobeControlStart,
  onManualGlobeControlEnd,
  onTripSelect,
  onPreviousDestination,
  onNextDestination,
  onGalleryOpen,
}: PhotographyDesktopExperienceProps) {
  const activeTripIndex = Math.max(
    0,
    activeTrip ? trips.findIndex((trip) => trip.id === activeTrip.id) : currentTripIndex
  );
  const routeSegmentCount = Math.max(trips.length - 1, 1);
  const routeProgress = hasTrips
    ? Math.min(1, Math.max(0, (currentTripIndex + scrollProgress) / routeSegmentCount))
    : 0;
  const selectedFrameCount = activeTrip ? frameCountForTrip(activeTrip) : 0;
  const albumCount = activeTrip?.albums.length ?? 0;

  return (
    <>
      <div className="absolute inset-0 z-0">
        <EarthScene
          activeTrip={activeTrip}
          isOverview={false}
          currentTripIndex={currentTripIndex}
          scrollProgress={scrollProgress}
          visibleLabelId={visibleLabelId}
          onTripSelect={onTripSelect}
          onLoad={onEarthLoad}
          isManualControlActive={isManualGlobeControlActive}
          onManualControlStart={onManualGlobeControlStart}
          onManualControlEnd={onManualGlobeControlEnd}
          holdFocus
          freeExploreMode
          focusKey={cameraFocusKey}
        />
      </div>

      <div className="map-scrim pointer-events-none absolute inset-0 z-10 opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-background/95 via-background/54 to-transparent" />

      <div className="pointer-events-none relative z-20 mx-auto h-full max-w-site px-5 pt-28 md:px-8">
        <div className="pointer-events-auto flex items-start justify-between gap-4">
          <div className="glass-panel inline-flex max-w-[28rem] items-center gap-3 px-3 py-2">
            <Camera className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="eyebrow text-accent">Photography route</p>
              <p className="mt-1 truncate text-sm text-primary">
                {activeTrip?.name ?? "Select a destination"} / {hasTrips ? formatRoutePosition(activeTripIndex, trips.length) : "00 / 00"}
              </p>
            </div>
          </div>

          <div className="glass-panel hidden items-center gap-5 px-3 py-2 text-xs text-secondary lg:flex">
            <span>
              <span className="mono-tabular text-primary">{trips.length}</span> places
            </span>
            <span>
              <span className="mono-tabular text-primary">{totals.albums}</span> albums
            </span>
            <span>
              <span className="mono-tabular text-primary">{totals.frames}</span> frames
            </span>
          </div>
        </div>

        <div className="pointer-events-auto absolute inset-x-5 bottom-5 mx-auto max-w-site md:inset-x-8 md:bottom-6">
          <section className="glass-panel overflow-hidden p-3">
            <div className="grid items-center gap-3 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)_minmax(13rem,18rem)]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={onPreviousDestination}
                    disabled={!canGoPrevious}
                    aria-label="Previous destination"
                    className={cn(
                      "focus-ring grid h-9 w-9 place-items-center border transition active:translate-y-px",
                      canGoPrevious
                        ? "border-line bg-surface/70 text-primary hover:border-accent hover:text-accent"
                        : "border-line bg-surface/40 text-tertiary opacity-45"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onNextDestination}
                    disabled={!canGoNext}
                    aria-label="Next destination"
                    className={cn(
                      "focus-ring grid h-9 w-9 place-items-center border transition active:translate-y-px",
                      canGoNext
                        ? "border-line bg-surface/70 text-primary hover:border-accent hover:text-accent"
                        : "border-line bg-surface/40 text-tertiary opacity-45"
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-tertiary">
                    <Play className="h-3 w-3 fill-current text-accent" />
                    <span className="text-accent">Now viewing</span>
                    <span className="mono-tabular">
                      {hasTrips ? formatRoutePosition(activeTripIndex, trips.length) : "00 / 00"}
                    </span>
                  </div>
                  <h3 className="mt-0.5 truncate text-lg font-semibold leading-tight text-primary">
                    {activeTrip?.name ?? "No destination selected"}
                  </h3>
                  {activeTrip ? (
                    <p className="mt-0.5 truncate text-xs text-secondary">
                      {activeTrip.country} / {formatDateRange(activeTrip.dateRange.start, activeTrip.dateRange.end)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-3">
                  <div className="h-px min-w-20 flex-1 overflow-hidden bg-line">
                    <div
                      className="h-full bg-accent transition-[width] duration-150"
                      style={{ width: `${routeProgress * 100}%` }}
                    />
                  </div>
                  <span className="mono-tabular w-10 text-right text-xs text-accent">
                    {Math.round(routeProgress * 100)}%
                  </span>
                </div>

                <div
                  ref={desktopRouteRailRef}
                  className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto"
                  onWheelCapture={(event) => event.stopPropagation()}
                  onTouchMoveCapture={(event) => event.stopPropagation()}
                >
                  {hasTrips ? (
                    trips.map((trip, index) => {
                      const isActive = trip.id === activeTrip?.id;
                      const frameCount = frameCountForTrip(trip);

                      return (
                        <button
                          key={trip.id}
                          type="button"
                          data-desktop-trip-index={index}
                          onClick={() => onTripSelect(trip.id)}
                          className={cn(
                            "focus-ring group flex h-12 min-w-[10rem] snap-center items-center gap-2 border px-2 text-left transition duration-300 active:translate-y-px",
                            isActive
                              ? "border-accent bg-accent/10 text-primary"
                              : "border-line bg-surface/62 text-secondary hover:border-accent/70 hover:text-primary"
                          )}
                        >
                          <img
                            src={trip.thumbnail}
                            alt={`${trip.name} photography thumbnail`}
                            className="h-8 w-8 shrink-0 border border-line object-cover transition duration-500 group-hover:scale-[1.04]"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="mono-tabular text-[10px] text-accent">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="truncate text-xs font-semibold">{trip.name}</span>
                            </div>
                            <p className="mt-0.5 truncate text-[10px] text-tertiary">
                              {pluralize(trip.albums.length, "album")} / {frameCount} frames
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="w-full p-3 text-sm text-secondary">No albums loaded.</div>
                  )}
                </div>
              </div>

              {activeTrip ? (
                <button
                  type="button"
                  onClick={onGalleryOpen}
                  className="focus-ring group flex min-h-16 items-center justify-between gap-3 border border-line bg-surface/70 px-3 py-2 text-left transition duration-300 hover:border-accent active:translate-y-px"
                >
                  <div className="min-w-0">
                    <p className="eyebrow text-accent">Album</p>
                    <p className="mt-1 truncate text-sm font-semibold text-primary">
                      {pluralize(albumCount, "album")} / {selectedFrameCount} frames
                    </p>
                    {albumCount > 1 ? (
                      <p className="mt-0.5 truncate text-[11px] text-secondary">
                        Includes {activeTrip.albums.map((album) => album.title).slice(0, 2).join(", ")}
                      </p>
                    ) : (
                      <p className="mt-0.5 truncate text-[11px] text-secondary">
                        {activeTrip.albums[0]?.title ?? activeTrip.name}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent">
                    <Images className="h-4 w-4" />
                    Open
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </button>
              ) : (
                <div className="border border-line bg-surface/60 p-3 text-sm text-secondary">No destination selected.</div>
              )}
            </div>

            {activeTrip ? (
              <div className="mt-2 flex items-center gap-2 text-[10px] text-tertiary">
                <MapPin className="h-3 w-3 text-accent" />
                <span>{activeTrip.name}</span>
                <span className="text-line">/</span>
                <span>{pluralize(albumCount, "album")}</span>
                <span className="text-line">/</span>
                <span>{selectedFrameCount} frames</span>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
}
