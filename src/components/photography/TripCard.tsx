import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { cn, formatDateRange } from "../../lib/utils";
import type { Trip } from "../../data/trips";

interface TripCardProps {
  trip: Trip;
  isActive: boolean;
  isFocused?: boolean;
  index: number;
  onClick: () => void;
  progress: number;
}

function coordinateLabel(value: number, axis: "lat" | "lng") {
  const suffix = axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  return `${Math.abs(value).toFixed(2)} ${suffix}`;
}

export function TripCard({ trip, isActive, isFocused, index, onClick, progress }: TripCardProps) {
  const frameCount = trip.albums.reduce((sum, album) => sum + album.photos.length, 0);

  return (
    <button
      type="button"
      data-trip-index={index}
      onClick={onClick}
      className={cn(
        "focus-ring group block w-full py-4 text-left transition duration-300",
        isActive ? "opacity-100" : "opacity-55 hover:opacity-85"
      )}
      style={{
        transform: isActive ? "translate3d(0, 0, 0)" : "translate3d(-0.25rem, 0, 0)",
      }}
    >
      <div
        className={cn(
          "relative grid grid-cols-[3rem_5rem_1fr] gap-4 overflow-hidden pr-3",
          isActive && "pl-3"
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-px bg-line transition-colors duration-300",
            isActive && "bg-accent"
          )}
        />
        <div
          className="absolute bottom-0 left-0 h-px bg-accent transition-[width] duration-150"
          style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }}
        />

        <div className="mono-tabular pt-1 text-sm text-tertiary">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="relative aspect-square overflow-hidden border border-line bg-surface">
          <img
            src={trip.thumbnail}
            alt={`${trip.name} photography thumbnail`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
          <div className={cn("absolute inset-0 bg-background/20", isFocused && "animate-pulse")} />
        </div>

        <div className="min-w-0">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className={cn("text-lg font-medium", isActive ? "text-primary" : "text-secondary")}>
              {trip.name}
            </p>
            <ArrowUpRight
              className={cn(
                "h-4 w-4 shrink-0 transition duration-300",
                isActive ? "text-accent" : "text-tertiary group-hover:text-accent"
              )}
            />
          </div>

          <p className="text-xs text-accent/85">{trip.country}</p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {coordinateLabel(trip.coordinates.lat, "lat")},{" "}
              {coordinateLabel(trip.coordinates.lng, "lng")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatDateRange(trip.dateRange.start, trip.dateRange.end)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-tertiary">
            <span>{trip.albums.length} albums</span>
            <span>{frameCount} frames</span>
          </div>
        </div>
      </div>
    </button>
  );
}
