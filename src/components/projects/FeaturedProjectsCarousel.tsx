import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Project } from "../../data/projects";
import {
  getActiveSlideIndex,
  getCenteredSlideTranslate,
  getFeaturedCarouselHeight,
  getInterpolatedSlideVisualState,
  getNativeCarouselProgress,
  getPinnedCarouselSlideProgress,
} from "./carouselMath";

interface FeaturedProjectsCarouselProps {
  projects: Project[];
}

function LiveBadge() {
  return (
    <span className="live-project-badge absolute right-5 top-5 z-20 inline-flex items-center gap-2 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] md:right-6 md:top-6">
      <span aria-hidden="true" className="live-project-dot-wrap relative flex h-2.5 w-2.5">
        <span className="live-project-dot-ping absolute inline-flex h-full w-full animate-ping rounded-full" />
        <span className="live-project-dot relative inline-flex h-2.5 w-2.5 rounded-full" />
      </span>
      Live
    </span>
  );
}

export function FeaturedProjectsCarousel({ projects }: FeaturedProjectsCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track || projects.length <= 1) return;

    let frameId = 0;

    const updateCarousel = () => {
      const maxIndex = projects.length - 1;
      const slideProgress = getPinnedCarouselSlideProgress(progressRef.current, projects.length);
      const stagedProgress = maxIndex > 0 ? slideProgress / maxIndex : 0;
      const nextActiveIndex = getActiveSlideIndex(slideProgress, projects.length);
      const slides = Array.from(track.children) as HTMLElement[];
      const slideMetrics = slides.map((slide) => ({
        offsetLeft: slide.offsetLeft,
        width: slide.offsetWidth,
      }));
      const lowerIndex = Math.max(Math.floor(slideProgress), 0);
      const upperIndex = Math.min(Math.ceil(slideProgress), maxIndex);
      const localSlideProgress = slideProgress - lowerIndex;
      const lowerTranslate = getCenteredSlideTranslate(slideMetrics, section.clientWidth, lowerIndex);
      const upperTranslate = getCenteredSlideTranslate(slideMetrics, section.clientWidth, upperIndex);
      const targetTranslate = lowerTranslate + (upperTranslate - lowerTranslate) * localSlideProgress;

      track.style.transform = `translate3d(${-targetTranslate}px, 0, 0)`;
      section.style.setProperty("--carousel-progress", stagedProgress.toFixed(4));

      if (activeIndexRef.current !== nextActiveIndex) {
        activeIndexRef.current = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }

      slides.forEach((element, index) => {
        const visualState = getInterpolatedSlideVisualState(index, slideProgress);

        element.style.setProperty("--slide-blur", `${visualState.blur}px`);
        element.style.setProperty("--slide-opacity", `${visualState.opacity}`);
        element.style.setProperty("--slide-scale", `${visualState.scale}`);
      });
    };

    const renderCarouselFrame = () => {
      frameId = 0;
      updateCarousel();
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(renderCarouselFrame);
    };

    const setCarouselProgress = (progress: number, immediate = false) => {
      progressRef.current = progress;

      if (immediate) {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
        updateCarousel();
        return;
      }

      requestUpdate();
    };

    const syncProgressFromScroll = (immediate = false) => {
      const sectionRect = section.getBoundingClientRect();
      const nextProgress = getNativeCarouselProgress(
        sectionRect.top,
        sectionRect.height,
        window.innerHeight
      );

      setCarouselProgress(nextProgress, immediate);
    };

    const handleScroll = () => {
      syncProgressFromScroll();
    };

    const handleResize = () => {
      syncProgressFromScroll(true);
    };

    syncProgressFromScroll(true);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [projects.length]);

  const jumpToProject = (index: number) => {
    const section = sectionRef.current;
    if (!section || projects.length <= 1) return;

    const maxIndex = projects.length - 1;
    const targetIndex = Math.min(Math.max(index, 0), maxIndex);
    const targetProgress = targetIndex / maxIndex;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    activeIndexRef.current = targetIndex;
    setActiveIndex(targetIndex);

    window.scrollTo({
      top: sectionTop + scrollableDistance * targetProgress,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const canMoveBackward = activeIndex > 0;
  const canMoveForward = activeIndex < projects.length - 1;

  return (
    <section
      ref={sectionRef}
      className="featured-carousel-shell"
      style={{ height: getFeaturedCarouselHeight(projects.length) }}
      aria-label="Projects carousel"
    >
      <div className="featured-carousel-sticky">
        <div className="featured-carousel-header mb-5 flex items-center justify-between gap-5">
          <p className="eyebrow text-accent">Featured</p>
          <div className="featured-carousel-header-controls">
            <div className="featured-carousel-progress" aria-hidden="true">
              <span />
            </div>

            {projects.length > 1 && (
              <div className="featured-carousel-controls" aria-label="Featured project controls">
                <button
                  type="button"
                  className="featured-carousel-arrow focus-ring"
                  onClick={() => jumpToProject(activeIndex - 1)}
                  disabled={!canMoveBackward}
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                <div className="featured-carousel-tabs" aria-label="Featured projects">
                  {projects.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      aria-pressed={activeIndex === index}
                      aria-label={`Show ${project.title}`}
                      className={cn(
                        "featured-carousel-tab focus-ring",
                        activeIndex === index && "featured-carousel-tab-active"
                      )}
                      onClick={() => jumpToProject(index)}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="featured-carousel-arrow focus-ring"
                  onClick={() => jumpToProject(activeIndex + 1)}
                  disabled={!canMoveForward}
                  aria-label="Next project"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="featured-carousel-viewport">
          <div ref={trackRef} className="featured-carousel-track">
            {projects.map((project, index) => {
              const demoUrl = project.links.demo;
              const hasDemoUrl = Boolean(demoUrl);
              const isContainedImage = project.imageFit === "contain";

              return (
                <article
                  key={project.id}
                  className="featured-carousel-slide warm-feature-shell prism-edge project-shimmer"
                >
                  {hasDemoUrl && <LiveBadge />}

                  <div className="featured-carousel-copy">
                    <div className="flex items-center gap-5">
                      <p className="mono-tabular text-4xl text-accent/75 md:text-5xl">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <div className="h-px flex-1 bg-line" />
                    </div>

                    <div>
                      <h3 className="featured-carousel-title text-primary">{project.title}</h3>
                      <p className="mt-4 text-base leading-7 text-accent/85 md:text-lg">
                        {project.description}
                      </p>
                      <p className="featured-carousel-description mt-5 text-sm leading-7 text-secondary md:text-base">
                        {project.longDescription}
                      </p>
                    </div>

                    {!project.hideTags && (
                      <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-tertiary">
                        {project.tags.slice(0, 6).map((tag) => (
                          <span key={tag} className="font-mono uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="prism-edge project-shimmer grid grid-cols-3 gap-px bg-line">
                      {project.stats.map((stat) => (
                        <div key={stat.label} className="bg-background/90 px-4 py-4 backdrop-blur-sm">
                          <p className="mono-tabular text-xl text-accent md:text-2xl">
                            {stat.value}
                          </p>
                          <p className="mt-2 text-[0.68rem] leading-5 text-tertiary">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="featured-carousel-media">
                    {hasDemoUrl ? (
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring group block"
                        aria-label={`Open ${project.title} website`}
                      >
                        <ProjectPreview project={project} isContainedImage={isContainedImage} />
                      </a>
                    ) : (
                      <ProjectPreview project={project} isContainedImage={isContainedImage} />
                    )}

                    {demoUrl && (
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-highlight focus-ring mt-4 inline-flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View website
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectPreview({
  project,
  isContainedImage,
}: {
  project: Project;
  isContainedImage: boolean;
}) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-line px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-tertiary">
        <span>{project.year}</span>
      </div>
      <div className={cn("relative bg-background-soft", isContainedImage ? "aspect-[16/11]" : "aspect-[16/10]")}>
        <img
          src={project.images[0]}
          alt={`${project.title} visual preview`}
          className={cn(
            "media-muted h-full w-full transition-transform duration-500 group-hover:scale-[1.025]",
            isContainedImage ? "object-contain p-5 md:p-7" : "object-cover"
          )}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/72 to-transparent" />
      </div>
    </div>
  );
}
