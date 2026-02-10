import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronDown, ArrowDown } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      // Animate title lines
      tl.fromTo(
        titleRef.current?.querySelectorAll(".title-line") || [],
        { y: 80, opacity: 0, rotateX: -30 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      // Animate subtitle
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      // Animate CTAs
      tl.fromTo(
        ctaRef.current?.children || [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.4"
      );

      // Animate stats
      tl.fromTo(
        statsRef.current?.children || [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
        "-=0.3"
      );

      // Continuous floating animation for scroll indicator
      gsap.to(".scroll-indicator", {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToPhotography = () => {
    document.getElementById("photography")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />

      {/* Animated gradient orbs - more subtle, cinematic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[180px] opacity-30"
          style={{ background: "radial-gradient(circle, #1e3a5f 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full blur-[150px] opacity-20"
          style={{ background: "radial-gradient(circle, #0d4f4f 0%, transparent 70%)" }}
        />
      </div>

      {/* Grid pattern - more refined */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Pre-title */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm font-mono text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for collaboration
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-[100px] font-display font-bold tracking-[-0.04em] mb-8"
          style={{ perspective: "1000px" }}
        >
          <span className="title-line block overflow-hidden">
            <span className="block">Mahmoud Zaki&apos;s</span>
          </span>
          <span className="title-line block overflow-hidden">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
              Portfolio
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Building immersive digital experiences at the intersection of
          <span className="text-white/70"> code</span>,
          <span className="text-white/70"> design</span>, and
          <span className="text-white/70"> storytelling</span>.
          Exploring the world through photography and pushing the boundaries of web technology.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToPhotography}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
          >
            Explore Photography
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
          </button>
          <button
            onClick={scrollToProjects}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 font-medium transition-all duration-300 hover:bg-white/5 hover:border-white/30 text-white/80"
          >
            View Projects
          </button>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex flex-wrap items-center justify-center gap-8 mt-20 pt-10 border-t border-white/10"
        >
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-white/90">6</p>
            <p className="text-xs text-white/30 uppercase tracking-wider mt-1">Production Systems</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-white/90">3</p>
            <p className="text-xs text-white/30 uppercase tracking-wider mt-1">Industries</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-white/90">5k+</p>
            <p className="text-xs text-white/30 uppercase tracking-wider mt-1">Users Supported</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
