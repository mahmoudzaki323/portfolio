import { FeaturedProjectsCarousel } from "./FeaturedProjectsCarousel";
import { Gallery4, type Gallery4Item } from "../ui/gallery4";
import { featuredProjects, otherProjects } from "../../data/projects";
import type { Project } from "../../data/projects";
import { SectionPatternBackground } from "../SectionPatternBackground";

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

const otherProjectItems: Gallery4Item[] = otherProjects.map((project) => {
  const projectLink = getProjectLink(project);

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    href: projectLink?.href,
    linkLabel: projectLink?.label,
    isExternal: projectLink?.isExternal,
    image: project.thumbnail,
    imageFit: project.imageFit,
    year: project.year,
    stats: project.stats,
    tags: project.tags,
    accent: project.color
  };
});

export function ProjectsSection() {
  return (
    <section id="projects" className="section-shell relative border-b border-line bg-black py-16 md:py-32">
      <SectionPatternBackground
        patternClassName="opacity-75"
        veilClassName="bg-[radial-gradient(circle_at_78%_8%,rgba(185,155,87,0.11),transparent_26rem),linear-gradient(180deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.78)_100%)]"
      />
      <div className="relative z-10 mx-auto max-w-site px-5 md:px-8">
        <div className="border-b border-line pb-8 md:pb-12">
          <div>
            <p className="eyebrow mb-4 text-accent md:mb-5">02 / Projects</p>
            <h2 className="max-w-[13ch] text-4xl font-medium leading-[0.9] text-primary md:text-7xl">
              Projects.
            </h2>
          </div>
        </div>

        <FeaturedProjectsCarousel projects={featuredProjects} />

        {otherProjects.length > 0 && (
          <div className="border-t border-line pt-10 md:pt-12">
            <Gallery4
              eyebrow="Other work"
              title="More work."
              description="A horizontal gallery of the research systems, investor tooling, and AI product experiments that sit outside the selected case studies."
              items={otherProjectItems}
            />
          </div>
        )}
      </div>
    </section>
  );
}
