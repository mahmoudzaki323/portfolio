import { useRef, useState, useEffect, memo } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Project } from "../../data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  isReversed?: boolean;
}

// Memoize to prevent unnecessary re-renders
export const ProjectCard = memo(function ProjectCard({
  project,
  index,
  isReversed = false,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "50px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16",
        isReversed && "lg:direction-rtl"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0.2,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        willChange: "opacity, transform",
      }}
    >
      {/* Image */}
      <div
        className={cn(
          "relative aspect-[4/3] rounded-2xl overflow-hidden",
          isReversed ? "lg:order-2" : "lg:order-1"
        )}
        style={{ direction: "ltr" }}
      >
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundColor: project.color }}
        />

        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.6s ease-out",
          }}
          loading="lazy"
          decoding="async"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          style={{
            opacity: isHovered ? 1 : 0.6,
            transition: "opacity 0.3s ease",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex gap-6">
            {project.stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-display font-bold text-white">{stat.value}</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-mono">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] font-mono uppercase tracking-wider">
          {project.year}
        </div>
      </div>

      {/* Content */}
      <div
        className={cn("flex flex-col", isReversed ? "lg:order-1 lg:text-right" : "lg:order-2")}
        style={{ direction: "ltr" }}
      >
        <div
          className={cn(
            "flex items-center gap-4 mb-6",
            isReversed && "lg:justify-end"
          )}
        >
          <span
            className="text-5xl font-display font-bold opacity-10"
            style={{ color: project.color }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div
            className="h-px flex-1 max-w-[100px] opacity-20"
            style={{ backgroundColor: project.color }}
          />
        </div>

        <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-tight">
          {project.title}
        </h3>

        <p className="text-white/50 leading-relaxed mb-6 max-w-lg">
          {project.longDescription}
        </p>

        <div
          className={cn(
            "flex flex-wrap gap-2 mb-8",
            isReversed && "lg:justify-end"
          )}
        >
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] rounded-full bg-white/[0.03] text-white/50 border border-white/10 font-mono uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 5 && (
            <span className="px-3 py-1 text-[10px] rounded-full bg-white/[0.03] text-white/30 font-mono">
              +{project.tags.length - 5}
            </span>
          )}
        </div>

        <div className={cn("flex gap-4", isReversed && "lg:justify-end")}>
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-white text-black hover:scale-105 transition-all duration-300 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium border border-white/15 hover:bg-white/5 transition-all duration-300 text-sm text-white/80"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {project.links.caseStudy && (
            <a
              href={project.links.caseStudy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-white/50 hover:text-white transition-colors"
            >
              Case Study
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});
