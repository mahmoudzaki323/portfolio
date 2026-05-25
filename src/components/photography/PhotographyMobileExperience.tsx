import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import type { RefObject } from "react";
import { EarthScene } from "../earth/EarthScene";
import { trips, type Trip } from "../../data/trips";
import { cn, formatDateRange } from "../../lib/utils";

interface SelectionAnchor {
  x: number;
  y: number;
}

interface TripSelectOptions {
  keepManualControl?: boolean;
  anchor?: SelectionAnchor;
  anchorMode?: "point" | "marker";
}

interface PhotographyMobileExperienceProps {
  hasTrips: boolean;
  totals: {
    albums: number;
    frames: number;
  };
  activeTrip: Trip | null;
  activeTripIndex: number;
  activeFrameCount: number;
  cameraFocusKey: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  mobileRailRef: RefObject<HTMLDivElement | null>;
  isSelectionCardVisible?: boolean;
  onTripSelect: (tripId: string, options?: TripSelectOptions) => void;
  onActiveTripAnchorChange?: (anchor: SelectionAnchor) => void;
  onPreviousDestination: () => void;
  onNextDestination: () => void;
  onOpenGallery: () => void;
  onEarthLoad?: () => void;
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatRoutePosition(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

export function PhotographyMobileExperience({
  hasTrips,
  totals,
  activeTrip,
  activeTripIndex,
  activeFrameCount,
  cameraFocusKey,
  canGoPrevious,
  canGoNext,
  mobileRailRef,
  isSelectionCardVisible = false,
  onTripSelect,
  onActiveTripAnchorChange,
  onPreviousDestination,
  onNextDestination,
  onOpenGallery,
  onEarthLoad,
}: PhotographyMobileExperienceProps) {
  const totalDestinations = trips.length;
  const albumCount = activeTrip?.albums.length ?? 0;

  return (
    <div className="relative z-20 min-h-[100svh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute inset-x-0 bottom-36 top-28 flex items-center justify-center overflow-visible">
          <div className="h-full w-full">
            <EarthScene
              activeTrip={activeTrip}
              isOverview={false}
              currentTripIndex={activeTripIndex}
              onTripSelect={onTripSelect}
              onActiveTripAnchorChange={onActiveTripAnchorChange}
              onLoad={onEarthLoad}
              isManualControlActive={false}
              manualControlsEnabled
              manualControlMode="horizontal"
              selectTripsWhileDragging={false}
              holdFocus
              focusKey={cameraFocusKey}
              focusDistanceMultiplier={5.35}
              focusElevationMultiplier={0.34}
            />
          </div>
        </div>
        <div className="mobile-map-scrim pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-background/42 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-36 h-40 bg-gradient-to-b from-transparent via-background/86 to-background" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-background" />
      </div>

      <div className="pointer-events-none relative mx-auto flex min-h-[100svh] w-full max-w-site flex-col justify-between px-3 pb-[max(3rem,env(safe-area-inset-bottom))] pt-24">
        <header className="pointer-events-none mx-auto w-full max-w-[22rem] text-center">
          <p className="eyebrow text-accent">03 / Photography</p>
          <h2 className="mt-1 font-display text-xl font-semibold leading-none text-primary">
            Photography
          </h2>
          <div className="mx-auto mt-2 grid max-w-xs grid-cols-3 divide-x divide-line border-y border-line text-[10px] text-secondary">
            <div className="px-2 py-1">
              <span className="mono-tabular text-primary">{String(totalDestinations).padStart(2, "0")}</span>
            </div>
            <div className="px-2 py-1">
              <span className="mono-tabular text-primary">{totals.albums}</span>
            </div>
            <div className="px-2 py-1">
              <span className="mono-tabular text-primary">{totals.frames}</span>
            </div>
          </div>
        </header>

        <div className="pointer-events-auto relative">
          {activeTrip && isSelectionCardVisible ? (
            <div
              data-location-popup
              className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-40 w-[min(15.5rem,calc(100vw-2rem))] -translate-x-1/2"
            >
              <button
                type="button"
                onClick={onOpenGallery}
                aria-label={`View ${activeTrip.name} album`}
                className="glass-panel focus-ring flex w-full items-center gap-2 border border-white/10 bg-background/88 p-2 text-left shadow-2xl shadow-background/55 backdrop-blur-xl transition active:translate-y-px"
              >
                <img
                  src={activeTrip.albums[0]?.coverImage ?? activeTrip.thumbnail}
                  alt={`${activeTrip.name} album preview`}
                  className="h-10 w-10 shrink-0 border border-line object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold leading-tight text-primary">
                    {activeTrip.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-secondary">
                    {pluralize(albumCount, "album")} / {activeFrameCount} frames
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-accent">
                    View album
                    <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
                  </span>
                </span>
              </button>
            </div>
          ) : null}

          <section className="relative overflow-hidden border border-line bg-background/94 px-2.5 py-2.5 shadow-2xl shadow-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/84">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
            {hasTrips && activeTrip ? (
              <>
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem_2.5rem] items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onPreviousDestination}
                    disabled={!canGoPrevious}
                    aria-label="Previous destination"
                    className={cn(
                      "focus-ring grid h-10 w-10 place-items-center border transition active:translate-y-px",
                      canGoPrevious
                        ? "border-line bg-surface text-primary"
                        : "border-line bg-surface text-tertiary opacity-40"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4 text-accent" />
                  </button>

                  <div className="min-w-0 text-center">
                    <div className="flex items-center justify-center gap-2 text-[10px] text-tertiary">
                      <span className="mono-tabular text-accent">{formatRoutePosition(activeTripIndex, totalDestinations)}</span>
                      <span>{formatDateRange(activeTrip.dateRange.start, activeTrip.dateRange.end)}</span>
                    </div>
                    <h2 className="mt-0.5 truncate text-sm font-semibold leading-tight text-primary">
                      {activeTrip.name}
                    </h2>
                    <p className="truncate text-[11px] text-secondary">{activeTrip.country}</p>
                  </div>

                  <button
                    type="button"
                    onClick={onNextDestination}
                    disabled={!canGoNext}
                    aria-label="Next destination"
                    className={cn(
                      "focus-ring grid h-10 w-10 place-items-center border transition active:translate-y-px",
                      canGoNext
                        ? "border-line bg-surface text-primary"
                        : "border-line bg-surface text-tertiary opacity-40"
                    )}
                  >
                    <ChevronRight className="h-4 w-4 text-accent" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenGallery}
                    aria-label="Open gallery"
                    className="action-primary focus-ring grid h-10 w-10 place-items-center text-accent-foreground"
                  >
                    <Images className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-line pt-1.5 text-[10px] text-secondary">
                  <div className="min-w-0 truncate">
                    {pluralize(albumCount, "album")} / {activeFrameCount} frames
                  </div>
                  <div className="mono-tabular shrink-0 text-tertiary">{totalDestinations} places</div>
                </div>

                <div className="mt-1.5">
                  <div
                    ref={mobileRailRef}
                    className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-0.5"
                  >
                    {trips.map((trip, index) => {
                      const isActive = trip.id === activeTrip.id;

                      return (
                        <button
                          key={trip.id}
                          type="button"
                          data-mobile-trip-index={index}
                          onClick={() => onTripSelect(trip.id, { anchorMode: "marker" })}
                          className={cn(
                            "focus-ring flex h-8 min-w-[6.25rem] snap-center items-center gap-1.5 border px-2 text-left transition active:translate-y-px",
                            isActive
                              ? "border-accent bg-accent/10 text-primary"
                              : "border-line bg-surface text-secondary"
                          )}
                        >
                          <span className="mono-tabular shrink-0 text-[10px] text-accent">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 truncate text-[11px] font-medium">{trip.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="px-2 py-4 text-sm leading-7 text-secondary">No albums loaded.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
