import { ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Project } from "../../data/projects";

interface FeaturedProjectProps {
  project: Project;
  index: number;
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

export function FeaturedProject({ project, index }: FeaturedProjectProps) {
  const isNimbus = project.id === "nimbus";
  const isTrueMargin = project.id === "true-margin";
  const hasWarmShell =
    isNimbus ||
    project.id === "caresecurity-qa-agent" ||
    isTrueMargin;
  const demoUrl = project.links.demo;
  const hasDemoUrl = Boolean(demoUrl);
  const isContainedImage = project.imageFit === "contain";
  const preview = (
    <div
      className="glass-panel overflow-hidden"
    >
      <div
        className="border-b border-line px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-tertiary"
      >
        <span>{project.year}</span>
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
            "media-muted h-full w-full transition-transform duration-500 group-hover:scale-[1.025]",
            isContainedImage ? "object-contain p-5 md:p-7" : "object-cover"
          )}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/72 to-transparent"
        />
      </div>
    </div>
  );

  return (
    <article
      className={cn(
        "relative grid gap-10 py-16 md:py-20 lg:grid-cols-[0.48fr_0.22fr_0.9fr] lg:items-center",
        hasWarmShell && "warm-feature-shell prism-edge project-shimmer my-8 px-5 py-10 md:px-6 lg:px-8"
      )}
    >
      {hasDemoUrl && <LiveBadge />}

      <div className="relative z-10 grid gap-8 md:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1fr]">
        <div className="hidden border-r border-line pr-5 md:block">
          <p className="mono-tabular text-4xl text-accent/75">
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>

        <div>
          <h3 className="text-4xl font-medium leading-none text-primary md:text-6xl">
            {project.title}
          </h3>
          <p className="mt-4 text-lg text-accent/85">
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
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "focus-ring inline-flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em]",
                  hasWarmShell ? "action-highlight" : "action-secondary"
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
          "prism-edge project-shimmer relative z-10 grid grid-cols-3 gap-px lg:grid-cols-1",
          "bg-line"
        )}
      >
        {project.stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "px-4 py-5",
              "bg-background/90 backdrop-blur-sm"
            )}
          >
            <p className="mono-tabular text-2xl text-accent md:text-3xl">
              <span>{stat.value}</span>
            </p>
            <p className="mt-2 text-xs leading-5 text-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>

      {demoUrl ? (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring group relative z-10 block"
          aria-label={`Open ${project.title} website`}
        >
          {preview}
        </a>
      ) : (
        <div className="relative z-10">{preview}</div>
      )}
    </article>
  );
}
