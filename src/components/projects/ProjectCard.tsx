import { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function getProjectLink(project: Project) {
  const href =
    project.links.research ??
    project.links.demo ??
    project.links.productHunt ??
    project.links.caseStudy ??
    project.links.github;

  if (!href) return null;

  const label = project.links.research
    ? "View research"
    : project.links.demo
      ? "View website"
      : project.links.productHunt
        ? "View Product Hunt"
        : project.links.github
          ? "View code"
          : "View case study";

  return {
    href,
    label,
    isExternal: href.startsWith("http")
  };
}

export const ProjectCard = memo(function ProjectCard({ project, index }: ProjectCardProps) {
  const projectLink = getProjectLink(project);

  return (
    <article className="prism-edge project-shimmer group bg-background/90 p-5 transition-colors duration-300 hover:bg-background-soft md:p-6">
      <div className="mb-6 flex items-center justify-between font-mono text-xs uppercase tracking-[0.12em] text-tertiary">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </div>

      <div className="prism-edge project-shimmer relative mb-6 aspect-[4/3] border border-line bg-surface">
        <img
          src={project.thumbnail}
          alt={`${project.title} preview`}
          className="media-muted h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/76 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex gap-3">
          {project.stats.slice(0, 2).map((stat) => (
            <div key={stat.label} className="min-w-0 border-l border-accent/55 pl-3">
              <p className="mono-tabular text-lg text-primary">{stat.value}</p>
              <p className="truncate text-[11px] text-tertiary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <h4 className="text-2xl font-medium leading-tight text-primary">{project.title}</h4>
      <p className="mt-2 text-sm text-accent/85">{project.description}</p>
      <p className="mt-5 text-sm leading-7 text-secondary">
        {project.longDescription}
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-tertiary">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="font-mono uppercase">
              {tag}
            </span>
          ))}
        </div>

        {projectLink && (
          <a
            href={projectLink.href}
            target={projectLink.isExternal ? "_blank" : undefined}
            rel={projectLink.isExternal ? "noopener noreferrer" : undefined}
            className="focus-ring inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-accent transition-colors duration-200 hover:text-primary"
          >
            {projectLink.label}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </div>
    </article>
  );
});
