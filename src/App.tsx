import { useEffect, Suspense, lazy, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { PageLoader } from "./components/PageLoader";
import { useLenis } from "./hooks/useLenis";

// Lazy load heavy sections for better initial load performance
const PhotographySection = lazy(() =>
  import("./components/photography/PhotographySection").then((module) => ({
    default: module.PhotographySection,
  }))
);

const ProjectsSection = lazy(() =>
  import("./components/projects/ProjectsSection").then((module) => ({
    default: module.ProjectsSection,
  }))
);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Loading fallback for lazy-loaded sections
function SectionLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

function DeferredPhotographySection() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [shouldRender]);

  if (shouldRender) {
    return (
      <Suspense fallback={<SectionLoader />}>
        <PhotographySection />
      </Suspense>
    );
  }

  return (
    <section
      id="photography"
      ref={sentinelRef}
      className="relative min-h-screen flex items-center justify-center border-t border-white/5 bg-background"
    >
      <div className="text-center px-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">
          Photography
        </p>
        <p className="mt-3 text-sm text-white/45">
          Loading the gallery when you get closer.
        </p>
      </div>
    </section>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useLenis();

  useEffect(() => {
    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      markers: false,
    });

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Refresh ScrollTrigger after loading
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <>
      {/* Page Loader */}
      {isLoading && <PageLoader onLoadComplete={handleLoadComplete} />}

      {/* Custom Cursor */}
      <CustomCursor />

      <div className="relative min-h-screen bg-background text-foreground">
        {/* Noise texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main>
          {/* Hero Section */}
          <div id="hero">
            <Hero />
          </div>

          {/* Projects Section */}
          <Suspense fallback={<SectionLoader />}>
            <ProjectsSection />
          </Suspense>

          {/* Photography Section */}
          <DeferredPhotographySection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
