import { useRef, useEffect, useState } from "react";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectCard } from "./ProjectCard";
import { projects, featuredProjects, otherProjects } from "../../data/projects";
import { Code2, Terminal, Sparkles } from "lucide-react";

export function ProjectsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="relative bg-background">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Header */}
      <div
        ref={headerRef}
        className="relative container mx-auto px-6 pt-32 pb-20"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Code2 className="w-5 h-5 text-white/70" />
          </div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
            Projects
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
          Code &
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-300">
            Creation
          </span>
        </h2>

        <p className="text-lg text-white/40 max-w-2xl leading-relaxed">
          A collection of projects spanning distributed systems, machine learning,
          programming languages, and interactive experiences.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-white/30" />
            <div>
              <p className="text-2xl font-display font-bold">{projects.length}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white/30" />
            <div>
              <p className="text-2xl font-display font-bold">{featuredProjects.length}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Featured</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-white/30" />
            <div>
              <p className="text-2xl font-display font-bold">15+</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Technologies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="relative">
        {featuredProjects.map((project) => (
          <FeaturedProject key={project.id} project={project} />
        ))}
      </div>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <div className="relative container mx-auto px-6 py-32">
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-xl font-display font-semibold tracking-tight">More Projects</h3>
            <div className="h-px flex-1 mx-8 bg-white/10" />
          </div>

          <div className="space-y-8">
            {otherProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isReversed={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="relative container mx-auto px-6 py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-white/40 mb-6 font-mono text-sm">
            Interested in collaborating?
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            <Code2 className="w-5 h-5" />
            View All on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
