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
  const preview = (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-xs uppercase text-tertiary">
        <span>{project.year}</span>
        <span className="inline-flex items-center gap-2 text-accent">
          {isNimbus ? "Nimbus website" : "Selected build"}
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
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/72 to-transparent" />
      </div>
    </div>
  );

  return (
    <article className="grid gap-10 py-16 md:py-20 lg:grid-cols-[0.48fr_0.22fr_0.9fr] lg:items-center">
      <div className="grid gap-8 md:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1fr]">
        <div className="hidden border-r border-line pr-5 md:block">
          <p className="mono-tabular text-4xl text-accent/75">
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4 text-accent">Featured project</p>
          <h3 className="text-3xl font-semibold leading-tight text-primary md:text-5xl">
            {project.title}
          </h3>
          <p className="mt-3 text-lg text-accent/85">{project.description}</p>
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
                className="action-secondary focus-ring inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Nimbus
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-line lg:grid-cols-1">
        {project.stats.map((stat) => (
          <div key={stat.label} className="bg-background px-4 py-5">
            <p className="mono-tabular text-2xl text-accent md:text-3xl">{stat.value}</p>
            <p className="mt-2 text-xs leading-5 text-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>

      {nimbusUrl ? (
        <a
          href={nimbusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring group block"
          aria-label="Open Nimbus website"
        >
          {preview}
        </a>
      ) : (
        <div>{preview}</div>
      )}
    </article>
  );
}
