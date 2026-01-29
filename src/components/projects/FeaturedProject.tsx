import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, ArrowRight, Zap, Cpu } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Project } from "../../data/projects";

interface FeaturedProjectProps {
  project: Project;
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-20"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        contain: "layout style paint",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${project.color} 0%, transparent 60%)`,
        }}
      />

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8">
              <Zap className="w-4 h-4" style={{ color: project.color }} />
              <span className="text-xs font-mono uppercase tracking-wider">Featured Project</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight tracking-tight">
              {project.title}
            </h2>

            <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-xl">
              {project.longDescription}
            </p>

            <div className="flex gap-8 mb-10">
              {project.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span
                    className="text-3xl font-display font-bold"
                    style={{ color: project.color }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/30 font-mono uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs rounded-full bg-white/[0.03] border border-white/10 text-white/60 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105",
                  )}
                  style={{ backgroundColor: project.color, color: "#000" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live Demo
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium border border-white/15 hover:bg-white/5 transition-all duration-300 text-white/80"
                >
                  <Github className="w-4 h-4" />
                  Source
                </a>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div
              className="relative aspect-square rounded-3xl overflow-hidden group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
              }}
            >
              <div
                className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-20"
                style={{ backgroundColor: project.color }}
              />

              <div className="relative h-full rounded-3xl overflow-hidden border border-white/10">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        <Cpu className="w-5 h-5" style={{ color: project.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tech Stack</p>
                        <p className="text-xs text-white/50">{project.tags.slice(0, 3).join(" • ")}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
