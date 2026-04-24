import { FeaturedProject } from "./FeaturedProject";
import { ProjectCard } from "./ProjectCard";
import { projects, featuredProjects, otherProjects } from "../../data/projects";

export function ProjectsSection() {
  return (
    <section id="projects" className="section-shell section-grid border-b border-line py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-8">
        <div className="grid gap-10 border-b border-line pb-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-accent">02 / Projects</p>
            <h2 className="max-w-[12ch] text-5xl font-semibold leading-[0.96] text-primary md:text-7xl">
              Systems I build. Problems I solve.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-[58ch] text-base leading-8 text-secondary">
              Selected work across AI automation, full-stack platforms,
              operational dashboards, developer tooling, and research systems.
              The common thread is practical software that has to hold up when
              people actually use it.
            </p>
            <div className="grid grid-cols-2 gap-6 border-l border-line pl-6 md:w-72">
              <div>
                <p className="mono-tabular text-3xl text-primary">{projects.length}</p>
                <p className="mt-2 text-sm text-tertiary">selected projects</p>
              </div>
              <div>
                <p className="mono-tabular text-3xl text-primary">{featuredProjects.length}</p>
                <p className="mt-2 text-sm text-tertiary">featured builds</p>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-line">
          {featuredProjects.map((project, index) => (
            <FeaturedProject key={project.id} project={project} index={index} />
          ))}
        </div>

        {otherProjects.length > 0 && (
          <div className="border-t border-line pt-20 md:pt-24">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="eyebrow mb-4 text-accent">Additional work</p>
                <h3 className="text-3xl font-semibold text-primary md:text-5xl">
                  Smaller builds, same rigor.
                </h3>
              </div>
            </div>

            <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
