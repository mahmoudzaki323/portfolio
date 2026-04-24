import { memo } from "react";
import type { Project } from "../../data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = memo(function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="group bg-background p-5 transition-colors duration-300 hover:bg-background-soft md:p-6">
      <div className="mb-6 flex items-center justify-between font-mono text-xs uppercase text-tertiary">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </div>

      <div className="relative mb-6 aspect-[4/3] overflow-hidden border border-line bg-surface">
        <img
          src={project.thumbnail}
          alt={`${project.title} preview`}
          className="h-full w-full object-cover opacity-80 saturate-[0.82] transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
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

      <h4 className="text-2xl font-semibold text-primary">{project.title}</h4>
      <p className="mt-2 text-sm text-accent/85">{project.description}</p>
      <p className="mt-5 line-clamp-4 text-sm leading-7 text-secondary">
        {project.longDescription}
      </p>

      <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-xs text-tertiary">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="font-mono uppercase">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
});
