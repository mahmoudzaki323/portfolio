import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Aperture } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Trip, Album, Photo } from "../../data/trips";

interface AlbumGalleryProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

function PhotoModal({
  photo,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  tripColor,
}: {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  tripColor: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen, photo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Navigation */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Image container */}
      <div className="relative max-w-6xl w-full max-h-[85vh] flex flex-col">
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
        />

        {/* Info panel */}
        <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-display font-medium mb-3">{photo.caption}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" style={{ color: tripColor }} />
              {photo.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" style={{ color: tripColor }} />
              {photo.date}
            </span>
            {photo.camera && (
              <span className="flex items-center gap-1.5">
                <Aperture className="w-4 h-4" style={{ color: tripColor }} />
                {photo.camera}
              </span>
            )}
          </div>
          {photo.settings && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
              {photo.settings.aperture && (
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40">{photo.settings.aperture}</span>
              )}
              {photo.settings.shutter && (
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40">{photo.settings.shutter}</span>
              )}
              {photo.settings.iso && (
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40">ISO {photo.settings.iso}</span>
              )}
              {photo.settings.focalLength && (
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40">{photo.settings.focalLength}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlbumGallery({ trip, isOpen, onClose }: AlbumGalleryProps) {
  const [activeAlbum, setActiveAlbum] = useState<Album>(trip.albums[0]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!galleryRef.current || !isOpen) return;

    gsap.fromTo(
      galleryRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [isOpen]);

  if (!isOpen) return null;

  const allPhotos = trip.albums.flatMap((album) => album.photos);
  const currentPhoto = allPhotos[activePhotoIndex];

  return (
    <div
      ref={galleryRef}
      className="absolute inset-y-0 right-0 w-full md:w-[520px] bg-background/90 backdrop-blur-2xl border-l border-white/10 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 p-6 bg-background/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-display font-semibold tracking-tight">{trip.name}</h2>
            <p className="text-sm text-white/40 font-mono">{trip.country}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Album tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {trip.albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setActiveAlbum(album)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-300",
                activeAlbum.id === album.id
                  ? "text-black"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-white/10"
              )}
              style={{
                backgroundColor: activeAlbum.id === album.id ? trip.color : undefined,
              }}
            >
              {album.title}
            </button>
          ))}
        </div>
      </div>

      {/* Album info */}
      <div className="p-6">
        <p className="text-white/50 mb-6 text-sm leading-relaxed">{activeAlbum.description}</p>

        {/* Photo grid */}
        <div className="grid grid-cols-2 gap-3">
          {activeAlbum.photos.map((photo, idx) => {
            const photoIndex = allPhotos.findIndex((p) => p.id === photo.id);
            return (
              <button
                key={photo.id}
                onClick={() => {
                  setActivePhotoIndex(photoIndex);
                  setIsPhotoModalOpen(true);
                }}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden group",
                  idx === 0 && "col-span-2 aspect-[2/1]"
                )}
              >
                <img
                  src={photo.thumbnail}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-medium truncate">{photo.caption}</p>
                    <p className="text-xs text-white/60">{photo.location}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo modal */}
      {currentPhoto && (
        <PhotoModal
          photo={currentPhoto}
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onPrev={() => setActivePhotoIndex(Math.max(0, activePhotoIndex - 1))}
          onNext={() => setActivePhotoIndex(Math.min(allPhotos.length - 1, activePhotoIndex + 1))}
          hasPrev={activePhotoIndex > 0}
          hasNext={activePhotoIndex < allPhotos.length - 1}
          tripColor={trip.color}
        />
      )}
    </div>
  );
}
