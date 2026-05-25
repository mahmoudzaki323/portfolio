import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Aperture, Calendar, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Album, Photo, Trip } from "../../data/trips";

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
}: {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrev) onPrev();
      if (event.key === "ArrowRight" && hasNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto p-3 pt-16 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        aria-label="Close photo"
        className="absolute inset-0 h-full w-full bg-background/88"
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        className="icon-action focus-ring absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center border border-line bg-background md:right-6 md:top-6"
        aria-label="Close photo"
      >
        <X className="h-5 w-5" />
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="icon-action focus-ring absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-line bg-background md:left-6"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={onNext}
          className="icon-action focus-ring absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-line bg-background md:right-6"
          aria-label="Next photo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div className="relative z-10 grid max-h-full w-full max-w-6xl gap-4">
        <img
          src={photo.url}
          alt={photo.caption}
          className="mx-auto max-h-[54dvh] w-auto border border-line object-contain md:max-h-[64dvh]"
        />

        <div className="glass-panel-soft p-5">
          <h3 className="text-xl font-semibold text-primary">{photo.caption}</h3>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-secondary">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              {photo.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              {photo.date}
            </span>
            {photo.camera && (
              <span className="inline-flex items-center gap-2">
                <Aperture className="h-4 w-4 text-accent" />
                {photo.camera}
              </span>
            )}
          </div>
          {photo.settings && (
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs text-tertiary">
              {photo.settings.aperture && <span>{photo.settings.aperture}</span>}
              {photo.settings.shutter && <span>{photo.settings.shutter}</span>}
              {photo.settings.iso && <span>ISO {photo.settings.iso}</span>}
              {photo.settings.focalLength && <span>{photo.settings.focalLength}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlbumGallery({ trip, isOpen, onClose }: AlbumGalleryProps) {
  const [activeAlbum, setActiveAlbum] = useState<Album>(trip.albums[0]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const allPhotos = useMemo(() => trip.albums.flatMap((album) => album.photos), [trip.albums]);
  const currentPhoto = allPhotos[activePhotoIndex];

  const closeGallery = useCallback(() => {
    setIsPhotoModalOpen(false);
    setActiveAlbum(trip.albums[0]);
    setActivePhotoIndex(0);
    onClose();
  }, [onClose, trip.albums]);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPhotoModalOpen) closeGallery();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeGallery, isOpen, isPhotoModalOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 md:p-8">
      <button
        type="button"
        aria-label="Close gallery"
        className="absolute inset-0 h-full w-full bg-background/76 backdrop-blur-sm transition-colors hover:bg-background/82"
        onClick={closeGallery}
      />

      <div
        className="relative z-10 flex max-h-[min(90dvh,58rem)] w-full max-w-6xl animate-[galleryIn_260ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden border border-line bg-background/96 shadow-[0_24px_90px_rgba(0,0,0,0.46)] md:max-h-[min(86dvh,58rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="album-gallery-title"
      >
        <div className="relative shrink-0 border-b border-line bg-background/98 p-3 pr-14 md:p-6">
          <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-start md:gap-5">
            <div className="min-w-0">
              <p className="eyebrow text-accent">{trip.country}</p>
              <h2 id="album-gallery-title" className="mt-1 text-xl font-semibold text-primary md:mt-2 md:text-3xl">
                {trip.name}
              </h2>
              <p className="mt-2 max-w-[64ch] overflow-hidden text-xs leading-5 text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:mt-3 md:text-sm md:leading-6">
                {activeAlbum.description}
              </p>
            </div>
            <button
              type="button"
              onClick={closeGallery}
              className="icon-action focus-ring absolute right-2 top-2 grid h-9 w-9 shrink-0 place-items-center border border-line bg-background md:static md:h-11 md:w-11"
              aria-label="Close gallery"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto md:mt-5">
            {trip.albums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setActiveAlbum(album)}
                className={cn(
                  "focus-ring whitespace-nowrap border px-3 py-1.5 text-xs transition-colors md:px-4 md:py-2 md:text-sm",
                  activeAlbum.id === album.id
                    ? "border-accent bg-accent text-ink"
                    : "border-line text-secondary hover:border-accent/70 hover:text-primary"
                )}
              >
                {album.title}
              </button>
            ))}
          </div>
        </div>

        <div className="trip-scroll flex-1 overflow-y-auto overscroll-contain p-2.5 md:p-6">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 xl:grid-cols-4">
            {activeAlbum.photos.map((photo, index) => {
              const photoIndex = allPhotos.findIndex((item) => item.id === photo.id);

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => {
                    setActivePhotoIndex(photoIndex);
                    setIsPhotoModalOpen(true);
                  }}
                  className={cn(
                    "focus-ring group relative aspect-[4/5] overflow-hidden border border-line bg-surface text-left",
                    index % 7 === 0 && "md:col-span-2 md:aspect-[16/10]"
                  )}
                >
                  <img
                    src={photo.thumbnail}
                    alt={photo.caption}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="truncate text-sm font-medium text-primary">{photo.caption}</p>
                    <p className="mt-1 truncate text-xs text-secondary">{photo.location}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {currentPhoto && (
        <PhotoModal
          photo={currentPhoto}
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onPrev={() => setActivePhotoIndex(Math.max(0, activePhotoIndex - 1))}
          onNext={() => setActivePhotoIndex(Math.min(allPhotos.length - 1, activePhotoIndex + 1))}
          hasPrev={activePhotoIndex > 0}
          hasNext={activePhotoIndex < allPhotos.length - 1}
        />
      )}
    </div>,
    document.body
  );
}
