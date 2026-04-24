import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { ProjectsSection } from "./components/projects/ProjectsSection";

// The globe and photography archive pull in Three.js and the local image index.
// Keep that work out of the initial route until the section is near the viewport.
const PhotographySection = lazy(() =>
  import("./components/photography/PhotographySection").then((module) => ({
    default: module.PhotographySection,
  }))
);

function SectionLoader() {
  return (
    <section className="section-shell min-h-[70dvh] border-t border-line">
      <div className="mx-auto flex min-h-[70dvh] w-full max-w-site items-center px-5 md:px-8">
        <div className="w-full max-w-xl space-y-5">
          <div className="h-px w-24 bg-accent/70" />
          <div className="h-12 w-4/5 animate-shimmer rounded-sm bg-white/[0.07]" />
          <div className="space-y-3">
            <div className="h-3 w-full animate-shimmer rounded-sm bg-white/[0.05]" />
            <div className="h-3 w-2/3 animate-shimmer rounded-sm bg-white/[0.05]" />
          </div>
        </div>
      </div>
    </section>
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
      className="relative flex min-h-[100dvh] items-center justify-center border-t border-line bg-background"
    >
      <div className="mx-auto w-full max-w-site px-5 md:px-8">
        <div className="max-w-md space-y-5">
          <p className="eyebrow text-accent">Photography archive</p>
          <h2 className="text-4xl font-display font-semibold text-primary md:text-6xl">
            The globe loads when it matters.
          </h2>
          <p className="max-w-[48ch] text-sm leading-7 text-secondary">
            The 3D archive is deferred until you approach it, keeping the first
            screen fast while preserving the interactive travel view.
          </p>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-background text-primary">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="grain-layer" aria-hidden="true" />
      <Navigation />
      <main id="main">
        <div id="hero">
          <Hero />
        </div>
        <ProjectsSection />
        <DeferredPhotographySection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
