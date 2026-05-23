"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface Gallery4Stat {
  label: string;
  value: string;
}

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href?: string | null;
  image: string;
  year?: string;
  stats?: Gallery4Stat[];
  tags?: string[];
  accent?: string;
  linkLabel?: string;
  isExternal?: boolean;
  imageFit?: "cover" | "contain";
}

export interface Gallery4Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: Gallery4Item[];
  className?: string;
}

const data: Gallery4Item[] = [
  {
    id: "shadcn-ui",
    title: "shadcn/ui: Building a modern component library",
    description:
      "A closer look at component ownership, accessible primitives, and fast customization for modern product teams.",
    href: "https://ui.shadcn.com",
    image:
      "https://images.unsplash.com/photo-1551250928-243dc937c49d?auto=format&fit=crop&q=80&w=1080"
  },
  {
    id: "tailwind",
    title: "Tailwind CSS: Utility-first interface systems",
    description:
      "How utility classes speed up interface work while preserving precise control over typography, spacing, and states.",
    href: "https://tailwindcss.com",
    image:
      "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?auto=format&fit=crop&q=80&w=1080"
  },
  {
    id: "astro",
    title: "Astro: Islands for faster content sites",
    description:
      "An overview of shipping less client JavaScript while keeping selected interactive regions rich and focused.",
    href: "https://astro.build",
    image:
      "https://images.unsplash.com/photo-1536735561749-fc87494598cb?auto=format&fit=crop&q=80&w=1080"
  }
];

const Gallery4 = ({
  eyebrow = "Other work",
  title = "More work.",
  description = "Selected builds, research systems, and product experiments that extend the featured case studies.",
  items = data,
  className
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);
    carouselApi.on("reInit", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("reInit", updateSelection);
    };
  }, [carouselApi]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={cn("gallery4-section", className)}>
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 text-accent">{eyebrow}</p>
          <h3 className="text-3xl font-medium text-primary md:text-5xl">
            {title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-secondary md:text-base">
            {description}
          </p>
        </div>

        <div className="hidden shrink-0 gap-2 md:flex">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="gallery4-arrow focus-ring disabled:pointer-events-auto"
            aria-label="Previous project"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="gallery4-arrow focus-ring disabled:pointer-events-auto"
            aria-label="Next project"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps"
        }}
      >
        <CarouselContent className="gallery4-carousel-content">
          {items.map((item, index) => {
            const card = (
              <article
                className="gallery4-card prism-edge project-shimmer warm-feature-shell"
                style={
                  {
                    "--gallery-accent": item.accent ?? "var(--color-accent)"
                  } as CSSProperties
                }
              >
                <div
                  className={cn(
                    "gallery4-card-media",
                    item.imageFit === "contain" && "gallery4-card-media-contain"
                  )}
                >
                  <img
                    src={item.image}
                    alt={`${item.title} preview`}
                    className="gallery4-card-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="gallery4-card-content">
                  <div className="gallery4-card-kicker">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.year && <span>{item.year}</span>}
                  </div>

                  <div>
                    <h4 className="gallery4-card-title">{item.title}</h4>
                    <p className="gallery4-card-description">
                      {item.description}
                    </p>
                  </div>

                  {item.stats && item.stats.length > 0 && (
                    <div className="gallery4-card-stats">
                      {item.stats.slice(0, 2).map((stat) => (
                        <div key={stat.label} className="min-w-0">
                          <p className="mono-tabular text-lg text-primary">
                            {stat.value}
                          </p>
                          <p className="truncate text-[11px] text-tertiary">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="gallery4-card-tags">
                      {item.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="gallery4-card-link">
                    {item.href ? (
                      <>
                        {item.linkLabel ?? "Read more"}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    ) : (
                      <span className="gallery4-card-link-disabled">
                        Private build
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );

            return (
              <CarouselItem
                key={item.id}
                className="gallery4-carousel-item basis-[86%] pl-4 sm:basis-[56%] lg:basis-[38%] xl:basis-[32%]"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="group block h-full focus-ring"
                  >
                    {card}
                  </a>
                ) : (
                  <div className="group h-full">{card}</div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <div className="mt-8 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={cn(
              "gallery4-dot focus-ring",
              currentSlide === index && "gallery4-dot-active"
            )}
            onClick={() => carouselApi?.scrollTo(index)}
            aria-label={`Go to project ${index + 1}`}
            aria-current={currentSlide === index ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export { Gallery4 };
