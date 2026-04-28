import { ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Project } from "../../data/projects";

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

export function FeaturedProject({ project, index }: FeaturedProjectProps) {
  const isNimbus = project.id === "nimbus";
  const nimbusUrl = isNimbus ? project.links.demo : undefined;
  const isContainedImage = project.imageFit === "contain";
  const sectionLabel = isNimbus ? "Featured project" : "Selected project";
  const previewLabel = isNimbus ? "Live website" : "Project preview";
  const preview = (
    <div
      className={cn(
        "overflow-hidden",
        isNimbus
          ? "border border-[rgba(249,115,22,0.22)] bg-[rgba(8,10,9,0.52)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
          : "glass-panel"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-3 font-mono text-xs uppercase",
          isNimbus ? "border-[rgba(249,115,22,0.18)] text-[rgba(255,218,194,0.68)]" : "border-line text-tertiary"
        )}
      >
        <span>{project.year}</span>
        <span
          className={cn(
            "inline-flex items-center gap-2",
            isNimbus ? "text-[rgba(255,219,196,0.88)]" : "text-accent"
          )}
        >
          {previewLabel}
          {isNimbus && (
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </span>
      </div>
      <div
        className={cn(
          "relative bg-background-soft",
          isContainedImage ? "aspect-[16/11]" : "aspect-[16/10]"
        )}
      >
        <img
          src={project.images[0]}
          alt={`${project.title} visual preview`}
          className={cn(
            "h-full w-full transition-transform duration-500",
            isNimbus && "group-hover:scale-[1.025]",
            isContainedImage ? "object-contain p-5 md:p-7" : "object-cover"
          )}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent",
            isNimbus ? "from-[rgba(8,10,9,0.88)]" : "from-background/72"
          )}
        />
      </div>
    </div>
  );

  return (
    <article
      className={cn(
        "relative grid gap-10 py-16 md:py-20 lg:grid-cols-[0.48fr_0.22fr_0.9fr] lg:items-center",
        isNimbus && "nimbus-feature-shell isolate my-8 px-5 py-10 md:px-6 lg:px-8"
      )}
    >
      <div className="relative z-10 grid gap-8 md:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1fr]">
        <div
          className={cn(
            "hidden border-r pr-5 md:block",
            isNimbus ? "border-[rgba(249,115,22,0.18)]" : "border-line"
          )}
        >
          <p
            className={cn(
              "mono-tabular text-4xl",
              isNimbus ? "text-[rgba(255,203,172,0.78)]" : "text-accent/75"
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>

        <div>
          <p className={cn("eyebrow mb-4", isNimbus ? "text-[#ffb37b]" : "text-accent")}>
            {sectionLabel}
          </p>
          <h3 className="text-3xl font-semibold leading-tight text-primary md:text-5xl">
            {project.title}
          </h3>
          <p
            className={cn(
              "mt-3 text-lg",
              isNimbus ? "text-[rgba(255,216,193,0.9)]" : "text-accent/85"
            )}
          >
            {project.description}
          </p>
          <p className="mt-6 max-w-[58ch] text-sm leading-7 text-secondary md:text-base">
            {project.longDescription}
          </p>

          {!project.hideTags && (
            <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2 text-xs text-tertiary">
              {project.tags.slice(0, 7).map((tag, tagIndex) => (
                <span key={tag} className="inline-flex items-center gap-3 font-mono uppercase">
                  {tagIndex > 0 && <span className="h-1 w-1 rounded-full bg-line" />}
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {nimbusUrl && (
              <a
                href={nimbusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "focus-ring inline-flex items-center gap-2 px-5 py-3 text-sm",
                  isNimbus ? "action-highlight" : "action-secondary"
                )}
              >
                <ExternalLink className="h-4 w-4" />
                View website
              </a>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 grid grid-cols-3 gap-px lg:grid-cols-1",
          isNimbus ? "bg-[rgba(249,115,22,0.12)]" : "bg-line"
        )}
      >
        {project.stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "px-4 py-5",
              isNimbus ? "bg-[rgba(8,10,9,0.76)] backdrop-blur-sm" : "bg-background"
            )}
          >
            <p
              className={cn(
                "mono-tabular text-2xl md:text-3xl",
                isNimbus ? "text-[#ffc297]" : "text-accent"
              )}
            >
              {stat.value}
            </p>
            <p className="mt-2 text-xs leading-5 text-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>

      {nimbusUrl ? (
        <a
          href={nimbusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring group relative z-10 block"
          aria-label="Open Nimbus website"
        >
          {preview}
        </a>
      ) : (
        <div className="relative z-10">{preview}</div>
      )}
    </article>
  );
}
