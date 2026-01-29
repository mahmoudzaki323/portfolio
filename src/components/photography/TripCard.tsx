import { useRef, useEffect } from "react";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
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

export function TripCard({ trip, isActive, isFocused, index, onClick, progress }: TripCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Apply glow effect via CSS custom property
  useEffect(() => {
    if (cardRef.current && isActive) {
      cardRef.current.style.setProperty("--trip-color", trip.color);
    }
  }, [isActive, trip.color]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative group cursor-pointer transition-all duration-500 ease-out",
        "rounded-2xl overflow-hidden",
        isActive ? "z-10" : "z-0",
        isActive && "trip-card-active"
      )}
      onClick={onClick}
      style={{
        opacity: isActive ? 1 : 0.35,
        transform: `translateX(${isActive ? 0 : -8}px) scale(${isActive ? 1 : 0.98})`,
      }}
    >
      {/* Card background with glass effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl overflow-hidden transition-all duration-500",
          isActive 
            ? "bg-white/[0.06] border border-white/[0.12]" 
            : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
        )}
      >
        {/* Progress bar at bottom */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-150 ease-out"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: trip.color,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 w-full h-[2px] opacity-60"
          style={{
            background: isActive
              ? `linear-gradient(90deg, ${trip.color} 0%, transparent 100%)`
              : "transparent",
          }}
        />

        {/* Glow effect for active state */}
        {isActive && (
          <div
            className="absolute -inset-px rounded-2xl opacity-20 blur-sm pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 50%, ${trip.color}40 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Focus indicator */}
        {isFocused && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="relative p-5 flex gap-4">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={trip.thumbnail}
            alt={trip.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          {/* Color overlay */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{ backgroundColor: trip.color }}
          />
          {/* Index badge */}
          <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[10px] font-mono font-medium text-white/80">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: trip.color }}
            >
              {trip.country}
            </span>
            {isActive && (
              <ArrowUpRight className="w-3 h-3 text-white/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </div>

          <h3 className="text-lg font-display font-semibold text-white mb-1 truncate tracking-tight">
            {trip.name}
          </h3>

          <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {trip.coordinates.lat.toFixed(2)}°, {trip.coordinates.lng.toFixed(2)}°
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDateRange(trip.dateRange.start, trip.dateRange.end)}
            </span>
          </div>

          <p className="text-xs text-white/30 line-clamp-2 leading-relaxed">
            {trip.description}
          </p>

          {/* Album count */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-white/25 font-mono">
              {trip.albums.length} album{trip.albums.length !== 1 ? "s" : ""}
            </span>
            <div
              className="h-px flex-1 transition-all duration-500"
              style={{
                background: isActive
                  ? `linear-gradient(90deg, ${trip.color}40 0%, transparent 100%)`
                  : "transparent",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
