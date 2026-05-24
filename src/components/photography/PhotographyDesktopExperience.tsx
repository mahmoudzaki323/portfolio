import {
  useCallback,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
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

interface SelectionAnchor {
  x: number;
  y: number;
}

interface TripSelectOptions {
  keepManualControl?: boolean;
  anchor?: SelectionAnchor;
  anchorMode?: "point" | "marker";
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
  isSelectionCardVisible?: boolean;
  selectionAnchor?: SelectionAnchor | null;
  isManualGlobeControlActive?: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onEarthLoad?: () => void;
  onActiveTripAnchorChange?: (anchor: SelectionAnchor) => void;
  onManualGlobeControlStart?: () => void;
  onManualGlobeControlEnd?: () => void;
  onTripSelect: (tripId: string, options?: TripSelectOptions) => void;
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
  isSelectionCardVisible = false,
  selectionAnchor = null,
  isManualGlobeControlActive = false,
  canGoPrevious,
  canGoNext,
  onEarthLoad,
  onActiveTripAnchorChange,
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
  const popupWidth = 256;
  const popupHeight = 70;
  const popupGap = 10;
  const popupTopInset = 96;
  const viewportWidth = typeof window === "undefined" ? 1280 : window.innerWidth;
  const popupLeft = selectionAnchor
    ? Math.min(
        viewportWidth - popupWidth / 2 - 16,
        Math.max(popupWidth / 2 + 16, selectionAnchor.x)
      )
    : 0;
  const popupTop = selectionAnchor
    ? Math.max(popupTopInset + popupHeight + popupGap, selectionAnchor.y)
    : 0;
  const railDragStateRef = useRef({
    isDragging: false,
    startX: 0,
    lastX: 0,
    hasMoved: false,
    lastTripId: null as string | null,
  });
  const suppressRailClickRef = useRef(false);

  const centerRailItem = useCallback(
    (tripId: string) => {
      const rail = desktopRouteRailRef.current;
      if (!rail) return;

      const railItem = rail.querySelector<HTMLElement>(
        `[data-desktop-trip-id="${tripId}"]`
      );
      if (!railItem) return;

      const railRect = rail.getBoundingClientRect();
      const railItemRect = railItem.getBoundingClientRect();
      const targetLeft =
        rail.scrollLeft +
        railItemRect.left -
        railRect.left -
        (rail.clientWidth - railItemRect.width) / 2;
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;

      rail.scrollTo({
        left: Math.max(0, Math.min(targetLeft, maxScrollLeft)),
        behavior: "smooth",
      });
    },
    [desktopRouteRailRef]
  );

  const selectTripFromRailPoint = useCallback(
    (clientX: number, clientY: number) => {
      const rail = desktopRouteRailRef.current;
      if (!rail) return;

      const railRect = rail.getBoundingClientRect();
      if (clientY < railRect.top - 14 || clientY > railRect.bottom + 14) return;

      const railItems = Array.from(
        rail.querySelectorAll<HTMLElement>("[data-desktop-trip-id]")
      );
      if (railItems.length === 0) return;

      const pointedElement = document.elementFromPoint(clientX, clientY);
      const directRailItem =
        pointedElement instanceof Element
          ? pointedElement.closest<HTMLElement>("[data-desktop-trip-id]")
          : null;
      const selectedItem =
        directRailItem && rail.contains(directRailItem)
          ? directRailItem
          : railItems.reduce((closestItem, item) => {
              const itemRect = item.getBoundingClientRect();
              const itemCenter = itemRect.left + itemRect.width / 2;
              const closestRect = closestItem.getBoundingClientRect();
              const closestCenter = closestRect.left + closestRect.width / 2;

              return Math.abs(itemCenter - clientX) < Math.abs(closestCenter - clientX)
                ? item
                : closestItem;
            }, railItems[0]);

      const tripId = selectedItem.dataset.desktopTripId;
      if (!tripId) return;

      const dragState = railDragStateRef.current;
      if (tripId === dragState.lastTripId) return;

      dragState.lastTripId = tripId;
      onTripSelect(tripId, { anchorMode: "marker" });
    },
    [desktopRouteRailRef, onTripSelect]
  );

  const handleRailButtonClick = useCallback(
    (_event: ReactMouseEvent<HTMLButtonElement>, tripId: string) => {
      centerRailItem(tripId);
      onTripSelect(tripId, { anchorMode: "marker" });
    },
    [centerRailItem, onTripSelect]
  );

  const handleRailPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      const rail = desktopRouteRailRef.current;
      if (!rail) return;

      railDragStateRef.current = {
        isDragging: true,
        startX: event.clientX,
        lastX: event.clientX,
        hasMoved: false,
        lastTripId: activeTrip?.id ?? null,
      };
      suppressRailClickRef.current = false;
      rail.setPointerCapture(event.pointerId);
      selectTripFromRailPoint(event.clientX, event.clientY);
    },
    [activeTrip?.id, desktopRouteRailRef, selectTripFromRailPoint]
  );

  const handleRailPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dragState = railDragStateRef.current;
      if (!dragState.isDragging) return;

      const rail = desktopRouteRailRef.current;
      if (!rail) return;

      const deltaX = event.clientX - dragState.lastX;
      rail.scrollLeft -= deltaX;
      dragState.lastX = event.clientX;

      if (Math.abs(event.clientX - dragState.startX) > 4) {
        dragState.hasMoved = true;
        suppressRailClickRef.current = true;
      }

      selectTripFromRailPoint(event.clientX, event.clientY);
      event.preventDefault();
    },
    [desktopRouteRailRef, selectTripFromRailPoint]
  );

  const handleRailPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dragState = railDragStateRef.current;
      if (!dragState.isDragging) return;

      const rail = desktopRouteRailRef.current;
      dragState.isDragging = false;

      if (rail?.hasPointerCapture(event.pointerId)) {
        rail.releasePointerCapture(event.pointerId);
      }

      selectTripFromRailPoint(event.clientX, event.clientY);
      if (dragState.lastTripId) {
        centerRailItem(dragState.lastTripId);
      }

      if (dragState.hasMoved) {
        window.setTimeout(() => {
          suppressRailClickRef.current = false;
        }, 0);
      }
    },
    [centerRailItem, desktopRouteRailRef, selectTripFromRailPoint]
  );

  const handleRailClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressRailClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
  }, []);

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
          onActiveTripAnchorChange={onActiveTripAnchorChange}
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
        {activeTrip && isSelectionCardVisible && selectionAnchor ? (
          <div
            className="pointer-events-auto fixed z-40 w-64 -translate-x-1/2 -translate-y-[calc(100%+0.625rem)]"
            style={{ left: popupLeft, top: popupTop }}
          >
            <div className="glass-panel relative border border-white/10 bg-background/82 p-2 shadow-2xl shadow-background/45 backdrop-blur-xl">
              <div className="absolute bottom-[-5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-background/82" />
              <div className="relative flex items-center gap-2.5">
                <img
                  src={activeTrip.thumbnail}
                  alt={`${activeTrip.name} photography thumbnail`}
                  className="h-10 w-10 shrink-0 border border-line object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-accent">Location</p>
                  <h3 className="mt-0.5 truncate text-sm font-semibold leading-tight text-primary">
                    {activeTrip.name}
                  </h3>
                  <p className="truncate text-[10px] text-secondary">
                    {pluralize(albumCount, "album")} / {selectedFrameCount} frames
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onGalleryOpen}
                  aria-label={`Open ${activeTrip.name} gallery`}
                  className="focus-ring inline-flex h-8 shrink-0 items-center gap-1 border border-accent/60 bg-accent/14 px-2 text-[11px] font-semibold text-accent transition duration-300 hover:bg-accent hover:text-accent-foreground active:translate-y-px"
                >
                  Open
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

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
            <div className="grid items-center gap-3 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
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
                  className="no-scrollbar flex cursor-grab snap-x snap-mandatory select-none gap-2 overflow-x-auto active:cursor-grabbing"
                  onWheelCapture={(event) => event.stopPropagation()}
                  onTouchMoveCapture={(event) => event.stopPropagation()}
                  onPointerDown={handleRailPointerDown}
                  onPointerMove={handleRailPointerMove}
                  onPointerUp={handleRailPointerEnd}
                  onPointerCancel={handleRailPointerEnd}
                  onClickCapture={handleRailClickCapture}
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
                          data-desktop-trip-id={trip.id}
                          onClick={(event) => handleRailButtonClick(event, trip.id)}
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
                            draggable={false}
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

              {!activeTrip ? (
                <div className="border border-line bg-surface/60 p-3 text-sm text-secondary lg:col-span-2">
                  No destination selected.
                </div>
              ) : null}
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
