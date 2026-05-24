import { Camera, ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { RefObject } from "react";
import { EarthScene } from "../earth/EarthScene";
import { trips, type Trip } from "../../data/trips";
import { cn, formatDateRange } from "../../lib/utils";

interface PhotographyMobileExperienceProps {
  hasTrips: boolean;
  totals: {
    albums: number;
    frames: number;
  };
  activeTrip: Trip | null;
  activeTripIndex: number;
  activeFrameCount: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  mobileRailRef: RefObject<HTMLDivElement | null>;
  onTripSelect: (tripId: string) => void;
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
  canGoPrevious,
  canGoNext,
  mobileRailRef,
  onTripSelect,
  onPreviousDestination,
  onNextDestination,
  onOpenGallery,
  onEarthLoad,
}: PhotographyMobileExperienceProps) {
  const totalDestinations = trips.length;
  const albumCount = activeTrip?.albums.length ?? 0;

  return (
    <div className="relative z-20 min-h-[calc(100svh-6rem)] overflow-hidden">
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-44 top-16 overflow-hidden">
          <EarthScene
            activeTrip={activeTrip}
            isOverview={false}
            currentTripIndex={activeTripIndex}
            onLoad={onEarthLoad}
            isManualControlActive={false}
            manualControlsEnabled={false}
            holdFocus
          />
        </div>
        <div className="mobile-map-scrim pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-background/42 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-36 h-40 bg-gradient-to-b from-transparent via-background/86 to-background" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-background" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-site flex-col justify-between px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3">
        <div className="pointer-events-none flex justify-center">
          <div className="glass-panel-soft flex items-center gap-2 px-3 py-2">
            <div className="flex items-center gap-2 text-accent">
              <Camera className="h-4 w-4" />
              <p className="eyebrow">Photography</p>
            </div>
            <p className="text-[11px] text-secondary">{totals.frames} frames</p>
          </div>
        </div>

        <section className="pointer-events-auto relative overflow-hidden border border-line bg-background/94 px-3 py-3 shadow-2xl shadow-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/84">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
          {hasTrips && activeTrip ? (
            <>
              <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem_2.75rem] items-center gap-2">
                <button
                  type="button"
                  onClick={onPreviousDestination}
                  disabled={!canGoPrevious}
                  aria-label="Previous destination"
                  className={cn(
                    "focus-ring grid h-11 w-11 place-items-center border transition active:translate-y-px",
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
                  <h2 className="mt-0.5 truncate text-base font-semibold leading-tight text-primary">
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
                    "focus-ring grid h-11 w-11 place-items-center border transition active:translate-y-px",
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
                  className="action-primary focus-ring grid h-11 w-11 place-items-center text-accent-foreground"
                >
                  <Images className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 border-t border-line pt-2 text-[10px] text-secondary">
                <div className="min-w-0 truncate">
                  {pluralize(albumCount, "album")} / {activeFrameCount} frames
                </div>
                <div className="mono-tabular shrink-0 text-tertiary">{totalDestinations} places</div>
              </div>

              <div className="mt-2">
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
                        onClick={() => onTripSelect(trip.id)}
                        className={cn(
                          "focus-ring flex h-9 min-w-[6.5rem] snap-center items-center gap-2 border px-2 text-left transition active:translate-y-px",
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
  );
}
